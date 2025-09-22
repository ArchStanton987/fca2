import beasts from "./beasts"
import humanTemplates from "./human-templates"
import robots from "./robots"

const npcTemplates = { human: humanTemplates, robot: robots, beast: beasts }

export const critters = { ...beasts, ...robots }

export default npcTemplates
