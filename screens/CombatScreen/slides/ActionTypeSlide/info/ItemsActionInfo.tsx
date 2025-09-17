import { StyleSheet, View } from "react-native"

import Playable from "lib/character/Playable"
import Inventory from "lib/objects/Inventory"

import List from "components/List"
import ListItemSelectable from "components/ListItemSelectable"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"
import { useInventory } from "contexts/InventoryContext"
import {
  useActionActorId,
  useActionApi,
  useActionItemDbKey,
  useActionSubtype
} from "providers/ActionFormProvider"
import { useContenders } from "providers/ContendersProvider"
import colors from "styles/colors"

const getItemList = (
  actionSubtype: string,
  char: Playable,
  inventory: Inventory
): { title: string; data: any[] }[] => {
  switch (actionSubtype) {
    case "drop":
      return [
        { title: "Armes", data: char.equipedObjects.weapons },
        { title: "Equipements", data: char.equipedObjects.clothings }
      ]
    case "equip":
      return [
        { title: "Armes", data: inventory.weapons.filter(w => !w.isEquiped) },
        { title: "Equipements", data: inventory.clothings.filter(c => !c.isEquiped) }
      ]
    case "unequip":
      return [
        { title: "armes", data: char.equipedObjects.weapons },
        { title: "équipements", data: char.equipedObjects.clothings }
      ]
    case "use":
      return [{ title: "consommables", data: inventory.groupedConsumables }]
    case "throw":
      return [
        { title: "armes", data: inventory.weapons },
        { title: "équipements", data: inventory.clothings },
        { title: "consommables", data: inventory.groupedConsumables },
        { title: "divers", data: inventory.groupedMiscObjects }
      ]
    case "pickUp":
      return [{ title: "ajouter", data: [] }]
    default:
      return []
  }
}

const styles = StyleSheet.create({
  sectionTitle: {
    borderWidth: 2,
    borderColor: colors.secColor,
    textAlign: "center"
  }
})

export default function ItemsActionInfo() {
  const inventory = useInventory()
  const { charId } = useCharacter()

  const { setForm } = useActionApi()
  const formActorId = useActionActorId()
  const actionSubtype = useActionSubtype()
  const itemDbKey = useActionItemDbKey()

  const actorId = formActorId === "" ? charId : formActorId
  const contender = useContenders(actorId)

  const onPressItem = (dbKey: string) => {
    setForm({ itemDbKey: dbKey })
  }

  const itemLists = getItemList(actionSubtype, contender, inventory)

  return (
    <View>
      <List
        data={itemLists}
        keyExtractor={el => el.title}
        renderItem={el => (
          <>
            <Spacer y={10} />
            <Txt style={styles.sectionTitle}>{el.item.title.toUpperCase()}</Txt>
            <Spacer y={10} />
            <List
              data={el.item.data}
              keyExtractor={item => item.dbKey}
              renderItem={({ item }) => (
                <ListItemSelectable
                  isSelected={itemDbKey === item.dbKey}
                  label={"count" in item ? `${item.data.label}(${item.count})` : item.data.label}
                  onPress={() => onPressItem(item.dbKey)}
                />
              )}
            />
          </>
        )}
      />
    </View>
  )
}
