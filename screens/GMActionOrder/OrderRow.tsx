import { StyleSheet, View } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import { useSetCurrCharId } from "lib/character/character-store"
import Animated, { FadingTransition } from "react-native-reanimated"

import CheckBox from "components/CheckBox/CheckBox"
import Col from "components/Col"
import ProgressionBar from "components/ProgressionBar/ProgressionBar"
import Row from "components/Row"
import Txt from "components/Txt"
import { useCombat } from "providers/CombatProvider"
import { useCombatStatus } from "providers/CombatStatusesProvider"
import colors from "styles/colors"

import CombatOrderText from "./CombatOrderText"

type OrderRowProps = {
  charId: string
  isPlaying?: boolean
  hasFinishedRound?: boolean
  isCombinedAction?: boolean
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center"
  },
  withBorder: {
    alignItems: "center",
    flex: 1,
    borderWidth: 2,
    borderColor: "transparent",
    padding: 5,
    flexDirection: "row"
  },
  checkboxCol: {
    width: 50,
    alignItems: "center",
    justifyContent: "center"
  },
  hpCol: {
    width: 80
  },
  nameCol: {
    flex: 1
  },
  dataRow: {
    width: 70,
    alignItems: "flex-end",
    justifyContent: "flex-end"
  },
  playing: {
    borderColor: colors.secColor
  }
})

const getColor = ({ hp, maxHp }: { hp: number; maxHp: number }) => {
  if (hp <= 0) return colors.red
  const currHpPercent = (hp / maxHp) * 100
  if (currHpPercent < 25) return colors.orange
  if (currHpPercent < 50) return colors.yellow
  return colors.secColor
}

export function OrderRowHeader() {
  return (
    <Row style={styles.container}>
      <Row style={styles.checkboxCol}>
        <Txt>Cur</Txt>
      </Row>
      <Row style={styles.nameCol}>
        <Txt>Nom</Txt>
      </Row>
      <Row style={styles.hpCol}>
        <Txt>HP</Txt>
      </Row>
      <Row style={styles.dataRow}>
        <Txt>AP</Txt>
      </Row>
      <Row style={styles.dataRow}>
        <Txt>Init.</Txt>
      </Row>
    </Row>
  )
}

export default function OrderRow(props: OrderRowProps) {
  const params = useLocalSearchParams<{ charId: string; squadId: string }>()
  const { charId, isPlaying, hasFinishedRound, isCombinedAction } = props
  const { combatStatus, currAp, initiative } = useCombatStatus(charId)
  const { players, npcs } = useCombat()
  const contenders = { ...players, ...npcs }
  const contender = contenders[charId]
  const { health, meta } = contender
  const { hp, maxHp } = health

  const textProps = { isPlaying, combatStatus, hasFinishedRound }

  const setCurrCharId = useSetCurrCharId()

  const onChangePlayer = (npcId: string) => {
    if (npcs === null || !(npcId in npcs)) return
    router.setParams({ charId: npcId })
    setCurrCharId(npcId)
  }

  return (
    <Animated.View layout={FadingTransition}>
      <Row style={styles.container}>
        <Col style={styles.checkboxCol}>
          <CheckBox
            onPress={() => onChangePlayer(charId)}
            isChecked={charId === params?.charId}
            size={30}
            disabled={!!players && charId in players}
          />
        </Col>
        <View style={[styles.withBorder, isPlaying && styles.playing]}>
          <Col style={styles.nameCol}>
            <CombatOrderText {...textProps}>
              {meta.firstname ?? ""}
              {isCombinedAction && isPlaying ? " C" : ""}
            </CombatOrderText>
          </Col>
          <Row style={styles.hpCol}>
            {health ? (
              <>
                <Txt style={{ fontSize: 12 }}>
                  {hp}/{maxHp}{" "}
                </Txt>
                <ProgressionBar
                  value={hp}
                  min={0}
                  max={maxHp}
                  color={getColor(health)}
                  width={40}
                />
              </>
            ) : null}
          </Row>
          <View style={styles.dataRow}>
            <CombatOrderText {...textProps}>{currAp ?? 0}</CombatOrderText>
          </View>
          <View style={styles.dataRow}>
            <CombatOrderText {...textProps}>{initiative ?? 1000}</CombatOrderText>
          </View>
        </View>
      </Row>
    </Animated.View>
  )
}
