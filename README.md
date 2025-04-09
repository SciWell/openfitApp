# Workout Mobile App - README

## Overview

This is a comprehensive mobile workout application built with React Native, Expo, and Supabase. The app allows users to create and track workouts, browse an exercise library, monitor their progress, and achieve fitness goals.

## Features

### User Authentication
- Email/password registration and login
- Password reset functionality
- Social login integration
- Secure session management

### Detailed Onboarding
- Personal details collection (gender, age, height, weight)
- Fitness goals selection
- Current fitness level assessment
- Workout environment preferences
- Workout schedule planning

### Workout Management
- Create, view, edit, and delete workouts
- Add exercises to workouts with customizable sets, reps, and weights
- Organize workouts by category or goal
- Detailed workout view with exercise information

### Exercise Library
- Comprehensive database of exercises
- Search and filter by muscle group, equipment, or exercise type
- Detailed exercise information including proper form and muscles worked
- Exercise demonstration videos

### Workout Tracking
- Start and complete workout sessions
- Log sets, reps, and weights during workouts
- Rest timer between sets
- Workout completion summary

### Progress Monitoring
- Visual progress charts for key metrics
- Weight tracking with history
- Exercise progress visualization
- Workout history logs
- Achievement system for motivation

### UI/UX Features
- Intuitive tab-based navigation
- Dark and light mode support
- System theme integration
- Responsive design for different screen sizes
- Accessibility features

## Technical Stack

- **Frontend**: React Native with Expo
- **Backend**: Supabase (PostgreSQL database with RESTful API)
- **Authentication**: Supabase Auth
- **State Management**: React Context API
- **Navigation**: React Navigation
- **UI Components**: Custom components with Ionicons
- **Charts**: React Native Chart Kit

## Database Schema

The application uses the following database tables:

- `profiles`: User profile information
- `workouts`: Workout templates created by users
- `exercises`: Exercise library with details
- `workout_exercises`: Junction table linking workouts and exercises
- `completed_workouts`: Record of completed workout sessions
- `completed_sets`: Detailed tracking of sets performed during workouts

## Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/workout-mobile-app.git
cd workout-mobile-app
```

2. Install dependencies:
```
npm install
```

3. Create a `.env` file in the root directory with your Supabase credentials:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```
npx expo start
```

## Building for Production

### Android
```
eas build -p android
```

### iOS
```
eas build -p ios
```

## Testing

The application includes a comprehensive test suite. To run tests:

1. Navigate to the Test screen in the app
2. Click "Run Tests" to execute the test suite
3. View test results and fix any issues

## User Guide

A detailed user guide is available within the app. Navigate to the Profile tab and select "Help & Support" to access it.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Supabase for the backend infrastructure
- Expo team for the excellent React Native tooling
- The open-source community for various libraries used in this project
