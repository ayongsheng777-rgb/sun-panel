import{y as _e,bv as Mr,w as Be,b as Yn,ax as Zo,r as N,z as $,aj as Le,ad as Ye,f as me,u as Br,F as lt,bR as Xo,bS as Qo,L as fe,aA as zn,aT as zt,g,Q as ei,V as Mn,R as Ot,bb as ti,bT as ir,l as ni,m as M,p as A,n as G,q as De,A as Re,bU as ri,bV as oi,C as ae,D as Qe,S as wt,ap as mt,T as Jn,K as q,ak as Me,J as _r,am as Dt,bW as ii,b0 as at,I as Ne,aZ as Or,aH as $r,H as yt,bX as ai,E as ar,a_ as li,t as Vt,ah as Q,aV as Nr,s as Lr,aY as Dr,bY as si,G as Bn,bZ as ci,aq as Vr,b_ as di,b$ as ui,c0 as fi,ab as on,e as _n,c as lr,v as hi,x as gi,c1 as vi,b8 as On,c2 as bi,O as pi,af as mi,b1 as yi,ag as sr,ae as wi,c3 as xi,c4 as jr,aK as cr,c5 as Ci,c6 as ki,aa as dr}from"./index-4dc7a2ab.js";import{c as Wr,a as Zt,k as Si,b as Zn,l as Xn,m as Ri,N as Pi,u as $t,h as Fi,d as $n,V as Ti,e as Ei,g as Ai,f as mn,n as qr,i as Pt}from"./index-0c1a3d2f.js";function Qt(e,t){let{target:n}=e;for(;n;){if(n.dataset&&n.dataset[t]!==void 0)return!0;n=n.parentElement}return!1}function ur(e){switch(typeof e){case"string":return e||void 0;case"number":return String(e);default:return}}function yn(e){const t=e.filter(n=>n!==void 0);if(t.length!==0)return t.length===1?t[0]:n=>{e.forEach(r=>{r&&r(n)})}}function Ii(e,t,n){var r;const o=_e(e,null);if(o===null)return;const i=(r=Mr())===null||r===void 0?void 0:r.proxy;Be(n,a),a(n.value),Yn(()=>{a(void 0,n.value)});function a(d,c){if(!o)return;const f=o[t];c!==void 0&&l(f,c),d!==void 0&&s(f,d)}function l(d,c){d[c]||(d[c]=[]),d[c].splice(d[c].findIndex(f=>f===i),1)}function s(d,c){d[c]||(d[c]=[]),~d[c].findIndex(f=>f===i)||d[c].push(i)}}let fr=!1;function ys(){if(Zo&&window.CSS&&!fr&&(fr=!0,"registerProperty"in(window==null?void 0:window.CSS)))try{CSS.registerProperty({name:"--n-color-start",syntax:"<color>",inherits:!1,initialValue:"#0000"}),CSS.registerProperty({name:"--n-color-end",syntax:"<color>",inherits:!1,initialValue:"#0000"})}catch{}}function hr(e){return e&-e}class Kr{constructor(t,n){this.l=t,this.min=n;const r=new Array(t+1);for(let o=0;o<t+1;++o)r[o]=0;this.ft=r}add(t,n){if(n===0)return;const{l:r,ft:o}=this;for(t+=1;t<=r;)o[t]+=n,t+=hr(t)}get(t){return this.sum(t+1)-this.sum(t)}sum(t){if(t===void 0&&(t=this.l),t<=0)return 0;const{ft:n,min:r,l:o}=this;if(t>o)throw new Error("[FinweckTree.sum]: `i` is larger than length.");let i=t*r;for(;t>0;)i+=n[t],t-=hr(t);return i}getBound(t){let n=0,r=this.l;for(;r>n;){const o=Math.floor((n+r)/2),i=this.sum(o);if(i>t){r=o;continue}else if(i<t){if(n===o)return this.sum(n+1)<=t?n+1:o;n=o}else return o}return n}}let Ut;function zi(){return typeof document>"u"?!1:(Ut===void 0&&("matchMedia"in window?Ut=window.matchMedia("(pointer:coarse)").matches:Ut=!1),Ut)}let wn;function gr(){return typeof document>"u"?1:(wn===void 0&&(wn="chrome"in window?window.devicePixelRatio:1),wn)}const Ur="VVirtualListXScroll";function Mi({columnsRef:e,renderColRef:t,renderItemWithColsRef:n}){const r=N(0),o=N(0),i=$(()=>{const d=e.value;if(d.length===0)return null;const c=new Kr(d.length,0);return d.forEach((f,v)=>{c.add(v,f.width)}),c}),a=Le(()=>{const d=i.value;return d!==null?Math.max(d.getBound(o.value)-1,0):0}),l=d=>{const c=i.value;return c!==null?c.sum(d):0},s=Le(()=>{const d=i.value;return d!==null?Math.min(d.getBound(o.value+r.value)+1,e.value.length-1):0});return Ye(Ur,{startIndexRef:a,endIndexRef:s,columnsRef:e,renderColRef:t,renderItemWithColsRef:n,getLeft:l}),{listWidthRef:r,scrollLeftRef:o}}const vr=me({name:"VirtualListRow",props:{index:{type:Number,required:!0},item:{type:Object,required:!0}},setup(){const{startIndexRef:e,endIndexRef:t,columnsRef:n,getLeft:r,renderColRef:o,renderItemWithColsRef:i}=_e(Ur);return{startIndex:e,endIndex:t,columns:n,renderCol:o,renderItemWithCols:i,getLeft:r}},render(){const{startIndex:e,endIndex:t,columns:n,renderCol:r,renderItemWithCols:o,getLeft:i,item:a}=this;if(o!=null)return o({itemIndex:this.index,startColIndex:e,endColIndex:t,allColumns:n,item:a,getLeft:i});if(r!=null){const l=[];for(let s=e;s<=t;++s){const d=n[s];l.push(r({column:d,left:i(s),item:a}))}return l}return null}}),Bi=Zt(".v-vl",{maxHeight:"inherit",height:"100%",overflow:"auto",minWidth:"1px"},[Zt("&:not(.v-vl--show-scrollbar)",{scrollbarWidth:"none"},[Zt("&::-webkit-scrollbar, &::-webkit-scrollbar-track-piece, &::-webkit-scrollbar-thumb",{width:0,height:0,display:"none"})])]),_i=me({name:"VirtualList",inheritAttrs:!1,props:{showScrollbar:{type:Boolean,default:!0},columns:{type:Array,default:()=>[]},renderCol:Function,renderItemWithCols:Function,items:{type:Array,default:()=>[]},itemSize:{type:Number,required:!0},itemResizable:Boolean,itemsStyle:[String,Object],visibleItemsTag:{type:[String,Object],default:"div"},visibleItemsProps:Object,ignoreItemResize:Boolean,onScroll:Function,onWheel:Function,onResize:Function,defaultScrollKey:[Number,String],defaultScrollIndex:Number,keyField:{type:String,default:"key"},paddingTop:{type:[Number,String],default:0},paddingBottom:{type:[Number,String],default:0}},setup(e){const t=Br();Bi.mount({id:"vueuc/virtual-list",head:!0,anchorMetaName:Wr,ssr:t}),lt(()=>{const{defaultScrollIndex:P,defaultScrollKey:E}=e;P!=null?F({index:P}):E!=null&&F({key:E})});let n=!1,r=!1;Xo(()=>{if(n=!1,!r){r=!0;return}F({top:y.value,left:a.value})}),Qo(()=>{n=!0,r||(r=!0)});const o=Le(()=>{if(e.renderCol==null&&e.renderItemWithCols==null||e.columns.length===0)return;let P=0;return e.columns.forEach(E=>{P+=E.width}),P}),i=$(()=>{const P=new Map,{keyField:E}=e;return e.items.forEach((j,K)=>{P.set(j[E],K)}),P}),{scrollLeftRef:a,listWidthRef:l}=Mi({columnsRef:fe(e,"columns"),renderColRef:fe(e,"renderCol"),renderItemWithColsRef:fe(e,"renderItemWithCols")}),s=N(null),d=N(void 0),c=new Map,f=$(()=>{const{items:P,itemSize:E,keyField:j}=e,K=new Kr(P.length,E);return P.forEach((Z,U)=>{const ee=Z[j],X=c.get(ee);X!==void 0&&K.add(U,X)}),K}),v=N(0),y=N(0),u=Le(()=>Math.max(f.value.getBound(y.value-zn(e.paddingTop))-1,0)),p=$(()=>{const{value:P}=d;if(P===void 0)return[];const{items:E,itemSize:j}=e,K=u.value,Z=Math.min(K+Math.ceil(P/j+1),E.length-1),U=[];for(let ee=K;ee<=Z;++ee)U.push(E[ee]);return U}),F=(P,E)=>{if(typeof P=="number"){m(P,E,"auto");return}const{left:j,top:K,index:Z,key:U,position:ee,behavior:X,debounce:de=!0}=P;if(j!==void 0||K!==void 0)m(j,K,X);else if(Z!==void 0)w(Z,X,de);else if(U!==void 0){const T=i.value.get(U);T!==void 0&&w(T,X,de)}else ee==="bottom"?m(0,Number.MAX_SAFE_INTEGER,X):ee==="top"&&m(0,0,X)};let b,C=null;function w(P,E,j){const K=s.value;if(K==null)return;const{value:Z}=f,U=Z.sum(P)+zn(e.paddingTop);if(!j)K.scrollTo({left:0,top:U,behavior:E});else{b=P,C!==null&&window.clearTimeout(C),C=window.setTimeout(()=>{b=void 0,C=null},16);const{scrollTop:ee,offsetHeight:X}=K;if(U>ee){const de=Z.get(P);U+de<=ee+X||K.scrollTo({left:0,top:U+de-X,behavior:E})}else K.scrollTo({left:0,top:U,behavior:E})}}function m(P,E,j){const K=s.value;K!=null&&K.scrollTo({left:P,top:E,behavior:j})}function k(P,E){var j,K,Z;if(n||e.ignoreItemResize||Y(E.target))return;const{value:U}=f,ee=i.value.get(P),X=U.get(ee),de=(Z=(K=(j=E.borderBoxSize)===null||j===void 0?void 0:j[0])===null||K===void 0?void 0:K.blockSize)!==null&&Z!==void 0?Z:E.contentRect.height;if(de===X)return;de-e.itemSize===0?c.delete(P):c.set(P,de-e.itemSize);const _=de-X;if(_===0)return;U.add(ee,_);const H=s.value;if(H!=null){if(b===void 0){const he=U.sum(ee);H.scrollTop>he&&H.scrollBy(0,_)}else if(ee<b)H.scrollBy(0,_);else if(ee===b){const he=U.sum(ee);de+he>H.scrollTop+H.offsetHeight&&H.scrollBy(0,_)}ne()}v.value++}const S=!zi();let z=!1;function B(P){var E;(E=e.onScroll)===null||E===void 0||E.call(e,P),(!S||!z)&&ne()}function D(P){var E;if((E=e.onWheel)===null||E===void 0||E.call(e,P),S){const j=s.value;if(j!=null){if(P.deltaX===0&&(j.scrollTop===0&&P.deltaY<=0||j.scrollTop+j.offsetHeight>=j.scrollHeight&&P.deltaY>=0))return;P.preventDefault(),j.scrollTop+=P.deltaY/gr(),j.scrollLeft+=P.deltaX/gr(),ne(),z=!0,Si(()=>{z=!1})}}}function L(P){if(n||Y(P.target))return;if(e.renderCol==null&&e.renderItemWithCols==null){if(P.contentRect.height===d.value)return}else if(P.contentRect.height===d.value&&P.contentRect.width===l.value)return;d.value=P.contentRect.height,l.value=P.contentRect.width;const{onResize:E}=e;E!==void 0&&E(P)}function ne(){const{value:P}=s;P!=null&&(y.value=P.scrollTop,a.value=P.scrollLeft)}function Y(P){let E=P;for(;E!==null;){if(E.style.display==="none")return!0;E=E.parentElement}return!1}return{listHeight:d,listStyle:{overflow:"auto"},keyToIndex:i,itemsStyle:$(()=>{const{itemResizable:P}=e,E=zt(f.value.sum());return v.value,[e.itemsStyle,{boxSizing:"content-box",width:zt(o.value),height:P?"":E,minHeight:P?E:"",paddingTop:zt(e.paddingTop),paddingBottom:zt(e.paddingBottom)}]}),visibleItemsStyle:$(()=>(v.value,{transform:`translateY(${zt(f.value.sum(u.value))})`})),viewportItems:p,listElRef:s,itemsElRef:N(null),scrollTo:F,handleListResize:L,handleListScroll:B,handleListWheel:D,handleItemResize:k}},render(){const{itemResizable:e,keyField:t,keyToIndex:n,visibleItemsTag:r}=this;return g(Mn,{onResize:this.handleListResize},{default:()=>{var o,i;return g("div",ei(this.$attrs,{class:["v-vl",this.showScrollbar&&"v-vl--show-scrollbar"],onScroll:this.handleListScroll,onWheel:this.handleListWheel,ref:"listElRef"}),[this.items.length!==0?g("div",{ref:"itemsElRef",class:"v-vl-items",style:this.itemsStyle},[g(r,Object.assign({class:"v-vl-visible-items",style:this.visibleItemsStyle},this.visibleItemsProps),{default:()=>{const{renderCol:a,renderItemWithCols:l}=this;return this.viewportItems.map(s=>{const d=s[t],c=n.get(d),f=a!=null?g(vr,{index:c,item:s}):void 0,v=l!=null?g(vr,{index:c,item:s}):void 0,y=this.$slots.default({item:s,renderedCols:f,renderedItemWithCols:v,index:c})[0];return e?g(Mn,{key:d,onResize:u=>this.handleItemResize(d,u)},{default:()=>y}):(y.key=d,y)})}})]):(i=(o=this.$slots).empty)===null||i===void 0?void 0:i.call(o)])}})}}),Ge="v-hidden",Oi=Zt("[v-hidden]",{display:"none!important"}),br=me({name:"Overflow",props:{getCounter:Function,getTail:Function,updateCounter:Function,onUpdateCount:Function,onUpdateOverflow:Function},setup(e,{slots:t}){const n=N(null),r=N(null);function o(a){const{value:l}=n,{getCounter:s,getTail:d}=e;let c;if(s!==void 0?c=s():c=r.value,!l||!c)return;c.hasAttribute(Ge)&&c.removeAttribute(Ge);const{children:f}=l;if(a.showAllItemsBeforeCalculate)for(const w of f)w.hasAttribute(Ge)&&w.removeAttribute(Ge);const v=l.offsetWidth,y=[],u=t.tail?d==null?void 0:d():null;let p=u?u.offsetWidth:0,F=!1;const b=l.children.length-(t.tail?1:0);for(let w=0;w<b-1;++w){if(w<0)continue;const m=f[w];if(F){m.hasAttribute(Ge)||m.setAttribute(Ge,"");continue}else m.hasAttribute(Ge)&&m.removeAttribute(Ge);const k=m.offsetWidth;if(p+=k,y[w]=k,p>v){const{updateCounter:S}=e;for(let z=w;z>=0;--z){const B=b-1-z;S!==void 0?S(B):c.textContent=`${B}`;const D=c.offsetWidth;if(p-=y[z],p+D<=v||z===0){F=!0,w=z-1,u&&(w===-1?(u.style.maxWidth=`${v-D}px`,u.style.boxSizing="border-box"):u.style.maxWidth="");const{onUpdateCount:L}=e;L&&L(B);break}}}}const{onUpdateOverflow:C}=e;F?C!==void 0&&C(!0):(C!==void 0&&C(!1),c.setAttribute(Ge,""))}const i=Br();return Oi.mount({id:"vueuc/overflow",head:!0,anchorMetaName:Wr,ssr:i}),lt(()=>o({showAllItemsBeforeCalculate:!1})),{selfRef:n,counterRef:r,sync:o}},render(){const{$slots:e}=this;return Ot(()=>this.sync({showAllItemsBeforeCalculate:!1})),g("div",{class:"v-overflow",ref:"selfRef"},[ti(e,"default"),e.counter?e.counter():g("span",{style:{display:"inline-block"},ref:"counterRef"}),e.tail?e.tail():null])}});function Hr(e,t){t&&(lt(()=>{const{value:n}=e;n&&ir.registerHandler(n,t)}),Yn(()=>{const{value:n}=e;n&&ir.unregisterHandler(n)}))}const $i=me({name:"Checkmark",render(){return g("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 16 16"},g("g",{fill:"none"},g("path",{d:"M14.046 3.486a.75.75 0 0 1-.032 1.06l-7.93 7.474a.85.85 0 0 1-1.188-.022l-2.68-2.72a.75.75 0 1 1 1.068-1.053l2.234 2.267l7.468-7.038a.75.75 0 0 1 1.06.032z",fill:"currentColor"})))}}),Ni=me({name:"Eye",render(){return g("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 512 512"},g("path",{d:"M255.66 112c-77.94 0-157.89 45.11-220.83 135.33a16 16 0 0 0-.27 17.77C82.92 340.8 161.8 400 255.66 400c92.84 0 173.34-59.38 221.79-135.25a16.14 16.14 0 0 0 0-17.47C428.89 172.28 347.8 112 255.66 112z",fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"32"}),g("circle",{cx:"256",cy:"256",r:"80",fill:"none",stroke:"currentColor","stroke-miterlimit":"10","stroke-width":"32"}))}}),Li=me({name:"EyeOff",render(){return g("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 512 512"},g("path",{d:"M432 448a15.92 15.92 0 0 1-11.31-4.69l-352-352a16 16 0 0 1 22.62-22.62l352 352A16 16 0 0 1 432 448z",fill:"currentColor"}),g("path",{d:"M255.66 384c-41.49 0-81.5-12.28-118.92-36.5c-34.07-22-64.74-53.51-88.7-91v-.08c19.94-28.57 41.78-52.73 65.24-72.21a2 2 0 0 0 .14-2.94L93.5 161.38a2 2 0 0 0-2.71-.12c-24.92 21-48.05 46.76-69.08 76.92a31.92 31.92 0 0 0-.64 35.54c26.41 41.33 60.4 76.14 98.28 100.65C162 402 207.9 416 255.66 416a239.13 239.13 0 0 0 75.8-12.58a2 2 0 0 0 .77-3.31l-21.58-21.58a4 4 0 0 0-3.83-1a204.8 204.8 0 0 1-51.16 6.47z",fill:"currentColor"}),g("path",{d:"M490.84 238.6c-26.46-40.92-60.79-75.68-99.27-100.53C349 110.55 302 96 255.66 96a227.34 227.34 0 0 0-74.89 12.83a2 2 0 0 0-.75 3.31l21.55 21.55a4 4 0 0 0 3.88 1a192.82 192.82 0 0 1 50.21-6.69c40.69 0 80.58 12.43 118.55 37c34.71 22.4 65.74 53.88 89.76 91a.13.13 0 0 1 0 .16a310.72 310.72 0 0 1-64.12 72.73a2 2 0 0 0-.15 2.95l19.9 19.89a2 2 0 0 0 2.7.13a343.49 343.49 0 0 0 68.64-78.48a32.2 32.2 0 0 0-.1-34.78z",fill:"currentColor"}),g("path",{d:"M256 160a95.88 95.88 0 0 0-21.37 2.4a2 2 0 0 0-1 3.38l112.59 112.56a2 2 0 0 0 3.38-1A96 96 0 0 0 256 160z",fill:"currentColor"}),g("path",{d:"M165.78 233.66a2 2 0 0 0-3.38 1a96 96 0 0 0 115 115a2 2 0 0 0 1-3.38z",fill:"currentColor"}))}}),Di=me({name:"Empty",render(){return g("svg",{viewBox:"0 0 28 28",fill:"none",xmlns:"http://www.w3.org/2000/svg"},g("path",{d:"M26 7.5C26 11.0899 23.0899 14 19.5 14C15.9101 14 13 11.0899 13 7.5C13 3.91015 15.9101 1 19.5 1C23.0899 1 26 3.91015 26 7.5ZM16.8536 4.14645C16.6583 3.95118 16.3417 3.95118 16.1464 4.14645C15.9512 4.34171 15.9512 4.65829 16.1464 4.85355L18.7929 7.5L16.1464 10.1464C15.9512 10.3417 15.9512 10.6583 16.1464 10.8536C16.3417 11.0488 16.6583 11.0488 16.8536 10.8536L19.5 8.20711L22.1464 10.8536C22.3417 11.0488 22.6583 11.0488 22.8536 10.8536C23.0488 10.6583 23.0488 10.3417 22.8536 10.1464L20.2071 7.5L22.8536 4.85355C23.0488 4.65829 23.0488 4.34171 22.8536 4.14645C22.6583 3.95118 22.3417 3.95118 22.1464 4.14645L19.5 6.79289L16.8536 4.14645Z",fill:"currentColor"}),g("path",{d:"M25 22.75V12.5991C24.5572 13.0765 24.053 13.4961 23.5 13.8454V16H17.5L17.3982 16.0068C17.0322 16.0565 16.75 16.3703 16.75 16.75C16.75 18.2688 15.5188 19.5 14 19.5C12.4812 19.5 11.25 18.2688 11.25 16.75L11.2432 16.6482C11.1935 16.2822 10.8797 16 10.5 16H4.5V7.25C4.5 6.2835 5.2835 5.5 6.25 5.5H12.2696C12.4146 4.97463 12.6153 4.47237 12.865 4H6.25C4.45507 4 3 5.45507 3 7.25V22.75C3 24.5449 4.45507 26 6.25 26H21.75C23.5449 26 25 24.5449 25 22.75ZM4.5 22.75V17.5H9.81597L9.85751 17.7041C10.2905 19.5919 11.9808 21 14 21L14.215 20.9947C16.2095 20.8953 17.842 19.4209 18.184 17.5H23.5V22.75C23.5 23.7165 22.7165 24.5 21.75 24.5H6.25C5.2835 24.5 4.5 23.7165 4.5 22.75Z",fill:"currentColor"}))}}),Vi=me({name:"ChevronDown",render(){return g("svg",{viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg"},g("path",{d:"M3.14645 5.64645C3.34171 5.45118 3.65829 5.45118 3.85355 5.64645L8 9.79289L12.1464 5.64645C12.3417 5.45118 12.6583 5.45118 12.8536 5.64645C13.0488 5.84171 13.0488 6.15829 12.8536 6.35355L8.35355 10.8536C8.15829 11.0488 7.84171 11.0488 7.64645 10.8536L3.14645 6.35355C2.95118 6.15829 2.95118 5.84171 3.14645 5.64645Z",fill:"currentColor"}))}}),ji=ni("clear",g("svg",{viewBox:"0 0 16 16",version:"1.1",xmlns:"http://www.w3.org/2000/svg"},g("g",{stroke:"none","stroke-width":"1",fill:"none","fill-rule":"evenodd"},g("g",{fill:"currentColor","fill-rule":"nonzero"},g("path",{d:"M8,2 C11.3137085,2 14,4.6862915 14,8 C14,11.3137085 11.3137085,14 8,14 C4.6862915,14 2,11.3137085 2,8 C2,4.6862915 4.6862915,2 8,2 Z M6.5343055,5.83859116 C6.33943736,5.70359511 6.07001296,5.72288026 5.89644661,5.89644661 L5.89644661,5.89644661 L5.83859116,5.9656945 C5.70359511,6.16056264 5.72288026,6.42998704 5.89644661,6.60355339 L5.89644661,6.60355339 L7.293,8 L5.89644661,9.39644661 L5.83859116,9.4656945 C5.70359511,9.66056264 5.72288026,9.92998704 5.89644661,10.1035534 L5.89644661,10.1035534 L5.9656945,10.1614088 C6.16056264,10.2964049 6.42998704,10.2771197 6.60355339,10.1035534 L6.60355339,10.1035534 L8,8.707 L9.39644661,10.1035534 L9.4656945,10.1614088 C9.66056264,10.2964049 9.92998704,10.2771197 10.1035534,10.1035534 L10.1035534,10.1035534 L10.1614088,10.0343055 C10.2964049,9.83943736 10.2771197,9.57001296 10.1035534,9.39644661 L10.1035534,9.39644661 L8.707,8 L10.1035534,6.60355339 L10.1614088,6.5343055 C10.2964049,6.33943736 10.2771197,6.07001296 10.1035534,5.89644661 L10.1035534,5.89644661 L10.0343055,5.83859116 C9.83943736,5.70359511 9.57001296,5.72288026 9.39644661,5.89644661 L9.39644661,5.89644661 L8,7.293 L6.60355339,5.89644661 Z"}))))),Wi=me({props:{onFocus:Function,onBlur:Function},setup(e){return()=>g("div",{style:"width: 0; height: 0",tabindex:0,onFocus:e.onFocus,onBlur:e.onBlur})}});function pr(e){return Array.isArray(e)?e:[e]}const Nn={STOP:"STOP"};function Gr(e,t){const n=t(e);e.children!==void 0&&n!==Nn.STOP&&e.children.forEach(r=>Gr(r,t))}function qi(e,t={}){const{preserveGroup:n=!1}=t,r=[],o=n?a=>{a.isLeaf||(r.push(a.key),i(a.children))}:a=>{a.isLeaf||(a.isGroup||r.push(a.key),i(a.children))};function i(a){a.forEach(o)}return i(e),r}function Ki(e,t){const{isLeaf:n}=e;return n!==void 0?n:!t(e)}function Ui(e){return e.children}function Hi(e){return e.key}function Gi(){return!1}function Yi(e,t){const{isLeaf:n}=e;return!(n===!1&&!Array.isArray(t(e)))}function Ji(e){return e.disabled===!0}function Zi(e,t){return e.isLeaf===!1&&!Array.isArray(t(e))}function xn(e){var t;return e==null?[]:Array.isArray(e)?e:(t=e.checkedKeys)!==null&&t!==void 0?t:[]}function Cn(e){var t;return e==null||Array.isArray(e)?[]:(t=e.indeterminateKeys)!==null&&t!==void 0?t:[]}function Xi(e,t){const n=new Set(e);return t.forEach(r=>{n.has(r)||n.add(r)}),Array.from(n)}function Qi(e,t){const n=new Set(e);return t.forEach(r=>{n.has(r)&&n.delete(r)}),Array.from(n)}function ea(e){return(e==null?void 0:e.type)==="group"}function ta(e){const t=new Map;return e.forEach((n,r)=>{t.set(n.key,r)}),n=>{var r;return(r=t.get(n))!==null&&r!==void 0?r:null}}class na extends Error{constructor(){super(),this.message="SubtreeNotLoadedError: checking a subtree whose required nodes are not fully loaded."}}function ra(e,t,n,r){return en(t.concat(e),n,r,!1)}function oa(e,t){const n=new Set;return e.forEach(r=>{const o=t.treeNodeMap.get(r);if(o!==void 0){let i=o.parent;for(;i!==null&&!(i.disabled||n.has(i.key));)n.add(i.key),i=i.parent}}),n}function ia(e,t,n,r){const o=en(t,n,r,!1),i=en(e,n,r,!0),a=oa(e,n),l=[];return o.forEach(s=>{(i.has(s)||a.has(s))&&l.push(s)}),l.forEach(s=>o.delete(s)),o}function kn(e,t){const{checkedKeys:n,keysToCheck:r,keysToUncheck:o,indeterminateKeys:i,cascade:a,leafOnly:l,checkStrategy:s,allowNotLoaded:d}=e;if(!a)return r!==void 0?{checkedKeys:Xi(n,r),indeterminateKeys:Array.from(i)}:o!==void 0?{checkedKeys:Qi(n,o),indeterminateKeys:Array.from(i)}:{checkedKeys:Array.from(n),indeterminateKeys:Array.from(i)};const{levelTreeNodeMap:c}=t;let f;o!==void 0?f=ia(o,n,t,d):r!==void 0?f=ra(r,n,t,d):f=en(n,t,d,!1);const v=s==="parent",y=s==="child"||l,u=f,p=new Set,F=Math.max.apply(null,Array.from(c.keys()));for(let b=F;b>=0;b-=1){const C=b===0,w=c.get(b);for(const m of w){if(m.isLeaf)continue;const{key:k,shallowLoaded:S}=m;if(y&&S&&m.children.forEach(L=>{!L.disabled&&!L.isLeaf&&L.shallowLoaded&&u.has(L.key)&&u.delete(L.key)}),m.disabled||!S)continue;let z=!0,B=!1,D=!0;for(const L of m.children){const ne=L.key;if(!L.disabled){if(D&&(D=!1),u.has(ne))B=!0;else if(p.has(ne)){B=!0,z=!1;break}else if(z=!1,B)break}}z&&!D?(v&&m.children.forEach(L=>{!L.disabled&&u.has(L.key)&&u.delete(L.key)}),u.add(k)):B&&p.add(k),C&&y&&u.has(k)&&u.delete(k)}}return{checkedKeys:Array.from(u),indeterminateKeys:Array.from(p)}}function en(e,t,n,r){const{treeNodeMap:o,getChildren:i}=t,a=new Set,l=new Set(e);return e.forEach(s=>{const d=o.get(s);d!==void 0&&Gr(d,c=>{if(c.disabled)return Nn.STOP;const{key:f}=c;if(!a.has(f)&&(a.add(f),l.add(f),Zi(c.rawNode,i))){if(r)return Nn.STOP;if(!n)throw new na}})}),l}function aa(e,{includeGroup:t=!1,includeSelf:n=!0},r){var o;const i=r.treeNodeMap;let a=e==null?null:(o=i.get(e))!==null&&o!==void 0?o:null;const l={keyPath:[],treeNodePath:[],treeNode:a};if(a!=null&&a.ignored)return l.treeNode=null,l;for(;a;)!a.ignored&&(t||!a.isGroup)&&l.treeNodePath.push(a),a=a.parent;return l.treeNodePath.reverse(),n||l.treeNodePath.pop(),l.keyPath=l.treeNodePath.map(s=>s.key),l}function la(e){if(e.length===0)return null;const t=e[0];return t.isGroup||t.ignored||t.disabled?t.getNext():t}function sa(e,t){const n=e.siblings,r=n.length,{index:o}=e;return t?n[(o+1)%r]:o===n.length-1?null:n[o+1]}function mr(e,t,{loop:n=!1,includeDisabled:r=!1}={}){const o=t==="prev"?ca:sa,i={reverse:t==="prev"};let a=!1,l=null;function s(d){if(d!==null){if(d===e){if(!a)a=!0;else if(!e.disabled&&!e.isGroup){l=e;return}}else if((!d.disabled||r)&&!d.ignored&&!d.isGroup){l=d;return}if(d.isGroup){const c=Qn(d,i);c!==null?l=c:s(o(d,n))}else{const c=o(d,!1);if(c!==null)s(c);else{const f=da(d);f!=null&&f.isGroup?s(o(f,n)):n&&s(o(d,!0))}}}}return s(e),l}function ca(e,t){const n=e.siblings,r=n.length,{index:o}=e;return t?n[(o-1+r)%r]:o===0?null:n[o-1]}function da(e){return e.parent}function Qn(e,t={}){const{reverse:n=!1}=t,{children:r}=e;if(r){const{length:o}=r,i=n?o-1:0,a=n?-1:o,l=n?-1:1;for(let s=i;s!==a;s+=l){const d=r[s];if(!d.disabled&&!d.ignored)if(d.isGroup){const c=Qn(d,t);if(c!==null)return c}else return d}}return null}const ua={getChild(){return this.ignored?null:Qn(this)},getParent(){const{parent:e}=this;return e!=null&&e.isGroup?e.getParent():e},getNext(e={}){return mr(this,"next",e)},getPrev(e={}){return mr(this,"prev",e)}};function fa(e,t){const n=t?new Set(t):void 0,r=[];function o(i){i.forEach(a=>{r.push(a),!(a.isLeaf||!a.children||a.ignored)&&(a.isGroup||n===void 0||n.has(a.key))&&o(a.children)})}return o(e),r}function ha(e,t){const n=e.key;for(;t;){if(t.key===n)return!0;t=t.parent}return!1}function Yr(e,t,n,r,o,i=null,a=0){const l=[];return e.forEach((s,d)=>{var c;const f=Object.create(r);if(f.rawNode=s,f.siblings=l,f.level=a,f.index=d,f.isFirstChild=d===0,f.isLastChild=d+1===e.length,f.parent=i,!f.ignored){const v=o(s);Array.isArray(v)&&(f.children=Yr(v,t,n,r,o,f,a+1))}l.push(f),t.set(f.key,f),n.has(a)||n.set(a,[]),(c=n.get(a))===null||c===void 0||c.push(f)}),l}function ga(e,t={}){var n;const r=new Map,o=new Map,{getDisabled:i=Ji,getIgnored:a=Gi,getIsGroup:l=ea,getKey:s=Hi}=t,d=(n=t.getChildren)!==null&&n!==void 0?n:Ui,c=t.ignoreEmptyChildren?m=>{const k=d(m);return Array.isArray(k)?k.length?k:null:k}:d,f=Object.assign({get key(){return s(this.rawNode)},get disabled(){return i(this.rawNode)},get isGroup(){return l(this.rawNode)},get isLeaf(){return Ki(this.rawNode,c)},get shallowLoaded(){return Yi(this.rawNode,c)},get ignored(){return a(this.rawNode)},contains(m){return ha(this,m)}},ua),v=Yr(e,r,o,f,c);function y(m){if(m==null)return null;const k=r.get(m);return k&&!k.isGroup&&!k.ignored?k:null}function u(m){if(m==null)return null;const k=r.get(m);return k&&!k.ignored?k:null}function p(m,k){const S=u(m);return S?S.getPrev(k):null}function F(m,k){const S=u(m);return S?S.getNext(k):null}function b(m){const k=u(m);return k?k.getParent():null}function C(m){const k=u(m);return k?k.getChild():null}const w={treeNodes:v,treeNodeMap:r,levelTreeNodeMap:o,maxLevel:Math.max(...o.keys()),getChildren:c,getFlattenedNodes(m){return fa(v,m)},getNode:y,getPrev:p,getNext:F,getParent:b,getChild:C,getFirstAvailableNode(){return la(v)},getPath(m,k={}){return aa(m,k,w)},getCheckedKeys(m,k={}){const{cascade:S=!0,leafOnly:z=!1,checkStrategy:B="all",allowNotLoaded:D=!1}=k;return kn({checkedKeys:xn(m),indeterminateKeys:Cn(m),cascade:S,leafOnly:z,checkStrategy:B,allowNotLoaded:D},w)},check(m,k,S={}){const{cascade:z=!0,leafOnly:B=!1,checkStrategy:D="all",allowNotLoaded:L=!1}=S;return kn({checkedKeys:xn(k),indeterminateKeys:Cn(k),keysToCheck:m==null?[]:pr(m),cascade:z,leafOnly:B,checkStrategy:D,allowNotLoaded:L},w)},uncheck(m,k,S={}){const{cascade:z=!0,leafOnly:B=!1,checkStrategy:D="all",allowNotLoaded:L=!1}=S;return kn({checkedKeys:xn(k),indeterminateKeys:Cn(k),keysToUncheck:m==null?[]:pr(m),cascade:z,leafOnly:B,checkStrategy:D,allowNotLoaded:L},w)},getNonLeafKeys(m={}){return qi(v,m)}};return w}const va=M("empty",`
 display: flex;
 flex-direction: column;
 align-items: center;
 font-size: var(--n-font-size);
`,[A("icon",`
 width: var(--n-icon-size);
 height: var(--n-icon-size);
 font-size: var(--n-icon-size);
 line-height: var(--n-icon-size);
 color: var(--n-icon-color);
 transition:
 color .3s var(--n-bezier);
 `,[G("+",[A("description",`
 margin-top: 8px;
 `)])]),A("description",`
 transition: color .3s var(--n-bezier);
 color: var(--n-text-color);
 `),A("extra",`
 text-align: center;
 transition: color .3s var(--n-bezier);
 margin-top: 12px;
 color: var(--n-extra-text-color);
 `)]),ba=Object.assign(Object.assign({},Re.props),{description:String,showDescription:{type:Boolean,default:!0},showIcon:{type:Boolean,default:!0},size:{type:String,default:"medium"},renderIcon:Function}),pa=me({name:"Empty",props:ba,setup(e){const{mergedClsPrefixRef:t,inlineThemeDisabled:n}=De(e),r=Re("Empty","-empty",va,ri,e,t),{localeRef:o}=Zn("Empty"),i=_e(oi,null),a=$(()=>{var c,f,v;return(c=e.description)!==null&&c!==void 0?c:(v=(f=i==null?void 0:i.mergedComponentPropsRef.value)===null||f===void 0?void 0:f.Empty)===null||v===void 0?void 0:v.description}),l=$(()=>{var c,f;return((f=(c=i==null?void 0:i.mergedComponentPropsRef.value)===null||c===void 0?void 0:c.Empty)===null||f===void 0?void 0:f.renderIcon)||(()=>g(Di,null))}),s=$(()=>{const{size:c}=e,{common:{cubicBezierEaseInOut:f},self:{[ae("iconSize",c)]:v,[ae("fontSize",c)]:y,textColor:u,iconColor:p,extraTextColor:F}}=r.value;return{"--n-icon-size":v,"--n-font-size":y,"--n-bezier":f,"--n-text-color":u,"--n-icon-color":p,"--n-extra-text-color":F}}),d=n?Qe("empty",$(()=>{let c="";const{size:f}=e;return c+=f[0],c}),s,e):void 0;return{mergedClsPrefix:t,mergedRenderIcon:l,localizedDescription:$(()=>a.value||o.value.description),cssVars:n?void 0:s,themeClass:d==null?void 0:d.themeClass,onRender:d==null?void 0:d.onRender}},render(){const{$slots:e,mergedClsPrefix:t,onRender:n}=this;return n==null||n(),g("div",{class:[`${t}-empty`,this.themeClass],style:this.cssVars},this.showIcon?g("div",{class:`${t}-empty__icon`},e.icon?e.icon():g(wt,{clsPrefix:t},{default:this.mergedRenderIcon})):null,this.showDescription?g("div",{class:`${t}-empty__description`},e.default?e.default():this.localizedDescription):null,e.extra?g("div",{class:`${t}-empty__extra`},e.extra()):null)}});function ma(e,t){return g(Jn,{name:"fade-in-scale-up-transition"},{default:()=>e?g(wt,{clsPrefix:t,class:`${t}-base-select-option__check`},{default:()=>g($i)}):null})}const yr=me({name:"NBaseSelectOption",props:{clsPrefix:{type:String,required:!0},tmNode:{type:Object,required:!0}},setup(e){const{valueRef:t,pendingTmNodeRef:n,multipleRef:r,valueSetRef:o,renderLabelRef:i,renderOptionRef:a,labelFieldRef:l,valueFieldRef:s,showCheckmarkRef:d,nodePropsRef:c,handleOptionClick:f,handleOptionMouseEnter:v}=_e(Xn),y=Le(()=>{const{value:b}=n;return b?e.tmNode.key===b.key:!1});function u(b){const{tmNode:C}=e;C.disabled||f(b,C)}function p(b){const{tmNode:C}=e;C.disabled||v(b,C)}function F(b){const{tmNode:C}=e,{value:w}=y;C.disabled||w||v(b,C)}return{multiple:r,isGrouped:Le(()=>{const{tmNode:b}=e,{parent:C}=b;return C&&C.rawNode.type==="group"}),showCheckmark:d,nodeProps:c,isPending:y,isSelected:Le(()=>{const{value:b}=t,{value:C}=r;if(b===null)return!1;const w=e.tmNode.rawNode[s.value];if(C){const{value:m}=o;return m.has(w)}else return b===w}),labelField:l,renderLabel:i,renderOption:a,handleMouseMove:F,handleMouseEnter:p,handleClick:u}},render(){const{clsPrefix:e,tmNode:{rawNode:t},isSelected:n,isPending:r,isGrouped:o,showCheckmark:i,nodeProps:a,renderOption:l,renderLabel:s,handleClick:d,handleMouseEnter:c,handleMouseMove:f}=this,v=ma(n,e),y=s?[s(t,n),i&&v]:[mt(t[this.labelField],t,n),i&&v],u=a==null?void 0:a(t),p=g("div",Object.assign({},u,{class:[`${e}-base-select-option`,t.class,u==null?void 0:u.class,{[`${e}-base-select-option--disabled`]:t.disabled,[`${e}-base-select-option--selected`]:n,[`${e}-base-select-option--grouped`]:o,[`${e}-base-select-option--pending`]:r,[`${e}-base-select-option--show-checkmark`]:i}],style:[(u==null?void 0:u.style)||"",t.style||""],onClick:yn([d,u==null?void 0:u.onClick]),onMouseenter:yn([c,u==null?void 0:u.onMouseenter]),onMousemove:yn([f,u==null?void 0:u.onMousemove])}),g("div",{class:`${e}-base-select-option__content`},y));return t.render?t.render({node:p,option:t,selected:n}):l?l({node:p,option:t,selected:n}):p}}),wr=me({name:"NBaseSelectGroupHeader",props:{clsPrefix:{type:String,required:!0},tmNode:{type:Object,required:!0}},setup(){const{renderLabelRef:e,renderOptionRef:t,labelFieldRef:n,nodePropsRef:r}=_e(Xn);return{labelField:n,nodeProps:r,renderLabel:e,renderOption:t}},render(){const{clsPrefix:e,renderLabel:t,renderOption:n,nodeProps:r,tmNode:{rawNode:o}}=this,i=r==null?void 0:r(o),a=t?t(o,!1):mt(o[this.labelField],o,!1),l=g("div",Object.assign({},i,{class:[`${e}-base-select-group-header`,i==null?void 0:i.class]}),a);return o.render?o.render({node:l,option:o}):n?n({node:l,option:o,selected:!1}):l}}),ya=M("base-select-menu",`
 line-height: 1.5;
 outline: none;
 z-index: 0;
 position: relative;
 border-radius: var(--n-border-radius);
 transition:
 background-color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
 background-color: var(--n-color);
`,[M("scrollbar",`
 max-height: var(--n-height);
 `),M("virtual-list",`
 max-height: var(--n-height);
 `),M("base-select-option",`
 min-height: var(--n-option-height);
 font-size: var(--n-option-font-size);
 display: flex;
 align-items: center;
 `,[A("content",`
 z-index: 1;
 white-space: nowrap;
 text-overflow: ellipsis;
 overflow: hidden;
 `)]),M("base-select-group-header",`
 min-height: var(--n-option-height);
 font-size: .93em;
 display: flex;
 align-items: center;
 `),M("base-select-menu-option-wrapper",`
 position: relative;
 width: 100%;
 `),A("loading, empty",`
 display: flex;
 padding: 12px 32px;
 flex: 1;
 justify-content: center;
 `),A("loading",`
 color: var(--n-loading-color);
 font-size: var(--n-loading-size);
 `),A("header",`
 padding: 8px var(--n-option-padding-left);
 font-size: var(--n-option-font-size);
 transition: 
 color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 border-bottom: 1px solid var(--n-action-divider-color);
 color: var(--n-action-text-color);
 `),A("action",`
 padding: 8px var(--n-option-padding-left);
 font-size: var(--n-option-font-size);
 transition: 
 color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 border-top: 1px solid var(--n-action-divider-color);
 color: var(--n-action-text-color);
 `),M("base-select-group-header",`
 position: relative;
 cursor: default;
 padding: var(--n-option-padding);
 color: var(--n-group-header-text-color);
 `),M("base-select-option",`
 cursor: pointer;
 position: relative;
 padding: var(--n-option-padding);
 transition:
 color .3s var(--n-bezier),
 opacity .3s var(--n-bezier);
 box-sizing: border-box;
 color: var(--n-option-text-color);
 opacity: 1;
 `,[q("show-checkmark",`
 padding-right: calc(var(--n-option-padding-right) + 20px);
 `),G("&::before",`
 content: "";
 position: absolute;
 left: 4px;
 right: 4px;
 top: 0;
 bottom: 0;
 border-radius: var(--n-border-radius);
 transition: background-color .3s var(--n-bezier);
 `),G("&:active",`
 color: var(--n-option-text-color-pressed);
 `),q("grouped",`
 padding-left: calc(var(--n-option-padding-left) * 1.5);
 `),q("pending",[G("&::before",`
 background-color: var(--n-option-color-pending);
 `)]),q("selected",`
 color: var(--n-option-text-color-active);
 `,[G("&::before",`
 background-color: var(--n-option-color-active);
 `),q("pending",[G("&::before",`
 background-color: var(--n-option-color-active-pending);
 `)])]),q("disabled",`
 cursor: not-allowed;
 `,[Me("selected",`
 color: var(--n-option-text-color-disabled);
 `),q("selected",`
 opacity: var(--n-option-opacity-disabled);
 `)]),A("check",`
 font-size: 16px;
 position: absolute;
 right: calc(var(--n-option-padding-right) - 4px);
 top: calc(50% - 7px);
 color: var(--n-option-check-color);
 transition: color .3s var(--n-bezier);
 `,[_r({enterScale:"0.5"})])])]),wa=me({name:"InternalSelectMenu",props:Object.assign(Object.assign({},Re.props),{clsPrefix:{type:String,required:!0},scrollable:{type:Boolean,default:!0},treeMate:{type:Object,required:!0},multiple:Boolean,size:{type:String,default:"medium"},value:{type:[String,Number,Array],default:null},autoPending:Boolean,virtualScroll:{type:Boolean,default:!0},show:{type:Boolean,default:!0},labelField:{type:String,default:"label"},valueField:{type:String,default:"value"},loading:Boolean,focusable:Boolean,renderLabel:Function,renderOption:Function,nodeProps:Function,showCheckmark:{type:Boolean,default:!0},onMousedown:Function,onScroll:Function,onFocus:Function,onBlur:Function,onKeyup:Function,onKeydown:Function,onTabOut:Function,onMouseenter:Function,onMouseleave:Function,onResize:Function,resetMenuOnOptionsChange:{type:Boolean,default:!0},inlineThemeDisabled:Boolean,onToggle:Function}),setup(e){const{mergedClsPrefixRef:t,mergedRtlRef:n}=De(e),r=Dt("InternalSelectMenu",n,t),o=Re("InternalSelectMenu","-internal-select-menu",ya,ii,e,fe(e,"clsPrefix")),i=N(null),a=N(null),l=N(null),s=$(()=>e.treeMate.getFlattenedNodes()),d=$(()=>ta(s.value)),c=N(null);function f(){const{treeMate:T}=e;let _=null;const{value:H}=e;H===null?_=T.getFirstAvailableNode():(e.multiple?_=T.getNode((H||[])[(H||[]).length-1]):_=T.getNode(H),(!_||_.disabled)&&(_=T.getFirstAvailableNode())),E(_||null)}function v(){const{value:T}=c;T&&!e.treeMate.getNode(T.key)&&(c.value=null)}let y;Be(()=>e.show,T=>{T?y=Be(()=>e.treeMate,()=>{e.resetMenuOnOptionsChange?(e.autoPending?f():v(),Ot(j)):v()},{immediate:!0}):y==null||y()},{immediate:!0}),Yn(()=>{y==null||y()});const u=$(()=>zn(o.value.self[ae("optionHeight",e.size)])),p=$(()=>at(o.value.self[ae("padding",e.size)])),F=$(()=>e.multiple&&Array.isArray(e.value)?new Set(e.value):new Set),b=$(()=>{const T=s.value;return T&&T.length===0});function C(T){const{onToggle:_}=e;_&&_(T)}function w(T){const{onScroll:_}=e;_&&_(T)}function m(T){var _;(_=l.value)===null||_===void 0||_.sync(),w(T)}function k(){var T;(T=l.value)===null||T===void 0||T.sync()}function S(){const{value:T}=c;return T||null}function z(T,_){_.disabled||E(_,!1)}function B(T,_){_.disabled||C(_)}function D(T){var _;Qt(T,"action")||(_=e.onKeyup)===null||_===void 0||_.call(e,T)}function L(T){var _;Qt(T,"action")||(_=e.onKeydown)===null||_===void 0||_.call(e,T)}function ne(T){var _;(_=e.onMousedown)===null||_===void 0||_.call(e,T),!e.focusable&&T.preventDefault()}function Y(){const{value:T}=c;T&&E(T.getNext({loop:!0}),!0)}function P(){const{value:T}=c;T&&E(T.getPrev({loop:!0}),!0)}function E(T,_=!1){c.value=T,_&&j()}function j(){var T,_;const H=c.value;if(!H)return;const he=d.value(H.key);he!==null&&(e.virtualScroll?(T=a.value)===null||T===void 0||T.scrollTo({index:he}):(_=l.value)===null||_===void 0||_.scrollTo({index:he,elSize:u.value}))}function K(T){var _,H;!((_=i.value)===null||_===void 0)&&_.contains(T.target)&&((H=e.onFocus)===null||H===void 0||H.call(e,T))}function Z(T){var _,H;!((_=i.value)===null||_===void 0)&&_.contains(T.relatedTarget)||(H=e.onBlur)===null||H===void 0||H.call(e,T)}Ye(Xn,{handleOptionMouseEnter:z,handleOptionClick:B,valueSetRef:F,pendingTmNodeRef:c,nodePropsRef:fe(e,"nodeProps"),showCheckmarkRef:fe(e,"showCheckmark"),multipleRef:fe(e,"multiple"),valueRef:fe(e,"value"),renderLabelRef:fe(e,"renderLabel"),renderOptionRef:fe(e,"renderOption"),labelFieldRef:fe(e,"labelField"),valueFieldRef:fe(e,"valueField")}),Ye(Ri,i),lt(()=>{const{value:T}=l;T&&T.sync()});const U=$(()=>{const{size:T}=e,{common:{cubicBezierEaseInOut:_},self:{height:H,borderRadius:he,color:Ce,groupHeaderTextColor:Pe,actionDividerColor:ke,optionTextColorPressed:be,optionTextColor:Fe,optionTextColorDisabled:ve,optionTextColorActive:le,optionOpacityDisabled:ye,optionCheckColor:ce,actionTextColor:ze,optionColorPending:je,optionColorActive:We,loadingColor:Oe,loadingSize:tt,optionColorActivePending:nt,[ae("optionFontSize",T)]:Je,[ae("optionHeight",T)]:qe,[ae("optionPadding",T)]:Te}}=o.value;return{"--n-height":H,"--n-action-divider-color":ke,"--n-action-text-color":ze,"--n-bezier":_,"--n-border-radius":he,"--n-color":Ce,"--n-option-font-size":Je,"--n-group-header-text-color":Pe,"--n-option-check-color":ce,"--n-option-color-pending":je,"--n-option-color-active":We,"--n-option-color-active-pending":nt,"--n-option-height":qe,"--n-option-opacity-disabled":ye,"--n-option-text-color":Fe,"--n-option-text-color-active":le,"--n-option-text-color-disabled":ve,"--n-option-text-color-pressed":be,"--n-option-padding":Te,"--n-option-padding-left":at(Te,"left"),"--n-option-padding-right":at(Te,"right"),"--n-loading-color":Oe,"--n-loading-size":tt}}),{inlineThemeDisabled:ee}=e,X=ee?Qe("internal-select-menu",$(()=>e.size[0]),U,e):void 0,de={selfRef:i,next:Y,prev:P,getPendingTmNode:S};return Hr(i,e.onResize),Object.assign({mergedTheme:o,mergedClsPrefix:t,rtlEnabled:r,virtualListRef:a,scrollbarRef:l,itemSize:u,padding:p,flattenedNodes:s,empty:b,virtualListContainer(){const{value:T}=a;return T==null?void 0:T.listElRef},virtualListContent(){const{value:T}=a;return T==null?void 0:T.itemsElRef},doScroll:w,handleFocusin:K,handleFocusout:Z,handleKeyUp:D,handleKeyDown:L,handleMouseDown:ne,handleVirtualListResize:k,handleVirtualListScroll:m,cssVars:ee?void 0:U,themeClass:X==null?void 0:X.themeClass,onRender:X==null?void 0:X.onRender},de)},render(){const{$slots:e,virtualScroll:t,clsPrefix:n,mergedTheme:r,themeClass:o,onRender:i}=this;return i==null||i(),g("div",{ref:"selfRef",tabindex:this.focusable?0:-1,class:[`${n}-base-select-menu`,this.rtlEnabled&&`${n}-base-select-menu--rtl`,o,this.multiple&&`${n}-base-select-menu--multiple`],style:this.cssVars,onFocusin:this.handleFocusin,onFocusout:this.handleFocusout,onKeyup:this.handleKeyUp,onKeydown:this.handleKeyDown,onMousedown:this.handleMouseDown,onMouseenter:this.onMouseenter,onMouseleave:this.onMouseleave},Ne(e.header,a=>a&&g("div",{class:`${n}-base-select-menu__header`,"data-header":!0,key:"header"},a)),this.loading?g("div",{class:`${n}-base-select-menu__loading`},g(Or,{clsPrefix:n,strokeWidth:20})):this.empty?g("div",{class:`${n}-base-select-menu__empty`,"data-empty":!0},yt(e.empty,()=>[g(pa,{theme:r.peers.Empty,themeOverrides:r.peerOverrides.Empty})])):g($r,{ref:"scrollbarRef",theme:r.peers.Scrollbar,themeOverrides:r.peerOverrides.Scrollbar,scrollable:this.scrollable,container:t?this.virtualListContainer:void 0,content:t?this.virtualListContent:void 0,onScroll:t?void 0:this.doScroll},{default:()=>t?g(_i,{ref:"virtualListRef",class:`${n}-virtual-list`,items:this.flattenedNodes,itemSize:this.itemSize,showScrollbar:!1,paddingTop:this.padding.top,paddingBottom:this.padding.bottom,onResize:this.handleVirtualListResize,onScroll:this.handleVirtualListScroll,itemResizable:!0},{default:({item:a})=>a.isGroup?g(wr,{key:a.key,clsPrefix:n,tmNode:a}):a.ignored?null:g(yr,{clsPrefix:n,key:a.key,tmNode:a})}):g("div",{class:`${n}-base-select-menu-option-wrapper`,style:{paddingTop:this.padding.top,paddingBottom:this.padding.bottom}},this.flattenedNodes.map(a=>a.isGroup?g(wr,{key:a.key,clsPrefix:n,tmNode:a}):g(yr,{clsPrefix:n,key:a.key,tmNode:a})))}),Ne(e.action,a=>a&&[g("div",{class:`${n}-base-select-menu__action`,"data-action":!0,key:"action"},a),g(Wi,{onFocus:this.onTabOut,key:"focus-detector"})]))}}),xa={color:Object,type:{type:String,default:"default"},round:Boolean,size:{type:String,default:"medium"},closable:Boolean,disabled:{type:Boolean,default:void 0}},Ca=M("tag",`
 --n-close-margin: var(--n-close-margin-top) var(--n-close-margin-right) var(--n-close-margin-bottom) var(--n-close-margin-left);
 white-space: nowrap;
 position: relative;
 box-sizing: border-box;
 cursor: default;
 display: inline-flex;
 align-items: center;
 flex-wrap: nowrap;
 padding: var(--n-padding);
 border-radius: var(--n-border-radius);
 color: var(--n-text-color);
 background-color: var(--n-color);
 transition: 
 border-color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 opacity .3s var(--n-bezier);
 line-height: 1;
 height: var(--n-height);
 font-size: var(--n-font-size);
`,[q("strong",`
 font-weight: var(--n-font-weight-strong);
 `),A("border",`
 pointer-events: none;
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 border-radius: inherit;
 border: var(--n-border);
 transition: border-color .3s var(--n-bezier);
 `),A("icon",`
 display: flex;
 margin: 0 4px 0 0;
 color: var(--n-text-color);
 transition: color .3s var(--n-bezier);
 font-size: var(--n-avatar-size-override);
 `),A("avatar",`
 display: flex;
 margin: 0 6px 0 0;
 `),A("close",`
 margin: var(--n-close-margin);
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 `),q("round",`
 padding: 0 calc(var(--n-height) / 3);
 border-radius: calc(var(--n-height) / 2);
 `,[A("icon",`
 margin: 0 4px 0 calc((var(--n-height) - 8px) / -2);
 `),A("avatar",`
 margin: 0 6px 0 calc((var(--n-height) - 8px) / -2);
 `),q("closable",`
 padding: 0 calc(var(--n-height) / 4) 0 calc(var(--n-height) / 3);
 `)]),q("icon, avatar",[q("round",`
 padding: 0 calc(var(--n-height) / 3) 0 calc(var(--n-height) / 2);
 `)]),q("disabled",`
 cursor: not-allowed !important;
 opacity: var(--n-opacity-disabled);
 `),q("checkable",`
 cursor: pointer;
 box-shadow: none;
 color: var(--n-text-color-checkable);
 background-color: var(--n-color-checkable);
 `,[Me("disabled",[G("&:hover","background-color: var(--n-color-hover-checkable);",[Me("checked","color: var(--n-text-color-hover-checkable);")]),G("&:active","background-color: var(--n-color-pressed-checkable);",[Me("checked","color: var(--n-text-color-pressed-checkable);")])]),q("checked",`
 color: var(--n-text-color-checked);
 background-color: var(--n-color-checked);
 `,[Me("disabled",[G("&:hover","background-color: var(--n-color-checked-hover);"),G("&:active","background-color: var(--n-color-checked-pressed);")])])])]),ka=Object.assign(Object.assign(Object.assign({},Re.props),xa),{bordered:{type:Boolean,default:void 0},checked:Boolean,checkable:Boolean,strong:Boolean,triggerClickOnClose:Boolean,onClose:[Array,Function],onMouseenter:Function,onMouseleave:Function,"onUpdate:checked":Function,onUpdateChecked:Function,internalCloseFocusable:{type:Boolean,default:!0},internalCloseIsButtonTag:{type:Boolean,default:!0},onCheckedChange:Function}),Sa=Vt("n-tag"),Sn=me({name:"Tag",props:ka,setup(e){const t=N(null),{mergedBorderedRef:n,mergedClsPrefixRef:r,inlineThemeDisabled:o,mergedRtlRef:i}=De(e),a=Re("Tag","-tag",Ca,ai,e,r);Ye(Sa,{roundRef:fe(e,"round")});function l(y){if(!e.disabled&&e.checkable){const{checked:u,onCheckedChange:p,onUpdateChecked:F,"onUpdate:checked":b}=e;F&&F(!u),b&&b(!u),p&&p(!u)}}function s(y){if(e.triggerClickOnClose||y.stopPropagation(),!e.disabled){const{onClose:u}=e;u&&Q(u,y)}}const d={setTextContent(y){const{value:u}=t;u&&(u.textContent=y)}},c=Dt("Tag",i,r),f=$(()=>{const{type:y,size:u,color:{color:p,textColor:F}={}}=e,{common:{cubicBezierEaseInOut:b},self:{padding:C,closeMargin:w,borderRadius:m,opacityDisabled:k,textColorCheckable:S,textColorHoverCheckable:z,textColorPressedCheckable:B,textColorChecked:D,colorCheckable:L,colorHoverCheckable:ne,colorPressedCheckable:Y,colorChecked:P,colorCheckedHover:E,colorCheckedPressed:j,closeBorderRadius:K,fontWeightStrong:Z,[ae("colorBordered",y)]:U,[ae("closeSize",u)]:ee,[ae("closeIconSize",u)]:X,[ae("fontSize",u)]:de,[ae("height",u)]:T,[ae("color",y)]:_,[ae("textColor",y)]:H,[ae("border",y)]:he,[ae("closeIconColor",y)]:Ce,[ae("closeIconColorHover",y)]:Pe,[ae("closeIconColorPressed",y)]:ke,[ae("closeColorHover",y)]:be,[ae("closeColorPressed",y)]:Fe}}=a.value,ve=at(w);return{"--n-font-weight-strong":Z,"--n-avatar-size-override":`calc(${T} - 8px)`,"--n-bezier":b,"--n-border-radius":m,"--n-border":he,"--n-close-icon-size":X,"--n-close-color-pressed":Fe,"--n-close-color-hover":be,"--n-close-border-radius":K,"--n-close-icon-color":Ce,"--n-close-icon-color-hover":Pe,"--n-close-icon-color-pressed":ke,"--n-close-icon-color-disabled":Ce,"--n-close-margin-top":ve.top,"--n-close-margin-right":ve.right,"--n-close-margin-bottom":ve.bottom,"--n-close-margin-left":ve.left,"--n-close-size":ee,"--n-color":p||(n.value?U:_),"--n-color-checkable":L,"--n-color-checked":P,"--n-color-checked-hover":E,"--n-color-checked-pressed":j,"--n-color-hover-checkable":ne,"--n-color-pressed-checkable":Y,"--n-font-size":de,"--n-height":T,"--n-opacity-disabled":k,"--n-padding":C,"--n-text-color":F||H,"--n-text-color-checkable":S,"--n-text-color-checked":D,"--n-text-color-hover-checkable":z,"--n-text-color-pressed-checkable":B}}),v=o?Qe("tag",$(()=>{let y="";const{type:u,size:p,color:{color:F,textColor:b}={}}=e;return y+=u[0],y+=p[0],F&&(y+=`a${ar(F)}`),b&&(y+=`b${ar(b)}`),n.value&&(y+="c"),y}),f,e):void 0;return Object.assign(Object.assign({},d),{rtlEnabled:c,mergedClsPrefix:r,contentRef:t,mergedBordered:n,handleClick:l,handleCloseClick:s,cssVars:o?void 0:f,themeClass:v==null?void 0:v.themeClass,onRender:v==null?void 0:v.onRender})},render(){var e,t;const{mergedClsPrefix:n,rtlEnabled:r,closable:o,color:{borderColor:i}={},round:a,onRender:l,$slots:s}=this;l==null||l();const d=Ne(s.avatar,f=>f&&g("div",{class:`${n}-tag__avatar`},f)),c=Ne(s.icon,f=>f&&g("div",{class:`${n}-tag__icon`},f));return g("div",{class:[`${n}-tag`,this.themeClass,{[`${n}-tag--rtl`]:r,[`${n}-tag--strong`]:this.strong,[`${n}-tag--disabled`]:this.disabled,[`${n}-tag--checkable`]:this.checkable,[`${n}-tag--checked`]:this.checkable&&this.checked,[`${n}-tag--round`]:a,[`${n}-tag--avatar`]:d,[`${n}-tag--icon`]:c,[`${n}-tag--closable`]:o}],style:this.cssVars,onClick:this.handleClick,onMouseenter:this.onMouseenter,onMouseleave:this.onMouseleave},c||d,g("span",{class:`${n}-tag__content`,ref:"contentRef"},(t=(e=this.$slots).default)===null||t===void 0?void 0:t.call(e)),!this.checkable&&o?g(li,{clsPrefix:n,class:`${n}-tag__close`,disabled:this.disabled,onClick:this.handleCloseClick,focusable:this.internalCloseFocusable,round:a,isButtonTag:this.internalCloseIsButtonTag,absolute:!0}):null,!this.checkable&&this.mergedBordered?g("div",{class:`${n}-tag__border`,style:{borderColor:i}}):null)}}),Ra=M("base-clear",`
 flex-shrink: 0;
 height: 1em;
 width: 1em;
 position: relative;
`,[G(">",[A("clear",`
 font-size: var(--n-clear-size);
 height: 1em;
 width: 1em;
 cursor: pointer;
 color: var(--n-clear-color);
 transition: color .3s var(--n-bezier);
 display: flex;
 `,[G("&:hover",`
 color: var(--n-clear-color-hover)!important;
 `),G("&:active",`
 color: var(--n-clear-color-pressed)!important;
 `)]),A("placeholder",`
 display: flex;
 `),A("clear, placeholder",`
 position: absolute;
 left: 50%;
 top: 50%;
 transform: translateX(-50%) translateY(-50%);
 `,[Nr({originalTransform:"translateX(-50%) translateY(-50%)",left:"50%",top:"50%"})])])]),Ln=me({name:"BaseClear",props:{clsPrefix:{type:String,required:!0},show:Boolean,onClear:Function},setup(e){return Lr("-base-clear",Ra,fe(e,"clsPrefix")),{handleMouseDown(t){t.preventDefault()}}},render(){const{clsPrefix:e}=this;return g("div",{class:`${e}-base-clear`},g(Dr,null,{default:()=>{var t,n;return this.show?g("div",{key:"dismiss",class:`${e}-base-clear__clear`,onClick:this.onClear,onMousedown:this.handleMouseDown,"data-clear":!0},yt(this.$slots.icon,()=>[g(wt,{clsPrefix:e},{default:()=>g(ji,null)})])):g("div",{key:"icon",class:`${e}-base-clear__placeholder`},(n=(t=this.$slots).placeholder)===null||n===void 0?void 0:n.call(t))}}))}}),Jr=me({name:"InternalSelectionSuffix",props:{clsPrefix:{type:String,required:!0},showArrow:{type:Boolean,default:void 0},showClear:{type:Boolean,default:void 0},loading:{type:Boolean,default:!1},onClear:Function},setup(e,{slots:t}){return()=>{const{clsPrefix:n}=e;return g(Or,{clsPrefix:n,class:`${n}-base-suffix`,strokeWidth:24,scale:.85,show:e.loading},{default:()=>e.showArrow?g(Ln,{clsPrefix:n,show:e.showClear,onClear:e.onClear},{placeholder:()=>g(wt,{clsPrefix:n,class:`${n}-base-suffix__arrow`},{default:()=>yt(t.default,()=>[g(Vi,null)])})}):null})}}}),Pa=G([M("base-selection",`
 --n-padding-single: var(--n-padding-single-top) var(--n-padding-single-right) var(--n-padding-single-bottom) var(--n-padding-single-left);
 --n-padding-multiple: var(--n-padding-multiple-top) var(--n-padding-multiple-right) var(--n-padding-multiple-bottom) var(--n-padding-multiple-left);
 position: relative;
 z-index: auto;
 box-shadow: none;
 width: 100%;
 max-width: 100%;
 display: inline-block;
 vertical-align: bottom;
 border-radius: var(--n-border-radius);
 min-height: var(--n-height);
 line-height: 1.5;
 font-size: var(--n-font-size);
 `,[M("base-loading",`
 color: var(--n-loading-color);
 `),M("base-selection-tags","min-height: var(--n-height);"),A("border, state-border",`
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 pointer-events: none;
 border: var(--n-border);
 border-radius: inherit;
 transition:
 box-shadow .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `),A("state-border",`
 z-index: 1;
 border-color: #0000;
 `),M("base-suffix",`
 cursor: pointer;
 position: absolute;
 top: 50%;
 transform: translateY(-50%);
 right: 10px;
 `,[A("arrow",`
 font-size: var(--n-arrow-size);
 color: var(--n-arrow-color);
 transition: color .3s var(--n-bezier);
 `)]),M("base-selection-overlay",`
 display: flex;
 align-items: center;
 white-space: nowrap;
 pointer-events: none;
 position: absolute;
 top: 0;
 right: 0;
 bottom: 0;
 left: 0;
 padding: var(--n-padding-single);
 transition: color .3s var(--n-bezier);
 `,[A("wrapper",`
 flex-basis: 0;
 flex-grow: 1;
 overflow: hidden;
 text-overflow: ellipsis;
 `)]),M("base-selection-placeholder",`
 color: var(--n-placeholder-color);
 `,[A("inner",`
 max-width: 100%;
 overflow: hidden;
 `)]),M("base-selection-tags",`
 cursor: pointer;
 outline: none;
 box-sizing: border-box;
 position: relative;
 z-index: auto;
 display: flex;
 padding: var(--n-padding-multiple);
 flex-wrap: wrap;
 align-items: center;
 width: 100%;
 vertical-align: bottom;
 background-color: var(--n-color);
 border-radius: inherit;
 transition:
 color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 `),M("base-selection-label",`
 height: var(--n-height);
 display: inline-flex;
 width: 100%;
 vertical-align: bottom;
 cursor: pointer;
 outline: none;
 z-index: auto;
 box-sizing: border-box;
 position: relative;
 transition:
 color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 border-radius: inherit;
 background-color: var(--n-color);
 align-items: center;
 `,[M("base-selection-input",`
 font-size: inherit;
 line-height: inherit;
 outline: none;
 cursor: pointer;
 box-sizing: border-box;
 border:none;
 width: 100%;
 padding: var(--n-padding-single);
 background-color: #0000;
 color: var(--n-text-color);
 transition: color .3s var(--n-bezier);
 caret-color: var(--n-caret-color);
 `,[A("content",`
 text-overflow: ellipsis;
 overflow: hidden;
 white-space: nowrap; 
 `)]),A("render-label",`
 color: var(--n-text-color);
 `)]),Me("disabled",[G("&:hover",[A("state-border",`
 box-shadow: var(--n-box-shadow-hover);
 border: var(--n-border-hover);
 `)]),q("focus",[A("state-border",`
 box-shadow: var(--n-box-shadow-focus);
 border: var(--n-border-focus);
 `)]),q("active",[A("state-border",`
 box-shadow: var(--n-box-shadow-active);
 border: var(--n-border-active);
 `),M("base-selection-label","background-color: var(--n-color-active);"),M("base-selection-tags","background-color: var(--n-color-active);")])]),q("disabled","cursor: not-allowed;",[A("arrow",`
 color: var(--n-arrow-color-disabled);
 `),M("base-selection-label",`
 cursor: not-allowed;
 background-color: var(--n-color-disabled);
 `,[M("base-selection-input",`
 cursor: not-allowed;
 color: var(--n-text-color-disabled);
 `),A("render-label",`
 color: var(--n-text-color-disabled);
 `)]),M("base-selection-tags",`
 cursor: not-allowed;
 background-color: var(--n-color-disabled);
 `),M("base-selection-placeholder",`
 cursor: not-allowed;
 color: var(--n-placeholder-color-disabled);
 `)]),M("base-selection-input-tag",`
 height: calc(var(--n-height) - 6px);
 line-height: calc(var(--n-height) - 6px);
 outline: none;
 display: none;
 position: relative;
 margin-bottom: 3px;
 max-width: 100%;
 vertical-align: bottom;
 `,[A("input",`
 font-size: inherit;
 font-family: inherit;
 min-width: 1px;
 padding: 0;
 background-color: #0000;
 outline: none;
 border: none;
 max-width: 100%;
 overflow: hidden;
 width: 1em;
 line-height: inherit;
 cursor: pointer;
 color: var(--n-text-color);
 caret-color: var(--n-caret-color);
 `),A("mirror",`
 position: absolute;
 left: 0;
 top: 0;
 white-space: pre;
 visibility: hidden;
 user-select: none;
 -webkit-user-select: none;
 opacity: 0;
 `)]),["warning","error"].map(e=>q(`${e}-status`,[A("state-border",`border: var(--n-border-${e});`),Me("disabled",[G("&:hover",[A("state-border",`
 box-shadow: var(--n-box-shadow-hover-${e});
 border: var(--n-border-hover-${e});
 `)]),q("active",[A("state-border",`
 box-shadow: var(--n-box-shadow-active-${e});
 border: var(--n-border-active-${e});
 `),M("base-selection-label",`background-color: var(--n-color-active-${e});`),M("base-selection-tags",`background-color: var(--n-color-active-${e});`)]),q("focus",[A("state-border",`
 box-shadow: var(--n-box-shadow-focus-${e});
 border: var(--n-border-focus-${e});
 `)])])]))]),M("base-selection-popover",`
 margin-bottom: -3px;
 display: flex;
 flex-wrap: wrap;
 margin-right: -8px;
 `),M("base-selection-tag-wrapper",`
 max-width: 100%;
 display: inline-flex;
 padding: 0 7px 3px 0;
 `,[G("&:last-child","padding-right: 0;"),M("tag",`
 font-size: 14px;
 max-width: 100%;
 `,[A("content",`
 line-height: 1.25;
 text-overflow: ellipsis;
 overflow: hidden;
 `)])])]),Fa=me({name:"InternalSelection",props:Object.assign(Object.assign({},Re.props),{clsPrefix:{type:String,required:!0},bordered:{type:Boolean,default:void 0},active:Boolean,pattern:{type:String,default:""},placeholder:String,selectedOption:{type:Object,default:null},selectedOptions:{type:Array,default:null},labelField:{type:String,default:"label"},valueField:{type:String,default:"value"},multiple:Boolean,filterable:Boolean,clearable:Boolean,disabled:Boolean,size:{type:String,default:"medium"},loading:Boolean,autofocus:Boolean,showArrow:{type:Boolean,default:!0},inputProps:Object,focused:Boolean,renderTag:Function,onKeydown:Function,onClick:Function,onBlur:Function,onFocus:Function,onDeleteOption:Function,maxTagCount:[String,Number],ellipsisTagPopoverProps:Object,onClear:Function,onPatternInput:Function,onPatternFocus:Function,onPatternBlur:Function,renderLabel:Function,status:String,inlineThemeDisabled:Boolean,ignoreComposition:{type:Boolean,default:!0},onResize:Function}),setup(e){const{mergedClsPrefixRef:t,mergedRtlRef:n}=De(e),r=Dt("InternalSelection",n,t),o=N(null),i=N(null),a=N(null),l=N(null),s=N(null),d=N(null),c=N(null),f=N(null),v=N(null),y=N(null),u=N(!1),p=N(!1),F=N(!1),b=Re("InternalSelection","-internal-selection",Pa,si,e,fe(e,"clsPrefix")),C=$(()=>e.clearable&&!e.disabled&&(F.value||e.active)),w=$(()=>e.selectedOption?e.renderTag?e.renderTag({option:e.selectedOption,handleClose:()=>{}}):e.renderLabel?e.renderLabel(e.selectedOption,!0):mt(e.selectedOption[e.labelField],e.selectedOption,!0):e.placeholder),m=$(()=>{const I=e.selectedOption;if(I)return I[e.labelField]}),k=$(()=>e.multiple?!!(Array.isArray(e.selectedOptions)&&e.selectedOptions.length):e.selectedOption!==null);function S(){var I;const{value:V}=o;if(V){const{value:we}=i;we&&(we.style.width=`${V.offsetWidth}px`,e.maxTagCount!=="responsive"&&((I=v.value)===null||I===void 0||I.sync({showAllItemsBeforeCalculate:!1})))}}function z(){const{value:I}=y;I&&(I.style.display="none")}function B(){const{value:I}=y;I&&(I.style.display="inline-block")}Be(fe(e,"active"),I=>{I||z()}),Be(fe(e,"pattern"),()=>{e.multiple&&Ot(S)});function D(I){const{onFocus:V}=e;V&&V(I)}function L(I){const{onBlur:V}=e;V&&V(I)}function ne(I){const{onDeleteOption:V}=e;V&&V(I)}function Y(I){const{onClear:V}=e;V&&V(I)}function P(I){const{onPatternInput:V}=e;V&&V(I)}function E(I){var V;(!I.relatedTarget||!(!((V=a.value)===null||V===void 0)&&V.contains(I.relatedTarget)))&&D(I)}function j(I){var V;!((V=a.value)===null||V===void 0)&&V.contains(I.relatedTarget)||L(I)}function K(I){Y(I)}function Z(){F.value=!0}function U(){F.value=!1}function ee(I){!e.active||!e.filterable||I.target!==i.value&&I.preventDefault()}function X(I){ne(I)}function de(I){if(I.key==="Backspace"&&!T.value&&!e.pattern.length){const{selectedOptions:V}=e;V!=null&&V.length&&X(V[V.length-1])}}const T=N(!1);let _=null;function H(I){const{value:V}=o;if(V){const we=I.target.value;V.textContent=we,S()}e.ignoreComposition&&T.value?_=I:P(I)}function he(){T.value=!0}function Ce(){T.value=!1,e.ignoreComposition&&P(_),_=null}function Pe(I){var V;p.value=!0,(V=e.onPatternFocus)===null||V===void 0||V.call(e,I)}function ke(I){var V;p.value=!1,(V=e.onPatternBlur)===null||V===void 0||V.call(e,I)}function be(){var I,V;if(e.filterable)p.value=!1,(I=d.value)===null||I===void 0||I.blur(),(V=i.value)===null||V===void 0||V.blur();else if(e.multiple){const{value:we}=l;we==null||we.blur()}else{const{value:we}=s;we==null||we.blur()}}function Fe(){var I,V,we;e.filterable?(p.value=!1,(I=d.value)===null||I===void 0||I.focus()):e.multiple?(V=l.value)===null||V===void 0||V.focus():(we=s.value)===null||we===void 0||we.focus()}function ve(){const{value:I}=i;I&&(B(),I.focus())}function le(){const{value:I}=i;I&&I.blur()}function ye(I){const{value:V}=c;V&&V.setTextContent(`+${I}`)}function ce(){const{value:I}=f;return I}function ze(){return i.value}let je=null;function We(){je!==null&&window.clearTimeout(je)}function Oe(){e.active||(We(),je=window.setTimeout(()=>{k.value&&(u.value=!0)},100))}function tt(){We()}function nt(I){I||(We(),u.value=!1)}Be(k,I=>{I||(u.value=!1)}),lt(()=>{Bn(()=>{const I=d.value;I&&(e.disabled?I.removeAttribute("tabindex"):I.tabIndex=p.value?-1:0)})}),Hr(a,e.onResize);const{inlineThemeDisabled:Je}=e,qe=$(()=>{const{size:I}=e,{common:{cubicBezierEaseInOut:V},self:{borderRadius:we,color:Ft,placeholderColor:st,textColor:ct,paddingSingle:dt,paddingMultiple:ut,caretColor:Tt,colorDisabled:Et,textColorDisabled:ft,placeholderColorDisabled:$e,colorActive:x,boxShadowFocus:O,boxShadowActive:J,boxShadowHover:se,border:re,borderFocus:te,borderHover:oe,borderActive:xe,arrowColor:Ee,arrowColorDisabled:At,loadingColor:qt,colorActiveWarning:un,boxShadowFocusWarning:ht,boxShadowActiveWarning:gt,boxShadowHoverWarning:fn,borderWarning:hn,borderFocusWarning:Kt,borderHoverWarning:Ze,borderActiveWarning:h,colorActiveError:R,boxShadowFocusError:W,boxShadowActiveError:ge,boxShadowHoverError:pe,borderError:ue,borderFocusError:Ke,borderHoverError:Ue,borderActiveError:He,clearColor:rt,clearColorHover:ot,clearColorPressed:It,clearSize:gn,arrowSize:vn,[ae("height",I)]:bn,[ae("fontSize",I)]:pn}}=b.value,vt=at(dt),bt=at(ut);return{"--n-bezier":V,"--n-border":re,"--n-border-active":xe,"--n-border-focus":te,"--n-border-hover":oe,"--n-border-radius":we,"--n-box-shadow-active":J,"--n-box-shadow-focus":O,"--n-box-shadow-hover":se,"--n-caret-color":Tt,"--n-color":Ft,"--n-color-active":x,"--n-color-disabled":Et,"--n-font-size":pn,"--n-height":bn,"--n-padding-single-top":vt.top,"--n-padding-multiple-top":bt.top,"--n-padding-single-right":vt.right,"--n-padding-multiple-right":bt.right,"--n-padding-single-left":vt.left,"--n-padding-multiple-left":bt.left,"--n-padding-single-bottom":vt.bottom,"--n-padding-multiple-bottom":bt.bottom,"--n-placeholder-color":st,"--n-placeholder-color-disabled":$e,"--n-text-color":ct,"--n-text-color-disabled":ft,"--n-arrow-color":Ee,"--n-arrow-color-disabled":At,"--n-loading-color":qt,"--n-color-active-warning":un,"--n-box-shadow-focus-warning":ht,"--n-box-shadow-active-warning":gt,"--n-box-shadow-hover-warning":fn,"--n-border-warning":hn,"--n-border-focus-warning":Kt,"--n-border-hover-warning":Ze,"--n-border-active-warning":h,"--n-color-active-error":R,"--n-box-shadow-focus-error":W,"--n-box-shadow-active-error":ge,"--n-box-shadow-hover-error":pe,"--n-border-error":ue,"--n-border-focus-error":Ke,"--n-border-hover-error":Ue,"--n-border-active-error":He,"--n-clear-size":gn,"--n-clear-color":rt,"--n-clear-color-hover":ot,"--n-clear-color-pressed":It,"--n-arrow-size":vn}}),Te=Je?Qe("internal-selection",$(()=>e.size[0]),qe,e):void 0;return{mergedTheme:b,mergedClearable:C,mergedClsPrefix:t,rtlEnabled:r,patternInputFocused:p,filterablePlaceholder:w,label:m,selected:k,showTagsPanel:u,isComposing:T,counterRef:c,counterWrapperRef:f,patternInputMirrorRef:o,patternInputRef:i,selfRef:a,multipleElRef:l,singleElRef:s,patternInputWrapperRef:d,overflowRef:v,inputTagElRef:y,handleMouseDown:ee,handleFocusin:E,handleClear:K,handleMouseEnter:Z,handleMouseLeave:U,handleDeleteOption:X,handlePatternKeyDown:de,handlePatternInputInput:H,handlePatternInputBlur:ke,handlePatternInputFocus:Pe,handleMouseEnterCounter:Oe,handleMouseLeaveCounter:tt,handleFocusout:j,handleCompositionEnd:Ce,handleCompositionStart:he,onPopoverUpdateShow:nt,focus:Fe,focusInput:ve,blur:be,blurInput:le,updateCounter:ye,getCounter:ce,getTail:ze,renderLabel:e.renderLabel,cssVars:Je?void 0:qe,themeClass:Te==null?void 0:Te.themeClass,onRender:Te==null?void 0:Te.onRender}},render(){const{status:e,multiple:t,size:n,disabled:r,filterable:o,maxTagCount:i,bordered:a,clsPrefix:l,ellipsisTagPopoverProps:s,onRender:d,renderTag:c,renderLabel:f}=this;d==null||d();const v=i==="responsive",y=typeof i=="number",u=v||y,p=g(ci,null,{default:()=>g(Jr,{clsPrefix:l,loading:this.loading,showArrow:this.showArrow,showClear:this.mergedClearable&&this.selected,onClear:this.handleClear},{default:()=>{var b,C;return(C=(b=this.$slots).arrow)===null||C===void 0?void 0:C.call(b)}})});let F;if(t){const{labelField:b}=this,C=P=>g("div",{class:`${l}-base-selection-tag-wrapper`,key:P.value},c?c({option:P,handleClose:()=>{this.handleDeleteOption(P)}}):g(Sn,{size:n,closable:!P.disabled,disabled:r,onClose:()=>{this.handleDeleteOption(P)},internalCloseIsButtonTag:!1,internalCloseFocusable:!1},{default:()=>f?f(P,!0):mt(P[b],P,!0)})),w=()=>(y?this.selectedOptions.slice(0,i):this.selectedOptions).map(C),m=o?g("div",{class:`${l}-base-selection-input-tag`,ref:"inputTagElRef",key:"__input-tag__"},g("input",Object.assign({},this.inputProps,{ref:"patternInputRef",tabindex:-1,disabled:r,value:this.pattern,autofocus:this.autofocus,class:`${l}-base-selection-input-tag__input`,onBlur:this.handlePatternInputBlur,onFocus:this.handlePatternInputFocus,onKeydown:this.handlePatternKeyDown,onInput:this.handlePatternInputInput,onCompositionstart:this.handleCompositionStart,onCompositionend:this.handleCompositionEnd})),g("span",{ref:"patternInputMirrorRef",class:`${l}-base-selection-input-tag__mirror`},this.pattern)):null,k=v?()=>g("div",{class:`${l}-base-selection-tag-wrapper`,ref:"counterWrapperRef"},g(Sn,{size:n,ref:"counterRef",onMouseenter:this.handleMouseEnterCounter,onMouseleave:this.handleMouseLeaveCounter,disabled:r})):void 0;let S;if(y){const P=this.selectedOptions.length-i;P>0&&(S=g("div",{class:`${l}-base-selection-tag-wrapper`,key:"__counter__"},g(Sn,{size:n,ref:"counterRef",onMouseenter:this.handleMouseEnterCounter,disabled:r},{default:()=>`+${P}`})))}const z=v?o?g(br,{ref:"overflowRef",updateCounter:this.updateCounter,getCounter:this.getCounter,getTail:this.getTail,style:{width:"100%",display:"flex",overflow:"hidden"}},{default:w,counter:k,tail:()=>m}):g(br,{ref:"overflowRef",updateCounter:this.updateCounter,getCounter:this.getCounter,style:{width:"100%",display:"flex",overflow:"hidden"}},{default:w,counter:k}):y&&S?w().concat(S):w(),B=u?()=>g("div",{class:`${l}-base-selection-popover`},v?w():this.selectedOptions.map(C)):void 0,D=u?Object.assign({show:this.showTagsPanel,trigger:"hover",overlap:!0,placement:"top",width:"trigger",onUpdateShow:this.onPopoverUpdateShow,theme:this.mergedTheme.peers.Popover,themeOverrides:this.mergedTheme.peerOverrides.Popover},s):null,ne=(this.selected?!1:this.active?!this.pattern&&!this.isComposing:!0)?g("div",{class:`${l}-base-selection-placeholder ${l}-base-selection-overlay`},g("div",{class:`${l}-base-selection-placeholder__inner`},this.placeholder)):null,Y=o?g("div",{ref:"patternInputWrapperRef",class:`${l}-base-selection-tags`},z,v?null:m,p):g("div",{ref:"multipleElRef",class:`${l}-base-selection-tags`,tabindex:r?void 0:0},z,p);F=g(Vr,null,u?g(Pi,Object.assign({},D,{scrollable:!0,style:"max-height: calc(var(--v-target-height) * 6.6);"}),{trigger:()=>Y,default:B}):Y,ne)}else if(o){const b=this.pattern||this.isComposing,C=this.active?!b:!this.selected,w=this.active?!1:this.selected;F=g("div",{ref:"patternInputWrapperRef",class:`${l}-base-selection-label`,title:this.patternInputFocused?void 0:ur(this.label)},g("input",Object.assign({},this.inputProps,{ref:"patternInputRef",class:`${l}-base-selection-input`,value:this.active?this.pattern:"",placeholder:"",readonly:r,disabled:r,tabindex:-1,autofocus:this.autofocus,onFocus:this.handlePatternInputFocus,onBlur:this.handlePatternInputBlur,onInput:this.handlePatternInputInput,onCompositionstart:this.handleCompositionStart,onCompositionend:this.handleCompositionEnd})),w?g("div",{class:`${l}-base-selection-label__render-label ${l}-base-selection-overlay`,key:"input"},g("div",{class:`${l}-base-selection-overlay__wrapper`},c?c({option:this.selectedOption,handleClose:()=>{}}):f?f(this.selectedOption,!0):mt(this.label,this.selectedOption,!0))):null,C?g("div",{class:`${l}-base-selection-placeholder ${l}-base-selection-overlay`,key:"placeholder"},g("div",{class:`${l}-base-selection-overlay__wrapper`},this.filterablePlaceholder)):null,p)}else F=g("div",{ref:"singleElRef",class:`${l}-base-selection-label`,tabindex:this.disabled?void 0:0},this.label!==void 0?g("div",{class:`${l}-base-selection-input`,title:ur(this.label),key:"input"},g("div",{class:`${l}-base-selection-input__content`},c?c({option:this.selectedOption,handleClose:()=>{}}):f?f(this.selectedOption,!0):mt(this.label,this.selectedOption,!0))):g("div",{class:`${l}-base-selection-placeholder ${l}-base-selection-overlay`,key:"placeholder"},g("div",{class:`${l}-base-selection-placeholder__inner`},this.placeholder)),p);return g("div",{ref:"selfRef",class:[`${l}-base-selection`,this.rtlEnabled&&`${l}-base-selection--rtl`,this.themeClass,e&&`${l}-base-selection--${e}-status`,{[`${l}-base-selection--active`]:this.active,[`${l}-base-selection--selected`]:this.selected||this.active&&this.pattern,[`${l}-base-selection--disabled`]:this.disabled,[`${l}-base-selection--multiple`]:this.multiple,[`${l}-base-selection--focus`]:this.focused}],style:this.cssVars,onClick:this.onClick,onMouseenter:this.handleMouseEnter,onMouseleave:this.handleMouseLeave,onKeydown:this.onKeydown,onFocusin:this.handleFocusin,onFocusout:this.handleFocusout,onMousedown:this.handleMouseDown},F,a?g("div",{class:`${l}-base-selection__border`}):null,a?g("div",{class:`${l}-base-selection__state-border`}):null)}});function tn(e){return e.type==="group"}function Zr(e){return e.type==="ignored"}function Rn(e,t){try{return!!(1+t.toString().toLowerCase().indexOf(e.trim().toLowerCase()))}catch{return!1}}function Ta(e,t){return{getIsGroup:tn,getIgnored:Zr,getKey(r){return tn(r)?r.name||r.key||"key-required":r[e]},getChildren(r){return r[t]}}}function Ea(e,t,n,r){if(!t)return e;function o(i){if(!Array.isArray(i))return[];const a=[];for(const l of i)if(tn(l)){const s=o(l[r]);s.length&&a.push(Object.assign({},l,{[r]:s}))}else{if(Zr(l))continue;t(n,l)&&a.push(l)}return a}return o(e)}function Aa(e,t,n){const r=new Map;return e.forEach(o=>{tn(o)?o[n].forEach(i=>{r.set(i[t],i)}):r.set(o[t],o)}),r}const Xr=Vt("n-input");function Ia(e){let t=0;for(const n of e)t++;return t}function Ht(e){return e===""||e==null}function za(e){const t=N(null);function n(){const{value:i}=e;if(!(i!=null&&i.focus)){o();return}const{selectionStart:a,selectionEnd:l,value:s}=i;if(a==null||l==null){o();return}t.value={start:a,end:l,beforeText:s.slice(0,a),afterText:s.slice(l)}}function r(){var i;const{value:a}=t,{value:l}=e;if(!a||!l)return;const{value:s}=l,{start:d,beforeText:c,afterText:f}=a;let v=s.length;if(s.endsWith(f))v=s.length-f.length;else if(s.startsWith(c))v=c.length;else{const y=c[d-1],u=s.indexOf(y,d-1);u!==-1&&(v=u+1)}(i=l.setSelectionRange)===null||i===void 0||i.call(l,v,v)}function o(){t.value=null}return Be(e,o),{recordCursor:n,restoreCursor:r}}const xr=me({name:"InputWordCount",setup(e,{slots:t}){const{mergedValueRef:n,maxlengthRef:r,mergedClsPrefixRef:o,countGraphemesRef:i}=_e(Xr),a=$(()=>{const{value:l}=n;return l===null||Array.isArray(l)?0:(i.value||Ia)(l)});return()=>{const{value:l}=r,{value:s}=n;return g("span",{class:`${o.value}-input-word-count`},di(t.default,{value:s===null||Array.isArray(s)?"":s},()=>[l===void 0?a.value:`${a.value} / ${l}`]))}}}),Ma=M("input",`
 max-width: 100%;
 cursor: text;
 line-height: 1.5;
 z-index: auto;
 outline: none;
 box-sizing: border-box;
 position: relative;
 display: inline-flex;
 border-radius: var(--n-border-radius);
 background-color: var(--n-color);
 transition: background-color .3s var(--n-bezier);
 font-size: var(--n-font-size);
 --n-padding-vertical: calc((var(--n-height) - 1.5 * var(--n-font-size)) / 2);
`,[A("input, textarea",`
 overflow: hidden;
 flex-grow: 1;
 position: relative;
 `),A("input-el, textarea-el, input-mirror, textarea-mirror, separator, placeholder",`
 box-sizing: border-box;
 font-size: inherit;
 line-height: 1.5;
 font-family: inherit;
 border: none;
 outline: none;
 background-color: #0000;
 text-align: inherit;
 transition:
 -webkit-text-fill-color .3s var(--n-bezier),
 caret-color .3s var(--n-bezier),
 color .3s var(--n-bezier),
 text-decoration-color .3s var(--n-bezier);
 `),A("input-el, textarea-el",`
 -webkit-appearance: none;
 scrollbar-width: none;
 width: 100%;
 min-width: 0;
 text-decoration-color: var(--n-text-decoration-color);
 color: var(--n-text-color);
 caret-color: var(--n-caret-color);
 background-color: transparent;
 `,[G("&::-webkit-scrollbar, &::-webkit-scrollbar-track-piece, &::-webkit-scrollbar-thumb",`
 width: 0;
 height: 0;
 display: none;
 `),G("&::placeholder",`
 color: #0000;
 -webkit-text-fill-color: transparent !important;
 `),G("&:-webkit-autofill ~",[A("placeholder","display: none;")])]),q("round",[Me("textarea","border-radius: calc(var(--n-height) / 2);")]),A("placeholder",`
 pointer-events: none;
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 overflow: hidden;
 color: var(--n-placeholder-color);
 `,[G("span",`
 width: 100%;
 display: inline-block;
 `)]),q("textarea",[A("placeholder","overflow: visible;")]),Me("autosize","width: 100%;"),q("autosize",[A("textarea-el, input-el",`
 position: absolute;
 top: 0;
 left: 0;
 height: 100%;
 `)]),M("input-wrapper",`
 overflow: hidden;
 display: inline-flex;
 flex-grow: 1;
 position: relative;
 padding-left: var(--n-padding-left);
 padding-right: var(--n-padding-right);
 `),A("input-mirror",`
 padding: 0;
 height: var(--n-height);
 line-height: var(--n-height);
 overflow: hidden;
 visibility: hidden;
 position: static;
 white-space: pre;
 pointer-events: none;
 `),A("input-el",`
 padding: 0;
 height: var(--n-height);
 line-height: var(--n-height);
 `,[G("&[type=password]::-ms-reveal","display: none;"),G("+",[A("placeholder",`
 display: flex;
 align-items: center; 
 `)])]),Me("textarea",[A("placeholder","white-space: nowrap;")]),A("eye",`
 display: flex;
 align-items: center;
 justify-content: center;
 transition: color .3s var(--n-bezier);
 `),q("textarea","width: 100%;",[M("input-word-count",`
 position: absolute;
 right: var(--n-padding-right);
 bottom: var(--n-padding-vertical);
 `),q("resizable",[M("input-wrapper",`
 resize: vertical;
 min-height: var(--n-height);
 `)]),A("textarea-el, textarea-mirror, placeholder",`
 height: 100%;
 padding-left: 0;
 padding-right: 0;
 padding-top: var(--n-padding-vertical);
 padding-bottom: var(--n-padding-vertical);
 word-break: break-word;
 display: inline-block;
 vertical-align: bottom;
 box-sizing: border-box;
 line-height: var(--n-line-height-textarea);
 margin: 0;
 resize: none;
 white-space: pre-wrap;
 scroll-padding-block-end: var(--n-padding-vertical);
 `),A("textarea-mirror",`
 width: 100%;
 pointer-events: none;
 overflow: hidden;
 visibility: hidden;
 position: static;
 white-space: pre-wrap;
 overflow-wrap: break-word;
 `)]),q("pair",[A("input-el, placeholder","text-align: center;"),A("separator",`
 display: flex;
 align-items: center;
 transition: color .3s var(--n-bezier);
 color: var(--n-text-color);
 white-space: nowrap;
 `,[M("icon",`
 color: var(--n-icon-color);
 `),M("base-icon",`
 color: var(--n-icon-color);
 `)])]),q("disabled",`
 cursor: not-allowed;
 background-color: var(--n-color-disabled);
 `,[A("border","border: var(--n-border-disabled);"),A("input-el, textarea-el",`
 cursor: not-allowed;
 color: var(--n-text-color-disabled);
 text-decoration-color: var(--n-text-color-disabled);
 `),A("placeholder","color: var(--n-placeholder-color-disabled);"),A("separator","color: var(--n-text-color-disabled);",[M("icon",`
 color: var(--n-icon-color-disabled);
 `),M("base-icon",`
 color: var(--n-icon-color-disabled);
 `)]),M("input-word-count",`
 color: var(--n-count-text-color-disabled);
 `),A("suffix, prefix","color: var(--n-text-color-disabled);",[M("icon",`
 color: var(--n-icon-color-disabled);
 `),M("internal-icon",`
 color: var(--n-icon-color-disabled);
 `)])]),Me("disabled",[A("eye",`
 color: var(--n-icon-color);
 cursor: pointer;
 `,[G("&:hover",`
 color: var(--n-icon-color-hover);
 `),G("&:active",`
 color: var(--n-icon-color-pressed);
 `)]),G("&:hover",[A("state-border","border: var(--n-border-hover);")]),q("focus","background-color: var(--n-color-focus);",[A("state-border",`
 border: var(--n-border-focus);
 box-shadow: var(--n-box-shadow-focus);
 `)])]),A("border, state-border",`
 box-sizing: border-box;
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 pointer-events: none;
 border-radius: inherit;
 border: var(--n-border);
 transition:
 box-shadow .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `),A("state-border",`
 border-color: #0000;
 z-index: 1;
 `),A("prefix","margin-right: 4px;"),A("suffix",`
 margin-left: 4px;
 `),A("suffix, prefix",`
 transition: color .3s var(--n-bezier);
 flex-wrap: nowrap;
 flex-shrink: 0;
 line-height: var(--n-height);
 white-space: nowrap;
 display: inline-flex;
 align-items: center;
 justify-content: center;
 color: var(--n-suffix-text-color);
 `,[M("base-loading",`
 font-size: var(--n-icon-size);
 margin: 0 2px;
 color: var(--n-loading-color);
 `),M("base-clear",`
 font-size: var(--n-icon-size);
 `,[A("placeholder",[M("base-icon",`
 transition: color .3s var(--n-bezier);
 color: var(--n-icon-color);
 font-size: var(--n-icon-size);
 `)])]),G(">",[M("icon",`
 transition: color .3s var(--n-bezier);
 color: var(--n-icon-color);
 font-size: var(--n-icon-size);
 `)]),M("base-icon",`
 font-size: var(--n-icon-size);
 `)]),M("input-word-count",`
 pointer-events: none;
 line-height: 1.5;
 font-size: .85em;
 color: var(--n-count-text-color);
 transition: color .3s var(--n-bezier);
 margin-left: 4px;
 font-variant: tabular-nums;
 `),["warning","error"].map(e=>q(`${e}-status`,[Me("disabled",[M("base-loading",`
 color: var(--n-loading-color-${e})
 `),A("input-el, textarea-el",`
 caret-color: var(--n-caret-color-${e});
 `),A("state-border",`
 border: var(--n-border-${e});
 `),G("&:hover",[A("state-border",`
 border: var(--n-border-hover-${e});
 `)]),G("&:focus",`
 background-color: var(--n-color-focus-${e});
 `,[A("state-border",`
 box-shadow: var(--n-box-shadow-focus-${e});
 border: var(--n-border-focus-${e});
 `)]),q("focus",`
 background-color: var(--n-color-focus-${e});
 `,[A("state-border",`
 box-shadow: var(--n-box-shadow-focus-${e});
 border: var(--n-border-focus-${e});
 `)])])]))]),Ba=M("input",[q("disabled",[A("input-el, textarea-el",`
 -webkit-text-fill-color: var(--n-text-color-disabled);
 `)])]),_a=Object.assign(Object.assign({},Re.props),{bordered:{type:Boolean,default:void 0},type:{type:String,default:"text"},placeholder:[Array,String],defaultValue:{type:[String,Array],default:null},value:[String,Array],disabled:{type:Boolean,default:void 0},size:String,rows:{type:[Number,String],default:3},round:Boolean,minlength:[String,Number],maxlength:[String,Number],clearable:Boolean,autosize:{type:[Boolean,Object],default:!1},pair:Boolean,separator:String,readonly:{type:[String,Boolean],default:!1},passivelyActivated:Boolean,showPasswordOn:String,stateful:{type:Boolean,default:!0},autofocus:Boolean,inputProps:Object,resizable:{type:Boolean,default:!0},showCount:Boolean,loading:{type:Boolean,default:void 0},allowInput:Function,renderCount:Function,onMousedown:Function,onKeydown:Function,onKeyup:[Function,Array],onInput:[Function,Array],onFocus:[Function,Array],onBlur:[Function,Array],onClick:[Function,Array],onChange:[Function,Array],onClear:[Function,Array],countGraphemes:Function,status:String,"onUpdate:value":[Function,Array],onUpdateValue:[Function,Array],textDecoration:[String,Array],attrSize:{type:Number,default:20},onInputBlur:[Function,Array],onInputFocus:[Function,Array],onDeactivate:[Function,Array],onActivate:[Function,Array],onWrapperFocus:[Function,Array],onWrapperBlur:[Function,Array],internalDeactivateOnEnter:Boolean,internalForceFocus:Boolean,internalLoadingBeforeSuffix:{type:Boolean,default:!0},showPasswordToggle:Boolean}),ws=me({name:"Input",props:_a,setup(e){const{mergedClsPrefixRef:t,mergedBorderedRef:n,inlineThemeDisabled:r,mergedRtlRef:o}=De(e),i=Re("Input","-input",Ma,ui,e,t);fi&&Lr("-input-safari",Ba,t);const a=N(null),l=N(null),s=N(null),d=N(null),c=N(null),f=N(null),v=N(null),y=za(v),u=N(null),{localeRef:p}=Zn("Input"),F=N(e.defaultValue),b=fe(e,"value"),C=$t(b,F),w=on(e),{mergedSizeRef:m,mergedDisabledRef:k,mergedStatusRef:S}=w,z=N(!1),B=N(!1),D=N(!1),L=N(!1);let ne=null;const Y=$(()=>{const{placeholder:h,pair:R}=e;return R?Array.isArray(h)?h:h===void 0?["",""]:[h,h]:h===void 0?[p.value.placeholder]:[h]}),P=$(()=>{const{value:h}=D,{value:R}=C,{value:W}=Y;return!h&&(Ht(R)||Array.isArray(R)&&Ht(R[0]))&&W[0]}),E=$(()=>{const{value:h}=D,{value:R}=C,{value:W}=Y;return!h&&W[1]&&(Ht(R)||Array.isArray(R)&&Ht(R[1]))}),j=Le(()=>e.internalForceFocus||z.value),K=Le(()=>{if(k.value||e.readonly||!e.clearable||!j.value&&!B.value)return!1;const{value:h}=C,{value:R}=j;return e.pair?!!(Array.isArray(h)&&(h[0]||h[1]))&&(B.value||R):!!h&&(B.value||R)}),Z=$(()=>{const{showPasswordOn:h}=e;if(h)return h;if(e.showPasswordToggle)return"click"}),U=N(!1),ee=$(()=>{const{textDecoration:h}=e;return h?Array.isArray(h)?h.map(R=>({textDecoration:R})):[{textDecoration:h}]:["",""]}),X=N(void 0),de=()=>{var h,R;if(e.type==="textarea"){const{autosize:W}=e;if(W&&(X.value=(R=(h=u.value)===null||h===void 0?void 0:h.$el)===null||R===void 0?void 0:R.offsetWidth),!l.value||typeof W=="boolean")return;const{paddingTop:ge,paddingBottom:pe,lineHeight:ue}=window.getComputedStyle(l.value),Ke=Number(ge.slice(0,-2)),Ue=Number(pe.slice(0,-2)),He=Number(ue.slice(0,-2)),{value:rt}=s;if(!rt)return;if(W.minRows){const ot=Math.max(W.minRows,1),It=`${Ke+Ue+He*ot}px`;rt.style.minHeight=It}if(W.maxRows){const ot=`${Ke+Ue+He*W.maxRows}px`;rt.style.maxHeight=ot}}},T=$(()=>{const{maxlength:h}=e;return h===void 0?void 0:Number(h)});lt(()=>{const{value:h}=C;Array.isArray(h)||Ee(h)});const _=Mr().proxy;function H(h,R){const{onUpdateValue:W,"onUpdate:value":ge,onInput:pe}=e,{nTriggerFormInput:ue}=w;W&&Q(W,h,R),ge&&Q(ge,h,R),pe&&Q(pe,h,R),F.value=h,ue()}function he(h,R){const{onChange:W}=e,{nTriggerFormChange:ge}=w;W&&Q(W,h,R),F.value=h,ge()}function Ce(h){const{onBlur:R}=e,{nTriggerFormBlur:W}=w;R&&Q(R,h),W()}function Pe(h){const{onFocus:R}=e,{nTriggerFormFocus:W}=w;R&&Q(R,h),W()}function ke(h){const{onClear:R}=e;R&&Q(R,h)}function be(h){const{onInputBlur:R}=e;R&&Q(R,h)}function Fe(h){const{onInputFocus:R}=e;R&&Q(R,h)}function ve(){const{onDeactivate:h}=e;h&&Q(h)}function le(){const{onActivate:h}=e;h&&Q(h)}function ye(h){const{onClick:R}=e;R&&Q(R,h)}function ce(h){const{onWrapperFocus:R}=e;R&&Q(R,h)}function ze(h){const{onWrapperBlur:R}=e;R&&Q(R,h)}function je(){D.value=!0}function We(h){D.value=!1,h.target===f.value?Oe(h,1):Oe(h,0)}function Oe(h,R=0,W="input"){const ge=h.target.value;if(Ee(ge),h instanceof InputEvent&&!h.isComposing&&(D.value=!1),e.type==="textarea"){const{value:ue}=u;ue&&ue.syncUnifiedContainer()}if(ne=ge,D.value)return;y.recordCursor();const pe=tt(ge);if(pe)if(!e.pair)W==="input"?H(ge,{source:R}):he(ge,{source:R});else{let{value:ue}=C;Array.isArray(ue)?ue=[ue[0],ue[1]]:ue=["",""],ue[R]=ge,W==="input"?H(ue,{source:R}):he(ue,{source:R})}_.$forceUpdate(),pe||Ot(y.restoreCursor)}function tt(h){const{countGraphemes:R,maxlength:W,minlength:ge}=e;if(R){let ue;if(W!==void 0&&(ue===void 0&&(ue=R(h)),ue>Number(W))||ge!==void 0&&(ue===void 0&&(ue=R(h)),ue<Number(W)))return!1}const{allowInput:pe}=e;return typeof pe=="function"?pe(h):!0}function nt(h){be(h),h.relatedTarget===a.value&&ve(),h.relatedTarget!==null&&(h.relatedTarget===c.value||h.relatedTarget===f.value||h.relatedTarget===l.value)||(L.value=!1),I(h,"blur"),v.value=null}function Je(h,R){Fe(h),z.value=!0,L.value=!0,le(),I(h,"focus"),R===0?v.value=c.value:R===1?v.value=f.value:R===2&&(v.value=l.value)}function qe(h){e.passivelyActivated&&(ze(h),I(h,"blur"))}function Te(h){e.passivelyActivated&&(z.value=!0,ce(h),I(h,"focus"))}function I(h,R){h.relatedTarget!==null&&(h.relatedTarget===c.value||h.relatedTarget===f.value||h.relatedTarget===l.value||h.relatedTarget===a.value)||(R==="focus"?(Pe(h),z.value=!0):R==="blur"&&(Ce(h),z.value=!1))}function V(h,R){Oe(h,R,"change")}function we(h){ye(h)}function Ft(h){ke(h),st()}function st(){e.pair?(H(["",""],{source:"clear"}),he(["",""],{source:"clear"})):(H("",{source:"clear"}),he("",{source:"clear"}))}function ct(h){const{onMousedown:R}=e;R&&R(h);const{tagName:W}=h.target;if(W!=="INPUT"&&W!=="TEXTAREA"){if(e.resizable){const{value:ge}=a;if(ge){const{left:pe,top:ue,width:Ke,height:Ue}=ge.getBoundingClientRect(),He=14;if(pe+Ke-He<h.clientX&&h.clientX<pe+Ke&&ue+Ue-He<h.clientY&&h.clientY<ue+Ue)return}}h.preventDefault(),z.value||J()}}function dt(){var h;B.value=!0,e.type==="textarea"&&((h=u.value)===null||h===void 0||h.handleMouseEnterWrapper())}function ut(){var h;B.value=!1,e.type==="textarea"&&((h=u.value)===null||h===void 0||h.handleMouseLeaveWrapper())}function Tt(){k.value||Z.value==="click"&&(U.value=!U.value)}function Et(h){if(k.value)return;h.preventDefault();const R=ge=>{ge.preventDefault(),lr("mouseup",document,R)};if(_n("mouseup",document,R),Z.value!=="mousedown")return;U.value=!0;const W=()=>{U.value=!1,lr("mouseup",document,W)};_n("mouseup",document,W)}function ft(h){e.onKeyup&&Q(e.onKeyup,h)}function $e(h){switch(e.onKeydown&&Q(e.onKeydown,h),h.key){case"Escape":O();break;case"Enter":x(h);break}}function x(h){var R,W;if(e.passivelyActivated){const{value:ge}=L;if(ge){e.internalDeactivateOnEnter&&O();return}h.preventDefault(),e.type==="textarea"?(R=l.value)===null||R===void 0||R.focus():(W=c.value)===null||W===void 0||W.focus()}}function O(){e.passivelyActivated&&(L.value=!1,Ot(()=>{var h;(h=a.value)===null||h===void 0||h.focus()}))}function J(){var h,R,W;k.value||(e.passivelyActivated?(h=a.value)===null||h===void 0||h.focus():((R=l.value)===null||R===void 0||R.focus(),(W=c.value)===null||W===void 0||W.focus()))}function se(){var h;!((h=a.value)===null||h===void 0)&&h.contains(document.activeElement)&&document.activeElement.blur()}function re(){var h,R;(h=l.value)===null||h===void 0||h.select(),(R=c.value)===null||R===void 0||R.select()}function te(){k.value||(l.value?l.value.focus():c.value&&c.value.focus())}function oe(){const{value:h}=a;h!=null&&h.contains(document.activeElement)&&h!==document.activeElement&&O()}function xe(h){if(e.type==="textarea"){const{value:R}=l;R==null||R.scrollTo(h)}else{const{value:R}=c;R==null||R.scrollTo(h)}}function Ee(h){const{type:R,pair:W,autosize:ge}=e;if(!W&&ge)if(R==="textarea"){const{value:pe}=s;pe&&(pe.textContent=(h??"")+`\r
`)}else{const{value:pe}=d;pe&&(h?pe.textContent=h:pe.innerHTML="&nbsp;")}}function At(){de()}const qt=N({top:"0"});function un(h){var R;const{scrollTop:W}=h.target;qt.value.top=`${-W}px`,(R=u.value)===null||R===void 0||R.syncUnifiedContainer()}let ht=null;Bn(()=>{const{autosize:h,type:R}=e;h&&R==="textarea"?ht=Be(C,W=>{!Array.isArray(W)&&W!==ne&&Ee(W)}):ht==null||ht()});let gt=null;Bn(()=>{e.type==="textarea"?gt=Be(C,h=>{var R;!Array.isArray(h)&&h!==ne&&((R=u.value)===null||R===void 0||R.syncUnifiedContainer())}):gt==null||gt()}),Ye(Xr,{mergedValueRef:C,maxlengthRef:T,mergedClsPrefixRef:t,countGraphemesRef:fe(e,"countGraphemes")});const fn={wrapperElRef:a,inputElRef:c,textareaElRef:l,isCompositing:D,clear:st,focus:J,blur:se,select:re,deactivate:oe,activate:te,scrollTo:xe},hn=Dt("Input",o,t),Kt=$(()=>{const{value:h}=m,{common:{cubicBezierEaseInOut:R},self:{color:W,borderRadius:ge,textColor:pe,caretColor:ue,caretColorError:Ke,caretColorWarning:Ue,textDecorationColor:He,border:rt,borderDisabled:ot,borderHover:It,borderFocus:gn,placeholderColor:vn,placeholderColorDisabled:bn,lineHeightTextarea:pn,colorDisabled:vt,colorFocus:bt,textColorDisabled:yo,boxShadowFocus:wo,iconSize:xo,colorFocusWarning:Co,boxShadowFocusWarning:ko,borderWarning:So,borderFocusWarning:Ro,borderHoverWarning:Po,colorFocusError:Fo,boxShadowFocusError:To,borderError:Eo,borderFocusError:Ao,borderHoverError:Io,clearSize:zo,clearColor:Mo,clearColorHover:Bo,clearColorPressed:_o,iconColor:Oo,iconColorDisabled:$o,suffixTextColor:No,countTextColor:Lo,countTextColorDisabled:Do,iconColorHover:Vo,iconColorPressed:jo,loadingColor:Wo,loadingColorError:qo,loadingColorWarning:Ko,[ae("padding",h)]:Uo,[ae("fontSize",h)]:Ho,[ae("height",h)]:Go}}=i.value,{left:Yo,right:Jo}=at(Uo);return{"--n-bezier":R,"--n-count-text-color":Lo,"--n-count-text-color-disabled":Do,"--n-color":W,"--n-font-size":Ho,"--n-border-radius":ge,"--n-height":Go,"--n-padding-left":Yo,"--n-padding-right":Jo,"--n-text-color":pe,"--n-caret-color":ue,"--n-text-decoration-color":He,"--n-border":rt,"--n-border-disabled":ot,"--n-border-hover":It,"--n-border-focus":gn,"--n-placeholder-color":vn,"--n-placeholder-color-disabled":bn,"--n-icon-size":xo,"--n-line-height-textarea":pn,"--n-color-disabled":vt,"--n-color-focus":bt,"--n-text-color-disabled":yo,"--n-box-shadow-focus":wo,"--n-loading-color":Wo,"--n-caret-color-warning":Ue,"--n-color-focus-warning":Co,"--n-box-shadow-focus-warning":ko,"--n-border-warning":So,"--n-border-focus-warning":Ro,"--n-border-hover-warning":Po,"--n-loading-color-warning":Ko,"--n-caret-color-error":Ke,"--n-color-focus-error":Fo,"--n-box-shadow-focus-error":To,"--n-border-error":Eo,"--n-border-focus-error":Ao,"--n-border-hover-error":Io,"--n-loading-color-error":qo,"--n-clear-color":Mo,"--n-clear-size":zo,"--n-clear-color-hover":Bo,"--n-clear-color-pressed":_o,"--n-icon-color":Oo,"--n-icon-color-hover":Vo,"--n-icon-color-pressed":jo,"--n-icon-color-disabled":$o,"--n-suffix-text-color":No}}),Ze=r?Qe("input",$(()=>{const{value:h}=m;return h[0]}),Kt,e):void 0;return Object.assign(Object.assign({},fn),{wrapperElRef:a,inputElRef:c,inputMirrorElRef:d,inputEl2Ref:f,textareaElRef:l,textareaMirrorElRef:s,textareaScrollbarInstRef:u,rtlEnabled:hn,uncontrolledValue:F,mergedValue:C,passwordVisible:U,mergedPlaceholder:Y,showPlaceholder1:P,showPlaceholder2:E,mergedFocus:j,isComposing:D,activated:L,showClearButton:K,mergedSize:m,mergedDisabled:k,textDecorationStyle:ee,mergedClsPrefix:t,mergedBordered:n,mergedShowPasswordOn:Z,placeholderStyle:qt,mergedStatus:S,textAreaScrollContainerWidth:X,handleTextAreaScroll:un,handleCompositionStart:je,handleCompositionEnd:We,handleInput:Oe,handleInputBlur:nt,handleInputFocus:Je,handleWrapperBlur:qe,handleWrapperFocus:Te,handleMouseEnter:dt,handleMouseLeave:ut,handleMouseDown:ct,handleChange:V,handleClick:we,handleClear:Ft,handlePasswordToggleClick:Tt,handlePasswordToggleMousedown:Et,handleWrapperKeydown:$e,handleWrapperKeyup:ft,handleTextAreaMirrorResize:At,getTextareaScrollContainer:()=>l.value,mergedTheme:i,cssVars:r?void 0:Kt,themeClass:Ze==null?void 0:Ze.themeClass,onRender:Ze==null?void 0:Ze.onRender})},render(){var e,t;const{mergedClsPrefix:n,mergedStatus:r,themeClass:o,type:i,countGraphemes:a,onRender:l}=this,s=this.$slots;return l==null||l(),g("div",{ref:"wrapperElRef",class:[`${n}-input`,o,r&&`${n}-input--${r}-status`,{[`${n}-input--rtl`]:this.rtlEnabled,[`${n}-input--disabled`]:this.mergedDisabled,[`${n}-input--textarea`]:i==="textarea",[`${n}-input--resizable`]:this.resizable&&!this.autosize,[`${n}-input--autosize`]:this.autosize,[`${n}-input--round`]:this.round&&i!=="textarea",[`${n}-input--pair`]:this.pair,[`${n}-input--focus`]:this.mergedFocus,[`${n}-input--stateful`]:this.stateful}],style:this.cssVars,tabindex:!this.mergedDisabled&&this.passivelyActivated&&!this.activated?0:void 0,onFocus:this.handleWrapperFocus,onBlur:this.handleWrapperBlur,onClick:this.handleClick,onMousedown:this.handleMouseDown,onMouseenter:this.handleMouseEnter,onMouseleave:this.handleMouseLeave,onCompositionstart:this.handleCompositionStart,onCompositionend:this.handleCompositionEnd,onKeyup:this.handleWrapperKeyup,onKeydown:this.handleWrapperKeydown},g("div",{class:`${n}-input-wrapper`},Ne(s.prefix,d=>d&&g("div",{class:`${n}-input__prefix`},d)),i==="textarea"?g($r,{ref:"textareaScrollbarInstRef",class:`${n}-input__textarea`,container:this.getTextareaScrollContainer,triggerDisplayManually:!0,useUnifiedContainer:!0,internalHoistYRail:!0},{default:()=>{var d,c;const{textAreaScrollContainerWidth:f}=this,v={width:this.autosize&&f&&`${f}px`};return g(Vr,null,g("textarea",Object.assign({},this.inputProps,{ref:"textareaElRef",class:[`${n}-input__textarea-el`,(d=this.inputProps)===null||d===void 0?void 0:d.class],autofocus:this.autofocus,rows:Number(this.rows),placeholder:this.placeholder,value:this.mergedValue,disabled:this.mergedDisabled,maxlength:a?void 0:this.maxlength,minlength:a?void 0:this.minlength,readonly:this.readonly,tabindex:this.passivelyActivated&&!this.activated?-1:void 0,style:[this.textDecorationStyle[0],(c=this.inputProps)===null||c===void 0?void 0:c.style,v],onBlur:this.handleInputBlur,onFocus:y=>{this.handleInputFocus(y,2)},onInput:this.handleInput,onChange:this.handleChange,onScroll:this.handleTextAreaScroll})),this.showPlaceholder1?g("div",{class:`${n}-input__placeholder`,style:[this.placeholderStyle,v],key:"placeholder"},this.mergedPlaceholder[0]):null,this.autosize?g(Mn,{onResize:this.handleTextAreaMirrorResize},{default:()=>g("div",{ref:"textareaMirrorElRef",class:`${n}-input__textarea-mirror`,key:"mirror"})}):null)}}):g("div",{class:`${n}-input__input`},g("input",Object.assign({type:i==="password"&&this.mergedShowPasswordOn&&this.passwordVisible?"text":i},this.inputProps,{ref:"inputElRef",class:[`${n}-input__input-el`,(e=this.inputProps)===null||e===void 0?void 0:e.class],style:[this.textDecorationStyle[0],(t=this.inputProps)===null||t===void 0?void 0:t.style],tabindex:this.passivelyActivated&&!this.activated?-1:void 0,placeholder:this.mergedPlaceholder[0],disabled:this.mergedDisabled,maxlength:a?void 0:this.maxlength,minlength:a?void 0:this.minlength,value:Array.isArray(this.mergedValue)?this.mergedValue[0]:this.mergedValue,readonly:this.readonly,autofocus:this.autofocus,size:this.attrSize,onBlur:this.handleInputBlur,onFocus:d=>{this.handleInputFocus(d,0)},onInput:d=>{this.handleInput(d,0)},onChange:d=>{this.handleChange(d,0)}})),this.showPlaceholder1?g("div",{class:`${n}-input__placeholder`},g("span",null,this.mergedPlaceholder[0])):null,this.autosize?g("div",{class:`${n}-input__input-mirror`,key:"mirror",ref:"inputMirrorElRef"}," "):null),!this.pair&&Ne(s.suffix,d=>d||this.clearable||this.showCount||this.mergedShowPasswordOn||this.loading!==void 0?g("div",{class:`${n}-input__suffix`},[Ne(s["clear-icon-placeholder"],c=>(this.clearable||c)&&g(Ln,{clsPrefix:n,show:this.showClearButton,onClear:this.handleClear},{placeholder:()=>c,icon:()=>{var f,v;return(v=(f=this.$slots)["clear-icon"])===null||v===void 0?void 0:v.call(f)}})),this.internalLoadingBeforeSuffix?null:d,this.loading!==void 0?g(Jr,{clsPrefix:n,loading:this.loading,showArrow:!1,showClear:!1,style:this.cssVars}):null,this.internalLoadingBeforeSuffix?d:null,this.showCount&&this.type!=="textarea"?g(xr,null,{default:c=>{var f;return(f=s.count)===null||f===void 0?void 0:f.call(s,c)}}):null,this.mergedShowPasswordOn&&this.type==="password"?g("div",{class:`${n}-input__eye`,onMousedown:this.handlePasswordToggleMousedown,onClick:this.handlePasswordToggleClick},this.passwordVisible?yt(s["password-visible-icon"],()=>[g(wt,{clsPrefix:n},{default:()=>g(Ni,null)})]):yt(s["password-invisible-icon"],()=>[g(wt,{clsPrefix:n},{default:()=>g(Li,null)})])):null]):null)),this.pair?g("span",{class:`${n}-input__separator`},yt(s.separator,()=>[this.separator])):null,this.pair?g("div",{class:`${n}-input-wrapper`},g("div",{class:`${n}-input__input`},g("input",{ref:"inputEl2Ref",type:this.type,class:`${n}-input__input-el`,tabindex:this.passivelyActivated&&!this.activated?-1:void 0,placeholder:this.mergedPlaceholder[1],disabled:this.mergedDisabled,maxlength:a?void 0:this.maxlength,minlength:a?void 0:this.minlength,value:Array.isArray(this.mergedValue)?this.mergedValue[1]:void 0,readonly:this.readonly,style:this.textDecorationStyle[1],onBlur:this.handleInputBlur,onFocus:d=>{this.handleInputFocus(d,1)},onInput:d=>{this.handleInput(d,1)},onChange:d=>{this.handleChange(d,1)}}),this.showPlaceholder2?g("div",{class:`${n}-input__placeholder`},g("span",null,this.mergedPlaceholder[1])):null),Ne(s.suffix,d=>(this.clearable||d)&&g("div",{class:`${n}-input__suffix`},[this.clearable&&g(Ln,{clsPrefix:n,show:this.showClearButton,onClear:this.handleClear},{icon:()=>{var c;return(c=s["clear-icon"])===null||c===void 0?void 0:c.call(s)},placeholder:()=>{var c;return(c=s["clear-icon-placeholder"])===null||c===void 0?void 0:c.call(s)}}),d]))):null,this.mergedBordered?g("div",{class:`${n}-input__border`}):null,this.mergedBordered?g("div",{class:`${n}-input__state-border`}):null,this.showCount&&i==="textarea"?g(xr,null,{default:d=>{var c;const{renderCount:f}=this;return f?f(d):(c=s.count)===null||c===void 0?void 0:c.call(s,d)}}):null)}}),Oa=g("svg",{viewBox:"0 0 64 64",class:"check-icon"},g("path",{d:"M50.42,16.76L22.34,39.45l-8.1-11.46c-1.12-1.58-3.3-1.96-4.88-0.84c-1.58,1.12-1.95,3.3-0.84,4.88l10.26,14.51  c0.56,0.79,1.42,1.31,2.38,1.45c0.16,0.02,0.32,0.03,0.48,0.03c0.8,0,1.57-0.27,2.2-0.78l30.99-25.03c1.5-1.21,1.74-3.42,0.52-4.92  C54.13,15.78,51.93,15.55,50.42,16.76z"})),$a=g("svg",{viewBox:"0 0 100 100",class:"line-icon"},g("path",{d:"M80.2,55.5H21.4c-2.8,0-5.1-2.5-5.1-5.5l0,0c0-3,2.3-5.5,5.1-5.5h58.7c2.8,0,5.1,2.5,5.1,5.5l0,0C85.2,53.1,82.9,55.5,80.2,55.5z"})),Qr=Vt("n-checkbox-group"),Na={min:Number,max:Number,size:String,value:Array,defaultValue:{type:Array,default:null},disabled:{type:Boolean,default:void 0},"onUpdate:value":[Function,Array],onUpdateValue:[Function,Array],onChange:[Function,Array]},xs=me({name:"CheckboxGroup",props:Na,setup(e){const{mergedClsPrefixRef:t}=De(e),n=on(e),{mergedSizeRef:r,mergedDisabledRef:o}=n,i=N(e.defaultValue),a=$(()=>e.value),l=$t(a,i),s=$(()=>{var f;return((f=l.value)===null||f===void 0?void 0:f.length)||0}),d=$(()=>Array.isArray(l.value)?new Set(l.value):new Set);function c(f,v){const{nTriggerFormInput:y,nTriggerFormChange:u}=n,{onChange:p,"onUpdate:value":F,onUpdateValue:b}=e;if(Array.isArray(l.value)){const C=Array.from(l.value),w=C.findIndex(m=>m===v);f?~w||(C.push(v),b&&Q(b,C,{actionType:"check",value:v}),F&&Q(F,C,{actionType:"check",value:v}),y(),u(),i.value=C,p&&Q(p,C)):~w&&(C.splice(w,1),b&&Q(b,C,{actionType:"uncheck",value:v}),F&&Q(F,C,{actionType:"uncheck",value:v}),p&&Q(p,C),i.value=C,y(),u())}else f?(b&&Q(b,[v],{actionType:"check",value:v}),F&&Q(F,[v],{actionType:"check",value:v}),p&&Q(p,[v]),i.value=[v],y(),u()):(b&&Q(b,[],{actionType:"uncheck",value:v}),F&&Q(F,[],{actionType:"uncheck",value:v}),p&&Q(p,[]),i.value=[],y(),u())}return Ye(Qr,{checkedCountRef:s,maxRef:fe(e,"max"),minRef:fe(e,"min"),valueSetRef:d,disabledRef:o,mergedSizeRef:r,toggleCheckbox:c}),{mergedClsPrefix:t}},render(){return g("div",{class:`${this.mergedClsPrefix}-checkbox-group`,role:"group"},this.$slots)}}),La=G([M("checkbox",`
 font-size: var(--n-font-size);
 outline: none;
 cursor: pointer;
 display: inline-flex;
 flex-wrap: nowrap;
 align-items: flex-start;
 word-break: break-word;
 line-height: var(--n-size);
 --n-merged-color-table: var(--n-color-table);
 `,[q("show-label","line-height: var(--n-label-line-height);"),G("&:hover",[M("checkbox-box",[A("border","border: var(--n-border-checked);")])]),G("&:focus:not(:active)",[M("checkbox-box",[A("border",`
 border: var(--n-border-focus);
 box-shadow: var(--n-box-shadow-focus);
 `)])]),q("inside-table",[M("checkbox-box",`
 background-color: var(--n-merged-color-table);
 `)]),q("checked",[M("checkbox-box",`
 background-color: var(--n-color-checked);
 `,[M("checkbox-icon",[G(".check-icon",`
 opacity: 1;
 transform: scale(1);
 `)])])]),q("indeterminate",[M("checkbox-box",[M("checkbox-icon",[G(".check-icon",`
 opacity: 0;
 transform: scale(.5);
 `),G(".line-icon",`
 opacity: 1;
 transform: scale(1);
 `)])])]),q("checked, indeterminate",[G("&:focus:not(:active)",[M("checkbox-box",[A("border",`
 border: var(--n-border-checked);
 box-shadow: var(--n-box-shadow-focus);
 `)])]),M("checkbox-box",`
 background-color: var(--n-color-checked);
 border-left: 0;
 border-top: 0;
 `,[A("border",{border:"var(--n-border-checked)"})])]),q("disabled",{cursor:"not-allowed"},[q("checked",[M("checkbox-box",`
 background-color: var(--n-color-disabled-checked);
 `,[A("border",{border:"var(--n-border-disabled-checked)"}),M("checkbox-icon",[G(".check-icon, .line-icon",{fill:"var(--n-check-mark-color-disabled-checked)"})])])]),M("checkbox-box",`
 background-color: var(--n-color-disabled);
 `,[A("border",`
 border: var(--n-border-disabled);
 `),M("checkbox-icon",[G(".check-icon, .line-icon",`
 fill: var(--n-check-mark-color-disabled);
 `)])]),A("label",`
 color: var(--n-text-color-disabled);
 `)]),M("checkbox-box-wrapper",`
 position: relative;
 width: var(--n-size);
 flex-shrink: 0;
 flex-grow: 0;
 user-select: none;
 -webkit-user-select: none;
 `),M("checkbox-box",`
 position: absolute;
 left: 0;
 top: 50%;
 transform: translateY(-50%);
 height: var(--n-size);
 width: var(--n-size);
 display: inline-block;
 box-sizing: border-box;
 border-radius: var(--n-border-radius);
 background-color: var(--n-color);
 transition: background-color 0.3s var(--n-bezier);
 `,[A("border",`
 transition:
 border-color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
 border-radius: inherit;
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 border: var(--n-border);
 `),M("checkbox-icon",`
 display: flex;
 align-items: center;
 justify-content: center;
 position: absolute;
 left: 1px;
 right: 1px;
 top: 1px;
 bottom: 1px;
 `,[G(".check-icon, .line-icon",`
 width: 100%;
 fill: var(--n-check-mark-color);
 opacity: 0;
 transform: scale(0.5);
 transform-origin: center;
 transition:
 fill 0.3s var(--n-bezier),
 transform 0.3s var(--n-bezier),
 opacity 0.3s var(--n-bezier),
 border-color 0.3s var(--n-bezier);
 `),Nr({left:"1px",top:"1px"})])]),A("label",`
 color: var(--n-text-color);
 transition: color .3s var(--n-bezier);
 user-select: none;
 -webkit-user-select: none;
 padding: var(--n-label-padding);
 font-weight: var(--n-label-font-weight);
 `,[G("&:empty",{display:"none"})])]),hi(M("checkbox",`
 --n-merged-color-table: var(--n-color-table-modal);
 `)),gi(M("checkbox",`
 --n-merged-color-table: var(--n-color-table-popover);
 `))]),Da=Object.assign(Object.assign({},Re.props),{size:String,checked:{type:[Boolean,String,Number],default:void 0},defaultChecked:{type:[Boolean,String,Number],default:!1},value:[String,Number],disabled:{type:Boolean,default:void 0},indeterminate:Boolean,label:String,focusable:{type:Boolean,default:!0},checkedValue:{type:[Boolean,String,Number],default:!0},uncheckedValue:{type:[Boolean,String,Number],default:!1},"onUpdate:checked":[Function,Array],onUpdateChecked:[Function,Array],privateInsideTable:Boolean,onChange:[Function,Array]}),Cs=me({name:"Checkbox",props:Da,setup(e){const t=N(null),{mergedClsPrefixRef:n,inlineThemeDisabled:r,mergedRtlRef:o}=De(e),i=on(e,{mergedSize(S){const{size:z}=e;if(z!==void 0)return z;if(s){const{value:B}=s.mergedSizeRef;if(B!==void 0)return B}if(S){const{mergedSize:B}=S;if(B!==void 0)return B.value}return"medium"},mergedDisabled(S){const{disabled:z}=e;if(z!==void 0)return z;if(s){if(s.disabledRef.value)return!0;const{maxRef:{value:B},checkedCountRef:D}=s;if(B!==void 0&&D.value>=B&&!v.value)return!0;const{minRef:{value:L}}=s;if(L!==void 0&&D.value<=L&&v.value)return!0}return S?S.disabled.value:!1}}),{mergedDisabledRef:a,mergedSizeRef:l}=i,s=_e(Qr,null),d=N(e.defaultChecked),c=fe(e,"checked"),f=$t(c,d),v=Le(()=>{if(s){const S=s.valueSetRef.value;return S&&e.value!==void 0?S.has(e.value):!1}else return f.value===e.checkedValue}),y=Re("Checkbox","-checkbox",La,vi,e,n);function u(S){if(s&&e.value!==void 0)s.toggleCheckbox(!v.value,e.value);else{const{onChange:z,"onUpdate:checked":B,onUpdateChecked:D}=e,{nTriggerFormInput:L,nTriggerFormChange:ne}=i,Y=v.value?e.uncheckedValue:e.checkedValue;B&&Q(B,Y,S),D&&Q(D,Y,S),z&&Q(z,Y,S),L(),ne(),d.value=Y}}function p(S){a.value||u(S)}function F(S){if(!a.value)switch(S.key){case" ":case"Enter":u(S)}}function b(S){switch(S.key){case" ":S.preventDefault()}}const C={focus:()=>{var S;(S=t.value)===null||S===void 0||S.focus()},blur:()=>{var S;(S=t.value)===null||S===void 0||S.blur()}},w=Dt("Checkbox",o,n),m=$(()=>{const{value:S}=l,{common:{cubicBezierEaseInOut:z},self:{borderRadius:B,color:D,colorChecked:L,colorDisabled:ne,colorTableHeader:Y,colorTableHeaderModal:P,colorTableHeaderPopover:E,checkMarkColor:j,checkMarkColorDisabled:K,border:Z,borderFocus:U,borderDisabled:ee,borderChecked:X,boxShadowFocus:de,textColor:T,textColorDisabled:_,checkMarkColorDisabledChecked:H,colorDisabledChecked:he,borderDisabledChecked:Ce,labelPadding:Pe,labelLineHeight:ke,labelFontWeight:be,[ae("fontSize",S)]:Fe,[ae("size",S)]:ve}}=y.value;return{"--n-label-line-height":ke,"--n-label-font-weight":be,"--n-size":ve,"--n-bezier":z,"--n-border-radius":B,"--n-border":Z,"--n-border-checked":X,"--n-border-focus":U,"--n-border-disabled":ee,"--n-border-disabled-checked":Ce,"--n-box-shadow-focus":de,"--n-color":D,"--n-color-checked":L,"--n-color-table":Y,"--n-color-table-modal":P,"--n-color-table-popover":E,"--n-color-disabled":ne,"--n-color-disabled-checked":he,"--n-text-color":T,"--n-text-color-disabled":_,"--n-check-mark-color":j,"--n-check-mark-color-disabled":K,"--n-check-mark-color-disabled-checked":H,"--n-font-size":Fe,"--n-label-padding":Pe}}),k=r?Qe("checkbox",$(()=>l.value[0]),m,e):void 0;return Object.assign(i,C,{rtlEnabled:w,selfRef:t,mergedClsPrefix:n,mergedDisabled:a,renderedChecked:v,mergedTheme:y,labelId:On(),handleClick:p,handleKeyUp:F,handleKeyDown:b,cssVars:r?void 0:m,themeClass:k==null?void 0:k.themeClass,onRender:k==null?void 0:k.onRender})},render(){var e;const{$slots:t,renderedChecked:n,mergedDisabled:r,indeterminate:o,privateInsideTable:i,cssVars:a,labelId:l,label:s,mergedClsPrefix:d,focusable:c,handleKeyUp:f,handleKeyDown:v,handleClick:y}=this;(e=this.onRender)===null||e===void 0||e.call(this);const u=Ne(t.default,p=>s||p?g("span",{class:`${d}-checkbox__label`,id:l},s||p):null);return g("div",{ref:"selfRef",class:[`${d}-checkbox`,this.themeClass,this.rtlEnabled&&`${d}-checkbox--rtl`,n&&`${d}-checkbox--checked`,r&&`${d}-checkbox--disabled`,o&&`${d}-checkbox--indeterminate`,i&&`${d}-checkbox--inside-table`,u&&`${d}-checkbox--show-label`],tabindex:r||!c?void 0:0,role:"checkbox","aria-checked":o?"mixed":n,"aria-labelledby":l,style:a,onKeyup:f,onKeydown:v,onClick:y,onMousedown:()=>{_n("selectstart",window,p=>{p.preventDefault()},{once:!0})}},g("div",{class:`${d}-checkbox-box-wrapper`}," ",g("div",{class:`${d}-checkbox-box`},g(Dr,null,{default:()=>this.indeterminate?g("div",{key:"indeterminate",class:`${d}-checkbox-icon`},$a):g("div",{key:"check",class:`${d}-checkbox-icon`},Oa)}),g("div",{class:`${d}-checkbox-box__border`}))),u)}}),Va=G([M("select",`
 z-index: auto;
 outline: none;
 width: 100%;
 position: relative;
 `),M("select-menu",`
 margin: 4px 0;
 box-shadow: var(--n-menu-box-shadow);
 `,[_r({originalTransition:"background-color .3s var(--n-bezier), box-shadow .3s var(--n-bezier)"})])]),ja=Object.assign(Object.assign({},Re.props),{to:$n.propTo,bordered:{type:Boolean,default:void 0},clearable:Boolean,clearFilterAfterSelect:{type:Boolean,default:!0},options:{type:Array,default:()=>[]},defaultValue:{type:[String,Number,Array],default:null},keyboard:{type:Boolean,default:!0},value:[String,Number,Array],placeholder:String,menuProps:Object,multiple:Boolean,size:String,filterable:Boolean,disabled:{type:Boolean,default:void 0},remote:Boolean,loading:Boolean,filter:Function,placement:{type:String,default:"bottom-start"},widthMode:{type:String,default:"trigger"},tag:Boolean,onCreate:Function,fallbackOption:{type:[Function,Boolean],default:void 0},show:{type:Boolean,default:void 0},showArrow:{type:Boolean,default:!0},maxTagCount:[Number,String],ellipsisTagPopoverProps:Object,consistentMenuWidth:{type:Boolean,default:!0},virtualScroll:{type:Boolean,default:!0},labelField:{type:String,default:"label"},valueField:{type:String,default:"value"},childrenField:{type:String,default:"children"},renderLabel:Function,renderOption:Function,renderTag:Function,"onUpdate:value":[Function,Array],inputProps:Object,nodeProps:Function,ignoreComposition:{type:Boolean,default:!0},showOnFocus:Boolean,onUpdateValue:[Function,Array],onBlur:[Function,Array],onClear:[Function,Array],onFocus:[Function,Array],onScroll:[Function,Array],onSearch:[Function,Array],onUpdateShow:[Function,Array],"onUpdate:show":[Function,Array],displayDirective:{type:String,default:"show"},resetMenuOnOptionsChange:{type:Boolean,default:!0},status:String,showCheckmark:{type:Boolean,default:!0},onChange:[Function,Array],items:Array}),ks=me({name:"Select",props:ja,setup(e){const{mergedClsPrefixRef:t,mergedBorderedRef:n,namespaceRef:r,inlineThemeDisabled:o}=De(e),i=Re("Select","-select",Va,bi,e,t),a=N(e.defaultValue),l=fe(e,"value"),s=$t(l,a),d=N(!1),c=N(""),f=$(()=>{const{valueField:x,childrenField:O}=e,J=Ta(x,O);return ga(Y.value,J)}),v=$(()=>Aa(L.value,e.valueField,e.childrenField)),y=N(!1),u=$t(fe(e,"show"),y),p=N(null),F=N(null),b=N(null),{localeRef:C}=Zn("Select"),w=$(()=>{var x;return(x=e.placeholder)!==null&&x!==void 0?x:C.value.placeholder}),m=Fi(e,["items","options"]),k=[],S=N([]),z=N([]),B=N(new Map),D=$(()=>{const{fallbackOption:x}=e;if(x===void 0){const{labelField:O,valueField:J}=e;return se=>({[O]:String(se),[J]:se})}return x===!1?!1:O=>Object.assign(x(O),{value:O})}),L=$(()=>z.value.concat(S.value).concat(m.value)),ne=$(()=>{const{filter:x}=e;if(x)return x;const{labelField:O,valueField:J}=e;return(se,re)=>{if(!re)return!1;const te=re[O];if(typeof te=="string")return Rn(se,te);const oe=re[J];return typeof oe=="string"?Rn(se,oe):typeof oe=="number"?Rn(se,String(oe)):!1}}),Y=$(()=>{if(e.remote)return m.value;{const{value:x}=L,{value:O}=c;return!O.length||!e.filterable?x:Ea(x,ne.value,O,e.childrenField)}});function P(x){const O=e.remote,{value:J}=B,{value:se}=v,{value:re}=D,te=[];return x.forEach(oe=>{if(se.has(oe))te.push(se.get(oe));else if(O&&J.has(oe))te.push(J.get(oe));else if(re){const xe=re(oe);xe&&te.push(xe)}}),te}const E=$(()=>{if(e.multiple){const{value:x}=s;return Array.isArray(x)?P(x):[]}return null}),j=$(()=>{const{value:x}=s;return!e.multiple&&!Array.isArray(x)?x===null?null:P([x])[0]||null:null}),K=on(e),{mergedSizeRef:Z,mergedDisabledRef:U,mergedStatusRef:ee}=K;function X(x,O){const{onChange:J,"onUpdate:value":se,onUpdateValue:re}=e,{nTriggerFormChange:te,nTriggerFormInput:oe}=K;J&&Q(J,x,O),re&&Q(re,x,O),se&&Q(se,x,O),a.value=x,te(),oe()}function de(x){const{onBlur:O}=e,{nTriggerFormBlur:J}=K;O&&Q(O,x),J()}function T(){const{onClear:x}=e;x&&Q(x)}function _(x){const{onFocus:O,showOnFocus:J}=e,{nTriggerFormFocus:se}=K;O&&Q(O,x),se(),J&&ke()}function H(x){const{onSearch:O}=e;O&&Q(O,x)}function he(x){const{onScroll:O}=e;O&&Q(O,x)}function Ce(){var x;const{remote:O,multiple:J}=e;if(O){const{value:se}=B;if(J){const{valueField:re}=e;(x=E.value)===null||x===void 0||x.forEach(te=>{se.set(te[re],te)})}else{const re=j.value;re&&se.set(re[e.valueField],re)}}}function Pe(x){const{onUpdateShow:O,"onUpdate:show":J}=e;O&&Q(O,x),J&&Q(J,x),y.value=x}function ke(){U.value||(Pe(!0),y.value=!0,e.filterable&&ut())}function be(){Pe(!1)}function Fe(){c.value="",z.value=k}const ve=N(!1);function le(){e.filterable&&(ve.value=!0)}function ye(){e.filterable&&(ve.value=!1,u.value||Fe())}function ce(){U.value||(u.value?e.filterable?ut():be():ke())}function ze(x){var O,J;!((J=(O=b.value)===null||O===void 0?void 0:O.selfRef)===null||J===void 0)&&J.contains(x.relatedTarget)||(d.value=!1,de(x),be())}function je(x){_(x),d.value=!0}function We(x){d.value=!0}function Oe(x){var O;!((O=p.value)===null||O===void 0)&&O.$el.contains(x.relatedTarget)||(d.value=!1,de(x),be())}function tt(){var x;(x=p.value)===null||x===void 0||x.focus(),be()}function nt(x){var O;u.value&&(!((O=p.value)===null||O===void 0)&&O.$el.contains(wi(x))||be())}function Je(x){if(!Array.isArray(x))return[];if(D.value)return Array.from(x);{const{remote:O}=e,{value:J}=v;if(O){const{value:se}=B;return x.filter(re=>J.has(re)||se.has(re))}else return x.filter(se=>J.has(se))}}function qe(x){Te(x.rawNode)}function Te(x){if(U.value)return;const{tag:O,remote:J,clearFilterAfterSelect:se,valueField:re}=e;if(O&&!J){const{value:te}=z,oe=te[0]||null;if(oe){const xe=S.value;xe.length?xe.push(oe):S.value=[oe],z.value=k}}if(J&&B.value.set(x[re],x),e.multiple){const te=Je(s.value),oe=te.findIndex(xe=>xe===x[re]);if(~oe){if(te.splice(oe,1),O&&!J){const xe=I(x[re]);~xe&&(S.value.splice(xe,1),se&&(c.value=""))}}else te.push(x[re]),se&&(c.value="");X(te,P(te))}else{if(O&&!J){const te=I(x[re]);~te?S.value=[S.value[te]]:S.value=k}dt(),be(),X(x[re],x)}}function I(x){return S.value.findIndex(J=>J[e.valueField]===x)}function V(x){u.value||ke();const{value:O}=x.target;c.value=O;const{tag:J,remote:se}=e;if(H(O),J&&!se){if(!O){z.value=k;return}const{onCreate:re}=e,te=re?re(O):{[e.labelField]:O,[e.valueField]:O},{valueField:oe,labelField:xe}=e;m.value.some(Ee=>Ee[oe]===te[oe]||Ee[xe]===te[xe])||S.value.some(Ee=>Ee[oe]===te[oe]||Ee[xe]===te[xe])?z.value=k:z.value=[te]}}function we(x){x.stopPropagation();const{multiple:O}=e;!O&&e.filterable&&be(),T(),O?X([],[]):X(null,null)}function Ft(x){!Qt(x,"action")&&!Qt(x,"empty")&&x.preventDefault()}function st(x){he(x)}function ct(x){var O,J,se,re,te;if(!e.keyboard){x.preventDefault();return}switch(x.key){case" ":if(e.filterable)break;x.preventDefault();case"Enter":if(!(!((O=p.value)===null||O===void 0)&&O.isComposing)){if(u.value){const oe=(J=b.value)===null||J===void 0?void 0:J.getPendingTmNode();oe?qe(oe):e.filterable||(be(),dt())}else if(ke(),e.tag&&ve.value){const oe=z.value[0];if(oe){const xe=oe[e.valueField],{value:Ee}=s;e.multiple&&Array.isArray(Ee)&&Ee.some(At=>At===xe)||Te(oe)}}}x.preventDefault();break;case"ArrowUp":if(x.preventDefault(),e.loading)return;u.value&&((se=b.value)===null||se===void 0||se.prev());break;case"ArrowDown":if(x.preventDefault(),e.loading)return;u.value?(re=b.value)===null||re===void 0||re.next():ke();break;case"Escape":u.value&&(xi(x),be()),(te=p.value)===null||te===void 0||te.focus();break}}function dt(){var x;(x=p.value)===null||x===void 0||x.focus()}function ut(){var x;(x=p.value)===null||x===void 0||x.focusInput()}function Tt(){var x;u.value&&((x=F.value)===null||x===void 0||x.syncPosition())}Ce(),Be(fe(e,"options"),Ce);const Et={focus:()=>{var x;(x=p.value)===null||x===void 0||x.focus()},focusInput:()=>{var x;(x=p.value)===null||x===void 0||x.focusInput()},blur:()=>{var x;(x=p.value)===null||x===void 0||x.blur()},blurInput:()=>{var x;(x=p.value)===null||x===void 0||x.blurInput()}},ft=$(()=>{const{self:{menuBoxShadow:x}}=i.value;return{"--n-menu-box-shadow":x}}),$e=o?Qe("select",void 0,ft,e):void 0;return Object.assign(Object.assign({},Et),{mergedStatus:ee,mergedClsPrefix:t,mergedBordered:n,namespace:r,treeMate:f,isMounted:pi(),triggerRef:p,menuRef:b,pattern:c,uncontrolledShow:y,mergedShow:u,adjustedTo:$n(e),uncontrolledValue:a,mergedValue:s,followerRef:F,localizedPlaceholder:w,selectedOption:j,selectedOptions:E,mergedSize:Z,mergedDisabled:U,focused:d,activeWithoutMenuOpen:ve,inlineThemeDisabled:o,onTriggerInputFocus:le,onTriggerInputBlur:ye,handleTriggerOrMenuResize:Tt,handleMenuFocus:We,handleMenuBlur:Oe,handleMenuTabOut:tt,handleTriggerClick:ce,handleToggle:qe,handleDeleteOption:Te,handlePatternInput:V,handleClear:we,handleTriggerBlur:ze,handleTriggerFocus:je,handleKeydown:ct,handleMenuAfterLeave:Fe,handleMenuClickOutside:nt,handleMenuScroll:st,handleMenuKeydown:ct,handleMenuMousedown:Ft,mergedTheme:i,cssVars:o?void 0:ft,themeClass:$e==null?void 0:$e.themeClass,onRender:$e==null?void 0:$e.onRender})},render(){return g("div",{class:`${this.mergedClsPrefix}-select`},g(Ti,null,{default:()=>[g(Ei,null,{default:()=>g(Fa,{ref:"triggerRef",inlineThemeDisabled:this.inlineThemeDisabled,status:this.mergedStatus,inputProps:this.inputProps,clsPrefix:this.mergedClsPrefix,showArrow:this.showArrow,maxTagCount:this.maxTagCount,ellipsisTagPopoverProps:this.ellipsisTagPopoverProps,bordered:this.mergedBordered,active:this.activeWithoutMenuOpen||this.mergedShow,pattern:this.pattern,placeholder:this.localizedPlaceholder,selectedOption:this.selectedOption,selectedOptions:this.selectedOptions,multiple:this.multiple,renderTag:this.renderTag,renderLabel:this.renderLabel,filterable:this.filterable,clearable:this.clearable,disabled:this.mergedDisabled,size:this.mergedSize,theme:this.mergedTheme.peers.InternalSelection,labelField:this.labelField,valueField:this.valueField,themeOverrides:this.mergedTheme.peerOverrides.InternalSelection,loading:this.loading,focused:this.focused,onClick:this.handleTriggerClick,onDeleteOption:this.handleDeleteOption,onPatternInput:this.handlePatternInput,onClear:this.handleClear,onBlur:this.handleTriggerBlur,onFocus:this.handleTriggerFocus,onKeydown:this.handleKeydown,onPatternBlur:this.onTriggerInputBlur,onPatternFocus:this.onTriggerInputFocus,onResize:this.handleTriggerOrMenuResize,ignoreComposition:this.ignoreComposition},{arrow:()=>{var e,t;return[(t=(e=this.$slots).arrow)===null||t===void 0?void 0:t.call(e)]}})}),g(Ai,{ref:"followerRef",show:this.mergedShow,to:this.adjustedTo,teleportDisabled:this.adjustedTo===$n.tdkey,containerClass:this.namespace,width:this.consistentMenuWidth?"target":void 0,minWidth:"target",placement:this.placement},{default:()=>g(Jn,{name:"fade-in-scale-up-transition",appear:this.isMounted,onAfterLeave:this.handleMenuAfterLeave},{default:()=>{var e,t,n;return this.mergedShow||this.displayDirective==="show"?((e=this.onRender)===null||e===void 0||e.call(this),mi(g(wa,Object.assign({},this.menuProps,{ref:"menuRef",onResize:this.handleTriggerOrMenuResize,inlineThemeDisabled:this.inlineThemeDisabled,virtualScroll:this.consistentMenuWidth&&this.virtualScroll,class:[`${this.mergedClsPrefix}-select-menu`,this.themeClass,(t=this.menuProps)===null||t===void 0?void 0:t.class],clsPrefix:this.mergedClsPrefix,focusable:!0,labelField:this.labelField,valueField:this.valueField,autoPending:!0,nodeProps:this.nodeProps,theme:this.mergedTheme.peers.InternalSelectMenu,themeOverrides:this.mergedTheme.peerOverrides.InternalSelectMenu,treeMate:this.treeMate,multiple:this.multiple,size:"medium",renderOption:this.renderOption,renderLabel:this.renderLabel,value:this.mergedValue,style:[(n=this.menuProps)===null||n===void 0?void 0:n.style,this.cssVars],onToggle:this.handleToggle,onScroll:this.handleMenuScroll,onFocus:this.handleMenuFocus,onBlur:this.handleMenuBlur,onKeydown:this.handleMenuKeydown,onTabOut:this.handleMenuTabOut,onMousedown:this.handleMenuMousedown,show:this.mergedShow,showCheckmark:this.showCheckmark,resetMenuOnOptionsChange:this.resetMenuOnOptionsChange}),{empty:()=>{var r,o;return[(o=(r=this.$slots).empty)===null||o===void 0?void 0:o.call(r)]},header:()=>{var r,o;return[(o=(r=this.$slots).header)===null||o===void 0?void 0:o.call(r)]},action:()=>{var r,o;return[(o=(r=this.$slots).action)===null||o===void 0?void 0:o.call(r)]}}),this.displayDirective==="show"?[[yi,this.mergedShow],[sr,this.handleMenuClickOutside,void 0,{capture:!0}]]:[[sr,this.handleMenuClickOutside,void 0,{capture:!0}]])):null}})})]}))}}),Wa=M("form",[q("inline",`
 width: 100%;
 display: inline-flex;
 align-items: flex-start;
 align-content: space-around;
 `,[M("form-item",{width:"auto",marginRight:"18px"},[G("&:last-child",{marginRight:0})])])]),jt=Vt("n-form"),eo=Vt("n-form-item-insts");var qa=globalThis&&globalThis.__awaiter||function(e,t,n,r){function o(i){return i instanceof n?i:new n(function(a){a(i)})}return new(n||(n=Promise))(function(i,a){function l(c){try{d(r.next(c))}catch(f){a(f)}}function s(c){try{d(r.throw(c))}catch(f){a(f)}}function d(c){c.done?i(c.value):o(c.value).then(l,s)}d((r=r.apply(e,t||[])).next())})};const Ka=Object.assign(Object.assign({},Re.props),{inline:Boolean,labelWidth:[Number,String],labelAlign:String,labelPlacement:{type:String,default:"top"},model:{type:Object,default:()=>{}},rules:Object,disabled:Boolean,size:String,showRequireMark:{type:Boolean,default:void 0},requireMarkPlacement:String,showFeedback:{type:Boolean,default:!0},onSubmit:{type:Function,default:e=>{e.preventDefault()}},showLabel:{type:Boolean,default:void 0},validateMessages:Object}),Ss=me({name:"Form",props:Ka,setup(e){const{mergedClsPrefixRef:t}=De(e);Re("Form","-form",Wa,jr,e,t);const n={},r=N(void 0),o=s=>{const d=r.value;(d===void 0||s>=d)&&(r.value=s)};function i(s){return qa(this,arguments,void 0,function*(d,c=()=>!0){return yield new Promise((f,v)=>{const y=[];for(const u of cr(n)){const p=n[u];for(const F of p)F.path&&y.push(F.internalValidate(null,c))}Promise.all(y).then(u=>{const p=u.some(C=>!C.valid),F=[],b=[];u.forEach(C=>{var w,m;!((w=C.errors)===null||w===void 0)&&w.length&&F.push(C.errors),!((m=C.warnings)===null||m===void 0)&&m.length&&b.push(C.warnings)}),d&&d(F.length?F:void 0,{warnings:b.length?b:void 0}),p?v(F.length?F:void 0):f({warnings:b.length?b:void 0})})})})}function a(){for(const s of cr(n)){const d=n[s];for(const c of d)c.restoreValidation()}}return Ye(jt,{props:e,maxChildLabelWidthRef:r,deriveMaxChildLabelWidth:o}),Ye(eo,{formItems:n}),Object.assign({validate:i,restoreValidation:a},{mergedClsPrefix:t})},render(){const{mergedClsPrefix:e}=this;return g("form",{class:[`${e}-form`,this.inline&&`${e}-form--inline`],onSubmit:this.onSubmit},this.$slots)}});function it(){return it=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},it.apply(this,arguments)}function Ua(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,Nt(e,t)}function Dn(e){return Dn=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(n){return n.__proto__||Object.getPrototypeOf(n)},Dn(e)}function Nt(e,t){return Nt=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(r,o){return r.__proto__=o,r},Nt(e,t)}function Ha(){if(typeof Reflect>"u"||!Reflect.construct||Reflect.construct.sham)return!1;if(typeof Proxy=="function")return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch{return!1}}function Xt(e,t,n){return Ha()?Xt=Reflect.construct.bind():Xt=function(o,i,a){var l=[null];l.push.apply(l,i);var s=Function.bind.apply(o,l),d=new s;return a&&Nt(d,a.prototype),d},Xt.apply(null,arguments)}function Ga(e){return Function.toString.call(e).indexOf("[native code]")!==-1}function Vn(e){var t=typeof Map=="function"?new Map:void 0;return Vn=function(r){if(r===null||!Ga(r))return r;if(typeof r!="function")throw new TypeError("Super expression must either be null or a function");if(typeof t<"u"){if(t.has(r))return t.get(r);t.set(r,o)}function o(){return Xt(r,arguments,Dn(this).constructor)}return o.prototype=Object.create(r.prototype,{constructor:{value:o,enumerable:!1,writable:!0,configurable:!0}}),Nt(o,r)},Vn(e)}var Ya=/%[sdj%]/g,Ja=function(){};typeof process<"u"&&process.env;function jn(e){if(!e||!e.length)return null;var t={};return e.forEach(function(n){var r=n.field;t[r]=t[r]||[],t[r].push(n)}),t}function Ae(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),r=1;r<t;r++)n[r-1]=arguments[r];var o=0,i=n.length;if(typeof e=="function")return e.apply(null,n);if(typeof e=="string"){var a=e.replace(Ya,function(l){if(l==="%%")return"%";if(o>=i)return l;switch(l){case"%s":return String(n[o++]);case"%d":return Number(n[o++]);case"%j":try{return JSON.stringify(n[o++])}catch{return"[Circular]"}break;default:return l}});return a}return e}function Za(e){return e==="string"||e==="url"||e==="hex"||e==="email"||e==="date"||e==="pattern"}function Se(e,t){return!!(e==null||t==="array"&&Array.isArray(e)&&!e.length||Za(t)&&typeof e=="string"&&!e)}function Xa(e,t,n){var r=[],o=0,i=e.length;function a(l){r.push.apply(r,l||[]),o++,o===i&&n(r)}e.forEach(function(l){t(l,a)})}function Cr(e,t,n){var r=0,o=e.length;function i(a){if(a&&a.length){n(a);return}var l=r;r=r+1,l<o?t(e[l],i):n([])}i([])}function Qa(e){var t=[];return Object.keys(e).forEach(function(n){t.push.apply(t,e[n]||[])}),t}var kr=function(e){Ua(t,e);function t(n,r){var o;return o=e.call(this,"Async Validation Error")||this,o.errors=n,o.fields=r,o}return t}(Vn(Error));function el(e,t,n,r,o){if(t.first){var i=new Promise(function(v,y){var u=function(b){return r(b),b.length?y(new kr(b,jn(b))):v(o)},p=Qa(e);Cr(p,n,u)});return i.catch(function(v){return v}),i}var a=t.firstFields===!0?Object.keys(e):t.firstFields||[],l=Object.keys(e),s=l.length,d=0,c=[],f=new Promise(function(v,y){var u=function(F){if(c.push.apply(c,F),d++,d===s)return r(c),c.length?y(new kr(c,jn(c))):v(o)};l.length||(r(c),v(o)),l.forEach(function(p){var F=e[p];a.indexOf(p)!==-1?Cr(F,n,u):Xa(F,n,u)})});return f.catch(function(v){return v}),f}function tl(e){return!!(e&&e.message!==void 0)}function nl(e,t){for(var n=e,r=0;r<t.length;r++){if(n==null)return n;n=n[t[r]]}return n}function Sr(e,t){return function(n){var r;return e.fullFields?r=nl(t,e.fullFields):r=t[n.field||e.fullField],tl(n)?(n.field=n.field||e.fullField,n.fieldValue=r,n):{message:typeof n=="function"?n():n,fieldValue:r,field:n.field||e.fullField}}}function Rr(e,t){if(t){for(var n in t)if(t.hasOwnProperty(n)){var r=t[n];typeof r=="object"&&typeof e[n]=="object"?e[n]=it({},e[n],r):e[n]=r}}return e}var to=function(t,n,r,o,i,a){t.required&&(!r.hasOwnProperty(t.field)||Se(n,a||t.type))&&o.push(Ae(i.messages.required,t.fullField))},rl=function(t,n,r,o,i){(/^\s+$/.test(n)||n==="")&&o.push(Ae(i.messages.whitespace,t.fullField))},Gt,ol=function(){if(Gt)return Gt;var e="[a-fA-F\\d:]",t=function(m){return m&&m.includeBoundaries?"(?:(?<=\\s|^)(?="+e+")|(?<="+e+")(?=\\s|$))":""},n="(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}",r="[a-fA-F\\d]{1,4}",o=(`
(?:
(?:`+r+":){7}(?:"+r+`|:)|                                    // 1:2:3:4:5:6:7::  1:2:3:4:5:6:7:8
(?:`+r+":){6}(?:"+n+"|:"+r+`|:)|                             // 1:2:3:4:5:6::    1:2:3:4:5:6::8   1:2:3:4:5:6::8  1:2:3:4:5:6::1.2.3.4
(?:`+r+":){5}(?::"+n+"|(?::"+r+`){1,2}|:)|                   // 1:2:3:4:5::      1:2:3:4:5::7:8   1:2:3:4:5::8    1:2:3:4:5::7:1.2.3.4
(?:`+r+":){4}(?:(?::"+r+"){0,1}:"+n+"|(?::"+r+`){1,3}|:)| // 1:2:3:4::        1:2:3:4::6:7:8   1:2:3:4::8      1:2:3:4::6:7:1.2.3.4
(?:`+r+":){3}(?:(?::"+r+"){0,2}:"+n+"|(?::"+r+`){1,4}|:)| // 1:2:3::          1:2:3::5:6:7:8   1:2:3::8        1:2:3::5:6:7:1.2.3.4
(?:`+r+":){2}(?:(?::"+r+"){0,3}:"+n+"|(?::"+r+`){1,5}|:)| // 1:2::            1:2::4:5:6:7:8   1:2::8          1:2::4:5:6:7:1.2.3.4
(?:`+r+":){1}(?:(?::"+r+"){0,4}:"+n+"|(?::"+r+`){1,6}|:)| // 1::              1::3:4:5:6:7:8   1::8            1::3:4:5:6:7:1.2.3.4
(?::(?:(?::`+r+"){0,5}:"+n+"|(?::"+r+`){1,7}|:))             // ::2:3:4:5:6:7:8  ::2:3:4:5:6:7:8  ::8             ::1.2.3.4
)(?:%[0-9a-zA-Z]{1,})?                                             // %eth0            %1
`).replace(/\s*\/\/.*$/gm,"").replace(/\n/g,"").trim(),i=new RegExp("(?:^"+n+"$)|(?:^"+o+"$)"),a=new RegExp("^"+n+"$"),l=new RegExp("^"+o+"$"),s=function(m){return m&&m.exact?i:new RegExp("(?:"+t(m)+n+t(m)+")|(?:"+t(m)+o+t(m)+")","g")};s.v4=function(w){return w&&w.exact?a:new RegExp(""+t(w)+n+t(w),"g")},s.v6=function(w){return w&&w.exact?l:new RegExp(""+t(w)+o+t(w),"g")};var d="(?:(?:[a-z]+:)?//)",c="(?:\\S+(?::\\S*)?@)?",f=s.v4().source,v=s.v6().source,y="(?:(?:[a-z\\u00a1-\\uffff0-9][-_]*)*[a-z\\u00a1-\\uffff0-9]+)",u="(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*",p="(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))",F="(?::\\d{2,5})?",b='(?:[/?#][^\\s"]*)?',C="(?:"+d+"|www\\.)"+c+"(?:localhost|"+f+"|"+v+"|"+y+u+p+")"+F+b;return Gt=new RegExp("(?:^"+C+"$)","i"),Gt},Pr={email:/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+\.)+[a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{2,}))$/,hex:/^#?([a-f0-9]{6}|[a-f0-9]{3})$/i},Mt={integer:function(t){return Mt.number(t)&&parseInt(t,10)===t},float:function(t){return Mt.number(t)&&!Mt.integer(t)},array:function(t){return Array.isArray(t)},regexp:function(t){if(t instanceof RegExp)return!0;try{return!!new RegExp(t)}catch{return!1}},date:function(t){return typeof t.getTime=="function"&&typeof t.getMonth=="function"&&typeof t.getYear=="function"&&!isNaN(t.getTime())},number:function(t){return isNaN(t)?!1:typeof t=="number"},object:function(t){return typeof t=="object"&&!Mt.array(t)},method:function(t){return typeof t=="function"},email:function(t){return typeof t=="string"&&t.length<=320&&!!t.match(Pr.email)},url:function(t){return typeof t=="string"&&t.length<=2048&&!!t.match(ol())},hex:function(t){return typeof t=="string"&&!!t.match(Pr.hex)}},il=function(t,n,r,o,i){if(t.required&&n===void 0){to(t,n,r,o,i);return}var a=["integer","float","array","regexp","object","method","email","number","date","url","hex"],l=t.type;a.indexOf(l)>-1?Mt[l](n)||o.push(Ae(i.messages.types[l],t.fullField,t.type)):l&&typeof n!==t.type&&o.push(Ae(i.messages.types[l],t.fullField,t.type))},al=function(t,n,r,o,i){var a=typeof t.len=="number",l=typeof t.min=="number",s=typeof t.max=="number",d=/[\uD800-\uDBFF][\uDC00-\uDFFF]/g,c=n,f=null,v=typeof n=="number",y=typeof n=="string",u=Array.isArray(n);if(v?f="number":y?f="string":u&&(f="array"),!f)return!1;u&&(c=n.length),y&&(c=n.replace(d,"_").length),a?c!==t.len&&o.push(Ae(i.messages[f].len,t.fullField,t.len)):l&&!s&&c<t.min?o.push(Ae(i.messages[f].min,t.fullField,t.min)):s&&!l&&c>t.max?o.push(Ae(i.messages[f].max,t.fullField,t.max)):l&&s&&(c<t.min||c>t.max)&&o.push(Ae(i.messages[f].range,t.fullField,t.min,t.max))},pt="enum",ll=function(t,n,r,o,i){t[pt]=Array.isArray(t[pt])?t[pt]:[],t[pt].indexOf(n)===-1&&o.push(Ae(i.messages[pt],t.fullField,t[pt].join(", ")))},sl=function(t,n,r,o,i){if(t.pattern){if(t.pattern instanceof RegExp)t.pattern.lastIndex=0,t.pattern.test(n)||o.push(Ae(i.messages.pattern.mismatch,t.fullField,n,t.pattern));else if(typeof t.pattern=="string"){var a=new RegExp(t.pattern);a.test(n)||o.push(Ae(i.messages.pattern.mismatch,t.fullField,n,t.pattern))}}},ie={required:to,whitespace:rl,type:il,range:al,enum:ll,pattern:sl},cl=function(t,n,r,o,i){var a=[],l=t.required||!t.required&&o.hasOwnProperty(t.field);if(l){if(Se(n,"string")&&!t.required)return r();ie.required(t,n,o,a,i,"string"),Se(n,"string")||(ie.type(t,n,o,a,i),ie.range(t,n,o,a,i),ie.pattern(t,n,o,a,i),t.whitespace===!0&&ie.whitespace(t,n,o,a,i))}r(a)},dl=function(t,n,r,o,i){var a=[],l=t.required||!t.required&&o.hasOwnProperty(t.field);if(l){if(Se(n)&&!t.required)return r();ie.required(t,n,o,a,i),n!==void 0&&ie.type(t,n,o,a,i)}r(a)},ul=function(t,n,r,o,i){var a=[],l=t.required||!t.required&&o.hasOwnProperty(t.field);if(l){if(n===""&&(n=void 0),Se(n)&&!t.required)return r();ie.required(t,n,o,a,i),n!==void 0&&(ie.type(t,n,o,a,i),ie.range(t,n,o,a,i))}r(a)},fl=function(t,n,r,o,i){var a=[],l=t.required||!t.required&&o.hasOwnProperty(t.field);if(l){if(Se(n)&&!t.required)return r();ie.required(t,n,o,a,i),n!==void 0&&ie.type(t,n,o,a,i)}r(a)},hl=function(t,n,r,o,i){var a=[],l=t.required||!t.required&&o.hasOwnProperty(t.field);if(l){if(Se(n)&&!t.required)return r();ie.required(t,n,o,a,i),Se(n)||ie.type(t,n,o,a,i)}r(a)},gl=function(t,n,r,o,i){var a=[],l=t.required||!t.required&&o.hasOwnProperty(t.field);if(l){if(Se(n)&&!t.required)return r();ie.required(t,n,o,a,i),n!==void 0&&(ie.type(t,n,o,a,i),ie.range(t,n,o,a,i))}r(a)},vl=function(t,n,r,o,i){var a=[],l=t.required||!t.required&&o.hasOwnProperty(t.field);if(l){if(Se(n)&&!t.required)return r();ie.required(t,n,o,a,i),n!==void 0&&(ie.type(t,n,o,a,i),ie.range(t,n,o,a,i))}r(a)},bl=function(t,n,r,o,i){var a=[],l=t.required||!t.required&&o.hasOwnProperty(t.field);if(l){if(n==null&&!t.required)return r();ie.required(t,n,o,a,i,"array"),n!=null&&(ie.type(t,n,o,a,i),ie.range(t,n,o,a,i))}r(a)},pl=function(t,n,r,o,i){var a=[],l=t.required||!t.required&&o.hasOwnProperty(t.field);if(l){if(Se(n)&&!t.required)return r();ie.required(t,n,o,a,i),n!==void 0&&ie.type(t,n,o,a,i)}r(a)},ml="enum",yl=function(t,n,r,o,i){var a=[],l=t.required||!t.required&&o.hasOwnProperty(t.field);if(l){if(Se(n)&&!t.required)return r();ie.required(t,n,o,a,i),n!==void 0&&ie[ml](t,n,o,a,i)}r(a)},wl=function(t,n,r,o,i){var a=[],l=t.required||!t.required&&o.hasOwnProperty(t.field);if(l){if(Se(n,"string")&&!t.required)return r();ie.required(t,n,o,a,i),Se(n,"string")||ie.pattern(t,n,o,a,i)}r(a)},xl=function(t,n,r,o,i){var a=[],l=t.required||!t.required&&o.hasOwnProperty(t.field);if(l){if(Se(n,"date")&&!t.required)return r();if(ie.required(t,n,o,a,i),!Se(n,"date")){var s;n instanceof Date?s=n:s=new Date(n),ie.type(t,s,o,a,i),s&&ie.range(t,s.getTime(),o,a,i)}}r(a)},Cl=function(t,n,r,o,i){var a=[],l=Array.isArray(n)?"array":typeof n;ie.required(t,n,o,a,i,l),r(a)},Pn=function(t,n,r,o,i){var a=t.type,l=[],s=t.required||!t.required&&o.hasOwnProperty(t.field);if(s){if(Se(n,a)&&!t.required)return r();ie.required(t,n,o,l,i,a),Se(n,a)||ie.type(t,n,o,l,i)}r(l)},kl=function(t,n,r,o,i){var a=[],l=t.required||!t.required&&o.hasOwnProperty(t.field);if(l){if(Se(n)&&!t.required)return r();ie.required(t,n,o,a,i)}r(a)},Bt={string:cl,method:dl,number:ul,boolean:fl,regexp:hl,integer:gl,float:vl,array:bl,object:pl,enum:yl,pattern:wl,date:xl,url:Pn,hex:Pn,email:Pn,required:Cl,any:kl};function Wn(){return{default:"Validation error on field %s",required:"%s is required",enum:"%s must be one of %s",whitespace:"%s cannot be empty",date:{format:"%s date %s is invalid for format %s",parse:"%s date could not be parsed, %s is invalid ",invalid:"%s date %s is invalid"},types:{string:"%s is not a %s",method:"%s is not a %s (function)",array:"%s is not an %s",object:"%s is not an %s",number:"%s is not a %s",date:"%s is not a %s",boolean:"%s is not a %s",integer:"%s is not an %s",float:"%s is not a %s",regexp:"%s is not a valid %s",email:"%s is not a valid %s",url:"%s is not a valid %s",hex:"%s is not a valid %s"},string:{len:"%s must be exactly %s characters",min:"%s must be at least %s characters",max:"%s cannot be longer than %s characters",range:"%s must be between %s and %s characters"},number:{len:"%s must equal %s",min:"%s cannot be less than %s",max:"%s cannot be greater than %s",range:"%s must be between %s and %s"},array:{len:"%s must be exactly %s in length",min:"%s cannot be less than %s in length",max:"%s cannot be greater than %s in length",range:"%s must be between %s and %s in length"},pattern:{mismatch:"%s value %s does not match pattern %s"},clone:function(){var t=JSON.parse(JSON.stringify(this));return t.clone=this.clone,t}}}var qn=Wn(),xt=function(){function e(n){this.rules=null,this._messages=qn,this.define(n)}var t=e.prototype;return t.define=function(r){var o=this;if(!r)throw new Error("Cannot configure a schema with no rules");if(typeof r!="object"||Array.isArray(r))throw new Error("Rules must be an object");this.rules={},Object.keys(r).forEach(function(i){var a=r[i];o.rules[i]=Array.isArray(a)?a:[a]})},t.messages=function(r){return r&&(this._messages=Rr(Wn(),r)),this._messages},t.validate=function(r,o,i){var a=this;o===void 0&&(o={}),i===void 0&&(i=function(){});var l=r,s=o,d=i;if(typeof s=="function"&&(d=s,s={}),!this.rules||Object.keys(this.rules).length===0)return d&&d(null,l),Promise.resolve(l);function c(p){var F=[],b={};function C(m){if(Array.isArray(m)){var k;F=(k=F).concat.apply(k,m)}else F.push(m)}for(var w=0;w<p.length;w++)C(p[w]);F.length?(b=jn(F),d(F,b)):d(null,l)}if(s.messages){var f=this.messages();f===qn&&(f=Wn()),Rr(f,s.messages),s.messages=f}else s.messages=this.messages();var v={},y=s.keys||Object.keys(this.rules);y.forEach(function(p){var F=a.rules[p],b=l[p];F.forEach(function(C){var w=C;typeof w.transform=="function"&&(l===r&&(l=it({},l)),b=l[p]=w.transform(b)),typeof w=="function"?w={validator:w}:w=it({},w),w.validator=a.getValidationMethod(w),w.validator&&(w.field=p,w.fullField=w.fullField||p,w.type=a.getType(w),v[p]=v[p]||[],v[p].push({rule:w,value:b,source:l,field:p}))})});var u={};return el(v,s,function(p,F){var b=p.rule,C=(b.type==="object"||b.type==="array")&&(typeof b.fields=="object"||typeof b.defaultField=="object");C=C&&(b.required||!b.required&&p.value),b.field=p.field;function w(S,z){return it({},z,{fullField:b.fullField+"."+S,fullFields:b.fullFields?[].concat(b.fullFields,[S]):[S]})}function m(S){S===void 0&&(S=[]);var z=Array.isArray(S)?S:[S];!s.suppressWarning&&z.length&&e.warning("async-validator:",z),z.length&&b.message!==void 0&&(z=[].concat(b.message));var B=z.map(Sr(b,l));if(s.first&&B.length)return u[b.field]=1,F(B);if(!C)F(B);else{if(b.required&&!p.value)return b.message!==void 0?B=[].concat(b.message).map(Sr(b,l)):s.error&&(B=[s.error(b,Ae(s.messages.required,b.field))]),F(B);var D={};b.defaultField&&Object.keys(p.value).map(function(Y){D[Y]=b.defaultField}),D=it({},D,p.rule.fields);var L={};Object.keys(D).forEach(function(Y){var P=D[Y],E=Array.isArray(P)?P:[P];L[Y]=E.map(w.bind(null,Y))});var ne=new e(L);ne.messages(s.messages),p.rule.options&&(p.rule.options.messages=s.messages,p.rule.options.error=s.error),ne.validate(p.value,p.rule.options||s,function(Y){var P=[];B&&B.length&&P.push.apply(P,B),Y&&Y.length&&P.push.apply(P,Y),F(P.length?P:null)})}}var k;if(b.asyncValidator)k=b.asyncValidator(b,p.value,m,p.source,s);else if(b.validator){try{k=b.validator(b,p.value,m,p.source,s)}catch(S){console.error==null||console.error(S),s.suppressValidatorError||setTimeout(function(){throw S},0),m(S.message)}k===!0?m():k===!1?m(typeof b.message=="function"?b.message(b.fullField||b.field):b.message||(b.fullField||b.field)+" fails"):k instanceof Array?m(k):k instanceof Error&&m(k.message)}k&&k.then&&k.then(function(){return m()},function(S){return m(S)})},function(p){c(p)},l)},t.getType=function(r){if(r.type===void 0&&r.pattern instanceof RegExp&&(r.type="pattern"),typeof r.validator!="function"&&r.type&&!Bt.hasOwnProperty(r.type))throw new Error(Ae("Unknown rule type %s",r.type));return r.type||"string"},t.getValidationMethod=function(r){if(typeof r.validator=="function")return r.validator;var o=Object.keys(r),i=o.indexOf("message");return i!==-1&&o.splice(i,1),o.length===1&&o[0]==="required"?Bt.required:Bt[this.getType(r)]||void 0},e}();xt.register=function(t,n){if(typeof n!="function")throw new Error("Cannot register a validator by type, validator is not a function");Bt[t]=n};xt.warning=Ja;xt.messages=qn;xt.validators=Bt;function Sl(e){const t=_e(jt,null);return{mergedSize:$(()=>e.size!==void 0?e.size:(t==null?void 0:t.props.size)!==void 0?t.props.size:"medium")}}function Rl(e){const t=_e(jt,null),n=$(()=>{const{labelPlacement:u}=e;return u!==void 0?u:t!=null&&t.props.labelPlacement?t.props.labelPlacement:"top"}),r=$(()=>n.value==="left"&&(e.labelWidth==="auto"||(t==null?void 0:t.props.labelWidth)==="auto")),o=$(()=>{if(n.value==="top")return;const{labelWidth:u}=e;if(u!==void 0&&u!=="auto")return mn(u);if(r.value){const p=t==null?void 0:t.maxChildLabelWidthRef.value;return p!==void 0?mn(p):void 0}if((t==null?void 0:t.props.labelWidth)!==void 0)return mn(t.props.labelWidth)}),i=$(()=>{const{labelAlign:u}=e;if(u)return u;if(t!=null&&t.props.labelAlign)return t.props.labelAlign}),a=$(()=>{var u;return[(u=e.labelProps)===null||u===void 0?void 0:u.style,e.labelStyle,{width:o.value}]}),l=$(()=>{const{showRequireMark:u}=e;return u!==void 0?u:t==null?void 0:t.props.showRequireMark}),s=$(()=>{const{requireMarkPlacement:u}=e;return u!==void 0?u:(t==null?void 0:t.props.requireMarkPlacement)||"right"}),d=N(!1),c=N(!1),f=$(()=>{const{validationStatus:u}=e;if(u!==void 0)return u;if(d.value)return"error";if(c.value)return"warning"}),v=$(()=>{const{showFeedback:u}=e;return u!==void 0?u:(t==null?void 0:t.props.showFeedback)!==void 0?t.props.showFeedback:!0}),y=$(()=>{const{showLabel:u}=e;return u!==void 0?u:(t==null?void 0:t.props.showLabel)!==void 0?t.props.showLabel:!0});return{validationErrored:d,validationWarned:c,mergedLabelStyle:a,mergedLabelPlacement:n,mergedLabelAlign:i,mergedShowRequireMark:l,mergedRequireMarkPlacement:s,mergedValidationStatus:f,mergedShowFeedback:v,mergedShowLabel:y,isAutoLabelWidth:r}}function Pl(e){const t=_e(jt,null),n=$(()=>{const{rulePath:a}=e;if(a!==void 0)return a;const{path:l}=e;if(l!==void 0)return l}),r=$(()=>{const a=[],{rule:l}=e;if(l!==void 0&&(Array.isArray(l)?a.push(...l):a.push(l)),t){const{rules:s}=t.props,{value:d}=n;if(s!==void 0&&d!==void 0){const c=qr(s,d);c!==void 0&&(Array.isArray(c)?a.push(...c):a.push(c))}}return a}),o=$(()=>r.value.some(a=>a.required)),i=$(()=>o.value||e.required);return{mergedRules:r,mergedRequired:i}}const{cubicBezierEaseInOut:Fr}=Ci;function Fl({name:e="fade-down",fromOffset:t="-4px",enterDuration:n=".3s",leaveDuration:r=".3s",enterCubicBezier:o=Fr,leaveCubicBezier:i=Fr}={}){return[G(`&.${e}-transition-enter-from, &.${e}-transition-leave-to`,{opacity:0,transform:`translateY(${t})`}),G(`&.${e}-transition-enter-to, &.${e}-transition-leave-from`,{opacity:1,transform:"translateY(0)"}),G(`&.${e}-transition-leave-active`,{transition:`opacity ${r} ${i}, transform ${r} ${i}`}),G(`&.${e}-transition-enter-active`,{transition:`opacity ${n} ${o}, transform ${n} ${o}`})]}const Tl=M("form-item",`
 display: grid;
 line-height: var(--n-line-height);
