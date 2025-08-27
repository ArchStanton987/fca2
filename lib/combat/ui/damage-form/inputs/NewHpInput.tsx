import { StyleSheet } from "react-native"

import TxtInput from "components/TxtInput"
import { useCombat } from "providers/CombatProvider"
import { useDamageEntry, useDamageFormStore } from "providers/DamageFormProvider"

type NewHpInputProps = {
  entryId: number
}
const styles = StyleSheet.create({
  input: {
    paddingRight: 5
  }
})
export default function NewHpInput({ entryId }: NewHpInputProps) {
  const { npcs, players } = useCombat()
  const contenders = { ...npcs, ...players }
  const actions = useDamageFormStore(state => state.actions)
  const entry = useDamageEntry(entryId)
  const { charId, damage = 0 } = entry
  const contender = contenders[charId]
  const currHp = contender?.char?.health?.hp ?? 0
  const newHp = currHp - damage

  const setPannelAndSelectEntry = () => {
    actions.setPannel("bodyParts")
    actions.selectEntry(entryId)
  }

  return (
    <TxtInput
      editable={false}
      style={styles.input}
      value={newHp?.toString()}
      onFocus={setPannelAndSelectEntry}
      onPress={setPannelAndSelectEntry}
    />
  )
}
