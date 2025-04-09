import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Slider } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const CurrentFitnessLevelsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [cardioLevel, setCardioLevel] = useState(2); // 0-4 scale
  const [weightliftingLevel, setWeightliftingLevel] = useState(2); // 0-4 scale
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [excludedExercises, setExcludedExercises] = useState('');
  const [loading, setLoading] = useState(false);
  
  const cardioLevelDescriptions = [
    "Cannot walk 0.5 mile without stopping",
    "Can walk 1 mile, but struggle with running",
    "Can jog 1-2 miles comfortably",
    "Can run 5km regularly",
    "Run 10km+ regularly"
  ];
  
  const weightliftingLevelDescriptions = [
    "Beginner, no regular gym experience",
    "Novice, some gym experience",
    "Intermediate, regular training for 6+ months",
    "Advanced, consistent training for 2+ years",
    "Expert/Competition training"
  ];

  const handleNext = async () => {
    setLoading(true);
    
    try {
      // Save data to Supabase profiles table
      const { error } = await supabase
        .from('profiles')
        .update({
          cardiolevel: cardioLevel.toString(),
          weightliftinglevel: weightliftingLevel.toString(),
          cardio_level_description: cardioLevelDescriptions[cardioLevel],
          weightlifting_level_description: weightliftingLevelDescriptions[weightliftingLevel],
          additional_notes: additionalInfo ? `${additionalInfo}\n${additionalInfo}` : additionalInfo,
          excluded_exercises: excludedExercises,
          updated_at: new Date()
        })
        .eq('id', user.id);

      if (error) throw error;
      
      // Navigate to next onboarding screen
      navigation.navigate('WorkoutEnvironment');
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Current Fitness Levels</Text>
        <Text style={styles.subtitle}>Help us understand your current fitness level</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Cardio/Endurance Level</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={4}
            step={1}
            value={cardioLevel}
            onValueChange={setCardioLevel}
            minimumTrackTintColor="#4A90E2"
            maximumTrackTintColor="#d3d3d3"
            thumbTintColor="#4A90E2"
          />
          <View style={styles.sliderLabelsContainer}>
            <Text style={styles.sliderLabelLeft}>Beginner</Text>
            <Text style={styles.sliderLabelRight}>Advanced</Text>
          </View>
          <View style={styles.levelDescriptionContainer}>
            <Text style={styles.levelDescription}>
              {cardioLevelDescriptions[cardioLevel]}
            </Text>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Weightlifting Level</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={4}
            step={1}
            value={weightliftingLevel}
            onValueChange={setWeightliftingLevel}
            minimumTrackTintColor="#4A90E2"
            maximumTrackTintColor="#d3d3d3"
            thumbTintColor="#4A90E2"
          />
          <View style={styles.sliderLabelsContainer}>
            <Text style={styles.sliderLabelLeft}>Beginner</Text>
            <Text style={styles.sliderLabelRight}>Advanced</Text>
          </View>
          <View style={styles.levelDescriptionContainer}>
            <Text style={styles.levelDescription}>
              {weightliftingLevelDescriptions[weightliftingLevel]}
            </Text>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Please share anything else about your fitness level (optional)</Text>
          <TextInput
            style={styles.textArea}
            placeholder="E.g., previous injuries, specific strengths or weaknesses"
            value={additionalInfo}
            onChangeText={setAdditionalInfo}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Is there any particular exercise you would like to avoid?</Text>
          <TextInput
            style={styles.textArea}
            placeholder="E.g., running, squats, deadlifts"
            value={excludedExercises}
            onChangeText={setExcludedExercises}
            multiline
            numberOfLines={3}
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
  levelDescriptionContainer: {
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
  },
  levelDescription: {
    fontSize: 16,
    color: '#4A90E2',
    textAlign: 'center',
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

export default CurrentFitnessLevelsScreen;
