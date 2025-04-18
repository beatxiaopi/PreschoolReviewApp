import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Card, Button, Icon } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';

const FavoritesScreen = ({ navigation }) => {
  // Mock data for favorites
  const favorites = [
    {
      id: '1',
      name: 'Sunshine Preschool',
      address: '123 Main St, Anytown, CA',
      rating: 4.8,
      reviews: 24,
    },
    {
      id: '2',
      name: 'Little Learners Academy',
      address: '456 Oak Ave, Somewhere, CA',
      rating: 4.6,
      reviews: 18,
    },
    {
      id: '3',
      name: 'Tiny Tots Daycare',
      address: '789 Pine Rd, Nowhere, CA',
      rating: 4.7,
      reviews: 31,
    },
  ];

  const renderItem = ({ item }) => (
    <Card containerStyle={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.preschoolName}>{item.name}</Text>
          <Text style={styles.address}>{item.address}</Text>
        </View>
        <Icon
          name="star"
          type="material"
          color="#FFD700"
          size={24}
          containerStyle={styles.favoriteIcon}
        />
      </View>
      
      <View style={styles.ratingContainer}>
        <Text style={styles.rating}>{item.rating}</Text>
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((_, index) => (
            <Icon
              key={index}
              name="star"
              type="material"
              size={16}
              color={index < Math.floor(item.rating) ? '#FFD700' : '#e0e0e0'}
              containerStyle={styles.starIcon}
            />
          ))}
        </View>
        <Text style={styles.reviews}>({item.reviews} reviews)</Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button
          title="View Details"
          buttonStyle={styles.viewButton}
          onPress={() => console.log(`View details for ${item.name}`)}
        />
        <Button
          title="Remove"
          buttonStyle={styles.removeButton}
          titleStyle={styles.removeButtonText}
          type="outline"
          onPress={() => console.log(`Remove ${item.name} from favorites`)}
        />
      </View>
    </Card>
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon
        name="star-border"
        type="material"
        size={64}
        color="#ccc"
        containerStyle={styles.emptyIcon}
      />
      <Text style={styles.emptyTitle}>No Favorites Yet</Text>
      <Text style={styles.emptyText}>
        Start browsing preschools and save your favorites to see them here.
      </Text>
      <Button
        title="Browse Preschools"
        buttonStyle={styles.emptyButton}
        onPress={() => navigation.navigate('Search')}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>My Favorites</Text>
      
      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <EmptyState />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  preschoolName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  favoriteIcon: {
    alignSelf: 'flex-start',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  rating: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  starIcon: {
    marginRight: 2,
  },
  reviews: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewButton: {
    backgroundColor: '#4a90e2',
    borderRadius: 6,
    paddingHorizontal: 16,
    flex: 1,
    marginRight: 8,
  },
  removeButton: {
    borderColor: '#ff6b6b',
    borderRadius: 6,
    paddingHorizontal: 16,
    flex: 1,
  },
  removeButtonText: {
    color: '#ff6b6b',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#4a90e2',
    borderRadius: 6,
    paddingHorizontal: 24,
  },
});

export default FavoritesScreen; 