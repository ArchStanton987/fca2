import { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"

export type RootStackParamList = {
  Home: undefined
  ChoixPerso: { squadId: string }
  Personnage: NavigatorScreenParams<CharStackParamList> & { squadId: string; charId: string }
  Admin: NavigatorScreenParams<AdminBottomTabParamList> & { squadId: string }
}
export type CharStackParamList = {
  Perso: NavigatorScreenParams<CharBottomTabParamList>
  Inventaire: NavigatorScreenParams<InvBottomTabParamList>
  Combat: NavigatorScreenParams<CombatBottomTabParamList>
  UpdateEffects: { squadId: string; charId: string }
  UpdateEffectsConfirmation: { squadId: string; charId: string }
  UpdateHealth: { squadId: string; charId: string }
  UpdateHealthConfirmation: { squadId: string; charId: string }
  UpdateKnowledges: { squadId: string; charId: string }
  UpdateObjects: { squadId: string; charId: string }
  UpdateObjectsConfirmation: { squadId: string; charId: string }
  UpdateSkills: { squadId: string; charId: string }
  UpdateStatus: { squadId: string; charId: string }
}

export type AdminBottomTabParamList = {
  dateHeure: { squadId: string }
}

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

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>

export type CharStackScreenProps<T extends keyof CharStackParamList> = NativeStackScreenProps<
  CharStackParamList,
  T
>

export type AdminScreenProps<T extends keyof AdminBottomTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<AdminBottomTabParamList, T>,
  RootStackScreenProps<"Admin">
>

export type CharBottomTabScreenProps<T extends keyof CharBottomTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<CharBottomTabParamList, T>,
  CompositeScreenProps<CharStackScreenProps<"Perso">, RootStackScreenProps<"Personnage">>
>

export type InvBottomTabScreenProps<T extends keyof InvBottomTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<InvBottomTabParamList, T>,
  CompositeScreenProps<CharStackScreenProps<"Inventaire">, RootStackScreenProps<"Personnage">>
>

export type CombatBottomTabScreenProps<T extends keyof CombatBottomTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<CombatBottomTabParamList, T>,
    CompositeScreenProps<CharStackScreenProps<"Combat">, RootStackScreenProps<"Personnage">>
  >
