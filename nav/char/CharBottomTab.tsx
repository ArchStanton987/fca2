import React from "react"

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { CharBottomTabParamList, CharStackScreenProps } from "nav/nav.types"

import TabBar from "components/TabBar/TabBar"
import EffectsScreen from "screens/MainTabs/EffectsScreen/EffectsScreen"
import KnowledgesScreen from "screens/MainTabs/KnowledgesScreen/KnowledgesScreen"
import RecapScreen from "screens/MainTabs/RecapScreen/RecapScreen"
import SecAttrScreen from "screens/MainTabs/SecAttrScreen/SecAttrScreen"
import SkillsScreen from "screens/MainTabs/SkillsScreen/SkillsScreen"
import SpecialScreen from "screens/MainTabs/SpecialScreen/SpecialScreen"

const Tab = createBottomTabNavigator<CharBottomTabParamList>()

export default function CharBottomTab(props: CharStackScreenProps<"Perso">) {
  return (
    <Tab.Navigator
      initialRouteName="Résumé"
      screenOptions={{ headerShown: false }}
      tabBar={props => <TabBar tabBarId="main" {...props} />}
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
