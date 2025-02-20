import AdditionalEffectsRtdbRepository from "lib/character/effects/AdditionalEffectsRtdbRepository"
import AdditionalRtdbRepository from "lib/objects/AdditionalRtdbRepository"
import AdditionalClothingsRtdbRepository from "lib/objects/data/clothings/AdditionalClothingsRtdbRepository"
import AdditionalConsumablesRtdbRepository from "lib/objects/data/consumables/AdditionalConsumablesRtdbRepository"
import AdditionalMiscRtdbRepository from "lib/objects/data/misc-objects/AdditionalMiscRtdbRepository"

const repositoryMap = {
  rtdb: {
    additionalRepository: new AdditionalRtdbRepository(),
    additionalClothingsRepository: new AdditionalClothingsRtdbRepository(),
    additionalConsumablesRepository: new AdditionalConsumablesRtdbRepository(),
    additionalEffectsRepository: new AdditionalEffectsRtdbRepository(),
    additionalMiscRepository: new AdditionalMiscRtdbRepository()
  }
}

export default repositoryMap
