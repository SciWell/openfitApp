import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';

const WorkoutHistoryDetailScreen = ({ route, navigation }) => {
  const { workoutId } = route.params;
  const [workout, setWorkout] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkoutDetails();
  }, [workoutId]);

  const fetchWorkoutDetails = async () => {
    try {
      // Fetch completed workout details
      const { data: workoutData, error: workoutError } = await supabase
        .from('completed_workouts')
        .select(`
          id,
          date_completed,
          duration,
          rating,
          calories_burned,
          user_feedback_comment,
          workouts (
            id,
            name
          )
        `)
        .eq('id', workoutId)
        .single();

      if (workoutError) throw workoutError;
      setWorkout(workoutData);

      // Fetch completed sets for this workout
      const { data: setsData, error: setsError } = await supabase
        .from('completed_sets')
        .select(`
          id,
          performed_set_order,
          performed_reps,
          performed_weight,
          set_feedback_difficulty,
          workout_exercises!inner (
            id,
            exercises!inner (
              id,
              name,
              primary_muscle
            )
          )
        `)
        .eq('workout_id', workoutData.workouts.id);

      if (setsError) throw setsError;
      
      // Group sets by exercise
      const exercisesMap = {};
      
      setsData.forEach(set => {
        const exerciseId = set.workout_exercises.exercises.id;
        
        if (!exercisesMap[exerciseId]) {
          exercisesMap[exerciseId] = {
            id: exerciseId,
            name: set.workout_exercises.exercises.name,
            primary_muscle: set.workout_exercises.exercises.primary_muscle,
            sets: []
          };
        }
        
        exercisesMap[exerciseId].sets.push({
          id: set.id,
          order: set.performed_set_order,
          reps: set.performed_reps,
          weight: set.performed_weight,
          difficulty: set.set_feedback_difficulty
        });
      });
      
      // Convert map to array and sort sets by order
      const exercisesArray = Object.values(exercisesMap);
      exercisesArray.forEach(exercise => {
        exercise.sets.sort((a, b) => a.order - b.order);
      });
      
      setExercises(exercisesArray);
    } catch (error) {
      console.error('Error fetching workout details:', error);
      Alert.alert('Error', 'Failed to load workout details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.workoutHeader}>
          <Text style={styles.workoutName}>{workout.workouts?.name || 'Unnamed Workout'}</Text>
          <Text style={styles.workoutDate}>{formatDate(workout.date_completed)}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="time-outline" size={24} color="#4A90E2" />
            <Text style={styles.statValue}>{workout.duration} min</Text>
            <Text style={styles.statLabel}>Duration</Text>
          </View>
          
          {workout.calories_burned && (
            <View style={styles.statItem}>
              <Ionicons name="flame-outline" size={24} color="#FF9500" />
              <Text style={styles.statValue}>{workout.calories_burned}</Text>
              <Text style={styles.statLabel}>Calories</Text>
            </View>
          )}
          
          {workout.rating && (
            <View style={styles.statItem}>
              <Ionicons name="star" size={24} color="#FFD700" />
              <Text style={styles.statValue}>{workout.rating}/5</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          )}
        </View>

        {workout.user_feedback_comment && (
          <View style={styles.notesContainer}>
            <Text style={styles.notesLabel}>Notes:</Text>
            <Text style={styles.notesText}>{workout.user_feedback_comment}</Text>
          </View>
        )}

        <View style={styles.exercisesContainer}>
          <Text style={styles.sectionTitle}>Exercises</Text>
          
          {exercises.length === 0 ? (
            <View style={styles.emptyExercises}>
              <Text style={styles.emptyText}>No exercise data available</Text>
            </View>
          ) : (
            exercises.map((exercise) => (
              <View key={exercise.id} style={styles.exerciseCard}>
                <View style={styles.exerciseHeader}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  {exercise.primary_muscle && (
                    <View style={styles.tagContainer}>
                      <Text style={styles.tagText}>{exercise.primary_muscle}</Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.setsContainer}>
                  <View style={styles.setHeader}>
                    <Text style={styles.setHeaderText}>SET</Text>
                    <Text style={styles.setHeaderText}>REPS</Text>
                    <Text style={styles.setHeaderText}>WEIGHT</Text>
                  </View>
                  
                  {exercise.sets.map((set) => (
                    <View key={set.id} style={styles.setRow}>
                      <Text style={styles.setText}>{set.order}</Text>
                      <Text style={styles.setText}>{set.reps}</Text>
                      <Text style={styles.setText}>{set.weight || '-'}</Text>
                    </View>
                  ))}
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
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  workoutName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  workoutDate: {
    fontSize: 16,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  notesContainer: {
    padding: 20,
    backgroundColor: '#fff',
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
    lineHeight: 22,
  },
  exercisesContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  exerciseCard: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
  },
  tagContainer: {
    backgroundColor: '#E8F1FB',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  tagText: {
    color: '#4A90E2',
    fontSize: 12,
    fontWeight: '500',
  },
  setsContainer: {
    padding: 12,
  },
  setHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
    marginBottom: 8,
  },
  setHeaderText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#888',
    textAlign: 'center',
  },
  setRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  setText: {
    flex: 1,
    fontSize: 16,
    textAlign: 'center',
  },
  emptyExercises: {
    padding: 20,
    alignItems: 'center',
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

export default WorkoutHistoryDetailScreen;
