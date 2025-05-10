import { StyleSheet, View } from "react-native"

import { Redirect } from "expo-router"

import { DbStatus } from "lib/character/status/status.types"
import { getPlayingOrder } from "lib/combat/utils/combat-utils"
import Animated, { FadingTransition } from "react-native-reanimated"

import DrawerPage from "components/DrawerPage"
import List from "components/List"
import ScrollSection from "components/Section/ScrollSection"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import routes from "constants/routes"
import { useCharacter } from "contexts/CharacterContext"
import { useCombat } from "providers/CombatProvider"
import colors from "styles/colors"

const styles = StyleSheet.create({
  row: {
    borderWidth: 2,
    borderColor: "transparent",
    padding: 5,
    flexDirection: "row"
  },
  nameCol: {
    flex: 1
  },
  dataRow: {
    width: 70,
    alignItems: "flex-end"
  },
  playing: {
    borderColor: colors.secColor
  },
  waiting: {
    color: colors.difficulty.easy
  },
  done: {
    color: colors.terColor
  },
  dead: {
    textDecorationLine: "line-through"
  }
})

type TextProps = {
  children: React.ReactNode
  status: DbStatus["combatStatus"]
  hasFinishedRound?: boolean
}

function CombatOrderText({ children, status, hasFinishedRound }: TextProps) {
  const isWaiting = status === "wait"
  const isDead = status === "dead"
  const isInactive = status === "inactive"
  return (
    <Txt
      style={[
        isWaiting && styles.waiting,
        (hasFinishedRound || isInactive) && styles.done,
        isDead && styles.dead
      ]}
    >
      {children}
    </Txt>
  )
}

type OrderRowProps = {
  name?: string
  ap?: number
  initiative?: number
  status: DbStatus["combatStatus"]
  isPlaying?: boolean
  hasFinishedRound?: boolean
  isCombinedAction?: boolean
}

function OrderRow(props: OrderRowProps) {
  const { name, ap, isPlaying, status, initiative, hasFinishedRound, isCombinedAction } = props
  const textProps = { isPlaying, status, hasFinishedRound }
  return (
    <Animated.View layout={FadingTransition} style={[styles.row, isPlaying && styles.playing]}>
      <View style={styles.nameCol}>
        <CombatOrderText {...textProps}>
          {name ?? ""}
          {isCombinedAction ? " C" : ""}
        </CombatOrderText>
      </View>
      <View style={styles.dataRow}>
        <CombatOrderText {...textProps}>{ap ?? 0}</CombatOrderText>
      </View>
      <View style={styles.dataRow}>
        <CombatOrderText {...textProps}>{initiative ?? 1000}</CombatOrderText>
      </View>
      <Spacer x={80} />
    </Animated.View>
  )
}

export default function GMCombatScreen() {
  const { combat, players, npcs } = useCombat()
  const { meta, charId } = useCharacter()

  if (!meta.isNpc)
    return (
      <Redirect
        href={{ pathname: routes.combat.index, params: { charId, squadId: meta.squadId } }}
      />
    )

  if (!combat || !players || !npcs) return <Txt>Impossible de récupérer le combat</Txt>

  const contenders = getPlayingOrder({ ...players, ...npcs })

  const defaultPlayingId =
    contenders.find(c => c.char.status.combatStatus === "active")?.char.charId ??
    contenders.find(c => c.char.status.combatStatus === "wait")?.char.charId

  const playingId = combat.currActorId || defaultPlayingId
  const isCombinedAction = playingId === combat.currActorId

  return (
    <DrawerPage>
      <ScrollSection title="ordre / PA / initiative" style={{ flex: 1 }}>
        <List
          data={contenders}
          keyExtractor={item => item.char.charId}
          separator={<Spacer y={10} />}
          renderItem={({ item }) => (
            <OrderRow
              name={item.char.meta.firstname}
              ap={item.char.status.currAp}
              initiative={item.combatData.initiative}
              status={item.char.status.combatStatus}
              isPlaying={item.char.charId === playingId}
              hasFinishedRound={item.char.status.currAp === 0}
              isCombinedAction={isCombinedAction}
            />
          )}
        />
      </ScrollSection>
    </DrawerPage>
  )
}
