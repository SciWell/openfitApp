import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  ProgressBarAndroid
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const AchievementsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      // For demo purposes, we'll create some sample achievements
      // In a real app, these would be calculated based on user's actual progress
      const sampleAchievements = [
        { 
          id: '1', 
          title: 'First Workout', 
          description: 'Completed your first workout',
          achieved: true,
          date: '2025-03-10',
          icon: 'fitness-outline'
        },
        { 
          id: '2', 
          title: '5 Workouts', 
          description: 'Completed 5 workouts',
          achieved: true,
          date: '2025-03-25',
          icon: 'checkmark-done-outline'
        },
        { 
          id: '3', 
          title: '10 Workouts', 
          description: 'Completed 10 workouts',
          achieved: false,
          progress: 7,
          total: 10,
          icon: 'checkmark-done-outline'
        },
        { 
          id: '4', 
          title: 'Consistency King', 
          description: 'Workout 3 times in a week',
          achieved: true,
          date: '2025-04-02',
          icon: 'calendar-outline'
        },
        { 
          id: '5', 
          title: 'Heavy Lifter', 
          description: 'Lift over 200 lbs in any exercise',
          achieved: false,
          progress: 175,
          total: 200,
          icon: 'barbell-outline'
        },
        { 
          id: '6', 
          title: 'Marathon Runner', 
          description: 'Complete a 10km run',
          achieved: false,
          progress: 6.2,
          total: 10,
          icon: 'walk-outline'
        },
        { 
          id: '7', 
          title: 'Early Bird', 
          description: 'Complete 5 workouts before 8am',
          achieved: false,
          progress: 2,
          total: 5,
          icon: 'sunny-outline'
        },
        { 
          id: '8', 
          title: 'Dedicated', 
          description: 'Complete 30 workouts',
          achieved: false,
          progress: 7,
          total: 30,
          icon: 'ribbon-outline'
        },
        { 
          id: '9', 
          title: 'Weight Goal Achieved', 
          description: 'Reach your target weight',
          achieved: false,
          progress: 0,
          total: 1,
          icon: 'trending-down-outline'
        }
      ];
      
      setAchievements(sampleAchievements);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderAchievementItem = ({ item }) => (
    <View 
      style={[
        styles.achievementCard,
        item.achieved ? styles.achievedCard : styles.unachievedCard
      ]}
    >
      <View style={[
        styles.achievementIcon,
        item.achieved ? styles.achievedIcon : styles.unachievedIcon
      ]}>
        <Ionicons 
          name={item.icon} 
          size={24} 
          color={item.achieved ? '#FFD700' : '#888'} 
        />
      </View>
      <View style={styles.achievementInfo}>
        <Text style={styles.achievementTitle}>{item.title}</Text>
        <Text style={styles.achievementDescription}>{item.description}</Text>
        {item.achieved ? (
          <Text style={styles.achievementDate}>
            Achieved on {new Date(item.date).toLocaleDateString()}
          </Text>
        ) : (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { width: `${(item.progress / item.total) * 100}%` }
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {item.progress}/{item.total}
            </Text>
          </View>
        )}
      </View>
    </View>
  );

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
        <Text style={styles.headerTitle}>Achievements</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {achievements.filter(a => a.achieved).length}
          </Text>
          <Text style={styles.statLabel}>Achieved</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {achievements.filter(a => !a.achieved).length}
          </Text>
          <Text style={styles.statLabel}>In Progress</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {achievements.length}
          </Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>

      <FlatList
        data={achievements}
        renderItem={renderAchievementItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
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
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  listContainer: {
    padding: 16,
  },
  achievementCard: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  achievedCard: {
    borderColor: '#FFD700',
    backgroundColor: 'rgba(255, 215, 0, 0.05)',
  },
  unachievedCard: {
    borderColor: '#ddd',
  },
  achievementIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  achievedIcon: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  unachievedIcon: {
    backgroundColor: '#f0f0f0',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AchievementsScreen;
