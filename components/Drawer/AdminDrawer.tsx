import { TouchableHighlight } from "react-native"

import { router, useSegments } from "expo-router"

import List from "components/List"
import ScrollSection from "components/Section/ScrollSection"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import PlusIcon from "components/icons/PlusIcon"
import { adminRoute } from "constants/routes"
import { useSquad } from "contexts/SquadContext"

import styles from "./Drawer.styles"

type SectionId = "creation" | "enemies"
type DrawerProps = {
  sectionId: SectionId
  navElements: { path: string; label: string }[]
}

export default function AdminDrawer({ sectionId, navElements }: DrawerProps) {
  const segments = useSegments()
  const squad = useSquad()
  const { squadId } = squad

  const toTabs = (path: string) => {
    const params = { squadId }
    router.push({ pathname: `${adminRoute}/${sectionId}/${path}`, params })
  }

  return (
    <ScrollSection style={styles.drawerContainer} title={sectionId} titleVariant="shiny">
      <List
        data={navElements}
        keyExtractor={item => item.label}
        style={{ flex: 1 }}
        renderItem={({ item }) => {
          const { path } = item
          const isSelected = segments.includes(path)
          const hasBadge = false
          return (
            <TouchableHighlight
              style={[styles.navButton, isSelected && styles.navButtonActive]}
              onPress={() => toTabs(path)}
            >
              <>
                <Txt style={[styles.navButtonText, isSelected && styles.navButtonActiveText]}>
                  {item.label}
                </Txt>
                <Spacer x={5} />
                {hasBadge && <PlusIcon style={styles.badge} size={12} />}
              </>
            </TouchableHighlight>
          )
        }}
      />
    </ScrollSection>
  )
}
