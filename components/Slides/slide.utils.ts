/* eslint-disable import/prefer-default-export */
import { Platform } from "react-native"

import layout from "styles/layout"

export const getSlideWidth = (width: number) =>
  Platform.OS === "web"
    ? width - layout.drawerWidth - layout.globalPadding - 6
    : width - layout.drawerWidth - layout.globalPadding
