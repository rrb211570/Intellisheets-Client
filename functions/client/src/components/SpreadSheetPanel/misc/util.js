function hasClass(domElem, className){
    let reg = new RegExp(className);
    if([...domElem.classList].filter(name=>reg.test(name)).length==0) return false;
    else return true;
}
export {hasClass};