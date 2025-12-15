import SkillsSection from "lib/character/abilities/skills/ui/SkillsSection"
import { useCurrCharId } from "lib/character/character-store"
import HealthSection from "lib/character/health/ui/HealthSection"
import EquipedObjSection from "lib/inventory/ui/EquipedObjSection"

import DrawerPage from "components/DrawerPage"
import Spacer from "components/Spacer"
import layout from "styles/layout"

export default function RecapScreen() {
  const charId = useCurrCharId()
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
