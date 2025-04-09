# Database Schema Analysis for Workout Application

## Overview
The database schema represents a comprehensive workout tracking application with tables for users, workouts, exercises, and tracking progress. The schema is designed to support a mobile application built with React Native, Expo, and Supabase.

## Tables and Relationships

### 1. profiles
This table stores user profile information:
- `id`: Primary key (uuid)
- `email`: User's email address (text)
- `created_at`: Timestamp when profile was created
- `updated_at`: Timestamp when profile was last updated
- `primarygoal`: User's primary fitness goal (text)
- `fitnessgoals`: Multiple fitness goals (text)
- `cardiolevel`: User's cardio/endurance level (text)
- `weightliftinglevel`: User's weightlifting experience level (text)
- `equipment`: Available equipment (text)
- `workoutdays`: Preferred workout days (text)
- `workoutduration`: Preferred workout duration (text)
- `workoutfrequency`: Preferred workout frequency (text)
- `has_completed_preferences`: Boolean flag for onboarding completion
- `fitness_guide`: Additional fitness information (text)
- `display_name`: User's display name (text)
- `gender`: User's gender (text)
- `age`: User's age (int4)
- `height`: User's height (numeric)
- `height_unit`: Unit for height measurement (text)
- `weight`: User's weight (numeric)
- `weight_unit`: Unit for weight measurement (text)
- `sport_activity`: Specific sport or activity (text)
- `excluded_exercises`: Exercises to avoid (text)
- `additional_notes`: Any additional user notes (text)
- `cardio_level_description`: Detailed description of cardio level (text)
- `weightlifting_level_description`: Detailed description of weightlifting level (text)
- `onboarding_completed`: Flag indicating onboarding completion (bool)
- `metadata`: Additional metadata (jsonb)

### 2. workouts
This table defines workout templates:
- `id`: Primary key (uuid)
- `user_id`: Foreign key to profiles (uuid)
- `name`: Workout name (text)
- `start_time`: Scheduled start time (timestamp)
- `end_time`: Scheduled end time (timestamp)
- `is_active`: Whether workout is active (bool)
- `duration`: Expected workout duration (int4)
- `notes`: Additional notes (text)
- `created_at`: Creation timestamp
- `rating`: User rating for workout (int2)
- `is_minimized`: UI state for workout (bool)
- `last_state`: Last state of workout (jsonb)
- `is_completed`: Whether workout is completed (bool)
- `session_order`: Order in session (int4)
- `updated_at`: Last update timestamp
- `ai_description`: AI-generated description (text)

### 3. exercises
This table contains exercise definitions:
- `id`: Primary key (uuid)
- `name`: Exercise name (text)
- `description`: Exercise description (text)
- `video_url`: URL to demonstration video (text)
- `primary_muscle`: Primary muscle targeted (text)
- `equipment`: Required equipment (text)
- `created_at`: Creation timestamp
- `secondary_muscle`: Secondary muscles targeted (text)
- `instructions`: Detailed instructions (text)
- `category`: Exercise category (text)

### 4. workout_exercises
This table links workouts to exercises:
- `id`: Primary key (uuid)
- `workout_id`: Foreign key to workouts (uuid)
- `exercise_id`: Foreign key to exercises (uuid)
- `sets`: Number of sets (int4)
- `reps_old`: Previous repetition count (int4)
- `order_index`: Order within workout (int4)
- `completed`: Whether exercise is completed (bool)
- `created_at`: Creation timestamp
- `weight_old`: Previous weight used (int4)
- `name`: Exercise name override (text)
- `rest_interval`: Rest interval between sets (int8)
- `weight`: Current weight (int8)
- `reps`: Current repetition count (int8)
- `order`: Order within workout (int4)

### 5. workout_logs
This table tracks completed workout sessions:
- `id`: Primary key (uuid)
- `user_id`: Foreign key to profiles (uuid)
- `workout_id`: Foreign key to workouts (uuid)
- `completed_at`: Completion timestamp
- `duration`: Actual duration (int4)
- `rating`: User rating (int4)
- `notes`: User notes (text)
- `created_at`: Creation timestamp

### 6. completed_workouts
This table stores completed workout information:
- `id`: Primary key (int8)
- `created_at`: Creation timestamp
- `workout_id`: Foreign key to workouts (uuid)
- `date_completed`: Completion date (timestamp)
- `user_feedback_comment`: User feedback (text)
- `user_id`: Foreign key to profiles (uuid)
- `duration`: Workout duration (int4)
- `calories_burned`: Estimated calories burned (int4)
- `rating`: User rating (int4)
- `completed_workout_summary`: Summary (jsonb)

### 7. completed_sets
This table tracks individual completed exercise sets:
- `id`: Primary key (uuid)
- `workout_id`: Foreign key to workouts (uuid)
- `workout_exercise_id`: Foreign key to workout_exercises (uuid)
- `performed_set_order`: Set order (int4)
- `performed_reps`: Repetitions performed (int4)
- `performed_weight`: Weight used (int4)
- `set_feedback_difficulty`: User feedback on difficulty (text)
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

## Key Relationships
1. `profiles` ↔ `workouts`: One-to-many (user creates multiple workouts)
2. `workouts` ↔ `workout_exercises`: One-to-many (workout contains multiple exercises)
3. `exercises` ↔ `workout_exercises`: One-to-many (exercise can be in multiple workouts)
4. `profiles` ↔ `workout_logs`: One-to-many (user logs multiple workout sessions)
5. `workouts` ↔ `workout_logs`: One-to-many (workout can be logged multiple times)
6. `profiles` ↔ `completed_workouts`: One-to-many (user completes multiple workouts)
7. `workouts` ↔ `completed_workouts`: One-to-many (workout can be completed multiple times)
8. `workout_exercises` ↔ `completed_sets`: One-to-many (exercise in workout has multiple completed sets)

## Schema Observations
1. The schema supports tracking both workout templates and actual workout sessions.
2. User profiles contain extensive information collected during onboarding.
3. Exercise tracking is detailed, with support for sets, reps, and weights.
4. The schema includes fields for user feedback and ratings.
5. Timestamps are used throughout for tracking creation and updates.
6. The schema supports both planned workouts and completed workout history.

## Recommendations for Implementation
1. The `profiles` table will need to be extended to store all onboarding data as specified in requirements.
2. Consider adding fields for progress photos and achievement tracking.
3. Implement proper indexing for frequently queried fields.
4. Use foreign key constraints to maintain data integrity.
5. Consider adding a table for tracking body measurements over time.
6. Implement proper validation for all user inputs.
