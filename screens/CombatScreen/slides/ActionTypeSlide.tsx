import { TouchableOpacity, View } from "react-native"

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

const actionTypes = Object.values(actions).map(a => ({ id: a.id, label: a.label }))

export default function ActionTypeSlide({ scrollNext }: SlideProps) {
  const { equipedObjects, unarmed } = useCharacter()
  const weapons = equipedObjects.weapons.length > 0 ? equipedObjects.weapons : [unarmed]

  const { actionType, actionSubtype, weapon } = useActionForm()
  const { setForm } = useActionApi()

  const onPressActionType = (actionId: keyof typeof actions) => {
    const payload: Partial<ActionStateContext> = { ...defaultForm, actionType: actionId }
    if (actionId === "weapon") {
      const nextIndex = (weapons.findIndex(w => w.dbKey === weapon?.dbKey) + 1) % weapons.length
      payload.weapon = { id: weapons[nextIndex].id, dbKey: weapons[nextIndex].dbKey }
    }
    setForm(payload)
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
      <ScrollSection style={{ width: 130 }} title="type d'action">
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

      {isWeapon ? <WeaponActions selectedWeapon={weapon.dbKey} onPress={onPressSubtype} /> : null}
      {isMovement ? (
        <MovementActions selectedAction={actionSubtype} onPress={onPressSubtype} />
      ) : null}
      {isItem ? <ItemActions selectedAction={actionSubtype} onPress={onPressSubtype} /> : null}
      {isOther ? <OtherAction /> : null}

      <Spacer x={layout.globalPadding} />

      <View style={{ width: 160 }}>
        {/* <ScrollSection style={{ flex: 1 }} title={infoTitle} onPressTitle={toggleWeapon}> */}
        {/* WEAPON CARD */}
        {/* {isWeapon ? <WeaponInfo selectedWeapon={weapon.dbKey} /> : null} */}
        {/* </ScrollSection> */}

        <Spacer y={layout.globalPadding} />

        <Section title={isPause ? "valider" : "suivant"}>
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
      </View>
    </DrawerSlide>
  )
}
