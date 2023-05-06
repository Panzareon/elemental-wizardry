import { Component } from '@angular/core';
import { Knowledge } from '../model/knowledge';
import { DataService } from '../data.service';

@Component({
  selector: 'app-knowledge',
  templateUrl: './knowledge.component.html',
  styleUrls: ['./knowledge.component.less']
})
export class KnowledgeComponent {
  constructor (private data: DataService) {
  }

  getKnowledge(): Knowledge[] {
    return this.data.wizard.knowledge;
  }

  toggleLearning(knowledge: Knowledge) {
    if (this.isActive(knowledge)) {
      this.data.wizard.setInactive(knowledge);
    }
    else {
      this.data.wizard.setActive(knowledge);
    }
  }
  isActive(knowledge: Knowledge) {
    return this.data.wizard.active.includes(knowledge);
  }
}
