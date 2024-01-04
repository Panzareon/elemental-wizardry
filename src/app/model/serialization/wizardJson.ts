import { ExploreResultType, LocationType } from "../gameLocation";
import { GardenPlotPlant, GrowState } from "../garden-plot";
import { InfluenceType } from "../influence";
import { KnowledgeType } from "../knowledge";
import { ResourceType } from "../resource";
import { SkillType } from "../skill";
import { SpellType } from "../spell";
import { UnlockType } from "../unlocks";

export { WizardJson, ResourceJson, SpellJson, KnowledgeJson, UnlocksJson, SkillJson, LocationJson, BuffJson, InfluenceJson, GardenPlotJson }

interface WizardJson {
    resources: ResourceJson[];
    spells: SpellJson[];
    skills: SkillJson[];
    knowledge: KnowledgeJson[];
    unlocks: UnlocksJson[];
    locations: LocationJson[];
    buffs: BuffJson[];
    availableUnlocks: UnlockType[];
    influence: InfluenceJson[];
    gardenPlots: GardenPlotJson[];
}
interface ResourceJson {
    type: ResourceType;
    amount: number;
}
interface SpellJson {
    type: SpellType;
    level: number;
    exp: number;
}
interface KnowledgeJson {
    type: KnowledgeType;
    level: number;
    exp: number;
}
interface BuffJson {
    type: SpellType;
    duration: number;
    power: number;
    costMultiplier: number;
}
interface UnlocksJson {
    type: UnlockType;
    numberRepeated: number;
}
interface SkillJson {
    type: SkillType;
    exp: number;
    durationInfo?: SkillDurationInfo;
}
interface SkillDurationInfo {
    timeSpent: number;
    increasedOutput: number;
    activeSpells: SpellType[];
}
interface LocationJson {
    type: LocationType;
    exploreProgress: [ExploreResultType, number, boolean, boolean][];
}
interface InfluenceJson {
    type: InfluenceType;
    amount: number;
}
interface GardenPlotJson {
    type: GardenPlotPlant;
    state: GrowState;
    remainingPlantTime: number;
    remainingGrowTime: number;
    remainingHarvestTime: number;
}