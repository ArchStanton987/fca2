import React from "react"

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { CharBottomTabParamList } from "nav/nav.types"

import Header from "components/Header/Header"
import { HeaderElementId } from "components/Header/Header.utils"
import TabBar from "components/TabBar/TabBar"
import EffectsScreen from "screens/MainTabs/EffectsScreen/EffectsScreen"
import KnowledgesScreen from "screens/MainTabs/KnowledgesScreen/KnowledgesScreen"
import RecapScreen from "screens/MainTabs/RecapScreen/RecapScreen"
import SecAttrScreen from "screens/MainTabs/SecAttrScreen/SecAttrScreen"
import SkillsScreen from "screens/MainTabs/SkillsScreen/SkillsScreen"
import SpecialScreen from "screens/MainTabs/SpecialScreen/SpecialScreen"
import colors from "styles/colors"

const Tab = createBottomTabNavigator<CharBottomTabParamList>()

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

export default function CharBottomTab() {
  return (
    <Tab.Navigator
      initialRouteName="Résumé"
      screenOptions={{
        tabBarHideOnKeyboard: true,
        header: props => (
          <Header
            headerElementsIds={[...datetime, "progression", ...special, "rads", "hp"]}
            {...props}
          />
        ),
        headerStyle: {
          backgroundColor: colors.primColor,
          height: 40,
          borderBottomWidth: 0
        }
      }}
      tabBar={props => <TabBar tabBarId="main" {...props} />}
      sceneContainerStyle={{ backgroundColor: colors.primColor }}
    >
      <Tab.Screen name="Résumé" component={RecapScreen} />
      <Tab.Screen name="Effets" component={EffectsScreen} />
      <Tab.Screen name="Attr. Prim." component={SpecialScreen} />
      <Tab.Screen name="Attr. Sec." component={SecAttrScreen} />
      <Tab.Screen name="Comp" component={SkillsScreen} />
      <Tab.Screen name="Conn" component={KnowledgesScreen} />
    </Tab.Navigator>
  )
}
