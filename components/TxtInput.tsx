import React from "react"
import { TextInput, TextInputProps } from "react-native"

import colors from "styles/colors"

export default function TxtInput({ style, ...rest }: TextInputProps) {
  return (
    <TextInput
      style={[
        {
          padding: 5,
          backgroundColor: colors.terColor,
          color: colors.secColor,
          height: 30,
          fontFamily: "monofonto"
        },
        style
      ]}
      {...rest}
    />
  )
}
