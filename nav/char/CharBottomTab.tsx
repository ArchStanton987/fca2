import React from "react"

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { CharStackParamList } from "nav/CharNav"

import TabBar from "components/TabBar/TabBar"
import EffectsScreen from "screens/MainTabs/EffectsScreen/EffectsScreen"
import KnowledgesScreen from "screens/MainTabs/KnowledgesScreen/KnowledgesScreen"
import RecapScreen from "screens/MainTabs/RecapScreen/RecapScreen"
import SecAttrScreen from "screens/MainTabs/SecAttrScreen/SecAttrScreen"
import SkillsScreen from "screens/MainTabs/SkillsScreen/SkillsScreen"
import SpecialScreen from "screens/MainTabs/SpecialScreen/SpecialScreen"

export type CharBottomTabParamList = {
  Résumé: { squadId: string; charId: string }
  Effets: { squadId: string; charId: string }
  "Attr. Prim.": { squadId: string; charId: string }
  "Attr. Sec.": { squadId: string; charId: string }
  Comp: { squadId: string; charId: string }
  Conn: { squadId: string; charId: string }
}

const Tab = createBottomTabNavigator<CharBottomTabParamList>()

type Props = NativeStackScreenProps<CharStackParamList, "Perso">

export default function CharBottomTab(props: Props) {
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
