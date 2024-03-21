import { useMemo } from "react"

import { useLocalSearchParams } from "expo-router"
import { Drawer } from "expo-router/drawer"

import dbKeys from "db/db-keys"
import Character, { DbChar } from "lib/character/Character"
import Inventory from "lib/character/Inventory"
import Squad from "lib/character/Squad"
import { DbSquad } from "lib/squad/squad-types"

import CustomDrawer from "components/Drawer/Drawer"
import { DrawerParams } from "components/Drawer/Drawer.params"
import styles from "components/Drawer/Drawer.styles"
import { CharacterContext } from "contexts/CharacterContext"
import { InventoryContext } from "contexts/InventoryContext"
import { SquadContext } from "contexts/SquadContext"
import useDbSubscribe from "hooks/db/useDbSubscribe"
import LoadingScreen from "screens/LoadingScreen"
import { SearchParams } from "screens/ScreenParams"

export default function CharLayout() {
  const { charId, squadId } = useLocalSearchParams() as SearchParams<DrawerParams>

  const dbSquad: DbSquad | null = useDbSubscribe(dbKeys.squad(squadId).index)
  const squad = useMemo(() => {
    if (!dbSquad) return null
    return new Squad(dbSquad)
  }, [dbSquad])

  const dbChar: DbChar | null = useDbSubscribe(dbKeys.char(charId).index)
  const character = useMemo(() => {
    if (!dbChar) return null
    return new Character(dbChar)
  }, [dbChar])

  const inventory = useMemo(() => {
    if (!character) return null
    const { dbAbilities, innateSymptoms, currSkills, dbEquipedObjects } = character
    const charData = { dbAbilities, innateSymptoms, currSkills, dbEquipedObjects }
    return new Inventory(character?.dbInventory, charData)
  }, [character])

  if (!character || !inventory || !squad) return <LoadingScreen />

  return (
    <SquadContext.Provider value={squad}>
      <CharacterContext.Provider value={character}>
        <InventoryContext.Provider value={inventory}>
          <Drawer
            defaultStatus="open"
            screenOptions={{
              headerShown: false,
              drawerType: "permanent",
              drawerStyle: styles.drawerContainer,
              drawerPosition: "right"
            }}
            // eslint-disable-next-line react/no-unstable-nested-components
            drawerContent={props => <CustomDrawer charId={charId} squadId={squadId} {...props} />}
          >
            <Drawer.Screen name="main" options={{ title: "Perso" }} />
            <Drawer.Screen name="inventory" options={{ title: "Inventaire" }} />
            <Drawer.Screen name="combat" options={{ title: "Combat" }} />
          </Drawer>
        </InventoryContext.Provider>
      </CharacterContext.Provider>
    </SquadContext.Provider>
  )
}
