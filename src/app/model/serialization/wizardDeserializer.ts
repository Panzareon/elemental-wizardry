import { Buff } from "../buff";
import { GameLocation } from "../gameLocation";
import { Knowledge } from "../knowledge";
import { Resource } from "../resource";
import { Skill } from "../skill";
import { Spell, SpellType } from "../spell";
import { Unlocks } from "../unlocks";
import { Wizard } from "../wizard";
import { BuffJson, KnowledgeJson, LocationJson, ResourceJson, SkillJson, SpellJson, UnlocksJson, WizardJson } from "./wizardJson";

export { WizardDeserializer }

class WizardDeserializer {
    constructor (private json: WizardJson) {}

    public deserialize() : Wizard {
        let spells = this.json.spells.map(x => this.deserializeSpell(x));
        var wizard = new Wizard(
            this.json.resources.map(x => this.deserializeResource(x)),
            this.json.skills.map(x => this.deserializeSkills(x, spells)),
            this.json.knowledge.map(x => this.deserializeKnowledge(x)),
            [],
            this.json.unlocks.map(x => this.deserializeUnlocks(x)),
            this.json.locations.map(x => this.deserializeLocation(x)),
            spells,
            this.json.buffs.map(x => this.deserializeBuffs(x, spells)),
            this.json.availableUnlocks,
        );
        wizard.knowledge.forEach(x => x.getUnlocks(wizard));
        wizard.resources.forEach(x => x.amount = x.amount);
        return wizard;
    }
    deserializeSpell(x: SpellJson): Spell {
        let spell = new Spell(x.type);
        spell.load(x.level, x.exp);
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
        knowledge.load(x.level, x.exp);
        return knowledge;
    }
    deserializeBuffs(buff: BuffJson, spells: Spell[]) {
        let spell = spells.find(x => x.type == buff.type);
        return new Buff(spell!, buff.duration, buff.power, buff.costMultiplier);
    }
    deserializeLocation(x: LocationJson): GameLocation {
        let location = new GameLocation(x.type);
        if (x.exploreProgress && location.exploreActive) {
            location.exploreActive.load(x.exploreProgress);
        }
        return location;
    }
    deserializeUnlocks(x: UnlocksJson): Unlocks {
        let unlock = new Unlocks(x.type);
        unlock.load(x.numberRepeated);
        return unlock;
    }
}