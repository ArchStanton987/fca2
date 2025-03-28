/* eslint-disable import/prefer-default-export */
export const getUpSkillCost = (currSkillScore: number) => {
  if (currSkillScore < 100) return 1
  if (currSkillScore < 125) return 2
  if (currSkillScore < 150) return 3
  if (currSkillScore < 175) return 4
  if (currSkillScore < 200) return 5
  return 6
}
