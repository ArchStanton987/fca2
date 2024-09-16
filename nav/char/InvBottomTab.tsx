import React from "react"

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { InvBottomTabParamList } from "nav/nav.types"

import Header from "components/Header/Header"
import { HeaderElementId } from "components/Header/Header.utils"
import TabBar from "components/TabBar/TabBar"
import AmmoScreen from "screens/InventoryTabs/AmmoScreen/AmmoScreen"
import ClothingsScreen from "screens/InventoryTabs/ClothingsScreen/ClothingsScreen"
import ConsumablesScreen from "screens/InventoryTabs/ConsumablesScreen/ConsumablesScreen"
import MiscObjScreen from "screens/InventoryTabs/MiscObjScreen/MiscObjScreen"
import WeaponsScreen from "screens/InventoryTabs/WeaponsScreen/WeaponsScreen"
import colors from "styles/colors"

const Tab = createBottomTabNavigator<InvBottomTabParamList>()

const datetime: HeaderElementId[] = ["date", "time"]
const carry: HeaderElementId[] = ["weight", "place"]

export default function InvBottomTab() {
  return (
    <Tab.Navigator
      initialRouteName="Armes"
      screenOptions={{
        tabBarHideOnKeyboard: true,
        header: props => (
          <Header headerElementsIds={[...datetime, "progression", ...carry, "caps"]} {...props} />
        ),
        headerStyle: {
          backgroundColor: colors.primColor,
          height: 40,
          borderBottomWidth: 0
        }
      }}
      sceneContainerStyle={{
        backgroundColor: colors.primColor
      }}
      tabBar={props => <TabBar tabBarId="inventory" {...props} />}
    >
      <Tab.Screen name="Armes" component={WeaponsScreen} />
      <Tab.Screen name="Protections" component={ClothingsScreen} />
      <Tab.Screen name="Consommables" component={ConsumablesScreen} />
      <Tab.Screen name="Divers" component={MiscObjScreen} />
      <Tab.Screen name="Munitions" component={AmmoScreen} />
    </Tab.Navigator>
  )
}
