import React from "react"
import { View } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import skillsMap from "lib/character/abilities/skills/skills"
import { SkillId, SkillsValues } from "lib/character/abilities/skills/skills.types"
import useCases from "lib/common/use-cases"

import { DrawerParams } from "components/Drawer/Drawer.params"
import ModalCta from "components/ModalCta/ModalCta"
import ScrollableSection from "components/ScrollableSection"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import ModalBody from "components/wrappers/ModalBody"
import { useCharacter } from "contexts/CharacterContext"

type SkillsConfirmationModalParams = DrawerParams & {
  newUpSkills?: string
}

export default function UpdateSkillsConfirmation() {
  const { charId, skills } = useCharacter()
  const { up } = skills
  const params = useLocalSearchParams<SkillsConfirmationModalParams>()
  const newUpSkills: SkillsValues = JSON.parse(params.newUpSkills as string)

  const modifiedSkills = Object.entries(newUpSkills)
    .filter(([skillId, value]) => value > up[skillId as SkillId])
    .map(([id, value]) => ({ id, value: value - up[id as SkillId] }))

  const onPressConfirm = async () => {
    await useCases.abilities.updateUpSkills(charId, newUpSkills)
    router.dismiss(2)
  }
  return (
    <ModalBody>
      <Spacer y={30} />
      <Txt style={{ textAlign: "center" }}>
        Vous êtes sur le point d&apos;effectuer les modifications suivantes :
      </Txt>
      <Spacer y={30} />
      <ScrollableSection title="COMPETENCES" style={{ flex: 1, width: 300, alignSelf: "center" }}>
        {modifiedSkills.map(skill => (
          <View key={skill.id} style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Txt>{skillsMap[skill.id as SkillId].label}</Txt>
            <Txt>+{skill.value}</Txt>
          </View>
        ))}
      </ScrollableSection>
      <Spacer y={15} />
      <ModalCta onPressConfirm={onPressConfirm} />
    </ModalBody>
  )
}
