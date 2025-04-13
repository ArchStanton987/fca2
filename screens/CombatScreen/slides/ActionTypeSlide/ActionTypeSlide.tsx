import { TouchableOpacity, View } from "react-native"

import Ionicons from "@expo/vector-icons/Ionicons"
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"
import actions from "lib/combat/const/actions"

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
import colors from "styles/colors"
import layout from "styles/layout"

import NextButton from "../NextButton"
import ActionInfo from "./info/ActionInfo"
import ApInfo from "./info/ApInfo"
import SubActionList from "./sub-action/SubActionList"

const actionTypes = Object.values(actions).map(a => ({ id: a.id, label: a.label }))

export default function ActionTypeSlide({ scrollNext }: SlideProps) {
  // const useCases = useGetUseCases()
  const { equipedObjects, unarmed, charId } = useCharacter()
  const weapons = equipedObjects.weapons.length > 0 ? equipedObjects.weapons : [unarmed]

  // const currFightId = status.currentCombatId ?? ""
  // const currFight = useRtdbSub(useCases.combat.sub({ id: currFightId }))

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

  const onPressWait = () => {
    // if (!currFight || !actionType) return
    // const payload = {
    //   combatId: currFightId,
    //   roundId: getCurrentRoundId(currFight).toString(),
    //   newActionId: (getCurrentRoundId(currFight) + 1).toString(),
    //   payload: { actionType: "pause", actor: charId, apCost: 0, actionSubtype: "" }
    // }
    // useCases.combat.addAction(payload)
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
