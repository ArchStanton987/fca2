import { TouchableHighlight } from "react-native"

import { Redirect, useLocalSearchParams } from "expo-router"

import { useCombatId, useCombatStatus } from "lib/character/combat-status/combat-status-provider"
import { useCombatState } from "lib/combat/use-cases/sub-combats"
import { useGetPlayerCanReact } from "lib/combat/utils/combat-utils"

import DrawerPage from "components/DrawerPage"
import Section from "components/Section"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import routes from "constants/routes"
import { useGetUseCases } from "providers/UseCasesProvider"
import colors from "styles/colors"
import layout from "styles/layout"

function WaitScreen({ charId }: { charId: string }) {
  const { squadId } = useLocalSearchParams<{ squadId: string }>()
  const useCases = useGetUseCases()

  const { data: combatId } = useCombatId(charId)
  const { data: combatState } = useCombatState(combatId)

  const roll = combatState.action?.roll
  const hasThrownDice = roll && typeof roll.dice === "number"

  const canReact = useGetPlayerCanReact(charId)

  const onPressEnd = () => {
    if (hasThrownDice) return
    useCases.combat.endWait({ combatId, combatState, charId })
  }

  if (canReact)
    return <Redirect href={{ pathname: routes.combat.reaction, params: { charId, squadId } }} />

  return (
    <>
      <Txt>Vous avez choisi d&apos;attendre le bon moment pour agir au cours de ce round.</Txt>
      <Spacer y={layout.globalPadding} />
      <Txt>Vous pouvez intervenir quand vous le souhaitez au cours du round.</Txt>
      <Spacer y={layout.globalPadding} />
      <Txt>Pour cela il faut prévenir le MJ, puis appuyer là :</Txt>
      <Spacer y={30} />
      <TouchableHighlight
        style={{
          borderWidth: 2,
          backgroundColor: !hasThrownDice ? colors.secColor : colors.terColor,
          paddingVertical: 15,
          paddingHorizontal: 20
        }}
        onPress={onPressEnd}
        disabled={hasThrownDice}
      >
        <Txt style={{ color: colors.primColor }}>ACTION</Txt>
      </TouchableHighlight>
    </>
  )
}

function DeadScreen() {
  return (
    <>
      <Txt style={{ textAlign: "center" }}>
        Il semble que vous soyez mort. A moins qu&apos;on ne puisse vous ranimer, cela semble être
        la fin.
      </Txt>
      <Spacer y={layout.globalPadding} />
      <Txt style={{ textAlign: "center" }}>
        Vault Tec espère que votre vie a été agréable et que vous avez été satisfait de votre
        expérience en utilisant le PipBoy.
      </Txt>
    </>
  )
}

function InactiveScreen() {
  return (
    <Txt style={{ textAlign: "center" }}>
      Pour des raisons que vous connaissez certainement, vous ne serez pas en mesure
      d&apos;effectuer d&apos;action pendant ce round.
    </Txt>
  )
}

function NoAp() {
  return (
    <Txt style={{ textAlign: "center" }}>
      Vous n&apos;avez plus de point d&apos;action, il va falloir attendre le prochain round.
    </Txt>
  )
}

export default function ActionUnavailableScreen({ charId }: { charId: string }) {
  const { data: status } = useCombatStatus(charId, s => ({
    combatId: s.combatId,
    combatStatus: s.combatStatus,
    currAp: s.currAp
  }))

  const isWaiting = status.combatStatus === "wait"
  const isDead = status.combatStatus === "dead"
  const isInactive = status.combatStatus === "inactive"
  const hasNoAp = status.currAp <= 0

  if (status.combatId === "")
    return (
      <DrawerPage>
        <Section
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Txt>Aucun combat en cours</Txt>
        </Section>
      </DrawerPage>
    )

  return (
    <DrawerPage>
      <Section
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center" }}
      >
        {isWaiting ? <WaitScreen charId={charId} /> : null}
        {isInactive ? <InactiveScreen /> : null}
        {isDead ? <DeadScreen /> : null}
        {hasNoAp ? <NoAp /> : null}
        {!isWaiting && !isInactive && !isDead && !hasNoAp ? (
          <Txt>Ce n&apos;est pas encore votre tour</Txt>
        ) : null}
      </Section>
    </DrawerPage>
  )
}
