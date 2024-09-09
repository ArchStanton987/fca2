import React from "react"

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"

import TabBar from "components/TabBar/TabBar"
import CombatScreen from "screens/CombatScreen/CombatScreen"

const Tab = createBottomTabNavigator()

export default function AdminNav() {
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
