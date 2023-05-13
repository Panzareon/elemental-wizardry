import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkillsComponent } from './skills/skills.component';
import { KnowledgeComponent } from './knowledge/knowledge.component';
import { StoreComponent } from './store/store.component';
import { SpellbookComponent } from './spellbook/spellbook.component';

const routes: Routes = [
  { path: "", redirectTo: "/skills", pathMatch: "full" },
  { path: "skills", component: SkillsComponent },
  { path: "knowledge", component: KnowledgeComponent },
  { path: "spellbook", component: SpellbookComponent },
  { path: "store", component: StoreComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
