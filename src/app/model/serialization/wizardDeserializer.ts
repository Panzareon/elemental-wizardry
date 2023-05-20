import { GameLocation } from "../gameLocation";
import { Knowledge } from "../knowledge";
import { Resource } from "../resource";
import { Skill } from "../skill";
import { Spell } from "../spell";
import { Unlocks } from "../unlocks";
import { Wizard } from "../wizard";
import { KnowledgeJson, LocationJson, ResourceJson, SkillJson, SpellJson, UnlocksJson, WizardJson } from "./wizardJson";

export { WizardDeserializer }

class WizardDeserializer {
    constructor (private json: WizardJson) {}

    public deserialize() : Wizard {
        var wizard = new Wizard(
            this.json.resources.map(x => this.deserializeResource(x)),
            this.json.skills.map(x => this.deserializeSkills(x)),
            this.json.knowledge.map(x => this.deserializeKnowledge(x)),
            [],
            this.json.unlocks.map(x => this.deserializeUnlocks(x)),
            this.json.locations.map(x => this.deserializeLocation(x)),
            this.json.spells.map(x => this.deserializeSpell(x)),
        );
        wizard.knowledge.forEach(x => x.getUnlocks(wizard));
        wizard.resources.forEach(x => x.amount = x.amount);
        return wizard;
    }
    deserializeSpell(x: SpellJson): Spell {
        return new Spell(x.type);
    }
    deserializeSkills(x: SkillJson): Skill {
        let skill = new Skill(x.type);
        skill.load(x.exp);
        if (x.durationInfo !== undefined) {
            skill.loadDuration(x.durationInfo.timeSpent);
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
    deserializeLocation(x: LocationJson): GameLocation {
        let location = new GameLocation(x.type);
        if (x.exploreProgress && location.exploreActive) {
            location.exploreActive.load(x.exploreProgress);
        }
        return location;
    }
    deserializeUnlocks(x: UnlocksJson): Unlocks {
        return new Unlocks(x.type);
    }
}