import { PressableProps } from "react-native"

import combatModsMap from "lib/character/combat/combat-mods"
import { Clothing } from "lib/objects/data/clothings/clothings.types"
import Toast from "react-native-toast-message"

import DeleteInput from "components/DeleteInput"
import EquipInput from "components/EquipInput"
import ListLabel from "components/ListLabel"
import ListScoreLabel from "components/ListScoreLabel"
import Selectable from "components/Selectable"
import Spacer from "components/Spacer"
import { useCharacter } from "contexts/CharacterContext"
import { useGetUseCases } from "providers/UseCasesProvider"

type ClothingRowProps = PressableProps & {
  clothing: Clothing
  isSelected: boolean
  onPress: () => void
}

export default function ClothingRow({ clothing, isSelected, onPress, ...rest }: ClothingRowProps) {
  const useCases = useGetUseCases()

  const character = useCharacter()
  const { isEquiped, data } = clothing
  const {
    label,
    physicalDamageResist,
    laserDamageResist,
    fireDamageResist,
    plasmaDamageResist,
    malus
  } = data

  const handleEquip = async () => {
    try {
      await useCases.equipedObjects.toggle(character, clothing)
    } catch (err: any) {
      if (err?.message) {
        Toast.show({ type: "custom", text1: err.message })
      }
    }
  }

  const physResist = `${physicalDamageResist}${combatModsMap.physicalDamageResist.unit}`
  const lasResist = `${laserDamageResist}${combatModsMap.laserDamageResist.unit}`
  const fireResist = `${fireDamageResist}${combatModsMap.laserDamageResist.unit}`
  const plasmaResist = `${plasmaDamageResist}${combatModsMap.laserDamageResist.unit}`

  return (
    <Selectable isSelected={isSelected} onPress={onPress} {...rest}>
      <EquipInput isChecked={isEquiped} isParentSelected={isSelected} onPress={handleEquip} />
      <Spacer x={10} />
      <ListLabel label={label} />
      <Spacer x={5} />
      <ListScoreLabel score={physResist} />
      <Spacer x={5} />
      <ListScoreLabel score={lasResist} />
      <Spacer x={5} />
      <ListScoreLabel score={fireResist} />
      <Spacer x={5} />
      <ListScoreLabel score={plasmaResist} />
      <Spacer x={5} />
      <ListScoreLabel score={malus} />
      <Spacer x={5} />
      <DeleteInput
        isSelected={isSelected}
        onPress={() => useCases.inventory.throw(character.charId, clothing)}
      />
    </Selectable>
  )
}
