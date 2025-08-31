import { StyleSheet } from "react-native"

import TxtInput from "components/TxtInput"
import { useCombat } from "providers/CombatProvider"
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
  const { npcs, players } = useCombat()
  const contenders = { ...npcs, ...players }
  const entry = useDamageEntry(entryId)
  const { charId } = entry
  const contender = contenders[charId]
  const initHp = contender?.char?.health?.hp ?? 0

  return <TxtInput editable={false} style={styles.input} value={initHp.toString()} />
}
