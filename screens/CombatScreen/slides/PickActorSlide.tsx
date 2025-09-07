import Col from "components/Col"
import List from "components/List"
import Section from "components/Section"
import ScrollSection from "components/Section/ScrollSection"
import Selectable from "components/Selectable"
import DrawerSlide from "components/Slides/DrawerSlide"
import { SlideProps } from "components/Slides/Slide.types"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useActionApi, useActionForm } from "providers/ActionProvider"
import { useCombat } from "providers/CombatProvider"
import { useScrollTo } from "providers/SlidesProvider"
import { useGetUseCases } from "providers/UseCasesProvider"
import layout from "styles/layout"

import NextButton from "./NextButton"

export default function PickActorSlide({ slideIndex }: SlideProps) {
  const useCases = useGetUseCases()
  const { scrollTo } = useScrollTo()
  const { combat, npcs, players } = useCombat()

  const { setActorId } = useActionApi()
  const { actorId } = useActionForm()

  const toggleSelect = (id: string) => {
    setActorId(actorId === id ? "" : id)
  }

  const submit = () => {
    if (!combat) return
    useCases.combat.updateAction({ combat, payload: { actorId } })
    scrollTo(slideIndex + 1)
  }

  return (
    <DrawerSlide>
      <ScrollSection style={{ flex: 1 }} title="joueurs">
        <List
          data={Object.values(players ?? {})}
          keyExtractor={i => i.charId}
          renderItem={({ item }) => (
            <Selectable
              onPress={() => toggleSelect(item.charId)}
              isSelected={actorId === item.charId}
            >
              <Txt>{item.meta.firstname}</Txt>
            </Selectable>
          )}
        />
      </ScrollSection>

      <Spacer x={layout.globalPadding} />

      <ScrollSection style={{ flex: 1 }} title="pnjs">
        <List
          data={Object.values(npcs ?? {})}
          keyExtractor={i => i.charId}
          renderItem={({ item }) => (
            <Selectable
              onPress={() => toggleSelect(item.charId)}
              isSelected={actorId === item.charId}
            >
              <Txt>{item.meta.firstname}</Txt>
            </Selectable>
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
