import { useMemo, useState } from "react"
import { View } from "react-native"

import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Character, { DbChar } from "lib/character/Character"
import Squad from "lib/character/Squad"
import useCases from "lib/common/use-cases"
import Inventory from "lib/objects/Inventory"
import CharBottomTab from "nav/char/CharBottomTab"
import CombatBottomTab from "nav/char/CombatBottomTab"
import InvBottomTab from "nav/char/InvBottomTab"
import { CharStackParamList, RootStackScreenProps } from "nav/nav.types"
import Toast from "react-native-toast-message"

import Drawer from "components/Drawer/Drawer"
import { CharacterContext } from "contexts/CharacterContext"
import { InventoryContext } from "contexts/InventoryContext"
import useRtdbSub from "hooks/db/useRtdbSub"
import UpdatesProvider from "providers/UpdatesProvider"
import LoadingScreen from "screens/LoadingScreen"
import EffectsConfirmationModal from "screens/MainTabs/modals/EffectsConfirmationModal/EffectsConfirmationModal"
import UpdateEffectsModal from "screens/MainTabs/modals/EffectsConfirmationModal/UpdateEffectsModal"
import UpdateHealthConfirmationModal from "screens/MainTabs/modals/UpdateHealthConfirmationModal/UpdateHealthConfirmationModal"
import UpdateHealthModal from "screens/MainTabs/modals/UpdateHealthModal/UpdateHealthModal"
import UpdateKnowledgesModal from "screens/MainTabs/modals/UpdateKnowledgesModal/UpdateKnowledgesModal"
import UpdateObjectsConfirmationModal from "screens/MainTabs/modals/UpdateObjectsConfirmationModal/UpdateObjectsConfirmationModal"
import UpdateObjectsModal from "screens/MainTabs/modals/UpdateObjectsModal/UpdateObjectsModal"
import UpdateSkillsModal from "screens/MainTabs/modals/UpdateSkillsModal/UpdateSkillsModal"
import UpdateStatusModal from "screens/MainTabs/modals/UpdateStatusModal/UpdateStatusModal"
import { getDDMMYYYY, getHHMM } from "utils/date"

const CharStack = createNativeStackNavigator<CharStackParamList>()

export default function CharNav({ route }: RootStackScreenProps<"Personnage">) {
  const { squadId, charId } = route.params

  const dbSquad = useRtdbSub(useCases.squad.get(squadId))
  const squad = useMemo(() => {
    if (!dbSquad) return null
    return new Squad(dbSquad, squadId)
  }, [dbSquad, squadId])

  const initDatetime = squad?.date.toJSON() ?? new Date().toJSON()
  const [currDatetime, setCurrDatetime] = useState(initDatetime)

  // use separate subscriptions to avoid unnecessary bandwidth usage
  const abilities = useRtdbSub(useCases.abilities.getAbilities(charId))
  const effects = useRtdbSub(useCases.effects.getAll(charId))
  const equipedObj = useRtdbSub(useCases.equipedObjects.getAll(charId))
  const inventory = useRtdbSub(useCases.inventory.getAll(charId))
  const status = useRtdbSub(useCases.status.get(charId))

  const character = useMemo(() => {
    const dbCharData = { abilities, effects, equipedObj, status }
    if (Object.values(dbCharData).some(data => data === undefined)) return null
    if (!squad) return null
    return new Character(dbCharData as DbChar, squad.date, charId)
  }, [squad, charId, abilities, effects, equipedObj, status])

  const charInventory = useMemo(() => {
    if (!character || !inventory) return null
    const { dbAbilities, innateSymptoms, skills, dbEquipedObjects, special } = character
    const charData = {
      dbAbilities,
      innateSymptoms,
      currSkills: skills.curr,
      dbEquipedObjects,
      currSpecial: special.curr
    }
    return new Inventory(inventory, charData)
  }, [character, inventory])

  if (!character || !charInventory || !squad) return <LoadingScreen />

  if (squad.date.toJSON() !== currDatetime) {
    setCurrDatetime(squad.date.toJSON())
    const newDate = getDDMMYYYY(squad.date)
    const newHour = getHHMM(squad.date)
    Toast.show({
      type: "custom",
      text1: `Le temps passe ! Nous sommes le ${newDate}, il est ${newHour}.`,
      autoHide: false
    })
  }

  return (
    <CharacterContext.Provider value={character}>
      <InventoryContext.Provider value={charInventory}>
        <UpdatesProvider>
          <View>
            <Drawer squadId={squadId} charId={charId} />
            <CharStack.Navigator>
              <CharStack.Screen name="Perso" component={CharBottomTab} />
              <CharStack.Screen name="Inventaire" component={InvBottomTab} />
              <CharStack.Screen name="Combat" component={CombatBottomTab} />
              <CharStack.Group screenOptions={{ presentation: "modal" }}>
                <CharStack.Screen
                  name="UpdateEffectsConfirmation"
                  component={EffectsConfirmationModal}
                />
                <CharStack.Screen
                  name="UpdateHealthConfirmation"
                  component={UpdateHealthConfirmationModal}
                />
                <CharStack.Screen
                  name="UpdateObjectsConfirmation"
                  component={UpdateObjectsConfirmationModal}
                />
                <CharStack.Screen name="UpdateEffects" component={UpdateEffectsModal} />
                <CharStack.Screen name="UpdateObjects" component={UpdateObjectsModal} />
                <CharStack.Screen name="UpdateSkills" component={UpdateSkillsModal} />
                <CharStack.Screen name="UpdateStatus" component={UpdateStatusModal} />
                <CharStack.Screen name="UpdateHealth" component={UpdateHealthModal} />
                <CharStack.Screen name="UpdateKnowledges" component={UpdateKnowledgesModal} />
              </CharStack.Group>
            </CharStack.Navigator>
          </View>
        </UpdatesProvider>
      </InventoryContext.Provider>
    </CharacterContext.Provider>
  )
}
