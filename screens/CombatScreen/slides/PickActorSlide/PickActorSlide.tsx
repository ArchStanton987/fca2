import { useCurrCharId } from "lib/character/character-store"
import { useCombatId, useCombatStatuses } from "lib/character/combat-status/combat-status-provider"
import { usePlayablesCharInfo } from "lib/character/info/info-provider"
import { useContenders } from "lib/combat/use-cases/sub-combats"
import { getPlayingOrder } from "lib/combat/utils/combat-utils"

import Col from "components/Col"
import List from "components/List"
import Section from "components/Section"
import ScrollSection from "components/Section/ScrollSection"
import DrawerSlide from "components/Slides/DrawerSlide"
import { SlideProps } from "components/Slides/Slide.types"
import Spacer from "components/Spacer"
import { useActionActorId } from "providers/ActionFormProvider"
import { useScrollTo } from "providers/SlidesProvider"
import { useGetUseCases } from "providers/UseCasesProvider"
import layout from "styles/layout"

import NextButton from "../NextButton"
import SelectActorButton from "./SelectActorButton"

export default function PickActorSlide({ slideIndex }: SlideProps) {
  const charId = useCurrCharId()
  const useCases = useGetUseCases()
  const { scrollTo } = useScrollTo()

  const { data: combatId } = useCombatId(charId)
  const { data: contendersIds } = useContenders(combatId)
  const contendersInfo = usePlayablesCharInfo(contendersIds)
  const combatStatuses = useCombatStatuses(contendersIds)

  const ordered = Object.values(getPlayingOrder(combatStatuses))

  const enemies: string[] = []
  const players: string[] = []
  ordered.forEach(({ id }) => {
    const arr = contendersInfo[id].isEnemy ? enemies : players
    arr.push(id)
  })

  const actorId = useActionActorId()

  const submit = () => {
    useCases.combat.updateAction({ combatId, payload: { actorId } })
    scrollTo(slideIndex + 1)
  }

  return (
    <DrawerSlide>
      <ScrollSection style={{ flex: 1 }} title="joueurs">
        <List
          data={players}
          keyExtractor={i => i}
          renderItem={({ item }) => <SelectActorButton charId={item} />}
        />
      </ScrollSection>

      <Spacer x={layout.globalPadding} />

      <ScrollSection style={{ flex: 1 }} title="pnjs">
        <List
          data={enemies}
          keyExtractor={i => i}
          renderItem={({ item }) => <SelectActorButton charId={item} />}
        />
      </ScrollSection>

      <Spacer x={layout.globalPadding} />

      <Col style={{ width: 180 }}>
        <Section style={{ flex: 1 }}>
          <Spacer fullspace />
        </Section>

        <Spacer y={layout.globalPadding} />

        <Section
          title="suivant"
          contentContainerStyle={{ justifyContent: "center", alignItems: "center" }}
        >
          <NextButton disabled={actorId === ""} size={45} onPress={() => submit()} />
        </Section>
      </Col>
    </DrawerSlide>
  )
}