`,[M("form-item-label",`
 grid-area: label;
 align-items: center;
 line-height: 1.25;
 text-align: var(--n-label-text-align);
 font-size: var(--n-label-font-size);
 min-height: var(--n-label-height);
 padding: var(--n-label-padding);
 color: var(--n-label-text-color);
 transition: color .3s var(--n-bezier);
 box-sizing: border-box;
 font-weight: var(--n-label-font-weight);
 `,[A("asterisk",`
 white-space: nowrap;
 user-select: none;
 -webkit-user-select: none;
 color: var(--n-asterisk-color);
 transition: color .3s var(--n-bezier);
 `),A("asterisk-placeholder",`
 grid-area: mark;
 user-select: none;
 -webkit-user-select: none;
 visibility: hidden; 
 `)]),M("form-item-blank",`
 grid-area: blank;
 min-height: var(--n-blank-height);
 `),q("auto-label-width",[M("form-item-label","white-space: nowrap;")]),q("left-labelled",`
 grid-template-areas:
 "label blank"
 "label feedback";
 grid-template-columns: auto minmax(0, 1fr);
 grid-template-rows: auto 1fr;
 align-items: flex-start;
 `,[M("form-item-label",`
 display: grid;
 grid-template-columns: 1fr auto;
 min-height: var(--n-blank-height);
 height: auto;
 box-sizing: border-box;
 flex-shrink: 0;
 flex-grow: 0;
 `,[q("reverse-columns-space",`
 grid-template-columns: auto 1fr;
 `),q("left-mark",`
 grid-template-areas:
 "mark text"
 ". text";
 `),q("right-mark",`
 grid-template-areas: 
 "text mark"
 "text .";
 `),q("right-hanging-mark",`
 grid-template-areas: 
 "text mark"
 "text .";
 `),A("text",`
 grid-area: text; 
 `),A("asterisk",`
 grid-area: mark; 
 align-self: end;
 `)])]),q("top-labelled",`
 grid-template-areas:
 "label"
 "blank"
 "feedback";
 grid-template-rows: minmax(var(--n-label-height), auto) 1fr;
 grid-template-columns: minmax(0, 100%);
 `,[q("no-label",`
 grid-template-areas:
 "blank"
 "feedback";
 grid-template-rows: 1fr;
 `),M("form-item-label",`
 display: flex;
 align-items: flex-start;
 justify-content: var(--n-label-text-align);
 `)]),M("form-item-blank",`
 box-sizing: border-box;
 display: flex;
 align-items: center;
 position: relative;
 `),M("form-item-feedback-wrapper",`
 grid-area: feedback;
 box-sizing: border-box;
 min-height: var(--n-feedback-height);
 font-size: var(--n-feedback-font-size);
 line-height: 1.25;
 transform-origin: top left;
 `,[G("&:not(:empty)",`
 padding: var(--n-feedback-padding);
 `),M("form-item-feedback",{transition:"color .3s var(--n-bezier)",color:"var(--n-feedback-text-color)"},[q("warning",{color:"var(--n-feedback-text-color-warning)"}),q("error",{color:"var(--n-feedback-text-color-error)"}),Fl({fromOffset:"-3px",enterDuration:".3s",leaveDuration:".2s"})])])]);var Tr=globalThis&&globalThis.__awaiter||function(e,t,n,r){function o(i){return i instanceof n?i:new n(function(a){a(i)})}return new(n||(n=Promise))(function(i,a){function l(c){try{d(r.next(c))}catch(f){a(f)}}function s(c){try{d(r.throw(c))}catch(f){a(f)}}function d(c){c.done?i(c.value):o(c.value).then(l,s)}d((r=r.apply(e,t||[])).next())})};const El=Object.assign(Object.assign({},Re.props),{label:String,labelWidth:[Number,String],labelStyle:[String,Object],labelAlign:String,labelPlacement:String,path:String,first:Boolean,rulePath:String,required:Boolean,showRequireMark:{type:Boolean,default:void 0},requireMarkPlacement:String,showFeedback:{type:Boolean,default:void 0},rule:[Object,Array],size:String,ignorePathChange:Boolean,validationStatus:String,feedback:String,feedbackClass:String,feedbackStyle:[String,Object],showLabel:{type:Boolean,default:void 0},labelProps:Object});function Er(e,t){return(...n)=>{try{const r=e(...n);return!t&&(typeof r=="boolean"||r instanceof Error||Array.isArray(r))||r!=null&&r.then?r:(r===void 0||dr("form-item/validate",`You return a ${typeof r} typed value in the validator method, which is not recommended. Please use `+(t?"`Promise`":"`boolean`, `Error` or `Promise`")+" typed value instead."),!0)}catch(r){dr("form-item/validate","An error is catched in the validation, so the validation won't be done. Your callback in `validate` method of `n-form` or `n-form-item` won't be called in this validation."),console.error(r);return}}}const Rs=me({name:"FormItem",props:El,setup(e){Ii(eo,"formItems",fe(e,"path"));const{mergedClsPrefixRef:t,inlineThemeDisabled:n}=De(e),r=_e(jt,null),o=Sl(e),i=Rl(e),{validationErrored:a,validationWarned:l}=i,{mergedRequired:s,mergedRules:d}=Pl(e),{mergedSize:c}=o,{mergedLabelPlacement:f,mergedLabelAlign:v,mergedRequireMarkPlacement:y}=i,u=N([]),p=N(On()),F=r?fe(r.props,"disabled"):N(!1),b=Re("Form","-form-item",Tl,jr,e,t);Be(fe(e,"path"),()=>{e.ignorePathChange||C()});function C(){u.value=[],a.value=!1,l.value=!1,e.feedback&&(p.value=On())}function w(){B("blur")}function m(){B("change")}function k(){B("focus")}function S(){B("input")}function z(E,j){return Tr(this,void 0,void 0,function*(){let K,Z,U,ee;return typeof E=="string"?(K=E,Z=j):E!==null&&typeof E=="object"&&(K=E.trigger,Z=E.callback,U=E.shouldRuleBeApplied,ee=E.options),yield new Promise((X,de)=>{B(K,U,ee).then(({valid:T,errors:_,warnings:H})=>{T?(Z&&Z(void 0,{warnings:H}),X({warnings:H})):(Z&&Z(_,{warnings:H}),de(_))})})})}const B=(...E)=>Tr(this,[...E],void 0,function*(j=null,K=()=>!0,Z={suppressWarning:!0}){const{path:U}=e;Z?Z.first||(Z.first=e.first):Z={};const{value:ee}=d,X=r?qr(r.props.model,U||""):void 0,de={},T={},_=(j?ee.filter(le=>Array.isArray(le.trigger)?le.trigger.includes(j):le.trigger===j):ee).filter(K).map((le,ye)=>{const ce=Object.assign({},le);if(ce.validator&&(ce.validator=Er(ce.validator,!1)),ce.asyncValidator&&(ce.asyncValidator=Er(ce.asyncValidator,!0)),ce.renderMessage){const ze=`__renderMessage__${ye}`;T[ze]=ce.message,ce.message=ze,de[ze]=ce.renderMessage}return ce}),H=_.filter(le=>le.level!=="warning"),he=_.filter(le=>le.level==="warning"),Ce=U??"__n_no_path__",Pe=new xt({[Ce]:H}),ke=new xt({[Ce]:he}),{validateMessages:be}=(r==null?void 0:r.props)||{};be&&(Pe.messages(be),ke.messages(be));const Fe=le=>{u.value=le.map(ye=>{const ce=(ye==null?void 0:ye.message)||"";return{key:ce,render:()=>ce.startsWith("__renderMessage__")?de[ce]():ce}}),le.forEach(ye=>{var ce;!((ce=ye.message)===null||ce===void 0)&&ce.startsWith("__renderMessage__")&&(ye.message=T[ye.message])})},ve={valid:!0,errors:void 0,warnings:void 0};if(H.length){const le=yield new Promise(ye=>{Pe.validate({[Ce]:X},Z,ye)});le!=null&&le.length&&(a.value=!0,ve.valid=!1,ve.errors=le,Fe(le))}if(he.length&&!ve.errors){const le=yield new Promise(ye=>{ke.validate({[Ce]:X},Z,ye)});le!=null&&le.length&&(Fe(le),l.value=!0,ve.warnings=le)}return H.length+he.length>0&&!ve.errors&&!ve.warnings&&C(),ve});Ye(ki,{path:fe(e,"path"),disabled:F,mergedSize:o.mergedSize,mergedValidationStatus:i.mergedValidationStatus,restoreValidation:C,handleContentBlur:w,handleContentChange:m,handleContentFocus:k,handleContentInput:S});const D={validate:z,restoreValidation:C,internalValidate:B},L=N(null);lt(()=>{if(!i.isAutoLabelWidth.value)return;const E=L.value;if(E!==null){const j=E.style.whiteSpace;E.style.whiteSpace="nowrap",E.style.width="",r==null||r.deriveMaxChildLabelWidth(Number(getComputedStyle(E).width.slice(0,-2))),E.style.whiteSpace=j}});const ne=$(()=>{var E;const{value:j}=c,{value:K}=f,Z=K==="top"?"vertical":"horizontal",{common:{cubicBezierEaseInOut:U},self:{labelTextColor:ee,asteriskColor:X,lineHeight:de,feedbackTextColor:T,feedbackTextColorWarning:_,feedbackTextColorError:H,feedbackPadding:he,labelFontWeight:Ce,[ae("labelHeight",j)]:Pe,[ae("blankHeight",j)]:ke,[ae("feedbackFontSize",j)]:be,[ae("feedbackHeight",j)]:Fe,[ae("labelPadding",Z)]:ve,[ae("labelTextAlign",Z)]:le,[ae(ae("labelFontSize",K),j)]:ye}}=b.value;let ce=(E=v.value)!==null&&E!==void 0?E:le;return K==="top"&&(ce=ce==="right"?"flex-end":"flex-start"),{"--n-bezier":U,"--n-line-height":de,"--n-blank-height":ke,"--n-label-font-size":ye,"--n-label-text-align":ce,"--n-label-height":Pe,"--n-label-padding":ve,"--n-label-font-weight":Ce,"--n-asterisk-color":X,"--n-label-text-color":ee,"--n-feedback-padding":he,"--n-feedback-font-size":be,"--n-feedback-height":Fe,"--n-feedback-text-color":T,"--n-feedback-text-color-warning":_,"--n-feedback-text-color-error":H}}),Y=n?Qe("form-item",$(()=>{var E;return`${c.value[0]}${f.value[0]}${((E=v.value)===null||E===void 0?void 0:E[0])||""}`}),ne,e):void 0,P=$(()=>f.value==="left"&&y.value==="left"&&v.value==="left");return Object.assign(Object.assign(Object.assign(Object.assign({labelElementRef:L,mergedClsPrefix:t,mergedRequired:s,feedbackId:p,renderExplains:u,reverseColSpace:P},i),o),D),{cssVars:n?void 0:ne,themeClass:Y==null?void 0:Y.themeClass,onRender:Y==null?void 0:Y.onRender})},render(){const{$slots:e,mergedClsPrefix:t,mergedShowLabel:n,mergedShowRequireMark:r,mergedRequireMarkPlacement:o,onRender:i}=this,a=r!==void 0?r:this.mergedRequired;i==null||i();const l=()=>{const s=this.$slots.label?this.$slots.label():this.label;if(!s)return null;const d=g("span",{class:`${t}-form-item-label__text`},s),c=a?g("span",{class:`${t}-form-item-label__asterisk`},o!=="left"?" *":"* "):o==="right-hanging"&&g("span",{class:`${t}-form-item-label__asterisk-placeholder`}," *"),{labelProps:f}=this;return g("label",Object.assign({},f,{class:[f==null?void 0:f.class,`${t}-form-item-label`,`${t}-form-item-label--${o}-mark`,this.reverseColSpace&&`${t}-form-item-label--reverse-columns-space`],style:this.mergedLabelStyle,ref:"labelElementRef"}),o==="left"?[c,d]:[d,c])};return g("div",{class:[`${t}-form-item`,this.themeClass,`${t}-form-item--${this.mergedSize}-size`,`${t}-form-item--${this.mergedLabelPlacement}-labelled`,this.isAutoLabelWidth&&`${t}-form-item--auto-label-width`,!n&&`${t}-form-item--no-label`],style:this.cssVars},n&&l(),g("div",{class:[`${t}-form-item-blank`,this.mergedValidationStatus&&`${t}-form-item-blank--${this.mergedValidationStatus}`]},e),this.mergedShowFeedback?g("div",{key:this.feedbackId,style:this.feedbackStyle,class:[`${t}-form-item-feedback-wrapper`,this.feedbackClass]},g(Jn,{name:"fade-down-transition",mode:"out-in"},{default:()=>{const{mergedValidationStatus:s}=this;return Ne(e.feedback,d=>{var c;const{feedback:f}=this,v=d||f?g("div",{key:"__feedback__",class:`${t}-form-item-feedback__line`},d||f):this.renderExplains.length?(c=this.renderExplains)===null||c===void 0?void 0:c.map(({key:y,render:u})=>g("div",{key:y,class:`${t}-form-item-feedback__line`},u())):null;return v?s==="warning"?g("div",{key:"controlled-warning",class:`${t}-form-item-feedback ${t}-form-item-feedback--warning`},v):s==="error"?g("div",{key:"controlled-error",class:`${t}-form-item-feedback ${t}-form-item-feedback--error`},v):s==="success"?g("div",{key:"controlled-success",class:`${t}-form-item-feedback ${t}-form-item-feedback--success`},v):g("div",{key:"controlled-default",class:`${t}-form-item-feedback`},v):null})}})):null)}}),Ps=["#00000000","#000000","#ffffff","#18A058","#2080F0","#F0A020","rgba(208, 48, 80, 1)","#C418D1FF"],Fs=[{label:"English",key:"en-US",value:"en-US"},{label:"简体中文",key:"zh-CN",value:"zh-CN"}];function Ts(e,t,n){return Pt({url:"/login/otp-bind",data:{bindToken:e,otp:t,deviceId:n}})}function Es(){return Pt({url:"/user/otp-setup"})}function As(e){return Pt({url:"/user/otp-confirm",data:{otp:e}})}function Is(){return Pt({url:"/user/otp-disable"})}function zs(){return Pt({url:"/user/device-list"})}function Ms(e){return Pt({url:`/user/device-delete/${e}`})}var an={},Al=function(){return typeof Promise=="function"&&Promise.prototype&&Promise.prototype.then},no={},Ie={};let er;const Il=[0,26,44,70,100,134,172,196,242,292,346,404,466,532,581,655,733,815,901,991,1085,1156,1258,1364,1474,1588,1706,1828,1921,2051,2185,2323,2465,2611,2761,2876,3034,3196,3362,3532,3706];Ie.getSymbolSize=function(t){if(!t)throw new Error('"version" cannot be null or undefined');if(t<1||t>40)throw new Error('"version" should be in range from 1 to 40');return t*4+17};Ie.getSymbolTotalCodewords=function(t){return Il[t]};Ie.getBCHDigit=function(e){let t=0;for(;e!==0;)t++,e>>>=1;return t};Ie.setToSJISFunction=function(t){if(typeof t!="function")throw new Error('"toSJISFunc" is not a valid function.');er=t};Ie.isKanjiModeEnabled=function(){return typeof er<"u"};Ie.toSJIS=function(t){return er(t)};var ln={};(function(e){e.L={bit:1},e.M={bit:0},e.Q={bit:3},e.H={bit:2};function t(n){if(typeof n!="string")throw new Error("Param is not a string");switch(n.toLowerCase()){case"l":case"low":return e.L;case"m":case"medium":return e.M;case"q":case"quartile":return e.Q;case"h":case"high":return e.H;default:throw new Error("Unknown EC Level: "+n)}}e.isValid=function(r){return r&&typeof r.bit<"u"&&r.bit>=0&&r.bit<4},e.from=function(r,o){if(e.isValid(r))return r;try{return t(r)}catch{return o}}})(ln);function ro(){this.buffer=[],this.length=0}ro.prototype={get:function(e){const t=Math.floor(e/8);return(this.buffer[t]>>>7-e%8&1)===1},put:function(e,t){for(let n=0;n<t;n++)this.putBit((e>>>t-n-1&1)===1)},getLengthInBits:function(){return this.length},putBit:function(e){const t=Math.floor(this.length/8);this.buffer.length<=t&&this.buffer.push(0),e&&(this.buffer[t]|=128>>>this.length%8),this.length++}};var zl=ro;function Wt(e){if(!e||e<1)throw new Error("BitMatrix size must be defined and greater than 0");this.size=e,this.data=new Uint8Array(e*e),this.reservedBit=new Uint8Array(e*e)}Wt.prototype.set=function(e,t,n,r){const o=e*this.size+t;this.data[o]=n,r&&(this.reservedBit[o]=!0)};Wt.prototype.get=function(e,t){return this.data[e*this.size+t]};Wt.prototype.xor=function(e,t,n){this.data[e*this.size+t]^=n};Wt.prototype.isReserved=function(e,t){return this.reservedBit[e*this.size+t]};var Ml=Wt,oo={};(function(e){const t=Ie.getSymbolSize;e.getRowColCoords=function(r){if(r===1)return[];const o=Math.floor(r/7)+2,i=t(r),a=i===145?26:Math.ceil((i-13)/(2*o-2))*2,l=[i-7];for(let s=1;s<o-1;s++)l[s]=l[s-1]-a;return l.push(6),l.reverse()},e.getPositions=function(r){const o=[],i=e.getRowColCoords(r),a=i.length;for(let l=0;l<a;l++)for(let s=0;s<a;s++)l===0&&s===0||l===0&&s===a-1||l===a-1&&s===0||o.push([i[l],i[s]]);return o}})(oo);var io={};const Bl=Ie.getSymbolSize,Ar=7;io.getPositions=function(t){const n=Bl(t);return[[0,0],[n-Ar,0],[0,n-Ar]]};var ao={};(function(e){e.Patterns={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7};const t={N1:3,N2:3,N3:40,N4:10};e.isValid=function(o){return o!=null&&o!==""&&!isNaN(o)&&o>=0&&o<=7},e.from=function(o){return e.isValid(o)?parseInt(o,10):void 0},e.getPenaltyN1=function(o){const i=o.size;let a=0,l=0,s=0,d=null,c=null;for(let f=0;f<i;f++){l=s=0,d=c=null;for(let v=0;v<i;v++){let y=o.get(f,v);y===d?l++:(l>=5&&(a+=t.N1+(l-5)),d=y,l=1),y=o.get(v,f),y===c?s++:(s>=5&&(a+=t.N1+(s-5)),c=y,s=1)}l>=5&&(a+=t.N1+(l-5)),s>=5&&(a+=t.N1+(s-5))}return a},e.getPenaltyN2=function(o){const i=o.size;let a=0;for(let l=0;l<i-1;l++)for(let s=0;s<i-1;s++){const d=o.get(l,s)+o.get(l,s+1)+o.get(l+1,s)+o.get(l+1,s+1);(d===4||d===0)&&a++}return a*t.N2},e.getPenaltyN3=function(o){const i=o.size;let a=0,l=0,s=0;for(let d=0;d<i;d++){l=s=0;for(let c=0;c<i;c++)l=l<<1&2047|o.get(d,c),c>=10&&(l===1488||l===93)&&a++,s=s<<1&2047|o.get(c,d),c>=10&&(s===1488||s===93)&&a++}return a*t.N3},e.getPenaltyN4=function(o){let i=0;const a=o.data.length;for(let s=0;s<a;s++)i+=o.data[s];return Math.abs(Math.ceil(i*100/a/5)-10)*t.N4};function n(r,o,i){switch(r){case e.Patterns.PATTERN000:return(o+i)%2===0;case e.Patterns.PATTERN001:return o%2===0;case e.Patterns.PATTERN010:return i%3===0;case e.Patterns.PATTERN011:return(o+i)%3===0;case e.Patterns.PATTERN100:return(Math.floor(o/2)+Math.floor(i/3))%2===0;case e.Patterns.PATTERN101:return o*i%2+o*i%3===0;case e.Patterns.PATTERN110:return(o*i%2+o*i%3)%2===0;case e.Patterns.PATTERN111:return(o*i%3+(o+i)%2)%2===0;default:throw new Error("bad maskPattern:"+r)}}e.applyMask=function(o,i){const a=i.size;for(let l=0;l<a;l++)for(let s=0;s<a;s++)i.isReserved(s,l)||i.xor(s,l,n(o,s,l))},e.getBestMask=function(o,i){const a=Object.keys(e.Patterns).length;let l=0,s=1/0;for(let d=0;d<a;d++){i(d),e.applyMask(d,o);const c=e.getPenaltyN1(o)+e.getPenaltyN2(o)+e.getPenaltyN3(o)+e.getPenaltyN4(o);e.applyMask(d,o),c<s&&(s=c,l=d)}return l}})(ao);var sn={};const Xe=ln,Yt=[1,1,1,1,1,1,1,1,1,1,2,2,1,2,2,4,1,2,4,4,2,4,4,4,2,4,6,5,2,4,6,6,2,5,8,8,4,5,8,8,4,5,8,11,4,8,10,11,4,9,12,16,4,9,16,16,6,10,12,18,6,10,17,16,6,11,16,19,6,13,18,21,7,14,21,25,8,16,20,25,8,17,23,25,9,17,23,34,9,18,25,30,10,20,27,32,12,21,29,35,12,23,34,37,12,25,34,40,13,26,35,42,14,28,38,45,15,29,40,48,16,31,43,51,17,33,45,54,18,35,48,57,19,37,51,60,19,38,53,63,20,40,56,66,21,43,59,70,22,45,62,74,24,47,65,77,25,49,68,81],Jt=[7,10,13,17,10,16,22,28,15,26,36,44,20,36,52,64,26,48,72,88,36,64,96,112,40,72,108,130,48,88,132,156,60,110,160,192,72,130,192,224,80,150,224,264,96,176,260,308,104,198,288,352,120,216,320,384,132,240,360,432,144,280,408,480,168,308,448,532,180,338,504,588,196,364,546,650,224,416,600,700,224,442,644,750,252,476,690,816,270,504,750,900,300,560,810,960,312,588,870,1050,336,644,952,1110,360,700,1020,1200,390,728,1050,1260,420,784,1140,1350,450,812,1200,1440,480,868,1290,1530,510,924,1350,1620,540,980,1440,1710,570,1036,1530,1800,570,1064,1590,1890,600,1120,1680,1980,630,1204,1770,2100,660,1260,1860,2220,720,1316,1950,2310,750,1372,2040,2430];sn.getBlocksCount=function(t,n){switch(n){case Xe.L:return Yt[(t-1)*4+0];case Xe.M:return Yt[(t-1)*4+1];case Xe.Q:return Yt[(t-1)*4+2];case Xe.H:return Yt[(t-1)*4+3];default:return}};sn.getTotalCodewordsCount=function(t,n){switch(n){case Xe.L:return Jt[(t-1)*4+0];case Xe.M:return Jt[(t-1)*4+1];case Xe.Q:return Jt[(t-1)*4+2];case Xe.H:return Jt[(t-1)*4+3];default:return}};var lo={},cn={};const _t=new Uint8Array(512),nn=new Uint8Array(256);(function(){let t=1;for(let n=0;n<255;n++)_t[n]=t,nn[t]=n,t<<=1,t&256&&(t^=285);for(let n=255;n<512;n++)_t[n]=_t[n-255]})();cn.log=function(t){if(t<1)throw new Error("log("+t+")");return nn[t]};cn.exp=function(t){return _t[t]};cn.mul=function(t,n){return t===0||n===0?0:_t[nn[t]+nn[n]]};(function(e){const t=cn;e.mul=function(r,o){const i=new Uint8Array(r.length+o.length-1);for(let a=0;a<r.length;a++)for(let l=0;l<o.length;l++)i[a+l]^=t.mul(r[a],o[l]);return i},e.mod=function(r,o){let i=new Uint8Array(r);for(;i.length-o.length>=0;){const a=i[0];for(let s=0;s<o.length;s++)i[s]^=t.mul(o[s],a);let l=0;for(;l<i.length&&i[l]===0;)l++;i=i.slice(l)}return i},e.generateECPolynomial=function(r){let o=new Uint8Array([1]);for(let i=0;i<r;i++)o=e.mul(o,new Uint8Array([1,t.exp(i)]));return o}})(lo);const so=lo;function tr(e){this.genPoly=void 0,this.degree=e,this.degree&&this.initialize(this.degree)}tr.prototype.initialize=function(t){this.degree=t,this.genPoly=so.generateECPolynomial(this.degree)};tr.prototype.encode=function(t){if(!this.genPoly)throw new Error("Encoder not initialized");const n=new Uint8Array(t.length+this.degree);n.set(t);const r=so.mod(n,this.genPoly),o=this.degree-r.length;if(o>0){const i=new Uint8Array(this.degree);return i.set(r,o),i}return r};var _l=tr,co={},et={},nr={};nr.isValid=function(t){return!isNaN(t)&&t>=1&&t<=40};var Ve={};const uo="[0-9]+",Ol="[A-Z $%*+\\-./:]+";let Lt="(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";Lt=Lt.replace(/u/g,"\\u");const $l="(?:(?![A-Z0-9 $%*+\\-./:]|"+Lt+`)(?:.|[\r
]))+`;Ve.KANJI=new RegExp(Lt,"g");Ve.BYTE_KANJI=new RegExp("[^A-Z0-9 $%*+\\-./:]+","g");Ve.BYTE=new RegExp($l,"g");Ve.NUMERIC=new RegExp(uo,"g");Ve.ALPHANUMERIC=new RegExp(Ol,"g");const Nl=new RegExp("^"+Lt+"$"),Ll=new RegExp("^"+uo+"$"),Dl=new RegExp("^[A-Z0-9 $%*+\\-./:]+$");Ve.testKanji=function(t){return Nl.test(t)};Ve.testNumeric=function(t){return Ll.test(t)};Ve.testAlphanumeric=function(t){return Dl.test(t)};(function(e){const t=nr,n=Ve;e.NUMERIC={id:"Numeric",bit:1,ccBits:[10,12,14]},e.ALPHANUMERIC={id:"Alphanumeric",bit:2,ccBits:[9,11,13]},e.BYTE={id:"Byte",bit:4,ccBits:[8,16,16]},e.KANJI={id:"Kanji",bit:8,ccBits:[8,10,12]},e.MIXED={bit:-1},e.getCharCountIndicator=function(i,a){if(!i.ccBits)throw new Error("Invalid mode: "+i);if(!t.isValid(a))throw new Error("Invalid version: "+a);return a>=1&&a<10?i.ccBits[0]:a<27?i.ccBits[1]:i.ccBits[2]},e.getBestModeForData=function(i){return n.testNumeric(i)?e.NUMERIC:n.testAlphanumeric(i)?e.ALPHANUMERIC:n.testKanji(i)?e.KANJI:e.BYTE},e.toString=function(i){if(i&&i.id)return i.id;throw new Error("Invalid mode")},e.isValid=function(i){return i&&i.bit&&i.ccBits};function r(o){if(typeof o!="string")throw new Error("Param is not a string");switch(o.toLowerCase()){case"numeric":return e.NUMERIC;case"alphanumeric":return e.ALPHANUMERIC;case"kanji":return e.KANJI;case"byte":return e.BYTE;default:throw new Error("Unknown mode: "+o)}}e.from=function(i,a){if(e.isValid(i))return i;try{return r(i)}catch{return a}}})(et);(function(e){const t=Ie,n=sn,r=ln,o=et,i=nr,a=7973,l=t.getBCHDigit(a);function s(v,y,u){for(let p=1;p<=40;p++)if(y<=e.getCapacity(p,u,v))return p}function d(v,y){return o.getCharCountIndicator(v,y)+4}function c(v,y){let u=0;return v.forEach(function(p){const F=d(p.mode,y);u+=F+p.getBitsLength()}),u}function f(v,y){for(let u=1;u<=40;u++)if(c(v,u)<=e.getCapacity(u,y,o.MIXED))return u}e.from=function(y,u){return i.isValid(y)?parseInt(y,10):u},e.getCapacity=function(y,u,p){if(!i.isValid(y))throw new Error("Invalid QR Code version");typeof p>"u"&&(p=o.BYTE);const F=t.getSymbolTotalCodewords(y),b=n.getTotalCodewordsCount(y,u),C=(F-b)*8;if(p===o.MIXED)return C;const w=C-d(p,y);switch(p){case o.NUMERIC:return Math.floor(w/10*3);case o.ALPHANUMERIC:return Math.floor(w/11*2);case o.KANJI:return Math.floor(w/13);case o.BYTE:default:return Math.floor(w/8)}},e.getBestVersionForData=function(y,u){let p;const F=r.from(u,r.M);if(Array.isArray(y)){if(y.length>1)return f(y,F);if(y.length===0)return 1;p=y[0]}else p=y;return s(p.mode,p.getLength(),F)},e.getEncodedBits=function(y){if(!i.isValid(y)||y<7)throw new Error("Invalid QR Code version");let u=y<<12;for(;t.getBCHDigit(u)-l>=0;)u^=a<<t.getBCHDigit(u)-l;return y<<12|u}})(co);var fo={};const Kn=Ie,ho=1335,Vl=21522,Ir=Kn.getBCHDigit(ho);fo.getEncodedBits=function(t,n){const r=t.bit<<3|n;let o=r<<10;for(;Kn.getBCHDigit(o)-Ir>=0;)o^=ho<<Kn.getBCHDigit(o)-Ir;return(r<<10|o)^Vl};var go={};const jl=et;function Ct(e){this.mode=jl.NUMERIC,this.data=e.toString()}Ct.getBitsLength=function(t){return 10*Math.floor(t/3)+(t%3?t%3*3+1:0)};Ct.prototype.getLength=function(){return this.data.length};Ct.prototype.getBitsLength=function(){return Ct.getBitsLength(this.data.length)};Ct.prototype.write=function(t){let n,r,o;for(n=0;n+3<=this.data.length;n+=3)r=this.data.substr(n,3),o=parseInt(r,10),t.put(o,10);const i=this.data.length-n;i>0&&(r=this.data.substr(n),o=parseInt(r,10),t.put(o,i*3+1))};var Wl=Ct;const ql=et,Fn=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"," ","$","%","*","+","-",".","/",":"];function kt(e){this.mode=ql.ALPHANUMERIC,this.data=e}kt.getBitsLength=function(t){return 11*Math.floor(t/2)+6*(t%2)};kt.prototype.getLength=function(){return this.data.length};kt.prototype.getBitsLength=function(){return kt.getBitsLength(this.data.length)};kt.prototype.write=function(t){let n;for(n=0;n+2<=this.data.length;n+=2){let r=Fn.indexOf(this.data[n])*45;r+=Fn.indexOf(this.data[n+1]),t.put(r,11)}this.data.length%2&&t.put(Fn.indexOf(this.data[n]),6)};var Kl=kt;const Ul=et;function St(e){this.mode=Ul.BYTE,typeof e=="string"?this.data=new TextEncoder().encode(e):this.data=new Uint8Array(e)}St.getBitsLength=function(t){return t*8};St.prototype.getLength=function(){return this.data.length};St.prototype.getBitsLength=function(){return St.getBitsLength(this.data.length)};St.prototype.write=function(e){for(let t=0,n=this.data.length;t<n;t++)e.put(this.data[t],8)};var Hl=St;const Gl=et,Yl=Ie;function Rt(e){this.mode=Gl.KANJI,this.data=e}Rt.getBitsLength=function(t){return t*13};Rt.prototype.getLength=function(){return this.data.length};Rt.prototype.getBitsLength=function(){return Rt.getBitsLength(this.data.length)};Rt.prototype.write=function(e){let t;for(t=0;t<this.data.length;t++){let n=Yl.toSJIS(this.data[t]);if(n>=33088&&n<=40956)n-=33088;else if(n>=57408&&n<=60351)n-=49472;else throw new Error("Invalid SJIS character: "+this.data[t]+`
Make sure your charset is UTF-8`);n=(n>>>8&255)*192+(n&255),e.put(n,13)}};var Jl=Rt,vo={exports:{}};(function(e){var t={single_source_shortest_paths:function(n,r,o){var i={},a={};a[r]=0;var l=t.PriorityQueue.make();l.push(r,0);for(var s,d,c,f,v,y,u,p,F;!l.empty();){s=l.pop(),d=s.value,f=s.cost,v=n[d]||{};for(c in v)v.hasOwnProperty(c)&&(y=v[c],u=f+y,p=a[c],F=typeof a[c]>"u",(F||p>u)&&(a[c]=u,l.push(c,u),i[c]=d))}if(typeof o<"u"&&typeof a[o]>"u"){var b=["Could not find a path from ",r," to ",o,"."].join("");throw new Error(b)}return i},extract_shortest_path_from_predecessor_list:function(n,r){for(var o=[],i=r;i;)o.push(i),n[i],i=n[i];return o.reverse(),o},find_path:function(n,r,o){var i=t.single_source_shortest_paths(n,r,o);return t.extract_shortest_path_from_predecessor_list(i,o)},PriorityQueue:{make:function(n){var r=t.PriorityQueue,o={},i;n=n||{};for(i in r)r.hasOwnProperty(i)&&(o[i]=r[i]);return o.queue=[],o.sorter=n.sorter||r.default_sorter,o},default_sorter:function(n,r){return n.cost-r.cost},push:function(n,r){var o={value:n,cost:r};this.queue.push(o),this.queue.sort(this.sorter)},pop:function(){return this.queue.shift()},empty:function(){return this.queue.length===0}}};e.exports=t})(vo);var Zl=vo.exports;(function(e){const t=et,n=Wl,r=Kl,o=Hl,i=Jl,a=Ve,l=Ie,s=Zl;function d(b){return unescape(encodeURIComponent(b)).length}function c(b,C,w){const m=[];let k;for(;(k=b.exec(w))!==null;)m.push({data:k[0],index:k.index,mode:C,length:k[0].length});return m}function f(b){const C=c(a.NUMERIC,t.NUMERIC,b),w=c(a.ALPHANUMERIC,t.ALPHANUMERIC,b);let m,k;return l.isKanjiModeEnabled()?(m=c(a.BYTE,t.BYTE,b),k=c(a.KANJI,t.KANJI,b)):(m=c(a.BYTE_KANJI,t.BYTE,b),k=[]),C.concat(w,m,k).sort(function(z,B){return z.index-B.index}).map(function(z){return{data:z.data,mode:z.mode,length:z.length}})}function v(b,C){switch(C){case t.NUMERIC:return n.getBitsLength(b);case t.ALPHANUMERIC:return r.getBitsLength(b);case t.KANJI:return i.getBitsLength(b);case t.BYTE:return o.getBitsLength(b)}}function y(b){return b.reduce(function(C,w){const m=C.length-1>=0?C[C.length-1]:null;return m&&m.mode===w.mode?(C[C.length-1].data+=w.data,C):(C.push(w),C)},[])}function u(b){const C=[];for(let w=0;w<b.length;w++){const m=b[w];switch(m.mode){case t.NUMERIC:C.push([m,{data:m.data,mode:t.ALPHANUMERIC,length:m.length},{data:m.data,mode:t.BYTE,length:m.length}]);break;case t.ALPHANUMERIC:C.push([m,{data:m.data,mode:t.BYTE,length:m.length}]);break;case t.KANJI:C.push([m,{data:m.data,mode:t.BYTE,length:d(m.data)}]);break;case t.BYTE:C.push([{data:m.data,mode:t.BYTE,length:d(m.data)}])}}return C}function p(b,C){const w={},m={start:{}};let k=["start"];for(let S=0;S<b.length;S++){const z=b[S],B=[];for(let D=0;D<z.length;D++){const L=z[D],ne=""+S+D;B.push(ne),w[ne]={node:L,lastCount:0},m[ne]={};for(let Y=0;Y<k.length;Y++){const P=k[Y];w[P]&&w[P].node.mode===L.mode?(m[P][ne]=v(w[P].lastCount+L.length,L.mode)-v(w[P].lastCount,L.mode),w[P].lastCount+=L.length):(w[P]&&(w[P].lastCount=L.length),m[P][ne]=v(L.length,L.mode)+4+t.getCharCountIndicator(L.mode,C))}}k=B}for(let S=0;S<k.length;S++)m[k[S]].end=0;return{map:m,table:w}}function F(b,C){let w;const m=t.getBestModeForData(b);if(w=t.from(C,m),w!==t.BYTE&&w.bit<m.bit)throw new Error('"'+b+'" cannot be encoded with mode '+t.toString(w)+`.
 Suggested mode is: `+t.toString(m));switch(w===t.KANJI&&!l.isKanjiModeEnabled()&&(w=t.BYTE),w){case t.NUMERIC:return new n(b);case t.ALPHANUMERIC:return new r(b);case t.KANJI:return new i(b);case t.BYTE:return new o(b)}}e.fromArray=function(C){return C.reduce(function(w,m){return typeof m=="string"?w.push(F(m,null)):m.data&&w.push(F(m.data,m.mode)),w},[])},e.fromString=function(C,w){const m=f(C,l.isKanjiModeEnabled()),k=u(m),S=p(k,w),z=s.find_path(S.map,"start","end"),B=[];for(let D=1;D<z.length-1;D++)B.push(S.table[z[D]].node);return e.fromArray(y(B))},e.rawSplit=function(C){return e.fromArray(f(C,l.isKanjiModeEnabled()))}})(go);const dn=Ie,Tn=ln,Xl=zl,Ql=Ml,es=oo,ts=io,Un=ao,Hn=sn,ns=_l,rn=co,rs=fo,os=et,En=go;function is(e,t){const n=e.size,r=ts.getPositions(t);for(let o=0;o<r.length;o++){const i=r[o][0],a=r[o][1];for(let l=-1;l<=7;l++)if(!(i+l<=-1||n<=i+l))for(let s=-1;s<=7;s++)a+s<=-1||n<=a+s||(l>=0&&l<=6&&(s===0||s===6)||s>=0&&s<=6&&(l===0||l===6)||l>=2&&l<=4&&s>=2&&s<=4?e.set(i+l,a+s,!0,!0):e.set(i+l,a+s,!1,!0))}}function as(e){const t=e.size;for(let n=8;n<t-8;n++){const r=n%2===0;e.set(n,6,r,!0),e.set(6,n,r,!0)}}function ls(e,t){const n=es.getPositions(t);for(let r=0;r<n.length;r++){const o=n[r][0],i=n[r][1];for(let a=-2;a<=2;a++)for(let l=-2;l<=2;l++)a===-2||a===2||l===-2||l===2||a===0&&l===0?e.set(o+a,i+l,!0,!0):e.set(o+a,i+l,!1,!0)}}function ss(e,t){const n=e.size,r=rn.getEncodedBits(t);let o,i,a;for(let l=0;l<18;l++)o=Math.floor(l/3),i=l%3+n-8-3,a=(r>>l&1)===1,e.set(o,i,a,!0),e.set(i,o,a,!0)}function An(e,t,n){const r=e.size,o=rs.getEncodedBits(t,n);let i,a;for(i=0;i<15;i++)a=(o>>i&1)===1,i<6?e.set(i,8,a,!0):i<8?e.set(i+1,8,a,!0):e.set(r-15+i,8,a,!0),i<8?e.set(8,r-i-1,a,!0):i<9?e.set(8,15-i-1+1,a,!0):e.set(8,15-i-1,a,!0);e.set(r-8,8,1,!0)}function cs(e,t){const n=e.size;let r=-1,o=n-1,i=7,a=0;for(let l=n-1;l>0;l-=2)for(l===6&&l--;;){for(let s=0;s<2;s++)if(!e.isReserved(o,l-s)){let d=!1;a<t.length&&(d=(t[a]>>>i&1)===1),e.set(o,l-s,d),i--,i===-1&&(a++,i=7)}if(o+=r,o<0||n<=o){o-=r,r=-r;break}}}function ds(e,t,n){const r=new Xl;n.forEach(function(s){r.put(s.mode.bit,4),r.put(s.getLength(),os.getCharCountIndicator(s.mode,e)),s.write(r)});const o=dn.getSymbolTotalCodewords(e),i=Hn.getTotalCodewordsCount(e,t),a=(o-i)*8;for(r.getLengthInBits()+4<=a&&r.put(0,4);r.getLengthInBits()%8!==0;)r.putBit(0);const l=(a-r.getLengthInBits())/8;for(let s=0;s<l;s++)r.put(s%2?17:236,8);return us(r,e,t)}function us(e,t,n){const r=dn.getSymbolTotalCodewords(t),o=Hn.getTotalCodewordsCount(t,n),i=r-o,a=Hn.getBlocksCount(t,n),l=r%a,s=a-l,d=Math.floor(r/a),c=Math.floor(i/a),f=c+1,v=d-c,y=new ns(v);let u=0;const p=new Array(a),F=new Array(a);let b=0;const C=new Uint8Array(e.buffer);for(let z=0;z<a;z++){const B=z<s?c:f;p[z]=C.slice(u,u+B),F[z]=y.encode(p[z]),u+=B,b=Math.max(b,B)}const w=new Uint8Array(r);let m=0,k,S;for(k=0;k<b;k++)for(S=0;S<a;S++)k<p[S].length&&(w[m++]=p[S][k]);for(k=0;k<v;k++)for(S=0;S<a;S++)w[m++]=F[S][k];return w}function fs(e,t,n,r){let o;if(Array.isArray(e))o=En.fromArray(e);else if(typeof e=="string"){let d=t;if(!d){const c=En.rawSplit(e);d=rn.getBestVersionForData(c,n)}o=En.fromString(e,d||40)}else throw new Error("Invalid data");const i=rn.getBestVersionForData(o,n);if(!i)throw new Error("The amount of data is too big to be stored in a QR Code");if(!t)t=i;else if(t<i)throw new Error(`
