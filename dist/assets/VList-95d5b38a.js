import{Y as R,s as F,V as E,ar as A,G as w,p as B,E as Y,i as v,m as Se,aa as Je,B as b,P as Xe,k as Ye,as as Qe,au as Ze,S as M,y as _,a as d,e as he,a4 as et,a2 as oe,x as te,l as tt,A as ne,av as nt,X as at,F as ce,j as de,K as ve,U as lt,aw as I,O as be,J as it,a7 as st}from"./index-31b0bcf3.js";import{m as j,b as K,d as G,V as Q,M as rt,w as ut,f as Ce,a as pe,g as ke,c as we,e as fe,h as Ae,u as ot}from"./index-64449bee.js";import{i as Ve,m as Ie,F as Pe,j as Le,y as ct,w as Be,R as dt,B as vt,u as Oe,z as ft,G as xe,l as Me,C as yt,E as ye}from"./VLayout-fc878ec6.js";const Z=Symbol.for("vuetify:list");function Fe(){const e=R(Z,{hasPrepend:F(!1),updateHasPrepend:()=>null}),i={hasPrepend:F(!1),updateHasPrepend:t=>{t&&(i.hasPrepend.value=t)}};return E(Z,i),e}function _e(){return R(Z,null)}const ae=e=>{const i={activate:t=>{let{id:n,value:l,activated:a}=t;return n=A(n),e&&!l&&a.size===1&&a.has(n)||(l?a.add(n):a.delete(n)),a},in:(t,n,l)=>{let a=new Set;for(const s of t||[])a=i.activate({id:s,value:!0,activated:new Set(a),children:n,parents:l});return a},out:t=>Array.from(t)};return i},Te=e=>{const i=ae(e);return{activate:n=>{let{activated:l,id:a,...s}=n;a=A(a);const r=l.has(a)?new Set([a]):new Set;return i.activate({...s,id:a,activated:r})},in:(n,l,a)=>{let s=new Set;return n!=null&&n.length&&(s=i.in(n.slice(0,1),l,a)),s},out:(n,l,a)=>i.out(n,l,a)}},mt=e=>{const i=ae(e);return{activate:n=>{let{id:l,activated:a,children:s,...r}=n;return l=A(l),s.has(l)?a:i.activate({id:l,activated:a,children:s,...r})},in:i.in,out:i.out}},gt=e=>{const i=Te(e);return{activate:n=>{let{id:l,activated:a,children:s,...r}=n;return l=A(l),s.has(l)?a:i.activate({id:l,activated:a,children:s,...r})},in:i.in,out:i.out}},St={open:e=>{let{id:i,value:t,opened:n,parents:l}=e;if(t){const a=new Set;a.add(i);let s=l.get(i);for(;s!=null;)a.add(s),s=l.get(s);return a}else return n.delete(i),n},select:()=>null},De={open:e=>{let{id:i,value:t,opened:n,parents:l}=e;if(t){let a=l.get(i);for(n.add(i);a!=null&&a!==i;)n.add(a),a=l.get(a);return n}else n.delete(i);return n},select:()=>null},ht={open:De.open,select:e=>{let{id:i,value:t,opened:n,parents:l}=e;if(!t)return n;const a=[];let s=l.get(i);for(;s!=null;)a.push(s),s=l.get(s);return new Set(a)}},le=e=>{const i={select:t=>{let{id:n,value:l,selected:a}=t;if(n=A(n),e&&!l){const s=Array.from(a.entries()).reduce((r,C)=>{let[y,m]=C;return m==="on"&&r.push(y),r},[]);if(s.length===1&&s[0]===n)return a}return a.set(n,l?"on":"off"),a},in:(t,n,l)=>{let a=new Map;for(const s of t||[])a=i.select({id:s,value:!0,selected:new Map(a),children:n,parents:l});return a},out:t=>{const n=[];for(const[l,a]of t.entries())a==="on"&&n.push(l);return n}};return i},je=e=>{const i=le(e);return{select:n=>{let{selected:l,id:a,...s}=n;a=A(a);const r=l.has(a)?new Map([[a,l.get(a)]]):new Map;return i.select({...s,id:a,selected:r})},in:(n,l,a)=>{let s=new Map;return n!=null&&n.length&&(s=i.in(n.slice(0,1),l,a)),s},out:(n,l,a)=>i.out(n,l,a)}},bt=e=>{const i=le(e);return{select:n=>{let{id:l,selected:a,children:s,...r}=n;return l=A(l),s.has(l)?a:i.select({id:l,selected:a,children:s,...r})},in:i.in,out:i.out}},Ct=e=>{const i=je(e);return{select:n=>{let{id:l,selected:a,children:s,...r}=n;return l=A(l),s.has(l)?a:i.select({id:l,selected:a,children:s,...r})},in:i.in,out:i.out}},pt=e=>{const i={select:t=>{let{id:n,value:l,selected:a,children:s,parents:r}=t;n=A(n);const C=new Map(a),y=[n];for(;y.length;){const S=y.shift();a.set(S,l?"on":"off"),s.has(S)&&y.push(...s.get(S))}let m=r.get(n);for(;m;){const S=s.get(m),h=S.every(o=>a.get(o)==="on"),u=S.every(o=>!a.has(o)||a.get(o)==="off");a.set(m,h?"on":u?"off":"indeterminate"),m=r.get(m)}return e&&!l&&Array.from(a.entries()).reduce((h,u)=>{let[o,c]=u;return c==="on"&&h.push(o),h},[]).length===0?C:a},in:(t,n,l)=>{let a=new Map;for(const s of t||[])a=i.select({id:s,value:!0,selected:new Map(a),children:n,parents:l});return a},out:(t,n)=>{const l=[];for(const[a,s]of t.entries())s==="on"&&!n.has(a)&&l.push(a);return l}};return i},D=Symbol.for("vuetify:nested"),Ge={id:F(),root:{register:()=>null,unregister:()=>null,parents:w(new Map),children:w(new Map),open:()=>null,openOnSelect:()=>null,activate:()=>null,select:()=>null,activatable:w(!1),selectable:w(!1),opened:w(new Set),activated:w(new Set),selected:w(new Map),selectedValues:w([])}},kt=B({activatable:Boolean,selectable:Boolean,activeStrategy:[String,Function],selectStrategy:[String,Function],openStrategy:[String,Object],opened:Array,activated:Array,selected:Array,mandatory:Boolean},"nested"),wt=e=>{let i=!1;const t=w(new Map),n=w(new Map),l=Y(e,"opened",e.opened,u=>new Set(u),u=>[...u.values()]),a=v(()=>{if(typeof e.activeStrategy=="object")return e.activeStrategy;switch(e.activeStrategy){case"leaf":return mt(e.mandatory);case"single-leaf":return gt(e.mandatory);case"independent":return ae(e.mandatory);case"single-independent":default:return Te(e.mandatory)}}),s=v(()=>{if(typeof e.selectStrategy=="object")return e.selectStrategy;switch(e.selectStrategy){case"single-leaf":return Ct(e.mandatory);case"leaf":return bt(e.mandatory);case"independent":return le(e.mandatory);case"single-independent":return je(e.mandatory);case"classic":default:return pt(e.mandatory)}}),r=v(()=>{if(typeof e.openStrategy=="object")return e.openStrategy;switch(e.openStrategy){case"list":return ht;case"single":return St;case"multiple":default:return De}}),C=Y(e,"activated",e.activated,u=>a.value.in(u,t.value,n.value),u=>a.value.out(u,t.value,n.value)),y=Y(e,"selected",e.selected,u=>s.value.in(u,t.value,n.value),u=>s.value.out(u,t.value,n.value));Se(()=>{i=!0});function m(u){const o=[];let c=u;for(;c!=null;)o.unshift(c),c=n.value.get(c);return o}const S=Je("nested"),h={id:F(),root:{opened:l,activatable:b(e,"activatable"),selectable:b(e,"selectable"),activated:C,selected:y,selectedValues:v(()=>{const u=[];for(const[o,c]of y.value.entries())c==="on"&&u.push(o);return u}),register:(u,o,c)=>{o&&u!==o&&n.value.set(u,o),c&&t.value.set(u,[]),o!=null&&t.value.set(o,[...t.value.get(o)||[],u])},unregister:u=>{if(i)return;t.value.delete(u);const o=n.value.get(u);if(o){const c=t.value.get(o)??[];t.value.set(o,c.filter(f=>f!==u))}n.value.delete(u),l.value.delete(u)},open:(u,o,c)=>{S.emit("click:open",{id:u,value:o,path:m(u),event:c});const f=r.value.open({id:u,value:o,opened:new Set(l.value),children:t.value,parents:n.value,event:c});f&&(l.value=f)},openOnSelect:(u,o,c)=>{const f=r.value.select({id:u,value:o,selected:new Map(y.value),opened:new Set(l.value),children:t.value,parents:n.value,event:c});f&&(l.value=f)},select:(u,o,c)=>{S.emit("click:select",{id:u,value:o,path:m(u),event:c});const f=s.value.select({id:u,value:o,selected:new Map(y.value),children:t.value,parents:n.value,event:c});f&&(y.value=f),h.root.openOnSelect(u,o,c)},activate:(u,o,c)=>{if(!e.activatable)return h.root.select(u,!0,c);S.emit("click:activate",{id:u,value:o,path:m(u),event:c});const f=a.value.activate({id:u,value:o,activated:new Set(C.value),children:t.value,parents:n.value,event:c});f&&(C.value=f)},children:t,parents:n}};return E(D,h),h.root},Ne=(e,i)=>{const t=R(D,Ge),n=Symbol(Xe()),l=v(()=>e.value!==void 0?e.value:n),a={...t,id:l,open:(s,r)=>t.root.open(l.value,s,r),openOnSelect:(s,r)=>t.root.openOnSelect(l.value,s,r),isOpen:v(()=>t.root.opened.value.has(l.value)),parent:v(()=>t.root.parents.value.get(l.value)),activate:(s,r)=>t.root.activate(l.value,s,r),isActivated:v(()=>t.root.activated.value.has(A(l.value))),select:(s,r)=>t.root.select(l.value,s,r),isSelected:v(()=>t.root.selected.value.get(A(l.value))==="on"),isIndeterminate:v(()=>t.root.selected.value.get(l.value)==="indeterminate"),isLeaf:v(()=>!t.root.children.value.get(l.value)),isGroupActivator:t.isGroupActivator};return!t.isGroupActivator&&t.root.register(l.value,t.id.value,i),Se(()=>{!t.isGroupActivator&&t.root.unregister(l.value)}),i&&E(D,a),a},At=()=>{const e=R(D,Ge);E(D,{...e,isGroupActivator:!0})};function Vt(){const e=F(!1);return Ye(()=>{window.requestAnimationFrame(()=>{e.value=!0})}),{ssrBootStyles:v(()=>e.value?void 0:{transition:"none !important"}),isBooted:Qe(e)}}const It=Ze({name:"VListGroupActivator",setup(e,i){let{slots:t}=i;return At(),()=>{var n;return(n=t.default)==null?void 0:n.call(t)}}}),Pt=B({activeColor:String,baseColor:String,color:String,collapseIcon:{type:M,default:"$collapse"},expandIcon:{type:M,default:"$expand"},prependIcon:M,appendIcon:M,fluid:Boolean,subgroup:Boolean,title:String,value:null,...j(),...K()},"VListGroup"),me=_()({name:"VListGroup",props:Pt(),setup(e,i){let{slots:t}=i;const{isOpen:n,open:l,id:a}=Ne(b(e,"value"),!0),s=v(()=>`v-list-group--id-${String(a.value)}`),r=_e(),{isBooted:C}=Vt();function y(u){l(!n.value,u)}const m=v(()=>({onClick:y,class:"v-list-group__header",id:s.value})),S=v(()=>n.value?e.collapseIcon:e.expandIcon),h=v(()=>({VListItem:{active:n.value,activeColor:e.activeColor,baseColor:e.baseColor,color:e.color,prependIcon:e.prependIcon||e.subgroup&&S.value,appendIcon:e.appendIcon||!e.subgroup&&S.value,title:e.title,value:e.value}}));return G(()=>d(e.tag,{class:["v-list-group",{"v-list-group--prepend":r==null?void 0:r.hasPrepend.value,"v-list-group--fluid":e.fluid,"v-list-group--subgroup":e.subgroup,"v-list-group--open":n.value},e.class],style:e.style},{default:()=>[t.activator&&d(Q,{defaults:h.value},{default:()=>[d(It,null,{default:()=>[t.activator({props:m.value,isOpen:n.value})]})]}),d(rt,{transition:{component:ut},disabled:!C.value},{default:()=>{var u;return[he(d("div",{class:"v-list-group__items",role:"group","aria-labelledby":s.value},[(u=t.default)==null?void 0:u.call(t)]),[[et,n.value]])]}})]})),{isOpen:n}}});const Lt=Ve("v-list-item-subtitle"),Bt=Ve("v-list-item-title"),Ot=B({active:{type:Boolean,default:void 0},activeClass:String,activeColor:String,appendAvatar:String,appendIcon:M,baseColor:String,disabled:Boolean,lines:String,link:{type:Boolean,default:void 0},nav:Boolean,prependAvatar:String,prependIcon:M,ripple:{type:[Boolean,Object],default:!0},slim:Boolean,subtitle:[String,Number],title:[String,Number],value:null,onClick:oe(),onClickOnce:oe(),...Ie(),...j(),...Ce(),...Pe(),...Le(),...pe(),...ct(),...K(),...te(),...Be({variant:"text"})},"VListItem"),ge=_()({name:"VListItem",directives:{Ripple:dt},props:Ot(),emits:{click:e=>!0},setup(e,i){let{attrs:t,slots:n,emit:l}=i;const a=vt(e,t),s=v(()=>e.value===void 0?a.href.value:e.value),{activate:r,isActivated:C,select:y,isSelected:m,isIndeterminate:S,isGroupActivator:h,root:u,parent:o,openOnSelect:c}=Ne(s,!1),f=_e(),P=v(()=>{var g;return e.active!==!1&&(e.active||((g=a.isActive)==null?void 0:g.value)||(u.activatable.value?C.value:m.value))}),T=v(()=>e.link!==!1&&a.isLink.value),V=v(()=>!e.disabled&&e.link!==!1&&(e.link||a.isClickable.value||!!f&&(u.selectable.value||u.activatable.value||e.value!=null))),O=v(()=>e.rounded||e.nav),x=v(()=>e.color??e.activeColor),U=v(()=>({color:P.value?x.value??e.baseColor:e.baseColor,variant:e.variant}));tt(()=>{var g;return(g=a.isActive)==null?void 0:g.value},g=>{g&&o.value!=null&&u.open(o.value,!0),g&&c(g)},{immediate:!0});const{themeClasses:H}=ne(e),{borderClasses:W}=Oe(e),{colorClasses:z,colorStyles:q,variantClasses:L}=ft(U),{densityClasses:p}=ke(e),{dimensionStyles:N}=xe(e),{elevationClasses:Ke}=Me(e),{roundedClasses:Ue}=we(O),He=v(()=>e.lines?`v-list-item--${e.lines}-line`:void 0),J=v(()=>({isActive:P.value,select:y,isSelected:m.value,isIndeterminate:S.value}));function ie(g){var $;l("click",g),!(h||!V.value)&&(($=a.navigate)==null||$.call(a,g),u.activatable.value?r(!C.value,g):(u.selectable.value||e.value!=null)&&y(!m.value,g))}function We(g){(g.key==="Enter"||g.key===" ")&&(g.preventDefault(),ie(g))}return G(()=>{const g=T.value?"a":e.tag,$=n.title||e.title!=null,ze=n.subtitle||e.subtitle!=null,se=!!(e.appendAvatar||e.appendIcon),qe=!!(se||n.append),re=!!(e.prependAvatar||e.prependIcon),X=!!(re||n.prepend);return f==null||f.updateHasPrepend(X),e.activeColor&&nt("active-color",["color","base-color"]),he(d(g,{class:["v-list-item",{"v-list-item--active":P.value,"v-list-item--disabled":e.disabled,"v-list-item--link":V.value,"v-list-item--nav":e.nav,"v-list-item--prepend":!X&&(f==null?void 0:f.hasPrepend.value),"v-list-item--slim":e.slim,[`${e.activeClass}`]:e.activeClass&&P.value},H.value,W.value,z.value,p.value,Ke.value,He.value,Ue.value,L.value,e.class],style:[q.value,N.value,e.style],href:a.href.value,tabindex:V.value?f?-2:0:void 0,onClick:ie,onKeydown:V.value&&!T.value&&We},{default:()=>{var ue;return[yt(V.value||P.value,"v-list-item"),X&&d("div",{key:"prepend",class:"v-list-item__prepend"},[n.prepend?d(Q,{key:"prepend-defaults",disabled:!re,defaults:{VAvatar:{density:e.density,image:e.prependAvatar},VIcon:{density:e.density,icon:e.prependIcon},VListItemAction:{start:!0}}},{default:()=>{var k;return[(k=n.prepend)==null?void 0:k.call(n,J.value)]}}):d(ce,null,[e.prependAvatar&&d(ye,{key:"prepend-avatar",density:e.density,image:e.prependAvatar},null),e.prependIcon&&d(fe,{key:"prepend-icon",density:e.density,icon:e.prependIcon},null)]),d("div",{class:"v-list-item__spacer"},null)]),d("div",{class:"v-list-item__content","data-no-activator":""},[$&&d(Bt,{key:"title"},{default:()=>{var k;return[((k=n.title)==null?void 0:k.call(n,{title:e.title}))??e.title]}}),ze&&d(Lt,{key:"subtitle"},{default:()=>{var k;return[((k=n.subtitle)==null?void 0:k.call(n,{subtitle:e.subtitle}))??e.subtitle]}}),(ue=n.default)==null?void 0:ue.call(n,J.value)]),qe&&d("div",{key:"append",class:"v-list-item__append"},[n.append?d(Q,{key:"append-defaults",disabled:!se,defaults:{VAvatar:{density:e.density,image:e.appendAvatar},VIcon:{density:e.density,icon:e.appendIcon},VListItemAction:{end:!0}}},{default:()=>{var k;return[(k=n.append)==null?void 0:k.call(n,J.value)]}}):d(ce,null,[e.appendIcon&&d(fe,{key:"append-icon",density:e.density,icon:e.appendIcon},null),e.appendAvatar&&d(ye,{key:"append-avatar",density:e.density,image:e.appendAvatar},null)]),d("div",{class:"v-list-item__spacer"},null)])]}}),[[at("ripple"),V.value&&e.ripple]])}),{isGroupActivator:h,isSelected:m,list:f,select:y}}}),xt=B({color:String,inset:Boolean,sticky:Boolean,title:String,...j(),...K()},"VListSubheader"),Mt=_()({name:"VListSubheader",props:xt(),setup(e,i){let{slots:t}=i;const{textColorClasses:n,textColorStyles:l}=Ae(b(e,"color"));return G(()=>{const a=!!(t.default||e.title);return d(e.tag,{class:["v-list-subheader",{"v-list-subheader--inset":e.inset,"v-list-subheader--sticky":e.sticky},n.value,e.class],style:[{textColorStyles:l},e.style]},{default:()=>{var s;return[a&&d("div",{class:"v-list-subheader__text"},[((s=t.default)==null?void 0:s.call(t))??e.title])]}})}),{}}});const Ft=B({color:String,inset:Boolean,length:[Number,String],thickness:[Number,String],vertical:Boolean,...j(),...te()},"VDivider"),_t=_()({name:"VDivider",props:Ft(),setup(e,i){let{attrs:t}=i;const{themeClasses:n}=ne(e),{textColorClasses:l,textColorStyles:a}=Ae(b(e,"color")),s=v(()=>{const r={};return e.length&&(r[e.vertical?"maxHeight":"maxWidth"]=de(e.length)),e.thickness&&(r[e.vertical?"borderRightWidth":"borderTopWidth"]=de(e.thickness)),r});return G(()=>d("hr",{class:[{"v-divider":!0,"v-divider--inset":e.inset,"v-divider--vertical":e.vertical},n.value,l.value,e.class],style:[s.value,a.value,e.style],"aria-orientation":!t.role||t.role==="separator"?e.vertical?"vertical":"horizontal":void 0,role:`${t.role||"separator"}`},null)),{}}}),Tt=B({items:Array,returnObject:Boolean},"VListChildren"),$e=_()({name:"VListChildren",props:Tt(),setup(e,i){let{slots:t}=i;return Fe(),()=>{var n,l;return((n=t.default)==null?void 0:n.call(t))??((l=e.items)==null?void 0:l.map(a=>{var h,u;let{children:s,props:r,type:C,raw:y}=a;if(C==="divider")return((h=t.divider)==null?void 0:h.call(t,{props:r}))??d(_t,r,null);if(C==="subheader")return((u=t.subheader)==null?void 0:u.call(t,{props:r}))??d(Mt,r,null);const m={subtitle:t.subtitle?o=>{var c;return(c=t.subtitle)==null?void 0:c.call(t,{...o,item:y})}:void 0,prepend:t.prepend?o=>{var c;return(c=t.prepend)==null?void 0:c.call(t,{...o,item:y})}:void 0,append:t.append?o=>{var c;return(c=t.append)==null?void 0:c.call(t,{...o,item:y})}:void 0,title:t.title?o=>{var c;return(c=t.title)==null?void 0:c.call(t,{...o,item:y})}:void 0},S=me.filterProps(r);return s?d(me,ve({value:r==null?void 0:r.value},S),{activator:o=>{let{props:c}=o;const f={...r,...c,value:e.returnObject?y:r.value};return t.header?t.header({props:f}):d(ge,f,m)},default:()=>d($e,{items:s},t)}):t.item?t.item({props:r}):d(ge,ve(r,{value:e.returnObject?y:r.value}),m)}))}}}),Dt=B({items:{type:Array,default:()=>[]},itemTitle:{type:[String,Array,Function],default:"title"},itemValue:{type:[String,Array,Function],default:"value"},itemChildren:{type:[Boolean,String,Array,Function],default:"children"},itemProps:{type:[Boolean,String,Array,Function],default:"props"},returnObject:Boolean,valueComparator:{type:Function,default:lt}},"list-items");function ee(e,i){const t=I(i,e.itemTitle,i),n=I(i,e.itemValue,t),l=I(i,e.itemChildren),a=e.itemProps===!0?typeof i=="object"&&i!=null&&!Array.isArray(i)?"children"in i?be(i,["children"]):i:void 0:I(i,e.itemProps),s={title:t,value:n,...a};return{title:String(s.title??""),value:s.value,props:s,children:Array.isArray(l)?Re(e,l):void 0,raw:i}}function Re(e,i){const t=[];for(const n of i)t.push(ee(e,n));return t}function Ut(e){const i=v(()=>Re(e,e.items)),t=v(()=>i.value.some(a=>a.value===null));function n(a){return t.value||(a=a.filter(s=>s!==null)),a.map(s=>e.returnObject&&typeof s=="string"?ee(e,s):i.value.find(r=>e.valueComparator(s,r.value))||ee(e,s))}function l(a){return e.returnObject?a.map(s=>{let{raw:r}=s;return r}):a.map(s=>{let{value:r}=s;return r})}return{items:i,transformIn:n,transformOut:l}}function jt(e){return typeof e=="string"||typeof e=="number"||typeof e=="boolean"}function Gt(e,i){const t=I(i,e.itemType,"item"),n=jt(i)?i:I(i,e.itemTitle),l=I(i,e.itemValue,void 0),a=I(i,e.itemChildren),s=e.itemProps===!0?be(i,["children"]):I(i,e.itemProps),r={title:n,value:l,...s};return{type:t,title:r.title,value:r.value,props:r,children:t==="item"&&a?Ee(e,a):void 0,raw:i}}function Ee(e,i){const t=[];for(const n of i)t.push(Gt(e,n));return t}function Nt(e){return{items:v(()=>Ee(e,e.items))}}const $t=B({baseColor:String,activeColor:String,activeClass:String,bgColor:String,disabled:Boolean,expandIcon:String,collapseIcon:String,lines:{type:[Boolean,String],default:"one"},slim:Boolean,nav:Boolean,...kt({selectStrategy:"single-leaf",openStrategy:"list"}),...Ie(),...j(),...Ce(),...Pe(),...Le(),itemType:{type:String,default:"type"},...Dt(),...pe(),...K(),...te(),...Be({variant:"text"})},"VList"),Ht=_()({name:"VList",props:$t(),emits:{"update:selected":e=>!0,"update:activated":e=>!0,"update:opened":e=>!0,"click:open":e=>!0,"click:activate":e=>!0,"click:select":e=>!0},setup(e,i){let{slots:t}=i;const{items:n}=Nt(e),{themeClasses:l}=ne(e),{backgroundColorClasses:a,backgroundColorStyles:s}=ot(b(e,"bgColor")),{borderClasses:r}=Oe(e),{densityClasses:C}=ke(e),{dimensionStyles:y}=xe(e),{elevationClasses:m}=Me(e),{roundedClasses:S}=we(e),{children:h,open:u,parents:o,select:c}=wt(e),f=v(()=>e.lines?`v-list--${e.lines}-line`:void 0),P=b(e,"activeColor"),T=b(e,"baseColor"),V=b(e,"color");Fe(),it({VListGroup:{activeColor:P,baseColor:T,color:V,expandIcon:b(e,"expandIcon"),collapseIcon:b(e,"collapseIcon")},VListItem:{activeClass:b(e,"activeClass"),activeColor:P,baseColor:T,color:V,density:b(e,"density"),disabled:b(e,"disabled"),lines:b(e,"lines"),nav:b(e,"nav"),slim:b(e,"slim"),variant:b(e,"variant")}});const O=F(!1),x=w();function U(p){O.value=!0}function H(p){O.value=!1}function W(p){var N;!O.value&&!(p.relatedTarget&&((N=x.value)!=null&&N.contains(p.relatedTarget)))&&L()}function z(p){if(x.value){if(p.key==="ArrowDown")L("next");else if(p.key==="ArrowUp")L("prev");else if(p.key==="Home")L("first");else if(p.key==="End")L("last");else return;p.preventDefault()}}function q(p){O.value=!0}function L(p){if(x.value)return st(x.value,p)}return G(()=>d(e.tag,{ref:x,class:["v-list",{"v-list--disabled":e.disabled,"v-list--nav":e.nav,"v-list--slim":e.slim},l.value,a.value,r.value,C.value,m.value,f.value,S.value,e.class],style:[s.value,y.value,e.style],tabindex:e.disabled||O.value?-1:0,role:"listbox","aria-activedescendant":void 0,onFocusin:U,onFocusout:H,onFocus:W,onKeydown:z,onMousedown:q},{default:()=>[d($e,{items:n.value,returnObject:e.returnObject},t)]})),{open:u,select:c,focus:L,children:h,parents:o}}});export{Ht as V,Bt as a,ge as b,Lt as c,Ut as d,Dt as m,Vt as u};
