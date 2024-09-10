import { View } from "react-native"

import { NativeStackScreenProps, createNativeStackNavigator } from "@react-navigation/native-stack"
import { RootStackParamList } from "Router"
import CharBottomTab from "nav/char/CharBottomTab"
import CombatBottomTab from "nav/char/CombatBottomTab"
import InvBottomTab from "nav/char/InvBottomTab"

import Drawer from "components/Drawer/Drawer"

export type CharStackParamList = {
  Perso: { squadId: string; charId: string }
  Inventaire: { squadId: string; charId: string }
  Combat: { squadId: string; charId: string }
}

const CharStack = createNativeStackNavigator<CharStackParamList>()

type Props = NativeStackScreenProps<RootStackParamList, "Personnage">

export default function CharNav({ route }: Props) {
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
