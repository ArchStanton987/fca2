import { TouchableOpacity, View } from "react-native"

import { router } from "expo-router"

import Spacer from "components/Spacer"
import Txt from "components/Txt"

import styles from "./ModalCta.styles"

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
      <TouchableOpacity style={[styles.cta, styles.ctaSec]} onPress={onPressCancel}>
        <Txt style={styles.ctaTextSec}>ANNULER</Txt>
      </TouchableOpacity>
      <Spacer x={50} />
      <TouchableOpacity style={styles.cta} onPress={onPressConfirm}>
        <Txt style={styles.ctaText}>CONFIRMER</Txt>
      </TouchableOpacity>
    </View>
  )
}
