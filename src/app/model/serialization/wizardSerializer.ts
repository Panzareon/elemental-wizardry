import { GameLocation } from "../gameLocation";
import { Knowledge } from "../knowledge";
import { Resource } from "../resource";
import { Skill } from "../skill";
import { Spell } from "../spell";
import { Unlocks } from "../unlocks";
import { Wizard } from "../wizard";
import { KnowledgeJson, LocationJson, ResourceJson, SkillJson, SpellJson, UnlocksJson, WizardJson } from "./wizardJson";

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
            unlocks: this.wizard.unlocks.map(x => this.serializeUnlocks(x))
        }
    }
    serializeResource(x: Resource): ResourceJson {
        return {
            type: x.type,
            amount: x.amount,
        }
    }
    serializeSkill(x: Skill): SkillJson {
        return {
            type: x.type,
        }
    }
    serializeSpell(x: Spell): SpellJson {
        return {
            type: x.type,
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
        }
    }
    serializeUnlocks(x: Unlocks): UnlocksJson {
        return {
            type: x.type,
        }
    }
}