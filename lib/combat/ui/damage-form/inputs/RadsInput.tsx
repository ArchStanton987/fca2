import { StyleSheet } from "react-native"

import TxtInput from "components/TxtInput"
import { useDamageEntry, useDamageFormActions } from "providers/DamageFormProvider"

type RadsInputProps = {
  entryId: number
}
const styles = StyleSheet.create({
  input: {
    paddingRight: 5
  }
})
export default function RadsInput({ entryId }: RadsInputProps) {
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
        actions.setEntry("amount", e)
      }}
      onFocus={selectEntry}
      onPress={selectEntry}
    />
  )
}
