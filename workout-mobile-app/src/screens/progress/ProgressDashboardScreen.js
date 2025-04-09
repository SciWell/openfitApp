import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const ProgressDashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [workoutStats, setWorkoutStats] = useState({
    totalWorkouts: 0,
    totalDuration: 0,
    thisWeekWorkouts: 0,
    thisWeekDuration: 0
  });
  const [weightHistory, setWeightHistory] = useState([]);
  const [exerciseProgress, setExerciseProgress] = useState({});
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    fetchProgressData();
  }, []);

  const fetchProgressData = async () => {
    try {
      await Promise.all([
        fetchWorkoutStats(),
        fetchWeightHistory(),
        fetchExerciseProgress(),
        fetchAchievements()
      ]);
    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkoutStats = async () => {
    try {
      // Get total workouts and duration
      const { data: totalData, error: totalError } = await supabase
        .from('completed_workouts')
        .select('id, duration')
        .eq('user_id', user.id);
      
      if (totalError) throw totalError;
      
      // Get this week's workouts
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay()); // Start of current week (Sunday)
      startOfWeek.setHours(0, 0, 0, 0);
      
      const { data: weekData, error: weekError } = await supabase
        .from('completed_workouts')
        .select('id, duration')
        .eq('user_id', user.id)
        .gte('date_completed', startOfWeek.toISOString());
      
      if (weekError) throw weekError;
      
      setWorkoutStats({
        totalWorkouts: totalData?.length || 0,
        totalDuration: totalData?.reduce((sum, workout) => sum + (workout.duration || 0), 0) || 0,
        thisWeekWorkouts: weekData?.length || 0,
        thisWeekDuration: weekData?.reduce((sum, workout) => sum + (workout.duration || 0), 0) || 0
      });
    } catch (error) {
      console.error('Error fetching workout stats:', error);
    }
  };

  const fetchWeightHistory = async () => {
    // For demo purposes, we'll create some sample weight data
    // In a real app, this would come from a weight_history table or similar
    const sampleWeightData = [
      { date: '2025-03-01', weight: 180 },
      { date: '2025-03-08', weight: 178 },
      { date: '2025-03-15', weight: 177 },
      { date: '2025-03-22', weight: 175 },
      { date: '2025-03-29', weight: 174 },
      { date: '2025-04-05', weight: 173 }
    ];
    
    setWeightHistory(sampleWeightData);
  };

  const fetchExerciseProgress = async () => {
    try {
      // Get the most common exercises the user has completed
      const { data: exercisesData, error: exercisesError } = await supabase
        .from('completed_sets')
        .select(`
          workout_exercise_id,
          performed_weight,
          performed_reps,
          created_at,
          workout_exercises!inner (
            exercises!inner (
              id,
              name
            )
          )
        `)
        .eq('workout_exercises.workouts.user_id', user.id)
        .order('created_at', { ascending: true });
      
      if (exercisesError) throw exercisesError;
      
      // Process the data to get progress for each exercise
      const exerciseData = {};
      
      exercisesData?.forEach(set => {
        const exerciseId = set.workout_exercises.exercises.id;
        const exerciseName = set.workout_exercises.exercises.name;
        const date = new Date(set.created_at).toLocaleDateString();
        const weight = set.performed_weight || 0;
        
        if (!exerciseData[exerciseId]) {
          exerciseData[exerciseId] = {
            name: exerciseName,
            data: {}
          };
        }
        
        if (!exerciseData[exerciseId].data[date] || weight > exerciseData[exerciseId].data[date]) {
          exerciseData[exerciseId].data[date] = weight;
        }
      });
      
      // Convert to format needed for charts
      const processedExerciseData = {};
      
      Object.entries(exerciseData).forEach(([exerciseId, exercise]) => {
        const dataPoints = Object.entries(exercise.data)
          .map(([date, weight]) => ({ date, weight }))
          .sort((a, b) => new Date(a.date) - new Date(b.date));
        
        if (dataPoints.length >= 2) {
          processedExerciseData[exerciseId] = {
            name: exercise.name,
            labels: dataPoints.map(point => point.date.split('/').slice(0, 2).join('/')),
            data: dataPoints.map(point => point.weight)
          };
        }
      });
      
      // Take only top 3 exercises with most data points
      const topExercises = Object.entries(processedExerciseData)
        .sort((a, b) => b[1].data.length - a[1].data.length)
        .slice(0, 3)
        .reduce((obj, [key, value]) => {
          obj[key] = value;
          return obj;
        }, {});
      
      setExerciseProgress(topExercises);
    } catch (error) {
      console.error('Error fetching exercise progress:', error);
    }
  };

  const fetchAchievements = async () => {
    // For demo purposes, we'll create some sample achievements
    // In a real app, these would be calculated based on user's actual progress
    const sampleAchievements = [
      { 
        id: '1', 
        title: 'First Workout', 
        description: 'Completed your first workout',
        achieved: true,
        date: '2025-03-10'
      },
      { 
        id: '2', 
        title: '5 Workouts', 
        description: 'Completed 5 workouts',
        achieved: true,
        date: '2025-03-25'
      },
      { 
        id: '3', 
        title: '10 Workouts', 
        description: 'Completed 10 workouts',
        achieved: false,
        progress: 7,
        total: 10
      },
      { 
        id: '4', 
        title: 'Consistency King', 
        description: 'Workout 3 times in a week',
        achieved: true,
        date: '2025-04-02'
      },
      { 
        id: '5', 
        title: 'Heavy Lifter', 
        description: 'Lift over 200 lbs in any exercise',
        achieved: false,
        progress: 175,
        total: 200
      }
    ];
    
    setAchievements(sampleAchievements);
  };

  const renderWeightChart = () => {
    if (weightHistory.length < 2) {
      return (
        <View style={styles.emptyChartContainer}>
          <Text style={styles.emptyChartText}>Not enough weight data</Text>
        </View>
      );
    }

    const chartData = {
      labels: weightHistory.map(entry => {
        const date = new Date(entry.date);
        return `${date.getMonth() + 1}/${date.getDate()}`;
      }),
      datasets: [
        {
          data: weightHistory.map(entry => entry.weight),
          color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
          strokeWidth: 2
        }
      ]
    };

    return (
      <LineChart
        data={chartData}
        width={Dimensions.get('window').width - 40}
        height={180}
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16
          },
          propsForDots: {
            r: '5',
            strokeWidth: '2',
            stroke: '#4A90E2'
          }
        }}
        bezier
        style={styles.chart}
      />
    );
  };

  const renderExerciseProgressChart = (exerciseId, exercise) => {
    if (!exercise || exercise.data.length < 2) {
      return null;
    }

    const chartData = {
      labels: exercise.labels,
      datasets: [
        {
          data: exercise.data,
          color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
          strokeWidth: 2
        }
      ]
    };

    return (
      <View style={styles.exerciseProgressCard} key={exerciseId}>
        <Text style={styles.exerciseProgressTitle}>{exercise.name}</Text>
        <LineChart
          data={chartData}
          width={Dimensions.get('window').width - 40}
          height={180}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: '5',
              strokeWidth: '2',
              stroke: '#4A90E2'
            }
          }}
          bezier
          style={styles.chart}
        />
      </View>
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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Progress</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{workoutStats.totalWorkouts}</Text>
          <Text style={styles.statLabel}>Total Workouts</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{workoutStats.totalDuration}</Text>
          <Text style={styles.statLabel}>Total Minutes</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{workoutStats.thisWeekWorkouts}</Text>
          <Text style={styles.statLabel}>This Week</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Weight History</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => navigation.navigate('AddWeight')}
          >
            <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        {renderWeightChart()}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Exercise Progress</Text>
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={() => navigation.navigate('ExerciseProgress')}
          >
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        {Object.keys(exerciseProgress).length === 0 ? (
          <View style={styles.emptyChartContainer}>
            <Text style={styles.emptyChartText}>Complete more workouts to see progress</Text>
          </View>
        ) : (
          Object.entries(exerciseProgress).map(([exerciseId, exercise]) => 
            renderExerciseProgressChart(exerciseId, exercise)
          )
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={() => navigation.navigate('Achievements')}
          >
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.achievementsContainer}>
          {achievements.slice(0, 3).map(achievement => (
            <View 
              key={achievement.id} 
              style={[
                styles.achievementCard,
                achievement.achieved ? styles.achievedCard : styles.unachievedCard
              ]}
            >
              <View style={styles.achievementIcon}>
                {achievement.achieved ? (
                  <Ionicons name="trophy" size={24} color="#FFD700" />
                ) : (
                  <Ionicons name="trophy-outline" size={24} color="#888" />
                )}
              </View>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDescription}>{achievement.description}</Text>
                {achievement.achieved ? (
                  <Text style={styles.achievementDate}>
                    Achieved on {new Date(achievement.date).toLocaleDateString()}
                  </Text>
                ) : (
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View 
                        style={[
                          styles.progressFill,
                          { width: `${(achievement.progress / achievement.total) * 100}%` }
                        ]}
                      />
                    </View>
                    <Text style={styles.progressText}>
                      {achievement.progress}/{achievement.total}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity 
        style={styles.historyButton}
        onPress={() => navigation.navigate('WorkoutHistory')}
      >
        <Ionicons name="time-outline" size={20} color="#fff" />
        <Text style={styles.historyButtonText}>View Workout History</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 16,
    marginTop: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
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
    backgroundColor: '#4A90E2',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewAllButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  viewAllText: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: '500',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  emptyChartContainer: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  emptyChartText: {
    color: '#888',
    fontSize: 16,
  },
  exerciseProgressCard: {
    marginBottom: 16,
  },
  exerciseProgressTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  achievementsContainer: {
    gap: 12,
  },
  achievementCard: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  achievedCard: {
    borderColor: '#FFD700',
    backgroundColor: 'rgba(255, 215, 0, 0.05)',
  },
  unachievedCard: {
    borderColor: '#ddd',
    backgroundColor: '#f8f8f8',
  },
  achievementIcon: {
    marginRight: 12,
    justifyContent: 'center',
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  achievementDate: {
    fontSize: 12,
    color: '#888',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#eee',
    borderRadius: 3,
    marginRight: 8,
  },
  progressFill: {
    height: 6,
    backgroundColor: '#4A90E2',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#888',
    width: 40,
  },
  historyButton: {
    flexDirection: 'row',
    backgroundColor: '#4A90E2',
    margin: 16,
    marginTop: 8,
    padding: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProgressDashboardScreen;
