import { View } from "react-native"

import { useNavigation } from "@react-navigation/native"

import Spacer from "components/Spacer"
import Txt from "components/Txt"
import RevertColorsPressable from "components/wrappers/RevertColorsPressable/RevertColorsPressable"
import colors from "styles/colors"

import styles from "./ModalCta.styles"

type ModalCtaProps = {
  onPressCancel?: () => void
  onPressConfirm: () => void
}

export default function ModalCta({ onPressConfirm, onPressCancel }: ModalCtaProps) {
  const navigation = useNavigation()

  const cancel = () => {
    if (onPressCancel) {
      onPressCancel()
    } else {
      navigation.goBack()
    }
  }

  return (
    <View style={styles.ctaContainer}>
      <View style={styles.horizLine} />
      <RevertColorsPressable
        style={[styles.cta, styles.ctaSec]}
        initAnimColor={colors.primColor}
        endAnimColor={colors.secColor}
        onPress={cancel}
      >
        <Txt style={styles.ctaTextSec}>ANNULER</Txt>
      </RevertColorsPressable>
      <Spacer x={50} />
      <RevertColorsPressable
        style={styles.cta}
        initAnimColor={colors.secColor}
        endAnimColor={colors.primColor}
        onPress={onPressConfirm}
      >
        <Txt style={styles.ctaText}>CONFIRMER</Txt>
      </RevertColorsPressable>
    </View>
  )
}
