// Almost whole LCU is constructed by Ember.js coponents, so it's easy to find the component that you want to modify

// matcher is the name of the component, you can find it in the source code of RCPs searching "classNames"
// fun is a Ember.js Mixin, used to modify the component properties
// wraps is a list of hooks, used to modify the component methods


// This is safe because runTask() in these two components is only used to schedule swap cooldowns
// So just set the cooldown timeout to 0 to skip the swap cooldown
export default [
    {
        matcher: 'champion-bench',
        fun: (Ember, args) => {
            return () => { }
        },
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
        fun: (Ember, args) => { return () => { } },
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