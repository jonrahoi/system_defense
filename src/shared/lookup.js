/*
 * Meant to be a collection of convenience functions for accessing objects/values
 * stored in config or assets. Essentially provides functionality to retrieve
 * a specific value or cumulative ones from `components.js`, `levels.js`, and
 * `assets/`
 * 
 * This may add unnecessary complications...
 */


import componentDefs from "../../config/components.js";
import levelDefs from "../../config/levels.js";
import assetDirectory from "../assets/assetDirectory.js";


export const findAsset = (name, rootPath) => {
    rootPath = rootPath || '';
    let res = lookup(assetDirectory, name);
    return res ? (rootPath + res) : res;
};
export const assetEntries = (depth, rootPath) => {
    rootPath = rootPath || '';
    var values = {};
    entries(assetDirectory, (depth || 0), values);
    for (var key in values) {
        if (typeof values[key] != 'object') {
            values[key] = rootPath + values[key];
        }
    }
    return values;
};

export const findComponent = (name, rootPath) => {
    let res = lookup(componentDefs, name);
    if (!res) { return undefined; }
    let copy = Object.assign({}, res);
    if (rootPath) {
        if (copy.hasOwnProperty('image')) {
            copy.image = rootPath + copy.image;
        }
        if (copy.hasOwnProperty('icon')) {
            copy.icon = rootPath + copy.icon;
        }
    }
    return copy;
};
export const componentEntries = (depth, rootPath) => {
    rootPath = rootPath || '';
    var values = {};
    entries(componentDefs, (depth || 0), values);
    if (!values) { return undefined; }
    let copy = Object.assign({}, values);
    for (var key in copy) {
        if (typeof copy[key] != 'object') {
            copy[key] = rootPath + copy[key];
        } else {
            if (copy[key].hasOwnProperty('image')) {
                copy[key].image = rootPath + copy[key].image;
            }
            if (copy[key].hasOwnProperty('icon')) {
                copy[key].icon = rootPath + copy[key].icon;
            }
        }
    }
    return copy;
};

export const findLevel = (number) => lookup(levelDefs, number);
export const levelEntries = (depth) => {
    var values = {};
    entries(levelDefs, (depth || 0), values);
    return values;
}

// Recursive so easiest to have wrappers
const lookup = (object, target) => {
    if(object.hasOwnProperty(target)) { return object[target]; }
    
    for (const [key, value] of Object.entries(object)) {
        if(typeof value == "object"){
            var o = lookup(value, target);
            if(o != null)
            return o;
        }
    }
};


const entries = (object, level, acc={}) => {
    if (level < 0) { return; }
    
    var temp = level - 1;
    for (const [key, value] of Object.entries(object)) {
        if(level != 0 && typeof value == "object"){
            entries(value, temp, acc);
        } else {
            acc[key] = value;
        }
    }
};