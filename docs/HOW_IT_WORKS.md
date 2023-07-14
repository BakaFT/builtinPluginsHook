# How it works

The League Client Update(LCU) is consisted of lots of  `Riot Client Plugin`s, which is known `RCP` under your `LeagueClient/Plugins` folder.

RCPs are loaded when launching LCU, that's when we hook them.

**This is a limited comprehension based on the uglified source codes of RCPs**

## How LCU loads RCPs

Basically every Riot Client Plugin(rcp) is loaded by`rcp-fe-plugin-runner`through `CustomEvent `.

From `rcp-fe-plugin-runner.js`we can guess the steps to load a RCP:

1. Announce
2. Preinit
3. Postinit

### Announce

1. Find all RCPs from game folder, resolve the dependency graph(Loading order,which is important,talk later), and ready to announce them.

2. Append the javascript file of a RCP to `<head/>` node of HTML, then it's preset `onload` function will be triggered when creating.

   (see `_addChildrenToHead` of `rcp-fe-plugin-runner.js`)

3. On triggering `onload`, `scriptLoadedHandler` function will be called, to initialize a `CustomEvent` with a unique event type(e.g. `riotPlugin.announce:rcp-fe-ember-libs`)will be sent to `document` through `dispatchEvent` method

   (see `scriptLoadedHandler` of  `rcp-fe-plugin-runner.js`)


4. This `CustomEvent` with it's own RCP name will be only caught by it's own DOM node created in Step 2 due to it's unique event type

5. Every RCP that aim to be loaded will call `addEventListener(event,listener)` to catch its own `CustomEvent`. And in the `listener` function it initialize itself by calling `t.registrationHandler`

   Let's take `rcp-fe-lol-kickout.js` as example, you can find the call at the end of the file.

   ```javascript
   // a = "riotPlugin.announce:rcp-fe-lol-kickout"
   n.addEventListener(a, (function(t) {
       (0,
       // Remark 1 👇
       t.registrationHandler)(
           // Remark 2 👇
           (function(t) {
           return e.default.init(t, {
               dataBinding: t=>t.get("rcp-fe-common-libs").getDataBinding("rcp-fe-lol-kickout"),
               logger: t=>t.get("rcp-fe-common-libs").logging.create(o),
               tra: t=>t.get("rcp-fe-lol-l10n").tra().overlay("/fe/lol-l10n/trans.json"),
               uiKitPlugin: t=>t.get("rcp-fe-lol-uikit")
           }).then((function() {
               return (0,
               i(3).default)()
           }
           ))
       }
       ))
   }
   ), {
       once: !0
   })
   ```

    Be careful. The first `t` is event itself, see [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#the_event_listener_callback) to get to know why

   The second` t` is the context of this RCP, you can see its schema [here](./kick_context.json)

## Preinit

WIP

## Postinit

WIP

# What we do


   1. We replace `document.dispatchEvent`with out own version (see`hookLCU.js` Line 5) to catch `riotPlugin.announce:` events before they were dispatched.

   2. (See **Remark 1** in step5 codes) We call `event.registrationHandler` manually instead of triggering by `onload`.We pass our arrow function to it (See `hookLCU.js` Line 10,  `context=>{...}` is what we passed into).  

      ```javascript
      // this function **receives a function** 
      // and replace RCP initialize function with what it receives. 
      o.registrationHandler = t =>{
          e({
              // So now RCP's general init function has changed
              
      		// BTW this init functions takes one param, i.e. context.
              // u can find it by searching "Promise.resolve(e.init(t))" in plugin-runner source code
              init: t,
              destroy: ()=>{}
          })
      }
      ```

   3. So when initializing this RCP will jump into our arrow function now, which means we can catch `context`now

      The essential part of hooking is to behave like the original, so next we are going to dispatch a event in arrow function, as well as doing hooks.

   4. We build a `CustomEvent` from scratch, trying to be the same with `event` we hooked with minimal codes

      ```javascript
      context => {
          // RCP's general init function returns a promise so just micmic it.
          return new Promise(
              resolve => {
                  const fakeEvent = new CustomEvent(event.type)
                  fakeEvent.errorHandler = event.errorHandler
                  // Here we replac registrationHandler, not to call it
                  // So we can catch the original anonymous function(as handler below) passed into registrationHandler() in Step 5(See Remark 2)
      
                  fakeEvent.registrationHandler = handler => {
                      // This anonymous func takes exactyle a "context" as only param and returns what it exports.
                      let result = handler(context);
                      result = result && result.then ? result : Promise.resolve(result);
                      result.then(
                          // So this is the apis of this RCP, finally got it
                          // You can just print it by console.log to have a look
                          // And hooking is just easy if U have understand what we've done
                          api => {
                              const pluginName = event.type.split(":")[1]
                              PLUGIN_HOOKS.forEach(function (pluginHook) {
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
      ```
      
   5. Now you got APIs of RCPs, and initialized them just like nothing changed. You made it.