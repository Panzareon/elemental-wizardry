import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActionsComponent } from './actions/actions.component';
import { KnowledgeComponent } from './knowledge/knowledge.component';
import { StoreComponent } from './store/store.component';
import { SpellbookComponent } from './spellbook/spellbook.component';

const routes: Routes = [
  { path: "", redirectTo: "/actions", pathMatch: "full" },
  { path: "actions", component: ActionsComponent },
  { path: "knowledge", component: KnowledgeComponent },
  { path: "spellbook", component: SpellbookComponent },
  { path: "store", component: StoreComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
