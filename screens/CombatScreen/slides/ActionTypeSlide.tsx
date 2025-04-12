import { Pressable, TouchableOpacity, View } from "react-native"

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
import Txt from "components/Txt"
import HealthFigure from "components/draws/HealthFigure/HealthFigure"
import { useCharacter } from "contexts/CharacterContext"
import { useActionApi, useActionForm } from "providers/ActionProvider"
import colors from "styles/colors"
import layout from "styles/layout"

import ItemActions from "./ItemActions"
import ItemsActionInfo from "./ItemsActionInfo"
import MovementActions from "./MovementActions"
import NextButton from "./NextButton"
import OtherAction from "./OtherAction"
import PrepareActions from "./PrepareActions"
import WeaponActions from "./WeaponActions"
import WeaponInfo from "./WeaponInfo"

const actionTypes = Object.values(actions).map(a => ({ id: a.id, label: a.label }))

function SectionSpacer() {
  return (
    <Section style={{ flex: 1 }}>
      <Spacer fullspace />
    </Section>
  )
}

export default function ActionTypeSlide({ scrollNext }: SlideProps) {
  // const useCases = useGetUseCases()
  const { equipedObjects, unarmed, status, secAttr, charId } = useCharacter()
  const weapons = equipedObjects.weapons.length > 0 ? equipedObjects.weapons : [unarmed]

  // const currFightId = status.currentCombatId ?? ""
  // const currFight = useRtdbSub(useCases.combat.sub({ id: currFightId }))

  const form = useActionForm()
  const { actionType, actionSubtype, itemId, nextActorId } = form
  const { setForm, setActionType, setActionSubtype } = useActionApi()

  const onPressActionType = (id: keyof typeof actions) => {
    if (id === "weapon") {
      setActionType({ actionId: id, itemId: weapons[0].dbKey })
    }
    setActionType({ actionId: id })
  }

  const toggleWeapon = () => {
    if (weapons.length < 2) return
    const currentIndex = weapons.findIndex(w => w.dbKey === itemId)
    const nextIndex = (currentIndex + 1) % weapons.length
    setForm({ itemId: weapons[nextIndex].dbKey })
  }

  const toggleCombinedAction = () => {
    setForm({ nextActorId: nextActorId === charId ? "" : charId })
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

  const isWeapon = actionType === "weapon"
  const isMovement = actionType === "movement"
  const isItem = actionType === "item"
  const isPause = actionType === "pause"
  const isPrepare = actionType === "prepare"
  const isOther = actionType === "other"
  const canGoNext = !!actionType && !!actionSubtype

  return (
    <DrawerSlide>
      <View style={{ width: 150 }}>
        <Section title="action combinee">
          <Row style={{ alignItems: "center", justifyContent: "center" }}>
            <TouchableOpacity onPress={toggleCombinedAction}>
              <MaterialCommunityIcons
                name={isCombinedAction ? "check-decagram-outline" : "decagram-outline"}
                size={30}
                color={colors.secColor}
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

      {!actionType || isPause ? <SectionSpacer /> : null}
      {isWeapon ? <WeaponActions selectedWeapon={itemId} onPress={setActionSubtype} /> : null}
      {isMovement ? (
        <MovementActions selectedAction={actionSubtype} onPress={setActionSubtype} />
      ) : null}
      {isItem ? <ItemActions selectedAction={actionSubtype} onPress={setActionSubtype} /> : null}
      {isPrepare ? (
        <PrepareActions selectedAction={actionSubtype} onPress={setActionSubtype} />
      ) : null}
      {isOther ? <OtherAction /> : null}

      <Spacer x={layout.globalPadding} />

      <View style={{ width: 170 }}>
        <ScrollSection style={{ flex: 1 }} title="info">
          {isWeapon && itemId ? (
            <Pressable onPress={toggleWeapon} disabled={weapons.length < 2}>
              <WeaponInfo selectedWeapon={itemId} />
            </Pressable>
          ) : null}
          {isMovement ? <HealthFigure /> : null}
          {isItem ? <ItemsActionInfo /> : null}
          {isPause ? (
            <Txt>
              Conservez vos points d&apos;action et attendez le bon moment pour agir au cours du
              round.
            </Txt>
          ) : null}
          {isOther ? (
            <Txt>
              Pour toutes les actions qui ne sont pas explicitement prévues dans l&apos;interface du
              pipboy. Cela permet d&apos;en garder une trace en archive pour vous souvenir de vos
              actions héroïques, ou pour aider des archéologues à reconstituer votre mort.
            </Txt>
          ) : null}

          {isPrepare && actionSubtype === "dangerAwareness" ? (
            <Txt>
              Dépensez ce qu&apos;il vous reste de points d&apos;action pour mieux faire face au
              danger. Pour le prochain round, vous gagnez autant de classe d&apos;armure (CA) que
              vous dépensez de points d&apos;action (PA).
            </Txt>
          ) : null}
          {isPrepare && actionSubtype === "visualize" ? (
            <Txt>
              Dépensez ce qu&apos;il vous reste de points d&apos;action (PA) pour mieux réussir
              votre prochaine action. Pour chaque PA dépensé, vous gagnez un bonus de +2 au score de
              votre prochaine action.
            </Txt>
          ) : null}
        </ScrollSection>

        <Spacer y={layout.globalPadding} />

        <Row>
          <Section title="pa" style={{ flex: 1 }}>
            <Row style={{ justifyContent: "center" }}>
              <Txt style={{ fontSize: 20 }}>
                {status.currAp} / {secAttr.curr.actionPoints}
              </Txt>
            </Row>
          </Section>

          <Spacer x={layout.globalPadding} />

          <Section title={isPause ? "valider" : "suivant"} style={{ flex: 1 }}>
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
