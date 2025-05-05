import { TouchableHighlight } from "react-native"

import DrawerPage from "components/DrawerPage"
import Section from "components/Section"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"
import { useCombat } from "providers/CombatProvider"
import { useGetUseCases } from "providers/UseCasesProvider"
import colors from "styles/colors"
import layout from "styles/layout"

function WaitScreen() {
  const useCases = useGetUseCases()
  const { combat } = useCombat()
  const character = useCharacter()

  const onPressEnd = () => {
    if (!combat) return
    useCases.combat.endWait({ combat, actor: character })
  }

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
          backgroundColor: colors.secColor,
          paddingVertical: 15,
          paddingHorizontal: 20
        }}
        onPress={onPressEnd}
      >
        <Txt style={{ color: colors.primColor }}>ACTION</Txt>
      </TouchableHighlight>
    </>
  )
}

function DeadScreen() {
  return (
    <>
      <Txt>
        Il semble que vous soyez mort. A moins qu&apos;on ne puisse vous ranimer, cela semble être
        la fin.
      </Txt>
      <Spacer y={layout.globalPadding} />
      <Txt>
        Vault Tec espère que votre vie a été agréable et que vous avez été satisfait de votre
        expérience en utilisant le PipBoy.
      </Txt>
    </>
  )
}

function InactiveScreen() {
  return (
    <Txt>
      Pour des raisons que vous connaissez certainement, vous ne serez pas en mesure
      d&apos;effectuer d&apos;action pendant ce round.
    </Txt>
  )
}

function NoAp() {
  return (
    <Txt>
      Vous n&pos;avez plus de point d&apos;action, il va falloir attendre le prochain round.
    </Txt>
  )
}

// return <Txt>Vous devez attendre que ce soit votre tour pour pouvoir agir.</Txt>

export default function ActionUnavailableScreen() {
  const { status } = useCharacter()

  const isWaiting = status.combatStatus === "wait"
  const isDead = status.combatStatus === "dead"
  const isInactive = status.combatStatus === "inactive"
  const hasNoAp = status.currAp <= 0

  return (
    <DrawerPage>
      <Section
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center" }}
      >
        {isWaiting ? <WaitScreen /> : null}
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
