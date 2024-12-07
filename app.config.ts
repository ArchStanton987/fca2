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

const getSlug = () => {
  if (IS_DEV) return "fca2-dev"
  return "fca2"
}

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: getAppName(),
  slug: getSlug(),
  android: { package: getUniqueIdentifier() }
})
