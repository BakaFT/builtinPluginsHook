import { EMBER_COMPONENT_HOOKS,EMBER_COMPONENT_NEED_PRINT} from "./hooks.js";
import { wrap_method } from "../../util.js";

export const hookEmber = (Ember) => {
    wrap_method(Ember.Component, 'extend', function (original, args) {
        let res = original(...args)
        const name = args.filter(x => (typeof x === "object") && x.classNames && Array.isArray(x.classNames)).map(x => x.classNames.join(" "));
        if (name.length) {
            EMBER_COMPONENT_HOOKS.filter(x => x.matcher === name[0]).forEach(hook => {
                const Mixin = hook.mixin(Ember, args);
                if (Mixin) {
                    res = res.extend(Mixin);
                    hook.wraps.forEach(wrap => {
                        wrap_method(res.proto(), wrap.name, wrap.replacement)
                    })
                    if (EMBER_COMPONENT_NEED_PRINT.includes(hook.matcher)) {
                        console.log(hook.matcher, res.proto())
                    }
                }
            });
        }
        return res;
    })
}