The chosen QR Code version cannot contain this amount of data.
Minimum version required to store current data is: `+i+`.
`);const a=ds(t,n,o),l=dn.getSymbolSize(t),s=new Ql(l);return is(s,t),as(s),ls(s,t),An(s,n,0),t>=7&&ss(s,t),cs(s,a),isNaN(r)&&(r=Un.getBestMask(s,An.bind(null,s,n))),Un.applyMask(r,s),An(s,n,r),{modules:s,version:t,errorCorrectionLevel:n,maskPattern:r,segments:o}}no.create=function(t,n){if(typeof t>"u"||t==="")throw new Error("No input text");let r=Tn.M,o,i;return typeof n<"u"&&(r=Tn.from(n.errorCorrectionLevel,Tn.M),o=rn.from(n.version),i=Un.from(n.maskPattern),n.toSJISFunc&&dn.setToSJISFunction(n.toSJISFunc)),fs(t,o,r,i)};var bo={},rr={};(function(e){function t(n){if(typeof n=="number"&&(n=n.toString()),typeof n!="string")throw new Error("Color should be defined as hex string");let r=n.slice().replace("#","").split("");if(r.length<3||r.length===5||r.length>8)throw new Error("Invalid hex color: "+n);(r.length===3||r.length===4)&&(r=Array.prototype.concat.apply([],r.map(function(i){return[i,i]}))),r.length===6&&r.push("F","F");const o=parseInt(r.join(""),16);return{r:o>>24&255,g:o>>16&255,b:o>>8&255,a:o&255,hex:"#"+r.slice(0,6).join("")}}e.getOptions=function(r){r||(r={}),r.color||(r.color={});const o=typeof r.margin>"u"||r.margin===null||r.margin<0?4:r.margin,i=r.width&&r.width>=21?r.width:void 0,a=r.scale||4;return{width:i,scale:i?4:a,margin:o,color:{dark:t(r.color.dark||"#000000ff"),light:t(r.color.light||"#ffffffff")},type:r.type,rendererOpts:r.rendererOpts||{}}},e.getScale=function(r,o){return o.width&&o.width>=r+o.margin*2?o.width/(r+o.margin*2):o.scale},e.getImageWidth=function(r,o){const i=e.getScale(r,o);return Math.floor((r+o.margin*2)*i)},e.qrToImageData=function(r,o,i){const a=o.modules.size,l=o.modules.data,s=e.getScale(a,i),d=Math.floor((a+i.margin*2)*s),c=i.margin*s,f=[i.color.light,i.color.dark];for(let v=0;v<d;v++)for(let y=0;y<d;y++){let u=(v*d+y)*4,p=i.color.light;if(v>=c&&y>=c&&v<d-c&&y<d-c){const F=Math.floor((v-c)/s),b=Math.floor((y-c)/s);p=f[l[F*a+b]?1:0]}r[u++]=p.r,r[u++]=p.g,r[u++]=p.b,r[u]=p.a}}})(rr);(function(e){const t=rr;function n(o,i,a){o.clearRect(0,0,i.width,i.height),i.style||(i.style={}),i.height=a,i.width=a,i.style.height=a+"px",i.style.width=a+"px"}function r(){try{return document.createElement("canvas")}catch{throw new Error("You need to specify a canvas element")}}e.render=function(i,a,l){let s=l,d=a;typeof s>"u"&&(!a||!a.getContext)&&(s=a,a=void 0),a||(d=r()),s=t.getOptions(s);const c=t.getImageWidth(i.modules.size,s),f=d.getContext("2d"),v=f.createImageData(c,c);return t.qrToImageData(v.data,i,s),n(f,d,c),f.putImageData(v,0,0),d},e.renderToDataURL=function(i,a,l){let s=l;typeof s>"u"&&(!a||!a.getContext)&&(s=a,a=void 0),s||(s={});const d=e.render(i,a,s),c=s.type||"image/png",f=s.rendererOpts||{};return d.toDataURL(c,f.quality)}})(bo);var po={};const hs=rr;function zr(e,t){const n=e.a/255,r=t+'="'+e.hex+'"';return n<1?r+" "+t+'-opacity="'+n.toFixed(2).slice(1)+'"':r}function In(e,t,n){let r=e+t;return typeof n<"u"&&(r+=" "+n),r}function gs(e,t,n){let r="",o=0,i=!1,a=0;for(let l=0;l<e.length;l++){const s=Math.floor(l%t),d=Math.floor(l/t);!s&&!i&&(i=!0),e[l]?(a++,l>0&&s>0&&e[l-1]||(r+=i?In("M",s+n,.5+d+n):In("m",o,0),o=0,i=!1),s+1<t&&e[l+1]||(r+=In("h",a),a=0)):o++}return r}po.render=function(t,n,r){const o=hs.getOptions(n),i=t.modules.size,a=t.modules.data,l=i+o.margin*2,s=o.color.light.a?"<path "+zr(o.color.light,"fill")+' d="M0 0h'+l+"v"+l+'H0z"/>':"",d="<path "+zr(o.color.dark,"stroke")+' d="'+gs(a,i,o.margin)+'"/>',c='viewBox="0 0 '+l+" "+l+'"',v='<svg xmlns="http://www.w3.org/2000/svg" '+(o.width?'width="'+o.width+'" height="'+o.width+'" ':"")+c+' shape-rendering="crispEdges">'+s+d+`</svg>
`;return typeof r=="function"&&r(null,v),v};const vs=Al,Gn=no,mo=bo,bs=po;function or(e,t,n,r,o){const i=[].slice.call(arguments,1),a=i.length,l=typeof i[a-1]=="function";if(!l&&!vs())throw new Error("Callback required as last argument");if(l){if(a<2)throw new Error("Too few arguments provided");a===2?(o=n,n=t,t=r=void 0):a===3&&(t.getContext&&typeof o>"u"?(o=r,r=void 0):(o=r,r=n,n=t,t=void 0))}else{if(a<1)throw new Error("Too few arguments provided");return a===1?(n=t,t=r=void 0):a===2&&!t.getContext&&(r=n,n=t,t=void 0),new Promise(function(s,d){try{const c=Gn.create(n,r);s(e(c,t,r))}catch(c){d(c)}})}try{const s=Gn.create(n,r);o(null,e(s,t,r))}catch(s){o(s)}}an.create=Gn.create;an.toCanvas=or.bind(null,mo.render);an.toDataURL=or.bind(null,mo.renderToDataURL);an.toString=or.bind(null,function(e,t,n){return bs.render(e,n)});export{Vi as C,Ni as E,ws as N,_i as V,Rs as a,ks as b,ga as c,Sn as d,Ss as e,an as f,zs as g,Qt as h,As as i,Is as j,Ms as k,pa as l,Cs as m,Ps as n,Es as o,Fs as p,Ts as q,xs as r,Ta as s,Sa as t,ys as u,wa as v,yn as w};
