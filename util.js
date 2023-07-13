const WRAPPED = Symbol("wrapped");

export function wrap_method(container, name, replacement) {
    if (!container || typeof container[name] !== "function") return;
    if (container[name][WRAPPED]) return;
    const old = container[name];

    container[name] = function(...args) {
        return replacement.call(this, (...a) => old && old.apply(this, a), args);
    };
    container[name][WRAPPED] = true;
}

export class BuiltinPlugin {
    constructor(name,api) {
        this.name = name
        this.api = api
    }
  }
 

