import { StyleSheet } from "react-native"

import TxtInput from "components/TxtInput"
import { useContenders } from "providers/ContendersProvider"
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
  const contender = useContenders(charId)
  const initHp = contender?.health?.hp ?? 0

  return <TxtInput editable={false} style={styles.input} value={initHp.toString()} />
}
