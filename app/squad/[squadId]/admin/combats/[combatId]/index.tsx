import { TouchableOpacity } from "react-native"

import { useLocalSearchParams } from "expo-router"

import DrawerPage from "components/DrawerPage"
import Section from "components/Section"
import ScrollSection from "components/Section/ScrollSection"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import useRtdbSub from "hooks/db/useRtdbSub"
import { useGetUseCases } from "providers/UseCasesProvider"
import layout from "styles/layout"
import { getDDMMYYYY, getHHMM } from "utils/date"

export default function AdminCombatScreen() {
  const useCases = useGetUseCases()
  const { combatId } = useLocalSearchParams<{ combatId: string }>()

  const combat = useRtdbSub(useCases.combat.sub({ id: combatId }))

  if (!combat) {
    return (
      <DrawerPage>
        <Section style={{ flex: 1 }} title="informations">
          <Txt>Aucun combat sélectionné</Txt>
        </Section>
      </DrawerPage>
    )
  }

  // TODO: DELETE combat admin command

  const { title, description, location } = combat
  const displayDate = new Date(parseInt(combat.timestamp, 10))
  const d = getDDMMYYYY(displayDate)
  const h = getHHMM(displayDate)
  // const options = { year: "numeric", month: "2-digit", day: "2-digit" }
  // const formattedDate = displayDate.toLocaleDateString("fr-FR", options)
  // const formattedTime = displayDate.toLocaleTimeString("fr-FR", {
  //   hour: "2-digit",
  //   minute: "2-digit"
  // })

  return (
    <DrawerPage>
      <Section style={{ flex: 1 }} title="informations">
        <Txt>Nom : {title}</Txt>
        <Txt>Description : {description}</Txt>
        <Txt>
          Date : {d} à {h}{" "}
        </Txt>
        <Txt>Lieu : {location}</Txt>
      </Section>

      <Spacer x={layout.globalPadding} />

      <ScrollSection style={{ width: 160 }} title="actions">
        <TouchableOpacity>
          <Txt>SUPPRIMER</Txt>
        </TouchableOpacity>
      </ScrollSection>
    </DrawerPage>
  )
}
