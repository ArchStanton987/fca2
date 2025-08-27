import { StyleSheet } from "react-native"

import TxtInput from "components/TxtInput"
import { useDamageEntry, useDamageFormActions } from "providers/DamageFormProvider"

type DmgInputProps = {
  entryId: number
}
const styles = StyleSheet.create({
  input: {
    paddingRight: 5
  }
})
export default function DmgInput({ entryId }: DmgInputProps) {
  const actions = useDamageFormActions()
  const entry = useDamageEntry(entryId)

  const selectEntry = () => {
    actions.selectEntry(entryId)
  }

  return (
    <TxtInput
      style={styles.input}
      value={entry?.damage?.toString()}
      onChangeText={e => {
        actions.setEntry("damage", e)
      }}
      onFocus={selectEntry}
      onPress={selectEntry}
    />
  )
}
