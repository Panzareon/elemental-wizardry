import { Component } from '@angular/core';
import { IKnowledgeAction, Knowledge } from '../model/knowledge';
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
    return this.data.wizard.availableKnowledge;
  }

  toggleStudy(knowledgeAction: IKnowledgeAction) {
    if (this.isStudyActive(knowledgeAction)) {
      this.data.wizard.setInactive(knowledgeAction);
    }
    else {
      this.data.wizard.setActive(knowledgeAction);
    }
  }
  isStudyActive(knowledgeAction: IKnowledgeAction) {
    return this.data.wizard.active.includes(knowledgeAction);
  }
}
