import { Observable, Frame } from '@nativescript/core';

export class WelcomeViewModel extends Observable {
    constructor() {
        super();
    }

    onTaskSelect(args: any) {
        const taskType = args.object.taskType;
        Frame.topmost().navigate({
            moduleName: 'app/task-page',
            context: {
                taskType: taskType
            }
        });
    }
}