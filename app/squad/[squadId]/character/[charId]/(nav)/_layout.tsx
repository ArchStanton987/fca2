import { useLocalSearchParams } from "expo-router"
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

export default function CharLayout() {
  const { squadId, charId } = useLocalSearchParams<{ squadId: string; charId: string }>()
  return (
    <Tabs
      tabBar={TabBarComponent}
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerStyle: {
          backgroundColor: colors.primColor,
          height: 40,
          borderBottomWidth: 0
        },
        sceneStyle: { backgroundColor: colors.primColor }
      }}
    >
      <Tabs.Screen
        name="main"
        options={{ title: "Perso", header: HeaderMain }}
        initialParams={{ squadId, charId }}
      />
      <Tabs.Screen name="inventory" options={{ title: "Inventaire", header: HeaderInv }} />
      <Tabs.Screen name="combat" options={{ title: "Combat", header: HeaderCombat }} />
    </Tabs>
  )
}
