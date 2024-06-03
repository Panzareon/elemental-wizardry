import { ITimedBuffSource, TimedBuff, TimedBuffSourceType } from "../timed-buff";
import { GameLocation } from "../gameLocation";
import { GardenPlot, GardenPlotPlant } from "../garden-plot";
import { Influence } from "../influence";
import { Item, ItemTimedBuffSource } from "../item";
import { Knowledge } from "../knowledge";
import { Recipe } from "../recipe";
import { Resource, TimedBuffResourceAdjustment } from "../resource";
import { Skill } from "../skill";
import { Spell } from "../spell";
import { Unlocks } from "../unlocks";
import { Wizard } from "../wizard";
import { BuffJson, CompanionJson, GardenPlotJson, InfluenceJson, ItemJson, KnowledgeJson, LocationJson, RecipeJson, RecipeMachineJson, ResourceJson, SkillJson, SpellJson, UnlocksJson, WizardJson } from "./wizardJson";
import { Companion } from "../companion";
import { ActiveType, IActive } from "../active";
import { RecipeMachine } from "../recipeMachine";
import { ExploreActionDuration } from "../exploreAction";

export { WizardDeserializer }

class WizardDeserializer {
    constructor (private json: WizardJson) {}

    public deserialize() : Wizard {
        let spells = this.json.spells.map(x => this.deserializeSpell(x));
        let items = this.json.items?.map(x => this.deserializeItems(x)) ?? [];
        let recipes = this.json.recipe?.map(x => this.deserializeRecipe(x)) ?? [];
        let resources = this.json.resources.map(x => this.deserializeResource(x));
        var wizard = new Wizard(
            resources,
            this.json.skills.map(x => this.deserializeSkills(x, spells)),
            this.json.knowledge.map(x => this.deserializeKnowledge(x)),
            [],
            this.json.unlocks.map(x => this.deserializeUnlocks(x)),
            this.json.locations.map(x => this.deserializeLocation(x)),
            spells,
            this.json.buffs.flatMap(x => this.deserializeBuffs(x, spells, resources)),
            this.json.availableUnlocks,
            this.json.influence?.map(x => this.deserializeInfluence(x)) ?? [],
            this.json.gardenPlots?.map((x, index) => this.deserializeGardenPlot(x, index)) ?? [],
            this.json.recipeMachines?.map((x, index) => this.deserializeRecipeMachine(x, index, recipes)) ?? [],
            recipes,
            items.map(x => x[0]),
            this.json.companions?.map(x => this.deserializeCompanion(x)) ??[],
            this.json.data ?? {},
        );
        wizard.unlocks.forEach(x => x.afterLoad(wizard));
        wizard.resources.forEach(x => x.productionAdjustment.load(wizard));
        wizard.recalculateStats();
        items.filter(x => x[1]).forEach(x => wizard.attuneItem(x[0]));
        wizard.knowledge.forEach(x => x.getUnlocks(wizard));
        wizard.influence.forEach(x => x.checkUnlocks(wizard));
        wizard.resources.forEach(x => x.addAmount(0, wizard));
        wizard.location.forEach(x => x.exploreAction?.checkResult(wizard));

        if (this.json.actives !== undefined) {
            for (const serializedActive of this.json.actives) {
                const active = this.findActive(wizard, serializedActive);
                if (active !== null) {
                    wizard.setActive(active);
                }
            }
        }
        return wizard;
    }
    findActive(wizard: Wizard, serializedActive: [ActiveType, any]) : IActive | null {
        switch (serializedActive[0]) {
            case ActiveType.ExploreLocation:
                return wizard.location.find(x => x.type === serializedActive[1])?.exploreActive ?? null;
            case ActiveType.Ritual:
                return wizard.spells.find(x => x.type === serializedActive[1])?.cast.ritualCast ?? null;
            case ActiveType.Skill:
                return wizard.skills.find(x => x.type === serializedActive[1]) ?? null;
            case ActiveType.KnowledgeTraining:
                return wizard.knowledge.find(x => x.type === serializedActive[1])?.trainingActive ?? null;
            case ActiveType.KnowledgeStudy:
                return wizard.knowledge.find(x => x.type === serializedActive[1])?.studyActive ?? null;
            case ActiveType.GardenPlot:
                return wizard.gardenPlots.length > serializedActive[1] ? wizard.gardenPlots[serializedActive[1]] : null;
            case ActiveType.RecipeMachine:
                return wizard.recipeMachines.length > serializedActive[1] ? wizard.recipeMachines[serializedActive[1]] : null;
            case ActiveType.ExploreAction:
                return wizard.location.find(x => x.type === serializedActive[1][0])?.exploreAction?.options.find(x => x instanceof ExploreActionDuration && (x as ExploreActionDuration).uniqueId === serializedActive[1][1]) as ExploreActionDuration;
        }
    }
    deserializeSpell(x: SpellJson): Spell {
        let spell = new Spell(x.type);
        spell.load(x.level, x.exp, x.numberCasts ?? x.ritual?.numberCasts ?? 0, x.available ?? true, x.levelAfterRewind ?? 0);
        if (x.ritual !== undefined && spell.cast.ritualCast !== undefined) {
            spell.cast.ritualCast.load(x.ritual.channelProgress, x.ritual.isChanneling, x.ritual.isPrepared)
        }
        return spell;
    }
    deserializeSkills(x: SkillJson, spells: Spell[]): Skill {
        let skill = new Skill(x.type);
        skill.load(x.exp);
        if (x.durationInfo !== undefined) {
            let durationInfo = x.durationInfo;
            skill.loadDuration(durationInfo.timeSpent, durationInfo.increasedOutput, spells.filter(spell => durationInfo.activeSpells.includes(spell.type)));
        }
        return skill;
    }
    deserializeResource(x: ResourceJson): Resource {
        let resource = new Resource(x.type)
        resource.load(x.amount);
        return resource;
    }
    deserializeKnowledge(x: KnowledgeJson): Knowledge {
        let knowledge = new Knowledge(x.type);
        knowledge.load(x.level, x.exp, x.previousLevel ?? 0, x.available ?? true, x.levelAfterRewind ?? 0);
        return knowledge;
    }
    deserializeBuffs(buff: BuffJson, spells: Spell[], resources: Resource[]) : TimedBuff[] {
        let source : ITimedBuffSource|undefined;
        switch (buff.source.type) {
            case TimedBuffSourceType.Spell:
                source = spells.find(x => x.type == buff.source.data) ?? new Spell(buff.source.data);
                break;
            case TimedBuffSourceType.Item:
                source = new ItemTimedBuffSource(buff.source.data);
                break;
            case TimedBuffSourceType.Resource:
                let resource = resources.find(x => x.type === buff.source.data[0]) ?? new Resource(buff.source.data[0]);
                source = resource.productionAdjustment instanceof TimedBuffResourceAdjustment ? resource.productionAdjustment : undefined;
        }
        if (source === undefined) {
            return [];
        }

        return [new TimedBuff(source, buff.duration, buff.power, buff.costMultiplier, buff.maxDuration)];
    }
    deserializeLocation(x: LocationJson): GameLocation {
        let location = new GameLocation(x.type);
        if (x.exploreProgress && location.exploreActive) {
            location.exploreActive.load(x.exploreProgress);
        }
        if (x.exploreAction !== undefined) {
            let action = location.setExploreAction(x.exploreAction.type);
            action.load(x.exploreAction.step, x.exploreAction.selected, x.exploreAction.selectedData)
        }
        return location;
    }
    deserializeUnlocks(x: UnlocksJson): Unlocks {
        let unlock = new Unlocks(x.type);
        unlock.load(x.numberRepeated);
        return unlock;
    }
    deserializeInfluence(x: InfluenceJson): Influence {
        let influence = new Influence(x.type);
        influence.load(x.amount);
        return influence;
    }
    deserializeGardenPlot(x: GardenPlotJson, index: number): GardenPlot {
        let gardenPlot = new GardenPlot(index);
        if (x.type !== GardenPlotPlant.Empty) {
            gardenPlot.plant(x.type);
        }
        gardenPlot.load(x.state, x.remainingPlantTime, x.remainingGrowTime, x.remainingHarvestTime, x.water ?? 0);
        return gardenPlot;
    }
    deserializeRecipeMachine(x: RecipeMachineJson, index: number, recipes: Recipe[]): RecipeMachine {
        let recipeMachine = new RecipeMachine(x.type, index);
        let recipe = undefined;
        let recipeStep = undefined;
        if (x.recipe !== undefined && x.currentStepIndex !== undefined) {
            recipe = recipes.find(r => r.type === x.recipe);
            if (recipe !== undefined) {
                recipeStep = recipe.craftOrder[x.currentStepIndex];
            }
        }

        recipeMachine.load(recipe, recipeStep, x.progress);
        return recipeMachine;
    }
    deserializeRecipe(x: RecipeJson): Recipe {
        return new Recipe(x.type);
    }
    deserializeItems(x: ItemJson): [Item,boolean] {
        return [new Item(x.type, x.level), x.isAttuned];
    }
    deserializeCompanion(x: CompanionJson): Companion {
        let companion = new Companion(x.type, x.level ?? 1);
        if (x.active !== undefined) {
            companion.actions.filter(a => x.active.includes(a.type)).forEach(a => a.isActive = true);
        }
        return companion;
    }
}