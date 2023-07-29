/* eslint-disable */

module.exports = function (api) {
  api.cache(true)
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      require.resolve("expo-router/babel"),
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            api: "./api",
            app: "./app",
            assets: "./assets",
            components: "./components",
            containers: "./containers",
            contexts: "./contexts",
            constants: "./constants",
            lang: "./lang",
            hooks: "./hooks",
            models: "./models",
            navigation: "./navigation",
            providers: "./providers",
            screens: "./screens",
            styles: "./styles",
            utils: "./utils"
          }
        }
      ],
      "react-native-reanimated/plugin"
    ]
  }
}
