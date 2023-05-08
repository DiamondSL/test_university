const asyncCallback=async({callback:e=functionFallback({fallbackText:"no callback provided",context:this})})=>e instanceof Function&&e!==functionFallback?await e:e,functionFallback=({fallbackText:e=String("No function provided"),context:t=this})=>console.warn({text:e,place:t});let documentStyles=null;const getTemplates=async(e,t=document.body)=>{const n=document.createElement("div");return n.setAttribute("name","templatesWrapper"),n.innerHTML=await(await fetch(e)).text(),t&&t instanceof HTMLElement?t.insertAdjacentElement("afterbegin",n):useAwaitDOMElementRender("body",null,{attributes:!0,childList:!0},!0,!0).then((e=>{e.insertAdjacentElement("afterbegin",n)})),n},toCamelCase=e=>"string"==typeof e&&e.replace(/-./g,(e=>e[1].toUpperCase())),toKebabCase=e=>"string"==typeof e&&e.replace(/[A-Z]+(?![a-z])|[A-Z]/g,((e,t)=>(t?"-":"")+e.toLowerCase())),createHTMLCollection=(...e)=>{const t=document.createDocumentFragment();return e.filter((e=>e instanceof Element)).forEach((e=>{const n=e.cloneNode(!0);t.appendChild(n)})),t.children},isNodeList=e=>{const t=Object.prototype.toString.call(e);return"object"==typeof e&&/^\[object (HTMLCollection|NodeList|Object)\]$/.test(t)&&"number"==typeof e.length&&(0===e.length||"object"==typeof e[0]&&e[0].nodeType>0)},isValidHTMLTag=e=>{const t=document.createElement(e.toUpperCase());return!t instanceof HTMLUnknownElement&&(t.remove(),!0)},checkIfElementIsHTMLNode=e=>{if(e instanceof Element||isNodeList(e)||HTMLCollection.prototype.isPrototypeOf(e))return!0};class CSSProperty{constructor(e,t){return Array.isArray(e)?Object.fromEntries(e.map(((e,n)=>Array.isArray(t)?(this.propertyName=this.toCamelCaseVariable(e),this.propertyValue=t[n],[this.propertyName,this.propertyValue]):(this.propertyName=this.toCamelCaseVariable(e),this.propertyValue=t,[this.propertyName,this.propertyValue])))):(this.propertyName=this.toCamelCaseVariable(e),this.propertyValue=t,{[this.propertyName]:this.propertyValue})}toCamelCaseVariable(e){let t=e.split("-"),n="";for(let e=0;e<t.length;e++)e>0&&t[e].length>0&&(1!==e||"ms"!==t[e])&&(t[e]=t[e].substr(0,1).toUpperCase()+t[e].substr(1)),n+=t[e];return n}constructDocumentStyles(){let e=documentStyles||null;return useAwaitDOMElementRender("body").then((t=>{e=t instanceof CSSStyleDeclaration&&window.getComputedStyle(t)})),e}isValidCSSProperty(e=this.propertyName){let t=documentStyles instanceof CSSStyleDeclaration?documentStyles:this.constructDocumentStyles();return this.validCSSProperty=t instanceof CSSStyleDeclaration&&t.hasOwnProperty(e),this.validCSSProperty}}class CaseInsensitiveSet extends Set{constructor(e){super(Array.from(e,(e=>e.toLowerCase())))}add(e){return super.add(e.toLowerCase())}has(e){return super.has(e.toLowerCase())}delete(e){return super.delete(e.toLowerCase())}}const validTagNames=new CaseInsensitiveSet("a,abbr,acronym,abbr,address,applet,embed,object,area,article\n,aside,audio,b,base,basefont,bdi,bdo,big,blockquote,body,br,button,canvas,caption,center,cite\n,code,col,colgroup,data,datalist,dd,del,details,dfn,dialog,dir,ul,div,dl,dt,em,embed,fieldset\n,figcaption,figure,font,footer,form,frame,frameset,h1 to <h6>,head,header,hr,html,i,iframe,img\n,input,ins,kbd,label,legend,li,link,main,map,mark,meta,meter,nav,noframes,noscript,object,ol\n,optgroup,option,output,p,param,picture,pre,progress,q,rp,rt,ruby,s,samp,script,section,select\n,small,source,span,strike,del,s,strong,style,sub,summary,sup,svg,table,tbody,td,template,textarea\n,tfoot,th,thead,time,title,tr,track,tt,u,ul,var,video,wbr".split(","));Object.defineProperty(MutationObserver.prototype,"observeOptions",{configurable:!0,writable:!0,value:new Object({childList:!0,subtree:!1,attributes:!1,attributeOldValue:!1,characterData:!1,characterDataOldValue:!1,attributeFilter:""})});const useAwaitDOMElementRender=(e="body",t=functionFallback({fallbackText:"no callback provided",context:this}),n=new Object({childList:!0,subtree:!0}),r=!0,s=!0,a=document,i=!1)=>(n="object"==typeof n&&n instanceof Object?Object.fromEntries(Object.entries(n).filter((e=>e[0]in MutationObserver.prototype.observeOptions))):"object"==typeof n?Array.isArray(n)&&Object.fromEntries(n.filter((e=>Object.keys(e)[0]in MutationObserver.prototype.observeOptions))):void 0===n||null===n&&{childList:!0,subtree:!0,attributes:!0},new Promise((o=>{if(document.querySelector(e)){let n=document.querySelector(e);return t!==functionFallback&&t instanceof Function&&t(n),o(n)}const l=new MutationObserver((n=>{i&&console.info(n),document.querySelector(e)&&(t!==functionFallback&&t instanceof Function&&t(n),o(document.querySelector(e)),r||s&&l.disconnect())}));l.observe(a instanceof Element?a:document,{...n})})));useAwaitDOMElementRender("body").then((e=>{if(e instanceof CSSStyleDeclaration)return documentStyles=window.getComputedStyle(e)})),customElements.define("container-title-wrapper",class extends HTMLElement{constructor(){super(),this.setAttribute("class","container-title-wrapper"),this.style.gridArea="1 / 1 / 1 / -1",awaitHTMLElementAttributeChange(this,["parentElement"]).then((e=>{this.setAttribute("data-parent-element-position-top",`${e.parentElement.offsetTop}px`),this.setAttribute("data-parent-element-position-left",`${e.parentElement.offsetLeft}px`)}))}},{extends:"header"}),customElements.define("container-description-wrapper",class extends HTMLElement{constructor(){super(),this.style.gridArea="2 / 2 / 2 / -1",this.setAttribute("class","container-description-wrapper")}},{extends:"article"}),customElements.define("elements-container",class extends HTMLDivElement{constructor(){super(),this.setAttribute("class","container"),null!==this.dataset.title&&this.constructElementTitle(this.dataset.title),null!==this.dataset.description&&this.constructElementDescription(this.dataset.description)}constructElementTitle(e){if("string"==typeof e&&e.length>0){const t=document.createElement("header",{is:"container-title-wrapper"}),n=document.createTextNode(e),r=document.createElement("h3");r.appendChild(n),t.appendChild(r),this.insertAdjacentElement("afterbegin",t)}}constructElementDescription(e){if("string"==typeof e&&e.length>0){const t=document.createElement("article",{is:"container-description-wrapper"}),n=document.createTextNode(e),r=document.createElement("p");r.appendChild(n),t.appendChild(r),this.insertAdjacentElement("afterbegin",t)}}},{extends:"div"});const returnValidVisualElement=async e=>{const t=document.createElement("object");return Object.defineProperty(t,"data",{value:String(e),configurable:!0,writable:!0}),Object.defineProperty(t,"name",{value:String("visualElementValidityCheck"),configurable:!0,writable:!0}),t};getTemplates("./html_templates.html",document.body).then((e=>e)).then((async e=>({newsletterTemplate:await e.querySelector("#newsletter_template"),firebaseNewsletter:await e.querySelector("#firebase_newsletter"),modalElement:await e.querySelector("#modalElement")}))).then((async e=>{customElements.define("newsletter-item",class extends HTMLElement{constructor(){super();const t=e.newsletterTemplate.content,n=this.attachShadow({mode:"open"});validTagNames.add("newsletter-item"),n.appendChild(t.cloneNode(!0))}}),customElements.define("modal-element",class extends HTMLElement{constructor(){super();const t=e.modalElement.content,n=this.attachShadow({mode:"open"}),r=t.cloneNode(!0),s=r.children.namedItem("content-wrapper")??this.shadowRoot.children.namedItem("content-wrapper"),a=s.children.namedItem("close-button")??this.shadowRoot.children.namedItem("close-button");s&&s.addEventListener("click",(e=>{e.stopPropagation()})),a&&a.addEventListener("click",(e=>(e.stopPropagation(),e.preventDefault(),this.hide()))),this.addEventListener("click",(e=>{if(e.stopPropagation(),e.target===e.currentTarget)return this.classList.contains("visible")?this.hide():this.show()})),validTagNames.add("modal-element"),n.appendChild(r)}show(){this.classList.add("visible")}hide(){this.classList.remove("visible")}}),customElements.define("newsletter-preview",class extends HTMLElement{constructImageFallback=({imageFallback:e,elementClasses:t,styles:n,tagName:r,...s})=>{let a=null;const i=Array.isArray(n)?n.map((e=>new CSSProperty(e[0],e[1]))):n instanceof Object?Object.entries(n).map((e=>new CSSProperty(e[0],e[1]))):n instanceof CSSProperty||"string"==typeof n?n:"";if(checkIfElementIsHTMLNode(e)&&e.tagName.toLowerCase().trim()===r.toLowerCase().trim())return a=e,(()=>{Object.assign(a,{classList:"string"==typeof t?a.classList.add(t):Array.isArray(t)?t.forEach((e=>a.classList.add(e.trim()))):a.classList}),Object.assign(a.style,{...i});const e=s.filter((e=>e in a));e.forEach((e=>{Object.assign(a,{item:e})})),a.classList,a.style})(),a;if(!checkIfElementIsHTMLNode(e)&&isValidHTMLTag(r)||e.tagName.toLowerCase().trim()!==r.toLowerCase().trim()&&isValidHTMLTag(r)){if(a=document.createElement(r),a instanceof HTMLVideoElement&&Object.assign(a,{src:e||Object.entries(...s).find((e=>"src"===e[0]))[1]||"https://joy1.videvo.net/videvo_files/video/free/2013-08/large_watermarked/hd0983_preview.mp4"}),a instanceof HTMLPictureElement){const t={sourceElement:document.createElement("source"),image:document.createElement("img")};Object.defineProperty(t.sourceElement,"src",{value:e||Object.entries(...s).find((e=>"src"===e[0]))[1]||"./favicon.ico"}),Object.defineProperties(t.image,{src:{value:e||Object.entries(...s).find((e=>"src"===e[0]))[1]||"./favicon.ico"},alt:{value:Object.entries(...s).find((e=>"alt"===e[0]))[1]||"alternative text"}}),a.insertAdjacentElement("afterbegin",t.sourceElement),a.insertAdjacentElement("beforeend",t.image)}s.filter((e=>e in a)).forEach((e=>{Object.assign(a,{item:e})}))}};constructor(t,n,r,s,a,i){super(),this.newsletterProps={postName:checkIfElementIsHTMLNode(t)?t:Array.from(this.children).find((e=>"header-place-wrapper"===e.slot)),postCategory:checkIfElementIsHTMLNode(n)?n:Array.from(this.children).find((e=>"preview-image-caption"===e.slot)),authorName:checkIfElementIsHTMLNode(r)||r instanceof String?r:this.attributes.getNamedItem("author").value,authorEmail:checkIfElementIsHTMLNode(a)||a instanceof String?a:this.attributes.getNamedItem("email").value,visualPreview:checkIfElementIsHTMLNode(s)||"string"==typeof s?returnValidVisualElement(s):Array.from(this.children).find((e=>"preview-image-wrapper"===e.slot)),postMarkup:i||Array.from(this.children).filter((e=>"newsletter-markup"===e.slot||!e.slot))};const o=e.firebaseNewsletter.content,l=this.attachShadow({mode:"open"});validTagNames.add(this.tagName),l.appendChild(o.cloneNode(!0))}set headerPlaceWrapper(e){if(e instanceof Element||isNodeList(e)||HTMLCollection.prototype.isPrototypeOf(e)){const e=this.childrenElements.find((e=>e.assignedSlot.name===toKebabCase("headerPlaceWrapper")));return this.headerPlaceWrapper=createHTMLCollection(e)}}get headerPlaceWrapper(){return this.headerPlaceWrapper}set visualPreview(e){if(e instanceof Element||isNodeList(e)||HTMLCollection.prototype.isPrototypeOf(e)){const e=this.childrenElements.find((e=>e.assignedSlot.name===toKebabCase("previewImageWrapper")));return this.visualPreview=createHTMLCollection(e)}}get visualPreview(){return this.visualPreview}set visualPreviewCaption(e){if(e instanceof Element||isNodeList(e)||HTMLCollection.prototype.isPrototypeOf(e)){const e=this.childrenElements.find((e=>e.assignedSlot.name===toKebabCase("previewImageCaption")));return this.visualPreview=createHTMLCollection(e)}}get visualPreviewCaption(){return this.visualPreviewCaption}set newsletterPreviewActions(e){if(e instanceof Element||isNodeList(e)||HTMLCollection.prototype.isPrototypeOf(e)){const e=this.childrenElements.find((e=>e.assignedSlot.name===toKebabCase("newsletterPreviewActions")));return this.newsletterPreviewActions=createHTMLCollection(e)}}get newsletterPreviewActions(){return this.newsletterPreviewActions}set newsletterMarkup(e){if(e instanceof Element||isNodeList(e)||HTMLCollection.prototype.isPrototypeOf(e)){const e=this.childrenElements.find((e=>e.assignedSlot.name===toKebabCase("newsletterMarkup")));return this.newsletterMarkup=createHTMLCollection(e)}}get newsletterMarkup(){return this.newsletterMarkup}})}));const awaitHTMLElementAttributeChange=(e,t,n)=>{t=Array.isArray(t)?t:t instanceof Object?Object.keys(t):new Array(t);const r=Object.fromEntries(t.map((t=>[t,e.getAttribute(t)||e[t]]))),s=new MutationObserver(n instanceof Function?n:n=>{if(t.length>0)for(const s of n)t.some(((n,s)=>{if((null!==e.getAttribute(n)||void 0!==e.getAttribute(n)||null!==e[n]||void 0!==e[n])&&r[n]!==e[n])return delete t[s],!0}))});return new Promise(((n,r)=>{e instanceof Element&&(t.length>0||""!==t)?(s.observe(e,{childList:!0,attributes:!0,characterData:!0}),0===t.length&&s.disconnect(),n(e)):(s.disconnect(),r("element is not valid HTML element"))}))};
//# sourceMappingURL=index.9116b3a2.js.map
