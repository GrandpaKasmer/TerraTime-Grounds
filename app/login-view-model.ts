import { Observable, Frame } from '@nativescript/core';
import * as phone from '@nativescript/phone';
import { Toasty } from 'nativescript-toasty';
import { supabase } from './supabase';
import { translations } from './i18n/translations';

export class LoginViewModel extends Observable {
    private _phoneNumber: string = '';
    private _verificationCode: string = '';
    private _errorMessage: string = '';
    private _isLoading: boolean = false;
    private _isSigningUp: boolean = false;
    private _isVerifying: boolean = false;
    private _isVerified: boolean = false;
    private _preferredLanguage: string = 'en';
    private _selectedRole: string = 'worker';
    private _verificationId: string = '';
    private _userExists: boolean = true;

    constructor() {
        super();
    }

    get phoneNumber(): string {
        return this._phoneNumber;
    }

    set phoneNumber(value: string) {
        if (this._phoneNumber !== value) {
            this._phoneNumber = value;
            this.notifyPropertyChange('phoneNumber', value);
        }
    }

    get verificationCode(): string {
        return this._verificationCode;
    }

    set verificationCode(value: string) {
        if (this._verificationCode !== value) {
            this._verificationCode = value;
            this.notifyPropertyChange('verificationCode', value);
        }
    }

    get errorMessage(): string {
        return this._errorMessage;
    }

