import { wrap_method, BuiltinPlugin } from './util.js'
import RCP_HOOKS from './pluginHooks/pluginHooks.js'

const hookBuiltinPlugin = () => {
    window.builtinPlugins = window.builtinPlugins || {}
    wrap_method(document, "dispatchEvent", function (original, [event]) {
        if (event.type.startsWith("riotPlugin.announce:")) {
            const originalHandler = event.registrationHandler
            event.registrationHandler = function (registrar) {
                originalHandler(async (context) => {
                    const api = await registrar(context)
                    const pluginName = event.type.split(":")[1]
                    window.builtinPlugins[pluginName] = api
                    RCP_HOOKS.forEach(function (pluginHook) {
                        if (pluginHook.pluginName === pluginName) {
                            wrap_method(api, pluginHook.target, pluginHook.hook)
                        }
                    })
                    console.log(api)
                    return api;
                })
            }
        }
        original(event)

    })

}





export const hookLcu = () => {
    hookBuiltinPlugin()
}
