// Original gallery media is linked, not copied or cached during deployment.
// By default send a redirect to the author's site; on explicit user action a
// temporary same-origin read is supported for AI references / downloads.
// Never run a bulk prefetch against the source sites.
const ROOTS={
 pose:'https://ai-pose-gallery.pages.dev/',
 costume:'https://ai-costume-gallery.pages.dev/',
 anime:'https://ai-costume-anime-gallery.pages.dev/',
 portrait:'https://ai-portrait-gallery.pages.dev/'
};
const fail=(status,msg)=>new Response(msg,{status,headers:{'cache-control':'no-store'}});
export async function onRequestGet({request,params}){
 const path=Array.isArray(params.path)?params.path:String(params.path||'').split('/');
 const [lib,...parts]=path,root=ROOTS[lib];
 if(!root||!parts.length)return fail(404,'Unknown image source');
 const rel=parts.join('/');
 // Never allow a user-provided URL, traversal, or non-image resource to be fetched.
 if(rel.length>350||!rel||parts.some(s=>!s||s==='.'||s==='..'||!/^[a-zA-Z0-9._%-]+$/.test(s))
   ||! /\.(?:png|jpe?g|webp|avif|gif)$/i.test(rel))
   return fail(400,'Invalid image path');
 const target=new URL(rel,root);
 if(target.origin!==new URL(root).origin)return fail(400,'Invalid source');
 const incoming=new URL(request.url);
 if(incoming.searchParams.get('fetch')!=='1'){
  return new Response(null,{status:302,headers:{location:target.href,'cache-control':'public, max-age=300','referrer-policy':'no-referrer'}});
 }
 // This is an on-demand read initiated when a user chooses to generate/copy/download.
 // No long-term storage; upstream usage terms continue to apply.
 if(request.headers.get('sec-fetch-site')==='cross-site')return fail(403,'Same-site use only');
 try{
  const r=await fetch(target.href,{redirect:'follow',headers:{'user-agent':'PoseWear gallery image reference'}});
  if(!r.ok)return fail(r.status>=500?502:404,'Original image unavailable');
  const ct=r.headers.get('content-type')||'';
  if(!ct.toLowerCase().startsWith('image/'))return fail(502,'Upstream did not return an image');
  const len=Number(r.headers.get('content-length')||0);
  if(len>15_000_000)return fail(413,'Image too large for on-demand reference');
  return new Response(r.body,{status:200,headers:{'content-type':ct,'cache-control':'no-store','x-content-type-options':'nosniff','content-disposition':'inline'}});
 }catch{return fail(502,'Unable to load original reference image')}
}
