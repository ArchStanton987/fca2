import { KnowledgeLevel } from "./knowledge-types"

const knowledgeLevels: KnowledgeLevel[] = [
  { id: 1, label: "1", bonus: 0, bonusLabel: "*", cost: 0.5 },
  { id: 2, label: "2", bonus: 5, bonusLabel: "+5", cost: 1 },
  { id: 3, label: "3", bonus: 10, bonusLabel: "+10", cost: 2 },
  { id: 4, label: "4", bonus: 20, bonusLabel: "+20", cost: 3 },
  { id: 5, label: "5", bonus: 40, bonusLabel: "+40", cost: 5 },
  { id: 6, label: "6", bonus: 60, bonusLabel: "+60", cost: 7 }
]

export default knowledgeLevels
