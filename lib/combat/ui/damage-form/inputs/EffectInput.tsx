import { StyleSheet } from "react-native"

import TxtInput from "components/TxtInput"
import { useDamageEntry, useDamageFormStore } from "providers/DamageFormProvider"

type EffectInputProps = {
  entryId: number
}
const styles = StyleSheet.create({
  input: {
    paddingRight: 5
  }
})
export default function EffectInput({ entryId }: EffectInputProps) {
  const actions = useDamageFormStore(state => state.actions)
  const entry = useDamageEntry(entryId)
  const { effectId } = entry

  const setPannelAndSelectEntry = () => {
    actions.setPannel("effects")
    actions.selectEntry(entryId)
  }

  return (
    <TxtInput
      editable={false}
      style={styles.input}
      value={effectId}
      onFocus={setPannelAndSelectEntry}
      onPress={setPannelAndSelectEntry}
    />
  )
}
