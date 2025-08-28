import { ReactNode } from "react"
import { Pressable, StyleSheet } from "react-native"

import Col from "components/Col"
import List from "components/List"
import Row from "components/Row"
import SelectorButton from "components/SelectorButton"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import {
  useDamageEntry,
  useDamageFormActions,
  useDamageFormStore
} from "providers/DamageFormProvider"
import DeleteButton from "screens/CombatScreen/slides/DeleteButton"
import colors from "styles/colors"

import CharInput from "./inputs/CharInput"
import DmgInput from "./inputs/DmgInput"
import DurationInput from "./inputs/DurationInput"
import EffectInput from "./inputs/EffectInput"
import InitHpInput from "./inputs/InitHpInput"
import LocInput from "./inputs/LocInput"
import NewHpInput from "./inputs/NewHpInput"
import RadsInput from "./inputs/RadsInput"

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
    width: 30
  },
  input: {
    paddingRight: 5
  }
})

function Container({ id, children }: { id: number; children: ReactNode }) {
  const selectedEntry = useDamageFormStore(state => state.selectedEntry)
  const isSelected = selectedEntry === id
  return <Row style={[styles.container, isSelected && styles.selected]}>{children}</Row>
}

function SharedEntry({ id, label }: { id: number; label: string }) {
  const actions = useDamageFormActions()
  const selectedEntry = useDamageFormStore(state => state.selectedEntry)
  const isSelected = selectedEntry === id

  const toggleType = () => {
    if (!isSelected) {
      actions.selectEntry(id)
    }
    actions.toggleEntryType()
  }
  return (
    <>
      <Col>
        <Txt>type</Txt>
        <SelectorButton
          isSelected={false}
          label={label}
          onPress={toggleType}
          style={{ height: 30 }}
        />
      </Col>
      <Col style={{ flex: 1 }}>
        <Txt>char</Txt>
        <CharInput entryId={id} />
      </Col>
    </>
  )
}
function Delete({ id }: { id: number }) {
  const actions = useDamageFormActions()
  return (
    <Col>
      <DeleteButton onPress={() => actions.deleteEntry(id)} />
    </Col>
  )
}

function HpEntry({ id }: { id: number }) {
  return (
    <Container id={id}>
      <SharedEntry id={id} label="hp" />
      <Pressable style={styles.locCol}>
        <Txt>Loc</Txt>
        <LocInput entryId={id} />
      </Pressable>
      <Col style={styles.dmgCol}>
        <Txt>init</Txt>
        <InitHpInput entryId={id} />
      </Col>
      <Col style={styles.dmgCol}>
        <Txt>dmg</Txt>
        <DmgInput entryId={id} />
      </Col>
      <Col style={styles.dmgCol}>
        <Txt>new</Txt>
        <NewHpInput entryId={id} />
      </Col>
      <Spacer x={10} />
      <Delete id={id} />
    </Container>
  )
}

function InactiveEntry({ id }: { id: number }) {
  return (
    <Container id={id}>
      <SharedEntry id={id} label="inact" />
      <Col>
        <Txt>duration</Txt>
        <DurationInput entryId={id} />
      </Col>
      <Spacer x={10} />
      <Delete id={id} />
    </Container>
  )
}

function RadsEntry({ id }: { id: number }) {
  return (
    <Container id={id}>
      <SharedEntry id={id} label="rads" />
      <Col>
        <Txt>rads</Txt>
        <RadsInput entryId={id} />
      </Col>
      <Spacer x={10} />
      <Delete id={id} />
    </Container>
  )
}

function EffectEntry({ id }: { id: number }) {
  return (
    <Container id={id}>
      <SharedEntry id={id} label="effect" />
      <Col>
        <Txt>effet</Txt>
        <EffectInput entryId={id} />
      </Col>
      <Spacer x={10} />
      <Delete id={id} />
    </Container>
  )
}

function DamageEntry({ id }: { id: number }) {
  const entry = useDamageEntry(id)

  if (entry.entryType === "hp") return <HpEntry id={id} />
  if (entry.entryType === "inactive") return <InactiveEntry id={id} />
  if (entry.entryType === "rads") return <RadsEntry id={id} />
  if (entry.entryType === "effect") return <EffectEntry id={id} />
  return null
}

export default function DamageEntries() {
  const entries = useDamageFormStore(state => state.entries)
  return (
    <List
      data={Object.entries(entries).map(([id, value]) => ({ id, ...value }))}
      keyExtractor={e => e.id}
      separator={<Spacer y={15} />}
      renderItem={({ item }) => <DamageEntry id={parseInt(item.id, 10)} />}
    />
  )
}
