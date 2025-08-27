import { StyleSheet } from "react-native"

import TxtInput from "components/TxtInput"
import { useDamageEntry, useDamageFormActions } from "providers/DamageFormProvider"

type DurationInputProps = {
  entryId: number
}
const styles = StyleSheet.create({
  input: {
    paddingRight: 5
  }
})
export default function DurationInput({ entryId }: DurationInputProps) {
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
        actions.setEntry("duration", e)
      }}
      onFocus={selectEntry}
      onPress={selectEntry}
    />
  )
}
