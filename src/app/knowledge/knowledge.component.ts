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

  toggleStudy(knowledge: Knowledge) {
    if (this.isStudyActive(knowledge)) {
      this.data.wizard.setInactive(knowledge.studyActive);
    }
    else {
      this.data.wizard.setActive(knowledge.studyActive);
    }
  }
  isStudyActive(knowledge: Knowledge) {
    return this.data.wizard.active.includes(knowledge.studyActive);
  }

  toggleTraining(knowledge: Knowledge) {
    if (this.isTrainingActive(knowledge)) {
      this.data.wizard.setInactive(knowledge.trainingActive);
    }
    else {
      this.data.wizard.setActive(knowledge.trainingActive);
    }
  }
  isTrainingActive(knowledge: Knowledge) {
    return this.data.wizard.active.includes(knowledge.trainingActive);
  }
}
