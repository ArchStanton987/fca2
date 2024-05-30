import Constants from "expo-constants"
import * as Updates from "expo-updates"

export const isDev = Updates.channel === null

export const getVersion = () => {
  if (Constants.expoConfig) {
    return Constants.expoConfig.version
  }
  return Constants.manifest2?.runtimeVersion
}
