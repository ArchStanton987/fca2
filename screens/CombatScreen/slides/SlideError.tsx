import Section from "components/Section"
import DrawerSlide from "components/Slides/DrawerSlide"
import Txt from "components/Txt"

export const slideErrors = {
  noCombatError: "Aucun combat en cours.",
  noItemError: "Erreur lors de la sélection de l'objet.",
  noConsumableError: "L'objet n'est pas un consommable.",
  noDiceRollError: "Erreur : pas de lancer de dés.",
  noReactionSkill: "Erreur : pas compétence associée à la réaction"
}

export default function SlideError({ error }: { error: string }) {
  return (
    <DrawerSlide>
      <Section
        style={{ flex: 1 }}
        contentContainerStyle={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <Txt>{error}</Txt>
      </Section>
    </DrawerSlide>
  )
}
