import { ExpoConfig } from "expo/config"

const IS_PREVIEW = process.env.APP_VARIANT === "preview"
const IS_DEV = !IS_PREVIEW

const getUniqueIdentifier = () => {
  if (IS_DEV) return "com.archstanton987.fca2.dev"
  return "com.archstanton987.fca2"
}

const getAppName = () => {
  if (IS_DEV) return "FCA(Dev)"
  return "Fallout Companion App"
}

export default (): ExpoConfig => ({
  name: getAppName(),
  slug: "fca2",
  scheme: "fca2",
  version: "3.0.1",
  orientation: "landscape",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  backgroundColor: "#021000",
  primaryColor: "#021000",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#021000"
  },
  newArchEnabled: true,
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    buildNumber: "3.0.1"
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#021000"
    },
    package: getUniqueIdentifier(),
    versionCode: 540030001
  },
  androidStatusBar: {
    hidden: true
  },
  androidNavigationBar: {
    backgroundColor: "#021000"
  },
  web: {
    favicon: "./assets/favicon.png",
    bundler: "metro",
    backgroundColor: "#021000"
  },
  plugins: ["expo-router"],
  extra: {
    router: {
      origin: false
    },
    eas: {
      projectId: "56bb3475-f8d1-4161-a940-9b7e02dc5cf0"
    }
  },
  runtimeVersion: {
    policy: "appVersion"
  },
  updates: {
    url: "https://u.expo.dev/56bb3475-f8d1-4161-a940-9b7e02dc5cf0"
  },
  experiments: {
    typedRoutes: true
  }
})
