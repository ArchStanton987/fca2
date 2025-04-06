import { Pressable, TouchableOpacity, View } from "react-native"

import AntDesign from "@expo/vector-icons/AntDesign"
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
  const { equipedObjects, unarmed, status, secAttr } = useCharacter()
  const weapons = equipedObjects.weapons.length > 0 ? equipedObjects.weapons : [unarmed]

  const { actionType, actionSubtype, weapon } = useActionForm()
  const { setForm } = useActionApi()

  const onPressActionType = (actionId: keyof typeof actions) => {
    const payload: Partial<ActionStateContext> = { ...defaultForm, actionType: actionId }
    if (actionId === "weapon") {
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

  const onPressSubtype = (str: string) => {
    const payload: Partial<ActionStateContext> = { ...defaultForm, actionType, actionSubtype: str }
    setForm(payload)
  }

  const isWeapon = actionType === "weapon" && !!weapon?.id
  const isMovement = actionType === "movement"
  const isItem = actionType === "item"
  const isPause = actionType === "pause"
  const isOther = actionType === "other"
  const canGoNext = !!actionType && !!actionSubtype

  return (
    <DrawerSlide>
      <ScrollSection style={{ width: 150 }} title="type d'action">
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
      <Spacer x={layout.globalPadding} />

      {!actionType || isPause ? <SectionSpacer /> : null}
      {isWeapon ? <WeaponActions selectedWeapon={weapon.dbKey} onPress={onPressSubtype} /> : null}
      {isMovement ? (
        <MovementActions selectedAction={actionSubtype} onPress={onPressSubtype} />
      ) : null}
      {isItem ? <ItemActions selectedAction={actionSubtype} onPress={onPressSubtype} /> : null}
      {isOther ? <OtherAction /> : null}

      <Spacer x={layout.globalPadding} />

      <View style={{ width: 170 }}>
        <ScrollSection style={{ flex: 1 }} title="info">
          {isWeapon ? (
            <Pressable onPress={toggleWeapon} disabled={weapons.length < 2}>
              <WeaponInfo selectedWeapon={weapon.dbKey} />
            </Pressable>
          ) : null}
          {isMovement ? <HealthFigure /> : null}
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
                  <AntDesign name="pausecircle" size={36} color={colors.secColor} />
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
