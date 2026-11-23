// Cloudflare Pages Functions：仅使用本账户 Workers AI Binding。
const MODEL='@cf/black-forest-labs/flux-2-klein-4b';
const RL=new Map(),WINDOW=60_000,MAX=4;
const JSON_HEADERS={'content-type':'application/json; charset=utf-8','cache-control':'no-store'};
const fail=(status,message)=>new Response(JSON.stringify({error:{message}}),{status,headers:JSON_HEADERS});
function sameSite(req){
 const url=new URL(req.url),origin=req.headers.get('origin'),ref=req.headers.get('referer');
 if(origin){try{return new URL(origin).origin===url.origin}catch{return false}}
 if(ref){try{return new URL(ref).origin===url.origin}catch{return false}}
 return req.headers.get('sec-fetch-site')==='same-origin';
}
function limit(ip){
 const now=Date.now();
 if(RL.size>1000)for(const [k,v] of RL)if(now-v.time>WINDOW)RL.delete(k);
 const rec=RL.get(ip);
 if(!rec||now-rec.time>WINDOW){RL.set(ip,{time:now,n:1});return false}
 rec.n++;return rec.n>MAX;
}
export async function onRequestGet({env}){
 return Response.json({ok:!!(env.AI&&typeof env.AI.run==='function'),model:MODEL},{
  status:env.AI?200:503,headers:{'cache-control':'no-store'}});
}
export async function onRequestPost({request,env}){
 if(!sameSite(request))return fail(403,'仅允许本站页面调用生成接口');
 if(!env.AI||typeof env.AI.run!=='function')return fail(503,'请先在 Cloudflare Pages 项目中配置名为 AI 的 Workers AI Binding，然后重新部署');
 if(limit(request.headers.get('cf-connecting-ip')||'unknown'))return fail(429,'当前访问过于频繁，请稍后再试');
 let incoming;
 try{incoming=await request.formData()}catch{return fail(400,'请求格式错误，应为 multipart/form-data')}
 const prompt=incoming.get('prompt');
 if(typeof prompt!=='string'||!prompt.trim()||prompt.length>12000)return fail(400,'提示词不能为空且不得超过 12000 字符');
 const width=Number(incoming.get('width')),height=Number(incoming.get('height'));
 if(!Number.isInteger(width)||!Number.isInteger(height)||width<256||height<256||width>1920||height>1920||width%16||height%16)
  return fail(400,'图像尺寸应为 256–1920 之间的 16 倍数');
 const fd=new FormData();fd.append('prompt',prompt);fd.append('width',String(width));fd.append('height',String(height));
 for(let i=0;i<4;i++){
  const b=incoming.get('image_'+i);
  if(b===null)continue;
  if(!(b instanceof File)||!['image/jpeg','image/png','image/webp'].includes(b.type)||b.size>2_000_000)
   return fail(400,'第 '+(i+1)+' 张参考图格式不支持或超过 2 MB');
  fd.append('input_image_'+i,b,'reference-'+i+'.jpg');
 }
 const extra=[...incoming.keys()].some(k=>/^image_\d+$/.test(k)&&Number(k.slice(6))>=4);
 if(extra)return fail(400,'最多允许 4 张参考图');
 try{
  const payload=new Response(fd);
  const result=await env.AI.run(MODEL,{multipart:{body:payload.body,contentType:payload.headers.get('content-type')}});
  if(!result||typeof result.image!=='string'||!result.image)return fail(502,'Cloudflare AI 未返回图像数据');
  return new Response(JSON.stringify({image:result.image}),{headers:JSON_HEADERS});
 }catch(e){
  // 不泄露内部调用凭据或堆栈，保留 Cloudflare 的限额/模型错误供排查。
  const msg=String(e?.message||e||'未知错误').slice(0,400);
  const quota=/quota|limit|exceeded|neurons|rate/i.test(msg);
  return fail(quota?429:502,quota?'Cloudflare 免费额度或模型请求限制已达到：'+msg:'Cloudflare 图像生成失败：'+msg);
 }
}
