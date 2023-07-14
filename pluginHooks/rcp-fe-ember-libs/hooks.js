import { hookEmber } from './util.js'
import COMPONENT_HOOKS_EXPORT from './componentHooks/export.js'

// Add your hooks to this RCP here
export default [
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

// classNames of Ember components that you want to print out in console
// DEBUG use only
export const EMBER_COMPONENT_NEED_PRINT = [
    "champion-bench",
]

// Ember compoent hooks
export const EMBER_COMPONENT_HOOKS = COMPONENT_HOOKS_EXPORT
