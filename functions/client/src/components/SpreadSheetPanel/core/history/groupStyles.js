class GroupStyles {
    #categories;
    constructor() {
        this.#categories = new Map();
    }
    setGroup(group, styleMap) {
        if (group === null || group === undefined || styleMap === null || styleMap === undefined) throw 'GroupStyles:setGroup: group or styleMap is null/undefined';
        if (!styleMapIsValid(styleMap)) throw 'GroupStyles:setGroup: styleMap is not valid:' + styleMap;
        this.#categories.set(group, styleMap);
    }
    hasGroup(group) {
        if (group === null || group === undefined) throw 'GroupStyles:hasGroup: group is null/undefined';
        return this.#categories.has(group);
    }
    getGroup(group) {
        if (group === null || group === undefined) throw 'GroupStyles:getGroup: group is null/undefined';
        return this.#categories.get(group);
    }
    getGroupEntries() {
        return this.#categories.entries();
    }
    clearGroupEntries() {
        this.#categories.clear();
    }
}

function styleMapIsValid(styleMap) {
    for(const [property, value] of styleMap.entries()){
        if(!(property == 'width' || property == 'height')) return false;
        if(!(/^\d+$/.test(value))) return false;
    }
    return true;
}

export default GroupStyles;