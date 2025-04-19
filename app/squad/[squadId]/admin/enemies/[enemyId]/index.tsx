import { ActivityIndicator, TouchableOpacity } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import DrawerPage from "components/DrawerPage"
import Section from "components/Section"
import ScrollSection from "components/Section/ScrollSection"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import useRtdbSub from "hooks/db/useRtdbSub"
import { useGetUseCases } from "providers/UseCasesProvider"
import colors from "styles/colors"
import layout from "styles/layout"

export default function EnemyScreen() {
  const { enemyId, squadId } = useLocalSearchParams<{ enemyId: string; squadId: string }>()

  const useCases = useGetUseCases()

  const dbEnemy = useRtdbSub(useCases.enemy.sub(enemyId))

  const play = () => {
    router.push({
      pathname: "/squad/[squadId]/character/[charId]/main/recap",
      params: { charId: enemyId, squadId }
    })
  }

  if (dbEnemy === undefined)
    return (
      <ActivityIndicator
        style={{ height: "100%", width: "100%", justifyContent: "center", alignItems: "center" }}
        color={colors.secColor}
        size="large"
      />
    )

  if (dbEnemy === null) {
    return (
      <DrawerPage>
        <Section style={{ flex: 1 }} title="informations">
          <Txt>Aucun ennemi sélectionné</Txt>
        </Section>
      </DrawerPage>
    )
  }

  const { firstname, description, templateId } = dbEnemy.meta

  return (
    <DrawerPage>
      <Section style={{ flex: 1 }} title="informations">
        <Txt>Nom : {firstname}</Txt>
        <Txt>Description : {description}</Txt>
        <Txt>Template : {templateId}</Txt>
      </Section>

      <Spacer x={layout.globalPadding} />

      <ScrollSection style={{ width: 160 }} title="actions">
        <TouchableOpacity onPress={play}>
          <Txt>INCARNER</Txt>
        </TouchableOpacity>

        {/* <TouchableOpacity>
          <Txt>SUPPRIMER</Txt>
        </TouchableOpacity> */}
      </ScrollSection>
    </DrawerPage>
  )
}
