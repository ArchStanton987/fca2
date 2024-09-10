import { createNativeStackNavigator } from "@react-navigation/native-stack"
import AdminNav from "nav/AdminNav"
import CharNav from "nav/CharNav"

import CharacterSelectionScreen from "screens/CharacterSelectionScreen/CharacterSelectionScreen"
import SquadSelectionScreen from "screens/SquadSelectionScreen/SquadSelectionScreen"

export type RootStackParamList = {
  Home: undefined
  ChoixPerso: { squadId: string }
  Personnage: { squadId: string; charId: string }
  Admin: { squadId: string }
}

const MainStack = createNativeStackNavigator<RootStackParamList>()

export default function Router() {
  return (
    <MainStack.Navigator>
      <MainStack.Screen name="Home" component={SquadSelectionScreen} />
      <MainStack.Screen name="ChoixPerso" component={CharacterSelectionScreen} />
      <MainStack.Screen name="Personnage" component={CharNav} />
      <MainStack.Screen name="Admin" component={AdminNav} />
    </MainStack.Navigator>
  )
}
