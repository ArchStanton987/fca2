import { useLocalSearchParams } from "expo-router"

import SkillsSection from "lib/character/abilities/skills/ui/SkillsSection"
import HealthSection from "lib/character/health/ui/HealthSection"
import EquipedObjSection from "lib/inventory/ui/EquipedObjSection"

import DrawerPage from "components/DrawerPage"
import Spacer from "components/Spacer"
import layout from "styles/layout"

export default function RecapScreen() {
  const { charId } = useLocalSearchParams<{ charId: string }>()
  return (
    <DrawerPage>
      <HealthSection charId={charId} />
      <Spacer x={layout.globalPadding} />
      <EquipedObjSection charId={charId} />
      <Spacer x={layout.globalPadding} />
      <SkillsSection charId={charId} />
    </DrawerPage>
  )
}
