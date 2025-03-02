import { EventData, Page, NavigatedData } from '@nativescript/core';
import { TaskViewModel } from './task-view-model';

export function navigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    if (args.isBackNavigation) return;

    const taskType = args.context.taskType;
    page.bindingContext = new TaskViewModel(taskType);
}