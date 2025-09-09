import CharacterRtdbRepository from "lib/character/CharacterRtdbRepository"
import CombatStatusRtdbRepository from "lib/character/combat-status/CombatStatusRtdbRepository"
import AdditionalEffectsRtdbRepository from "lib/character/effects/AdditionalEffectsRtdbRepository"
import EffectsRtdbRepository from "lib/character/effects/EffectsRtdbRepository"
import StatusRtdbRepository from "lib/character/status/StatusRtdbRepository"
import ActionRtdbRepository from "lib/combat/ActionRtdbRepository"
import CombatHistoryRtdbRepository from "lib/combat/CombatHistoryRtdbRepository"
import CombatInfoRtdbRepository from "lib/combat/CombatInfoRtdbRepository"
import CombatRtdbRepository from "lib/combat/CombatRtdbRepository"
import CombatStateRtdbRepository from "lib/combat/CombatStateRtdbRepository"
import RollRtdbRepository from "lib/combat/RollRtdbRepository"
import RoundRtdbRepository from "lib/combat/RoundRtdbRepository"
import NpcRtdbRepository from "lib/npc/NpcRtdbRepository"
import AdditionalClothingsRtdbRepository from "lib/objects/data/clothings/AdditionalClothingsRtdbRepository"
import AdditionalConsumablesRtdbRepository from "lib/objects/data/consumables/AdditionalConsumablesRtdbRepository"
import AdditionalMiscRtdbRepository from "lib/objects/data/misc-objects/AdditionalMiscRtdbRepository"
import SquadRtdbRepository from "lib/squad/SquadRtdbRepository"

const repositoryMap = {
  rtdb: {
    additionalClothingsRepository: new AdditionalClothingsRtdbRepository(),
    additionalConsumablesRepository: new AdditionalConsumablesRtdbRepository(),
    additionalEffectsRepository: new AdditionalEffectsRtdbRepository(),
    additionalMiscRepository: new AdditionalMiscRtdbRepository(),
    //
    combatRepository: new CombatRtdbRepository(),
    combatInfoRepository: new CombatInfoRtdbRepository(),
    combatHistoryRepository: new CombatHistoryRtdbRepository(),
    combatStateRepository: new CombatStateRtdbRepository(),
    roundRepository: new RoundRtdbRepository(),
    actionRepository: new ActionRtdbRepository(),
    rollRepository: new RollRtdbRepository(),
    npcRepository: new NpcRtdbRepository(),
    characterRepository: new CharacterRtdbRepository(),
    statusRepository: new StatusRtdbRepository(),
    combatStatusRepository: new CombatStatusRtdbRepository(),
    effectsRepository: new EffectsRtdbRepository(),
    //
    squadRepository: new SquadRtdbRepository()
  }
}

export default repositoryMap
