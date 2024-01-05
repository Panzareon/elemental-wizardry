import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { WizardSerializer } from './model/serialization/wizardSerializer';
import { WizardDeserializer } from './model/serialization/wizardDeserializer';

@Injectable({
  providedIn: 'root'
})
export class SaveService {
  private saveItemName = "save";
  private saveIntervalInSeconds = 10;
  private toNextSave: number = this.saveIntervalInSeconds;
  constructor(private data: DataService) { }

  public tick(deltaTime: number){
    this.toNextSave -= deltaTime;
    if (this.toNextSave <= 0) {
      this.save();
      this.toNextSave += this.saveIntervalInSeconds;
    }
  }
  public save() {
    var serializer = new WizardSerializer(this.data.wizard);
    var json = serializer.serialize();
    window.localStorage.setItem(this.saveItemName, JSON.stringify(json));
  }

  public load() {
    if (this.saveItemName in window.localStorage) {
      var json = window.localStorage.getItem(this.saveItemName);
      if (json) {
        var deserializer = new WizardDeserializer(JSON.parse(json));
        var wizard = deserializer.deserialize();
        this.data.loadSave(wizard);
      }
    }
  }
}
