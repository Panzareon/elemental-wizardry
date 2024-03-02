import { SpellBuff } from "../spell-buff";
import { GameLocation } from "../gameLocation";
import { GardenPlot } from "../garden-plot";
import { Influence } from "../influence";
import { Item } from "../item";
import { Knowledge } from "../knowledge";
import { Recipe } from "../recipe";
import { Resource } from "../resource";
import { Skill, SkillActionType } from "../skill";
import { Spell } from "../spell";
import { Unlocks } from "../unlocks";
import { Wizard } from "../wizard";
import { BuffJson, CompanionJson, GardenPlotJson, InfluenceJson, ItemJson, KnowledgeJson, LocationJson, RecipeJson, ResourceJson, SkillJson, SpellJson, UnlocksJson, WizardJson } from "./wizardJson";
import { Companion } from "../companion";

export { WizardSerializer }

class WizardSerializer {
    constructor(private wizard: Wizard) {
    }

    public serialize() : WizardJson {
        return {
            resources: this.wizard.resources.map(x => this.serializeResource(x)),
            skills: this.wizard.skills.map(x => this.serializeSkill(x)),
            spells: this.wizard.spells.map(x => this.serializeSpell(x)),
            knowledge: this.wizard.knowledge.map(x => this.serializeKnowledge(x)),
            locations: this.wizard.location.map(x => this.serializeLocation(x)),
            unlocks: this.wizard.unlocks.map(x => this.serializeUnlocks(x)),
            buffs: this.wizard.spellBuffs.map(x => this.serializeBuff(x)),
            availableUnlocks: this.wizard.availableUnlocks,
            influence: this.wizard.influence.map(x => this.serializeInfluence(x)),
            gardenPlots: this.wizard.gardenPlots.map(x => this.serializeGardenPlot(x)),
            recipe: this.wizard.recipe.map(x => this.serializeRecipe(x)),
            items: this.wizard.items.map(x => this.serializeItem(x, this.wizard)),
            companions: this.wizard.companions.map(x => this.serializeCompanion(x)),
            actives: this.wizard.active.map(x => x.serialize),
        }
    }
    serializeResource(x: Resource): ResourceJson {
        return {
            type: x.type,
            amount: x.amount,
        }
    }
    serializeSkill(x: Skill): SkillJson {
        let skill : SkillJson = {
            type: x.type,
            exp: x.exp,
        }
        if (x.actionType == SkillActionType.Duration) {
            skill.durationInfo = {
                timeSpent: x.durationTimeSpent,
                increasedOutput: x.durationIncreasedOutput,
                activeSpells: x.activeDurationSpells.map(x => x.type),
            };
        }

        return skill;
    }
    serializeSpell(x: Spell): SpellJson {
        return {
            type: x.type,
            level: x.level,
            exp: x.exp,
            ritual: x.cast.ritualCast !== undefined ? {
                isPrepared: x.cast.ritualCast.isPrepared,
                numberCasts: x.cast.ritualCast.numberCasts,
                isChanneling: x.cast.ritualCast.isChanneling,
                channelProgress: x.cast.ritualCast.channelProgress,
            } : undefined,
        }
    }
    serializeKnowledge(x: Knowledge): KnowledgeJson {
        return {
            type: x.type,
            level: x.level,
            exp: x.exp,
        }
    }
    serializeLocation(x: GameLocation): LocationJson {
        return {
            type: x.type,
            exploreProgress: x.exploreActive?.progress ?? [],
        }
    }
    serializeUnlocks(x: Unlocks): UnlocksJson {
        return {
            type: x.type,
            numberRepeated: x.numberRepeated,
        }
    }
    serializeBuff(x: SpellBuff): BuffJson {
        return {
            type: x.spell.type,
            duration: x.duration,
            power: x.power,
            costMultiplier: x.costMultiplier,
        }
    }
    serializeInfluence(x: Influence): InfluenceJson {
        return {
            type: x.type,
            amount: x.amount,
        };
    }
    serializeGardenPlot(x: GardenPlot): GardenPlotJson {
        return  {
            type: x.plantType,
            state: x.state,
            remainingPlantTime: x.remainingPlantTime,
            remainingGrowTime: x.remainingGrowTime,
            remainingHarvestTime: x.remainingHarvestTime,
        }
    }
    serializeRecipe(x: Recipe): RecipeJson {
        return {type: x.type};
    }
    serializeItem(x: Item, wizard: Wizard): ItemJson {
        return {
            type: x.type,
            level: x.level,
            isAttuned: wizard.attunedItems.includes(x),
        }
    }
    serializeCompanion(x: Companion): CompanionJson {
        return {
            type: x.type,
            level: x.level,
            active: x.actions.filter(a => a.isActive).map(a => a.type)
        }
    }
}