    set errorMessage(value: string) {
        if (this._errorMessage !== value) {
            this._errorMessage = value;
            this.notifyPropertyChange('errorMessage', value);
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

    get isSigningUp(): boolean {
        return this._isSigningUp;
    }

    set isSigningUp(value: boolean) {
        if (this._isSigningUp !== value) {
            this._isSigningUp = value;
            this.notifyPropertyChange('isSigningUp', value);
        }
    }

    get isVerifying(): boolean {
        return this._isVerifying;
    }

    set isVerifying(value: boolean) {
        if (this._isVerifying !== value) {
            this._isVerifying = value;
            this.notifyPropertyChange('isVerifying', value);
        }
    }

    get isVerified(): boolean {
        return this._isVerified;
    }

    set isVerified(value: boolean) {
        if (this._isVerified !== value) {
            this._isVerified = value;
            this.notifyPropertyChange('isVerified', value);
        }
    }

    get preferredLanguage(): string {
        return this._preferredLanguage;
    }

    set preferredLanguage(value: string) {
        if (this._preferredLanguage !== value) {
            this._preferredLanguage = value;
            this.notifyPropertyChange('preferredLanguage', value);
        }
    }

    get selectedRole(): string {
        return this._selectedRole;
    }

    set selectedRole(value: string) {
        if (this._selectedRole !== value) {
            this._selectedRole = value;
            this.notifyPropertyChange('selectedRole', value);
        }
    }

    get userExists(): boolean {
        return this._userExists;
    }

    set userExists(value: boolean) {
        if (this._userExists !== value) {
            this._userExists = value;
            this.notifyPropertyChange('userExists', value);
        }
    }

    showSignup() {
        this.isSigningUp = true;
        this.errorMessage = '';
    }

    showLogin() {
        this.isSigningUp = false;
        this.errorMessage = '';
    }

    selectLanguage(args: any) {
        const button = args.object;
        this.preferredLanguage = button.language;
    }

    selectRole(args: any) {
        const button = args.object;
        this.selectedRole = button.role;
    }

    async sendVerificationCode() {
        try {
            this.isLoading = true;
            this.errorMessage = '';

            if (!this._phoneNumber || this._phoneNumber.trim().length < 10) {
                throw new Error('Please enter a valid phone number');
            }

            // Format phone number to E.164 format
            let formattedPhone = this._phoneNumber.trim();
            if (!formattedPhone.startsWith('+')) {
                formattedPhone = '+1' + formattedPhone; // Default to US if no country code
            }

            // Check if user exists
            const { data: user, error } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('phone_number', formattedPhone)
                .single();

            // Set userExists flag based on query result
            this.userExists = !(error && error.code === 'PGRST116');

            // In a real app, we would send an SMS here
            // For demo purposes, we'll simulate it
            this._verificationId = Math.floor(100000 + Math.random() * 900000).toString();
            
            // Show toast with verification code (in a real app, this would be sent via SMS)
            const toast = new Toasty({ text: `Your verification code is: ${this._verificationId}` });
            toast.show();

            // In a real implementation, we would use Supabase phone auth:
            // const { data, error } = await supabase.auth.signInWithOtp({
            //     phone: formattedPhone
            // });
            
            // if (error) throw error;

            this.isVerifying = true;
        } catch (error) {
            this.errorMessage = error.message;
        } finally {
            this.isLoading = false;
        }
    }

    async verifyCode() {
        try {
            this.isLoading = true;
            this.errorMessage = '';

            if (this._verificationCode !== this._verificationId) {
                throw new Error('Invalid verification code');
            }

            // In a real implementation, we would verify with Supabase:
            // const { data, error } = await supabase.auth.verifyOtp({
            //     phone: this._phoneNumber,
            //     token: this._verificationCode,
            //     type: 'sms'
            // });
            
            // if (error) throw error;

            this.isVerified = true;
            this.isVerifying = false;

            // If not signing up, proceed to login
            if (!this.isSigningUp) {
                await this.checkUserAndNavigate();
            }
        } catch (error) {
            this.errorMessage = error.message;
        } finally {
            this.isLoading = false;
        }
    }

    async checkUserAndNavigate() {
        try {
            this.isLoading = true;

            // Format phone number to E.164 format
            let formattedPhone = this._phoneNumber.trim();
            if (!formattedPhone.startsWith('+')) {
                formattedPhone = '+1' + formattedPhone; // Default to US if no country code
            }

            // Check if user exists in our database
            const { data: user, error } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('phone_number', formattedPhone)
                .single();

            if (error && error.code !== 'PGRST116') {
                throw error;
            }

            if (!user) {
                // User doesn't exist, show signup
                this.userExists = false;
                return;
            }

            // Store user info in app settings or similar
            // For demo, we'll just navigate based on role
            if (user.role === 'supervisor') {
                Frame.topmost().navigate({
                    moduleName: 'app/supervisor/dashboard-page',
                    clearHistory: true
                });
            } else {
                Frame.topmost().navigate({
                    moduleName: 'app/welcome-page',
                    clearHistory: true
                });
            }
        } catch (error) {
            this.errorMessage = error.message;
        } finally {
            this.isLoading = false;
        }
    }

    async completeSignup() {
        try {
            this.isLoading = true;
            this.errorMessage = '';

            // Format phone number to E.164 format
            let formattedPhone = this._phoneNumber.trim();
            if (!formattedPhone.startsWith('+')) {
                formattedPhone = '+1' + formattedPhone; // Default to US if no country code
            }

            // In a real implementation, we would create a Supabase auth user
            // For demo, we'll just create a profile directly
            
            // Generate a random UUID for the user
            const userId = 'user_' + Math.random().toString(36).substring(2, 15);

            // Create user profile
            const { error: profileError } = await supabase
                .from('user_profiles')
                .insert([
                    {
                        id: userId,
                        phone_number: formattedPhone,
                        preferred_language: this._preferredLanguage,
                        role: this._selectedRole
                    }
                ]);

            if (profileError) throw profileError;

            // Navigate based on role
            if (this._selectedRole === 'supervisor') {
                Frame.topmost().navigate({
                    moduleName: 'app/supervisor/dashboard-page',
                    clearHistory: true
                });
            } else {
                Frame.topmost().navigate({
                    moduleName: 'app/welcome-page',
                    clearHistory: true
                });
            }
        } catch (error) {
            this.errorMessage = error.message;
        } finally {
            this.isLoading = false;
        }
    }
}