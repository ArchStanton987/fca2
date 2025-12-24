import { StyleSheet } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import { useCurrCharId } from "lib/character/character-store"
import { useBarterActions, useHasSearch } from "lib/objects/barter-store"
import Barter from "lib/objects/ui/barter/BarterComponents"

import Col from "components/Col"
import ModalCta from "components/ModalCta/ModalCta"
import Row from "components/Row"
import ScrollSection from "components/Section/ScrollSection"
import Spacer from "components/Spacer"
import ModalBody from "components/wrappers/ModalBody"
import layout from "styles/layout"

const styles = StyleSheet.create({
  extend: { flex: 1 },
  categories: { width: 160 },
  mods: { width: 200 }
})

function Search() {
  const hasSearch = useHasSearch()
  return hasSearch ? (
    <>
      <Barter.SearchInput />
      <Spacer y={layout.globalPadding} />
    </>
  ) : null
}

export default function BarterModal() {
  const { squadId } = useLocalSearchParams<{ squadId: string }>()
  const charId = useCurrCharId()

  const actions = useBarterActions()

  const next = () => {
    router.push({
      pathname: "/squad/[squadId]/character/[charId]/barter-confirmation",
      params: { charId, squadId }
    })
  }

  const cancel = () => {
    actions.reset()
    router.back()
  }

  return (
    <ModalBody>
      <Row style={styles.extend}>
        <ScrollSection title="catégories" style={styles.categories}>
          <Barter.Categories />
        </ScrollSection>
        <Spacer x={layout.globalPadding} />
        <ScrollSection style={styles.extend}>
          <Barter.ObjectsList />
        </ScrollSection>
        <Spacer x={layout.globalPadding} />
        <Col style={styles.mods}>
          <Search />
          <Barter.ModQuantity />
        </Col>
      </Row>
      <ModalCta onPressConfirm={next} onPressCancel={cancel} />
    </ModalBody>
  )
}
