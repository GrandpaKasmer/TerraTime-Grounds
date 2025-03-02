import { EventData, Page, NavigatedData } from '@nativescript/core';
import { supabase } from '../supabase';
import { translations } from '../i18n/translations';

export function navigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    if (args.isBackNavigation) return;

    const worker = args.context.worker;
    page.bindingContext = { worker, tasks: [] };
    
    loadWorkerTasks(worker.id, page);
}

async function loadWorkerTasks(workerId: string, page: Page) {
    try {
        // Get user language preference
        const { data: profile } = await supabase
            .from('user_profiles')
            .select('preferred_language')
            .eq('id', workerId)
            .single();
            
        const language = profile?.preferred_language || 'en';
        
        // Get worker tasks
        const { data: tasks, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('user_id', workerId)
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
            
            // Get task name in current language
            const taskName = translations[language].tasks[task.task_type] || 'Unknown Task';
            
            return {
                ...task,
                formattedDate,
                formattedDuration,
                taskName
            };
        });

        page.bindingContext.tasks = formattedTasks;
    } catch (error) {
        console.error('Error loading worker tasks:', error);
    }
}