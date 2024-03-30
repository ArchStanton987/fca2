import { StyleSheet, View } from "react-native"

import { router } from "expo-router"

import Spacer from "components/Spacer"
import Txt from "components/Txt"
import RevertColorsPressable from "components/wrappers/RevertColorsPressable/RevertColorsPressable"
import colors from "styles/colors"

const styles = StyleSheet.create({
  ctaContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15
  },
  cta: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.secColor,
    borderWidth: 1,
    borderColor: colors.secColor,
    paddingVertical: 12,
    width: 120
  },
  horizLine: {
    position: "absolute",
    width: "100%",
    height: 1,
    backgroundColor: colors.secColor
  },
  ctaText: {
    color: colors.primColor
  },
  ctaSec: {
    backgroundColor: colors.primColor
  },
  ctaTextSec: {
    color: colors.secColor
  }
})

type ModalCtaProps = {
  onPressCancel?: () => void
  onPressConfirm: () => void
}

export default function ModalCta({
  onPressConfirm,
  onPressCancel = () => router.back()
}: ModalCtaProps) {
  return (
    <View style={styles.ctaContainer}>
      <View style={styles.horizLine} />
      <RevertColorsPressable style={[styles.cta, styles.ctaSec]} onPress={onPressCancel}>
        <Txt style={styles.ctaTextSec}>ANNULER</Txt>
      </RevertColorsPressable>
      <Spacer x={50} />
      <RevertColorsPressable style={styles.cta} onPress={onPressConfirm}>
        <Txt style={styles.ctaText}>CONFIRMER</Txt>
      </RevertColorsPressable>
    </View>
  )
}
