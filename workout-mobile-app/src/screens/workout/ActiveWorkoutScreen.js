import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Alert,
  ActivityIndicator,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const ActiveWorkoutScreen = ({ route, navigation }) => {
  const { workoutId } = route.params;
  const { user } = useAuth();
  const [workout, setWorkout] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [completedSets, setCompletedSets] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRestTimerActive, setIsRestTimerActive] = useState(false);
  const [restTimeRemaining, setRestTimeRemaining] = useState(0);
  const [currentRestExercise, setCurrentRestExercise] = useState(null);
  const timerRef = useRef(null);
  const restTimerRef = useRef(null);

  useEffect(() => {
    fetchWorkoutDetails();
    setStartTime(new Date());
    
    // Start workout timer
    timerRef.current = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    
    return () => {
      clearInterval(timerRef.current);
      clearInterval(restTimerRef.current);
    };
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
            primary_muscle,
            equipment
          )
        `)
        .eq('workout_id', workoutId)
        .order('order_index');

      if (exercisesError) throw exercisesError;
      
      // Initialize completed sets structure
      const initialCompletedSets = {};
      exercisesData.forEach(exercise => {
        initialCompletedSets[exercise.id] = Array(exercise.sets).fill().map((_, index) => ({
          setNumber: index + 1,
          reps: exercise.reps,
          weight: exercise.weight || '',
          completed: false
        }));
      });
      
      setExercises(exercisesData || []);
      setCompletedSets(initialCompletedSets);
    } catch (error) {
      console.error('Error fetching workout details:', error);
      Alert.alert('Error', 'Failed to load workout details');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSetComplete = (exerciseId, setIndex) => {
    const updatedCompletedSets = { ...completedSets };
    updatedCompletedSets[exerciseId][setIndex].completed = true;
    setCompletedSets(updatedCompletedSets);
    
    // Get rest interval for this exercise
    const exercise = exercises.find(ex => ex.id === exerciseId);
    if (exercise && exercise.rest_interval) {
      startRestTimer(exercise);
    }
  };

  const startRestTimer = (exercise) => {
    setCurrentRestExercise(exercise);
    setRestTimeRemaining(exercise.rest_interval);
    setIsRestTimerActive(true);
    
    clearInterval(restTimerRef.current);
    restTimerRef.current = setInterval(() => {
      setRestTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(restTimerRef.current);
          setIsRestTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const cancelRestTimer = () => {
    clearInterval(restTimerRef.current);
    setIsRestTimerActive(false);
  };

  const updateSetValue = (exerciseId, setIndex, field, value) => {
    const updatedCompletedSets = { ...completedSets };
    updatedCompletedSets[exerciseId][setIndex][field] = value;
    setCompletedSets(updatedCompletedSets);
  };

  const handleFinishWorkout = async () => {
    // Check if all sets are completed
    const allSetsCompleted = Object.values(completedSets).every(sets => 
      sets.every(set => set.completed)
    );
    
    if (!allSetsCompleted) {
      Alert.alert(
        'Incomplete Workout',
        'Not all sets have been completed. Do you still want to finish the workout?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Finish Anyway', onPress: () => saveWorkoutData() }
        ]
      );
    } else {
      saveWorkoutData();
    }
  };

  const saveWorkoutData = async () => {
    setSaving(true);
    
    try {
      const endTime = new Date();
      const durationInSeconds = Math.floor((endTime - startTime) / 1000);
      const durationInMinutes = Math.ceil(durationInSeconds / 60);
      
      // Create workout log entry
      const { data: logData, error: logError } = await supabase
        .from('workout_logs')
        .insert([
          {
            user_id: user.id,
            workout_id: workoutId,
            completed_at: endTime.toISOString(),
            duration: durationInMinutes,
            created_at: new Date().toISOString()
          }
        ])
        .select();
      
      if (logError) throw logError;
      
      // Create completed workout entry
      const { data: completedWorkoutData, error: completedWorkoutError } = await supabase
        .from('completed_workouts')
        .insert([
          {
            workout_id: workoutId,
            user_id: user.id,
            date_completed: endTime.toISOString(),
            duration: durationInMinutes,
            created_at: new Date().toISOString()
          }
        ])
        .select();
      
      if (completedWorkoutError) throw completedWorkoutError;
      
      // Save completed sets
      const completedSetsToInsert = [];
      
      Object.entries(completedSets).forEach(([exerciseId, sets]) => {
        sets.forEach((set, index) => {
          if (set.completed) {
            completedSetsToInsert.push({
              workout_id: workoutId,
              workout_exercise_id: exerciseId,
              performed_set_order: index + 1,
              performed_reps: parseInt(set.reps) || 0,
              performed_weight: set.weight ? parseInt(set.weight) : null,
              created_at: new Date().toISOString()
            });
          }
        });
      });
      
      if (completedSetsToInsert.length > 0) {
        const { error: setsError } = await supabase
          .from('completed_sets')
          .insert(completedSetsToInsert);
        
        if (setsError) throw setsError;
      }
      
      Alert.alert(
        'Workout Completed',
        'Your workout has been saved successfully!',
        [{ text: 'OK', onPress: () => navigation.navigate('WorkoutList') }]
      );
    } catch (error) {
      console.error('Error saving workout data:', error);
      Alert.alert('Error', 'Failed to save workout data: ' + error.message);
    } finally {
      setSaving(false);
    }
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
        <Text style={styles.headerTitle}>Active Workout</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.workoutInfo}>
        <Text style={styles.workoutName}>{workout.name}</Text>
        <View style={styles.timerContainer}>
          <Ionicons name="time-outline" size={20} color="#4A90E2" />
          <Text style={styles.timerText}>{formatTime(elapsedTime)}</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {exercises.map((exercise, exerciseIndex) => (
          <View key={exercise.id} style={styles.exerciseCard}>
            <View style={styles.exerciseHeader}>
              <View style={styles.exerciseNumber}>
                <Text style={styles.exerciseNumberText}>{exerciseIndex + 1}</Text>
              </View>
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>{exercise.exercises.name}</Text>
                <View style={styles.exerciseMeta}>
                  {exercise.exercises.primary_muscle && (
                    <View style={styles.tagContainer}>
                      <Text style={styles.tagText}>{exercise.exercises.primary_muscle}</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.setsHeader}>
              <Text style={styles.setColumnHeader}>SET</Text>
              <Text style={[styles.setColumnHeader, styles.repsColumn]}>REPS</Text>
              <Text style={[styles.setColumnHeader, styles.weightColumn]}>WEIGHT</Text>
              <Text style={[styles.setColumnHeader, styles.completeColumn]}>DONE</Text>
            </View>

            {completedSets[exercise.id]?.map((set, setIndex) => (
              <View key={setIndex} style={styles.setRow}>
                <Text style={styles.setNumber}>{set.setNumber}</Text>
                
                <TextInput
                  style={[styles.setInput, styles.repsColumn]}
                  value={set.reps.toString()}
                  onChangeText={(value) => updateSetValue(exercise.id, setIndex, 'reps', value)}
                  keyboardType="numeric"
                  editable={!set.completed}
                />
                
                <TextInput
                  style={[styles.setInput, styles.weightColumn]}
                  value={set.weight ? set.weight.toString() : ''}
                  onChangeText={(value) => updateSetValue(exercise.id, setIndex, 'weight', value)}
                  placeholder="-"
                  keyboardType="numeric"
                  editable={!set.completed}
                />
                
                <TouchableOpacity 
                  style={[
                    styles.completeButton, 
                    set.completed && styles.completedButton
                  ]}
                  onPress={() => handleSetComplete(exercise.id, setIndex)}
                  disabled={set.completed}
                >
                  {set.completed ? (
                    <Ionicons name="checkmark" size={20} color="#fff" />
                  ) : (
                    <Text style={styles.completeButtonText}>Do</Text>
                  )}
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.finishButton}
          onPress={handleFinishWorkout}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.finishButtonText}>Finish Workout</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Rest Timer Modal */}
      <Modal
        visible={isRestTimerActive}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.restTimerContainer}>
            <Text style={styles.restTimerTitle}>Rest Timer</Text>
            <Text style={styles.restTimerExercise}>
              {currentRestExercise?.exercises.name}
            </Text>
            <Text style={styles.restTimerClock}>{formatTime(restTimeRemaining)}</Text>
            <TouchableOpacity 
              style={styles.skipButton}
              onPress={cancelRestTimer}
            >
              <Text style={styles.skipButtonText}>Skip Rest</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  workoutInfo: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  workoutName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A90E2',
    marginLeft: 6,
  },
  content: {
    flex: 1,
    padding: 16,
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
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  exerciseNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  exerciseNumberText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  exerciseMeta: {
    flexDirection: 'row',
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
  setsHeader: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  setColumnHeader: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888',
    width: 50,
  },
  repsColumn: {
    flex: 1,
    textAlign: 'center',
  },
  weightColumn: {
    flex: 1,
    textAlign: 'center',
  },
  completeColumn: {
    width: 60,
    textAlign: 'center',
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  setNumber: {
    fontSize: 14,
    fontWeight: '600',
    width: 50,
  },
  setInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  completeButton: {
    backgroundColor: '#4A90E2',
    width: 60,
    paddingVertical: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  completedButton: {
    backgroundColor: '#4CD964',
  },
  completeButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  finishButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  finishButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  restTimerContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  restTimerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  restTimerExercise: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  restTimerClock: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 24,
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: '#4A90E2',
    borderRadius: 8,
  },
  skipButtonText: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ActiveWorkoutScreen;
