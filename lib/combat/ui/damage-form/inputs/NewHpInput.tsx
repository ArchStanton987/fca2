import { StyleSheet } from "react-native"

import { useHealth } from "lib/character/health/health-provider"

import TxtInput from "components/TxtInput"
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
  const actions = useDamageFormStore(state => state.actions)
  const entry = useDamageEntry(entryId)
  const { charId, damage = 0 } = entry
  const { data: currHp = 0 } = useHealth(charId, h => h.currHp)
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
