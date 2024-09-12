import { createNativeStackNavigator } from "@react-navigation/native-stack"
import AdminNav from "nav/AdminNav"
import CharNav from "nav/CharNav"
import { RootStackParamList } from "nav/nav.types"

import CharacterSelectionScreen from "screens/CharacterSelectionScreen/CharacterSelectionScreen"
import SquadSelectionScreen from "screens/SquadSelectionScreen/SquadSelectionScreen"

const RootStack = createNativeStackNavigator<RootStackParamList>()

export default function Router() {
  return (
    <RootStack.Navigator>
      <RootStack.Screen name="Home" component={SquadSelectionScreen} />
      <RootStack.Screen name="ChoixPerso" component={CharacterSelectionScreen} />
      <RootStack.Screen name="Personnage" component={CharNav} />
      <RootStack.Screen name="Admin" component={AdminNav} />
    </RootStack.Navigator>
  )
}
