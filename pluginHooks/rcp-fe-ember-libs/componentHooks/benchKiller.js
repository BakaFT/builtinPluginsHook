// Almost whole LCU is constructed by Ember.js coponents

// matcher is the name of the component, you can find it in the source code of RCPs searching "classNames"
// mixin is a Ember.js Mixin(A function that returns an object literal).Mixin is used to add/override properties and methods of a component.
// wraps is a list of hooks, used to hook methods of a component.

// Difference between mixin and wraps:
// mixin is to totally override a function member of component, so you can control the whole function including its arguments and return value
// wrap is to hook a function member, you can not change the internal logic and return value. 


// This is safe because runTask() in these two components is only used to schedule swap cooldowns
// So just set the cooldown timeout to 0 to skip the swap cooldown
export default [
    {
        matcher: 'champion-bench',
        mixin: (Ember, args) => ({}),
        wraps: [
            {
                name: "runTask",
                replacement: function (original, args) {
                    args[1] = 0
                    return original(...args)
                }
            }
        ]
    },
    {
        matcher: 'champion-bench-item',
        mixin: (Ember, args) => ({}),
        wraps: [
            {
                name: "runTask",
                replacement: function (original, args) {
                    args[1] = 0
                    return original(...args)
                }
            }
        ]
    }

];