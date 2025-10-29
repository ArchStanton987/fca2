import { PressableProps } from "react-native"

import combatModsMap from "lib/combat/combat-mods"
import { useItem } from "lib/inventory/use-sub-inv-cat"
import Toast from "react-native-toast-message"

import DeleteInput from "components/DeleteInput"
import EquipInput from "components/EquipInput"
import ListLabel from "components/ListLabel"
import ListScoreLabel from "components/ListScoreLabel"
import Selectable from "components/Selectable"
import Spacer from "components/Spacer"
import { useCollectiblesData } from "providers/AdditionalElementsProvider"
import { useGetUseCases } from "providers/UseCasesProvider"

type ClothingRowProps = PressableProps & {
  itemKey: string
  charId: string
  isSelected: boolean
  onPress: () => void
}

export default function ClothingRow({ itemKey, charId, isSelected, onPress }: ClothingRowProps) {
  const useCases = useGetUseCases()

  const { clothings } = useCollectiblesData()

  const { data: item } = useItem(charId, itemKey)

  if (item.category !== "clothings") throw new Error("Item is not clothing")

  const {
    label,
    physicalDamageResist,
    laserDamageResist,
    fireDamageResist,
    plasmaDamageResist,
    malus
  } = clothings[item.id]

  const handleEquip = async () => {
    try {
      await useCases.character.toggleEquip({ charId, itemDbKey: itemKey })
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
    <Selectable isSelected={isSelected} onPress={onPress}>
      <EquipInput isChecked={item.isEquipped} isParentSelected={isSelected} onPress={handleEquip} />
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
        onPress={() => useCases.inventory.drop({ charId, item })}
      />
    </Selectable>
  )
}
