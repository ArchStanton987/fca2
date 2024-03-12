import { createContext, useMemo } from "react"

import { useLocalSearchParams } from "expo-router"
import { Drawer } from "expo-router/drawer"

import dbKeys from "db/db-keys"
import Character, { DbChar } from "lib/character/Character"

import CustomDrawer from "components/Drawer/Drawer"
import { DrawerParams } from "components/Drawer/Drawer.params"
import styles from "components/Drawer/Drawer.styles"
import useDbSubscribe from "hooks/db/useDbSubscribe"
import BaseAttrProvider from "providers/BaseAttrProvider"
import CurrAttrProvider from "providers/CurrAttrProvider"
import { SearchParams } from "screens/ScreenParams"

const CharacterContext = createContext<Character | null>(null)

export default function CharLayout() {
  const { charId, squadId } = useLocalSearchParams() as SearchParams<DrawerParams>

  const charData: DbChar | null = useDbSubscribe(dbKeys.char(charId).index)
  const character = useMemo(() => {
    if (!charData) return null
    return new Character(charData)
  }, [charData])

  return (
    <CharacterContext.Provider value={character}>
      <BaseAttrProvider charId={charId}>
        <CurrAttrProvider charId={charId}>
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
        </CurrAttrProvider>
      </BaseAttrProvider>
    </CharacterContext.Provider>
  )
}
