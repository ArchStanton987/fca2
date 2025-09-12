import { StyleSheet } from "react-native"

import TxtInput from "components/TxtInput"
import { useContenders } from "providers/ContendersProvider"
import { useDamageEntry, useDamageFormStore } from "providers/DamageFormProvider"

type CharInputProps = {
  entryId: number
}
const styles = StyleSheet.create({
  input: {
    paddingRight: 5
  }
})
export default function CharInput({ entryId }: CharInputProps) {
  const actions = useDamageFormStore(state => state.actions)
  const entry = useDamageEntry(entryId)
  const { charId } = entry
  const contender = useContenders(charId)
  const charName = contender?.meta?.firstname ?? ""

  const setPannelAndSelectEntry = () => {
    actions.setPannel("chars")
    actions.selectEntry(entryId)
  }

  return (
    <TxtInput
      editable={false}
      style={styles.input}
      value={charName}
      onFocus={setPannelAndSelectEntry}
      onPress={setPannelAndSelectEntry}
    />
  )
}
