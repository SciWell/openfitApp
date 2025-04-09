import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from './src/context/AuthContext';

// Auth Screens
import SignInScreen from './src/screens/auth/SignInScreen';
import SignUpScreen from './src/screens/auth/SignUpScreen';
import ForgotPasswordScreen from './src/screens/auth/ForgotPasswordScreen';

// Onboarding Screens
import AboutYouScreen from './src/screens/onboarding/AboutYouScreen';
import FitnessGoalsScreen from './src/screens/onboarding/FitnessGoalsScreen';
import CurrentFitnessLevelsScreen from './src/screens/onboarding/CurrentFitnessLevelsScreen';
import WorkoutEnvironmentScreen from './src/screens/onboarding/WorkoutEnvironmentScreen';
import WorkoutScheduleScreen from './src/screens/onboarding/WorkoutScheduleScreen';

// Main App Placeholder
const MainAppScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Main App - Coming Soon</Text>
  </View>
);

const Stack = createStackNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SignIn" component={SignInScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </Stack.Navigator>
);

const OnboardingStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AboutYou" component={AboutYouScreen} />
    <Stack.Screen name="FitnessGoals" component={FitnessGoalsScreen} />
    <Stack.Screen name="CurrentFitnessLevels" component={CurrentFitnessLevelsScreen} />
    <Stack.Screen name="WorkoutEnvironment" component={WorkoutEnvironmentScreen} />
    <Stack.Screen name="WorkoutSchedule" component={WorkoutScheduleScreen} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!user ? (
        <AuthStack />
      ) : (
        // Check if user has completed onboarding
        user.onboarding_completed ? (
          <MainAppScreen />
        ) : (
          <OnboardingStack />
        )
      )}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
