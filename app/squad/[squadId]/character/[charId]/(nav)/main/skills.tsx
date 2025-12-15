import { useSkills } from "lib/character/abilities/abilities-provider"
import skillsMap from "lib/character/abilities/skills/skills"
import { useCurrCharId } from "lib/character/character-store"

import DrawerPage from "components/DrawerPage"
import List from "components/List"
import ScrollSection from "components/Section/ScrollSection"
import { ComposedTitleProps } from "components/Section/Section.types"
import AttributeRow from "components/tables/Attributes/AttributeRow"

const skillsArray = Object.values(skillsMap)

const title: ComposedTitleProps = [
  { title: "attribut", containerStyle: { flex: 1 } },
  { title: "base", containerStyle: { width: 55 } },
  { title: "up", containerStyle: { width: 55 } },
  { title: "mod", containerStyle: { width: 55 } },
  { title: "tot", containerStyle: { width: 55 } }
]

export default function SkillsScreen() {
  const charId = useCurrCharId()
  const { data: skills } = useSkills(charId)
  const { base, up, mod, curr } = skills

  return (
    <DrawerPage>
      <ScrollSection style={{ flex: 1 }} contentContainerStyle={{ paddingRight: 0 }} title={title}>
        <List
          data={skillsArray}
          keyExtractor={item => item.id}
          renderItem={({ item }) => {
            const baseValue = base[item.id]
            const upValue = up[item.id]
            const modValue = mod[item.id]
            const currValue = curr[item.id]
            const values = { baseValue, upValue, modValue, currValue }
            return <AttributeRow label={item.label} values={values} onPress={() => {}} />
          }}
        />
      </ScrollSection>
    </DrawerPage>
  )
}
