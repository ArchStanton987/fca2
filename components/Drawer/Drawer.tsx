import { TouchableHighlight, TouchableOpacity, View } from "react-native"

import { useNavigation, useRoute } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { CharStackParamList, RootStackParamList } from "nav/nav.types"

import List from "components/List"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import SmallLine from "components/draws/Line/Line"

import styles from "./Drawer.styles"

type DrawerProps = {
  charId: string
  squadId: string
}

const navElements: { path: keyof CharStackParamList; label: string }[] = [
  { path: "Perso", label: "Perso" },
  { path: "Inventaire", label: "Inventaire" },
  { path: "Combat", label: "Combat" }
]

export default function Drawer({ squadId, charId }: DrawerProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, "Personnage">>()
  const { name } = useRoute()

  const toHome = () => navigation.navigate("Home")

  const toTabs = (path: keyof CharStackParamList) => {
    const params = { squadId, charId }
    navigation.push("Personnage", { screen: path, params })
  }

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
          const isSelected = name === item.path
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
