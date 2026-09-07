import{I as ae,S as Ue}from"./browser-2381bdb0.js";import{f as R,C as gt,U as bt,h as xt,I as wt,P as yt}from"./index-bfd0c2db.js";import{m as L,l as c,R as S,n as oe,Q as De,z as St,A as Ct,d0 as kt,B as Ae,g as Ee,p as _t,d1 as zt,ak as $t,D as M,k as I,w as ye,_ as xe,b as Mt,G as Ve,U as Tt,s as v,t as b,P as i,x as $,M as A,v as B,N as ne,K as Rt,W as Bt,aj as se,Z as It,ar as le,f as ie,c as re,bJ as Ut,bL as Dt,bM as de,ah as u,bq as m,bs as p,bp as t,bQ as U,bt as j,as as Fe,br as we}from"./index-8fd49c7f.js";import{u as Vt,P as ue,j as Ft,G as Pt,b as K}from"./index-46f53c00.js";import{b as Se,u as Nt,V as At,e as Et,g as Ht}from"./index-daffc0bf.js";import{_ as Ot}from"./_plugin-vue_export-helper-c27b6911.js";var jt=L([c("slider",`
 display: block;
 padding: calc((var(--n-handle-size) - var(--n-rail-height)) / 2) 0;
 position: relative;
 z-index: 0;
 width: 100%;
 cursor: pointer;
 user-select: none;
 -webkit-user-select: none;
 `,[S("reverse",[c("slider-handles",[c("slider-handle-wrapper",`
 transform: translate(50%, -50%);
 `)]),c("slider-dots",[c("slider-dot",`
 transform: translateX(50%, -50%);
 `)]),S("vertical",[c("slider-handles",[c("slider-handle-wrapper",`
 transform: translate(-50%, -50%);
 `)]),c("slider-marks",[c("slider-mark",`
 transform: translateY(calc(-50% + var(--n-dot-height) / 2));
 `)]),c("slider-dots",[c("slider-dot",`
 transform: translateX(-50%) translateY(0);
 `)])])]),S("vertical",`
 box-sizing: content-box;
 padding: 0 calc((var(--n-handle-size) - var(--n-rail-height)) / 2);
 width: var(--n-rail-width-vertical);
 height: 100%;
 `,[c("slider-handles",`
 top: calc(var(--n-handle-size) / 2);
 right: 0;
 bottom: calc(var(--n-handle-size) / 2);
 left: 0;
 `,[c("slider-handle-wrapper",`
 top: unset;
 left: 50%;
 transform: translate(-50%, 50%);
 `)]),c("slider-rail",`
 height: 100%;
 `,[oe("fill",`
 top: unset;
 right: 0;
 bottom: unset;
 left: 0;
 `)]),S("with-mark",`
 width: var(--n-rail-width-vertical);
 margin: 0 32px 0 8px;
 `),c("slider-marks",`
 top: calc(var(--n-handle-size) / 2);
 right: unset;
 bottom: calc(var(--n-handle-size) / 2);
 left: 22px;
 font-size: var(--n-mark-font-size);
 `,[c("slider-mark",`
 transform: translateY(50%);
 white-space: nowrap;
 `)]),c("slider-dots",`
 top: calc(var(--n-handle-size) / 2);
 right: unset;
 bottom: calc(var(--n-handle-size) / 2);
 left: 50%;
 `,[c("slider-dot",`
 transform: translateX(-50%) translateY(50%);
 `)])]),S("disabled",`
 cursor: not-allowed;
 opacity: var(--n-opacity-disabled);
 `,[c("slider-handle",`
 cursor: not-allowed;
 `)]),S("with-mark",`
 width: 100%;
 margin: 8px 0 32px 0;
 `),L("&:hover",[c("slider-rail",{backgroundColor:"var(--n-rail-color-hover)"},[oe("fill",{backgroundColor:"var(--n-fill-color-hover)"})]),c("slider-handle",{boxShadow:"var(--n-handle-box-shadow-hover)"})]),S("active",[c("slider-rail",{backgroundColor:"var(--n-rail-color-hover)"},[oe("fill",{backgroundColor:"var(--n-fill-color-hover)"})]),c("slider-handle",{boxShadow:"var(--n-handle-box-shadow-hover)"})]),c("slider-marks",`
 position: absolute;
 top: 18px;
 left: calc(var(--n-handle-size) / 2);
 right: calc(var(--n-handle-size) / 2);
 `,[c("slider-mark",`
 position: absolute;
 transform: translateX(-50%);
 white-space: nowrap;
 `)]),c("slider-rail",`
 width: 100%;
 position: relative;
 height: var(--n-rail-height);
 background-color: var(--n-rail-color);
 transition: background-color .3s var(--n-bezier);
 border-radius: calc(var(--n-rail-height) / 2);
 `,[oe("fill",`
 position: absolute;
 top: 0;
 bottom: 0;
 border-radius: calc(var(--n-rail-height) / 2);
 transition: background-color .3s var(--n-bezier);
 background-color: var(--n-fill-color);
 `)]),c("slider-handles",`
 position: absolute;
 top: 0;
 right: calc(var(--n-handle-size) / 2);
 bottom: 0;
 left: calc(var(--n-handle-size) / 2);
 `,[c("slider-handle-wrapper",`
 outline: none;
 position: absolute;
 top: 50%;
 transform: translate(-50%, -50%);
 cursor: pointer;
 display: flex;
 `,[c("slider-handle",`
 height: var(--n-handle-size);
 width: var(--n-handle-size);
 border-radius: 50%;
 overflow: hidden;
 transition: box-shadow .2s var(--n-bezier), background-color .3s var(--n-bezier);
 background-color: var(--n-handle-color);
 box-shadow: var(--n-handle-box-shadow);
 `,[L("&:hover",`
 box-shadow: var(--n-handle-box-shadow-hover);
 `)]),L("&:focus",[c("slider-handle",`
 box-shadow: var(--n-handle-box-shadow-focus);
 `,[L("&:hover",`
 box-shadow: var(--n-handle-box-shadow-active);
 `)])])])]),c("slider-dots",`
 position: absolute;
 top: 50%;
 left: calc(var(--n-handle-size) / 2);
 right: calc(var(--n-handle-size) / 2);
 `,[S("transition-disabled",[c("slider-dot","transition: none;")]),c("slider-dot",`
 transition:
 border-color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 position: absolute;
 transform: translate(-50%, -50%);
 height: var(--n-dot-height);
 width: var(--n-dot-width);
 border-radius: var(--n-dot-border-radius);
 overflow: hidden;
 box-sizing: border-box;
 border: var(--n-dot-border);
 background-color: var(--n-dot-color);
 `,[S("active","border: var(--n-dot-border-active);")])])]),c("slider-handle-indicator",`
 font-size: var(--n-font-size);
 padding: 6px 10px;
 border-radius: var(--n-indicator-border-radius);
 color: var(--n-indicator-text-color);
 background-color: var(--n-indicator-color);
 box-shadow: var(--n-indicator-box-shadow);
 `,[De()]),c("slider-handle-indicator",`
 font-size: var(--n-font-size);
 padding: 6px 10px;
 border-radius: var(--n-indicator-border-radius);
 color: var(--n-indicator-text-color);
 background-color: var(--n-indicator-color);
 box-shadow: var(--n-indicator-box-shadow);
 `,[S("top",`
 margin-bottom: 12px;
 `),S("right",`
 margin-left: 12px;
 `),S("bottom",`
 margin-top: 12px;
 `),S("left",`
 margin-right: 12px;
 `),De()]),St(c("slider",[c("slider-dot","background-color: var(--n-dot-color-modal);")])),Ct(c("slider",[c("slider-dot","background-color: var(--n-dot-color-popover);")]))]);function Pe(o){return window.TouchEvent&&o instanceof window.TouchEvent}function Ne(){const o=new Map,D=n=>C=>{o.set(n,C)};return kt(()=>{o.clear()}),[o,D]}const Wt=["tabindex","aria-valuenow","aria-valuemin","aria-valuemax","aria-orientation","aria-disabled","onFocus","onBlur","onMouseenter","onMouseleave"],Lt=["onKeydown","onMousedown","onTouchstart"],Kt=0,Xt={...Ae.props,to:Se.propTo,defaultValue:{type:[Number,Array],default:0},marks:Object,disabled:{type:Boolean,default:void 0},formatTooltip:Function,keyboard:{type:Boolean,default:!0},min:{type:Number,default:0},max:{type:Number,default:100},step:{type:[Number,String],default:1},range:Boolean,value:[Number,Array],placement:String,showTooltip:{type:Boolean,default:void 0},tooltip:{type:Boolean,default:!0},vertical:Boolean,reverse:Boolean,"onUpdate:value":[Function,Array],onUpdateValue:[Function,Array],onDragstart:[Function],onDragend:[Function]};var X=Ee({name:"Slider",props:Xt,slots:Object,setup(o){const{mergedClsPrefixRef:D,namespaceRef:n,inlineThemeDisabled:C}=_t(o),g=Ae("Slider","-slider",jt,zt,o,D),x=I(null),[V,E]=Ne(),[ce,fe]=Ne(),W=I(new Set),G=$t(o),{mergedDisabledRef:d}=G,l=M(()=>{const{step:e}=o;if(Number(e)<=0||e==="mark")return 0;const a=e.toString();let s=0;return a.includes(".")&&(s=a.length-a.indexOf(".")-1),s}),r=I(o.defaultValue),He=It(o,"value"),pe=Nt(He,r),_=M(()=>{const{value:e}=pe;return(o.range?e:[e]).map(Te)}),Ce=M(()=>_.value.length>2),Oe=M(()=>o.placement===void 0?o.vertical?"right":"top":o.placement),ke=M(()=>{const{marks:e}=o;return e?Object.keys(e).map(Number.parseFloat):null}),z=I(-1),_e=I(-1),P=I(-1),N=I(!1),Y=I(!1),he=M(()=>{const{vertical:e,reverse:a}=o;return e?a?"top":"bottom":a?"right":"left"}),je=M(()=>{if(Ce.value)return;const e=_.value,a=q(o.range?Math.min(...e):o.min),s=q(o.range?Math.max(...e):e[0]),{value:f}=he;return o.vertical?{[f]:`${a}%`,height:`${s-a}%`}:{[f]:`${a}%`,width:`${s-a}%`}}),We=M(()=>{const e=[],{marks:a}=o;if(a){const s=_.value.slice();s.sort((y,w)=>y-w);const{value:f}=he,{value:h}=Ce,{range:k}=o,T=h?()=>!1:y=>k?y>=s[0]&&y<=s[s.length-1]:y<=s[0];for(const y of Object.keys(a)){const w=Number(y);e.push({active:T(w),key:w,label:a[y],style:{[f]:`${q(w)}%`}})}}return e});function Le(e,a){const s=q(e),{value:f}=he;return{[f]:`${s}%`,zIndex:a===z.value?1:0}}function ze(e){return o.showTooltip||P.value===e||z.value===e&&N.value}function Ke(e){return N.value?!(z.value===e&&_e.value===e):!0}function Xe(e){var a;~e&&(z.value=e,(a=V.get(e))==null||a.focus())}function Ge(){ce.forEach((e,a)=>{ze(a)&&e.syncPosition()})}function $e(e){const{"onUpdate:value":a,onUpdateValue:s}=o,{nTriggerFormInput:f,nTriggerFormChange:h}=G;s&&le(s,e),a&&le(a,e),r.value=e,f(),h()}function Me(e){const{range:a}=o;if(a){if(Array.isArray(e)){const{value:s}=_;e.join()!==s.join()&&$e(e)}}else Array.isArray(e)||_.value[0]!==e&&$e(e)}function ve(e,a){if(o.range){const s=_.value.slice();s.splice(a,1,e),Me(s)}else Me(e)}function me(e,a,s){const f=s!==void 0;s||(s=e-a>0?1:-1);const h=ke.value||[],{step:k}=o;if(k==="mark"){const w=J(e,h.concat(a),f?s:void 0);return w?w.value:a}if(k<=0)return a;const{value:T}=l;let y;if(f){const w=Number((a/k).toFixed(T)),F=Math.floor(w),ge=w>F?F:F-1,be=w<F?F:F+1;y=J(a,[Number((ge*k).toFixed(T)),Number((be*k).toFixed(T)),...h],s)}else{const w=qe(e);y=J(e,[...h,w])}return y?Te(y.value):a}function Te(e){return Math.min(o.max,Math.max(o.min,e))}function q(e){const{max:a,min:s}=o;return(e-s)/(a-s)*100}function Ye(e){const{max:a,min:s}=o;return s+(a-s)*e}function qe(e){const{step:a,min:s}=o;if(Number(a)<=0||a==="mark")return e;const f=Math.round((e-s)/a)*a+s;return Number(f.toFixed(l.value))}function J(e,a=ke.value,s){if(!(a!=null&&a.length))return null;let f=null,h=-1;for(;++h<a.length;){const k=a[h]-e,T=Math.abs(k);(s===void 0||k*s>0)&&(f===null||T<f.distance)&&(f={index:h,distance:T,value:a[h]})}return f}function Re(e){const a=x.value;if(!a)return;const s=Pe(e)?e.touches[0]:e,f=a.getBoundingClientRect();let h;return o.vertical?h=(f.bottom-s.clientY)/f.height:h=(s.clientX-f.left)/f.width,o.reverse&&(h=1-h),Ye(h)}function Je(e){if(d.value||!o.keyboard)return;const{vertical:a,reverse:s}=o;switch(e.key){case"ArrowUp":e.preventDefault(),Q(a&&s?-1:1);break;case"ArrowRight":e.preventDefault(),Q(!a&&s?-1:1);break;case"ArrowDown":e.preventDefault(),Q(a&&s?1:-1);break;case"ArrowLeft":e.preventDefault(),Q(!a&&s?1:-1)}}function Q(e){const a=z.value;if(a===-1)return;const{step:s}=o,f=_.value[a];ve(me(Number(s)<=0||s==="mark"?f:f+s*e,f,e>0?1:-1),a)}function Qe(e){var h;if(d.value||!Pe(e)&&e.button!==Kt)return;const a=Re(e);if(a===void 0)return;const s=_.value.slice(),f=o.range?((h=J(a,s))==null?void 0:h.index)??-1:0;f!==-1&&(e.preventDefault(),Xe(f),Ze(),ve(me(a,_.value[f]),f))}function Ze(){N.value||(N.value=!0,o.onDragstart&&le(o.onDragstart),ie("touchend",document,te),ie("mouseup",document,te),ie("touchmove",document,ee),ie("mousemove",document,ee))}function Z(){N.value&&(N.value=!1,o.onDragend&&le(o.onDragend),re("touchend",document,te),re("mouseup",document,te),re("touchmove",document,ee),re("mousemove",document,ee))}function ee(e){const{value:a}=z;if(!N.value||a===-1){Z();return}const s=Re(e);s!==void 0&&ve(me(s,_.value[a]),a)}function te(){Z()}function et(e){z.value=e,d.value||(P.value=e)}function tt(e){z.value===e&&(z.value=-1,Z()),P.value===e&&(P.value=-1)}function at(e){P.value=e}function ot(e){P.value===e&&(P.value=-1)}ye(z,(e,a)=>void xe(()=>_e.value=a)),ye(pe,()=>{if(o.marks){if(Y.value)return;Y.value=!0,xe(()=>{Y.value=!1})}xe(Ge)}),Mt(()=>{Z()});const Be=M(()=>{const{self:{markFontSize:e,railColor:a,railColorHover:s,fillColor:f,fillColorHover:h,handleColor:k,opacityDisabled:T,dotColor:y,dotColorModal:w,handleBoxShadow:F,handleBoxShadowHover:ge,handleBoxShadowActive:be,handleBoxShadowFocus:nt,dotBorder:st,dotBoxShadow:lt,railHeight:it,railWidthVertical:rt,handleSize:dt,dotHeight:ut,dotWidth:ct,dotBorderRadius:ft,fontSize:pt,dotBorderActive:ht,dotColorPopover:vt},common:{cubicBezierEaseInOut:mt}}=g.value;return{"--n-bezier":mt,"--n-dot-border":st,"--n-dot-border-active":ht,"--n-dot-border-radius":ft,"--n-dot-box-shadow":lt,"--n-dot-color":y,"--n-dot-color-modal":w,"--n-dot-color-popover":vt,"--n-dot-height":ut,"--n-dot-width":ct,"--n-fill-color":f,"--n-fill-color-hover":h,"--n-font-size":pt,"--n-handle-box-shadow":F,"--n-handle-box-shadow-active":be,"--n-handle-box-shadow-focus":nt,"--n-handle-box-shadow-hover":ge,"--n-handle-color":k,"--n-handle-size":dt,"--n-opacity-disabled":T,"--n-rail-color":a,"--n-rail-color-hover":s,"--n-rail-height":it,"--n-rail-width-vertical":rt,"--n-mark-font-size":e}}),H=C?Ve("slider",void 0,Be,o):void 0,Ie=M(()=>{const{self:{fontSize:e,indicatorColor:a,indicatorBoxShadow:s,indicatorTextColor:f,indicatorBorderRadius:h}}=g.value;return{"--n-font-size":e,"--n-indicator-border-radius":h,"--n-indicator-box-shadow":s,"--n-indicator-color":a,"--n-indicator-text-color":f}}),O=C?Ve("slider-indicator",void 0,Ie,o):void 0;return{mergedClsPrefix:D,namespace:n,uncontrolledValue:r,mergedValue:pe,mergedDisabled:d,mergedPlacement:Oe,isMounted:Tt(),adjustedTo:Se(o),dotTransitionDisabled:Y,markInfos:We,isShowTooltip:ze,shouldKeepTooltipTransition:Ke,handleRailRef:x,setHandleRefs:E,setFollowerRefs:fe,fillStyle:je,getHandleStyle:Le,activeIndex:z,arrifiedValues:_,followerEnabledIndexSet:W,handleRailMouseDown:Qe,handleHandleFocus:et,handleHandleBlur:tt,handleHandleMouseEnter:at,handleHandleMouseLeave:ot,handleRailKeyDown:Je,indicatorCssVars:C?void 0:Ie,indicatorThemeClass:O==null?void 0:O.themeClass,indicatorOnRender:O==null?void 0:O.onRender,cssVars:C?void 0:Be,themeClass:H==null?void 0:H.themeClass,onRender:H==null?void 0:H.onRender}},render(){var C;const{mergedClsPrefix:o,themeClass:D,formatTooltip:n}=this;return(C=this.onRender)==null||C.call(this),v(),b("div",{class:$([`${o}-slider`,D,{[`${o}-slider--disabled`]:this.mergedDisabled,[`${o}-slider--active`]:this.activeIndex!==-1,[`${o}-slider--with-mark`]:this.marks,[`${o}-slider--vertical`]:this.vertical,[`${o}-slider--reverse`]:this.reverse}]),style:A(this.cssVars),onKeydown:this.handleRailKeyDown,onMousedown:this.handleRailMouseDown,onTouchstart:this.handleRailMouseDown},[i("div",{class:$(`${o}-slider-rail`)},[i("div",{class:$(`${o}-slider-rail__fill`),style:A(this.fillStyle)},null,6),this.marks?(v(),b("div",{key:0,class:$([`${o}-slider-dots`,this.dotTransitionDisabled&&`${o}-slider-dots--transition-disabled`])},[B(()=>this.markInfos.map(g=>(v(),b("div",{key:g.key,class:$([`${o}-slider-dot`,{[`${o}-slider-dot--active`]:g.active}]),style:A(g.style)},null,6))))],2)):B(()=>null),i("div",{ref:"handleRailRef",class:$(`${o}-slider-handles`)},[B(()=>this.arrifiedValues.map((g,x)=>{const V=this.isShowTooltip(x);return v(),ne(Ht,null,{default:()=>[(v(),ne(At,null,{default:()=>(v(),b("div",{ref:this.setHandleRefs(x),class:$(`${o}-slider-handle-wrapper`),tabindex:this.mergedDisabled?-1:0,role:"slider","aria-valuenow":g,"aria-valuemin":this.min,"aria-valuemax":this.max,"aria-orientation":this.vertical?"vertical":"horizontal","aria-disabled":this.disabled,style:A(this.getHandleStyle(g,x)),onFocus:()=>{this.handleHandleFocus(x)},onBlur:()=>{this.handleHandleBlur(x)},onMouseenter:()=>{this.handleHandleMouseEnter(x)},onMouseleave:()=>{this.handleHandleMouseLeave(x)}},[B(()=>Rt(this.$slots.thumb,()=>[(v(),b("div",{class:$(`${o}-slider-handle`)},null,2))]))],46,Wt))},1024)),this.tooltip&&(v(),ne(Et,{ref:this.setFollowerRefs(x),show:V,to:this.adjustedTo,enabled:this.showTooltip&&!this.range||this.followerEnabledIndexSet.has(x),teleportDisabled:this.adjustedTo===Se.tdkey,placement:this.mergedPlacement,containerClass:this.namespace},{default:()=>(v(),ne(Bt,{name:"fade-in-scale-up-transition",appear:this.isMounted,css:this.shouldKeepTooltipTransition(x),onEnter:()=>{this.followerEnabledIndexSet.add(x)},onAfterLeave:()=>{this.followerEnabledIndexSet.delete(x)}},{default:()=>{var E;return V?((E=this.indicatorOnRender)==null||E.call(this),v(),b("div",{key:1,class:$([`${o}-slider-handle-indicator`,this.indicatorThemeClass,`${o}-slider-handle-indicator--${this.mergedPlacement}`]),style:A(this.indicatorCssVars)},[typeof n=="function"?(v(),b(se,{key:0},[B(()=>n(g))],64)):(v(),b(se,{key:1},[B(()=>g)],64))],6)):null}},1032,["appear","css","onEnter","onAfterLeave"]))},1032,["show","to","enabled","teleportDisabled","placement","containerClass"]))]},1024)}))],2),this.marks?(v(),b("div",{key:2,class:$(`${o}-slider-marks`)},[B(()=>this.markInfos.map(g=>(v(),b("div",{key:g.key,class:$(`${o}-slider-mark`),style:A(g.style)},[typeof g.label=="function"?(v(),b(se,{key:0},[B(()=>g.label())],64)):(v(),b(se,{key:1},[B(()=>g.label)],64))],6))))],2)):B(()=>null)],2)],46,Lt)}});const Gt={class:"bg-slate-200 dark:bg-zinc-900 rounded-[10px] p-[8px] overflow-auto"},Yt={class:"flex items-center mt-[5px]"},qt={class:"text-slate-500 mb-[5px] font-bold"},Jt={class:"flex items-center mt-[5px]"},Qt={class:"mr-[10px]"},Zt={class:"text-slate-500 mb-[5px] font-bold"},ea={class:"flex items-center mt-[5px]"},ta={class:"mr-[10px]"},aa={key:0,class:"flex items-center mt-[5px]"},oa={class:"mr-[10px]"},na={class:"text-slate-500 mb-[5px] font-bold"},sa={class:"flex items-center mt-[5px]"},la={class:"mr-[10px]"},ia={key:0,class:"flex items-center mt-[5px]"},ra={class:"mr-[10px]"},da={key:1,class:"flex items-center mt-[5px]"},ua={class:"mr-[10px]"},ca={class:"text-slate-500 mb-[5px] font-bold"},fa={class:"mt-[5px]"},pa={class:"flex items-center mt-[5px]"},ha={key:0,class:"mt-[5px]"},va={class:"flex items-center mt-[5px]"},ma={key:1,class:"mt-[5px]"},ga={class:"flex items-center mt-[5px]"},ba={class:"mt-[5px]"},xa={class:"flex items-center mt-[5px]"},wa={class:"text-slate-500 mb-[5px] font-bold"},ya={class:"text-shadow text-white"},Sa={class:"flex items-center mt-[5px]"},Ca={class:"mr-[10px]"},ka={key:0,class:"mt-1"},_a={class:"flex items-center mt-[10px]"},za={class:"mr-[10px]"},$a={class:"flex items-center mt-[10px]"},Ma={class:"mr-[10px]"},Ta={class:"text-slate-500 mb-[5px] font-bold"},Ra={class:"flex items-center mt-[5px]"},Ba={class:"mr-[10px]"},Ia={class:"flex items-center mt-[10px]"},Ua={class:"mr-[10px]"},Da={class:"flex"},Va={class:"flex items-center mt-[10px]"},Fa={class:"mr-[10px]"},Pa={class:"flex items-center mt-[10px]"},Na={class:"mr-[10px]"},Aa={class:"flex items-center mt-[10px]"},Ea={class:"mr-[10px]"},Ha={class:"text-slate-500 mb-[5px] font-bold"},Oa=Ee({__name:"index",setup(o){const D=Ut(),n=Vt(),C=Dt(),g=I(!1),x=M({get:()=>String(n.panelConfig.maxWidth??""),set:d=>{const l=Number(d);n.panelConfig.maxWidth=d.trim()===""||Number.isNaN(l)?void 0:l}}),V=I(!1),E=[{label:de("apps.baseSettings.detailIcon"),value:ue.info},{label:de("apps.baseSettings.smallIcon"),value:ue.icon}],ce=[{label:"px",value:"px"},{label:"%",value:"%"}];ye(n.panelConfig,()=>{V.value||(V.value=!0,setTimeout(()=>{n.recordState(),V.value=!1,W()},1e3))});function fe({file:d,event:l}){const r=JSON.parse((l==null?void 0:l.target).response);return n.panelConfig.backgroundImageSrc=r.data.imageUrl,d}function W(){Ft({panel:n.panelConfig}).then(d=>{d.code===0?C.success(de("apps.baseSettings.configSaved")):C.error(de("apps.baseSettings.configFailed",{message:d.msg}))})}function G(){n.resetPanelConfig(),W()}return(d,l)=>(v(),b("div",Gt,[u(t(U),{style:{"border-radius":"10px"},size:"small"},{default:m(()=>[l[22]||(l[22]=i("div",{class:"text-slate-500 mb-[5px] font-bold"}," LOGO ",-1)),i("div",null,[i("div",null,p(d.$t("apps.baseSettings.textContent")),1),i("div",Yt,[u(t(ae),{value:t(n).panelConfig.logoText,"onUpdate:value":l[0]||(l[0]=r=>t(n).panelConfig.logoText=r),type:"text","show-count":"",maxlength:20,placeholder:"请输入文字"},null,8,["value"])])])]),_:1}),u(t(U),{style:{"border-radius":"10px"},class:"mt-[10px]",size:"small"},{default:m(()=>[i("div",qt,p(d.$t("apps.baseSettings.clock")),1),i("div",Jt,[i("span",Qt,p(d.$t("apps.baseSettings.clockSecondShow")),1),u(t(R),{value:t(n).panelConfig.clockShowSecond,"onUpdate:value":l[1]||(l[1]=r=>t(n).panelConfig.clockShowSecond=r)},null,8,["value"])])]),_:1}),u(t(U),{style:{"border-radius":"10px"},class:"mt-[10px]",size:"small"},{default:m(()=>[i("div",Zt,p(d.$t("apps.baseSettings.searchBar")),1),i("div",ea,[i("span",ta,p(d.$t("common.show")),1),u(t(R),{value:t(n).panelConfig.searchBoxShow,"onUpdate:value":l[2]||(l[2]=r=>t(n).panelConfig.searchBoxShow=r)},null,8,["value"])]),t(n).panelConfig.searchBoxShow?(v(),b("div",aa,[i("span",oa,p(d.$t("apps.baseSettings.searchBarSearchItem")),1),u(t(R),{value:t(n).panelConfig.searchBoxSearchIcon,"onUpdate:value":l[3]||(l[3]=r=>t(n).panelConfig.searchBoxSearchIcon=r)},null,8,["value"])])):j("",!0)]),_:1}),u(t(U),{style:{"border-radius":"10px"},class:"mt-[10px]",size:"small"},{default:m(()=>[i("div",na,p(d.$t("apps.baseSettings.systemMonitorStatus")),1),i("div",sa,[i("span",la,p(d.$t("common.show")),1),u(t(R),{value:t(n).panelConfig.systemMonitorShow,"onUpdate:value":l[4]||(l[4]=r=>t(n).panelConfig.systemMonitorShow=r)},null,8,["value"])]),t(n).panelConfig.systemMonitorShow?(v(),b("div",ia,[i("span",ra,p(d.$t("apps.baseSettings.showTitle")),1),u(t(R),{value:t(n).panelConfig.systemMonitorShowTitle,"onUpdate:value":l[5]||(l[5]=r=>t(n).panelConfig.systemMonitorShowTitle=r)},null,8,["value"])])):j("",!0),t(n).panelConfig.systemMonitorShow?(v(),b("div",da,[i("span",ua,p(d.$t("apps.baseSettings.publicVisitModeShow")),1),u(t(R),{value:t(n).panelConfig.systemMonitorPublicVisitModeShow,"onUpdate:value":l[6]||(l[6]=r=>t(n).panelConfig.systemMonitorPublicVisitModeShow=r)},null,8,["value"])])):j("",!0)]),_:1}),u(t(U),{style:{"border-radius":"10px"},class:"mt-[10px]",size:"small"},{default:m(()=>[i("div",ca,p(d.$t("common.icon")),1),i("div",fa,[i("div",null,p(d.$t("common.style")),1),i("div",pa,[u(t(Ue),{value:t(n).panelConfig.iconStyle,"onUpdate:value":l[7]||(l[7]=r=>t(n).panelConfig.iconStyle=r),options:E},null,8,["value"])])]),t(n).panelConfig.iconStyle===t(ue).info?(v(),b("div",ha,[i("div",null,p(d.$t("apps.baseSettings.hideDescription")),1),i("div",va,[u(t(R),{value:t(n).panelConfig.iconTextInfoHideDescription,"onUpdate:value":l[8]||(l[8]=r=>t(n).panelConfig.iconTextInfoHideDescription=r)},null,8,["value"])])])):j("",!0),t(n).panelConfig.iconStyle===t(ue).icon?(v(),b("div",ma,[i("div",null,p(d.$t("apps.baseSettings.hideTitle")),1),i("div",ga,[u(t(R),{value:t(n).panelConfig.iconTextIconHideTitle,"onUpdate:value":l[9]||(l[9]=r=>t(n).panelConfig.iconTextIconHideTitle=r)},null,8,["value"])])])):j("",!0),i("div",ba,[i("div",null,p(d.$t("common.textColor")),1),i("div",xa,[u(t(gt),{value:t(n).panelConfig.iconTextColor,"onUpdate:value":l[10]||(l[10]=r=>t(n).panelConfig.iconTextColor=r),"show-alpha":!1,size:"small",modes:["hex"],swatches:["#000000","#ffffff","#18A058","#2080F0","#F0A020"]},null,8,["value"])])])]),_:1}),u(t(U),{style:{"border-radius":"10px"},class:"mt-[10px]",size:"small"},{default:m(()=>[i("div",wa,p(d.$t("apps.baseSettings.wallpaper")),1),u(t(bt),{action:"/api/file/uploadImg","show-file-list":!1,name:"imgfile",headers:{token:t(D).token},"directory-dnd":!0,onFinish:fe},{default:m(()=>[u(t(xt),{style:{width:"100%"}},{default:m(()=>[i("div",{class:"h-[200px] w-full border bg-slate-100 flex justify-center items-center cursor-pointer rounded-[10px]",style:A({background:`url(${t(n).panelConfig.backgroundImageSrc}) no-repeat`,backgroundSize:"cover"})},[i("div",ya,p(d.$t("apps.baseSettings.uploadOrDragText")),1)],4)]),_:1})]),_:1},8,["headers"]),i("div",Sa,[i("span",Ca,p(d.$t("apps.baseSettings.customImageAddress")),1),u(t(R),{value:g.value,"onUpdate:value":l[11]||(l[11]=r=>g.value=r)},null,8,["value"])]),g.value?(v(),b("div",ka,[u(t(ae),{value:t(n).panelConfig.backgroundImageSrc,"onUpdate:value":l[12]||(l[12]=r=>t(n).panelConfig.backgroundImageSrc=r),type:"text",size:"small",clearable:""},null,8,["value"])])):j("",!0),i("div",_a,[i("span",za,p(d.$t("apps.baseSettings.vague")),1),u(t(X),{value:t(n).panelConfig.backgroundBlur,"onUpdate:value":l[13]||(l[13]=r=>t(n).panelConfig.backgroundBlur=r),class:"max-w-[200px]",step:2,max:20},null,8,["value"])]),i("div",$a,[i("span",Ma,p(d.$t("apps.baseSettings.mask")),1),u(t(X),{value:t(n).panelConfig.backgroundMaskNumber,"onUpdate:value":l[14]||(l[14]=r=>t(n).panelConfig.backgroundMaskNumber=r),class:"max-w-[200px]",step:.1,max:1},null,8,["value"])])]),_:1}),u(t(U),{style:{"border-radius":"10px"},class:"mt-[10px]",size:"small"},{default:m(()=>[i("div",Ta,p(d.$t("apps.baseSettings.contentArea")),1),u(t(Pt),{cols:"2"},{default:m(()=>[u(t(K),{span:"12 400:12"},{default:m(()=>[i("div",Ra,[i("span",Ba,p(d.$t("apps.baseSettings.netModeChangeButtonShow")),1),u(t(R),{value:t(n).panelConfig.netModeChangeButtonShow,"onUpdate:value":l[15]||(l[15]=r=>t(n).panelConfig.netModeChangeButtonShow=r)},null,8,["value"])])]),_:1}),u(t(K),{span:"12 400:12"},{default:m(()=>[i("div",Ia,[i("span",Ua,p(d.$t("apps.baseSettings.maxWidth")),1),i("div",Da,[u(t(wt),null,{default:m(()=>[u(t(ae),{value:x.value,"onUpdate:value":l[16]||(l[16]=r=>x.value=r),size:"small",type:"text",maxlength:10,style:{width:"100px"},placeholder:"1200"},null,8,["value"]),u(t(Ue),{value:t(n).panelConfig.maxWidthUnit,"onUpdate:value":l[17]||(l[17]=r=>t(n).panelConfig.maxWidthUnit=r),style:{width:"80px"},options:ce,size:"small"},null,8,["value"])]),_:1})])])]),_:1}),u(t(K),{span:"12 400:12"},{default:m(()=>[i("div",Va,[i("span",Fa,p(d.$t("apps.baseSettings.leftRightMargin")),1),u(t(X),{value:t(n).panelConfig.marginX,"onUpdate:value":l[18]||(l[18]=r=>t(n).panelConfig.marginX=r),class:"max-w-[200px]",step:1,max:100},null,8,["value"])])]),_:1}),u(t(K),{span:"12 400:12"},{default:m(()=>[i("div",Pa,[i("span",Na,p(d.$t("apps.baseSettings.topMargin"))+" (%)",1),u(t(X),{value:t(n).panelConfig.marginTop,"onUpdate:value":l[19]||(l[19]=r=>t(n).panelConfig.marginTop=r),class:"max-w-[200px]",step:1,max:50},null,8,["value"])])]),_:1}),u(t(K),{span:"12 400:6"},{default:m(()=>[i("div",Aa,[i("span",Ea,p(d.$t("apps.baseSettings.bottomMargin"))+" (%)",1),u(t(X),{value:t(n).panelConfig.marginBottom,"onUpdate:value":l[20]||(l[20]=r=>t(n).panelConfig.marginBottom=r),class:"max-w-[200px]",step:1,max:50},null,8,["value"])])]),_:1})]),_:1})]),_:1}),u(t(U),{style:{"border-radius":"10px"},class:"mt-[10px]",size:"small"},{default:m(()=>[i("div",Ha,p(d.$t("apps.baseSettings.customFooter")),1),u(t(ae),{value:t(n).panelConfig.footerHtml,"onUpdate:value":l[21]||(l[21]=r=>t(n).panelConfig.footerHtml=r),type:"textarea",clearable:""},null,8,["value"])]),_:1}),u(t(U),{style:{"border-radius":"10px"},class:"mt-[10px]",size:"small"},{default:m(()=>[u(t(yt),{onPositiveClick:G},{trigger:m(()=>[u(t(Fe),{size:"small",quaternary:"",type:"error"},{default:m(()=>[we(p(d.$t("common.reset")),1)]),_:1})]),default:m(()=>[we(" "+p(d.$t("apps.baseSettings.resetWarnText")),1)]),_:1}),u(t(Fe),{size:"small",quaternary:"",type:"success",class:"ml-[10px]",onClick:W},{default:m(()=>[we(p(d.$t("common.save")),1)]),_:1})]),_:1})]))}});const Ya=Ot(Oa,[["__scopeId","data-v-bcfc4957"]]);export{Ya as default};
