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
import {
  ActionStateContext,
  defaultActionForm as defaultForm,
  useActionApi,
  useActionForm
} from "providers/ActionProvider"
import colors from "styles/colors"
import layout from "styles/layout"

import ItemActions from "./ItemActions"
import ItemsActionInfo from "./ItemsActionInfo"
import MovementActions from "./MovementActions"
import NextButton from "./NextButton"
import OtherAction from "./OtherAction"
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
  const { equipedObjects, unarmed, status, secAttr, charId } = useCharacter()
  const weapons = equipedObjects.weapons.length > 0 ? equipedObjects.weapons : [unarmed]

  const { actionType, actionSubtype, weapon, nextActorId } = useActionForm()
  const { setForm } = useActionApi()

  const onPressActionType = (id: keyof typeof actions) => {
    const payload: Partial<ActionStateContext> = { ...defaultForm, nextActorId, actionType: id }
    if (id === "weapon") {
      payload.weapon = { id: weapons[0].id, dbKey: weapons[0].dbKey }
    }
    setForm(payload)
  }

  const toggleWeapon = () => {
    if (weapons.length < 2) return
    const currentIndex = weapons.findIndex(w => w.dbKey === weapon?.dbKey)
    const nextIndex = (currentIndex + 1) % weapons.length
    setForm({ weapon: { id: weapons[nextIndex].id, dbKey: weapons[nextIndex].dbKey } })
  }

  const onPressSubtype = (id: string) => {
    const payload: Partial<ActionStateContext> = {
      ...defaultForm,
      nextActorId,
      actionType,
      actionSubtype: id
    }
    setForm(payload)
  }

  const toggleCombinedAction = () => {
    setForm({ nextActorId: nextActorId === charId ? "" : charId })
  }

  const isCombinedAction = nextActorId === charId

  const isWeapon = actionType === "weapon"
  const isMovement = actionType === "movement"
  const isItem = actionType === "item"
  const isPause = actionType === "pause"
  const isOther = actionType === "other"
  const canGoNext = !!actionType && !!actionSubtype

  // TODO: add "prepare" actions to allow to spend AP to gain AC or bonus on next dice roll

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
      {isWeapon ? <WeaponActions selectedWeapon={weapon?.dbKey} onPress={onPressSubtype} /> : null}
      {isMovement ? (
        <MovementActions selectedAction={actionSubtype} onPress={onPressSubtype} />
      ) : null}
      {isItem ? <ItemActions selectedAction={actionSubtype} onPress={onPressSubtype} /> : null}
      {isOther ? <OtherAction /> : null}

      <Spacer x={layout.globalPadding} />

      <View style={{ width: 170 }}>
        <ScrollSection style={{ flex: 1 }} title="info">
          {isWeapon && weapon?.dbKey ? (
            <Pressable onPress={toggleWeapon} disabled={weapons.length < 2}>
              <WeaponInfo selectedWeapon={weapon.dbKey} />
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
                <TouchableOpacity>
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
