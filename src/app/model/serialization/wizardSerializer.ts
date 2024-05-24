import { TimedBuff } from "../timed-buff";
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
import { BuffJson, CompanionJson, GardenPlotJson, InfluenceJson, ItemJson, KnowledgeJson, LocationJson, RecipeJson, RecipeMachineJson, ResourceJson, SkillJson, SpellJson, UnlocksJson, WizardJson } from "./wizardJson";
import { Companion } from "../companion";
import { RecipeMachine } from "../recipeMachine";

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
            buffs: this.wizard.timedBuffs.map(x => this.serializeBuff(x)),
            availableUnlocks: this.wizard.availableUnlocks,
            influence: this.wizard.influence.map(x => this.serializeInfluence(x)),
            gardenPlots: this.wizard.gardenPlots.map(x => this.serializeGardenPlot(x)),
            recipeMachines: this.wizard.recipeMachines.map(x => this.serializeRecipeMachine(x)),
            recipe: this.wizard.recipe.map(x => this.serializeRecipe(x)),
            items: this.wizard.items.map(x => this.serializeItem(x, this.wizard)),
            companions: this.wizard.companions.map(x => this.serializeCompanion(x)),
            actives: this.wizard.active.map(x => x.serialize),
            data: this.wizard.data,
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
            numberCasts: x.numberCasts,
            available: x.available,
            levelAfterRewind: x.levelAfterRewind,
            ritual: x.cast.ritualCast !== undefined ? {
                isPrepared: x.cast.ritualCast.isPrepared,
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
            available: x.available,
            previousLevel: x.previousLevel,
            levelAfterRewind: x.levelAfterRewind,
        }
    }
    serializeLocation(x: GameLocation): LocationJson {
        return {
            type: x.type,
            exploreProgress: x.exploreActive?.progress ?? [],
            exploreAction: x.exploreAction === undefined ? undefined
                : {
                    type: x.exploreAction.type,
                    step: x.exploreAction.step,
                    selected: x.exploreAction.selectedOption?.uniqueId,
                    selectedData: x.exploreAction.selectedOption?.serializeData(),
                }
        }
    }
    serializeUnlocks(x: Unlocks): UnlocksJson {
        return {
            type: x.type,
            numberRepeated: x.numberRepeated,
        }
    }
    serializeBuff(x: TimedBuff): BuffJson {
        return {
            source: {
                type: x.source.buffSource,
                data: x.source.serializeTimedBuff(),
            },
            duration: x.duration,
            power: x.power,
            costMultiplier: x.costMultiplier,
            maxDuration: x.maxDuration,
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
    serializeRecipeMachine(x: RecipeMachine): RecipeMachineJson {
        return {
            type: x.type,
            recipe: x.recipe?.type,
            currentStepIndex: x.currentPart !== undefined ? x.recipe?.craftOrder.indexOf(x.currentPart) : undefined,
            progress: x.progress,
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