import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import Home from './components/Home';
import Profile from './components/Profile';
import UserDashboard from './components/UserDashboard';
import Workouts from './components/Workouts';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: '#181818', borderTopColor: '#232323' },
        tabBarActiveTintColor: '#27ae60',
        tabBarInactiveTintColor: '#bbb',
        tabBarIcon: ({ color, size }) => {
          let iconName: any = 'home';
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Dashboard') iconName = 'bar-chart';
          else if (route.name === 'Workouts') iconName = 'fitness';
          else if (route.name === 'Profile') iconName = 'person';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Dashboard" component={UserDashboard} />
      <Tab.Screen name="Workouts" component={Workouts} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
} 