// On-demand upstream image reader for explicit user actions (AI reference/copy/download).
// Gallery images themselves are displayed by direct upstream URLs, not by this Function.
const ORIGINS={
  pose:'https://ai-pose-gallery.pages.dev/',
  costume:'https://ai-costume-gallery.pages.dev/',
  anime:'https://ai-costume-anime-gallery.pages.dev/',
  portrait:'https://ai-portrait-gallery.pages.dev/'
};
const MAX_PER_MIN=20,WINDOW=60_000,USAGE=new Map();
const err=(code,message)=>new Response(JSON.stringify({error:{message}}),{status:code,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
function rate(ip){
 const now=Date.now(),v=USAGE.get(ip);
 if(USAGE.size>1000)for(const [k,x] of USAGE)if(now-x.start>WINDOW)USAGE.delete(k);
 if(!v||now-v.start>WINDOW){USAGE.set(ip,{start:now,count:1});return false}
 return ++v.count>MAX_PER_MIN;
}
function sameOrigin(req){
 const current=new URL(req.url);
 for(const h of ['origin','referer']){
  const src=req.headers.get(h);
  if(src){try{if(new URL(src).origin!==current.origin)return false}catch{return false}}
 }
 return req.headers.get('sec-fetch-site')!=='cross-site';
}
export async function onRequestGet({request}){
 const u=new URL(request.url),lib=u.searchParams.get('lib'),path=u.searchParams.get('path');
 // Simple route check for Pages and Workers builds, without requesting upstream images.
 if(!lib&&!path)return Response.json({ok:true,service:'asset',mode:'on-demand',tip:'图库显示使用原站直链；此接口仅在选择/下载时读取图片'},{headers:{'cache-control':'no-store'}});
 if(!sameOrigin(request))return err(403,'仅允许本站主动选择素材时读取原图');
 if(!Object.hasOwn(ORIGINS,lib||''))return err(400,'不支持的素材库');
 if(!path||path.length>350||path.startsWith('/')||path.includes('\\')||/\.{2}/.test(path)||
   path.split('/').some(part=>!part||part==='.'||part==='..')||
   !/^[a-zA-Z0-9_./%\-]+$/.test(path)||! /\.(?:png|jpg|jpeg|webp|avif|gif)$/i.test(path))
  return err(400,'素材文件路径无效');
 if(rate(request.headers.get('cf-connecting-ip')||'unknown'))return err(429,'图片读取太频繁，请稍后再试');
 const url=new URL(path,ORIGINS[lib]);
 if(url.origin!==new URL(ORIGINS[lib]).origin)return err(400,'素材来源不允许');
 try{
  const r=await fetch(url.toString(),{redirect:'follow'});
  if(!r.ok)return err(r.status===404?404:r.status>=500?502:424,'原素材站图片请求失败（源站 HTTP '+r.status+'）');
  const contentType=r.headers.get('content-type')||'';
  if(!/^image\//i.test(contentType))return err(502,'上游没有返回图片');
  const length=Number(r.headers.get('content-length')||0);
  if(length>15_000_000)return err(413,'图片过大');
  const body=new ReadableStream({
   async start(ctrl){
    let total=0;const reader=r.body.getReader();
    try{
     while(true){
      const {done,value}=await reader.read();if(done)break;
      total+=value.byteLength;
      if(total>15_000_000){await reader.cancel();ctrl.error(new Error('图片超过大小限制'));return}
      ctrl.enqueue(value);
     }
     ctrl.close();
    }catch(e){ctrl.error(e)}
   }
  });
  return new Response(body,{headers:{'content-type':contentType,'cache-control':'no-store','x-content-type-options':'nosniff'}});
 }catch{return err(502,'图片源暂时不可达')}
}
