import { View } from "react-native"

import actions from "lib/combat/const/actions"

import List from "components/List"
import ListItemSelectable from "components/ListItemSelectable"
import Row from "components/Row"
import Section from "components/Section"
import ScrollSection from "components/Section/ScrollSection"
import DrawerSlide from "components/Slides/DrawerSlide"
import { SlideProps } from "components/Slides/Slide.types"
import Spacer from "components/Spacer"
import { useActionApi, useActionForm } from "providers/ActionProvider"
import layout from "styles/layout"

import NextButton from "./NextButton"

const actionTypes = Object.values(actions).map(a => ({ id: a.id, label: a.label }))

export default function ActionTypeSlide({ scrollNext }: SlideProps) {
  // const { equipedObjects, unarmed } = useCharacter()
  // const weapons = equipedObjects.weapons.length > 0 ? equipedObjects.weapons : [unarmed]
  // const defaultWeapon = weapons[0]

  const { actionType } = useActionForm()
  const { setForm } = useActionApi()

  // const actionsSubTypes = actionType ? actions[actionType]?.subtypes : {}
  // const subtypes = Object.values(actionsSubTypes).map(s => ({ id: s.id, label: s.label }))

  // const toggleWeapon = () => {
  //   const nextIndex = (weapons.findIndex(w => w.dbKey === weapon?.dbKey) + 1) % weapons.length
  //   setForm("weapon", { id: weapons[nextIndex].id, dbKey: weapons[nextIndex].dbKey })
  // }

  const onPressActionType = (actionId: keyof typeof actions) => {
    // if (actionId === "weapon") {
    //   console.log("defaultWeapon", defaultWeapon)
    //   setForm("weapon", { id: defaultWeapon.id, dbKey: defaultWeapon.dbKey })
    // }
    setForm({ actionType: actionId })
  }

  // const isWeapon = actionType === "weapon" && !!weapon?.id
  // const infoTitle = isWeapon ? weaponsMap[weapon.id].label : "infos"
  // const canGoNext = !!actionType && !!actionSubtype
  const canGoNext = false

  return (
    <DrawerSlide>
      <ScrollSection style={{ width: 120 }} title="type d'action">
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

      {/* <ScrollSection style={{ flex: 1 }} title="action">
        {isWeapon ? <WeaponActions selectedWeapon={weapon.dbKey} /> : null}
      </ScrollSection> */}

      {/* <Spacer x={layout.globalPadding} /> */}

      <View style={{ width: 160 }}>
        {/* <ScrollSection style={{ flex: 1 }} title={infoTitle} onPressTitle={toggleWeapon}> */}
        {/* WEAPON CARD */}
        {/* {isWeapon ? <WeaponInfo selectedWeapon={weapon.dbKey} /> : null} */}
        {/* </ScrollSection> */}

        <Spacer y={layout.globalPadding} />

        <Section title="suivant">
          <Row style={{ justifyContent: "center" }}>
            <NextButton disabled={!canGoNext} onPress={scrollNext} />
          </Row>
        </Section>
      </View>
    </DrawerSlide>
  )
}
