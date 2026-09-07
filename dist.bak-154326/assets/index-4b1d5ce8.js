import{cV as ht,n as j,m as u,K as C,p as ee,J as Re,v as pt,x as vt,f as Ue,q as mt,A as Ne,cW as gt,r as M,ab as bt,z as T,L as xt,w as ge,R as ve,b as wt,D as Me,O as St,g as y,H as yt,T as Ct,ah as te,e as ae,c as oe,bA as kt,bC as _t,bD as ne,b9 as H,ba as F,bj as c,be as m,bi as r,bg as h,bh as t,bJ as I,bk as E,bc as zt,ai as Ie,bf as me,bG as Tt,bH as $t}from"./index-15bd2994.js";import{u as Rt,P as se,n as Mt,c as It,e as W}from"./index-17087119.js";import{i as R,j as Vt,a as Bt,k as Dt,l as Ut,m as Nt}from"./index-df1b92da.js";import{N as le,b as Ve}from"./browser-6f308d8d.js";import{u as Ht,d as be,V as Ft,e as Pt,g as At}from"./index-759cca8d.js";import{_ as Et}from"./_plugin-vue_export-helper-c27b6911.js";function Be(s){return window.TouchEvent&&s instanceof window.TouchEvent}function De(){const s=new Map,p=n=>k=>{s.set(n,k)};return ht(()=>{s.clear()}),[s,p]}const Ot=j([u("slider",`
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
 `,[ee("fill",`
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
 `),j("&:hover",[u("slider-rail",{backgroundColor:"var(--n-rail-color-hover)"},[ee("fill",{backgroundColor:"var(--n-fill-color-hover)"})]),u("slider-handle",{boxShadow:"var(--n-handle-box-shadow-hover)"})]),C("active",[u("slider-rail",{backgroundColor:"var(--n-rail-color-hover)"},[ee("fill",{backgroundColor:"var(--n-fill-color-hover)"})]),u("slider-handle",{boxShadow:"var(--n-handle-box-shadow-hover)"})]),u("slider-marks",`
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
 `,[ee("fill",`
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
 `),Re()]),pt(u("slider",[u("slider-dot","background-color: var(--n-dot-color-modal);")])),vt(u("slider",[u("slider-dot","background-color: var(--n-dot-color-popover);")]))]),jt=0,Wt=Object.assign(Object.assign({},Ne.props),{to:be.propTo,defaultValue:{type:[Number,Array],default:0},marks:Object,disabled:{type:Boolean,default:void 0},formatTooltip:Function,keyboard:{type:Boolean,default:!0},min:{type:Number,default:0},max:{type:Number,default:100},step:{type:[Number,String],default:1},range:Boolean,value:[Number,Array],placement:String,showTooltip:{type:Boolean,default:void 0},tooltip:{type:Boolean,default:!0},vertical:Boolean,reverse:Boolean,"onUpdate:value":[Function,Array],onUpdateValue:[Function,Array],onDragstart:[Function],onDragend:[Function]}),L=Ue({name:"Slider",props:Wt,setup(s){const{mergedClsPrefixRef:p,namespaceRef:n,inlineThemeDisabled:k}=mt(s),g=Ne("Slider","-slider",Ot,gt,s,p),b=M(null),[V,D]=De(),[ie,re]=De(),O=M(new Set),X=bt(s),{mergedDisabledRef:d}=X,l=T(()=>{const{step:e}=s;if(Number(e)<=0||e==="mark")return 0;const a=e.toString();let o=0;return a.includes(".")&&(o=a.length-a.indexOf(".")-1),o}),i=M(s.defaultValue),He=xt(s,"value"),de=Ht(He,i),_=T(()=>{const{value:e}=de;return(s.range?e:[e]).map(_e)}),xe=T(()=>_.value.length>2),Fe=T(()=>s.placement===void 0?s.vertical?"right":"top":s.placement),we=T(()=>{const{marks:e}=s;return e?Object.keys(e).map(parseFloat):null}),z=M(-1),Se=M(-1),U=M(-1),N=M(!1),K=M(!1),ce=T(()=>{const{vertical:e,reverse:a}=s;return e?a?"top":"bottom":a?"right":"left"}),Pe=T(()=>{if(xe.value)return;const e=_.value,a=G(s.range?Math.min(...e):s.min),o=G(s.range?Math.max(...e):e[0]),{value:f}=ce;return s.vertical?{[f]:`${a}%`,height:`${o-a}%`}:{[f]:`${a}%`,width:`${o-a}%`}}),Ae=T(()=>{const e=[],{marks:a}=s;if(a){const o=_.value.slice();o.sort((w,S)=>w-S);const{value:f}=ce,{value:v}=xe,{range:x}=s,$=v?()=>!1:w=>x?w>=o[0]&&w<=o[o.length-1]:w<=o[0];for(const w of Object.keys(a)){const S=Number(w);e.push({active:$(S),label:a[w],style:{[f]:`${G(S)}%`}})}}return e});function Ee(e,a){const o=G(e),{value:f}=ce;return{[f]:`${o}%`,zIndex:a===z.value?1:0}}function ye(e){return s.showTooltip||U.value===e||z.value===e&&N.value}function Oe(e){return N.value?!(z.value===e&&Se.value===e):!0}function je(e){var a;~e&&(z.value=e,(a=V.get(e))===null||a===void 0||a.focus())}function We(){ie.forEach((e,a)=>{ye(a)&&e.syncPosition()})}function Ce(e){const{"onUpdate:value":a,onUpdateValue:o}=s,{nTriggerFormInput:f,nTriggerFormChange:v}=X;o&&te(o,e),a&&te(a,e),i.value=e,f(),v()}function ke(e){const{range:a}=s;if(a){if(Array.isArray(e)){const{value:o}=_;e.join()!==o.join()&&Ce(e)}}else Array.isArray(e)||_.value[0]!==e&&Ce(e)}function ue(e,a){if(s.range){const o=_.value.slice();o.splice(a,1,e),ke(o)}else ke(e)}function fe(e,a,o){const f=o!==void 0;o||(o=e-a>0?1:-1);const v=we.value||[],{step:x}=s;if(x==="mark"){const S=Y(e,v.concat(a),f?o:void 0);return S?S.value:a}if(x<=0)return a;const{value:$}=l;let w;if(f){const S=Number((a/x).toFixed($)),B=Math.floor(S),he=S>B?B:B-1,pe=S<B?B:B+1;w=Y(a,[Number((he*x).toFixed($)),Number((pe*x).toFixed($)),...v],o)}else{const S=Xe(e);w=Y(e,[...v,S])}return w?_e(w.value):a}function _e(e){return Math.min(s.max,Math.max(s.min,e))}function G(e){const{max:a,min:o}=s;return(e-o)/(a-o)*100}function Le(e){const{max:a,min:o}=s;return o+(a-o)*e}function Xe(e){const{step:a,min:o}=s;if(Number(a)<=0||a==="mark")return e;const f=Math.round((e-o)/a)*a+o;return Number(f.toFixed(l.value))}function Y(e,a=we.value,o){if(!(a!=null&&a.length))return null;let f=null,v=-1;for(;++v<a.length;){const x=a[v]-e,$=Math.abs(x);(o===void 0||x*o>0)&&(f===null||$<f.distance)&&(f={index:v,distance:$,value:a[v]})}return f}function ze(e){const a=b.value;if(!a)return;const o=Be(e)?e.touches[0]:e,f=a.getBoundingClientRect();let v;return s.vertical?v=(f.bottom-o.clientY)/f.height:v=(o.clientX-f.left)/f.width,s.reverse&&(v=1-v),Le(v)}function Ke(e){if(d.value||!s.keyboard)return;const{vertical:a,reverse:o}=s;switch(e.key){case"ArrowUp":e.preventDefault(),q(a&&o?-1:1);break;case"ArrowRight":e.preventDefault(),q(!a&&o?-1:1);break;case"ArrowDown":e.preventDefault(),q(a&&o?1:-1);break;case"ArrowLeft":e.preventDefault(),q(!a&&o?1:-1);break}}function q(e){const a=z.value;if(a===-1)return;const{step:o}=s,f=_.value[a],v=Number(o)<=0||o==="mark"?f:f+o*e;ue(fe(v,f,e>0?1:-1),a)}function Ge(e){var a,o;if(d.value||!Be(e)&&e.button!==jt)return;const f=ze(e);if(f===void 0)return;const v=_.value.slice(),x=s.range?(o=(a=Y(f,v))===null||a===void 0?void 0:a.index)!==null&&o!==void 0?o:-1:0;x!==-1&&(e.preventDefault(),je(x),Ye(),ue(fe(f,_.value[x]),x))}function Ye(){N.value||(N.value=!0,s.onDragstart&&te(s.onDragstart),ae("touchend",document,Z),ae("mouseup",document,Z),ae("touchmove",document,Q),ae("mousemove",document,Q))}function J(){N.value&&(N.value=!1,s.onDragend&&te(s.onDragend),oe("touchend",document,Z),oe("mouseup",document,Z),oe("touchmove",document,Q),oe("mousemove",document,Q))}function Q(e){const{value:a}=z;if(!N.value||a===-1){J();return}const o=ze(e);o!==void 0&&ue(fe(o,_.value[a]),a)}function Z(){J()}function qe(e){z.value=e,d.value||(U.value=e)}function Je(e){z.value===e&&(z.value=-1,J()),U.value===e&&(U.value=-1)}function Qe(e){U.value=e}function Ze(e){U.value===e&&(U.value=-1)}ge(z,(e,a)=>void ve(()=>Se.value=a)),ge(de,()=>{if(s.marks){if(K.value)return;K.value=!0,ve(()=>{K.value=!1})}ve(We)}),wt(()=>{J()});const Te=T(()=>{const{self:{markFontSize:e,railColor:a,railColorHover:o,fillColor:f,fillColorHover:v,handleColor:x,opacityDisabled:$,dotColor:w,dotColorModal:S,handleBoxShadow:B,handleBoxShadowHover:he,handleBoxShadowActive:pe,handleBoxShadowFocus:et,dotBorder:tt,dotBoxShadow:at,railHeight:ot,railWidthVertical:nt,handleSize:st,dotHeight:lt,dotWidth:it,dotBorderRadius:rt,fontSize:dt,dotBorderActive:ct,dotColorPopover:ut},common:{cubicBezierEaseInOut:ft}}=g.value;return{"--n-bezier":ft,"--n-dot-border":tt,"--n-dot-border-active":ct,"--n-dot-border-radius":rt,"--n-dot-box-shadow":at,"--n-dot-color":w,"--n-dot-color-modal":S,"--n-dot-color-popover":ut,"--n-dot-height":lt,"--n-dot-width":it,"--n-fill-color":f,"--n-fill-color-hover":v,"--n-font-size":dt,"--n-handle-box-shadow":B,"--n-handle-box-shadow-active":pe,"--n-handle-box-shadow-focus":et,"--n-handle-box-shadow-hover":he,"--n-handle-color":x,"--n-handle-size":st,"--n-opacity-disabled":$,"--n-rail-color":a,"--n-rail-color-hover":o,"--n-rail-height":ot,"--n-rail-width-vertical":nt,"--n-mark-font-size":e}}),P=k?Me("slider",void 0,Te,s):void 0,$e=T(()=>{const{self:{fontSize:e,indicatorColor:a,indicatorBoxShadow:o,indicatorTextColor:f,indicatorBorderRadius:v}}=g.value;return{"--n-font-size":e,"--n-indicator-border-radius":v,"--n-indicator-box-shadow":o,"--n-indicator-color":a,"--n-indicator-text-color":f}}),A=k?Me("slider-indicator",void 0,$e,s):void 0;return{mergedClsPrefix:p,namespace:n,uncontrolledValue:i,mergedValue:de,mergedDisabled:d,mergedPlacement:Fe,isMounted:St(),adjustedTo:be(s),dotTransitionDisabled:K,markInfos:Ae,isShowTooltip:ye,shouldKeepTooltipTransition:Oe,handleRailRef:b,setHandleRefs:D,setFollowerRefs:re,fillStyle:Pe,getHandleStyle:Ee,activeIndex:z,arrifiedValues:_,followerEnabledIndexSet:O,handleRailMouseDown:Ge,handleHandleFocus:qe,handleHandleBlur:Je,handleHandleMouseEnter:Qe,handleHandleMouseLeave:Ze,handleRailKeyDown:Ke,indicatorCssVars:k?void 0:$e,indicatorThemeClass:A==null?void 0:A.themeClass,indicatorOnRender:A==null?void 0:A.onRender,cssVars:k?void 0:Te,themeClass:P==null?void 0:P.themeClass,onRender:P==null?void 0:P.onRender}},render(){var s;const{mergedClsPrefix:p,themeClass:n,formatTooltip:k}=this;return(s=this.onRender)===null||s===void 0||s.call(this),y("div",{class:[`${p}-slider`,n,{[`${p}-slider--disabled`]:this.mergedDisabled,[`${p}-slider--active`]:this.activeIndex!==-1,[`${p}-slider--with-mark`]:this.marks,[`${p}-slider--vertical`]:this.vertical,[`${p}-slider--reverse`]:this.reverse}],style:this.cssVars,onKeydown:this.handleRailKeyDown,onMousedown:this.handleRailMouseDown,onTouchstart:this.handleRailMouseDown},y("div",{class:`${p}-slider-rail`},y("div",{class:`${p}-slider-rail__fill`,style:this.fillStyle}),this.marks?y("div",{class:[`${p}-slider-dots`,this.dotTransitionDisabled&&`${p}-slider-dots--transition-disabled`]},this.markInfos.map(g=>y("div",{key:g.label,class:[`${p}-slider-dot`,{[`${p}-slider-dot--active`]:g.active}],style:g.style}))):null,y("div",{ref:"handleRailRef",class:`${p}-slider-handles`},this.arrifiedValues.map((g,b)=>{const V=this.isShowTooltip(b);return y(Ft,null,{default:()=>[y(Pt,null,{default:()=>y("div",{ref:this.setHandleRefs(b),class:`${p}-slider-handle-wrapper`,tabindex:this.mergedDisabled?-1:0,role:"slider","aria-valuenow":g,"aria-valuemin":this.min,"aria-valuemax":this.max,"aria-orientation":this.vertical?"vertical":"horizontal","aria-disabled":this.disabled,style:this.getHandleStyle(g,b),onFocus:()=>{this.handleHandleFocus(b)},onBlur:()=>{this.handleHandleBlur(b)},onMouseenter:()=>{this.handleHandleMouseEnter(b)},onMouseleave:()=>{this.handleHandleMouseLeave(b)}},yt(this.$slots.thumb,()=>[y("div",{class:`${p}-slider-handle`})]))}),this.tooltip&&y(At,{ref:this.setFollowerRefs(b),show:V,to:this.adjustedTo,enabled:this.showTooltip&&!this.range||this.followerEnabledIndexSet.has(b),teleportDisabled:this.adjustedTo===be.tdkey,placement:this.mergedPlacement,containerClass:this.namespace},{default:()=>y(Ct,{name:"fade-in-scale-up-transition",appear:this.isMounted,css:this.shouldKeepTooltipTransition(b),onEnter:()=>{this.followerEnabledIndexSet.add(b)},onAfterLeave:()=>{this.followerEnabledIndexSet.delete(b)}},{default:()=>{var D;return V?((D=this.indicatorOnRender)===null||D===void 0||D.call(this),y("div",{class:[`${p}-slider-handle-indicator`,this.indicatorThemeClass,`${p}-slider-handle-indicator--${this.mergedPlacement}`],style:this.indicatorCssVars},typeof k=="function"?k(g):g)):null}})})]})})),this.marks?y("div",{class:`${p}-slider-marks`},this.markInfos.map(g=>y("div",{key:g.label,class:`${p}-slider-mark`,style:g.style},g.label))):null))}}),Lt=s=>(Tt("data-v-bcfc4957"),s=s(),$t(),s),Xt={class:"bg-slate-200 dark:bg-zinc-900 rounded-[10px] p-[8px] overflow-auto"},Kt=Lt(()=>r("div",{class:"text-slate-500 mb-[5px] font-bold"}," LOGO ",-1)),Gt={class:"flex items-center mt-[5px]"},Yt={class:"text-slate-500 mb-[5px] font-bold"},qt={class:"flex items-center mt-[5px]"},Jt={class:"mr-[10px]"},Qt={class:"text-slate-500 mb-[5px] font-bold"},Zt={class:"flex items-center mt-[5px]"},ea={class:"mr-[10px]"},ta={key:0,class:"flex items-center mt-[5px]"},aa={class:"mr-[10px]"},oa={class:"text-slate-500 mb-[5px] font-bold"},na={class:"flex items-center mt-[5px]"},sa={class:"mr-[10px]"},la={key:0,class:"flex items-center mt-[5px]"},ia={class:"mr-[10px]"},ra={key:1,class:"flex items-center mt-[5px]"},da={class:"mr-[10px]"},ca={class:"text-slate-500 mb-[5px] font-bold"},ua={class:"mt-[5px]"},fa={class:"flex items-center mt-[5px]"},ha={key:0,class:"mt-[5px]"},pa={class:"flex items-center mt-[5px]"},va={key:1,class:"mt-[5px]"},ma={class:"flex items-center mt-[5px]"},ga={class:"mt-[5px]"},ba={class:"flex items-center mt-[5px]"},xa={class:"text-slate-500 mb-[5px] font-bold"},wa={class:"text-shadow text-white"},Sa={class:"flex items-center mt-[5px]"},ya={class:"mr-[10px]"},Ca={key:0,class:"mt-1"},ka={class:"flex items-center mt-[10px]"},_a={class:"mr-[10px]"},za={class:"flex items-center mt-[10px]"},Ta={class:"mr-[10px]"},$a={class:"text-slate-500 mb-[5px] font-bold"},Ra={class:"flex items-center mt-[5px]"},Ma={class:"mr-[10px]"},Ia={class:"flex items-center mt-[10px]"},Va={class:"mr-[10px]"},Ba={class:"flex"},Da={class:"flex items-center mt-[10px]"},Ua={class:"mr-[10px]"},Na={class:"flex items-center mt-[10px]"},Ha={class:"mr-[10px]"},Fa={class:"flex items-center mt-[10px]"},Pa={class:"mr-[10px]"},Aa={class:"text-slate-500 mb-[5px] font-bold"},Ea=Ue({__name:"index",setup(s){const p=kt(),n=Rt(),k=_t(),g=M(!1),b=T({get:()=>String(n.panelConfig.maxWidth??""),set:d=>{const l=Number(d);n.panelConfig.maxWidth=d.trim()===""||Number.isNaN(l)?void 0:l}}),V=M(!1),D=[{label:ne("apps.baseSettings.detailIcon"),value:se.info},{label:ne("apps.baseSettings.smallIcon"),value:se.icon}],ie=[{label:"px",value:"px"},{label:"%",value:"%"}];ge(n.panelConfig,()=>{V.value||(V.value=!0,setTimeout(()=>{n.recordState(),V.value=!1,O()},1e3))});function re({file:d,event:l}){const i=JSON.parse((l==null?void 0:l.target).response);return n.panelConfig.backgroundImageSrc=i.data.imageUrl,d}function O(){Mt({panel:n.panelConfig}).then(d=>{d.code===0?k.success(ne("apps.baseSettings.configSaved")):k.error(ne("apps.baseSettings.configFailed",{message:d.msg}))})}function X(){n.resetPanelConfig(),O()}return(d,l)=>(H(),F("div",Xt,[c(t(I),{style:{"border-radius":"10px"},size:"small"},{default:m(()=>[Kt,r("div",null,[r("div",null,h(d.$t("apps.baseSettings.textContent")),1),r("div",Gt,[c(t(le),{value:t(n).panelConfig.logoText,"onUpdate:value":l[0]||(l[0]=i=>t(n).panelConfig.logoText=i),type:"text","show-count":"",maxlength:20,placeholder:"请输入文字"},null,8,["value"])])])]),_:1}),c(t(I),{style:{"border-radius":"10px"},class:"mt-[10px]",size:"small"},{default:m(()=>[r("div",Yt,h(d.$t("apps.baseSettings.clock")),1),r("div",qt,[r("span",Jt,h(d.$t("apps.baseSettings.clockSecondShow")),1),c(t(R),{value:t(n).panelConfig.clockShowSecond,"onUpdate:value":l[1]||(l[1]=i=>t(n).panelConfig.clockShowSecond=i)},null,8,["value"])])]),_:1}),c(t(I),{style:{"border-radius":"10px"},class:"mt-[10px]",size:"small"},{default:m(()=>[r("div",Qt,h(d.$t("apps.baseSettings.searchBar")),1),r("div",Zt,[r("span",ea,h(d.$t("common.show")),1),c(t(R),{value:t(n).panelConfig.searchBoxShow,"onUpdate:value":l[2]||(l[2]=i=>t(n).panelConfig.searchBoxShow=i)},null,8,["value"])]),t(n).panelConfig.searchBoxShow?(H(),F("div",ta,[r("span",aa,h(d.$t("apps.baseSettings.searchBarSearchItem")),1),c(t(R),{value:t(n).panelConfig.searchBoxSearchIcon,"onUpdate:value":l[3]||(l[3]=i=>t(n).panelConfig.searchBoxSearchIcon=i)},null,8,["value"])])):E("",!0)]),_:1}),c(t(I),{style:{"border-radius":"10px"},class:"mt-[10px]",size:"small"},{default:m(()=>[r("div",oa,h(d.$t("apps.baseSettings.systemMonitorStatus")),1),r("div",na,[r("span",sa,h(d.$t("common.show")),1),c(t(R),{value:t(n).panelConfig.systemMonitorShow,"onUpdate:value":l[4]||(l[4]=i=>t(n).panelConfig.systemMonitorShow=i)},null,8,["value"])]),t(n).panelConfig.systemMonitorShow?(H(),F("div",la,[r("span",ia,h(d.$t("apps.baseSettings.showTitle")),1),c(t(R),{value:t(n).panelConfig.systemMonitorShowTitle,"onUpdate:value":l[5]||(l[5]=i=>t(n).panelConfig.systemMonitorShowTitle=i)},null,8,["value"])])):E("",!0),t(n).panelConfig.systemMonitorShow?(H(),F("div",ra,[r("span",da,h(d.$t("apps.baseSettings.publicVisitModeShow")),1),c(t(R),{value:t(n).panelConfig.systemMonitorPublicVisitModeShow,"onUpdate:value":l[6]||(l[6]=i=>t(n).panelConfig.systemMonitorPublicVisitModeShow=i)},null,8,["value"])])):E("",!0)]),_:1}),c(t(I),{style:{"border-radius":"10px"},class:"mt-[10px]",size:"small"},{default:m(()=>[r("div",ca,h(d.$t("common.icon")),1),r("div",ua,[r("div",null,h(d.$t("common.style")),1),r("div",fa,[c(t(Ve),{value:t(n).panelConfig.iconStyle,"onUpdate:value":l[7]||(l[7]=i=>t(n).panelConfig.iconStyle=i),options:D},null,8,["value"])])]),t(n).panelConfig.iconStyle===t(se).info?(H(),F("div",ha,[r("div",null,h(d.$t("apps.baseSettings.hideDescription")),1),r("div",pa,[c(t(R),{value:t(n).panelConfig.iconTextInfoHideDescription,"onUpdate:value":l[8]||(l[8]=i=>t(n).panelConfig.iconTextInfoHideDescription=i)},null,8,["value"])])])):E("",!0),t(n).panelConfig.iconStyle===t(se).icon?(H(),F("div",va,[r("div",null,h(d.$t("apps.baseSettings.hideTitle")),1),r("div",ma,[c(t(R),{value:t(n).panelConfig.iconTextIconHideTitle,"onUpdate:value":l[9]||(l[9]=i=>t(n).panelConfig.iconTextIconHideTitle=i)},null,8,["value"])])])):E("",!0),r("div",ga,[r("div",null,h(d.$t("common.textColor")),1),r("div",ba,[c(t(Vt),{value:t(n).panelConfig.iconTextColor,"onUpdate:value":l[10]||(l[10]=i=>t(n).panelConfig.iconTextColor=i),"show-alpha":!1,size:"small",modes:["hex"],swatches:["#000000","#ffffff","#18A058","#2080F0","#F0A020"]},null,8,["value"])])])]),_:1}),c(t(I),{style:{"border-radius":"10px"},class:"mt-[10px]",size:"small"},{default:m(()=>[r("div",xa,h(d.$t("apps.baseSettings.wallpaper")),1),c(t(Bt),{action:"/api/file/uploadImg","show-file-list":!1,name:"imgfile",headers:{token:t(p).token},"directory-dnd":!0,onFinish:re},{default:m(()=>[c(t(Dt),{style:{width:"100%"}},{default:m(()=>[r("div",{class:"h-[200px] w-full border bg-slate-100 flex justify-center items-center cursor-pointer rounded-[10px]",style:zt({background:`url(${t(n).panelConfig.backgroundImageSrc}) no-repeat`,backgroundSize:"cover"})},[r("div",wa,h(d.$t("apps.baseSettings.uploadOrDragText")),1)],4)]),_:1})]),_:1},8,["headers"]),r("div",Sa,[r("span",ya,h(d.$t("apps.baseSettings.customImageAddress")),1),c(t(R),{value:g.value,"onUpdate:value":l[11]||(l[11]=i=>g.value=i)},null,8,["value"])]),g.value?(H(),F("div",Ca,[c(t(le),{value:t(n).panelConfig.backgroundImageSrc,"onUpdate:value":l[12]||(l[12]=i=>t(n).panelConfig.backgroundImageSrc=i),type:"text",size:"small",clearable:""},null,8,["value"])])):E("",!0),r("div",ka,[r("span",_a,h(d.$t("apps.baseSettings.vague")),1),c(t(L),{value:t(n).panelConfig.backgroundBlur,"onUpdate:value":l[13]||(l[13]=i=>t(n).panelConfig.backgroundBlur=i),class:"max-w-[200px]",step:2,max:20},null,8,["value"])]),r("div",za,[r("span",Ta,h(d.$t("apps.baseSettings.mask")),1),c(t(L),{value:t(n).panelConfig.backgroundMaskNumber,"onUpdate:value":l[14]||(l[14]=i=>t(n).panelConfig.backgroundMaskNumber=i),class:"max-w-[200px]",step:.1,max:1},null,8,["value"])])]),_:1}),c(t(I),{style:{"border-radius":"10px"},class:"mt-[10px]",size:"small"},{default:m(()=>[r("div",$a,h(d.$t("apps.baseSettings.contentArea")),1),c(t(It),{cols:"2"},{default:m(()=>[c(t(W),{span:"12 400:12"},{default:m(()=>[r("div",Ra,[r("span",Ma,h(d.$t("apps.baseSettings.netModeChangeButtonShow")),1),c(t(R),{value:t(n).panelConfig.netModeChangeButtonShow,"onUpdate:value":l[15]||(l[15]=i=>t(n).panelConfig.netModeChangeButtonShow=i)},null,8,["value"])])]),_:1}),c(t(W),{span:"12 400:12"},{default:m(()=>[r("div",Ia,[r("span",Va,h(d.$t("apps.baseSettings.maxWidth")),1),r("div",Ba,[c(t(Ut),null,{default:m(()=>[c(t(le),{value:b.value,"onUpdate:value":l[16]||(l[16]=i=>b.value=i),size:"small",type:"text",maxlength:10,style:{width:"100px"},placeholder:"1200"},null,8,["value"]),c(t(Ve),{value:t(n).panelConfig.maxWidthUnit,"onUpdate:value":l[17]||(l[17]=i=>t(n).panelConfig.maxWidthUnit=i),style:{width:"80px"},options:ie,size:"small"},null,8,["value"])]),_:1})])])]),_:1}),c(t(W),{span:"12 400:12"},{default:m(()=>[r("div",Da,[r("span",Ua,h(d.$t("apps.baseSettings.leftRightMargin")),1),c(t(L),{value:t(n).panelConfig.marginX,"onUpdate:value":l[18]||(l[18]=i=>t(n).panelConfig.marginX=i),class:"max-w-[200px]",step:1,max:100},null,8,["value"])])]),_:1}),c(t(W),{span:"12 400:12"},{default:m(()=>[r("div",Na,[r("span",Ha,h(d.$t("apps.baseSettings.topMargin"))+" (%)",1),c(t(L),{value:t(n).panelConfig.marginTop,"onUpdate:value":l[19]||(l[19]=i=>t(n).panelConfig.marginTop=i),class:"max-w-[200px]",step:1,max:50},null,8,["value"])])]),_:1}),c(t(W),{span:"12 400:6"},{default:m(()=>[r("div",Fa,[r("span",Pa,h(d.$t("apps.baseSettings.bottomMargin"))+" (%)",1),c(t(L),{value:t(n).panelConfig.marginBottom,"onUpdate:value":l[20]||(l[20]=i=>t(n).panelConfig.marginBottom=i),class:"max-w-[200px]",step:1,max:50},null,8,["value"])])]),_:1})]),_:1})]),_:1}),c(t(I),{style:{"border-radius":"10px"},class:"mt-[10px]",size:"small"},{default:m(()=>[r("div",Aa,h(d.$t("apps.baseSettings.customFooter")),1),c(t(le),{value:t(n).panelConfig.footerHtml,"onUpdate:value":l[21]||(l[21]=i=>t(n).panelConfig.footerHtml=i),type:"textarea",clearable:""},null,8,["value"])]),_:1}),c(t(I),{style:{"border-radius":"10px"},class:"mt-[10px]",size:"small"},{default:m(()=>[c(t(Nt),{onPositiveClick:X},{trigger:m(()=>[c(t(Ie),{size:"small",quaternary:"",type:"error"},{default:m(()=>[me(h(d.$t("common.reset")),1)]),_:1})]),default:m(()=>[me(" "+h(d.$t("apps.baseSettings.resetWarnText")),1)]),_:1}),c(t(Ie),{size:"small",quaternary:"",type:"success",class:"ml-[10px]",onClick:O},{default:m(()=>[me(h(d.$t("common.save")),1)]),_:1})]),_:1})]))}});const Ga=Et(Ea,[["__scopeId","data-v-bcfc4957"]]);export{Ga as default};
