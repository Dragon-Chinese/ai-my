
/**
 * 由 Fantastic-admin 提供技术支持
 * Powered by Fantastic-admin
 * https://fantastic-admin.hurui.me
 */
    
import{d as u,j as f,r as d,k as x,o as p,l as m,c as _,e as a,b as n,w as v,m as w,g,n as k,h as B,t as N,p as b,q as s}from"./index-CT_znvxk.js";const h={class:"absolute left-[50%] top-[50%] flex flex-col items-center justify-between lg-flex-row -translate-x-50% -translate-y-50% lg-gap-12"},y={class:"flex flex-col gap-4"},I=u({__name:"[...all]",setup(S){const l=m(),r=f(),e=d({inter:Number.NaN,countdown:5});x(()=>{e.value.inter&&window.clearInterval(e.value.inter)}),p(()=>{e.value.inter=window.setInterval(()=>{e.value.countdown--,e.value.countdown===0&&(e.value.inter&&window.clearInterval(e.value.inter),o())},1e3)});function o(){l.push(r.settings.home.fullPath)}return(C,t)=>{const c=k,i=w;return g(),_("div",h,[a(c,{name:"404",class:"text-[300px] lg-text-[400px]"}),n("div",y,[t[0]||(t[0]=n("h1",{class:"m-0 text-6xl font-sans"}," 404 ",-1)),t[1]||(t[1]=n("div",{class:"mx-0 text-xl text-secondary-foreground/50"}," 抱歉，你访问的页面不存在 ",-1)),n("div",null,[a(i,{onClick:o},{default:v(()=>[B(N(b(e).countdown)+" 秒后，返回首页 ",1)]),_:1})])])])}}});typeof s=="function"&&s(I);export{I as default};
