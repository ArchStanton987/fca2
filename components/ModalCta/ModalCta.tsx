import { TouchableOpacity, View } from "react-native"

import { router } from "expo-router"

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
      <View style={[styles.line, { flex: 1 }]} />
      <TouchableOpacity style={[styles.cta, styles.ctaSec]} onPress={onPressCancel}>
        <Txt style={styles.ctaTextSec}>ANNULER</Txt>
      </TouchableOpacity>
      <View style={[styles.line, { width: 50 }]} />
      <TouchableOpacity style={styles.cta} onPress={onPressConfirm}>
        <Txt style={styles.ctaText}>CONFIRMER</Txt>
      </TouchableOpacity>
      <View style={[styles.line, { flex: 1 }]} />
    </View>
  )
}
