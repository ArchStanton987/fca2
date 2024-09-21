import { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native"
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack"
import { EffectId } from "lib/character/effects/effects.types"
import { HealthStatusId } from "lib/character/health/health-types"
import { DbInventory } from "lib/objects/data/objects.types"

import { UpdatableStatusElement } from "screens/MainTabs/modals/UpdateStatusModal/UpdateStatusModal.types"

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
  UpdateEffects: undefined
  UpdateEffectsConfirmation: { effectsToAdd: EffectId[] }
  UpdateHealth: { initElement: HealthStatusId }
  UpdateHealthConfirmation: undefined
  UpdateKnowledges: undefined
  UpdateObjects: { initCategory: keyof DbInventory }
  UpdateObjectsConfirmation: undefined
  UpdateSkills: undefined
  UpdateStatus: { initCategory: UpdatableStatusElement }
}

export type AdminBottomTabParamList = {
  Datetime: { squadId: string }
}

export type CharBottomTabParamList = {
  Résumé: undefined
  Effets: { squadId: string; charId: string }
  "Attr. Prim.": { squadId: string; charId: string }
  "Attr. Sec.": { squadId: string; charId: string }
  Comp: { squadId: string; charId: string }
  Conn: { squadId: string; charId: string }
}

export type InvBottomTabParamList = {
  Armes: undefined
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
export type RootStackNavigationProps<T extends keyof RootStackParamList> =
  NativeStackNavigationProp<RootStackParamList, T>

export type CharStackScreenProps<T extends keyof CharStackParamList> = NativeStackScreenProps<
  CharStackParamList,
  T
>
export type CharStackNavigationProps<T extends keyof CharStackParamList> =
  NativeStackNavigationProp<CharStackParamList, T>

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
