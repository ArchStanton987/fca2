import React from "react"

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { CharStackParamList } from "nav/CharNav"

import TabBar from "components/TabBar/TabBar"
import AmmoScreen from "screens/InventoryTabs/AmmoScreen/AmmoScreen"
import ClothingsScreen from "screens/InventoryTabs/ClothingsScreen/ClothingsScreen"
import ConsumablesScreen from "screens/InventoryTabs/ConsumablesScreen/ConsumablesScreen"
import MiscObjScreen from "screens/InventoryTabs/MiscObjScreen/MiscObjScreen"
import WeaponsScreen from "screens/InventoryTabs/WeaponsScreen/WeaponsScreen"

export type InvBottomTabParamList = {
  Armes: { squadId: string; charId: string }
  Protections: { squadId: string; charId: string }
  Consommables: { squadId: string; charId: string }
  Divers: { squadId: string; charId: string }
  Munitions: { squadId: string; charId: string }
}

const Tab = createBottomTabNavigator<InvBottomTabParamList>()

type Props = NativeStackScreenProps<CharStackParamList, "Inventaire">

export default function InvBottomTab(props: Props) {
  return (
    <Tab.Navigator
      initialRouteName="Armes"
      screenOptions={{ headerShown: false }}
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
