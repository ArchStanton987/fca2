import React from "react"

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { RootStackParamList } from "Router"

import TabBar from "components/TabBar/TabBar"
import CombatScreen from "screens/CombatScreen/CombatScreen"

export type CombatBottomTabParamList = {
  Bagarre: { squadId: string; charId: string }
}

const Tab = createBottomTabNavigator<CombatBottomTabParamList>()

type Props = NativeStackScreenProps<RootStackParamList, "Admin">

export default function AdminNav(props: Props) {
  return (
    <Tab.Navigator
      initialRouteName="Bagarre"
      screenOptions={{ headerShown: false }}
      tabBar={props => <TabBar tabBarId="combat" {...props} />}
    >
      <Tab.Screen name="Bagarre" component={CombatScreen} />
    </Tab.Navigator>
  )
}
