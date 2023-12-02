import { ActivityIndicator, View } from "react-native"

import { useLocalSearchParams } from "expo-router"

import { FlatList } from "react-native-gesture-handler"

import CheckBox from "components/CheckBox/CheckBox"
import { DrawerParams } from "components/Drawer/Drawer.params"
import DrawerPage from "components/DrawerPage"
import Section from "components/Section"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import useGetEquipedObj from "hooks/db/useGetEquipedObj"
import skillsMap from "models/character/skills/skills"
import clothingsMap from "models/objects/clothing/clothings"
import weaponsMap from "models/objects/weapon/weapons"
import { useCurrAttr } from "providers/CurrAttrProvider"
import { SearchParams } from "screens/ScreenParams"
import colors from "styles/colors"

import styles from "./RecapScreen.styles"

const skillsArray = Object.values(skillsMap)

function ListHeader() {
  return (
    <View style={styles.skillHeader}>
      <Txt>COMPETENCE</Txt>
      <Txt>SCORE</Txt>
    </View>
  )
}

function EmptyComponent() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="small" color={colors.secColor} />
    </View>
  )
}

export default function RecapScreen() {
  const { charId } = useLocalSearchParams() as SearchParams<DrawerParams>
  const { currSkills } = useCurrAttr()
  const equipedObj = useGetEquipedObj(charId)
  const weapons = equipedObj?.weapons || []
  const clothings = equipedObj?.clothings || []

  return (
    <DrawerPage>
      <Section style={{ flex: 1 }}>
        <Txt>RECAP</Txt>
      </Section>
      <Spacer x={10} />
      <View style={{ width: 200, flex: 1 }}>
        <Section style={{ flex: 1 }}>
          <Txt>ARMES EQUIPEES</Txt>
          <Spacer y={10} />
          {weapons.map(weapon => (
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <CheckBox isChecked />
              <Txt>{weaponsMap[weapon.id].label}</Txt>
            </View>
          ))}
        </Section>
        <Section style={{ flex: 1 }}>
          <Txt>ARMURES EQUIPEES</Txt>
          <Spacer y={10} />
          {clothings.map(cloth => (
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <CheckBox isChecked />
              <Txt>{clothingsMap[cloth.id].label}</Txt>
            </View>
          ))}
        </Section>
        <Section>
          <Txt>POIDS</Txt>
          <Spacer y={10} />
          <Txt>PLACE</Txt>
        </Section>
      </View>
      <Spacer x={10} />
      <Section style={{ width: 200 }}>
        <FlatList
          data={skillsArray}
          keyExtractor={item => item.id}
          ListEmptyComponent={EmptyComponent}
          ListHeaderComponent={ListHeader}
          renderItem={({ item }) => (
            <View style={styles.skillRow}>
              <Txt>{skillsMap[item.id].label}</Txt>
              <Txt>{currSkills ? currSkills[item.id] : "-"}</Txt>
            </View>
          )}
        />
      </Section>
    </DrawerPage>
  )
}
