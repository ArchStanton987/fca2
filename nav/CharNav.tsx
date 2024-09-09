import { View } from "react-native"

import { createNativeStackNavigator } from "@react-navigation/native-stack"
import CharBottomTab from "nav/char/CharBottomTab"
import CombatBottomTab from "nav/char/CombatBottomTab"
import InvBottomTab from "nav/char/InvBottomTab"

import Drawer from "components/Drawer/Drawer"

const CharStack = createNativeStackNavigator()

export default function CharNav(props: unknown) {
  console.log("CharNav props", props)

  return (
    <View>
      <Drawer squadId="jackalRecruits" charId="doz" />
      <CharStack.Navigator>
        <CharStack.Screen name="Perso" component={CharBottomTab} />
        <CharStack.Screen name="Inventaire" component={InvBottomTab} />
        <CharStack.Screen name="Combat" component={CombatBottomTab} />
      </CharStack.Navigator>
    </View>
  )
}
