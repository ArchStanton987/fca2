import { StyleSheet, View } from "react-native"

import { Item, itemSelector, useItems } from "lib/inventory/use-sub-inv-cat"

import List from "components/List"
import ListItemSelectable from "components/ListItemSelectable"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useActionApi, useActionItemDbKey, useActionSubtype } from "providers/ActionFormProvider"
import colors from "styles/colors"

const getItemList = (actionSubtype: string, i: Record<string, Item>) => {
  switch (actionSubtype) {
    case "drop":
      return [
        { title: "Armes", data: itemSelector(i, "weapons", { isEquipped: true }) },
        { title: "Equipements", data: itemSelector(i, "clothings", { isEquipped: true }) }
      ]
    case "equip":
      return [
        { title: "Armes", data: itemSelector(i, "weapons", { isEquipped: false }) },
        { title: "Equipements", data: itemSelector(i, "clothings", { isEquipped: false }) }
      ]
    case "unequip":
      return [
        { title: "armes", data: itemSelector(i, "weapons", { isEquipped: true }) },
        { title: "équipements", data: itemSelector(i, "clothings", { isEquipped: true }) }
      ]
    case "use":
      return [{ title: "consommables", data: itemSelector(i, "consumables", { isGrouped: true }) }]
    case "throw":
      return [
        { title: "armes", data: itemSelector(i, "weapons", {}) },
        { title: "équipements", data: itemSelector(i, "clothings", {}) },
        { title: "consommables", data: itemSelector(i, "consumables", { isGrouped: true }) },
        { title: "divers", data: itemSelector(i, "misc", {}) }
      ]
    case "pickUp":
      return [{ title: "ajouter", data: {} as Record<string, Item> }]
    default:
      return [{ title: "", data: {} as Record<string, Item> }]
  }
}

const styles = StyleSheet.create({
  sectionTitle: {
    borderWidth: 2,
    borderColor: colors.secColor,
    textAlign: "center"
  }
})

export default function ItemsActionInfo({ actorId }: { actorId: string }) {
  const { setForm } = useActionApi()
  const actionSubtype = useActionSubtype()
  const itemDbKey = useActionItemDbKey()

  const onPressItem = (dbKey: string) => {
    setForm({ itemDbKey: dbKey })
  }

  const { data: items } = useItems(actorId)

  const lists = getItemList(actionSubtype, items)

  return (
    <View>
      <List
        data={lists}
        keyExtractor={el => el.title}
        renderItem={el => (
          <>
            <Spacer y={10} />
            <Txt style={styles.sectionTitle}>{el.item.title.toUpperCase()}</Txt>
            <Spacer y={10} />
            <List
              data={Object.values(el.item.data)}
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
