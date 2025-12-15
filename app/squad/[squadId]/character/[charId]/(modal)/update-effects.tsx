import { StyleSheet, TouchableOpacity, View } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import { useCurrCharId } from "lib/character/character-store"
import { calculatedEffects } from "lib/character/effects/effects-utils"
import {
  useUpdateEffects,
  useUpdateEffectsAction
} from "lib/character/effects/update-effects-store"

import List from "components/List"
import ModalCta from "components/ModalCta/ModalCta"
import ScrollableSection from "components/ScrollableSection"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import TxtInput from "components/TxtInput"
import ViewSection from "components/ViewSection"
import MinusIcon from "components/icons/MinusIcon"
import PlusIcon from "components/icons/PlusIcon"
import ModalBody from "components/wrappers/ModalBody"
import { useCollectiblesData } from "providers/AdditionalElementsProvider"
import colors from "styles/colors"

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flex: 1
  },
  listSection: {
    flex: 1
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.primColor,
    paddingVertical: 8,
    padding: 5
  },
  listItemSelected: {
    backgroundColor: colors.terColor
  },
  searchSection: {
    width: 280,
    height: 90
  },
  addSection: {
    width: 280,
    flex: 1
  },
  iconsContainer: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center"
  }
})

export default function UpdateEffectsModal() {
  const { squadId } = useLocalSearchParams<{ squadId: string }>()
  const charId = useCurrCharId()

  const { effects } = useCollectiblesData()

  const actions = useUpdateEffectsAction()

  const searchValue = useUpdateEffects(state => state.searchValue)
  const selectedEffect = useUpdateEffects(state => state.selectedEffect)
  const newEffects = useUpdateEffects(state => state.newEffects)

  const onPressConfirm = () => {
    if (newEffects.length === 0) return
    router.push({
      pathname: "/squad/[squadId]/character/[charId]/update-effects-confirmation",
      params: { charId, squadId }
    })
  }

  const onPressCancel = () => {
    actions.reset()
    router.back()
  }

  const allEffects = Object.values(effects)
  const validEffects = allEffects.filter(e => !calculatedEffects.includes(e.type))
  const visibleEffects =
    searchValue.length > 2
      ? validEffects.filter(effect =>
          effect.label.toLowerCase().includes(searchValue.toLowerCase())
        )
      : []

  return (
    <ModalBody>
      <View style={styles.row}>
        <ScrollableSection title="LISTE" style={styles.listSection}>
          <List
            data={visibleEffects}
            keyExtractor={item => item.id}
            renderItem={({ item }) => {
              const isSelected = selectedEffect === item.id
              const hasEffect = newEffects.includes(item.id)
              return (
                <TouchableOpacity
                  onPress={() => actions.selectEffect(item.id)}
                  style={[styles.listItem, isSelected && styles.listItemSelected]}
                >
                  <Txt>{item.label}</Txt>
                  {hasEffect ? <Txt>{1}</Txt> : <Spacer x={10} />}
                </TouchableOpacity>
              )
            }}
          />
        </ScrollableSection>
        <Spacer x={15} />
        <View>
          <ViewSection title="RECHERCHE" style={styles.searchSection}>
            <TxtInput value={searchValue} onChangeText={e => actions.setSearch(e)} />
          </ViewSection>
          <ViewSection title="AJOUTER" style={styles.addSection}>
            <View style={styles.iconsContainer}>
              <MinusIcon onPress={actions.update} />
              <PlusIcon onPress={actions.update} />
            </View>
          </ViewSection>
        </View>
      </View>
      <ModalCta onPressConfirm={onPressConfirm} onPressCancel={onPressCancel} />
    </ModalBody>
  )
}
