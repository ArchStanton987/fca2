import { TouchableHighlight, TouchableOpacity, View } from "react-native"

import { router, useSegments } from "expo-router"

import List from "components/List"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import SmallLine from "components/draws/Line/Line"
import { charRoute } from "constants/routes"

import styles from "./Drawer.styles"

type DrawerProps = {
  charId: string
  squadId: string
}

const navElements = [
  { path: "main", label: "Perso" },
  { path: "inventory", label: "Inventaire" },
  { path: "combat", label: "Combat" }
]

export default function Drawer({ squadId, charId }: DrawerProps) {
  const segments = useSegments()

  const toHome = () => router.push("/")

  const toTabs = (path: string) =>
    router.push({
      pathname: `${charRoute}/${path}`,
      params: { squadId, charId }
    })

  return (
    <View style={styles.drawerContainer}>
      <SmallLine top left />
      <SmallLine top right />
      <Spacer y={10} />
      <TouchableOpacity onPress={toHome} style={styles.fcaContainer}>
        <Txt style={styles.fca}>{"<FCA>"}</Txt>
      </TouchableOpacity>
      <Spacer y={20} />
      <List
        data={navElements}
        keyExtractor={item => item.label}
        renderItem={({ item }) => {
          const isSelected = segments.includes(item.path)
          return (
            <TouchableHighlight
              style={[styles.navButton, isSelected && styles.navButtonActive]}
              onPress={() => toTabs(item.path)}
            >
              <Txt style={[styles.navButtonText, isSelected && styles.navButtonActiveText]}>
                {item.label}
              </Txt>
            </TouchableHighlight>
          )
        }}
        separator={<Spacer y={20} />}
      />
    </View>
  )
}
