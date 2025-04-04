/* eslint-disable import/prefer-default-export */
import layout from "styles/layout"

export const getSlideWidth = (width: number) =>
  width - layout.drawerWidth - layout.globalPadding * 3
