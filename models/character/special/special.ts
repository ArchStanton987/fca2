import { SpecialId } from "./special-types"

export type Special = {
  id: SpecialId
  label: string
  short: string
  description: string
}

const specialMap: Record<SpecialId, Special> = {
  strength: {
    id: "strength",
    label: "Force",
    short: "FO",
    description: `La FORCE ! La force c'est bien, plus on en a, plus on est fort ! Avec de la force, on peut porter plein de trucs, tapper fort pour arriver à prendre le casse-croûte des copains. Certaines armes requierent un minimum de biscoteaux pour être maniées correctement ! ${"\n"} "ROK FOOOOORT !!!" (ROK) `
  },
  endurance: {
    id: "endurance",
    label: "Endurance",
    short: "EN",
    description: `Il y a les petites natures, les fragiles, ceux pour qui manger du cram un peu passé de date produit un désastre gastrique. Et puis il y a les vrais de vrai, qui croquent du radcafard au petit déj ! Que ce soit pour résister à des bactéries, encaisser des dégâts ou des radiations, l'endurance est une qualité qu'il vaut mieux avoir dans les terres désolées.`
  },
  agility: {
    id: "agility",
    label: "Agilité",
    short: "AG",
    description: `Outre se faufiler dans des recoins, réaliser des petites (ou des grandes) acrobaties, l'agilité va largement déterminer la capacité d'action lors d'un combat. Vos cours de cirque vont-ils finalement servir à quelque chose ?`
  },
  perception: {
    id: "perception",
    label: "Perception",
    short: "PE",
    description: `A quoi bon être un grosbill bien badass, si l'on a les sens aussi affutés qu'un Yao Guaï en hibernation ? La perception regroupe la qualité de vos sens, et influe sur votre portée de tir maximum.`
  },
  intelligence: {
    id: "intelligence",
    label: "Intelligence",
    short: "IN",
    description: `On croirait pas, mais des fois ça sert. Certains disaient : "l'intelligence, c'est la capacité à faire des détours". C'est peut-être vrai, ou pas, de toute façon je ne comprends pas ce que ça veut dire. N'empêche que ceux qui en ont dans la caboche, ils apprennent plus vite que les autres. Une légende dit qu'on pourrait même résoudre pas mal de problème avec de l'intelligence, mais ce n'est qu'une légende !`
  },
  charisma: {
    id: "charisma",
    label: "Charisme",
    short: "CH",
    description: `L'apocalypse a déjà eu lieu... Mais ce n'était pas un "bon" apocalypse, la preuve, les terres désolées grouillent encore de vie, et même de vie humaine. Ces mêmes humains ne sont jamais autonomes et ont sans arrêt besoin les uns des autres. Le charisme, c'est ce qui fait que ces autres humains vont vous apprécier, voire être influencé par votre personnalité.`
  },
  luck: {
    id: "luck",
    label: "Chance",
    short: "C",
    description: `On peut être quelqu'un de parfaitement sain et compétent. La nature n'en est pas moins hostile et implacable pour autant. L'univers suit ses propres lois, cela peut être du hasard, du destin, peu importe. S'il s'acharne contre vous, vous allez passer un sale quart d'heure. Et il y a des gens pour qui tout tombe tout cuit dans leur bec. Drôle de monde !`
  }
}

export const specialArray = Object.values(specialMap)

export default specialMap
