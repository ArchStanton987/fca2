import { Pressable, StyleSheet } from "react-native"

import { GMDamageEntry } from "lib/combat/combats.types"

import Col from "components/Col"
import Row from "components/Row"
import SelectorButton from "components/SelectorButton"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import TxtInput from "components/TxtInput"
import { useCombat } from "providers/CombatProvider"
import { useDamageFormApi } from "providers/DamageFormProvider"
import DeleteButton from "screens/CombatScreen/slides/DeleteButton"
import colors from "styles/colors"

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "transparent",
    padding: 3,
    alignItems: "center",
    gap: 3
  },
  selected: {
    borderColor: colors.secColor
  },
  locCol: {
    width: 100
  },
  dmgCol: {
    width: 40
  },
  input: {
    paddingRight: 5
  }
})

type HealthChangeEntryProps = {
  entry: GMDamageEntry & { id: string }
  selectEntry: () => void
  onPressChar: () => void
  onPressLocalization: () => void
  isSelected: boolean
}

export default function HealthChangeEntry({
  entry,
  selectEntry,
  onPressLocalization,
  onPressChar,
  isSelected
}: HealthChangeEntryProps) {
  const { players, npcs } = useCombat()
  const contenders = { ...players, ...npcs }

  const { toggleEntryType, setEntry, deleteEntry } = useDamageFormApi()

  const withSelectEntry = (cb: () => void) => {
    selectEntry()
    cb()
  }

  const onChangeEntry = (field: "duration" | "damage", value: string) => {
    setEntry(entry.id, { [field]: Number(value) })
  }

  if (entry.entryType === "hp") {
    const { charId, localization, damage, entryType, id } = entry
    const contender = contenders[charId]
    const charName = contender?.char?.meta?.firstname ?? ""
    const initHp = contender?.char?.status[localization] ?? ""

    return (
      <Row style={[styles.container, isSelected && styles.selected]}>
        <Col>
          <Txt>type</Txt>
          <SelectorButton
            isSelected={false}
            label={entryType}
            onPress={() => withSelectEntry(() => toggleEntryType(id))}
            style={{ height: 30 }}
          />
        </Col>
        <Col style={{ flex: 1 }}>
          <Txt>char</Txt>
          <TxtInput
            style={styles.input}
            value={charName}
            onFocus={() => withSelectEntry(onPressChar)}
            onPress={() => withSelectEntry(onPressChar)}
          />
        </Col>
        <Pressable style={styles.locCol}>
          <Txt>Loc</Txt>
          <TxtInput
            style={styles.input}
            value={localization}
            onFocus={() => withSelectEntry(onPressLocalization)}
            onPress={() => withSelectEntry(onPressLocalization)}
          />
        </Pressable>
        <Col style={styles.dmgCol}>
          <Txt>init</Txt>
          <TxtInput style={styles.input} editable={false} value={initHp.toString()} />
        </Col>
        <Col style={styles.dmgCol}>
          <Txt>dmg</Txt>
          <TxtInput
            style={styles.input}
            value={damage.toString()}
            onChangeText={e => withSelectEntry(() => onChangeEntry("damage", e))}
          />
        </Col>
        <Col style={styles.dmgCol}>
          <Txt>new</Txt>
          <TxtInput style={styles.input} value={(initHp - damage).toString()} />
        </Col>
        <Spacer x={10} />
        <Col>
          <DeleteButton onPress={() => deleteEntry(id)} />
        </Col>
      </Row>
    )
  }

  const { id, duration, charId, entryType } = entry
  const contender = contenders[charId]
  if (!contender) return null
  const charName = contender?.char?.meta?.firstname ?? ""

  return (
    <Row style={[styles.container, isSelected && styles.selected]}>
      <Col>
        <Txt>type</Txt>
        <SelectorButton
          isSelected={false}
          label={entryType}
          onPress={() => withSelectEntry(() => toggleEntryType(id))}
          style={{ height: 30 }}
        />
      </Col>
      <Col style={{ flex: 1 }}>
        <Txt>char</Txt>
        <TxtInput
          style={styles.input}
          value={charName}
          onPress={() => withSelectEntry(onPressChar)}
        />
      </Col>
      <Col>
        <Txt>duration</Txt>
        <TxtInput
          value={duration.toString()}
          onChangeText={e => withSelectEntry(() => onChangeEntry("duration", e))}
        />
      </Col>
      <Spacer x={10} />
      <Col>
        <DeleteButton onPress={() => deleteEntry(id)} />
      </Col>
    </Row>
  )
}
