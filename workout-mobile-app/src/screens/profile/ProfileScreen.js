import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Switch,
  useWindowDimensions,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const ProfileScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const { isDarkMode, toggleTheme, useSystemTheme, toggleUseSystemTheme } = useTheme();
  const { user, signOut } = useAuth();
  
  // Responsive layout adjustments
  const isTablet = width > 768;
  
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
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
        ]}>Profile</Text>
      </View>

      <View style={[
        styles.profileCard,
        { backgroundColor: isDarkMode ? '#1E1E1E' : '#fff' },
        isTablet && styles.tabletCard
      ]}>
        <View style={styles.profileHeader}>
          <View style={styles.profileAvatar}>
            <Text style={styles.avatarText}>
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[
              styles.profileName,
              { color: isDarkMode ? '#fff' : '#000' }
            ]}>
              {user?.email?.split('@')[0] || 'User'}
            </Text>
            <Text style={[
              styles.profileEmail,
              { color: isDarkMode ? '#aaa' : '#666' }
            ]}>
              {user?.email || 'user@example.com'}
            </Text>
          </View>
        </View>
      </View>

      <View style={[
        styles.section,
        { backgroundColor: isDarkMode ? '#1E1E1E' : '#fff' },
        isTablet && styles.tabletCard
      ]}>
        <Text style={[
          styles.sectionTitle,
          { color: isDarkMode ? '#fff' : '#000' }
        ]}>Appearance</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Ionicons 
              name={isDarkMode ? "moon" : "sunny"} 
              size={24} 
              color={isDarkMode ? "#fff" : "#000"} 
              style={styles.settingIcon}
            />
            <Text style={[
              styles.settingText,
              { color: isDarkMode ? '#fff' : '#000' }
            ]}>Dark Mode</Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            disabled={useSystemTheme}
            trackColor={{ false: '#767577', true: '#4A90E2' }}
            thumbColor={Platform.OS === 'ios' ? '' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
          />
        </View>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Ionicons 
              name="phone-portrait-outline" 
              size={24} 
              color={isDarkMode ? "#fff" : "#000"} 
              style={styles.settingIcon}
            />
            <Text style={[
              styles.settingText,
              { color: isDarkMode ? '#fff' : '#000' }
            ]}>Use System Theme</Text>
          </View>
          <Switch
            value={useSystemTheme}
            onValueChange={toggleUseSystemTheme}
            trackColor={{ false: '#767577', true: '#4A90E2' }}
            thumbColor={Platform.OS === 'ios' ? '' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
          />
        </View>
      </View>

      <View style={[
        styles.section,
        { backgroundColor: isDarkMode ? '#1E1E1E' : '#fff' },
        isTablet && styles.tabletCard
      ]}>
        <Text style={[
          styles.sectionTitle,
          { color: isDarkMode ? '#fff' : '#000' }
        ]}>Account</Text>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('EditProfile')}
          accessibilityRole="button"
          accessibilityLabel="Edit Profile"
          accessibilityHint="Navigate to edit profile screen"
        >
          <View style={styles.menuItemContent}>
            <Ionicons 
              name="person-outline" 
              size={24} 
              color={isDarkMode ? "#fff" : "#000"} 
              style={styles.menuIcon}
            />
            <Text style={[
              styles.menuText,
              { color: isDarkMode ? '#fff' : '#000' }
            ]}>Edit Profile</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={isDarkMode ? "#666" : "#999"} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('ChangePassword')}
          accessibilityRole="button"
          accessibilityLabel="Change Password"
          accessibilityHint="Navigate to change password screen"
        >
          <View style={styles.menuItemContent}>
            <Ionicons 
              name="lock-closed-outline" 
              size={24} 
              color={isDarkMode ? "#fff" : "#000"} 
              style={styles.menuIcon}
            />
            <Text style={[
              styles.menuText,
              { color: isDarkMode ? '#fff' : '#000' }
            ]}>Change Password</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={isDarkMode ? "#666" : "#999"} />
        </TouchableOpacity>
      </View>

      <View style={[
        styles.section,
        { backgroundColor: isDarkMode ? '#1E1E1E' : '#fff' },
        isTablet && styles.tabletCard
      ]}>
        <Text style={[
          styles.sectionTitle,
          { color: isDarkMode ? '#fff' : '#000' }
        ]}>Support</Text>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('Help')}
          accessibilityRole="button"
          accessibilityLabel="Help and Support"
          accessibilityHint="Navigate to help and support screen"
        >
          <View style={styles.menuItemContent}>
            <Ionicons 
              name="help-circle-outline" 
              size={24} 
              color={isDarkMode ? "#fff" : "#000"} 
              style={styles.menuIcon}
            />
            <Text style={[
              styles.menuText,
              { color: isDarkMode ? '#fff' : '#000' }
            ]}>Help & Support</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={isDarkMode ? "#666" : "#999"} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('About')}
          accessibilityRole="button"
          accessibilityLabel="About"
          accessibilityHint="Navigate to about screen"
        >
          <View style={styles.menuItemContent}>
            <Ionicons 
              name="information-circle-outline" 
              size={24} 
              color={isDarkMode ? "#fff" : "#000"} 
              style={styles.menuIcon}
            />
            <Text style={[
              styles.menuText,
              { color: isDarkMode ? '#fff' : '#000' }
            ]}>About</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={isDarkMode ? "#666" : "#999"} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={[
          styles.signOutButton,
          isTablet && styles.tabletButton
        ]}
        onPress={handleSignOut}
        accessibilityRole="button"
        accessibilityLabel="Sign Out"
        accessibilityHint="Sign out of your account"
      >
        <Text style={styles.signOutButtonText}>Sign Out</Text>
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
  },
  tabletContentContainer: {
    paddingHorizontal: 64,
  },
  header: {
    padding: 20,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileCard: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabletCard: {
    borderRadius: 12,
    padding: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
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
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 12,
  },
  menuText: {
    fontSize: 16,
  },
  signOutButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  tabletButton: {
    paddingVertical: 20,
    borderRadius: 12,
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  versionContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  versionText: {
    fontSize: 14,
  },
});

export default ProfileScreen;
