import React from "react"

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { CombatBottomTabParamList } from "nav/nav.types"

import Header from "components/Header/Header"
import TabBar from "components/TabBar/TabBar"
import CombatScreen from "screens/CombatScreen/CombatScreen"
import colors from "styles/colors"

const Tab = createBottomTabNavigator<CombatBottomTabParamList>()

export default function CombatBottomTab() {
  return (
    <Tab.Navigator
      initialRouteName="Statut"
      screenOptions={{
        headerShown: true,
        header: props => (
          <Header
            headerElementsIds={[
              "date",
              "time",
              "armorClass",
              "critChance",
              "meleeDamage",
              "range",
              "progression",
              "rads",
              "hp"
            ]}
            {...props}
          />
        )
      }}
      tabBar={props => <TabBar tabBarId="combat" {...props} />}
      sceneContainerStyle={{ backgroundColor: colors.primColor }}
    >
      <Tab.Screen name="Statut" component={CombatScreen} />
    </Tab.Navigator>
  )
}
