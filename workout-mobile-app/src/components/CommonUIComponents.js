import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  useWindowDimensions,
  AccessibilityInfo,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

const CommonUIComponents = () => {
  const { width } = useWindowDimensions();
  const { isDarkMode } = useTheme();
  
  // Responsive layout adjustments
  const isTablet = width > 768;
  
  // Colors based on theme
  const colors = {
    background: isDarkMode ? '#121212' : '#f8f8f8',
    card: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    textSecondary: isDarkMode ? '#AAAAAA' : '#666666',
    border: isDarkMode ? '#333333' : '#EEEEEE',
    primary: '#4A90E2',
    success: '#4CD964',
    warning: '#FF9500',
    error: '#FF3B30',
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.contentContainer,
        isTablet && styles.tabletContentContainer
      ]}
    >
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Buttons</Text>
        
        <View style={styles.componentRow}>
          <TouchableOpacity 
            style={[styles.primaryButton, isTablet && styles.tabletButton]}
            accessibilityRole="button"
            accessibilityLabel="Primary Button"
            accessibilityHint="Example of a primary button"
          >
            <Text style={styles.primaryButtonText}>Primary Button</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.secondaryButton, isTablet && styles.tabletButton]}
            accessibilityRole="button"
            accessibilityLabel="Secondary Button"
            accessibilityHint="Example of a secondary button"
          >
            <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>Secondary Button</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.componentRow}>
          <TouchableOpacity 
            style={[styles.successButton, isTablet && styles.tabletButton]}
            accessibilityRole="button"
            accessibilityLabel="Success Button"
            accessibilityHint="Example of a success button"
          >
            <Text style={styles.buttonText}>Success</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.warningButton, isTablet && styles.tabletButton]}
            accessibilityRole="button"
            accessibilityLabel="Warning Button"
            accessibilityHint="Example of a warning button"
          >
            <Text style={styles.buttonText}>Warning</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.errorButton, isTablet && styles.tabletButton]}
            accessibilityRole="button"
            accessibilityLabel="Error Button"
            accessibilityHint="Example of an error button"
          >
            <Text style={styles.buttonText}>Error</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.componentRow}>
          <TouchableOpacity 
            style={[styles.iconButton, { backgroundColor: colors.primary }]}
            accessibilityRole="button"
            accessibilityLabel="Add Button"
            accessibilityHint="Button with add icon"
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.iconTextButton, { backgroundColor: colors.primary }]}
            accessibilityRole="button"
            accessibilityLabel="Start Workout Button"
            accessibilityHint="Button with text and icon"
          >
            <Text style={styles.iconTextButtonText}>Start Workout</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Cards</Text>
        
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Basic Card</Text>
          <Text style={[styles.cardText, { color: colors.textSecondary }]}>
            This is a basic card component that can be used throughout the application.
          </Text>
        </View>
        
        <View style={[styles.interactiveCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.interactiveCardContent}>
            <View style={styles.cardIcon}>
              <Ionicons name="barbell-outline" size={24} color={colors.primary} />
            </View>
            <View style={styles.cardInfo}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Interactive Card</Text>
              <Text style={[styles.cardText, { color: colors.textSecondary }]}>
                This card can be tapped to navigate to another screen.
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={isDarkMode ? "#666" : "#999"} />
        </View>
      </View>
      
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Typography</Text>
        
        <Text style={[styles.heading1, { color: colors.text }]}>Heading 1</Text>
        <Text style={[styles.heading2, { color: colors.text }]}>Heading 2</Text>
        <Text style={[styles.heading3, { color: colors.text }]}>Heading 3</Text>
        <Text style={[styles.bodyText, { color: colors.text }]}>
          This is regular body text that can be used for most content in the application.
          It should be easily readable on all screen sizes and in both light and dark modes.
        </Text>
        <Text style={[styles.captionText, { color: colors.textSecondary }]}>
          Caption text is smaller and used for less important information.
        </Text>
      </View>
      
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Lists</Text>
        
        <View style={[styles.listItem, { borderBottomColor: colors.border }]}>
          <Text style={[styles.listItemText, { color: colors.text }]}>List Item 1</Text>
          <Ionicons name="chevron-forward" size={20} color={isDarkMode ? "#666" : "#999"} />
        </View>
        
        <View style={[styles.listItem, { borderBottomColor: colors.border }]}>
          <Text style={[styles.listItemText, { color: colors.text }]}>List Item 2</Text>
          <Ionicons name="chevron-forward" size={20} color={isDarkMode ? "#666" : "#999"} />
        </View>
        
        <View style={[styles.listItem, { borderBottomColor: colors.border }]}>
          <Text style={[styles.listItemText, { color: colors.text }]}>List Item 3</Text>
          <Ionicons name="chevron-forward" size={20} color={isDarkMode ? "#666" : "#999"} />
        </View>
      </View>
      
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Status Indicators</Text>
        
        <View style={styles.componentRow}>
          <View style={[styles.badge, { backgroundColor: colors.primary }]}>
            <Text style={styles.badgeText}>New</Text>
          </View>
          
          <View style={[styles.badge, { backgroundColor: colors.success }]}>
            <Text style={styles.badgeText}>Completed</Text>
          </View>
          
          <View style={[styles.badge, { backgroundColor: colors.warning }]}>
            <Text style={styles.badgeText}>In Progress</Text>
          </View>
          
          <View style={[styles.badge, { backgroundColor: colors.error }]}>
            <Text style={styles.badgeText}>Missed</Text>
          </View>
        </View>
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
  section: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  componentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  // Buttons
  primaryButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    minWidth: 120,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4A90E2',
    flex: 1,
    minWidth: 120,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  tabletButton: {
    paddingVertical: 16,
  },
  successButton: {
    backgroundColor: '#4CD964',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  warningButton: {
    backgroundColor: '#FF9500',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  errorButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconTextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
  },
  iconTextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  // Cards
  card: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  interactiveCard: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  interactiveCardContent: {
    flexDirection: 'row',
    flex: 1,
  },
  cardIcon: {
    marginRight: 16,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    lineHeight: 20,
  },
  // Typography
  heading1: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  heading2: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  heading3: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
  },
  captionText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  // Lists
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  listItemText: {
    fontSize: 16,
  },
  // Status Indicators
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default CommonUIComponents;
