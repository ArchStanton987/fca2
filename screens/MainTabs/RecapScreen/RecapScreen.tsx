import DrawerPage from "components/DrawerPage"
import Spacer from "components/Spacer"
import EquipedObjSection from "screens/MainTabs/RecapScreen/EquipedObjSection"
import HealthSection from "screens/MainTabs/RecapScreen/HealthSection"
import SkillsSection from "screens/MainTabs/RecapScreen/SkillsSection"

export default function RecapScreen() {
  return (
    <DrawerPage>
      <HealthSection />
      <Spacer x={10} />
      <EquipedObjSection />
      <Spacer x={10} />
      <SkillsSection />
    </DrawerPage>
  )
}
