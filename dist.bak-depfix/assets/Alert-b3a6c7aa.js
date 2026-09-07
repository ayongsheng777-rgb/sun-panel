import{l as u,n,R as p,bk as H,m as N,B as _,g as D,p as K,d6 as O,ay as G,D as x,bc as X,F as a,G as Z,s as t,N as c,t as b,v as i,ba as q,x as h,K as J,P as Q,L as U,X as k,bj as Y,k as ee,$ as re,a_ as oe,aW as te,a$ as ne,aZ as se}from"./index-8fd49c7f.js";var ae=u("alert",`
 line-height: var(--n-line-height);
 border-radius: var(--n-border-radius);
 position: relative;
 transition: background-color .3s var(--n-bezier);
 background-color: var(--n-color);
 text-align: start;
 word-break: break-word;
`,[n("border",`
 border-radius: inherit;
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 transition: border-color .3s var(--n-bezier);
 border: var(--n-border);
 pointer-events: none;
 `),p("closable",[u("alert-body",[n("title",`
 padding-right: 24px;
 `)])]),n("icon",{color:"var(--n-icon-color)"}),u("alert-body",{padding:"var(--n-padding)"},[n("title",{color:"var(--n-title-text-color)"}),n("content",{color:"var(--n-content-text-color)"})]),H({originalTransition:"transform .3s var(--n-bezier)",enterToProps:{transform:"scale(1)"},leaveToProps:{transform:"scale(0.9)"}}),n("icon",`
 position: absolute;
 left: 0;
 top: 0;
 align-items: center;
 justify-content: center;
 display: flex;
 width: var(--n-icon-size);
 height: var(--n-icon-size);
 font-size: var(--n-icon-size);
 margin: var(--n-icon-margin);
 `),n("close",`
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 position: absolute;
 right: 0;
 top: 0;
 margin: var(--n-close-margin);
 `),p("show-icon",[u("alert-body",{paddingLeft:"calc(var(--n-icon-margin-left) + var(--n-icon-size) + var(--n-icon-margin-right))"})]),p("right-adjust",[u("alert-body",{paddingRight:"calc(var(--n-close-size) + var(--n-padding) + 2px)"})]),u("alert-body",`
 border-radius: var(--n-border-radius);
 transition: border-color .3s var(--n-bezier);
 `,[n("title",`
 transition: color .3s var(--n-bezier);
 font-size: 16px;
 line-height: 19px;
 font-weight: var(--n-title-font-weight);
 `,[N("& +",[n("content",{marginTop:"9px"})])]),n("content",{transition:"color .3s var(--n-bezier)",fontSize:"var(--n-font-size)"})]),n("icon",{transition:"color .3s var(--n-bezier)"})]);const ie={..._.props,title:String,showIcon:{type:Boolean,default:!0},type:{type:String,default:"default"},bordered:{type:Boolean,default:!0},closable:Boolean,onClose:Function,onAfterLeave:Function,onAfterHide:Function};var fe=D({name:"Alert",inheritAttrs:!1,props:ie,slots:Object,setup(o){const{mergedClsPrefixRef:e,mergedBorderedRef:d,inlineThemeDisabled:v,mergedRtlRef:m}=K(o),g=_("Alert","-alert",ae,O,o,e),R=G("Alert",m,e),z=x(()=>{const{common:{cubicBezierEaseInOut:l},self:r}=g.value,{fontSize:A,borderRadius:P,titleFontWeight:B,lineHeight:w,iconSize:I,iconMargin:C,iconMarginRtl:T,closeIconSize:L,closeBorderRadius:S,closeSize:E,closeMargin:F,closeMarginRtl:M,padding:j}=r,{type:s}=o,{left:V,right:W}=X(C);return{"--n-bezier":l,"--n-color":r[a("color",s)],"--n-close-icon-size":L,"--n-close-border-radius":S,"--n-close-color-hover":r[a("closeColorHover",s)],"--n-close-color-pressed":r[a("closeColorPressed",s)],"--n-close-icon-color":r[a("closeIconColor",s)],"--n-close-icon-color-hover":r[a("closeIconColorHover",s)],"--n-close-icon-color-pressed":r[a("closeIconColorPressed",s)],"--n-icon-color":r[a("iconColor",s)],"--n-border":r[a("border",s)],"--n-title-text-color":r[a("titleTextColor",s)],"--n-content-text-color":r[a("contentTextColor",s)],"--n-line-height":w,"--n-border-radius":P,"--n-font-size":A,"--n-title-font-weight":B,"--n-icon-size":I,"--n-icon-margin":C,"--n-icon-margin-rtl":T,"--n-close-size":E,"--n-close-margin":F,"--n-close-margin-rtl":M,"--n-padding":j,"--n-icon-margin-left":V,"--n-icon-margin-right":W}}),f=v?Z("alert",x(()=>o.type[0]),z,o):void 0,y=ee(!0),$=()=>{const{onAfterLeave:l,onAfterHide:r}=o;l&&l(),r&&r()};return{rtlEnabled:R,mergedClsPrefix:e,mergedBordered:d,visible:y,handleCloseClick:()=>{var l;Promise.resolve((l=o.onClose)==null?void 0:l.call(o)).then(r=>{r!==!1&&(y.value=!1)})},handleAfterLeave:()=>{$()},mergedTheme:g,cssVars:v?void 0:z,themeClass:f==null?void 0:f.themeClass,onRender:f==null?void 0:f.onRender}},render(){var o;return(o=this.onRender)==null||o.call(this),t(),c(Y,{onAfterLeave:this.handleAfterLeave},{default:()=>{const{mergedClsPrefix:e,$slots:d}=this,v={class:[`${e}-alert`,this.themeClass,this.closable&&`${e}-alert--closable`,this.showIcon&&`${e}-alert--show-icon`,!this.title&&this.closable&&`${e}-alert--right-adjust`,this.rtlEnabled&&`${e}-alert--rtl`],style:this.cssVars,role:"alert"};return this.visible?(t(),b("div",k({key:1},k(this.$attrs,v)),[i(()=>this.closable&&(t(),c(q,{clsPrefix:e,class:h(`${e}-alert__close`),onClick:this.handleCloseClick},null,8,["clsPrefix","class","onClick"]))),i(()=>this.bordered&&(t(),b("div",{class:h(`${e}-alert__border`)},null,2))),i(()=>this.showIcon&&(t(),b("div",{class:h(`${e}-alert__icon`),"aria-hidden":"true"},[i(()=>J(d.icon,()=>[(t(),c(re,{clsPrefix:e},{default:()=>{switch(this.type){case"success":return t(),c(se,{key:3});case"info":return t(),c(ne,{key:4});case"warning":return t(),c(te,{key:5});case"error":return t(),c(oe,{key:6});default:return null}}},1032,["clsPrefix"]))]))],2))),Q("div",{class:h([`${e}-alert-body`,this.mergedBordered&&`${e}-alert-body--bordered`])},[i(()=>U(d.header,m=>{const g=m||this.title;return g?(t(),b("div",{key:2,class:h(`${e}-alert-body__title`)},[i(()=>g)],2)):null})),i(()=>d.default&&(t(),b("div",{class:h(`${e}-alert-body__content`)},[i(()=>d.default())],2)))],2)],16)):null}},1032,["onAfterLeave"])}});export{fe as A};
