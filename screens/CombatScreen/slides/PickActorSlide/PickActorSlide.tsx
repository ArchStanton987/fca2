import { getPlayingOrder } from "lib/combat/utils/combat-utils"

import Col from "components/Col"
import List from "components/List"
import Section from "components/Section"
import ScrollSection from "components/Section/ScrollSection"
import DrawerSlide from "components/Slides/DrawerSlide"
import { SlideProps } from "components/Slides/Slide.types"
import Spacer from "components/Spacer"
import { useActionApi, useActionForm } from "providers/ActionProvider"
import { useCombatStatus } from "providers/CombatStatusProvider"
import { useCombatStatuses } from "providers/CombatStatusesProvider"
import { useContenders } from "providers/ContendersProvider"
import { useScrollTo } from "providers/SlidesProvider"
import { useGetUseCases } from "providers/UseCasesProvider"
import layout from "styles/layout"

import NextButton from "../NextButton"
import SelectActorButton from "./SelectActorButton"

export default function PickActorSlide({ slideIndex }: SlideProps) {
  const useCases = useGetUseCases()
  const { scrollTo } = useScrollTo()
  const combatStatuses = useCombatStatuses()
  const contenders = useContenders()
  const { combatId } = useCombatStatus()

  const orderedIds = Object.keys(getPlayingOrder(combatStatuses))

  const enemies: { charId: string; fullname: string }[] = []
  const players: { charId: string; fullname: string }[] = []
  orderedIds.forEach(charId => {
    const arr = contenders[charId].meta.isEnemy ? enemies : players
    arr.push({ charId, fullname: contenders[charId].fullname })
  })

  const { setActorId } = useActionApi()
  const { actorId } = useActionForm()

  const toggleSelect = (id: string) => {
    setActorId(actorId === id ? "" : id)
  }

  const submit = () => {
    useCases.combat.updateAction({ combatId, payload: { actorId } })
    scrollTo(slideIndex + 1)
  }

  return (
    <DrawerSlide>
      <ScrollSection style={{ flex: 1 }} title="joueurs">
        <List
          data={players}
          keyExtractor={i => i.charId}
          renderItem={({ item }) => (
            <SelectActorButton
              charId={item.charId}
              fullname={item.fullname}
              isSelected={actorId === item.charId}
              toggleSelect={() => toggleSelect(item.charId)}
            />
          )}
        />
      </ScrollSection>

      <Spacer x={layout.globalPadding} />

      <ScrollSection style={{ flex: 1 }} title="pnjs">
        <List
          data={enemies}
          keyExtractor={i => i.charId}
          renderItem={({ item }) => (
            <SelectActorButton
              charId={item.charId}
              fullname={item.fullname}
              isSelected={actorId === item.charId}
              toggleSelect={() => toggleSelect(item.charId)}
            />
          )}
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
