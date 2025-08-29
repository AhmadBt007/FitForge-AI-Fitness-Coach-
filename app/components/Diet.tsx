import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const dietPlans = [
  {
    goal: "Weight Loss",
    totalCalories: "1300–1600 kcal",
    meals: {
      breakfast: "2 boiled eggs, 1 slice brown bread, green tea – 250 kcal",
      lunch: "Grilled chicken, veggies, 1 roti – 450 kcal",
      snack: "Apple, almonds – 200 kcal",
      dinner: "Lentil soup, salad, 1 bread – 400 kcal"
    }
  },
  {
    goal: "Maintenance",
    totalCalories: "2000–2200 kcal",
    meals: {
      breakfast: "2 eggs, 1 paratha, yogurt – 450 kcal",
      lunch: "Grilled fish, rice, salad – 600 kcal",
      snack: "Banana + peanut butter – 250 kcal",
      dinner: "Chicken curry, 2 rotis, raita – 700 kcal"
    }
  },
  {
    goal: "Weight Gain",
    totalCalories: "2500–2800 kcal",
    meals: {
      breakfast: "3 eggs, toast, banana smoothie – 600 kcal",
      lunch: "Chicken biryani, salad – 750 kcal",
      snack: "Trail mix, full-fat milk – 400 kcal",
      dinner: "Steak/curry, 2 rotis, yogurt – 800 kcal"
    }
  }
];

export default function Diet() {
  const navigation = useNavigation<any>();
  const handleCreateDiet = () => {
    navigation.navigate('CreateDietPlan');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      <TouchableOpacity style={styles.createButton} onPress={handleCreateDiet}>
        <Text style={styles.createButtonText}>+ Create Diet Plan</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Diet Plans</Text>
      <Text style={styles.subtitle}>Choose a plan that matches your goal</Text>
      {dietPlans.map((plan, idx) => (
        <View key={idx} style={styles.card}>
          <Text style={styles.goal}>{plan.goal}</Text>
          <Text style={styles.calories}>Total Calories: {plan.totalCalories}</Text>
          <View style={styles.mealsSection}>
            <Text style={styles.mealTitle}>Breakfast:</Text>
            <Text style={styles.mealText}>{plan.meals.breakfast}</Text>
            <Text style={styles.mealTitle}>Lunch:</Text>
            <Text style={styles.mealText}>{plan.meals.lunch}</Text>
            <Text style={styles.mealTitle}>Snack:</Text>
            <Text style={styles.mealText}>{plan.meals.snack}</Text>
            <Text style={styles.mealTitle}>Dinner:</Text>
            <Text style={styles.mealText}>{plan.meals.dinner}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181818',
    paddingHorizontal: 16,
  },
  createButton: {
    backgroundColor: '#27ae60',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  title: {
    color: '#27ae60',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#bbb',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#232323',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  goal: {
    color: '#27ae60',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  calories: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 12,
  },
  mealsSection: {
    marginTop: 8,
  },
  mealTitle: {
    color: '#bbb',
    fontSize: 15,
    fontWeight: '600',
    marginTop: 8,
  },
  mealText: {
    color: '#fff',
    fontSize: 15,
    marginLeft: 8,
  },
}); 