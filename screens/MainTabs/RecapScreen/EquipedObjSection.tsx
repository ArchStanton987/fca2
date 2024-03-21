import { View } from "react-native"

import { observer } from "mobx-react-lite"

import CheckBox from "components/CheckBox/CheckBox"
import Section from "components/Section"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"
import { useInventory } from "contexts/InventoryContext"

function EquipedObjSection() {
  const character = useCharacter()
  const inventory = useInventory()
  const { equipedObjects, currSecAttr } = character
  const { weapons, clothings } = equipedObjects
  const { currPlace, currWeight } = inventory.currentCarry

  return (
    <View style={{ flex: 1 }}>
      <Section style={{ paddingHorizontal: 10, flex: 1 }}>
        <Txt>ARMES EQUIPEES</Txt>
        <Spacer y={10} />
        {weapons.map(weapon => (
          <View
            key={weapon.dbKey}
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <CheckBox isChecked />
            <Txt>{weapon.data.label}</Txt>
          </View>
        ))}
      </Section>
      <Spacer y={10} />
      <Section style={{ paddingHorizontal: 10, flex: 1 }}>
        <Txt>ARMURES EQUIPEES</Txt>
        <Spacer y={10} />
        {clothings.map(cloth => (
          <View key={cloth.dbKey} style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <CheckBox isChecked />
            <Txt>{cloth.data.label}</Txt>
          </View>
        ))}
      </Section>
      <Spacer y={10} />
      <Section style={{ paddingHorizontal: 10, flex: 1 }}>
        <Txt>
          POIDS: {currWeight}{" "}
          {`(${currSecAttr?.normalCarryWeight}/${currSecAttr?.tempCarryWeight}/${currSecAttr?.maxCarryWeight})`}
        </Txt>
      </Section>
      <Spacer y={10} />
      <Section style={{ paddingHorizontal: 10, flex: 1 }}>
        <Txt>
          PLACE: {currPlace}/{currSecAttr?.maxPlace || "-"}
        </Txt>
      </Section>
    </View>
  )
}

export default observer(EquipedObjSection)
