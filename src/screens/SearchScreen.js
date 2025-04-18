import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SearchBar, Card, Button } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';

const SearchScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const updateSearch = (text) => {
    setSearch(text);
  };

  const handleSearch = () => {
    if (search.trim() === '') return;
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchBar
          placeholder="Search preschools..."
          onChangeText={updateSearch}
          value={search}
          platform="ios"
          containerStyle={styles.searchBarContainer}
          inputContainerStyle={styles.searchBarInputContainer}
          onSubmitEditing={handleSearch}
          showLoading={loading}
        />
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.sectionTitle}>Search Suggestions</Text>
        
        <Card containerStyle={styles.card}>
          <Card.Title>Search by Location</Card.Title>
          <Card.Divider />
          <Text style={styles.cardText}>
            Find preschools near you by entering your zip code or neighborhood name.
          </Text>
          <Button
            title="Use My Location"
            buttonStyle={styles.button}
            onPress={() => console.log('Use location pressed')}
          />
        </Card>
        
        <Card containerStyle={styles.card}>
          <Card.Title>Filter by Features</Card.Title>
          <Card.Divider />
          <Text style={styles.cardText}>
            Narrow your search by specific features such as curriculum type, hours, or age groups.
          </Text>
          <Button
            title="View Filters"
            buttonStyle={styles.button}
            onPress={() => console.log('View filters pressed')}
          />
        </Card>
        
        <Text style={styles.sectionTitle}>Popular Searches</Text>
        {['Montessori', 'Bilingual', 'Extended Hours', 'Special Needs'].map((item, index) => (
          <Button
            key={index}
            title={item}
            type="outline"
            buttonStyle={styles.tagButton}
            titleStyle={styles.tagButtonTitle}
            containerStyle={styles.tagButtonContainer}
            onPress={() => {
              setSearch(item);
              handleSearch();
            }}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  searchBarContainer: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingHorizontal: 0,
  },
  searchBarInputContainer: {
    backgroundColor: '#f0f0f0',
  },
  scrollContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 16,
    color: '#333',
  },
  card: {
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
  },
  cardText: {
    marginBottom: 16,
    fontSize: 14,
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#4a90e2',
    borderRadius: 6,
    marginTop: 10,
  },
  tagButtonContainer: {
    marginRight: 8,
    marginBottom: 10,
    display: 'inline-block',
  },
  tagButton: {
    borderColor: '#4a90e2',
    borderRadius: 20,
    paddingHorizontal: 12,
  },
  tagButtonTitle: {
    color: '#4a90e2',
    fontSize: 14,
  },
});

export default SearchScreen; 