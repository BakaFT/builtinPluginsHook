export const EMBER_COMPONENT_NEED_PRINT = []

export const EMBER_COMPONENT_HOOKS = [
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