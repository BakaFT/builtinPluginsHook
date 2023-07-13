import { hookEmber } from "./rcp-fe-ember-libs/entry.js"

export const PLUGIN_HOOKS = [
    {
        pluginName: "rcp-fe-ember-libs",
        target: "getEmber",
        hook: function (original, args) {
            const res = original(...args)
            return res.then(
                Ember => {
                    hookEmber(Ember)
                    return Ember
                }
            )
        }

    }
]


