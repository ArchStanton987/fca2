import { Pressable } from "react-native"

import { LimbsHp } from "lib/character/health/health-types"

import Col from "components/Col"
import Row from "components/Row"
import SelectorButton from "components/SelectorButton"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import TxtInput from "components/TxtInput"
import { useCombat } from "providers/CombatProvider"
import DeleteButton from "screens/CombatScreen/slides/DeleteButton"

import CharName from "./CharName"
import styles from "./DamageForm.styles"
import Localization from "./Localization"

type HealtEntryProps = {
  charId: string
  localization: keyof LimbsHp
  damage: string
  entryType: string
  id: string
  isSelected: boolean
}

export default function HealthEntry(props: HealtEntryProps) {
  const { charId, localization, damage, entryType, id, isSelected } = props

  const { players, npcs } = useCombat()
  const contenders = { ...players, ...npcs }
  const contender = contenders[charId]
  const initHp = contender?.char?.health.hp

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
        <CharName charId={charId} entryId={id} />
      </Col>
      <Pressable style={styles.locCol}>
        <Txt>Loc</Txt>
        <Localization entryId={id} />
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
