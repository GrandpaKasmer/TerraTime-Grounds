import { Observable, Frame } from '@nativescript/core';
import * as geolocation from '@nativescript/geolocation';
import * as camera from '@nativescript/camera';
import { SpeechRecognition } from 'nativescript-speech-recognition';
import { supabase } from './supabase';
import { translations } from './i18n/translations';

export class TaskCompletionViewModel extends Observable {
    private _taskType: string;
    private _timerDisplay: string;
    private _startTime: Date;
    private _elapsedTime: number;
    private _isLoading: boolean = false;
    private _language: string = 'en';
    private _photoUrl: string | null = null;
    private _voiceNotes: string = '';
    private _isRecording: boolean = false;
    private _taskTitle: string = '';

    constructor(taskType: string, timerDisplay: string, startTime: Date, elapsedTime: number) {
        super();
        this._taskType = taskType;
        this._timerDisplay = timerDisplay;
        this._startTime = startTime;
        this._elapsedTime = elapsedTime;
        
        this.loadUserLanguage();
        this._taskTitle = this.getTaskTitle();
        
        this.set('taskTitle', this._taskTitle);
        this.set('timerDisplay', this._timerDisplay);
        this.set('isLoading', false);
        this.set('photoUrl', null);
        this.set('voiceNotes', '');
        this.set('isRecording', false);
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
                this._taskTitle = this.getTaskTitle();
                this.set('taskTitle', this._taskTitle);
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

    get photoUrl(): string | null {
        return this._photoUrl;
    }

    set photoUrl(value: string | null) {
        if (this._photoUrl !== value) {
            this._photoUrl = value;
            this.notifyPropertyChange('photoUrl', value);
        }
    }

    get voiceNotes(): string {
        return this._voiceNotes;
    }

    set voiceNotes(value: string) {
        if (this._voiceNotes !== value) {
            this._voiceNotes = value;
            this.notifyPropertyChange('voiceNotes', value);
        }
    }

    get isRecording(): boolean {
        return this._isRecording;
    }

    set isRecording(value: boolean) {
        if (this._isRecording !== value) {
            this._isRecording = value;
            this.notifyPropertyChange('isRecording', value);
        }
    }

    async takePhoto() {
        try {
            const imageAsset = await camera.takePicture({
                width: 300,
                height: 300,
                keepAspectRatio: true,
                saveToGallery: false
            });
            
            // In a real app, we would upload this to Supabase Storage
            // For now, we'll just set a placeholder URL
            this.photoUrl = "https://via.placeholder.com/300";
            
            // Show success message
            console.log("Photo taken successfully");
        } catch (error) {
            console.error('Error taking photo:', error);
        }
    }

    async recordVoice() {
        try {
            const speechRecognition = new SpeechRecognition();
            const available = await speechRecognition.available();
            
            if (available) {
                this.isRecording = true;
                
                const result = await speechRecognition.startListening({
                    locale: "en-US",
                    onResult: (transcription: string) => {
                        this.voiceNotes = transcription;
                    },
                    returnPartialResults: false
                });
                
                this.isRecording = false;
            } else {
                console.log("Speech recognition not available");
                // Fallback for demo
                this.voiceNotes = "Voice note recorded (simulated)";
            }
        } catch (error) {
            console.error('Error with speech recognition:', error);
            this.isRecording = false;
            // Fallback for demo
            this.voiceNotes = "Voice note recorded (simulated)";
        }
    }

    async submitTask() {
        try {
            this.isLoading = true;
            
            // Get location
            let location = null;
            try {
                location = await geolocation.getCurrentLocation({
                    desiredAccuracy: 3,
                    maximumAge: 5000,
                    timeout: 10000
                });
            } catch (error) {
                console.error('Error getting location:', error);
            }

            // Save task data
            const user = (await supabase.auth.getUser()).data.user;
            const { data: taskData, error: taskError } = await supabase
                .from('tasks')
                .insert([
                    {
                        user_id: user?.id || 'anonymous',
                        task_type: this._taskType,
                        start_time: this._startTime.toISOString(),
                        end_time: new Date().toISOString(),
                        duration: this._elapsedTime,
                        location_lat: location?.latitude,
                        location_lng: location?.longitude,
                        voice_notes: this._voiceNotes,
                        photo_url: this._photoUrl
                    }
                ]);

            if (taskError) throw taskError;

            // Navigate back to welcome page
            Frame.topmost().navigate({
                moduleName: 'app/welcome-page',
                clearHistory: true
            });

        } catch (error) {
            console.error('Error submitting task:', error);
        } finally {
            this.isLoading = false;
        }
    }

    private getTaskTitle(): string {
        return translations[this._language].tasks[this._taskType] || 'Unknown Task';
    }
}