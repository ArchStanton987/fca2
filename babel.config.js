/* eslint-disable */

module.exports = function (api) {
  api.cache(true)
  return {
    presets: ["babel-preset-expo"],
    plugins: [
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
            db: "./db",
            lang: "./lang",
            lib: "./lib",
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
