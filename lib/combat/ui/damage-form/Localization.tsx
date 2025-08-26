import { useGMDamageForm } from "lib/combat/gm-damage-store"

import TxtInput from "components/TxtInput"

import styles from "./DamageForm.styles"

type LocalizationProps = {
  entryId: string
}

export default function Localization({ entryId }: LocalizationProps) {
  const setPannel = useGMDamageForm(state => state.setPannel)
  const selectEntry = useGMDamageForm(state => state.selectEntry)
  const entries = useGMDamageForm(state => state.entries)

  return (
    <TxtInput
      style={styles.input}
      editable={false}
      value={entries[entryId].localization}
      onFocus={e => {
        e.preventDefault()
        setPannel("bodyParts")
        selectEntry(entryId)
      }}
      onPress={e => {
        e.preventDefault()
        setPannel("bodyParts")
        selectEntry(entryId)
      }}
    />
  )
}
