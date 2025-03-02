import { Observable, Frame } from '@nativescript/core';
import * as geolocation from '@nativescript/geolocation';
import * as camera from '@nativescript/camera';
import { SpeechRecognition } from 'nativescript-speech-recognition';
import * as email from '@nativescript/email';
import { supabase } from './supabase';
import { translations } from './i18n/translations';

export class TaskViewModel extends Observable {
    private _taskType: string;
    private _isRunning: boolean = false;
    private _startTime: Date | null = null;
    private _elapsedTime: number = 0;
    private _timer: any;
    private _pausedTime: number = 0;
    private _isLoading: boolean = false;
    private _language: string = 'en';

    constructor(taskType: string) {
        super();
        this._taskType = taskType;
        this.loadUserLanguage();
        this.set('taskTitle', this.getTaskTitle());
        this.set('taskImage', this.getTaskImage());
        this.set('isRunning', false);
        this.set('timerDisplay', '00:00:00');
        this.set('isLoading', false);
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

    get isLoading(): boolean {
        return this._isLoading;
    }

    set isLoading(value: boolean) {
        if (this._isLoading !== value) {
            this._isLoading = value;
            this.notifyPropertyChange('isLoading', value);
        }
    }

    get isRunning(): boolean {
        return this._isRunning;
    }

    toggleTimer() {
        if (!this._isRunning) {
            this.startTimer();
        } else {
            this.pauseTimer();
        }
    }

    private startTimer() {
        if (!this._startTime) {
            this._startTime = new Date();
        }
        this._isRunning = true;
        this.set('isRunning', true);

        this._timer = setInterval(() => {
            const now = new Date();
            this._elapsedTime = now.getTime() - this._startTime!.getTime() - this._pausedTime;
            this.updateTimerDisplay();
        }, 1000);
    }

    private pauseTimer() {
        if (this._timer) {
            clearInterval(this._timer);
            this._pausedTime += new Date().getTime() - this._startTime!.getTime();
        }
        this._isRunning = false;
        this.set('isRunning', false);
    }

    async stopTask() {
        this.pauseTimer();
        
        // Navigate to task completion page
        Frame.topmost().navigate({
            moduleName: 'app/task-completion-page',
            context: {
                taskType: this._taskType,
                timerDisplay: this.get('timerDisplay'),
                startTime: this._startTime,
                elapsedTime: this._elapsedTime
            }
        });
    }

    private updateTimerDisplay() {
        const hours = Math.floor(this._elapsedTime / (1000 * 60 * 60));
        const minutes = Math.floor((this._elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((this._elapsedTime % (1000 * 60)) / 1000);

        this.set('timerDisplay', 
            `${hours.toString().padStart(2, '0')}:${
             minutes.toString().padStart(2, '0')}:${
             seconds.toString().padStart(2, '0')}`
        );
    }

    private getTaskTitle(): string {
        return translations[this._language].tasks[this._taskType] || 'Unknown Task';
    }

    private getTaskImage(): string {
        return `~/assets/images/${this._taskType}.png`;
    }
}