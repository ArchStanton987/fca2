import { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"

export type RootStackParamList = {
  Home: undefined
  ChoixPerso: { squadId: string }
  Personnage: { squadId: string; charId: string }
  Admin: { squadId: string }
}
export type CharStackParamList = {
  Perso: NavigatorScreenParams<RootStackParamList>
  Inventaire: NavigatorScreenParams<RootStackParamList>
  Combat: NavigatorScreenParams<RootStackParamList>
}

export type AdminBottomTabParamList = {
  dateHeure: { squadId: string }
}

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>

export type CharStackScreenProps<T extends keyof CharStackParamList> = NativeStackScreenProps<
  CharStackParamList,
  T
>

export type CharBottomTabParamList = {
  Résumé: { squadId: string; charId: string }
  Effets: { squadId: string; charId: string }
  "Attr. Prim.": { squadId: string; charId: string }
  "Attr. Sec.": { squadId: string; charId: string }
  Comp: { squadId: string; charId: string }
  Conn: { squadId: string; charId: string }
}

export type InvBottomTabParamList = {
  Armes: { squadId: string; charId: string }
  Protections: { squadId: string; charId: string }
  Consommables: { squadId: string; charId: string }
  Divers: { squadId: string; charId: string }
  Munitions: { squadId: string; charId: string }
}

export type CombatBottomTabParamList = {
  Statut: { squadId: string; charId: string }
}
// export type CharBottomTabScreenProps<T extends keyof CharBottomTabParamList> = BottomTabScreenProps<
//   CharBottomTabParamList,
//   T
// >

export type CharBottomTabScreenProps<T extends keyof CharBottomTabParamList> = CompositeScreenProps<
  CharStackScreenProps<"Perso">,
  RootStackScreenProps<"Personnage">
>

export type RecapScreenProps = CompositeScreenProps<
  CharBottomTabScreenProps<"Résumé">,
  CompositeScreenProps<CharStackScreenProps<"Perso">, RootStackScreenProps<"Personnage">>
>
