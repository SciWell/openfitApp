import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const AboutYouScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [heightUnit, setHeightUnit] = useState('cm');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (!gender || !age || !height || !weight) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    
    try {
      // Save data to Supabase profiles table
      const { error } = await supabase
        .from('profiles')
        .update({
          gender,
          age: parseInt(age),
          height: parseFloat(height),
          weight: parseFloat(weight),
          height_unit: heightUnit,
          weight_unit: weightUnit,
          updated_at: new Date()
        })
        .eq('id', user.id);

      if (error) throw error;
      
      // Navigate to next onboarding screen
      navigation.navigate('FitnessGoals');
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>About You</Text>
        <Text style={styles.subtitle}>Let's get to know you better to personalize your experience</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                gender === 'male' && styles.selectedOption
              ]}
              onPress={() => setGender('male')}
            >
              <Text style={[
                styles.optionText,
                gender === 'male' && styles.selectedOptionText
              ]}>Male</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.optionButton,
                gender === 'female' && styles.selectedOption
              ]}
              onPress={() => setGender('female')}
            >
              <Text style={[
                styles.optionText,
                gender === 'female' && styles.selectedOptionText
              ]}>Female</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.optionButton,
                gender === 'other' && styles.selectedOption
              ]}
              onPress={() => setGender('other')}
            >
              <Text style={[
                styles.optionText,
                gender === 'other' && styles.selectedOptionText
              ]}>Other</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your age"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Height</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, { flex: 2 }]}
              placeholder="Enter your height"
              value={height}
              onChangeText={setHeight}
              keyboardType="numeric"
            />
            <View style={styles.unitSelector}>
              <TouchableOpacity
                style={[
                  styles.unitButton,
                  heightUnit === 'cm' && styles.selectedUnit
                ]}
                onPress={() => setHeightUnit('cm')}
              >
                <Text style={[
                  styles.unitText,
                  heightUnit === 'cm' && styles.selectedUnitText
                ]}>cm</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.unitButton,
                  heightUnit === 'ft' && styles.selectedUnit
                ]}
                onPress={() => setHeightUnit('ft')}
              >
                <Text style={[
                  styles.unitText,
                  heightUnit === 'ft' && styles.selectedUnitText
                ]}>ft</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Weight</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, { flex: 2 }]}
              placeholder="Enter your weight"
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
            />
            <View style={styles.unitSelector}>
              <TouchableOpacity
                style={[
                  styles.unitButton,
                  weightUnit === 'kg' && styles.selectedUnit
                ]}
                onPress={() => setWeightUnit('kg')}
              >
                <Text style={[
                  styles.unitText,
                  weightUnit === 'kg' && styles.selectedUnitText
                ]}>kg</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.unitButton,
                  weightUnit === 'lbs' && styles.selectedUnit
                ]}
                onPress={() => setWeightUnit('lbs')}
              >
                <Text style={[
                  styles.unitText,
                  weightUnit === 'lbs' && styles.selectedUnitText
                ]}>lbs</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unitSelector: {
    flexDirection: 'row',
    marginLeft: 10,
    flex: 1,
  },
  unitButton: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedUnit: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  unitText: {
    fontSize: 16,
  },
  selectedUnitText: {
    color: '#fff',
    fontWeight: '600',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionButton: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: 4,
    borderRadius: 8,
  },
  selectedOption: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  optionText: {
    fontSize: 16,
  },
  selectedOptionText: {
    color: '#fff',
    fontWeight: '600',
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

export default AboutYouScreen;
