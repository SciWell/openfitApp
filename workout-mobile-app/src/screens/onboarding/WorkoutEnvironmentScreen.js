import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const WorkoutEnvironmentScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [selectedEnvironments, setSelectedEnvironments] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const environments = [
    { id: 'large_gym', title: 'Large gym', description: 'Commercial gym with full equipment' },
    { id: 'small_gym', title: 'Small gym', description: 'Limited equipment facility or hotel gym' },
    { id: 'home_basic', title: 'Home (basic equipment)', description: 'Home with some weights, bands, etc.' },
    { id: 'home_none', title: 'Home (no equipment)', description: 'Bodyweight exercises only' },
  ];

  const toggleEnvironment = (envId) => {
    if (selectedEnvironments.includes(envId)) {
      setSelectedEnvironments(selectedEnvironments.filter(id => id !== envId));
    } else {
      setSelectedEnvironments([...selectedEnvironments, envId]);
    }
  };

  const handleNext = async () => {
    if (selectedEnvironments.length === 0) {
      alert('Please select at least one workout environment');
      return;
    }

    setLoading(true);
    
    try {
      // Save data to Supabase profiles table
      const { error } = await supabase
        .from('profiles')
        .update({
          equipment: selectedEnvironments.join(','),
          updated_at: new Date()
        })
        .eq('id', user.id);

      if (error) throw error;
      
      // Navigate to next onboarding screen
      navigation.navigate('WorkoutSchedule');
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Workout Environment</Text>
        <Text style={styles.subtitle}>Where will you be working out? (Select all that apply)</Text>

        {environments.map((env) => (
          <TouchableOpacity
            key={env.id}
            style={[
              styles.environmentCard,
              selectedEnvironments.includes(env.id) && styles.selectedEnvironment
            ]}
            onPress={() => toggleEnvironment(env.id)}
          >
            <View style={styles.environmentHeader}>
              <Text style={[
                styles.environmentTitle,
                selectedEnvironments.includes(env.id) && styles.selectedEnvironmentText
              ]}>
                {env.title}
              </Text>
              {selectedEnvironments.includes(env.id) && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </View>
            <Text style={[
              styles.environmentDescription,
              selectedEnvironments.includes(env.id) && styles.selectedEnvironmentText
            ]}>
              {env.description}
            </Text>
          </TouchableOpacity>
        ))}

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
  environmentCard: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  selectedEnvironment: {
    borderColor: '#4A90E2',
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
  },
  environmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  environmentTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  environmentDescription: {
    fontSize: 14,
    color: '#666',
  },
  selectedEnvironmentText: {
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

export default WorkoutEnvironmentScreen;
