import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';

// Auth Screens
import SignInScreen from './screens/auth/SignInScreen';
import SignUpScreen from './screens/auth/SignUpScreen';
import ForgotPasswordScreen from './screens/auth/ForgotPasswordScreen';

// Onboarding Screens
import AboutYouScreen from './screens/onboarding/AboutYouScreen';
import FitnessGoalsScreen from './screens/onboarding/FitnessGoalsScreen';
import CurrentFitnessLevelsScreen from './screens/onboarding/CurrentFitnessLevelsScreen';
import WorkoutEnvironmentScreen from './screens/onboarding/WorkoutEnvironmentScreen';
import WorkoutScheduleScreen from './screens/onboarding/WorkoutScheduleScreen';

// Workout Screens
import WorkoutListScreen from './screens/workout/WorkoutListScreen';
import CreateWorkoutScreen from './screens/workout/CreateWorkoutScreen';
import SelectExercisesScreen from './screens/workout/SelectExercisesScreen';
import WorkoutDetailScreen from './screens/workout/WorkoutDetailScreen';
import EditWorkoutScreen from './screens/workout/EditWorkoutScreen';
import ActiveWorkoutScreen from './screens/workout/ActiveWorkoutScreen';

// Exercise Screens
import ExerciseLibraryScreen from './screens/exercise/ExerciseLibraryScreen';
import ExerciseDetailScreen from './screens/exercise/ExerciseDetailScreen';

// Progress Screens
import ProgressDashboardScreen from './screens/progress/ProgressDashboardScreen';
import WorkoutHistoryScreen from './screens/progress/WorkoutHistoryScreen';
import WorkoutHistoryDetailScreen from './screens/progress/WorkoutHistoryDetailScreen';
import AddWeightScreen from './screens/progress/AddWeightScreen';
import AchievementsScreen from './screens/progress/AchievementsScreen';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Auth Navigator
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SignIn" component={SignInScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </Stack.Navigator>
);

// Onboarding Navigator
const OnboardingStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AboutYou" component={AboutYouScreen} />
    <Stack.Screen name="FitnessGoals" component={FitnessGoalsScreen} />
    <Stack.Screen name="CurrentFitnessLevels" component={CurrentFitnessLevelsScreen} />
    <Stack.Screen name="WorkoutEnvironment" component={WorkoutEnvironmentScreen} />
    <Stack.Screen name="WorkoutSchedule" component={WorkoutScheduleScreen} />
  </Stack.Navigator>
);

// Workout Stack Navigator
const WorkoutStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="WorkoutList" component={WorkoutListScreen} />
    <Stack.Screen name="CreateWorkout" component={CreateWorkoutScreen} />
    <Stack.Screen name="SelectExercises" component={SelectExercisesScreen} />
    <Stack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} />
    <Stack.Screen name="EditWorkout" component={EditWorkoutScreen} />
    <Stack.Screen name="ActiveWorkout" component={ActiveWorkoutScreen} />
  </Stack.Navigator>
);

// Exercise Stack Navigator
const ExerciseStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ExerciseLibrary" component={ExerciseLibraryScreen} />
    <Stack.Screen name="ExerciseDetail" component={ExerciseDetailScreen} />
  </Stack.Navigator>
);

// Progress Stack Navigator
const ProgressStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProgressDashboard" component={ProgressDashboardScreen} />
    <Stack.Screen name="WorkoutHistory" component={WorkoutHistoryScreen} />
    <Stack.Screen name="WorkoutHistoryDetail" component={WorkoutHistoryDetailScreen} />
    <Stack.Screen name="AddWeight" component={AddWeightScreen} />
    <Stack.Screen name="Achievements" component={AchievementsScreen} />
  </Stack.Navigator>
);

// Main Tab Navigator
const MainTabs = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Workouts') {
            iconName = focused ? 'fitness' : 'fitness-outline';
          } else if (route.name === 'Exercises') {
            iconName = focused ? 'barbell' : 'barbell-outline';
          } else if (route.name === 'Progress') {
            iconName = focused ? 'trending-up' : 'trending-up-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4A90E2',
        tabBarInactiveTintColor: isDarkMode ? '#888' : '#666',
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#121212' : '#fff',
          borderTopColor: isDarkMode ? '#333' : '#eee',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        }
      })}
    >
      <Tab.Screen name="Workouts" component={WorkoutStack} />
      <Tab.Screen name="Exercises" component={ExerciseStack} />
      <Tab.Screen name="Progress" component={ProgressStack} />
    </Tab.Navigator>
  );
};

// Root Navigator
const AppNavigator = () => {
  const { user, loading, hasCompletedOnboarding } = useAuth();
  const { isDarkMode } = useTheme();
  const colorScheme = useColorScheme();
  
  // Use system color scheme if available, otherwise use theme context
  const theme = colorScheme === 'dark' || isDarkMode ? DarkTheme : DefaultTheme;
  
  // Customize theme colors
  const customTheme = {
    ...theme,
    colors: {
      ...theme.colors,
      primary: '#4A90E2',
      background: isDarkMode ? '#121212' : '#f8f8f8',
      card: isDarkMode ? '#1E1E1E' : '#FFFFFF',
      text: isDarkMode ? '#FFFFFF' : '#000000',
      border: isDarkMode ? '#333333' : '#EEEEEE',
    },
  };

  if (loading) {
    return null; // Or a loading screen
  }

  return (
    <NavigationContainer theme={customTheme}>
      {!user ? (
        <AuthStack />
      ) : !hasCompletedOnboarding ? (
        <OnboardingStack />
      ) : (
        <MainTabs />
      )}
    </NavigationContainer>
  );
};

export default function Navigation() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </ThemeProvider>
  );
}
