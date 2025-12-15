/* eslint-disable import/prefer-default-export */
import { useCurrCharId } from "lib/character/character-store"
import { limbsMap } from "lib/character/health/Health"
import { useCurrHp, useHealth, useLimbHp, useRads } from "lib/character/health/health-provider"
import { LimbId } from "lib/character/health/health.const"
import {
  useUpdateHealthActions,
  useUpdateHealthAmount,
  useUpdateHealthCategory,
  useUpdateHealthCurrHp,
  useUpdateHealthLimb,
  useUpdateHealthRads,
  useUpdateHealthSelectedLimb
} from "lib/character/health/update-health-store"
import { useExp } from "lib/character/progress/exp-provider"
import { getLevelAndThresholds } from "lib/character/status/status-calc"

import AmountSelector from "components/AmountSelector"
import List from "components/List"
import Row from "components/Row"
import Selectable from "components/Selectable"
import Txt from "components/Txt"
import MinusIcon from "components/icons/MinusIcon"
import PlusIcon from "components/icons/PlusIcon"

import styles from "./UpdateHealthComponents.styles"

type ListItemProps = {
  element: string
  current: string | number
  mod: string | number
  prevision: string | number
}

function ListItem({ element, current, mod, prevision }: ListItemProps) {
  return (
    <Row style={styles.listItemContainer}>
      <Txt style={styles.listItemLabel}>{element}</Txt>
      <Txt style={styles.listItemInfo}>{current}</Txt>
      <Txt style={styles.listItemInfo}>{mod}</Txt>
      <Txt style={styles.listItemInfo}>{prevision}</Txt>
    </Row>
  )
}

function ListItemHeader() {
  return <ListItem element="Element" current="Avant" mod="Mod" prevision="Prev" />
}

function Rads() {
  const charId = useCurrCharId()
  const { data: init } = useRads(charId)
  const mod = useUpdateHealthRads()
  return <ListItem element="RADS" current={init} mod={mod} prevision={init + mod} />
}

function CurrHp() {
  const charId = useCurrCharId()
  const { data: init } = useCurrHp(charId)
  const mod = useUpdateHealthCurrHp()
  return <ListItem element="PV" current={init} mod={mod} prevision={init + mod} />
}

function Limb({ limbId }: { limbId: LimbId }) {
  const charId = useCurrCharId()
  const actions = useUpdateHealthActions()
  const selectedLimb = useUpdateHealthSelectedLimb()
  const { data: currLimbHp } = useLimbHp(charId, limbId)
  const limbMod = useUpdateHealthLimb(limbId)
  return (
    <Selectable
      onPress={() => actions.selectLimb(limbId)}
      isSelected={selectedLimb === limbId}
      style={styles.listItemContainer}
    >
      <Txt style={styles.listItemLabel}>{limbsMap[limbId].label}</Txt>
      <Txt style={styles.listItemInfo}>{currLimbHp}</Txt>
      <Txt style={styles.listItemInfo}>{limbMod}</Txt>
      <Txt style={styles.listItemInfo}>{currLimbHp ?? 0 + limbMod}</Txt>
    </Selectable>
  )
}
function Limbs() {
  const charId = useCurrCharId()
  const { data: limbs } = useHealth(charId, health => Object.keys(health.limbs) as LimbId[])
  return (
    <List data={limbs} keyExtractor={l => l} renderItem={({ item }) => <Limb limbId={item} />} />
  )
}

function ElementList() {
  const category = useUpdateHealthCategory()
  return (
    <>
      <ListItemHeader />
      {category === "currHp" ? <CurrHp /> : null}
      {category === "rads" ? <Rads /> : null}
      {category === "limbs" ? <Limbs /> : null}
    </>
  )
}

function HealthUpdateButtons() {
  const charId = useCurrCharId()

  const { data: exp } = useExp(charId)
  const { level } = getLevelAndThresholds(exp)

  const actions = useUpdateHealthActions()
  const { data: health } = useHealth(charId)
  const category = useUpdateHealthCategory()
  const selectedLimb = useUpdateHealthSelectedLimb()

  const onPressIcon = (sign: "plus" | "minus") => {
    let init = 0
    let catMaxHp = health.maxHp
    if (category === "rads") init = health.rads
    else if (category === "currHp") init = health.currHp
    else if (!selectedLimb) throw new Error("No limb selected")
    else {
      catMaxHp = limbsMap[selectedLimb].getMaxValue(level)
      init = health.limbs[selectedLimb] ?? 0
    }
    actions.onPressMod(sign, init, catMaxHp)
  }
  return (
    <>
      <MinusIcon size={62} onPress={() => onPressIcon("minus")} />
      <PlusIcon size={62} onPress={() => onPressIcon("plus")} />
    </>
  )
}

function AmountsList() {
  const selectedAmount = useUpdateHealthAmount()
  const actions = useUpdateHealthActions()
  return (
    <List
      data={[1, 5, 20, 100]}
      keyExtractor={item => item.toString()}
      renderItem={({ item }) => (
        <AmountSelector
          value={item}
          isSelected={selectedAmount === item}
          onPress={() => actions.selectAmount(item)}
        />
      )}
      style={{
        flexDirection: "row",
        justifyContent: "space-evenly"
      }}
    />
  )
}

const categories = [
  { id: "currHp" as const, label: "PV globaux" },
  { id: "limbs" as const, label: "PV membres" },
  { id: "rads" as const, label: "Rads" }
]

function CategoryList() {
  const selectedCategory = useUpdateHealthCategory()
  const actions = useUpdateHealthActions()
  return (
    <List
      data={categories}
      keyExtractor={c => c.id}
      renderItem={({ item }) => (
        <Selectable
          isSelected={selectedCategory === item.id}
          onPress={() => actions.selectCategory(item.id)}
        >
          <Txt>{item.label}</Txt>
        </Selectable>
      )}
    />
  )
}

const UpdateHealthComponents = {
  ElementList,
  HealthUpdateButtons,
  AmountsList,
  CategoryList
}

export default UpdateHealthComponents
