import { useState } from "react"
import { TouchableOpacity, View } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import effectsMap from "lib/character/effects/effects"
import { EffectId } from "lib/character/effects/effects.types"

import { DrawerParams } from "components/Drawer/Drawer.params"
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
import routes from "constants/routes"
import ScreenParams, { SearchParams } from "screens/ScreenParams"

import styles from "./UpdateEffectsModal.styles"

const effects = Object.values(effectsMap)

export default function UpdateEffectsModal() {
  const localParams = useLocalSearchParams<SearchParams<DrawerParams>>()
  const { squadId, charId } = ScreenParams.fromLocalParams(localParams)
  const [searchValue, setSearchValue] = useState("")
  const [selectedEffectId, setSelectedEffectId] = useState<EffectId | null>(null)
  const [effectsToAdd, setEffectsToAdd] = useState<EffectId[]>([])

  const onPressEffect = (effectId: EffectId) => {
    setSelectedEffectId(prev => (prev === effectId ? null : effectId))
  }

  const onPressPlus = () => {
    if (!selectedEffectId) return
    if (effectsToAdd.includes(selectedEffectId)) return
    setEffectsToAdd(prev => [...prev, selectedEffectId])
  }

  const onPressMinus = () => {
    if (!selectedEffectId) return
    if (!effectsToAdd.includes(selectedEffectId)) return
    setEffectsToAdd(prev => prev.filter(effectId => effectId !== selectedEffectId))
  }

  const onPressConfirm = () => {
    if (effectsToAdd.length === 0) return
    router.push({
      pathname: `${routes.modal.updateEffectsConfirmation}`,
      params: { charId, squadId, effectsToAdd }
    })
  }

  const visibleEffects =
    searchValue.length > 2
      ? effects.filter(effect => effect.label.toLowerCase().includes(searchValue.toLowerCase()))
      : []

  return (
    <ModalBody>
      <View style={styles.row}>
        <ScrollableSection title="LISTE" style={styles.listSection}>
          <List
            data={visibleEffects}
            keyExtractor={item => item.id}
            renderItem={({ item }) => {
              const isSelected = selectedEffectId === item.id
              const count = effectsToAdd.filter(el => el === item.id).length
              return (
                <TouchableOpacity
                  onPress={() => onPressEffect(item.id)}
                  style={[styles.listItem, isSelected && styles.listItemSelected]}
                >
                  <Txt>{item.label}</Txt>
                  {count > 0 ? <Txt>{count}</Txt> : <Spacer x={10} />}
                </TouchableOpacity>
              )
            }}
          />
        </ScrollableSection>
        <Spacer x={15} />
        <View>
          <ViewSection title="RECHERCHE" style={styles.searchSection}>
            <TxtInput value={searchValue} onChangeText={e => setSearchValue(e)} />
          </ViewSection>
          <ViewSection title="AJOUTER" style={styles.addSection}>
            <View style={styles.iconsContainer}>
              <MinusIcon onPress={onPressMinus} />
              <PlusIcon onPress={onPressPlus} />
            </View>
          </ViewSection>
        </View>
      </View>
      <ModalCta onPressConfirm={onPressConfirm} />
    </ModalBody>
  )
}
