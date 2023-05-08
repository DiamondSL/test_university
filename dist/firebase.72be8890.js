const asyncCallback = async ({ callback =functionFallback({
    fallbackText: "no callback provided",
    context: this
})  })=>callback instanceof Function && callback !== functionFallback ? await callback : callback;
const functionFallback = ({ fallbackText =String("No function provided") , context =this  })=>console.warn({
        text: fallbackText,
        place: context
    });
let documentStyles = null;
const getTemplates = async (templateLink, appendTo = document.body)=>{
    const templates = document.createElement("div");
    templates.setAttribute("name", "templatesWrapper");
    templates.innerHTML = await (await fetch(templateLink)).text();
    appendTo && appendTo instanceof HTMLElement ? appendTo.insertAdjacentElement("afterbegin", templates) : useAwaitDOMElementRender("body", null, {
        attributes: true,
        childList: true
    }, true, true).then((result)=>{
        result.insertAdjacentElement("afterbegin", templates);
    });
    return templates;
};
const toCamelCase = (string)=>typeof string === "string" && string.replace(/-./g, (x)=>x[1].toUpperCase());
const toKebabCase = (string)=>typeof string === "string" && string.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs)=>(ofs ? "-" : "") + $.toLowerCase());
const createHTMLCollection = (...children)=>{
    const docFragment = document.createDocumentFragment();
    children.filter((item)=>item instanceof Element).forEach((item)=>{
        const clonedNode = item.cloneNode(true);
        docFragment.appendChild(clonedNode);
    });
    return docFragment.children;
};
const isNodeList = (nodes)=>{
    const stringRepr = Object.prototype.toString.call(nodes);
    return typeof nodes === "object" && /^\[object (HTMLCollection|NodeList|Object)\]$/.test(stringRepr) && typeof nodes.length === "number" && (nodes.length === 0 || typeof nodes[0] === "object" && nodes[0].nodeType > 0);
};
const isValidHTMLTag = (element)=>{
    const partialElement = document.createElement(element.toUpperCase());
    if (!partialElement instanceof HTMLUnknownElement) {
        partialElement.remove();
        return true;
    } else return false;
};
const checkIfElementIsHTMLNode = (element)=>{
    if (element instanceof Element || isNodeList(element) || HTMLCollection.prototype.isPrototypeOf(element)) return true;
};
class CSSProperty {
    constructor(propertyName, value){
        if (Array.isArray(propertyName)) return Object.fromEntries(propertyName.map((item, index)=>{
            if (Array.isArray(value)) {
                this.propertyName = this.toCamelCaseVariable(item);
                this.propertyValue = value[index];
                return [
                    this.propertyName,
                    this.propertyValue
                ];
            } else {
                this.propertyName = this.toCamelCaseVariable(item);
                this.propertyValue = value;
                return [
                    this.propertyName,
                    this.propertyValue
                ];
            }
        }));
        else {
            this.propertyName = this.toCamelCaseVariable(propertyName);
            this.propertyValue = value;
            return {
                [this.propertyName]: this.propertyValue
            };
        }
    }
    toCamelCaseVariable(propertyName) {
        let split = propertyName.split("-");
        let output = "";
        for(let i = 0; i < split.length; i++){
            if (i > 0 && split[i].length > 0 && !(i === 1 && split[i] === "ms")) split[i] = split[i].substr(0, 1).toUpperCase() + split[i].substr(1);
            output += split[i];
        }
        return output;
    }
    constructDocumentStyles() {
        let styles = documentStyles || null;
        useAwaitDOMElementRender("body").then((result)=>{
            styles = result instanceof CSSStyleDeclaration && window.getComputedStyle(result);
        });
        return styles;
    }
    isValidCSSProperty(propertyName = this.propertyName) {
        let thisWindowStyles = documentStyles instanceof CSSStyleDeclaration ? documentStyles : this.constructDocumentStyles();
        this.validCSSProperty = thisWindowStyles instanceof CSSStyleDeclaration ? thisWindowStyles.hasOwnProperty(propertyName) : false;
        return this.validCSSProperty;
    }
}
class CaseInsensitiveSet extends Set {
    constructor(values){
        super(Array.from(values, (it)=>it.toLowerCase()));
    }
    add(str) {
        return super.add(str.toLowerCase());
    }
    has(str) {
        return super.has(str.toLowerCase());
    }
    delete(str) {
        return super.delete(str.toLowerCase());
    }
}
const validTagNames = new CaseInsensitiveSet(`a,abbr,acronym,abbr,address,applet,embed,object,area,article
,aside,audio,b,base,basefont,bdi,bdo,big,blockquote,body,br,button,canvas,caption,center,cite
,code,col,colgroup,data,datalist,dd,del,details,dfn,dialog,dir,ul,div,dl,dt,em,embed,fieldset
,figcaption,figure,font,footer,form,frame,frameset,h1 to <h6>,head,header,hr,html,i,iframe,img
,input,ins,kbd,label,legend,li,link,main,map,mark,meta,meter,nav,noframes,noscript,object,ol
,optgroup,option,output,p,param,picture,pre,progress,q,rp,rt,ruby,s,samp,script,section,select
,small,source,span,strike,del,s,strong,style,sub,summary,sup,svg,table,tbody,td,template,textarea
,tfoot,th,thead,time,title,tr,track,tt,u,ul,var,video,wbr`.split(","));
Object.defineProperty(MutationObserver.prototype, "observeOptions", {
    configurable: true,
    writable: true,
    value: new Object({
        childList: true,
        subtree: false,
        attributes: false,
        attributeOldValue: false,
        characterData: false,
        characterDataOldValue: false,
        attributeFilter: ""
    })
});
const useAwaitDOMElementRender = (selector = "body", callback = functionFallback({
    fallbackText: "no callback provided",
    context: this
}), observerConfig = new Object({
    childList: true,
    subtree: true
}), disconnectCondition = true, disconnectOnRender = true, HTMLparentElement = document, logMutations = false)=>{
    observerConfig = typeof observerConfig === "object" && observerConfig instanceof Object ? Object.fromEntries(Object.entries(observerConfig).filter((item)=>{
        return item[0] in MutationObserver.prototype.observeOptions;
    })) : typeof observerConfig === "object" ? Array.isArray(observerConfig) && Object.fromEntries(observerConfig.filter((item)=>{
        return Object.keys(item)[0] in MutationObserver.prototype.observeOptions;
    })) : observerConfig === undefined || observerConfig === null && {
        childList: true,
        subtree: true,
        attributes: true
    };
    return new Promise((resolve)=>{
        if (document.querySelector(selector)) {
            let renderedElement = document.querySelector(selector);
            callback !== functionFallback && callback instanceof Function && callback(renderedElement);
            return resolve(renderedElement);
        }
        const observer = new MutationObserver((mutations)=>{
            logMutations && console.info(mutations);
            if (document.querySelector(selector)) {
                callback !== functionFallback && callback instanceof Function && callback(mutations);
                resolve(document.querySelector(selector));
                disconnectCondition || disconnectOnRender && observer.disconnect();
            }
        });
        observer.observe(HTMLparentElement instanceof Element ? HTMLparentElement : document, {
            ...observerConfig
        });
    });
};
useAwaitDOMElementRender("body").then((result)=>{
    if (result instanceof CSSStyleDeclaration) return documentStyles = window.getComputedStyle(result);
});
customElements.define("container-title-wrapper", class ElementsContainerTitleWrapper extends HTMLElement {
    constructor(){
        super();
        this.setAttribute("class", "container-title-wrapper");
        this.style.gridArea = "1 / 1 / 1 / -1";
        awaitHTMLElementAttributeChange(this, [
            "parentElement"
        ]).then((result)=>{
            this.setAttribute("data-parent-element-position-top", `${result.parentElement.offsetTop}px`);
            this.setAttribute("data-parent-element-position-left", `${result.parentElement.offsetLeft}px`);
        });
    }
}, {
    extends: "header"
});
customElements.define("container-description-wrapper", class ElementsContainerDescriptionWrapper extends HTMLElement {
    constructor(){
        super();
        this.style.gridArea = "2 / 2 / 2 / -1";
        this.setAttribute("class", "container-description-wrapper");
    }
}, {
    extends: "article"
});
customElements.define("elements-container", class ElementsContainer extends HTMLDivElement {
    constructor(){
        super();
        this.setAttribute("class", "container");
        this.dataset["title"] !== null && this.constructElementTitle(this.dataset["title"]);
        this.dataset["description"] !== null && this.constructElementDescription(this.dataset["description"]);
    }
    constructElementTitle(title) {
        if (typeof title === "string" && title.length > 0) {
            const titleWrapper = document.createElement("header", {
                is: "container-title-wrapper"
            });
            const titleText = document.createTextNode(title);
            const titleElement = document.createElement("h3");
            titleElement.appendChild(titleText);
            titleWrapper.appendChild(titleElement);
            this.insertAdjacentElement("afterbegin", titleWrapper);
        }
    }
    constructElementDescription(description) {
        if (typeof description === "string" && description.length > 0) {
            const articleDescriptionWrapper = document.createElement("article", {
                is: "container-description-wrapper"
            });
            const descriptionText = document.createTextNode(description);
            const descriptionElement = document.createElement("p");
            descriptionElement.appendChild(descriptionText);
            articleDescriptionWrapper.appendChild(descriptionElement);
            this.insertAdjacentElement("afterbegin", articleDescriptionWrapper);
        }
    }
}, {
    extends: "div"
});
const returnValidVisualElement = (url)=>{
    const validVisualObject = document.createElement("object");
    validVisualObject.setAttribute("data", url);
    validVisualObject.setAttribute("name", "visualElementValidityCheck");
    return validVisualObject;
};
getTemplates("./html_templates.html", document.body).then((result)=>{
    return result;
}).then(async (result)=>{
    return {
        newsletterTemplate: await result.querySelector("#newsletter_template"),
        firebaseNewsletter: await result.querySelector("#firebase_newsletter"),
        modalElement: await result.querySelector("#modalElement")
    };
}).then(async (result)=>{
    customElements.define("newsletter-item", class NewsletterItem extends HTMLElement {
        constructor(){
            super();
            const newsLetterItem = result.newsletterTemplate.content;
            const shadowRoot = this.attachShadow({
                mode: "open"
            });
            validTagNames.add("newsletter-item");
            shadowRoot.appendChild(newsLetterItem.cloneNode(true));
        }
    });
    customElements.define("modal-element", class ModalElement extends HTMLElement {
        constructor(){
            super();
            const modalElement = result.modalElement.content;
            const shadowRoot = this.attachShadow({
                mode: "open"
            });
            const clonedNode = modalElement.cloneNode(true);
            const contentWrapper = clonedNode.children.namedItem("content-wrapper") ?? this.shadowRoot.children.namedItem("content-wrapper");
            const closeButton = contentWrapper.children.namedItem("close-button") ?? this.shadowRoot.children.namedItem("close-button");
            contentWrapper && contentWrapper.addEventListener("click", (event)=>{
                event.stopPropagation();
            });
            closeButton && closeButton.addEventListener("click", (event)=>{
                event.stopPropagation();
                event.preventDefault();
                return this.hide();
            });
            this.addEventListener("click", (event)=>{
                event.stopPropagation();
                if (event.target === event.currentTarget) return this.classList.contains("visible") ? this.hide() : this.show();
            });
            validTagNames.add("modal-element");
            shadowRoot.appendChild(clonedNode);
        }
        show() {
            this.classList.add("visible");
        }
        hide() {
            this.classList.remove("visible");
        }
    });
    customElements.define("newsletter-preview", class NewsletterPreview extends HTMLElement {
        constructImageFallback = (imageFallback, elementClasses, styles, ...args)=>{
            let visualItem = returnValidVisualElement(imageFallback);
            const validatedCSSproperties = Array.isArray(styles) ? styles.map((item)=>new CSSProperty(item[0], item[1])) : styles instanceof Object ? Object.entries(styles).map((item)=>new CSSProperty(item[0], item[1])) : styles instanceof CSSProperty ? styles : typeof styles === "string" ? styles : "";
            if (checkIfElementIsHTMLNode(imageFallback)) {
                let newImage = imageFallback;
                //assignElementValidatedProperties()
                return visualItem;
            }
            if (!checkIfElementIsHTMLNode(imageFallback)) {
                //const preview = visualItem()
                if (visualItem instanceof HTMLVideoElement) Object.assign(visualItem, {
                    src: imageFallback || Object.entries(...args).find((item)=>item[0] === "src")[1] || "https://joy1.videvo.net/videvo_files/video/free/2013-08/large_watermarked/hd0983_preview.mp4"
                });
                if (visualItem instanceof HTMLPictureElement) {
                    const visualItemChildren = {
                        sourceElement: document.createElement("source"),
                        image: document.createElement("img")
                    };
                    Object.defineProperty(visualItemChildren.sourceElement, "src", {
                        value: imageFallback || Object.entries(...args).find((item)=>item[0] === "src")[1] || "./favicon.ico"
                    });
                    Object.defineProperties(visualItemChildren.image, {
                        "src": {
                            value: imageFallback || Object.entries(...args).find((item)=>item[0] === "src")[1] || "./favicon.ico"
                        },
                        "alt": {
                            value: Object.entries(...args).find((item)=>item[0] === "alt")[1] || "alternative text"
                        }
                    });
                    visualItem.insertAdjacentElement("afterbegin", visualItemChildren.sourceElement);
                    visualItem.insertAdjacentElement("beforeend", visualItemChildren.image);
                }
                args.filter((item)=>item in visualItem).forEach((item)=>{
                    Object.assign(visualItem, {
                        item
                    });
                });
            }
        };
        constructor(postName, postCategory, authorName, visualPreview, authorEmail, postMarkup){
            super();
            this.newsletterProps = {
                postName: checkIfElementIsHTMLNode(postName) ? postName : Array.from(this.children).find((item)=>item.slot === "header-place-wrapper"),
                postCategory: checkIfElementIsHTMLNode(postCategory) ? postCategory : Array.from(this.children).find((item)=>item.slot === "preview-image-caption"),
                authorName: checkIfElementIsHTMLNode(authorName) ? authorName : authorName instanceof String ? authorName : this.attributes.getNamedItem("author").value,
                authorEmail: checkIfElementIsHTMLNode(authorEmail) ? authorEmail : authorEmail instanceof String ? authorEmail : this.attributes.getNamedItem("email").value,
                visualPreview: checkIfElementIsHTMLNode(visualPreview) || typeof visualPreview === "string" ? returnValidVisualElement(visualPreview) : Array.from(this.children).find((item)=>item.slot === "preview-image-wrapper"),
                postMarkup: postMarkup ? postMarkup : Array.from(this.children).filter((item)=>item.slot === "newsletter-markup" || !item.slot)
            };
            const newsLetterItem = result.firebaseNewsletter.content;
            const shadowRoot = this.attachShadow({
                mode: "open"
            });
            validTagNames.add(this.tagName);
            shadowRoot.appendChild(newsLetterItem.cloneNode(true));
        }
        set headerPlaceWrapper(element) {
            if (element instanceof Element || isNodeList(element) || HTMLCollection.prototype.isPrototypeOf(element)) {
                const previousElements = Array.from(this.newsletterProps).find((item)=>item.assignedSlot.name === toKebabCase("headerPlaceWrapper"));
                return this.headerPlaceWrapper = createHTMLCollection(previousElements);
            }
        }
        get headerPlaceWrapper() {
            return this.headerPlaceWrapper;
        }
        set visualPreview(element) {
            if (element instanceof Element || isNodeList(element) || HTMLCollection.prototype.isPrototypeOf(element)) {
                const previousElements = Array.from(this.newsletterProps).find((item)=>item.assignedSlot.name === toKebabCase("previewImageWrapper"));
                return this.visualPreview = createHTMLCollection(previousElements);
            }
        }
        get visualPreview() {
            return this.visualPreview;
        }
        set visualPreviewCaption(element) {
            if (element instanceof Element || isNodeList(element) || HTMLCollection.prototype.isPrototypeOf(element)) {
                const previousElements = Array.from(this.newsletterProps).find((item)=>item.assignedSlot.name === toKebabCase("previewImageCaption"));
                return this.visualPreview = createHTMLCollection(previousElements);
            }
        }
        get visualPreviewCaption() {
            return this.visualPreviewCaption;
        }
        set newsletterPreviewActions(element) {
            if (element instanceof Element || isNodeList(element) || HTMLCollection.prototype.isPrototypeOf(element)) {
                const previousElements = Array.from(this.newsletterProps).find((item)=>item.assignedSlot.name === toKebabCase("newsletterPreviewActions"));
                return this.newsletterPreviewActions = createHTMLCollection(previousElements);
            }
        }
        get newsletterPreviewActions() {
            return this.newsletterPreviewActions;
        }
        set newsletterMarkup(element) {
            if (element instanceof Element || isNodeList(element) || HTMLCollection.prototype.isPrototypeOf(element)) {
                const previousElements = Array.from(this.newsletterProps).find((item)=>item.assignedSlot.name === toKebabCase("newsletterMarkup"));
                return this.newsletterMarkup = createHTMLCollection(previousElements);
            }
        }
        get newsletterMarkup() {
            return this.newsletterMarkup;
        }
    });
});
const awaitHTMLElementAttributeChange = (element, attributes, callback)=>{
    attributes = Array.isArray(attributes) ? attributes : attributes instanceof Object ? Object.keys(attributes) : new Array(attributes);
    const initialAttributeVales = Object.fromEntries(attributes.map((item)=>{
        return [
            item,
            element.getAttribute(item) || element[item]
        ];
    }));
    const mutationCallback = (mutationsList)=>{
        if (attributes.length > 0) for (const mutation of mutationsList)attributes.some((item, index)=>{
            const elementIsValid = element.getAttribute(item) !== null || element.getAttribute(item) !== undefined || element[item] !== null || element[item] !== undefined;
            if (elementIsValid && initialAttributeVales[item] !== element[item]) {
                delete attributes[index];
                return true;
            }
        });
    };
    const observer = new MutationObserver(callback instanceof Function ? callback : mutationCallback);
    return new Promise((resolve, reject)=>{
        if (element instanceof Element && (attributes.length > 0 || attributes !== "")) {
            observer.observe(element, {
                childList: true,
                attributes: true,
                characterData: true
            });
            attributes.length === 0 && observer.disconnect();
            resolve(element);
        } else {
            observer.disconnect();
            reject("element is not valid HTML element");
        }
    });
};

//# sourceMappingURL=firebase.72be8890.js.map
