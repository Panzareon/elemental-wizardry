import { ActiveType } from "../active";
import { CompanionActionType, CompanionType } from "../companion";
import { ExploreResultType, LocationType } from "../gameLocation";
import { GardenPlotPlant, GrowState } from "../garden-plot";
import { InfluenceType } from "../influence";
import { ItemType } from "../item";
import { KnowledgeType } from "../knowledge";
import { RecipeType } from "../recipe";
import { ResourceType } from "../resource";
import { SkillType } from "../skill";
import { SpellType } from "../spell";
import { TimedBuffSourceType } from "../timed-buff";
import { UnlockType } from "../unlocks";
import { WizardDataType } from "../wizard";

export { WizardJson, ResourceJson, SpellJson, KnowledgeJson, UnlocksJson, SkillJson, LocationJson, BuffJson, InfluenceJson, GardenPlotJson, RecipeJson, ItemJson, CompanionJson }

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
    recipe: RecipeJson[];
    items: ItemJson[];
    companions: CompanionJson[];
    actives: [ActiveType, any][];
    data: {[id in WizardDataType]? : number};
}
interface ResourceJson {
    type: ResourceType;
    amount: number;
}
interface SpellJson {
    type: SpellType;
    level: number;
    exp: number;
    numberCasts: number;
    available: boolean;
    ritual?: SpellRitualInfo;
}
interface SpellRitualInfo {
    isPrepared: boolean;
    numberCasts?: number; // Obsolete, only for restoring old saves
    isChanneling: boolean;
    channelProgress: number;
}
interface KnowledgeJson {
    type: KnowledgeType;
    level: number;
    exp: number;
    previousLevel: number;
    available: boolean;
}
interface BuffJson {
    source: BuffSourceJson;
    duration: number;
    power: number;
    costMultiplier: number;
    maxDuration: number;
}
interface BuffSourceJson {
    type: TimedBuffSourceType;
    data: any;
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
interface RecipeJson {
    type: RecipeType;
}
interface ItemJson {
    type: ItemType;
    level: number;
    isAttuned: boolean;
}
interface CompanionJson {
    type: CompanionType;
    level: number;
    active: CompanionActionType[];
}