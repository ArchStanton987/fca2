import { ConfigContext, ExpoConfig } from "expo/config"

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

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: getAppName(),
  android: { package: getUniqueIdentifier() },
  slug: "fca2"
})
