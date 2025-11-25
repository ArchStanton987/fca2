import { StyleSheet } from "react-native"

import { Tabs } from "expo-router/tabs"

import Header from "components/Header/Header"
import { HeaderElementId } from "components/Header/Header.utils"
import TabBar from "components/TabBar/TabBar"
import colors from "styles/colors"

const special: HeaderElementId[] = [
  "strength",
  "perception",
  "endurance",
  "charisma",
  "intelligence",
  "agility",
  "luck"
]
const datetime: HeaderElementId[] = ["date", "time"]
const carry: HeaderElementId[] = ["weight", "place"]

const mainHeader: HeaderElementId[] = [...datetime, "progression", ...special, "rads", "hp"]
const invHeader: HeaderElementId[] = [...datetime, "progression", ...carry, "caps"]
const combatHeader: HeaderElementId[] = [
  "date",
  "time",
  "armorClass",
  "critChance",
  "meleeDamage",
  "range",
  "progression",
  "rads",
  "hp"
]

function HeaderMain() {
  return <Header headerElementsIds={mainHeader} />
}

function HeaderInv() {
  return <Header headerElementsIds={invHeader} />
}
function HeaderCombat() {
  return <Header headerElementsIds={combatHeader} />
}

function TabBarComponent(props: any) {
  return <TabBar tabBarId="char" {...props} />
}

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: colors.primColor,
    height: 40,
    borderBottomWidth: 0
  },
  sceneStyle: {
    backgroundColor: colors.primColor
  }
})

export default function CharLayout() {
  return (
    <Tabs
      tabBar={TabBarComponent}
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerStyle: styles.headerStyle,
        sceneStyle: styles.sceneStyle
      }}
    >
      <Tabs.Screen name="main" options={{ title: "Perso", header: HeaderMain }} />
      <Tabs.Screen name="inventory" options={{ title: "Inventaire", header: HeaderInv }} />
      <Tabs.Screen name="combat" options={{ title: "Combat", header: HeaderCombat }} />
    </Tabs>
  )
}
