import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import CreateDietPlan from './components/CreateDietPlan';
import CreateWorkout from './components/CreateWorkout';

import Chat from './components/ChatBotScreen';
import Diet from './components/Diet';
import Login from './components/Login';
import MyWorkouts from './components/MyWorkouts';
import Profile from './components/Profile';
import Signup from './components/Signup';
import UserDashboard from './components/UserDashboard';
import Workouts from './components/Workouts';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function AppDrawer() {
  return (
    <Drawer.Navigator initialRouteName="Profile">
      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen name="UserDashboard" component={UserDashboard} options={{ title: 'Dashboard' }} />
      <Drawer.Screen name="Workouts" component={Workouts} options={{ title: 'Recommended  Workouts' }} />
      <Drawer.Screen name="Diet" component={Diet} options={{ title: 'Recommended Diet Plan' }} />
      <Drawer.Screen name="MyWorkouts" component={MyWorkouts} options={{ title: 'My Custom Workouts' }} />
      <Drawer.Screen name="MyDietPlan" component={require('./components/MyDietPlan').default} options={{ title: 'My Custom Diet Plans' }} />
      <Drawer.Screen name="CreateDietPlan" component={CreateDietPlan} options={{ title: 'Create Custom Diet Plan' }} />
      <Drawer.Screen name="CreateWorkout" component={CreateWorkout} options={{ title: 'Create Custom Workout' }} />
      <Drawer.Screen name="Chat" component={Chat} options={{ title: 'Chat With AI' }} />
    </Drawer.Navigator>
  );
}

function AuthStack({ onLogin }: { onLogin: () => void }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login">
        {props => <Login {...props} onLogin={onLogin} />}
      </Stack.Screen>
      <Stack.Screen name="Signup" component={Signup} />
    </Stack.Navigator>
  );
}



export default function RootLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return isAuthenticated ? <AppDrawer /> : <AuthStack onLogin={() => setIsAuthenticated(true)} />;
}
