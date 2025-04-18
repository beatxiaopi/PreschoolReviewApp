import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Icon } from '@rneui/themed';

// Placeholder screens - we'll create these after
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import PreschoolDetailScreen from '../screens/PreschoolDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ title: 'Preschool Reviews' }}
      />
      <Stack.Screen
        name="PreschoolDetail"
        component={PreschoolDetailScreen}
        options={({ route }) => ({ 
          title: 'Preschool Details',
          headerBackTitle: 'Back'
        })}
      />
    </Stack.Navigator>
  );
};

const SearchStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{ title: 'Search Preschools' }}
      />
    </Stack.Navigator>
  );
};

const FavoritesStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="FavoritesScreen"
        component={FavoritesScreen}
        options={{ title: 'My Favorites' }}
      />
    </Stack.Navigator>
  );
};

const SettingsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Search') {
              iconName = 'search';
            } else if (route.name === 'Favorites') {
              iconName = 'star';
            } else if (route.name === 'Settings') {
              iconName = 'settings';
            }

            return <Icon name={iconName} type="material" size={size} color={color} />;
          },
          tabBarActiveTintColor: '#4a90e2',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeStack} 
          options={{ headerShown: false }}
        />
        <Tab.Screen 
          name="Search" 
          component={SearchStack} 
          options={{ headerShown: false }}
        />
        <Tab.Screen 
          name="Favorites" 
          component={FavoritesStack} 
          options={{ headerShown: false }}
        />
        <Tab.Screen 
          name="Settings" 
          component={SettingsStack} 
          options={{ headerShown: false }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 