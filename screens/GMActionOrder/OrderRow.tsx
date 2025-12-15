import { StyleSheet, View } from "react-native"

import { router } from "expo-router"

import { useCurrCharId, useSetCurrCharId } from "lib/character/character-store"
import { useCombatStatus } from "lib/character/combat-status/combat-status-provider"
import { useHealth } from "lib/character/health/health-provider"
import { useCharInfo } from "lib/character/info/info-provider"
import Animated, { FadingTransition } from "react-native-reanimated"

import CheckBox from "components/CheckBox/CheckBox"
import Col from "components/Col"
import ProgressionBar from "components/ProgressionBar/ProgressionBar"
import Row from "components/Row"
import Txt from "components/Txt"
import colors from "styles/colors"

import CombatOrderText from "./CombatOrderText"

type OrderRowProps = {
  charId: string
  isPlaying?: boolean
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
  const currCharId = useCurrCharId()
  const { charId, isPlaying, isCombinedAction } = props
  const { data: info } = useCharInfo(charId)
  const { data: health } = useHealth(charId)
  const cs = useCombatStatus(charId, status => ({
    currAp: status.currAp,
    initiative: status.initiative
  }))

  const setCurrCharId = useSetCurrCharId()

  const onChangePlayer = (npcId: string) => {
    router.setParams({ charId: npcId })
    setCurrCharId(npcId)
  }

  return (
    <Animated.View layout={FadingTransition}>
      <Row style={styles.container}>
        <Col style={styles.checkboxCol}>
          <CheckBox
            onPress={() => onChangePlayer(charId)}
            isChecked={charId === currCharId}
            size={30}
            disabled={!info.isNpc}
          />
        </Col>
        <View style={[styles.withBorder, isPlaying && styles.playing]}>
          <Col style={styles.nameCol}>
            <CombatOrderText charId={charId}>
              {info.firstname ?? ""}
              {isCombinedAction && isPlaying ? " C" : ""}
            </CombatOrderText>
          </Col>
          <Row style={styles.hpCol}>
            {health ? (
              <>
                <Txt style={{ fontSize: 12 }}>
                  {health.currHp}/{health.maxHp}{" "}
                </Txt>
                <ProgressionBar
                  value={health.currHp}
                  min={0}
                  max={health.maxHp}
                  color={getColor({ hp: health.currHp, maxHp: health.maxHp })}
                  width={40}
                />
              </>
            ) : null}
          </Row>
          <View style={styles.dataRow}>
            <CombatOrderText charId={charId}>{cs.data.currAp ?? 0}</CombatOrderText>
          </View>
          <View style={styles.dataRow}>
            <CombatOrderText charId={charId}>{cs.data.initiative ?? 1000}</CombatOrderText>
          </View>
        </View>
      </Row>
    </Animated.View>
  )
}
