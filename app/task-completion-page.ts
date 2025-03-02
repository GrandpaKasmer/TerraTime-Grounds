import { EventData, Page, NavigatedData } from '@nativescript/core';
import { TaskCompletionViewModel } from './task-completion-view-model';

export function navigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    if (args.isBackNavigation) return;

    const taskType = args.context.taskType;
    const timerDisplay = args.context.timerDisplay;
    const startTime = args.context.startTime;
    const elapsedTime = args.context.elapsedTime;
    
    page.bindingContext = new TaskCompletionViewModel(taskType, timerDisplay, startTime, elapsedTime);
}