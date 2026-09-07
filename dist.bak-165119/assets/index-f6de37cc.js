import{cV as ht,n as j,m as u,K as C,p as Z,J as Re,v as pt,x as vt,f as Be,q as mt,A as Ne,cW as gt,r as R,ab as bt,z as T,L as xt,w as ge,R as ve,b as wt,D as Me,O as St,g as y,H as yt,T as Ct,ah as ee,e as te,c as ae,bA as kt,bC as _t,bD as oe,b9 as H,ba as F,bj as c,be as m,bi as r,bg as h,bh as t,bJ as M,bk as E,bc as zt,ai as Ie,bf as me,bG as Tt,bH as $t}from"./index-4dc7a2ab.js";import{u as Rt,P as ne,m as Mt,c as It,e as se}from"./index-5c3b0477.js";import{i as I,j as Vt,a as Dt,k as Ut,l as Bt,m as Nt}from"./index-4d0929cf.js";import{N as le,b as Ve}from"./browser-7227be07.js";import{u as Ht,d as be,V as Ft,e as Pt,g as At}from"./index-0c1a3d2f.js";import{_ as Et}from"./_plugin-vue_export-helper-c27b6911.js";function De(n){return window.TouchEvent&&n instanceof window.TouchEvent}function Ue(){const n=new Map,p=s=>k=>{n.set(s,k)};return ht(()=>{n.clear()}),[n,p]}const Ot=j([u("slider",`
 display: block;
 padding: calc((var(--n-handle-size) - var(--n-rail-height)) / 2) 0;
 position: relative;
 z-index: 0;
 width: 100%;
 cursor: pointer;
 user-select: none;
 -webkit-user-select: none;
 `,[C("reverse",[u("slider-handles",[u("slider-handle-wrapper",`
 transform: translate(50%, -50%);
 `)]),u("slider-dots",[u("slider-dot",`
 transform: translateX(50%, -50%);
 `)]),C("vertical",[u("slider-handles",[u("slider-handle-wrapper",`
 transform: translate(-50%, -50%);
 `)]),u("slider-marks",[u("slider-mark",`
 transform: translateY(calc(-50% + var(--n-dot-height) / 2));
 `)]),u("slider-dots",[u("slider-dot",`
 transform: translateX(-50%) translateY(0);
 `)])])]),C("vertical",`
 padding: 0 calc((var(--n-handle-size) - var(--n-rail-height)) / 2);
 width: var(--n-rail-width-vertical);
 height: 100%;
 `,[u("slider-handles",`
 top: calc(var(--n-handle-size) / 2);
 right: 0;
 bottom: calc(var(--n-handle-size) / 2);
 left: 0;
 `,[u("slider-handle-wrapper",`
 top: unset;
 left: 50%;
 transform: translate(-50%, 50%);
 `)]),u("slider-rail",`
 height: 100%;
 `,[Z("fill",`
 top: unset;
 right: 0;
 bottom: unset;
 left: 0;
 `)]),C("with-mark",`
 width: var(--n-rail-width-vertical);
 margin: 0 32px 0 8px;
 `),u("slider-marks",`
 top: calc(var(--n-handle-size) / 2);
 right: unset;
 bottom: calc(var(--n-handle-size) / 2);
 left: 22px;
 font-size: var(--n-mark-font-size);
 `,[u("slider-mark",`
 transform: translateY(50%);
 white-space: nowrap;
 `)]),u("slider-dots",`
 top: calc(var(--n-handle-size) / 2);
 right: unset;
 bottom: calc(var(--n-handle-size) / 2);
 left: 50%;
 `,[u("slider-dot",`
 transform: translateX(-50%) translateY(50%);
 `)])]),C("disabled",`
 cursor: not-allowed;
 opacity: var(--n-opacity-disabled);
 `,[u("slider-handle",`
 cursor: not-allowed;
 `)]),C("with-mark",`
 width: 100%;
 margin: 8px 0 32px 0;
 `),j("&:hover",[u("slider-rail",{backgroundColor:"var(--n-rail-color-hover)"},[Z("fill",{backgroundColor:"var(--n-fill-color-hover)"})]),u("slider-handle",{boxShadow:"var(--n-handle-box-shadow-hover)"})]),C("active",[u("slider-rail",{backgroundColor:"var(--n-rail-color-hover)"},[Z("fill",{backgroundColor:"var(--n-fill-color-hover)"})]),u("slider-handle",{boxShadow:"var(--n-handle-box-shadow-hover)"})]),u("slider-marks",`
 position: absolute;
 top: 18px;
 left: calc(var(--n-handle-size) / 2);
 right: calc(var(--n-handle-size) / 2);
 `,[u("slider-mark",`
 position: absolute;
 transform: translateX(-50%);
 white-space: nowrap;
 `)]),u("slider-rail",`
 width: 100%;
 position: relative;
 height: var(--n-rail-height);
 background-color: var(--n-rail-color);
 transition: background-color .3s var(--n-bezier);
 border-radius: calc(var(--n-rail-height) / 2);
 `,[Z("fill",`
 position: absolute;
 top: 0;
 bottom: 0;
 border-radius: calc(var(--n-rail-height) / 2);
 transition: background-color .3s var(--n-bezier);
 background-color: var(--n-fill-color);
 `)]),u("slider-handles",`
 position: absolute;
 top: 0;
 right: calc(var(--n-handle-size) / 2);
 bottom: 0;
 left: calc(var(--n-handle-size) / 2);
 `,[u("slider-handle-wrapper",`
 outline: none;
 position: absolute;
 top: 50%;
 transform: translate(-50%, -50%);
 cursor: pointer;
 display: flex;
 `,[u("slider-handle",`
 height: var(--n-handle-size);
 width: var(--n-handle-size);
 border-radius: 50%;
 overflow: hidden;
 transition: box-shadow .2s var(--n-bezier), background-color .3s var(--n-bezier);
 background-color: var(--n-handle-color);
 box-shadow: var(--n-handle-box-shadow);
 `,[j("&:hover",`
 box-shadow: var(--n-handle-box-shadow-hover);
 `)]),j("&:focus",[u("slider-handle",`
 box-shadow: var(--n-handle-box-shadow-focus);
 `,[j("&:hover",`
 box-shadow: var(--n-handle-box-shadow-active);
 `)])])])]),u("slider-dots",`
 position: absolute;
 top: 50%;
 left: calc(var(--n-handle-size) / 2);
 right: calc(var(--n-handle-size) / 2);
 `,[C("transition-disabled",[u("slider-dot","transition: none;")]),u("slider-dot",`
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
 `,[C("active","border: var(--n-dot-border-active);")])])]),u("slider-handle-indicator",`
 font-size: var(--n-font-size);
 padding: 6px 10px;
 border-radius: var(--n-indicator-border-radius);
 color: var(--n-indicator-text-color);
 background-color: var(--n-indicator-color);
 box-shadow: var(--n-indicator-box-shadow);
 `,[Re()]),u("slider-handle-indicator",`
 font-size: var(--n-font-size);
 padding: 6px 10px;
 border-radius: var(--n-indicator-border-radius);
 color: var(--n-indicator-text-color);
 background-color: var(--n-indicator-color);
 box-shadow: var(--n-indicator-box-shadow);
 `,[C("top",`
 margin-bottom: 12px;
 `),C("right",`
 margin-left: 12px;
 `),C("bottom",`
 margin-top: 12px;
 `),C("left",`
 margin-right: 12px;
 `),Re()]),pt(u("slider",[u("slider-dot","background-color: var(--n-dot-color-modal);")])),vt(u("slider",[u("slider-dot","background-color: var(--n-dot-color-popover);")]))]),jt=0,Wt=Object.assign(Object.assign({},Ne.props),{to:be.propTo,defaultValue:{type:[Number,Array],default:0},marks:Object,disabled:{type:Boolean,default:void 0},formatTooltip:Function,keyboard:{type:Boolean,default:!0},min:{type:Number,default:0},max:{type:Number,default:100},step:{type:[Number,String],default:1},range:Boolean,value:[Number,Array],placement:String,showTooltip:{type:Boolean,default:void 0},tooltip:{type:Boolean,default:!0},vertical:Boolean,reverse:Boolean,"onUpdate:value":[Function,Array],onUpdateValue:[Function,Array],onDragstart:[Function],onDragend:[Function]}),W=Be({name:"Slider",props:Wt,setup(n){const{mergedClsPrefixRef:p,namespaceRef:s,inlineThemeDisabled:k}=mt(n),g=Ne("Slider","-slider",Ot,gt,n,p),b=R(null),[V,U]=Ue(),[ie,re]=Ue(),O=R(new Set),L=bt(n),{mergedDisabledRef:d}=L,l=T(()=>{const{step:e}=n;if(Number(e)<=0||e==="mark")return 0;const a=e.toString();let o=0;return a.includes(".")&&(o=a.length-a.indexOf(".")-1),o}),i=R(n.defaultValue),He=xt(n,"value"),de=Ht(He,i),_=T(()=>{const{value:e}=de;return(n.range?e:[e]).map(_e)}),xe=T(()=>_.value.length>2),Fe=T(()=>n.placement===void 0?n.vertical?"right":"top":n.placement),we=T(()=>{const{marks:e}=n;return e?Object.keys(e).map(parseFloat):null}),z=R(-1),Se=R(-1),B=R(-1),N=R(!1),X=R(!1),ce=T(()=>{const{vertical:e,reverse:a}=n;return e?a?"top":"bottom":a?"right":"left"}),Pe=T(()=>{if(xe.value)return;const e=_.value,a=K(n.range?Math.min(...e):n.min),o=K(n.range?Math.max(...e):e[0]),{value:f}=ce;return n.vertical?{[f]:`${a}%`,height:`${o-a}%`}:{[f]:`${a}%`,width:`${o-a}%`}}),Ae=T(()=>{const e=[],{marks:a}=n;if(a){const o=_.value.slice();o.sort((w,S)=>w-S);const{value:f}=ce,{value:v}=xe,{range:x}=n,$=v?()=>!1:w=>x?w>=o[0]&&w<=o[o.length-1]:w<=o[0];for(const w of Object.keys(a)){const S=Number(w);e.push({active:$(S),label:a[w],style:{[f]:`${K(S)}%`}})}}return e});function Ee(e,a){const o=K(e),{value:f}=ce;return{[f]:`${o}%`,zIndex:a===z.value?1:0}}function ye(e){return n.showTooltip||B.value===e||z.value===e&&N.value}function Oe(e){return N.value?!(z.value===e&&Se.value===e):!0}function je(e){var a;~e&&(z.value=e,(a=V.get(e))===null||a===void 0||a.focus())}function We(){ie.forEach((e,a)=>{ye(a)&&e.syncPosition()})}function Ce(e){const{"onUpdate:value":a,onUpdateValue:o}=n,{nTriggerFormInput:f,nTriggerFormChange:v}=L;o&&ee(o,e),a&&ee(a,e),i.value=e,f(),v()}function ke(e){const{range:a}=n;if(a){if(Array.isArray(e)){const{value:o}=_;e.join()!==o.join()&&Ce(e)}}else Array.isArray(e)||_.value[0]!==e&&Ce(e)}function ue(e,a){if(n.range){const o=_.value.slice();o.splice(a,1,e),ke(o)}else ke(e)}function fe(e,a,o){const f=o!==void 0;o||(o=e-a>0?1:-1);const v=we.value||[],{step:x}=n;if(x==="mark"){const S=G(e,v.concat(a),f?o:void 0);return S?S.value:a}if(x<=0)return a;const{value:$}=l;let w;if(f){const S=Number((a/x).toFixed($)),D=Math.floor(S),he=S>D?D:D-1,pe=S<D?D:D+1;w=G(a,[Number((he*x).toFixed($)),Number((pe*x).toFixed($)),...v],o)}else{const S=Xe(e);w=G(e,[...v,S])}return w?_e(w.value):a}function _e(e){return Math.min(n.max,Math.max(n.min,e))}function K(e){const{max:a,min:o}=n;return(e-o)/(a-o)*100}function Le(e){const{max:a,min:o}=n;return o+(a-o)*e}function Xe(e){const{step:a,min:o}=n;if(Number(a)<=0||a==="mark")return e;const f=Math.round((e-o)/a)*a+o;return Number(f.toFixed(l.value))}function G(e,a=we.value,o){if(!(a!=null&&a.length))return null;let f=null,v=-1;for(;++v<a.length;){const x=a[v]-e,$=Math.abs(x);(o===void 0||x*o>0)&&(f===null||$<f.distance)&&(f={index:v,distance:$,value:a[v]})}return f}function ze(e){const a=b.value;if(!a)return;const o=De(e)?e.touches[0]:e,f=a.getBoundingClientRect();let v;return n.vertical?v=(f.bottom-o.clientY)/f.height:v=(o.clientX-f.left)/f.width,n.reverse&&(v=1-v),Le(v)}function Ke(e){if(d.value||!n.keyboard)return;const{vertical:a,reverse:o}=n;switch(e.key){case"ArrowUp":e.preventDefault(),Y(a&&o?-1:1);break;case"ArrowRight":e.preventDefault(),Y(!a&&o?-1:1);break;case"ArrowDown":e.preventDefault(),Y(a&&o?1:-1);break;case"ArrowLeft":e.preventDefault(),Y(!a&&o?1:-1);break}}function Y(e){const a=z.value;if(a===-1)return;const{step:o}=n,f=_.value[a],v=Number(o)<=0||o==="mark"?f:f+o*e;ue(fe(v,f,e>0?1:-1),a)}function Ge(e){var a,o;if(d.value||!De(e)&&e.button!==jt)return;const f=ze(e);if(f===void 0)return;const v=_.value.slice(),x=n.range?(o=(a=G(f,v))===null||a===void 0?void 0:a.index)!==null&&o!==void 0?o:-1:0;x!==-1&&(e.preventDefault(),je(x),Ye(),ue(fe(f,_.value[x]),x))}function Ye(){N.value||(N.value=!0,n.onDragstart&&ee(n.onDragstart),te("touchend",document,Q),te("mouseup",document,Q),te("touchmove",document,J),te("mousemove",document,J))}function q(){N.value&&(N.value=!1,n.onDragend&&ee(n.onDragend),ae("touchend",document,Q),ae("mouseup",document,Q),ae("touchmove",document,J),ae("mousemove",document,J))}function J(e){const{value:a}=z;if(!N.value||a===-1){q();return}const o=ze(e);o!==void 0&&ue(fe(o,_.value[a]),a)}function Q(){q()}function qe(e){z.value=e,d.value||(B.value=e)}function Je(e){z.value===e&&(z.value=-1,q()),B.value===e&&(B.value=-1)}function Qe(e){B.value=e}function Ze(e){B.value===e&&(B.value=-1)}ge(z,(e,a)=>void ve(()=>Se.value=a)),ge(de,()=>{if(n.marks){if(X.value)return;X.value=!0,ve(()=>{X.value=!1})}ve(We)}),wt(()=>{q()});const Te=T(()=>{const{self:{markFontSize:e,railColor:a,railColorHover:o,fillColor:f,fillColorHover:v,handleColor:x,opacityDisabled:$,dotColor:w,dotColorModal:S,handleBoxShadow:D,handleBoxShadowHover:he,handleBoxShadowActive:pe,handleBoxShadowFocus:et,dotBorder:tt,dotBoxShadow:at,railHeight:ot,railWidthVertical:nt,handleSize:st,dotHeight:lt,dotWidth:it,dotBorderRadius:rt,fontSize:dt,dotBorderActive:ct,dotColorPopover:ut},common:{cubicBezierEaseInOut:ft}}=g.value;return{"--n-bezier":ft,"--n-dot-border":tt,"--n-dot-border-active":ct,"--n-dot-border-radius":rt,"--n-dot-box-shadow":at,"--n-dot-color":w,"--n-dot-color-modal":S,"--n-dot-color-popover":ut,"--n-dot-height":lt,"--n-dot-width":it,"--n-fill-color":f,"--n-fill-color-hover":v,"--n-font-size":dt,"--n-handle-box-shadow":D,"--n-handle-box-shadow-active":pe,"--n-handle-box-shadow-focus":et,"--n-handle-box-shadow-hover":he,"--n-handle-color":x,"--n-handle-size":st,"--n-opacity-disabled":$,"--n-rail-color":a,"--n-rail-color-hover":o,"--n-rail-height":ot,"--n-rail-width-vertical":nt,"--n-mark-font-size":e}}),P=k?Me("slider",void 0,Te,n):void 0,$e=T(()=>{const{self:{fontSize:e,indicatorColor:a,indicatorBoxShadow:o,indicatorTextColor:f,indicatorBorderRadius:v}}=g.value;return{"--n-font-size":e,"--n-indicator-border-radius":v,"--n-indicator-box-shadow":o,"--n-indicator-color":a,"--n-indicator-text-color":f}}),A=k?Me("slider-indicator",void 0,$e,n):void 0;return{mergedClsPrefix:p,namespace:s,uncontrolledValue:i,mergedValue:de,mergedDisabled:d,mergedPlacement:Fe,isMounted:St(),adjustedTo:be(n),dotTransitionDisabled:X,markInfos:Ae,isShowTooltip:ye,shouldKeepTooltipTransition:Oe,handleRailRef:b,setHandleRefs:U,setFollowerRefs:re,fillStyle:Pe,getHandleStyle:Ee,activeIndex:z,arrifiedValues:_,followerEnabledIndexSet:O,handleRailMouseDown:Ge,handleHandleFocus:qe,handleHandleBlur:Je,handleHandleMouseEnter:Qe,handleHandleMouseLeave:Ze,handleRailKeyDown:Ke,indicatorCssVars:k?void 0:$e,indicatorThemeClass:A==null?void 0:A.themeClass,indicatorOnRender:A==null?void 0:A.onRender,cssVars:k?void 0:Te,themeClass:P==null?void 0:P.themeClass,onRender:P==null?void 0:P.onRender}},render(){var n;const{mergedClsPrefix:p,themeClass:s,formatTooltip:k}=this;return(n=this.onRender)===null||n===void 0||n.call(this),y("div",{class:[`${p}-slider`,s,{[`${p}-slider--disabled`]:this.mergedDisabled,[`${p}-slider--active`]:this.activeIndex!==-1,[`${p}-slider--with-mark`]:this.marks,[`${p}-slider--vertical`]:this.vertical,[`${p}-slider--reverse`]:this.reverse}],style:this.cssVars,onKeydown:this.handleRailKeyDown,onMousedown:this.handleRailMouseDown,onTouchstart:this.handleRailMouseDown},y("div",{class:`${p}-slider-rail`},y("div",{class:`${p}-slider-rail__fill`,style:this.fillStyle}),this.marks?y("div",{class:[`${p}-slider-dots`,this.dotTransitionDisabled&&`${p}-slider-dots--transition-disabled`]},this.markInfos.map(g=>y("div",{key:g.label,class:[`${p}-slider-dot`,{[`${p}-slider-dot--active`]:g.active}],style:g.style}))):null,y("div",{ref:"handleRailRef",class:`${p}-slider-handles`},this.arrifiedValues.map((g,b)=>{const V=this.isShowTooltip(b);return y(Ft,null,{default:()=>[y(Pt,null,{default:()=>y("div",{ref:this.setHandleRefs(b),class:`${p}-slider-handle-wrapper`,tabindex:this.mergedDisabled?-1:0,role:"slider","aria-valuenow":g,"aria-valuemin":this.min,"aria-valuemax":this.max,"aria-orientation":this.vertical?"vertical":"horizontal","aria-disabled":this.disabled,style:this.getHandleStyle(g,b),onFocus:()=>{this.handleHandleFocus(b)},onBlur:()=>{this.handleHandleBlur(b)},onMouseenter:()=>{this.handleHandleMouseEnter(b)},onMouseleave:()=>{this.handleHandleMouseLeave(b)}},yt(this.$slots.thumb,()=>[y("div",{class:`${p}-slider-handle`})]))}),this.tooltip&&y(At,{ref:this.setFollowerRefs(b),show:V,to:this.adjustedTo,enabled:this.showTooltip&&!this.range||this.followerEnabledIndexSet.has(b),teleportDisabled:this.adjustedTo===be.tdkey,placement:this.mergedPlacement,containerClass:this.namespace},{default:()=>y(Ct,{name:"fade-in-scale-up-transition",appear:this.isMounted,css:this.shouldKeepTooltipTransition(b),onEnter:()=>{this.followerEnabledIndexSet.add(b)},onAfterLeave:()=>{this.followerEnabledIndexSet.delete(b)}},{default:()=>{var U;return V?((U=this.indicatorOnRender)===null||U===void 0||U.call(this),y("div",{class:[`${p}-slider-handle-indicator`,this.indicatorThemeClass,`${p}-slider-handle-indicator--${this.mergedPlacement}`],style:this.indicatorCssVars},typeof k=="function"?k(g):g)):null}})})]})})),this.marks?y("div",{class:`${p}-slider-marks`},this.markInfos.map(g=>y("div",{key:g.label,class:`${p}-slider-mark`,style:g.style},g.label))):null))}}),Lt=n=>(Tt("data-v-5b14cd47"),n=n(),$t(),n),Xt={class:"bg-slate-200 dark:bg-zinc-900 rounded-[10px] p-[8px] overflow-auto"},Kt=Lt(()=>r("div",{class:"text-slate-500 mb-[5px] font-bold"}," LOGO ",-1)),Gt={class:"flex items-center mt-[5px]"},Yt={class:"text-slate-500 mb-[5px] font-bold"},qt={class:"flex items-center mt-[5px]"},Jt={class:"mr-[10px]"},Qt={class:"text-slate-500 mb-[5px] font-bold"},Zt={class:"flex items-center mt-[5px]"},ea={class:"mr-[10px]"},ta={key:0,class:"flex items-center mt-[5px]"},aa={class:"mr-[10px]"},oa={class:"text-slate-500 mb-[5px] font-bold"},na={class:"flex items-center mt-[5px]"},sa={class:"mr-[10px]"},la={key:0,class:"flex items-center mt-[5px]"},ia={class:"mr-[10px]"},ra={key:1,class:"flex items-center mt-[5px]"},da={class:"mr-[10px]"},ca={class:"text-slate-500 mb-[5px] font-bold"},ua={class:"mt-[5px]"},fa={class:"flex items-center mt-[5px]"},ha={key:0,class:"mt-[5px]"},pa={class:"flex items-center mt-[5px]"},va={key:1,class:"mt-[5px]"},ma={class:"flex items-center mt-[5px]"},ga={class:"mt-[5px]"},ba={class:"flex items-center mt-[5px]"},xa={class:"text-slate-500 mb-[5px] font-bold"},wa={class:"text-shadow text-white"},Sa={class:"flex items-center mt-[5px]"},ya={class:"mr-[10px]"},Ca={key:0,class:"mt-1"},ka={class:"flex items-center mt-[10px]"},_a={class:"mr-[10px]"},za={class:"flex items-center mt-[10px]"},Ta={class:"mr-[10px]"},$a={class:"text-slate-500 mb-[5px] font-bold"},Ra={class:"flex items-center mt-[10px]"},Ma={class:"mr-[10px]"},Ia={class:"flex"},Va={class:"flex items-center mt-[10px]"},Da={class:"mr-[10px]"},Ua={class:"flex items-center mt-[10px]"},Ba={class:"mr-[10px]"},Na={class:"flex items-center mt-[10px]"},Ha={class:"mr-[10px]"},Fa={class:"text-slate-500 mb-[5px] font-bold"},Pa=Be({__name:"index",setup(n){const p=kt(),s=Rt(),k=_t(),g=R(!1),b=T({get:()=>String(s.panelConfig.maxWidth??""),set:d=>{const l=Number(d);s.panelConfig.maxWidth=d.trim()===""||Number.isNaN(l)?void 0:l}}),V=R(!1),U=[{label:oe("apps.baseSettings.detailIcon"),value:ne.info},{label:oe("apps.baseSettings.smallIcon"),value:ne.icon}],ie=[{label:"px",value:"px"},{label:"%",value:"%"}];ge(s.panelConfig,()=>{V.value||(V.value=!0,setTimeout(()=>{s.recordState(),V.value=!1,O()},1e3))});function re({file:d,event:l}){const i=JSON.parse((l==null?void 0:l.target).response);return s.panelConfig.backgroundImageSrc=i.data.imageUrl,d}function O(){Mt({panel:s.panelConfig}).then(d=>{d.code===0?k.success(oe("apps.baseSettings.configSaved")):k.error(oe("apps.baseSettings.configFailed",{message:d.msg}))})}function L(){s.resetPanelConfig(),O()}return(d,l)=>(H(),F("div",Xt,[c(t(M),{style:{"border-radius":"10px"},size:"small"},{default:m(()=>[Kt,r("div",null,[r("div",null,h(d.$t("apps.baseSettings.textContent")),1),r("div",Gt,[c(t(le),{value:t(s).panelConfig.logoText,"onUpdate:value":l[0]||(l[0]=i=>t(s).panelConfig.logoText=i),type:"text","show-count":"",maxlength:20,placeholder:"请输入文字"},null,8,["value"])])])]),_:1}),c(t(M),{style:{"border-radius":"10px"},class:"mt-[10px]",size:"small"},{default:m(()=>[r("div",Yt,h(d.$t("apps.baseSettings.clock")),1),r("div",qt,[r("span",Jt,h(d.$t("apps.baseSettings.clockSecondShow")),1),c(t(I),{value:t(s).panelConfig.clockShowSecond,"onUpdate:value":l[1]||(l[1]=i=>t(s).panelConfig.clockShowSecond=i)},null,8,["value"])])]),_:1}),c(t(M),{style:{"border-radius":"10px"},class:"mt-[10px]",size:"small"},{default:m(()=>[r("div",Qt,h(d.$t("apps.baseSettings.searchBar")),1),r("div",Zt,[r("span",ea,h(d.$t("common.show")),1),c(t(I),{value:t(s).panelConfig.searchBoxShow,"onUpdate:value":l[2]||(l[2]=i=>t(s).panelConfig.searchBoxShow=i)},null,8,["value"])]),t(s).panelConfig.searchBoxShow?(H(),F("div",ta,[r("span",aa,h(d.$t("apps.baseSettings.searchBarSearchItem")),1),c(t(I),{value:t(s).panelConfig.searchBoxSearchIcon,"onUpdate:value":l[3]||(l[3]=i=>t(s).panelConfig.searchBoxSearchIcon=i)},null,8,["value"])])):E("",!0)]),_:1}),c(t(M),{style:{"border-radius":"10px"},class:"mt-[10px]",size:"small"},{default:m(()=>[r("div",oa,h(d.$t("apps.baseSettings.systemMonitorStatus")),1),r("div",na,[r("span",sa,h(d.$t("common.show")),1),c(t(I),{value:t(s).panelConfig.systemMonitorShow,"onUpdate:value":l[4]||(l[4]=i=>t(s).panelConfig.systemMonitorShow=i)},null,8,["value"])]),t(s).panelConfig.systemMonitorShow?(H(),F("div",la,[r("span",ia,h(d.$t("apps.baseSettings.showTitle")),1),c(t(I),{value:t(s).panelConfig.systemMonitorShowTitle,"onUpdate:value":l[5]||(l[5]=i=>t(s).panelConfig.systemMonitorShowTitle=i)},null,8,["value"])])):E("",!0),t(s).panelConfig.systemMonitorShow?(H(),F("div",ra,[r("span",da,h(d.$t("apps.baseSettings.publicVisitModeShow")),1),c(t(I),{value:t(s).panelConfig.systemMonitorPublicVisitModeShow,"onUpdate:value":l[6]||(l[6]=i=>t(s).panelConfig.systemMonitorPublicVisitModeShow=i)},null,8,["value"])])):E("",!0)]),_:1}),c(t(M),{style:{"border-radius":"10px"},class:"mt-[10px]",size:"small"},{default:m(()=>[r("div",ca,h(d.$t("common.icon")),1),r("div",ua,[r("div",null,h(d.$t("common.style")),1),r("div",fa,[c(t(Ve),{value:t(s).panelConfig.iconStyle,"onUpdate:value":l[7]||(l[7]=i=>t(s).panelConfig.iconStyle=i),options:U},null,8,["value"])])]),t(s).panelConfig.iconStyle===t(ne).info?(H(),F("div",ha,[r("div",null,h(d.$t("apps.baseSettings.hideDescription")),1),r("div",pa,[c(t(I),{value:t(s).panelConfig.iconTextInfoHideDescription,"onUpdate:value":l[8]||(l[8]=i=>t(s).panelConfig.iconTextInfoHideDescription=i)},null,8,["value"])])])):E("",!0),t(s).panelConfig.iconStyle===t(ne).icon?(H(),F("div",va,[r("div",null,h(d.$t("apps.baseSettings.hideTitle")),1),r("div",ma,[c(t(I),{value:t(s).panelConfig.iconTextIconHideTitle,"onUpdate:value":l[9]||(l[9]=i=>t(s).panelConfig.iconTextIconHideTitle=i)},null,8,["value"])])])):E("",!0),r("div",ga,[r("div",null,h(d.$t("common.textColor")),1),r("div",ba,[c(t(Vt),{value:t(s).panelConfig.iconTextColor,"onUpdate:value":l[10]||(l[10]=i=>t(s).panelConfig.iconTextColor=i),"show-alpha":!1,size:"small",modes:["hex"],swatches:["#000000","#ffffff","#18A058","#2080F0","#F0A020"]},null,8,["value"])])])]),_:1}),c(t(M),{style:{"border-radius":"10px"},class:"mt-[10px]",size:"small"},{default:m(()=>[r("div",xa,h(d.$t("apps.baseSettings.wallpaper")),1),c(t(Dt),{action:"/api/file/uploadImg","show-file-list":!1,name:"imgfile",headers:{token:t(p).token},"directory-dnd":!0,onFinish:re},{default:m(()=>[c(t(Ut),{style:{width:"100%"}},{default:m(()=>[r("div",{class:"h-[200px] w-full border bg-slate-100 flex justify-center items-center cursor-pointer rounded-[10px]",style:zt({background:`url(${t(s).panelConfig.backgroundImageSrc}) no-repeat`,backgroundSize:"cover"})},[r("div",wa,h(d.$t("apps.baseSettings.uploadOrDragText")),1)],4)]),_:1})]),_:1},8,["headers"]),r("div",Sa,[r("span",ya,h(d.$t("apps.baseSettings.customImageAddress")),1),c(t(I),{value:g.value,"onUpdate:value":l[11]||(l[11]=i=>g.value=i)},null,8,["value"])]),g.value?(H(),F("div",Ca,[c(t(le),{value:t(s).panelConfig.backgroundImageSrc,"onUpdate:value":l[12]||(l[12]=i=>t(s).panelConfig.backgroundImageSrc=i),type:"text",size:"small",clearable:""},null,8,["value"])])):E("",!0),r("div",ka,[r("span",_a,h(d.$t("apps.baseSettings.vague")),1),c(t(W),{value:t(s).panelConfig.backgroundBlur,"onUpdate:value":l[13]||(l[13]=i=>t(s).panelConfig.backgroundBlur=i),class:"max-w-[200px]",step:2,max:20},null,8,["value"])]),r("div",za,[r("span",Ta,h(d.$t("apps.baseSettings.mask")),1),c(t(W),{value:t(s).panelConfig.backgroundMaskNumber,"onUpdate:value":l[14]||(l[14]=i=>t(s).panelConfig.backgroundMaskNumber=i),class:"max-w-[200px]",step:.1,max:1},null,8,["value"])])]),_:1}),c(t(M),{style:{"border-radius":"10px"},class:"mt-[10px]",size:"small"},{default:m(()=>[r("div",$a,h(d.$t("apps.baseSettings.contentArea")),1),c(t(It),{cols:"2"},{default:m(()=>[c(t(se),{span:"12 400:12"},{default:m(()=>[r("div",Ra,[r("span",Ma,h(d.$t("apps.baseSettings.maxWidth")),1),r("div",Ia,[c(t(Bt),null,{default:m(()=>[c(t(le),{value:b.value,"onUpdate:value":l[15]||(l[15]=i=>b.value=i),size:"small",type:"text",maxlength:10,style:{width:"100px"},placeholder:"1200"},null,8,["value"]),c(t(Ve),{value:t(s).panelConfig.maxWidthUnit,"onUpdate:value":l[16]||(l[16]=i=>t(s).panelConfig.maxWidthUnit=i),style:{width:"80px"},options:ie,size:"small"},null,8,["value"])]),_:1})])])]),_:1}),c(t(se),{span:"12 400:12"},{default:m(()=>[r("div",Va,[r("span",Da,h(d.$t("apps.baseSettings.leftRightMargin")),1),c(t(W),{value:t(s).panelConfig.marginX,"onUpdate:value":l[17]||(l[17]=i=>t(s).panelConfig.marginX=i),class:"max-w-[200px]",step:1,max:100},null,8,["value"])])]),_:1}),c(t(se),{span:"12 400:12"},{default:m(()=>[r("div",Ua,[r("span",Ba,h(d.$t("apps.baseSettings.topMargin"))+" (%)",1),c(t(W),{value:t(s).panelConfig.marginTop,"onUpdate:value":l[18]||(l[18]=i=>t(s).panelConfig.marginTop=i),class:"max-w-[200px]",step:1,max:50},null,8,["value"])])]),_:1}),c(t(se),{span:"12 400:6"},{default:m(()=>[r("div",Na,[r("span",Ha,h(d.$t("apps.baseSettings.bottomMargin"))+" (%)",1),c(t(W),{value:t(s).panelConfig.marginBottom,"onUpdate:value":l[19]||(l[19]=i=>t(s).panelConfig.marginBottom=i),class:"max-w-[200px]",step:1,max:50},null,8,["value"])])]),_:1})]),_:1})]),_:1}),c(t(M),{style:{"border-radius":"10px"},class:"mt-[10px]",size:"small"},{default:m(()=>[r("div",Fa,h(d.$t("apps.baseSettings.customFooter")),1),c(t(le),{value:t(s).panelConfig.footerHtml,"onUpdate:value":l[20]||(l[20]=i=>t(s).panelConfig.footerHtml=i),type:"textarea",clearable:""},null,8,["value"])]),_:1}),c(t(M),{style:{"border-radius":"10px"},class:"mt-[10px]",size:"small"},{default:m(()=>[c(t(Nt),{onPositiveClick:L},{trigger:m(()=>[c(t(Ie),{size:"small",quaternary:"",type:"error"},{default:m(()=>[me(h(d.$t("common.reset")),1)]),_:1})]),default:m(()=>[me(" "+h(d.$t("apps.baseSettings.resetWarnText")),1)]),_:1}),c(t(Ie),{size:"small",quaternary:"",type:"success",class:"ml-[10px]",onClick:O},{default:m(()=>[me(h(d.$t("common.save")),1)]),_:1})]),_:1})]))}});const Xa=Et(Pa,[["__scopeId","data-v-5b14cd47"]]);export{Xa as default};
