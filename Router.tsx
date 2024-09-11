import { createNativeStackNavigator } from "@react-navigation/native-stack"
import AdminNav from "nav/AdminNav"
import CharNav from "nav/CharNav"
import { RootStackParamList } from "nav/nav.types"

import CharacterSelectionScreen from "screens/CharacterSelectionScreen/CharacterSelectionScreen"
import SquadSelectionScreen from "screens/SquadSelectionScreen/SquadSelectionScreen"

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
