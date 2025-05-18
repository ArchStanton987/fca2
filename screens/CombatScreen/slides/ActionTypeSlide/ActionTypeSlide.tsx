import { TouchableOpacity, View } from "react-native"

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"
import { Action, PrepareActionType } from "lib/combat/combats.types"
import actions from "lib/combat/const/actions"
import { getActivePlayersWithAp } from "lib/combat/utils/combat-utils"
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
import PlayButton from "../PlayButton"
import ActionInfo from "./info/ActionInfo"
import ApInfo from "./info/ApInfo"
import SubActionList from "./sub-action/SubActionList"

const actionTypes = Object.values(actions).map(a => ({ id: a.id, label: a.label }))

export default function ActionTypeSlide({ scrollNext }: SlideProps) {
  const useCases = getUseCases()
  const { players, npcs, combat } = useCombat()
  const char = useCharacter()
  const { equipedObjects, unarmed, charId, status } = char
  const weapons = equipedObjects.weapons.length > 0 ? equipedObjects.weapons : [unarmed]

  const form = useActionForm()
  const { actionType, actionSubtype, isCombinedAction, itemId } = form
  const { setForm, setActionType } = useActionApi()

  const currAction = { actionType, actionSubtype, actorId: charId }

  const contenders = { ...players, ...npcs }
  const activePlayersWithAp = getActivePlayersWithAp(contenders)
  const isLastPlayer = activePlayersWithAp.length === 1

  const onPressActionType = (id: keyof typeof actions) => {
    if (id === "weapon") {
      setActionType({ actionType: id, itemId: weapons[0].dbKey })
      return
    }
    setActionType({ actionType: id })
  }

  const onPressWait = async () => {
    if (!combat || !players || !npcs) throw new Error("No combat found")
    const action: Action = { actionType, actorId: charId }
    try {
      await useCases.combat.doCombatAction({ combat, contenders, action })
      Toast.show({ type: "custom", text1: "Pigé ! On se tient prêt !" })
    } catch (error) {
      console.log("error", error)
      Toast.show({ type: "error", text1: "Erreur lors de l'enregistrement de l'action" })
    }
  }

  const onPressPrepare = async () => {
    if (!combat || !players || !npcs || actionType !== "prepare") throw new Error("No combat found")
    const action = {
      actionType,
      actionSubtype: actionSubtype as PrepareActionType,
      actorId: charId,
      apCost: status.currAp
    }
    await useCases.combat.doCombatAction({ combat, contenders, action })
  }

  const onPressMovement = () => {
    if (!combat || !players || !npcs) throw new Error("No combat found")
    useCases.combat.updateAction({ combat, payload: currAction })
    if (!scrollNext) throw new Error("No scrollNext function found")
    scrollNext()
  }

  const submit = async () => {
    if (form.actionType === "wait") return onPressWait()
    if (form.actionType === "prepare") return onPressPrepare()
    if (form.actionType === "movement") return onPressMovement()
    if (!scrollNext) throw new Error("No scrollNext function found")
    scrollNext()
    return null
  }

  const isPause = actionType === "wait"
  const isPrepare = actionType === "prepare"
  const canGoNext =
    actionType === "item"
      ? !!actionType && !!actionSubtype && !!itemId
      : !!actionType && !!actionSubtype

  const canCombineAction = actionType !== "wait" && actionType !== "prepare"

  const toggleCombinedAction = () => {
    if (!canCombineAction) return
    const newValue = !isCombinedAction
    setForm({ isCombinedAction: newValue })
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

      <View style={{ width: 175 }}>
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
              {isPrepare || isPause ? (
                <PlayButton onPress={() => submit()} disabled={isPause && isLastPlayer} />
              ) : (
                <NextButton disabled={!canGoNext} onPress={() => submit()} />
              )}
            </Row>
          </Section>
        </Row>
      </View>
    </DrawerSlide>
  )
}
