import CharacterRtdbRepository from "lib/character/CharacterRtdbRepository"
import AdditionalEffectsRtdbRepository from "lib/character/effects/AdditionalEffectsRtdbRepository"
import EffectsRtdbRepository from "lib/character/effects/EffectsRtdbRepository"
import StatusRtdbRepository from "lib/character/status/StatusRtdbRepository"
import ActionRtdbRepository from "lib/combat/ActionRtdbRepository"
import CombatRtdbRepository from "lib/combat/CombatRtdbRepository"
import RoundRtdbRepository from "lib/combat/RoundRtdbRepository"
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
    roundRepository: new RoundRtdbRepository(),
    actionRepository: new ActionRtdbRepository(),
    enemyRepository: new EnemyRtdbRepository(),
    characterRepository: new CharacterRtdbRepository(),
    statusRepository: new StatusRtdbRepository(),
    effectsRepository: new EffectsRtdbRepository(),
    //
    squadRepository: new SquadRtdbRepository()
  }
}

export default repositoryMap
