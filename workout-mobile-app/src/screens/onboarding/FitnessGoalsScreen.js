import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const FitnessGoalsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [sportActivity, setSportActivity] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [loading, setLoading] = useState(false);
  
  const goals = [
    { id: 'health', title: 'Optimize my health and fitness', description: 'Focus on overall wellness and balanced fitness' },
    { id: 'sport', title: 'Training for a specific sport or activity', description: 'Targeted training for performance in a particular activity' },
    { id: 'muscle', title: 'Build muscle mass and size', description: 'Hypertrophy-focused training to increase muscle size' },
    { id: 'weight', title: 'Weight loss and management', description: 'Programs designed for fat loss and weight control' },
    { id: 'stamina', title: 'Increase stamina', description: 'Improve cardiovascular endurance and overall stamina' },
    { id: 'strength', title: 'Increase strength', description: 'Focus on building functional and maximal strength' },
  ];

  const toggleGoal = (goalId) => {
    if (selectedGoals.includes(goalId)) {
      setSelectedGoals(selectedGoals.filter(id => id !== goalId));
    } else {
      setSelectedGoals([...selectedGoals, goalId]);
    }
  };

  const handleNext = async () => {
    if (selectedGoals.length === 0) {
      alert('Please select at least one fitness goal');
      return;
    }

    setLoading(true);
    
    try {
      // Save data to Supabase profiles table
      const { error } = await supabase
        .from('profiles')
        .update({
          primarygoal: selectedGoals[0], // First selected goal is primary
          fitnessgoals: selectedGoals.join(','),
          sport_activity: sportActivity,
          additional_notes: additionalInfo,
          updated_at: new Date()
        })
        .eq('id', user.id);

      if (error) throw error;
      
      // Navigate to next onboarding screen
      navigation.navigate('CurrentFitnessLevels');
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Fitness Goals</Text>
        <Text style={styles.subtitle}>Select your fitness goals in order of preference</Text>

        {goals.map((goal) => (
          <TouchableOpacity
            key={goal.id}
            style={[
              styles.goalCard,
              selectedGoals.includes(goal.id) && styles.selectedGoal
            ]}
            onPress={() => toggleGoal(goal.id)}
          >
            <View style={styles.goalHeader}>
              <Text style={[
                styles.goalTitle,
                selectedGoals.includes(goal.id) && styles.selectedGoalText
              ]}>
                {goal.title}
              </Text>
              {selectedGoals.includes(goal.id) && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </View>
            <Text style={[
              styles.goalDescription,
              selectedGoals.includes(goal.id) && styles.selectedGoalText
            ]}>
              {goal.description}
            </Text>
            
            {goal.id === 'sport' && selectedGoals.includes('sport') && (
              <TextInput
                style={styles.sportInput}
                placeholder="What is your sport or activity?"
                value={sportActivity}
                onChangeText={setSportActivity}
              />
            )}
          </TouchableOpacity>
        ))}

        <View style={styles.formGroup}>
          <Text style={styles.label}>Anything else I should know as your personal health coach?</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Optional: Share any additional information"
            value={additionalInfo}
            onChangeText={setAdditionalInfo}
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          disabled={loading}
        >
          <Text style={styles.nextButtonText}>
            {loading ? 'Saving...' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  goalCard: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  selectedGoal: {
    borderColor: '#4A90E2',
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  goalDescription: {
    fontSize: 14,
    color: '#666',
  },
  selectedGoalText: {
    color: '#4A90E2',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sportInput: {
    borderWidth: 1,
    borderColor: '#4A90E2',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    backgroundColor: '#fff',
  },
  formGroup: {
    marginTop: 20,
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  nextButton: {
    backgroundColor: '#4A90E2',
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default FitnessGoalsScreen;
