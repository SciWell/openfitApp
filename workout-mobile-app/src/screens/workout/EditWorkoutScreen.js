import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';

const EditWorkoutScreen = ({ route, navigation }) => {
  const { workoutId } = route.params;
  const [workout, setWorkout] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchWorkoutDetails();
  }, [workoutId]);

  const fetchWorkoutDetails = async () => {
    try {
      // Fetch workout details
      const { data: workoutData, error: workoutError } = await supabase
        .from('workouts')
        .select('*')
        .eq('id', workoutId)
        .single();

      if (workoutError) throw workoutError;
      
      setWorkout(workoutData);
      setName(workoutData.name || '');
      setNotes(workoutData.notes || '');
      setDuration(workoutData.duration ? workoutData.duration.toString() : '');

      // Fetch workout exercises
      const { data: exercisesData, error: exercisesError } = await supabase
        .from('workout_exercises')
        .select(`
          id,
          sets,
          reps,
          weight,
          rest_interval,
          order_index,
          exercises (
            id,
            name,
            primary_muscle,
            equipment
          )
        `)
        .eq('workout_id', workoutId)
        .order('order_index');

      if (exercisesError) throw exercisesError;
      setExercises(exercisesData || []);
    } catch (error) {
      console.error('Error fetching workout details:', error);
      Alert.alert('Error', 'Failed to load workout details');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveWorkout = async () => {
    if (!name) {
      Alert.alert('Error', 'Please enter a workout name');
      return;
    }

    setSaving(true);

    try {
      // Update workout details
      const { error } = await supabase
        .from('workouts')
        .update({
          name,
          notes,
          duration: duration ? parseInt(duration) : null,
          updated_at: new Date()
        })
        .eq('id', workoutId);

      if (error) throw error;

      navigation.navigate('WorkoutDetail', { workoutId });
    } catch (error) {
      Alert.alert('Error', 'Failed to update workout: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateExercise = (exerciseId, field, value) => {
    setExercises(exercises.map(ex => 
      ex.id === exerciseId ? { ...ex, [field]: value } : ex
    ));
  };

  const handleSaveExerciseChanges = async (exerciseId) => {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    if (!exercise) return;

    try {
      const { error } = await supabase
        .from('workout_exercises')
        .update({
          sets: parseInt(exercise.sets) || 3,
          reps: parseInt(exercise.reps) || 10,
          weight: exercise.weight ? parseInt(exercise.weight) : null,
          rest_interval: parseInt(exercise.rest_interval) || 60
        })
        .eq('id', exerciseId);

      if (error) throw error;
      
      Alert.alert('Success', 'Exercise updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update exercise: ' + error.message);
    }
  };

  const handleRemoveExercise = async (exerciseId) => {
    Alert.alert(
      'Remove Exercise',
      'Are you sure you want to remove this exercise from the workout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('workout_exercises')
                .delete()
                .eq('id', exerciseId);
              
              if (error) throw error;
              
              // Update local state
              setExercises(exercises.filter(ex => ex.id !== exerciseId));
            } catch (error) {
              Alert.alert('Error', 'Failed to remove exercise: ' + error.message);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Workout</Text>
        <TouchableOpacity onPress={handleSaveWorkout} disabled={saving}>
          <Text style={styles.saveText}>{saving ? 'Saving...' : 'Save'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Workout Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter workout name"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Duration (minutes)</Text>
          <TextInput
            style={styles.input}
            value={duration}
            onChangeText={setDuration}
            placeholder="Enter estimated duration"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Add notes about this workout"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.exercisesContainer}>
          <View style={styles.exercisesHeader}>
            <Text style={styles.sectionTitle}>Exercises</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => navigation.navigate('SelectExercises', { workoutId })}
            >
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
          
          {exercises.length === 0 ? (
            <View style={styles.emptyExercises}>
              <Text style={styles.emptyText}>No exercises added yet</Text>
            </View>
          ) : (
            exercises.map((item, index) => (
              <View key={item.id} style={styles.exerciseItem}>
                <View style={styles.exerciseHeader}>
                  <View style={styles.exerciseNumber}>
                    <Text style={styles.exerciseNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.exerciseName}>{item.exercises.name}</Text>
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => handleRemoveExercise(item.id)}
                  >
                    <Ionicons name="close" size={20} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.exerciseForm}>
                  <View style={styles.formRow}>
                    <View style={styles.formField}>
                      <Text style={styles.fieldLabel}>Sets</Text>
                      <TextInput
                        style={styles.fieldInput}
                        value={item.sets ? item.sets.toString() : ''}
                        onChangeText={(value) => handleUpdateExercise(item.id, 'sets', value)}
                        keyboardType="numeric"
                      />
                    </View>
                    
                    <View style={styles.formField}>
                      <Text style={styles.fieldLabel}>Reps</Text>
                      <TextInput
                        style={styles.fieldInput}
                        value={item.reps ? item.reps.toString() : ''}
                        onChangeText={(value) => handleUpdateExercise(item.id, 'reps', value)}
                        keyboardType="numeric"
                      />
                    </View>
                    
                    <View style={styles.formField}>
                      <Text style={styles.fieldLabel}>Weight</Text>
                      <TextInput
                        style={styles.fieldInput}
                        value={item.weight ? item.weight.toString() : ''}
                        onChangeText={(value) => handleUpdateExercise(item.id, 'weight', value)}
                        keyboardType="numeric"
                        placeholder="Optional"
                      />
                    </View>
                  </View>
                  
                  <View style={styles.formRow}>
                    <View style={[styles.formField, { flex: 2 }]}>
                      <Text style={styles.fieldLabel}>Rest (seconds)</Text>
                      <TextInput
                        style={styles.fieldInput}
                        value={item.rest_interval ? item.rest_interval.toString() : ''}
                        onChangeText={(value) => handleUpdateExercise(item.id, 'rest_interval', value)}
                        keyboardType="numeric"
                      />
                    </View>
                    
                    <TouchableOpacity 
                      style={styles.saveExerciseButton}
                      onPress={() => handleSaveExerciseChanges(item.id)}
                    >
                      <Text style={styles.saveExerciseButtonText}>Save Changes</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
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
  saveText: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
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
    textAlignVertical: 'top',
  },
  exercisesContainer: {
    marginTop: 10,
  },
  exercisesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  exerciseItem: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 12,
  },
  exerciseNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  exerciseNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  exerciseName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  removeButton: {
    padding: 4,
  },
  exerciseForm: {
    padding: 12,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  formField: {
    flex: 1,
    marginRight: 8,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  fieldInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    fontSize: 14,
  },
  saveExerciseButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  saveExerciseButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyExercises: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EditWorkoutScreen;
