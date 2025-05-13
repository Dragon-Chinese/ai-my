
/**
 * 由 Fantastic-admin 提供技术支持
 * Powered by Fantastic-admin
 * https://fantastic-admin.hurui.me
 */
    
import{d as p,u as v,r as n,o as g,c as w,g as D,b as e,t as l,p as d}from"./index-CT_znvxk.js";const M={class:"flex items-center"},S={class:"tags"},$={class:"tags-item"},x={class:"color33"},B={class:"tags-item"},I={class:"color22"},C=p({name:"ToolbarRightSide",__name:"rightSide",setup(b){const a=v();n("");const c=n(""),o=n(""),_=r=>{const t=new Date(r),i=setInterval(()=>{const s=t-new Date;if(s<=0)clearInterval(i),o.value="已过期",admin.value=!1;else{const m=Math.floor(s/864e5),u=Math.floor(s%(1e3*60*60*24)/(1e3*60*60)),f=Math.floor(s%(1e3*60*60)/(1e3*60)),h=Math.floor(s%(1e3*60)/1e3);o.value=`${m}天 ${u}小时 ${f}分钟 ${h}秒`}},1e3);return i};return g(()=>{_(a.time),c.value=a.name}),(r,t)=>(D(),w("div",M,[e("div",S,[e("div",$,[t[0]||(t[0]=e("span",null,"剩余时间：",-1)),e("span",x,l(d(o)),1)]),e("div",B,[e("span",I,l(d(c)),1)])])]))}});export{C as _};
