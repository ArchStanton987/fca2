import { useGMDamageForm } from "lib/combat/gm-damage-store"

import TxtInput from "components/TxtInput"
import { useCombat } from "providers/CombatProvider"

import styles from "./DamageForm.styles"

type CharNameProps = {
  charId: string
  entryId: string
}

export default function CharName({ charId, entryId }: CharNameProps) {
  const { players, npcs } = useCombat()
  const contenders = { ...players, ...npcs }
  const contender = contenders[charId]
  const charName = contender?.char?.meta?.firstname ?? ""

  const setPannel = useGMDamageForm(state => state.setPannel)
  const selectEntry = useGMDamageForm(state => state.selectEntry)

  return (
    <TxtInput
      style={styles.input}
      editable={false}
      value={charName}
      onFocus={e => {
        e.preventDefault()
        setPannel("chars")
        selectEntry(entryId)
      }}
      onPress={e => {
        e.preventDefault()
        setPannel("chars")
        selectEntry(entryId)
      }}
    />
  )
}
