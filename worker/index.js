// Cloudflare Workers Builds adapter for the same endpoints used by Cloudflare Pages.
// On Workers, /functions is NOT automatically routed: explicitly call the handlers.
import {onRequestGet as getGenerate,onRequestPost as postGenerate} from '../functions/api/generate.js';
import {onRequestGet as getAsset} from '../functions/api/asset.js';

const j=(status,message)=>Response.json({error:{message}},{status,headers:{'cache-control':'no-store'}});
export default {
  async fetch(request,env,ctx) {
    const {pathname}=new URL(request.url);
    if(pathname==='/api/generate') {
      if(request.method==='GET')return getGenerate({request,env,waitUntil:ctx.waitUntil.bind(ctx)});
      if(request.method==='POST')return postGenerate({request,env,waitUntil:ctx.waitUntil.bind(ctx)});
      return j(405,'GET/POST only');
    }
    if(pathname==='/api/asset') {
      if(request.method==='GET')return getAsset({request,env,waitUntil:ctx.waitUntil.bind(ctx)});
      return j(405,'GET only');
    }
    if(pathname.startsWith('/api/'))return j(404,'Unknown API route');
    return env.ASSETS.fetch(request);
  }
};
