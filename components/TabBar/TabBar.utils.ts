import routes from "constants/routes"

export const defaultProgress = {
  availableSkillPoints: 0,
  availableKnowledgePoints: 0,
  availableFreeKnowledgePoints: 0
}

export const getUpdatePathname = (route: string, progress: typeof defaultProgress) => {
  const { availableFreeKnowledgePoints, availableKnowledgePoints } = progress
  const { updateKnowledges, updateFreeKnowledges, updateSkills } = routes.modal
  if (route === "knowledges" && availableFreeKnowledgePoints > 0) return updateFreeKnowledges
  if (route === "knowledges" && availableKnowledgePoints > 0) return updateKnowledges
  return updateSkills
}
