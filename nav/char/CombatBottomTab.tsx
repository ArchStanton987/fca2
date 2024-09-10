import React from "react"

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { CharStackParamList } from "nav/CharNav"

import TabBar from "components/TabBar/TabBar"
import CombatScreen from "screens/CombatScreen/CombatScreen"

export type CombatBottomTabParamList = {
  Statut: { squadId: string; charId: string }
}

const Tab = createBottomTabNavigator<CombatBottomTabParamList>()

type Props = NativeStackScreenProps<CharStackParamList, "Combat">

export default function CombatBottomTab(props: Props) {
  return (
    <Tab.Navigator
      initialRouteName="Statut"
      screenOptions={{ headerShown: false }}
      tabBar={props => <TabBar tabBarId="combat" {...props} />}
    >
      <Tab.Screen name="Statut" component={CombatScreen} />
    </Tab.Navigator>
  )
}
