import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { KnowledgeType } from './model/knowledge';
import { UnlockType } from './model/unlocks';

@Injectable({
  providedIn: 'root'
})
export class UnlocksService {

  constructor(private data: DataService) { }

  public getAvailableUnlocks() : UnlockType[] {
    var availableUnlocks = this.getAvailableUnlocksInternal();
    return availableUnlocks.filter(x => !this.data.wizard.unlocks.some(u => u.type == x));
  }
  getAvailableUnlocksInternal() : UnlockType[]{
    const result = [];
    const magicKnowledgeLevel = this.data.wizard.getKnowledgeLevel(KnowledgeType.MagicKnowledge);
    if (magicKnowledgeLevel !== null && magicKnowledgeLevel >= 4) {
      result.push(UnlockType.ManaProduction);
    }

    return result;
  }
}
