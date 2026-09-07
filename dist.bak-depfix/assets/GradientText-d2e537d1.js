import{u as h}from"./browser-2381bdb0.js";import{f as x}from"./index-daffc0bf.js";import{l as z,B as l,g as v,p as S,D as i,c_ as T,F as c,G as k,s as B,t as $,v as C,x as R,M as w}from"./index-8fd49c7f.js";var G=z("gradient-text",`
 display: inline-block;
 font-weight: var(--n-font-weight);
 -webkit-background-clip: text;
 background-clip: text;
 color: #0000;
 white-space: nowrap;
 background-image: linear-gradient(var(--n-rotate), var(--n-color-start) 0%, var(--n-color-end) 100%);
 transition:
 --n-color-start .3s var(--n-bezier),
 --n-color-end .3s var(--n-bezier);
`);const I={...l.props,size:[String,Number],fontSize:[String,Number],type:{type:String,default:"primary"},color:[Object,String],gradient:[Object,String]};var V=v({name:"GradientText",props:I,setup(t){h();const{mergedClsPrefixRef:r,inlineThemeDisabled:a}=S(t),n=i(()=>{const{type:e}=t;return e==="danger"?"error":e}),g=i(()=>{let e=t.size||t.fontSize;return e&&(e=x(e)),e||void 0}),d=i(()=>{const e=t.color||t.gradient;if(typeof e=="string")return e;if(e)return`linear-gradient(${e.deg||0}deg, ${e.from} 0%, ${e.to} 100%)`}),f=l("GradientText","-gradient-text",G,T,t,r),s=i(()=>{const{value:e}=n,{common:{cubicBezierEaseInOut:m},self:{rotate:u,[c("colorStart",e)]:y,[c("colorEnd",e)]:p,fontWeight:b}}=f.value;return{"--n-bezier":m,"--n-rotate":u,"--n-color-start":y,"--n-color-end":p,"--n-font-weight":b}}),o=a?k("gradient-text",i(()=>n.value[0]),s,t):void 0;return{mergedClsPrefix:r,compatibleType:n,styleFontSize:g,styleBgImage:d,cssVars:a?void 0:s,themeClass:o==null?void 0:o.themeClass,onRender:o==null?void 0:o.onRender}},render(){const{mergedClsPrefix:t,onRender:r}=this;return r==null||r(),B(),$("span",{class:R([`${t}-gradient-text`,`${t}-gradient-text--${this.compatibleType}-type`,this.themeClass]),style:w([{fontSize:this.styleFontSize,backgroundImage:this.styleBgImage},this.cssVars])},[C(()=>{var a,n;return(n=(a=this.$slots).default)==null?void 0:n.call(a)})],6)}});export{V as G};
