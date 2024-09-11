import { View } from "react-native"

import { createNativeStackNavigator } from "@react-navigation/native-stack"
import CharBottomTab from "nav/char/CharBottomTab"
import CombatBottomTab from "nav/char/CombatBottomTab"
import InvBottomTab from "nav/char/InvBottomTab"
import { CharStackParamList, RootStackScreenProps } from "nav/nav.types"

import Drawer from "components/Drawer/Drawer"

const CharStack = createNativeStackNavigator<CharStackParamList>()

export default function CharNav({ route }: RootStackScreenProps<"Personnage">) {
  const { squadId, charId } = route.params
  return (
    <View>
      <Drawer squadId={squadId} charId={charId} />
      <CharStack.Navigator>
        <CharStack.Screen name="Perso" component={CharBottomTab} />
        <CharStack.Screen name="Inventaire" component={InvBottomTab} />
        <CharStack.Screen name="Combat" component={CombatBottomTab} />
      </CharStack.Navigator>
    </View>
  )
}
