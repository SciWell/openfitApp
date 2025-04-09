import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const CreateWorkoutScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateWorkout = async () => {
    if (!name) {
      Alert.alert('Error', 'Please enter a workout name');
      return;
    }

    setLoading(true);

    try {
      // Create new workout in Supabase
      const { data, error } = await supabase
        .from('workouts')
        .insert([
          {
            user_id: user.id,
            name,
            notes,
            duration: duration ? parseInt(duration) : null,
            is_active: true,
            created_at: new Date(),
          }
        ])
        .select();

      if (error) throw error;

      // Navigate to exercise selection screen
      navigation.navigate('SelectExercises', { workoutId: data[0].id });
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Workout</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.form}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Workout Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Full Body Strength"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Estimated Duration (minutes)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 45"
            value={duration}
            onChangeText={setDuration}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Add any notes about this workout"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateWorkout}
          disabled={loading}
        >
          <Text style={styles.createButtonText}>
            {loading ? 'Creating...' : 'Continue to Add Exercises'}
          </Text>
        </TouchableOpacity>

        <View style={styles.templateSection}>
          <Text style={styles.templateTitle}>Or choose from templates</Text>
          <View style={styles.templateList}>
            <TouchableOpacity style={styles.templateCard}>
              <Text style={styles.templateName}>Full Body Workout</Text>
              <Text style={styles.templateMeta}>10 exercises • 45 min</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.templateCard}>
              <Text style={styles.templateName}>Upper Body Focus</Text>
              <Text style={styles.templateMeta}>8 exercises • 40 min</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.templateCard}>
              <Text style={styles.templateName}>Lower Body Power</Text>
              <Text style={styles.templateMeta}>7 exercises • 50 min</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  form: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
  },
  createButton: {
    backgroundColor: '#4A90E2',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  templateSection: {
    marginTop: 40,
  },
  templateTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  templateList: {
    gap: 12,
  },
  templateCard: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  templateName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  templateMeta: {
    fontSize: 14,
    color: '#888',
  },
});

export default CreateWorkoutScreen;
