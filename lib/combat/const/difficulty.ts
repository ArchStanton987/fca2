import colors from "styles/colors"

const difficultyArray = [
  {
    id: "veryEasy",
    threshold: -61,
    color: colors.difficulty.veryEasy,
    labelShort: "T.fac.",
    label: "Très facile",
    modLabel: "+99 à +61"
  },
  {
    id: "easy",
    threshold: -21,
    color: colors.difficulty.easy,
    labelShort: "Fac.",
    label: "Facile",
    modLabel: "+60 à +21"
  },
  {
    id: "average",
    threshold: 20,
    color: colors.difficulty.medium,
    labelShort: "Moy.",
    label: "Moyen",
    modLabel: "+20 à -20"
  },
  {
    id: "difficult",
    threshold: 60,
    color: colors.difficulty.hard,
    labelShort: "Diff.",
    label: "Difficile",
    modLabel: "-21 à -60"
  },
  {
    id: "veryDifficult",
    threshold: 99,
    color: colors.difficulty.veryHard,
    labelShort: "T.diff.",
    label: "Très difficile",
    modLabel: "-61 à -99"
  },
  {
    id: "heroic",
    threshold: Infinity,
    color: colors.difficulty.heroic,
    labelShort: "Héro.",
    label: "Héroïque",
    modLabel: "<-100"
  }
]

export default difficultyArray
