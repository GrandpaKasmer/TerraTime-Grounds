import { EventData, Page, NavigatedData } from '@nativescript/core';

export function navigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    if (args.isBackNavigation) return;

    const task = args.context.task;
    
    // Add formatted time
    const startTime = new Date(task.start_time);
    task.formattedTime = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    page.bindingContext = { task };
}