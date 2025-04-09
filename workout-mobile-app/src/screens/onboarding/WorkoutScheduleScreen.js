import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Slider } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const WorkoutScheduleScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [workoutsPerWeek, setWorkoutsPerWeek] = useState(3); // Default to 3 days
  const [workoutDuration, setWorkoutDuration] = useState(45); // Default to 45 minutes
  const [loading, setLoading] = useState(false);
  
  const durationOptions = [15, 30, 45, 60, 75, 90];
  
  const handleComplete = async () => {
    setLoading(true);
    
    try {
      // Save data to Supabase profiles table
      const { error } = await supabase
        .from('profiles')
        .update({
          workoutdays: workoutsPerWeek.toString(),
          workoutduration: workoutDuration.toString(),
          has_completed_preferences: true,
          onboarding_completed: true,
          updated_at: new Date()
        })
        .eq('id', user.id);

      if (error) throw error;
      
      // Navigate to main app
      navigation.navigate('MainApp');
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Workout Schedule</Text>
        <Text style={styles.subtitle}>Let's set up your ideal workout schedule</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Workouts per week: {workoutsPerWeek}</Text>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={7}
            step={1}
            value={workoutsPerWeek}
            onValueChange={setWorkoutsPerWeek}
            minimumTrackTintColor="#4A90E2"
            maximumTrackTintColor="#d3d3d3"
            thumbTintColor="#4A90E2"
          />
          <View style={styles.sliderLabelsContainer}>
            <Text style={styles.sliderLabelLeft}>1 day</Text>
            <Text style={styles.sliderLabelRight}>7 days</Text>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Preferred workout duration</Text>
          <View style={styles.durationContainer}>
            {durationOptions.map((duration) => (
              <TouchableOpacity
                key={duration}
                style={[
                  styles.durationButton,
                  workoutDuration === duration && styles.selectedDuration
                ]}
                onPress={() => setWorkoutDuration(duration)}
              >
                <Text style={[
                  styles.durationText,
                  workoutDuration === duration && styles.selectedDurationText
                ]}>
                  {duration} min
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Your Workout Plan</Text>
          <Text style={styles.summaryText}>
            Based on your preferences, we'll create a personalized workout plan with:
          </Text>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryItemText}>• {workoutsPerWeek} workouts per week</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryItemText}>• {workoutDuration} minutes per session</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryItemText}>• Tailored to your fitness level and goals</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryItemText}>• Adaptable to your available equipment</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.completeButton}
          onPress={handleComplete}
          disabled={loading}
        >
          <Text style={styles.completeButtonText}>
            {loading ? 'Saving...' : 'Complete Setup'}
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
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  slider: {
    height: 40,
  },
  sliderLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -10,
  },
  sliderLabelLeft: {
    fontSize: 14,
    color: '#888',
  },
  sliderLabelRight: {
    fontSize: 14,
    color: '#888',
  },
  durationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  durationButton: {
    width: '30%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  selectedDuration: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  durationText: {
    fontSize: 16,
  },
  selectedDurationText: {
    color: '#fff',
    fontWeight: '600',
  },
  summaryContainer: {
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4A90E2',
  },
  summaryText: {
    fontSize: 16,
    marginBottom: 10,
  },
  summaryItem: {
    marginBottom: 8,
  },
  summaryItemText: {
    fontSize: 16,
  },
  completeButton: {
    backgroundColor: '#4A90E2',
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default WorkoutScheduleScreen;
