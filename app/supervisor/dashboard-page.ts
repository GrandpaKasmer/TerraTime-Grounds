import { EventData, Page } from '@nativescript/core';
import { SupervisorDashboardViewModel } from './dashboard-view-model';

export function navigatingTo(args: EventData) {
    const page = <Page>args.object;
    page.bindingContext = new SupervisorDashboardViewModel();
}