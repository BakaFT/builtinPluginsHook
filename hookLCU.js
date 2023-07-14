import { wrap_method, BuiltinPlugin } from './util.js'
import RCP_HOOKS from './pluginHooks/pluginHooks.js'

const hookBuiltinPlugin = () => {
    window.builtPlugins = window.builtPlugins || {}
    wrap_method(document, "dispatchEvent", function (original, [event]) {
        if (!event.type.startsWith("riotPlugin.announce:")) {
            original(event)
        } else {
            event.registrationHandler(
                context => {
                    return new Promise(
                        resolve => {
                            const fakeEvent = new CustomEvent(event.type)
                            fakeEvent.errorHandler = event.errorHandler
                            fakeEvent.registrationHandler = handler => {
                                let result = handler(context);
                                result = result && result.then ? result : Promise.resolve(result);
                                result.then(
                                    api => {
                                        const pluginName = event.type.split(":")[1]
                                        window.builtPlugins[pluginName] = api
                                        RCP_HOOKS.forEach(function (pluginHook) {
                                            if (pluginHook.pluginName === pluginName) {
                                                wrap_method(api, pluginHook.target, pluginHook.hook)
                                            }
                                        })
                                        resolve(api)
                                    }
                                )
                            }
                            original(fakeEvent)
                        }
                    )
                }
            )
        }
    })

}





export const hookLcu = () => {
    hookBuiltinPlugin()
}
