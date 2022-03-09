import GroupStyles from './groupStyles.js';
import IndividualEntries from './individualEntries.js';

class Data {
    #individualEntries;
    #groupStyles;
    constructor() {
        this.#individualEntries = new IndividualEntries();
        this.#groupStyles = new GroupStyles();
    }

    //Group Styles Wrapper
    setGroup(group, styleMap) {
        this.#groupStyles.setGroup(group, styleMap);
    }
    hasGroup(group) {
        return this.#groupStyles.hasGroup(group);
    }
    getGroup(group) {
        return this.#groupStyles.getGroup(group);
    }
    getGroupEntries() {
        return this.#groupStyles.getGroupEntries();
    }
    clearGroupEntries() {
        this.#groupStyles.clearGroupEntries();
    }

    //Individual Entries Wrapper
    setIndividualEntry(entryKey, styleMap, row, col, val) {
        this.#individualEntries.setEntry(entryKey, styleMap, row, col, val);
    }
    hasIndividualEntry(entryKey) {
        return this.#individualEntries.hasEntry(entryKey);
    }
    getIndividualEntry(entryKey) {
        return this.#individualEntries.getEntry(entryKey);
    }
    getIndividualEntries() {
        return this.#individualEntries.getEntries();
    }
    clearIndividualEntries() {
        this.#individualEntries.clear();
    }
}

export default Data;