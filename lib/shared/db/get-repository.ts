import PlayableRtdbRepository from "lib/character/PlayableRtdbRepository"
import CombatStatusRtdbRepository from "lib/character/combat-status/CombatStatusRtdbRepository"
import AdditionalEffectsRtdbRepository from "lib/character/effects/AdditionalEffectsRtdbRepository"
import EffectsRtdbRepository from "lib/character/effects/EffectsRtdbRepository"
import StatusRtdbRepository from "lib/character/status/StatusRtdbRepository"
import ActionRtdbRepository from "lib/combat/ActionRtdbRepository"
import CombatHistoryRtdbRepository from "lib/combat/CombatHistoryRtdbRepository"
import CombatInfoRtdbRepository from "lib/combat/CombatInfoRtdbRepository"
import CombatRtdbRepository from "lib/combat/CombatRtdbRepository"
import CombatStateRtdbRepository from "lib/combat/CombatStateRtdbRepository"
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
    actionRepository: new ActionRtdbRepository(),
    playableRepository: new PlayableRtdbRepository(),
    statusRepository: new StatusRtdbRepository(),
    combatStatusRepository: new CombatStatusRtdbRepository(),
    effectsRepository: new EffectsRtdbRepository(),
    //
    squadRepository: new SquadRtdbRepository()
  }
}

export default repositoryMap
