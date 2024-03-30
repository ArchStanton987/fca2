import React from "react"
import { TextInput } from "react-native"

import colors from "styles/colors"

export default function TxtInput({ ...rest }) {
  return (
    <TextInput
      style={{
        padding: 5,
        paddingRight: 30,
        backgroundColor: colors.terColor,
        color: colors.secColor,
        fontFamily: "monofonto"
      }}
      {...rest}
    />
  )
}
