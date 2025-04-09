import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';

const SelectExercisesScreen = ({ route, navigation }) => {
  const { workoutId } = route.params;
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchExercises();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = exercises.filter(exercise => 
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.primary_muscle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredExercises(filtered);
    } else {
      setFilteredExercises(exercises);
    }
  }, [searchQuery, exercises]);

  const fetchExercises = async () => {
    try {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .order('name');

      if (error) throw error;
      
      setExercises(data || []);
      setFilteredExercises(data || []);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExerciseSelection = (exerciseId) => {
    if (selectedExercises.includes(exerciseId)) {
      setSelectedExercises(selectedExercises.filter(id => id !== exerciseId));
    } else {
      setSelectedExercises([...selectedExercises, exerciseId]);
    }
  };

  const handleSaveExercises = async () => {
    if (selectedExercises.length === 0) {
      alert('Please select at least one exercise');
      return;
    }

    setSaving(true);

    try {
      // Create workout_exercises entries for each selected exercise
      const workoutExercises = selectedExercises.map((exerciseId, index) => ({
        workout_id: workoutId,
        exercise_id: exerciseId,
        order_index: index,
        sets: 3, // Default values
        reps: 10,
        rest_interval: 60,
      }));

      const { error } = await supabase
        .from('workout_exercises')
        .insert(workoutExercises);

      if (error) throw error;

      navigation.navigate('WorkoutDetail', { workoutId });
    } catch (error) {
      alert('Error saving exercises: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const renderExerciseItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.exerciseItem,
        selectedExercises.includes(item.id) && styles.selectedExerciseItem
      ]}
      onPress={() => toggleExerciseSelection(item.id)}
    >
      <View style={styles.exerciseInfo}>
        <Text style={styles.exerciseName}>{item.name}</Text>
        <View style={styles.exerciseMeta}>
          {item.primary_muscle && (
            <View style={styles.tagContainer}>
              <Text style={styles.tagText}>{item.primary_muscle}</Text>
            </View>
          )}
          {item.equipment && (
            <Text style={styles.equipmentText}>{item.equipment}</Text>
          )}
        </View>
      </View>
      <View style={styles.checkboxContainer}>
        {selectedExercises.includes(item.id) ? (
          <Ionicons name="checkmark-circle" size={24} color="#4A90E2" />
        ) : (
          <Ionicons name="ellipse-outline" size={24} color="#ccc" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Exercises</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search exercises..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
        </View>
      ) : (
        <FlatList
          data={filteredExercises}
          renderItem={renderExerciseItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <View style={styles.footer}>
        <Text style={styles.selectedCount}>
          {selectedExercises.length} exercise{selectedExercises.length !== 1 ? 's' : ''} selected
        </Text>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveExercises}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? 'Saving...' : 'Save Exercises'}
          </Text>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    margin: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 5,
  },
  listContainer: {
    padding: 10,
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedExerciseItem: {
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  exerciseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
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
  checkboxContainer: {
    marginLeft: 10,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  selectedCount: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#4A90E2',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SelectExercisesScreen;
