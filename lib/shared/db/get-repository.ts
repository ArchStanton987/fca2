import CharacterRtdbRepository from "lib/character/CharacterRtdbRepository"
import AdditionalEffectsRtdbRepository from "lib/character/effects/AdditionalEffectsRtdbRepository"
import StatusRtdbRepository from "lib/character/status/StatusRtdbRepository"
import CombatRtdbRepository from "lib/combat/CombatRtdbRepository"
import EnemyRtdbRepository from "lib/enemy/EnemyRtdbRepository"
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
    enemyRepository: new EnemyRtdbRepository(),
    characterRepository: new CharacterRtdbRepository(),
    statusRepository: new StatusRtdbRepository(),
    //
    squadRepository: new SquadRtdbRepository()
  }
}

export default repositoryMap
