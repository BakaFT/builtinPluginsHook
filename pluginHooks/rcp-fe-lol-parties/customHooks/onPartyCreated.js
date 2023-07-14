// You can hook a function member of RCP exported api like this:
export default [
    {
        pluginName: "rcp-fe-lol-parties",
        target: "_partyCreated",
        hook: function (original, args) {
            console.log("partyCreated hooked")
            const gameMode = args[0].gameConfig.gameMode
            const members = args[0].members
            const summonerNames = members.map(x => x.summonerInternalName).join(",")
            // Well you can send messages to your friends through Discord API to tell'em your lobby info
            // "Get up we are wating for you"
            return original(...args)
        }
    }
]