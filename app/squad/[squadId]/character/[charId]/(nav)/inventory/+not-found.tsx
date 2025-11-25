import DrawerPage from "components/DrawerPage"
import Section from "components/Section"
import Txt from "components/Txt"

export default function InventoryNotFound() {
  return (
    <DrawerPage>
      <Section
        style={{ flex: 1 }}
        contentContainerStyle={{ justifyContent: "center", alignItems: "center", flex: 1 }}
      >
        <Txt>Choisissez une catégorie d&apos;objets</Txt>
      </Section>
    </DrawerPage>
  )
}
