import { StyleSheet } from "react-native"

import { Redirect } from "expo-router"

import { getActionId, getCurrentRoundId, getPlayingOrder } from "lib/combat/utils/combat-utils"

import Col from "components/Col"
import DrawerPage from "components/DrawerPage"
import List from "components/List"
import Section from "components/Section"
import ScrollSection from "components/Section/ScrollSection"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import routes from "constants/routes"
import { useCharacter } from "contexts/CharacterContext"
import { useCombat } from "providers/CombatProvider"
import OrderRow, { OrderRowHeader } from "screens/GMActionOrder/OrderRow"
import colors from "styles/colors"
import layout from "styles/layout"

const styles = StyleSheet.create({
  centeredSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  combatStep: {
    color: colors.secColor,
    fontSize: 42,
    lineHeight: 50
  },
  row: {
    flex: 1,
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
    borderColor: colors.secColor,
    backgroundColor: colors.terColor
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

  const currRound = getCurrentRoundId(combat)
  const currAction = getActionId(combat)

  return (
    <DrawerPage>
      <Col style={{ width: 60 }}>
        <Section contentContainerStyle={styles.centeredSection} title="RND" style={{ flex: 1 }}>
          <Txt style={styles.combatStep}>{currRound}</Txt>
        </Section>

        <Spacer y={layout.globalPadding} />
        <Section contentContainerStyle={styles.centeredSection} title="ACTN" style={{ flex: 1 }}>
          <Txt style={styles.combatStep}>{currAction}</Txt>
        </Section>
      </Col>

      <Spacer x={layout.globalPadding} />

      <ScrollSection title="ordre / PA / initiative" style={{ flex: 1 }}>
        <List
          data={contenders}
          keyExtractor={item => item.char.charId}
          separator={<Spacer y={10} />}
          ListHeaderComponent={OrderRowHeader}
          renderItem={({ item }) => (
            <OrderRow
              charId={item.char.charId}
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
