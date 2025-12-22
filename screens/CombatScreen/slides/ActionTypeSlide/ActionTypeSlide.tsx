import { memo } from "react"
import { TouchableOpacity, View } from "react-native"

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"
import { useCurrCharId } from "lib/character/character-store"
import actions from "lib/combat/const/actions"
import WeaponIndicator from "lib/combat/ui/WeaponIndicator"
import { useCombatWeapons } from "lib/inventory/use-sub-inv-cat"

import List from "components/List"
import ListItemSelectable from "components/ListItemSelectable"
import Row from "components/Row"
import Section from "components/Section"
import ScrollSection from "components/Section/ScrollSection"
import DrawerSlide from "components/Slides/DrawerSlide"
import { SlideProps } from "components/Slides/Slide.types"
import Spacer from "components/Spacer"
import {
  useActionActorId,
  useActionApi,
  useActionType,
  useIsCombinedAction
} from "providers/ActionFormProvider"
import colors from "styles/colors"
import layout from "styles/layout"

import ActionTypeNextButton from "./ActionTypeNextButton"
import ActionInfo from "./info/ActionInfo"
import ApInfo from "./info/ApInfo"
import SubActionList from "./sub-action/SubActionList"

const actionTypes = Object.values(actions).map(a => ({ id: a.id, label: a.label }))

function ActionTypeSlide({ slideIndex }: SlideProps) {
  const charId = useCurrCharId()

  const formActorId = useActionActorId()
  const actionType = useActionType()
  const isCombinedAction = useIsCombinedAction()

  const { setForm, setActionType, setActorId } = useActionApi()

  const actorId = formActorId === "" ? charId : formActorId
  const weapons = useCombatWeapons(actorId)

  const onPressActionType = (id: keyof typeof actions) => {
    if (formActorId === "") {
      setActorId(actorId)
    }
    if (id === "weapon") {
      setActionType({ actionType: id, itemDbKey: weapons[0].dbKey })
      return
    }
    setActionType({ actionType: id })
  }

  const isPause = actionType === "wait"
  const isPrepare = actionType === "prepare"

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

      <SubActionList charId={actorId} />

      <Spacer x={layout.globalPadding} />

      <View style={{ width: 175 }}>
        {actionType === "weapon" ? (
          <WeaponIndicator style={{ flex: 1 }} contenderId={actorId} />
        ) : (
          <ScrollSection style={{ flex: 1 }} title="info">
            <ActionInfo charId={actorId} />
          </ScrollSection>
        )}

        <Spacer y={layout.globalPadding} />

        <Row>
          <Section title="pa" style={{ flex: 1 }}>
            <Row style={{ justifyContent: "center" }}>
              <ApInfo contenderId={actorId} />
            </Row>
          </Section>

          <Spacer x={layout.globalPadding} />

          <Section title={isPause || isPrepare ? "valider" : "suivant"} style={{ flex: 1 }}>
            <Row style={{ justifyContent: "center" }}>
              <ActionTypeNextButton charId={charId} slideIndex={slideIndex} />
            </Row>
          </Section>
        </Row>
      </View>
    </DrawerSlide>
  )
}

export default memo(ActionTypeSlide)
