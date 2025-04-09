import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Updates from 'expo-updates';
import { useTheme } from '../context/ThemeContext';

const TestScreen = () => {
  const { isDarkMode } = useTheme();
  const [testResults, setTestResults] = useState([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testSummary, setTestSummary] = useState({
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0
  });

  // Mock test cases
  const testCases = [
    { id: 1, name: 'Authentication - User Registration', category: 'Authentication' },
    { id: 2, name: 'Authentication - User Login', category: 'Authentication' },
    { id: 3, name: 'Authentication - Password Reset', category: 'Authentication' },
    { id: 4, name: 'Onboarding - Personal Details', category: 'Onboarding' },
    { id: 5, name: 'Onboarding - Fitness Goals', category: 'Onboarding' },
    { id: 6, name: 'Workout - Create Workout', category: 'Workout Management' },
    { id: 7, name: 'Workout - Edit Workout', category: 'Workout Management' },
    { id: 8, name: 'Workout - Delete Workout', category: 'Workout Management' },
    { id: 9, name: 'Exercise - Browse Library', category: 'Exercise Library' },
    { id: 10, name: 'Exercise - Search Functionality', category: 'Exercise Library' },
    { id: 11, name: 'Tracking - Start Workout', category: 'Workout Tracking' },
    { id: 12, name: 'Tracking - Log Sets', category: 'Workout Tracking' },
    { id: 13, name: 'Tracking - Rest Timer', category: 'Workout Tracking' },
    { id: 14, name: 'Progress - Dashboard Charts', category: 'Progress Monitoring' },
    { id: 15, name: 'Progress - Weight History', category: 'Progress Monitoring' },
    { id: 16, name: 'UI - Dark/Light Mode', category: 'UI/UX' },
    { id: 17, name: 'UI - Responsive Layout', category: 'UI/UX' },
    { id: 18, name: 'Accessibility - Screen Reader', category: 'Accessibility' },
    { id: 19, name: 'Performance - App Startup', category: 'Performance' },
    { id: 20, name: 'Offline - Data Synchronization', category: 'Offline Functionality' },
  ];

  const runTests = async () => {
    setIsRunningTests(true);
    setTestResults([]);
    
    // Reset summary
    setTestSummary({
      total: testCases.length,
      passed: 0,
      failed: 0,
      skipped: 0
    });
    
    // Simulate running tests with delays
    for (const test of testCases) {
      // Simulate test execution time
      await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));
      
      // Simulate random test results (in a real app, these would be actual test results)
      const random = Math.random();
      let result;
      
      if (random > 0.8) {
        result = { status: 'failed', message: 'Test assertion failed' };
        setTestSummary(prev => ({ ...prev, failed: prev.failed + 1 }));
      } else if (random > 0.7) {
        result = { status: 'skipped', message: 'Test skipped due to dependencies' };
        setTestSummary(prev => ({ ...prev, skipped: prev.skipped + 1 }));
      } else {
        result = { status: 'passed', message: 'Test completed successfully' };
        setTestSummary(prev => ({ ...prev, passed: prev.passed + 1 }));
      }
      
      setTestResults(prev => [...prev, { ...test, result }]);
    }
    
    setIsRunningTests(false);
  };

  const checkForUpdates = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();
      
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      }
    } catch (error) {
      console.log('Error checking for updates:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'passed':
        return '#4CD964';
      case 'failed':
        return '#FF3B30';
      case 'skipped':
        return '#FF9500';
      default:
        return '#999';
    }
  };

  return (
    <View style={[
      styles.container, 
      { backgroundColor: isDarkMode ? '#121212' : '#f8f8f8' }
    ]}>
      <View style={[
        styles.header,
        { backgroundColor: isDarkMode ? '#1E1E1E' : '#fff' }
      ]}>
        <Text style={[
          styles.title,
          { color: isDarkMode ? '#fff' : '#000' }
        ]}>Test Dashboard</Text>
      </View>

      <View style={[
        styles.summaryContainer,
        { backgroundColor: isDarkMode ? '#1E1E1E' : '#fff' }
      ]}>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, { color: '#4A90E2' }]}>{testSummary.total}</Text>
          <Text style={[styles.summaryLabel, { color: isDarkMode ? '#aaa' : '#666' }]}>Total</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, { color: '#4CD964' }]}>{testSummary.passed}</Text>
          <Text style={[styles.summaryLabel, { color: isDarkMode ? '#aaa' : '#666' }]}>Passed</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, { color: '#FF3B30' }]}>{testSummary.failed}</Text>
          <Text style={[styles.summaryLabel, { color: isDarkMode ? '#aaa' : '#666' }]}>Failed</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, { color: '#FF9500' }]}>{testSummary.skipped}</Text>
          <Text style={[styles.summaryLabel, { color: isDarkMode ? '#aaa' : '#666' }]}>Skipped</Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: '#4A90E2' }]}
          onPress={runTests}
          disabled={isRunningTests}
        >
          {isRunningTests ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons name="play" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Run Tests</Text>
            </>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: '#4CD964' }]}
          onPress={checkForUpdates}
        >
          <Ionicons name="refresh" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Check Updates</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.resultsContainer}>
        {testResults.map((test) => (
          <View 
            key={test.id} 
            style={[
              styles.testItem,
              { backgroundColor: isDarkMode ? '#1E1E1E' : '#fff' }
            ]}
          >
            <View style={styles.testHeader}>
              <View style={[
                styles.statusIndicator, 
                { backgroundColor: getStatusColor(test.result.status) }
              ]} />
              <View style={styles.testInfo}>
                <Text style={[
                  styles.testName,
                  { color: isDarkMode ? '#fff' : '#000' }
                ]}>{test.name}</Text>
                <Text style={[
                  styles.testCategory,
                  { color: isDarkMode ? '#aaa' : '#666' }
                ]}>{test.category}</Text>
              </View>
              <Text style={[
                styles.testStatus,
                { color: getStatusColor(test.result.status) }
              ]}>
                {test.result.status.toUpperCase()}
              </Text>
            </View>
            <Text style={[
              styles.testMessage,
              { color: isDarkMode ? '#aaa' : '#666' }
            ]}>{test.result.message}</Text>
          </View>
        ))}
        
        {isRunningTests && (
          <View style={styles.runningContainer}>
            <ActivityIndicator color="#4A90E2" size="large" />
            <Text style={[
              styles.runningText,
              { color: isDarkMode ? '#fff' : '#000' }
            ]}>Running tests...</Text>
          </View>
        )}
      </ScrollView>

      <View style={[
        styles.footer,
        { backgroundColor: isDarkMode ? '#1E1E1E' : '#fff' }
      ]}>
        <Text style={[
          styles.footerText,
          { color: isDarkMode ? '#aaa' : '#666' }
        ]}>
          Version 1.0.0 (Build {Platform.OS === 'ios' ? '42' : '87'})
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  summaryContainer: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 14,
  },
  actionsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  resultsContainer: {
    flex: 1,
    padding: 16,
  },
  testItem: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  testHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  testInfo: {
    flex: 1,
  },
  testName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  testCategory: {
    fontSize: 14,
  },
  testStatus: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  testMessage: {
    fontSize: 14,
    marginLeft: 24,
  },
  runningContainer: {
    alignItems: 'center',
    padding: 20,
  },
  runningText: {
    fontSize: 16,
    marginTop: 12,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  footerText: {
    fontSize: 14,
  },
});

export default TestScreen;
