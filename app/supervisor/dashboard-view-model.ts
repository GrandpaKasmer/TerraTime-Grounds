import { Observable, Frame } from '@nativescript/core';
import { supabase, UserProfile, Task } from '../supabase';
import { translations } from '../i18n/translations';

export class SupervisorDashboardViewModel extends Observable {
    private _workers: Array<UserProfile> = [];
    private _tasks: Array<any> = [];
    private _selectedTabIndex: number = 0;
    private _language: string = 'en';

    constructor() {
        super();
        this.set('workers', []);
        this.set('tasks', []);
        this.set('selectedTabIndex', 0);
        this.loadUserLanguage();
        this.loadWorkers();
        this.loadTasks();
    }

    private async loadUserLanguage() {
        try {
            const user = (await supabase.auth.getUser()).data.user;
            const { data: profile } = await supabase
                .from('user_profiles')
                .select('preferred_language')
                .eq('id', user?.id || '')
                .single();

            if (profile) {
                this._language = profile.preferred_language;
            }
        } catch (error) {
            console.error('Error loading user language:', error);
        }
    }

    get selectedTabIndex(): number {
        return this._selectedTabIndex;
    }

    set selectedTabIndex(value: number) {
        if (this._selectedTabIndex !== value) {
            this._selectedTabIndex = value;
            this.notifyPropertyChange('selectedTabIndex', value);
        }
    }

    async loadWorkers() {
        try {
            // In a real app, we would filter by supervisor_id
            // For demo, we'll just get all workers
            const { data, error } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('role', 'worker');

            if (error) throw error;

            this.set('workers', data || []);
        } catch (error) {
            console.error('Error loading workers:', error);
        }
    }

    async loadTasks() {
        try {
            // Get all tasks
            const { data: tasks, error } = await supabase
                .from('tasks')
                .select('*, user_profiles(full_name, phone_number)')
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Format tasks for display
            const formattedTasks = (tasks || []).map(task => {
                const startTime = new Date(task.start_time);
                const endTime = task.end_time ? new Date(task.end_time) : null;
                
                // Calculate duration in minutes
                const durationMinutes = endTime 
                    ? Math.floor((endTime.getTime() - startTime.getTime()) / (1000 * 60)) 
                    : 0;
                
                // Format duration as hours and minutes
                const hours = Math.floor(durationMinutes / 60);
                const minutes = durationMinutes % 60;
                const formattedDuration = `${hours}h ${minutes}m`;
                
                // Format date
                const formattedDate = startTime.toLocaleDateString();
                
                // Get worker name
                const workerProfile = task.user_profiles;
                const workerName = workerProfile?.full_name || workerProfile?.phone_number || 'Unknown';
                
                // Get task name in current language
                const taskName = translations[this._language].tasks[task.task_type] || 'Unknown Task';
                
                return {
                    ...task,
                    formattedDate,
                    formattedDuration,
                    workerName,
                    taskName
                };
            });

            this.set('tasks', formattedTasks);
        } catch (error) {
            console.error('Error loading tasks:', error);
        }
    }

    onWorkerTap(args: any) {
        const worker = this._workers[args.index];
        Frame.topmost().navigate({
            moduleName: 'app/supervisor/worker-details-page',
            context: {
                worker
            }
        });
    }

    onTaskTap(args: any) {
        const task = this._tasks[args.index];
        Frame.topmost().navigate({
            moduleName: 'app/supervisor/task-details-page',
            context: {
                task
            }
        });
    }
}