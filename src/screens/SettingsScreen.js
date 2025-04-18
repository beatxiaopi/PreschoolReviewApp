import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, Switch } from 'react-native';
import { Card, Input, Button, Icon, ListItem, Divider } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';

const SettingsScreen = () => {
  const [zipCode, setZipCode] = useState('');
  const [searchRadius, setSearchRadius] = useState('10');
  const [useGoogle, setUseGoogle] = useState(true);
  const [useYelp, setUseYelp] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [cacheTime, setCacheTime] = useState('60');

  useEffect(() => {
    // Load saved settings
    loadSettings();
  }, []);

  const loadSettings = () => {
    // Simulate loading settings from storage
    console.log('Loading settings...');
  };

  const saveSettings = () => {
    // Validate inputs
    if (zipCode.trim() !== '' && !/^\d{5}$/.test(zipCode)) {
      Alert.alert('Invalid Zip Code', 'Please enter a valid 5-digit zip code.');
      return;
    }

    if (searchRadius.trim() !== '' && (isNaN(parseInt(searchRadius)) || parseInt(searchRadius) <= 0)) {
      Alert.alert('Invalid Search Radius', 'Please enter a valid search radius greater than 0.');
      return;
    }

    if (cacheTime.trim() !== '' && (isNaN(parseInt(cacheTime)) || parseInt(cacheTime) < 0)) {
      Alert.alert('Invalid Cache Time', 'Please enter a valid cache time (minutes).');
      return;
    }

    // Simulate saving settings
    Alert.alert('Settings Saved', 'Your preferences have been updated successfully.');
  };

  const clearCache = () => {
    Alert.alert(
      'Clear Cache',
      'Are you sure you want to clear the app cache? This will remove all temporary data.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            // Simulate clearing cache
            Alert.alert('Cache Cleared', 'The app cache has been cleared successfully.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.heading}>Settings</Text>

        <Card containerStyle={styles.card}>
          <Card.Title>Location Settings</Card.Title>
          <Card.Divider />
          
          <Input
            label="Zip Code"
            placeholder="Enter your zip code"
            value={zipCode}
            onChangeText={setZipCode}
            keyboardType="numeric"
            maxLength={5}
            leftIcon={<Icon name="place" type="material" size={20} color="#666" />}
          />
          
          <Input
            label="Search Radius (miles)"
            placeholder="Enter search radius"
            value={searchRadius}
            onChangeText={setSearchRadius}
            keyboardType="numeric"
            leftIcon={<Icon name="track-changes" type="material" size={20} color="#666" />}
          />
        </Card>

        <Card containerStyle={styles.card}>
          <Card.Title>Data Sources</Card.Title>
          <Card.Divider />
          
          <ListItem bottomDivider>
            <ListItem.Content>
              <ListItem.Title>Google Places</ListItem.Title>
              <ListItem.Subtitle>Show results from Google</ListItem.Subtitle>
            </ListItem.Content>
            <Switch
              value={useGoogle}
              onValueChange={setUseGoogle}
              trackColor={{ false: '#e0e0e0', true: '#b3d4fc' }}
              thumbColor={useGoogle ? '#4a90e2' : '#f4f3f4'}
            />
          </ListItem>
          
          <ListItem>
            <ListItem.Content>
              <ListItem.Title>Yelp</ListItem.Title>
              <ListItem.Subtitle>Show results from Yelp</ListItem.Subtitle>
            </ListItem.Content>
            <Switch
              value={useYelp}
              onValueChange={setUseYelp}
              trackColor={{ false: '#e0e0e0', true: '#b3d4fc' }}
              thumbColor={useYelp ? '#4a90e2' : '#f4f3f4'}
            />
          </ListItem>
        </Card>

        <Card containerStyle={styles.card}>
          <Card.Title>App Settings</Card.Title>
          <Card.Divider />
          
          <ListItem bottomDivider>
            <ListItem.Content>
              <ListItem.Title>Dark Mode</ListItem.Title>
              <ListItem.Subtitle>Use dark theme throughout the app</ListItem.Subtitle>
            </ListItem.Content>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#e0e0e0', true: '#b3d4fc' }}
              thumbColor={darkMode ? '#4a90e2' : '#f4f3f4'}
            />
          </ListItem>
          
          <ListItem bottomDivider>
            <ListItem.Content>
              <ListItem.Title>Auto Refresh</ListItem.Title>
              <ListItem.Subtitle>Automatically refresh data</ListItem.Subtitle>
            </ListItem.Content>
            <Switch
              value={autoRefresh}
              onValueChange={setAutoRefresh}
              trackColor={{ false: '#e0e0e0', true: '#b3d4fc' }}
              thumbColor={autoRefresh ? '#4a90e2' : '#f4f3f4'}
            />
          </ListItem>
          
          <Input
            label="Cache Time (minutes)"
            placeholder="Enter cache time in minutes"
            value={cacheTime}
            onChangeText={setCacheTime}
            keyboardType="numeric"
            leftIcon={<Icon name="timer" type="material" size={20} color="#666" />}
          />
        </Card>

        <Card containerStyle={styles.card}>
          <Card.Title>Cache Management</Card.Title>
          <Card.Divider />
          
          <Button
            title="Clear App Cache"
            icon={<Icon name="delete" type="material" size={20} color="white" style={{ marginRight: 10 }} />}
            buttonStyle={styles.clearCacheButton}
            onPress={clearCache}
          />
        </Card>

        <Button
          title="Save Settings"
          buttonStyle={styles.saveButton}
          containerStyle={styles.saveButtonContainer}
          onPress={saveSettings}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  card: {
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
  },
  clearCacheButton: {
    backgroundColor: '#ff6b6b',
    borderRadius: 6,
  },
  saveButtonContainer: {
    marginVertical: 20,
  },
  saveButton: {
    backgroundColor: '#4a90e2',
    borderRadius: 6,
    paddingVertical: 12,
  },
});

export default SettingsScreen; 