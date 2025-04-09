import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';

const WorkoutDetailScreen = ({ route, navigation }) => {
  const { workoutId } = route.params;
  const [workout, setWorkout] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

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
            description,
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

  const handleStartWorkout = () => {
    navigation.navigate('ActiveWorkout', { workoutId });
  };

  const handleEditWorkout = () => {
    navigation.navigate('EditWorkout', { workoutId });
  };

  const handleDeleteWorkout = async () => {
    Alert.alert(
      'Delete Workout',
      'Are you sure you want to delete this workout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              // Delete workout exercises first (foreign key constraint)
              const { error: exercisesError } = await supabase
                .from('workout_exercises')
                .delete()
                .eq('workout_id', workoutId);
              
              if (exercisesError) throw exercisesError;

              // Then delete the workout
              const { error: workoutError } = await supabase
                .from('workouts')
                .delete()
                .eq('id', workoutId);
              
              if (workoutError) throw workoutError;

              navigation.navigate('WorkoutList');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete workout: ' + error.message);
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

  if (!workout) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Workout not found</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Workout Details</Text>
        <TouchableOpacity onPress={handleEditWorkout}>
          <Ionicons name="create-outline" size={24} color="#4A90E2" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.workoutHeader}>
          <Text style={styles.workoutName}>{workout.name}</Text>
          {workout.duration && (
            <View style={styles.durationContainer}>
              <Ionicons name="time-outline" size={16} color="#888" />
              <Text style={styles.durationText}>{workout.duration} min</Text>
            </View>
          )}
        </View>

        {workout.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.notesLabel}>Notes:</Text>
            <Text style={styles.notesText}>{workout.notes}</Text>
          </View>
        )}

        <View style={styles.exercisesContainer}>
          <Text style={styles.sectionTitle}>Exercises</Text>
          
          {exercises.length === 0 ? (
            <View style={styles.emptyExercises}>
              <Text style={styles.emptyText}>No exercises added yet</Text>
              <TouchableOpacity 
                style={styles.addExercisesButton}
                onPress={() => navigation.navigate('SelectExercises', { workoutId })}
              >
                <Text style={styles.addExercisesButtonText}>Add Exercises</Text>
              </TouchableOpacity>
            </View>
          ) : (
            exercises.map((item, index) => (
              <View key={item.id} style={styles.exerciseItem}>
                <View style={styles.exerciseNumber}>
                  <Text style={styles.exerciseNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.exerciseDetails}>
                  <Text style={styles.exerciseName}>{item.exercises.name}</Text>
                  <View style={styles.exerciseMeta}>
                    {item.exercises.primary_muscle && (
                      <View style={styles.tagContainer}>
                        <Text style={styles.tagText}>{item.exercises.primary_muscle}</Text>
                      </View>
                    )}
                    {item.exercises.equipment && (
                      <Text style={styles.equipmentText}>{item.exercises.equipment}</Text>
                    )}
                  </View>
                  <View style={styles.setsContainer}>
                    <Text style={styles.setsText}>
                      {item.sets} sets × {item.reps} reps
                      {item.weight ? ` × ${item.weight} ${item.weight > 1 ? 'lbs' : 'lb'}` : ''}
                    </Text>
                    {item.rest_interval && (
                      <Text style={styles.restText}>
                        Rest: {item.rest_interval} sec
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={handleDeleteWorkout}
        >
          <Ionicons name="trash-outline" size={20} color="#FF3B30" />
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.startButton}
          onPress={handleStartWorkout}
          disabled={exercises.length === 0}
        >
          <Text style={styles.startButtonText}>Start Workout</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
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
  content: {
    flex: 1,
  },
  workoutHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  workoutName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationText: {
    fontSize: 16,
    color: '#888',
    marginLeft: 4,
  },
  notesContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  notesLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  notesText: {
    fontSize: 16,
    color: '#444',
  },
  exercisesContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  exerciseItem: {
    flexDirection: 'row',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    overflow: 'hidden',
  },
  exerciseNumber: {
    width: 40,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#888',
  },
  exerciseDetails: {
    flex: 1,
    padding: 12,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  exerciseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tagContainer: {
    backgroundColor: '#E8F1FB',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 8,
  },
  tagText: {
    color: '#4A90E2',
    fontSize: 12,
    fontWeight: '500',
  },
  equipmentText: {
    fontSize: 12,
    color: '#888',
  },
  setsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  setsText: {
    fontSize: 14,
    color: '#444',
  },
  restText: {
    fontSize: 14,
    color: '#888',
  },
  emptyExercises: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginBottom: 16,
  },
  addExercisesButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addExercisesButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#FF3B30',
    borderRadius: 8,
    marginRight: 12,
  },
  deleteButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  startButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    borderRadius: 8,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#FF3B30',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WorkoutDetailScreen;
