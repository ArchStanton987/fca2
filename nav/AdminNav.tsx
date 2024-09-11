import React from "react"

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { AdminBottomTabParamList, RootStackScreenProps } from "nav/nav.types"

import TabBar from "components/TabBar/TabBar"
import DatetimeSelectionScreen from "screens/AdminTabs/DatetimeSelectionScreen/DatetimeSelectionScreen"

const Tab = createBottomTabNavigator<AdminBottomTabParamList>()

export default function AdminNav(props: RootStackScreenProps<"Admin">) {
  return (
    <Tab.Navigator
      initialRouteName="dateHeure"
      screenOptions={{ headerShown: false }}
      tabBar={props => <TabBar tabBarId="combat" {...props} />}
    >
      <Tab.Screen name="dateHeure" component={DatetimeSelectionScreen} />
    </Tab.Navigator>
  )
}
