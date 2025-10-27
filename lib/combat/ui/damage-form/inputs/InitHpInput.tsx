import { StyleSheet } from "react-native"

import { useHealth } from "lib/character/health/health-provider"

import TxtInput from "components/TxtInput"
import { useDamageEntry } from "providers/DamageFormProvider"

type InitHpInputProps = {
  entryId: number
}
const styles = StyleSheet.create({
  input: {
    paddingRight: 5
  }
})
export default function InitHpInput({ entryId }: InitHpInputProps) {
  const entry = useDamageEntry(entryId)
  const { charId } = entry
  const { data: currHp = 0 } = useHealth(charId, h => h.currHp)

  return <TxtInput editable={false} style={styles.input} value={currHp.toString()} />
}
