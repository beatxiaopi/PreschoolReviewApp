import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { Card, Button, Icon } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import FeaturedPreschools from '../components/FeaturedPreschools';
import RecommendationService from '../services/RecommendationService';

const HomeScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [nearbyPreschools, setNearbyPreschools] = useState([]);
  const [loadingNearby, setLoadingNearby] = useState(true);

  useEffect(() => {
    loadNearbyPreschools();
  }, []);

  const loadNearbyPreschools = async () => {
    try {
      setLoadingNearby(true);
      const recommendationService = new RecommendationService();
      // Use default values for demonstration
      const nearby = await recommendationService.getNearbyPreschools(37.7749, -122.4194, 5, 3);
      setNearbyPreschools(nearby);
    } catch (error) {
      console.error('Error loading nearby preschools:', error);
    } finally {
      setLoadingNearby(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNearbyPreschools();
    setRefreshing(false);
  };

  const handlePreschoolPress = (preschool) => {
    navigation.navigate('PreschoolDetail', { preschoolId: preschool.id });
  };

  const renderNearbyPreschools = () => {
    if (loadingNearby) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4a90e2" />
          <Text style={styles.loadingText}>Finding preschools near you...</Text>
        </View>
      );
    }

    if (nearbyPreschools.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Icon name="location-off" type="material" size={50} color="#ccc" />
          <Text style={styles.emptyText}>No preschools found nearby</Text>
        </View>
      );
    }

    return (
      <View>
        {nearbyPreschools.map((preschool) => (
          <Card key={preschool.id} containerStyle={styles.preschoolCard}>
            <View style={styles.preschoolHeader}>
              <Text style={styles.preschoolName}>{preschool.name}</Text>
              <View style={styles.ratingContainer}>
                <Icon name="star" type="material" size={16} color="#FFD700" />
                <Text style={styles.ratingText}>{preschool.rating}</Text>
              </View>
            </View>
            <Text style={styles.preschoolAddress}>{preschool.address}</Text>
            {preschool.distance && (
              <Text style={styles.distanceText}>{preschool.distance} miles away</Text>
            )}
            <Button
              title="View Details"
              buttonStyle={styles.viewButton}
              onPress={() => handlePreschoolPress(preschool)}
            />
          </Card>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#4a90e2']}
            tintColor="#4a90e2"
          />
        }
      >
        <View style={styles.headerContainer}>
          <Text style={styles.heading}>Preschool Reviews</Text>
          <Text style={styles.subheading}>Find the perfect preschool for your child</Text>
        </View>
        
        {/* Featured Preschools Component */}
        <FeaturedPreschools navigation={navigation} limit={3} />
        
        {/* Nearby Preschools Section */}
        <Card containerStyle={styles.sectionCard}>
          <Card.Title>Nearby Preschools</Card.Title>
          <Card.Divider />
          {renderNearbyPreschools()}
        </Card>
        
        <Card containerStyle={styles.card}>
          <Card.Title>Recently Reviewed</Card.Title>
          <Card.Divider />
          <Text style={styles.cardText}>
            Check out the latest reviews from other parents in your community.
          </Text>
          <Button
            title="View Recent Reviews"
            buttonStyle={styles.button}
            onPress={() => {
              console.log('View recent reviews pressed');
              // Navigate to Reviews screen when available
            }}
          />
        </Card>
        
        <Card containerStyle={styles.card}>
          <Card.Title>Write a Review</Card.Title>
          <Card.Divider />
          <Text style={styles.cardText}>
            Share your experience with a preschool to help other parents make informed decisions.
          </Text>
          <Button
            title="Write a Review"
            buttonStyle={styles.button}
            onPress={() => {
              console.log('Write review pressed');
              // Navigate to Write Review screen when available
            }}
          />
        </Card>
        
        {/* Add a spacer at the bottom for better scrolling experience */}
        <View style={styles.bottomSpacer} />
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 30, // Add padding at the bottom for better scrolling
  },
  headerContainer: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subheading: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  card: {
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionCard: {
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardText: {
    marginBottom: 16,
    fontSize: 14,
    lineHeight: 20,
    color: '#444',
  },
  button: {
    backgroundColor: '#4a90e2',
    borderRadius: 6,
    marginTop: 10,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
  },
  preschoolCard: {
    borderRadius: 8,
    marginBottom: 12,
    padding: 12,
  },
  preschoolHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  preschoolName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  preschoolAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  distanceText: {
    fontSize: 12,
    color: '#4a90e2',
    marginBottom: 12,
  },
  viewButton: {
    backgroundColor: '#4a90e2',
    borderRadius: 6,
    paddingVertical: 8,
    marginTop: 8,
  },
  bottomSpacer: {
    height: 30, // Additional space at the bottom
  },
});

export default HomeScreen; 