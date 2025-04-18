import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Card, Icon, Button } from '@rneui/themed';
import RecommendationService from '../services/RecommendationService';

const PreschoolCard = ({ preschool, onPress }) => {
  // Get the first image from the images array if available
  const imageUrl = preschool.images && preschool.images.length > 0 
    ? preschool.images[0] 
    : preschool.imageUrl; // Fallback to imageUrl if it exists
    
  return (
    <TouchableOpacity onPress={() => onPress(preschool)}>
      <Card containerStyle={styles.preschoolCard}>
        <View style={styles.imageContainer}>
          {imageUrl ? (
            <Image 
              source={{ uri: imageUrl }} 
              style={styles.preschoolImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.preschoolImage, styles.placeholderImage]}>
              <Icon name="school" type="material" size={40} color="#ccc" />
            </View>
          )}
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>{preschool.rating}</Text>
            <Icon name="star" type="material" size={12} color="#FFD700" />
          </View>
        </View>
        
        <View style={styles.cardContent}>
          <Text style={styles.preschoolName} numberOfLines={1}>{preschool.name}</Text>
          <Text style={styles.preschoolAddress} numberOfLines={1}>{preschool.address}</Text>
          
          <View style={styles.tagsContainer}>
            {preschool.matchReasons && preschool.matchReasons.map((reason, index) => (
              <View key={index} style={styles.tagBadge}>
                <Text style={styles.tagText}>{reason}</Text>
              </View>
            ))}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const FeaturedPreschools = ({ navigation, limit = 5 }) => {
  const [preschools, setPreschools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFeaturedPreschools();
  }, []);

  const loadFeaturedPreschools = async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const recommendationService = new RecommendationService();
      const recommendations = await recommendationService.getFeaturedPreschools(limit);
      setPreschools(recommendations);
    } catch (error) {
      console.error('Error loading featured preschools:', error);
      setError('Unable to load recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadFeaturedPreschools(true);
  };

  const handlePreschoolPress = (preschool) => {
    console.log('Preschool pressed:', preschool.name);
    // Navigate to preschool details screen
    navigation.navigate('PreschoolDetail', { preschoolId: preschool.id });
  };

  const handleSeeAllPress = () => {
    console.log('See All pressed');
    // In a real app, navigate to all featured preschools screen
    // navigation.navigate('FeaturedPreschools');
  };

  if (loading && preschools.length === 0) {
    return (
      <Card containerStyle={styles.container}>
        <Card.Title>Featured Preschools</Card.Title>
        <Card.Divider />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4a90e2" />
          <Text style={styles.loadingText}>Finding the best preschools for you...</Text>
        </View>
      </Card>
    );
  }

  if (error && preschools.length === 0) {
    return (
      <Card containerStyle={styles.container}>
        <Card.Title>Featured Preschools</Card.Title>
        <Card.Divider />
        <View style={styles.errorContainer}>
          <Icon name="error-outline" type="material" size={40} color="#ff6b6b" />
          <Text style={styles.errorText}>{error}</Text>
          <Button 
            title="Try Again" 
            buttonStyle={styles.retryButton}
            onPress={handleRefresh}
          />
        </View>
      </Card>
    );
  }

  return (
    <Card containerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Card.Title style={styles.title}>Featured Preschools</Card.Title>
        <TouchableOpacity onPress={handleSeeAllPress}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      <Card.Divider />
      
      {preschools.length > 0 ? (
        <FlatList
          data={preschools}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PreschoolCard 
              preschool={item} 
              onPress={handlePreschoolPress} 
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Icon name="search" type="material" size={40} color="#ccc" />
          <Text style={styles.emptyText}>No featured preschools found</Text>
          <Button 
            title="Refresh" 
            buttonStyle={styles.refreshButton}
            onPress={handleRefresh}
          />
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 0,
    marginBottom: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  title: {
    fontSize: 18,
    textAlign: 'left',
    marginBottom: 0,
  },
  seeAllText: {
    color: '#4a90e2',
    fontSize: 14,
  },
  listContainer: {
    paddingVertical: 10,
    paddingEnd: 5,
  },
  preschoolCard: {
    width: 250,
    margin: 0,
    marginRight: 10,
    padding: 0,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    position: 'relative',
  },
  preschoolImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  placeholderImage: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ratingText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
    marginRight: 2,
  },
  cardContent: {
    padding: 12,
  },
  preschoolName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  preschoolAddress: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagBadge: {
    backgroundColor: '#e8f4fd',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 11,
    color: '#4a90e2',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  errorContainer: {
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    marginBottom: 15,
    color: '#666',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#4a90e2',
    paddingHorizontal: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 10,
    marginBottom: 15,
    color: '#666',
  },
  refreshButton: {
    backgroundColor: '#4a90e2',
    paddingHorizontal: 20,
  },
});

export default FeaturedPreschools; 