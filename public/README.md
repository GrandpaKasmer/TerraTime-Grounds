# TerraTime Grounds App

## Overview

TerraTime Grounds is a mobile application designed for grounds maintenance workers and their supervisors. The app allows workers to track their tasks, record time spent, take photos, and add voice notes. Supervisors can monitor worker activities and review completed tasks.

## Features

- **User Authentication**: Phone number verification with SMS code
- **User Roles**: Worker and Supervisor interfaces
- **Task Tracking**: Timer for tracking work duration
- **Documentation**: Photo capture and voice notes
- **Location Tracking**: Records where tasks are performed
- **Task History**: View previously completed tasks
- **Multilingual Support**: English and Spanish interfaces

## Permission Requirements

The app requires several permissions to function properly:

### Location Permission
- **Purpose**: Track where tasks are performed
- **Benefit**: Helps supervisors verify work and improves service quality
- **Usage**: Only accessed when actively tracking a task
- **iOS Info.plist**: `NSLocationWhenInUseUsageDescription`

### Camera Permission
- **Purpose**: Document completed work
- **Benefit**: Provides verification of task completion and quality
- **Usage**: Only accessed when taking photos of completed tasks
- **iOS Info.plist**: `NSCameraUsageDescription`

### Microphone Permission
- **Purpose**: Record voice notes about tasks
- **Benefit**: Allows workers to provide additional details about completed work
- **Usage**: Only accessed when recording voice notes
- **iOS Info.plist**: `NSMicrophoneUsageDescription`

## App Store Compliance

This app follows Apple's guidelines for permission requests:

1. **Clear Purpose**: Each permission request clearly explains why the permission is needed
2. **User Control**: Users can deny permissions and still use core app functionality
3. **Contextual Requests**: Permissions are only requested when the feature is being used
4. **Privacy Focus**: Location data is only collected during active task tracking
5. **Transparency**: All data collection is clearly explained to users

## Development Notes

- The app uses a responsive design that works on various device sizes
- Permission requests follow Apple Human Interface Guidelines
- All permission text is localized for supported languages
- The app gracefully handles denied permissions with appropriate fallbacks