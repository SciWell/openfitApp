import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image,
  TouchableOpacity,
  Linking,
  useWindowDimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

const UserGuideScreen = () => {
  const { width } = useWindowDimensions();
  const { isDarkMode } = useTheme();
  
  // Responsive layout adjustments
  const isTablet = width > 768;
  
  const openExternalLink = (url) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView 
      style={[
        styles.container, 
        { backgroundColor: isDarkMode ? '#121212' : '#f8f8f8' }
      ]}
      contentContainerStyle={[
        styles.contentContainer,
        isTablet && styles.tabletContentContainer
      ]}
    >
      <View style={[
        styles.header,
        { backgroundColor: isDarkMode ? '#1E1E1E' : '#fff' }
      ]}>
        <Text style={[
          styles.title,
          { color: isDarkMode ? '#fff' : '#000' }
        ]}>User Guide</Text>
        <Text style={[
          styles.subtitle,
          { color: isDarkMode ? '#aaa' : '#666' }
        ]}>Everything you need to know about your workout app</Text>
      </View>

      <View style={[
        styles.section,
        { backgroundColor: isDarkMode ? '#1E1E1E' : '#fff' }
      ]}>
        <Text style={[
          styles.sectionTitle,
          { color: isDarkMode ? '#fff' : '#000' }
        ]}>Getting Started</Text>
        
        <View style={styles.guideItem}>
          <View style={styles.guideIcon}>
            <Ionicons name="person-add-outline" size={24} color="#4A90E2" />
          </View>
          <View style={styles.guideContent}>
            <Text style={[
              styles.guideTitle,
              { color: isDarkMode ? '#fff' : '#000' }
            ]}>Create an Account</Text>
            <Text style={[
              styles.guideText,
              { color: isDarkMode ? '#aaa' : '#666' }
            ]}>
              Sign up with your email or use social login options. Your data will be securely stored and synchronized across devices.
            </Text>
          </View>
        </View>
        
        <View style={styles.guideItem}>
          <View style={styles.guideIcon}>
            <Ionicons name="clipboard-outline" size={24} color="#4A90E2" />
          </View>
          <View style={styles.guideContent}>
            <Text style={[
              styles.guideTitle,
              { color: isDarkMode ? '#fff' : '#000' }
            ]}>Complete Onboarding</Text>
            <Text style={[
              styles.guideText,
              { color: isDarkMode ? '#aaa' : '#666' }
            ]}>
              Tell us about yourself, your fitness goals, current fitness levels, workout environment, and preferred schedule to get personalized recommendations.
            </Text>
          </View>
        </View>
        
        <View style={styles.guideItem}>
          <View style={styles.guideIcon}>
            <Ionicons name="fitness-outline" size={24} color="#4A90E2" />
          </View>
          <View style={styles.guideContent}>
            <Text style={[
              styles.guideTitle,
              { color: isDarkMode ? '#fff' : '#000' }
            ]}>Create Your First Workout</Text>
            <Text style={[
              styles.guideText,
              { color: isDarkMode ? '#aaa' : '#666' }
            ]}>
              Navigate to the Workouts tab and tap the "+" button to create your first workout. Add exercises, set your reps, sets, and weights.
            </Text>
          </View>
        </View>
      </View>

      <View style={[
        styles.section,
        { backgroundColor: isDarkMode ? '#1E1E1E' : '#fff' }
      ]}>
        <Text style={[
          styles.sectionTitle,
          { color: isDarkMode ? '#fff' : '#000' }
        ]}>Workout Management</Text>
        
        <View style={styles.guideItem}>
          <View style={styles.guideIcon}>
            <Ionicons name="add-circle-outline" size={24} color="#4A90E2" />
          </View>
          <View style={styles.guideContent}>
            <Text style={[
              styles.guideTitle,
              { color: isDarkMode ? '#fff' : '#000' }
            ]}>Creating Workouts</Text>
            <Text style={[
              styles.guideText,
              { color: isDarkMode ? '#aaa' : '#666' }
            ]}>
              Tap the "+" button on the Workouts screen to create a new workout. Give it a name, add exercises from our library, and configure sets, reps, and weights for each exercise.
            </Text>
          </View>
        </View>
        
        <View style={styles.guideItem}>
          <View style={styles.guideIcon}>
            <Ionicons name="play-circle-outline" size={24} color="#4A90E2" />
          </View>
          <View style={styles.guideContent}>
            <Text style={[
              styles.guideTitle,
              { color: isDarkMode ? '#fff' : '#000' }
            ]}>Starting a Workout</Text>
            <Text style={[
              styles.guideText,
              { color: isDarkMode ? '#aaa' : '#666' }
            ]}>
              Open a workout and tap "Start Workout" to begin. The app will guide you through each exercise, tracking your sets and providing rest timers between sets.
            </Text>
          </View>
        </View>
        
        <View style={styles.guideItem}>
          <View style={styles.guideIcon}>
            <Ionicons name="create-outline" size={24} color="#4A90E2" />
          </View>
          <View style={styles.guideContent}>
            <Text style={[
              styles.guideTitle,
              { color: isDarkMode ? '#fff' : '#000' }
            ]}>Editing Workouts</Text>
            <Text style={[
              styles.guideText,
              { color: isDarkMode ? '#aaa' : '#666' }
            ]}>
              Tap the edit icon on a workout to modify its details. You can add or remove exercises, change sets, reps, and weights, or update the workout name and notes.
            </Text>
          </View>
        </View>
      </View>

      <View style={[
        styles.section,
        { backgroundColor: isDarkMode ? '#1E1E1E' : '#fff' }
      ]}>
        <Text style={[
          styles.sectionTitle,
          { color: isDarkMode ? '#fff' : '#000' }
        ]}>Exercise Library</Text>
        
        <View style={styles.guideItem}>
          <View style={styles.guideIcon}>
            <Ionicons name="search-outline" size={24} color="#4A90E2" />
          </View>
          <View style={styles.guideContent}>
            <Text style={[
              styles.guideTitle,
              { color: isDarkMode ? '#fff' : '#000' }
            ]}>Finding Exercises</Text>
            <Text style={[
              styles.guideText,
              { color: isDarkMode ? '#aaa' : '#666' }
            ]}>
              Browse the exercise library by category or use the search function to find specific exercises. Filter by muscle group, equipment, or exercise type.
            </Text>
          </View>
        </View>
        
        <View style={styles.guideItem}>
          <View style={styles.guideIcon}>
            <Ionicons name="information-circle-outline" size={24} color="#4A90E2" />
          </View>
          <View style={styles.guideContent}>
            <Text style={[
              styles.guideTitle,
              { color: isDarkMode ? '#fff' : '#000' }
            ]}>Exercise Details</Text>
            <Text style={[
              styles.guideText,
              { color: isDarkMode ? '#aaa' : '#666' }
            ]}>
              Tap on an exercise to view detailed information, including proper form instructions, muscles worked, and demonstration videos.
            </Text>
          </View>
        </View>
      </View>

      <View style={[
        styles.section,
        { backgroundColor: isDarkMode ? '#1E1E1E' : '#fff' }
      ]}>
        <Text style={[
          styles.sectionTitle,
          { color: isDarkMode ? '#fff' : '#000' }
        ]}>Progress Tracking</Text>
        
        <View style={styles.guideItem}>
          <View style={styles.guideIcon}>
            <Ionicons name="trending-up-outline" size={24} color="#4A90E2" />
          </View>
          <View style={styles.guideContent}>
            <Text style={[
              styles.guideTitle,
              { color: isDarkMode ? '#fff' : '#000' }
            ]}>Progress Dashboard</Text>
            <Text style={[
              styles.guideText,
              { color: isDarkMode ? '#aaa' : '#666' }
            ]}>
              View your progress over time with visual charts and statistics. Track workout frequency, volume, and personal records.
            </Text>
          </View>
        </View>
        
        <View style={styles.guideItem}>
          <View style={styles.guideIcon}>
            <Ionicons name="calendar-outline" size={24} color="#4A90E2" />
          </View>
          <View style={styles.guideContent}>
            <Text style={[
              styles.guideTitle,
              { color: isDarkMode ? '#fff' : '#000' }
            ]}>Workout History</Text>
            <Text style={[
              styles.guideText,
              { color: isDarkMode ? '#aaa' : '#666' }
            ]}>
              Access your complete workout history to review past sessions. See what exercises you performed, the weights used, and your performance.
            </Text>
          </View>
        </View>
        
        <View style={styles.guideItem}>
          <View style={styles.guideIcon}>
            <Ionicons name="trophy-outline" size={24} color="#4A90E2" />
          </View>
          <View style={styles.guideContent}>
            <Text style={[
              styles.guideTitle,
              { color: isDarkMode ? '#fff' : '#000' }
            ]}>Achievements</Text>
            <Text style={[
              styles.guideText,
              { color: isDarkMode ? '#aaa' : '#666' }
            ]}>
              Earn achievements as you reach fitness milestones. Track your progress toward unlocking new achievements to stay motivated.
            </Text>
          </View>
        </View>
      </View>

      <View style={[
        styles.section,
        { backgroundColor: isDarkMode ? '#1E1E1E' : '#fff' }
      ]}>
        <Text style={[
          styles.sectionTitle,
          { color: isDarkMode ? '#fff' : '#000' }
        ]}>Settings & Preferences</Text>
        
        <View style={styles.guideItem}>
          <View style={styles.guideIcon}>
            <Ionicons name="moon-outline" size={24} color="#4A90E2" />
          </View>
          <View style={styles.guideContent}>
            <Text style={[
              styles.guideTitle,
              { color: isDarkMode ? '#fff' : '#000' }
            ]}>Dark Mode</Text>
            <Text style={[
              styles.guideText,
              { color: isDarkMode ? '#aaa' : '#666' }
            ]}>
              Toggle between light and dark mode in the Profile tab under Appearance settings. You can also set it to follow your system theme.
            </Text>
          </View>
        </View>
        
        <View style={styles.guideItem}>
          <View style={styles.guideIcon}>
            <Ionicons name="person-outline" size={24} color="#4A90E2" />
          </View>
          <View style={styles.guideContent}>
            <Text style={[
              styles.guideTitle,
              { color: isDarkMode ? '#fff' : '#000' }
            ]}>Account Settings</Text>
            <Text style={[
              styles.guideText,
              { color: isDarkMode ? '#aaa' : '#666' }
            ]}>
              Update your profile information, change your password, or manage notification preferences in the Profile tab.
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.supportButton}
        onPress={() => openExternalLink('https://example.com/support')}
      >
        <Ionicons name="help-circle-outline" size={20} color="#fff" />
        <Text style={styles.supportButtonText}>Get Support</Text>
      </TouchableOpacity>

      <View style={styles.versionContainer}>
        <Text style={[
          styles.versionText,
          { color: isDarkMode ? '#666' : '#999' }
        ]}>Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  tabletContentContainer: {
    paddingHorizontal: 64,
  },
  header: {
    borderRadius: 8,
    padding: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  section: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  guideItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  guideIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  guideContent: {
    flex: 1,
  },
  guideTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  guideText: {
    fontSize: 14,
    lineHeight: 20,
  },
  supportButton: {
    flexDirection: 'row',
    backgroundColor: '#4A90E2',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  supportButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  versionContainer: {
    alignItems: 'center',
  },
  versionText: {
    fontSize: 14,
  },
});

export default UserGuideScreen;
