import { StyleSheet } from "react-native"

import TxtInput from "components/TxtInput"
import { useDamageEntry, useDamageFormStore } from "providers/DamageFormProvider"

type LocInputProps = {
  entryId: number
}
const styles = StyleSheet.create({
  input: {
    paddingRight: 5
  }
})
export default function LocInput({ entryId }: LocInputProps) {
  const actions = useDamageFormStore(state => state.actions)
  const entry = useDamageEntry(entryId)
  const { localization } = entry

  const setPannelAndSelectEntry = () => {
    actions.setPannel("bodyParts")
    actions.selectEntry(entryId)
  }

  return (
    <TxtInput
      editable={false}
      style={styles.input}
      value={localization}
      onFocus={setPannelAndSelectEntry}
      onPress={setPannelAndSelectEntry}
    />
  )
}
