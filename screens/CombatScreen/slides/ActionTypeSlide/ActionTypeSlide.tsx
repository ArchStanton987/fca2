import { TouchableOpacity, View } from "react-native"

import Ionicons from "@expo/vector-icons/Ionicons"
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"
import actions from "lib/combat/const/actions"
import { getCurrentActionId, getCurrentRoundId } from "lib/combat/utils/combat-utils"
import getUseCases from "lib/get-use-cases"
import Toast from "react-native-toast-message"

import List from "components/List"
import ListItemSelectable from "components/ListItemSelectable"
import Row from "components/Row"
import Section from "components/Section"
import ScrollSection from "components/Section/ScrollSection"
import DrawerSlide from "components/Slides/DrawerSlide"
import { SlideProps } from "components/Slides/Slide.types"
import Spacer from "components/Spacer"
import { useCharacter } from "contexts/CharacterContext"
import { useActionApi, useActionForm } from "providers/ActionProvider"
import { useCombat } from "providers/CombatProvider"
import colors from "styles/colors"
import layout from "styles/layout"

import NextButton from "../NextButton"
import ActionInfo from "./info/ActionInfo"
import ApInfo from "./info/ApInfo"
import SubActionList from "./sub-action/SubActionList"

const actionTypes = Object.values(actions).map(a => ({ id: a.id, label: a.label }))

export default function ActionTypeSlide({ scrollNext }: SlideProps) {
  const useCases = getUseCases()
  const combatContext = useCombat()
  const { equipedObjects, unarmed, charId } = useCharacter()
  const weapons = equipedObjects.weapons.length > 0 ? equipedObjects.weapons : [unarmed]

  const form = useActionForm()
  const { actionType, actionSubtype, nextActorId } = form
  const { setForm, setActionType } = useActionApi()

  const onPressActionType = (id: keyof typeof actions) => {
    if (id === "weapon") {
      setActionType({ actionType: id, itemId: weapons[0].dbKey })
      return
    }
    setActionType({ actionType: id })
  }

  const onPressWait = async () => {
    const { players, enemies, combat } = combatContext
    if (!combat || !players || !enemies || actionType !== "pause") return
    const payload = {
      combatId: combat.id,
      roundId: getCurrentRoundId(combat),
      actionId: getCurrentActionId(combat),
      players,
      enemies,
      action: { actionType, actorId: charId }
    }
    try {
      await useCases.combat.waitAction(payload)
      Toast.show({ type: "custom", text1: "Pigé ! On se tient prêt !" })
    } catch (error) {
      console.log("error", error)
      Toast.show({ type: "error", text1: "Erreur lors de l'enregistrement de l'action" })
    }
  }

  const isCombinedAction = nextActorId === charId

  const isPause = actionType === "pause"
  const isPrepare = actionType === "prepare"
  const canGoNext = !!actionType && !!actionSubtype

  const canCombineAction = actionType !== "pause" && actionType !== "prepare"

  const toggleCombinedAction = () => {
    if (!canCombineAction) return
    setForm({ nextActorId: nextActorId === charId ? "" : charId })
  }

  return (
    <DrawerSlide>
      <View style={{ width: 150 }}>
        <Section title="action combinee">
          <Row style={{ alignItems: "center", justifyContent: "center" }}>
            <TouchableOpacity onPress={toggleCombinedAction} disabled={!canCombineAction}>
              <MaterialCommunityIcons
                name={isCombinedAction ? "check-decagram-outline" : "decagram-outline"}
                size={30}
                color={canCombineAction ? colors.secColor : colors.terColor}
              />
            </TouchableOpacity>
          </Row>
        </Section>
        <Spacer y={layout.globalPadding} />
        <ScrollSection style={{ flex: 1 }} title="type d'action">
          <List
            data={actionTypes}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <ListItemSelectable
                onPress={() => onPressActionType(item.id)}
                label={item.label}
                isSelected={actionType === item.id}
              />
            )}
          />
        </ScrollSection>
      </View>
      <Spacer x={layout.globalPadding} />

      <SubActionList />

      <Spacer x={layout.globalPadding} />

      <View style={{ width: 170 }}>
        <ScrollSection style={{ flex: 1 }} title="info">
          <ActionInfo />
        </ScrollSection>

        <Spacer y={layout.globalPadding} />

        <Row>
          <Section title="pa" style={{ flex: 1 }}>
            <Row style={{ justifyContent: "center" }}>
              <ApInfo />
            </Row>
          </Section>

          <Spacer x={layout.globalPadding} />

          <Section title={isPause || isPrepare ? "valider" : "suivant"} style={{ flex: 1 }}>
            <Row style={{ justifyContent: "center" }}>
              {isPause ? (
                <TouchableOpacity onPress={() => onPressWait()}>
                  <Ionicons name="pause-circle" size={36} color={colors.secColor} />
                </TouchableOpacity>
              ) : (
                <NextButton disabled={!canGoNext} onPress={scrollNext} />
              )}
            </Row>
          </Section>
        </Row>
      </View>
    </DrawerSlide>
  )
}
