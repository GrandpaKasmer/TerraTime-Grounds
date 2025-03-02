import { EventData, Page, NavigatedData } from '@nativescript/core';
import { WelcomeViewModel } from './welcome-view-model';

export function navigatingTo(args: EventData) {
    const page = <Page>args.object;
    page.bindingContext = new WelcomeViewModel();
}