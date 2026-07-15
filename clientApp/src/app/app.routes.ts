import { Routes } from '@angular/router';
import { ApprovalTaskList } from './components/approval-task-list/approval-task-list';

export const routes: Routes = [
    { path: 'approvals', component: ApprovalTaskList },
    { path: '', redirectTo: 'approvals', pathMatch: 'full' }
];
