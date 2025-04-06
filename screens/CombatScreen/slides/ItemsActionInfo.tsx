import { StyleSheet, View } from "react-native"

import Character from "lib/character/Character"
import Inventory from "lib/objects/Inventory"

import List from "components/List"
import ListItemSelectable from "components/ListItemSelectable"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"
import { useInventory } from "contexts/InventoryContext"
import { useActionApi, useActionForm } from "providers/ActionProvider"
import colors from "styles/colors"

const getItemList = (
  actionSubtype: string,
  inventory: Inventory,
  equipedObjects: Character["equipedObjects"]
): { title: string; data: any[] }[] => {
  switch (actionSubtype) {
    case "drop":
      return [
        { title: "Armes", data: equipedObjects.weapons },
        { title: "Equipements", data: equipedObjects.clothings }
      ]
    case "equip":
      return [
        { title: "Armes", data: inventory.weapons },
        { title: "Equipements", data: inventory.clothings }
      ]
    case "unequip":
      return [
        { title: "armes", data: equipedObjects.weapons },
        { title: "équipements", data: equipedObjects.clothings }
      ]
    case "use":
      return [{ title: "consommables", data: inventory.consumables }]
    case "search":
    case "throw":
      return [
        { title: "armes", data: inventory.weapons },
        { title: "équipements", data: inventory.clothings },
        { title: "consommables", data: inventory.consumables }
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
  const { equipedObjects } = useCharacter()

  const { setForm } = useActionApi()
  const { itemId, actionSubtype } = useActionForm()

  const onPressItem = (itemDbKey: string) => {
    setForm({ itemId: itemDbKey })
  }

  const itemLists = getItemList(actionSubtype, inventory, equipedObjects)
  // TODO: group consumables with same id and add quantity
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
                  isSelected={itemId === item.dbKey}
                  label={item.data.label}
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
