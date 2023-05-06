import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkillsComponent } from './skills/skills.component';
import { KnowledgeComponent } from './knowledge/knowledge.component';

const routes: Routes = [
  { path: "", redirectTo: "/skills", pathMatch: "full" },
  { path: "skills", component: SkillsComponent },
  { path: "knowledge", component: KnowledgeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
