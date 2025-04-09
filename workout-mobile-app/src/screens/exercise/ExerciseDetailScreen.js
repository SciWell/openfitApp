import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';

const ExerciseDetailScreen = ({ route, navigation }) => {
  const { exerciseId } = route.params;
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExerciseDetails();
  }, [exerciseId]);

  const fetchExerciseDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('id', exerciseId)
        .single();

      if (error) throw error;
      setExercise(data);
    } catch (error) {
      console.error('Error fetching exercise details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  if (!exercise) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Exercise not found</Text>
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
        <Text style={styles.headerTitle}>Exercise Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.exerciseName}>{exercise.name}</Text>
        
        <View style={styles.tagsContainer}>
          {exercise.category && (
            <View style={styles.tagContainer}>
              <Text style={styles.tagText}>{exercise.category}</Text>
            </View>
          )}
          {exercise.primary_muscle && (
            <View style={styles.tagContainer}>
              <Text style={styles.tagText}>{exercise.primary_muscle}</Text>
            </View>
          )}
          {exercise.equipment && (
            <View style={styles.tagContainer}>
              <Text style={styles.tagText}>{exercise.equipment}</Text>
            </View>
          )}
        </View>

        {exercise.video_url && (
          <View style={styles.videoContainer}>
            <Image 
              source={{ uri: exercise.video_url.replace('.mp4', '.jpg') }} 
              style={styles.videoThumbnail}
              resizeMode="cover"
            />
            <View style={styles.playButton}>
              <Ionicons name="play" size={32} color="#fff" />
            </View>
          </View>
        )}

        {exercise.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{exercise.description}</Text>
          </View>
        )}

        {exercise.instructions && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            <Text style={styles.instructionsText}>{exercise.instructions}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Muscles Worked</Text>
          <View style={styles.musclesContainer}>
            {exercise.primary_muscle && (
              <View style={styles.muscleItem}>
                <Text style={styles.muscleLabel}>Primary:</Text>
                <Text style={styles.muscleText}>{exercise.primary_muscle}</Text>
              </View>
            )}
            {exercise.secondary_muscle && (
              <View style={styles.muscleItem}>
                <Text style={styles.muscleLabel}>Secondary:</Text>
                <Text style={styles.muscleText}>{exercise.secondary_muscle}</Text>
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity 
          style={styles.addToWorkoutButton}
          onPress={() => navigation.navigate('SelectWorkout', { exerciseId: exercise.id })}
        >
          <Text style={styles.addToWorkoutButtonText}>Add to Workout</Text>
        </TouchableOpacity>
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
  content: {
    flex: 1,
    padding: 20,
  },
  exerciseName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  tagContainer: {
    backgroundColor: '#E8F1FB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: '500',
  },
  videoContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    position: 'relative',
    backgroundColor: '#f0f0f0',
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
  },
  playButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  instructionsText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  musclesContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 16,
  },
  muscleItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  muscleLabel: {
    fontSize: 16,
    fontWeight: '600',
    width: 100,
  },
  muscleText: {
    fontSize: 16,
    flex: 1,
  },
  addToWorkoutButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  addToWorkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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

export default ExerciseDetailScreen;
