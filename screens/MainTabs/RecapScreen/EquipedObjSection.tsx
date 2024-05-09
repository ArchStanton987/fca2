import { View } from "react-native"

import { observer } from "mobx-react-lite"

import Section from "components/Section"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"
import { useInventory } from "contexts/InventoryContext"

import { getPlaceColor, getWeightColor } from "./EquipedObjSection.utils"
import styles from "./RecapScreen.styles"

function EquipedObjSection() {
  const character = useCharacter()
  const inventory = useInventory()
  const { equipedObjects, secAttr } = character
  const { normalCarryWeight, tempCarryWeight, maxCarryWeight, maxPlace } = secAttr.curr
  const { weapons, clothings } = equipedObjects
  const { currPlace, currWeight } = inventory.currentCarry

  return (
    <View style={{ flex: 1 }}>
      <Section style={{ paddingHorizontal: 10 }}>
        <View style={styles.equObjRow}>
          <Txt style={{ color: getWeightColor(currWeight, secAttr.curr) }}>POIDS: {currWeight}</Txt>
          <Txt>{`(${normalCarryWeight}/${tempCarryWeight}/${maxCarryWeight})`}</Txt>
        </View>
        <Spacer y={10} />
        <View style={styles.equObjRow}>
          <Txt style={{ color: getPlaceColor(currPlace, maxPlace) }}>PLACE: {currPlace}</Txt>
          <Txt>/{maxPlace || "-"}</Txt>
        </View>
      </Section>
      <Spacer y={10} />
      <Section style={{ paddingHorizontal: 10, flex: 1 }}>
        <Txt>ARMES EQUIPES</Txt>
        <Spacer y={10} />
        {weapons.map(weapon => (
          <View key={weapon.dbKey} style={styles.equObjRow}>
            <Txt>- {weapon.data.label}</Txt>
          </View>
        ))}
        <Spacer y={10} />
        <Txt>ARMURES EQUIPES</Txt>
        <Spacer y={10} />
        {clothings.map(cloth => (
          <View key={cloth.dbKey} style={styles.equObjRow}>
            <Txt>- {cloth.data.label}</Txt>
          </View>
        ))}
      </Section>
    </View>
  )
}

export default observer(EquipedObjSection)
