/* eslint-disable import/prefer-default-export */
import { View } from "react-native"

import { ToastData } from "react-native-toast-message"

import Txt from "components/Txt"
import colors from "styles/colors"

export const toastConfig = {
  custom: (props: ToastData) => (
    <View
      style={{
        borderWidth: 6,
        borderColor: colors.secColor,
        backgroundColor: colors.primColor,
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        width: 300
      }}
    >
      <Txt style={{ color: colors.secColor, textAlign: "center" }}>{props.text1}</Txt>
    </View>
  )
}
