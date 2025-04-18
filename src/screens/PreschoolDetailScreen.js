import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator,
  Linking,
  Platform
} from 'react-native';
import { 
  Card, 
  Button, 
  Icon, 
  Divider, 
  Rating,
  ListItem
} from '@rneui/themed';
// Comment out MapView import and use a placeholder instead
// import MapView, { Marker } from 'react-native-maps';
import RecommendationService from '../services/RecommendationService';

const PreschoolDetailScreen = ({ route, navigation }) => {
  const { preschoolId } = route.params || {};
  const [preschool, setPreschool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadPreschoolDetails();
  }, [preschoolId]);

  const loadPreschoolDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, you would fetch this from an API
      const recommendationService = new RecommendationService();
      const mockPreschools = recommendationService.getMockPreschools();
      const foundPreschool = mockPreschools.find(p => p.id === preschoolId);
      
      if (foundPreschool) {
        // Simulate network delay
        setTimeout(() => {
          setPreschool(foundPreschool);
          setLoading(false);
        }, 1000);
      } else {
        throw new Error('Preschool not found');
      }
    } catch (error) {
      console.error('Error loading preschool details:', error);
      setError('Unable to load preschool details. Please try again.');
      setLoading(false);
    }
  };

  const handleOpenMap = () => {
    if (!preschool) return;
    
    const { latitude, longitude, name, address } = preschool;
    const label = encodeURIComponent(`${name} - ${address}`);
    
    let url;
    if (Platform.OS === 'ios') {
      url = `maps:?q=${label}&ll=${latitude},${longitude}`;
    } else {
      url = `geo:${latitude},${longitude}?q=${label}`;
    }
    
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          const browserUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
          return Linking.openURL(browserUrl);
        }
      })
      .catch(err => console.error('Error opening map:', err));
  };

  const handleCall = () => {
    if (!preschool?.phone) return;
    
    const url = `tel:${preschool.phone}`;
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          return Linking.openURL(url);
        }
      })
      .catch(err => console.error('Error making call:', err));
  };

  const handleWebsite = () => {
    if (!preschool?.website) return;
    
    Linking.canOpenURL(preschool.website)
      .then(supported => {
        if (supported) {
          return Linking.openURL(preschool.website);
        }
      })
      .catch(err => console.error('Error opening website:', err));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a90e2" />
        <Text style={styles.loadingText}>Loading preschool details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="error-outline" type="material" size={60} color="#ff6b6b" />
        <Text style={styles.errorText}>{error}</Text>
        <Button 
          title="Try Again" 
          buttonStyle={styles.retryButton}
          onPress={loadPreschoolDetails}
        />
      </View>
    );
  }

  if (!preschool) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="search-off" type="material" size={60} color="#ff6b6b" />
        <Text style={styles.errorText}>Preschool not found</Text>
        <Button 
          title="Go Back" 
          buttonStyle={styles.retryButton}
          onPress={() => navigation.goBack()}
        />
      </View>
    );
  }

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {preschool.imageUrl ? (
        <Image 
          source={{ uri: preschool.imageUrl }} 
          style={styles.headerImage}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.headerImage, styles.placeholderImage]}>
          <Icon name="school" type="material" size={80} color="#ccc" />
        </View>
      )}
      
      <View style={styles.overlayContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{preschool.name}</Text>
          <View style={styles.ratingContainer}>
            <Rating 
              readonly
              startingValue={preschool.rating}
              imageSize={20}
              style={styles.rating}
            />
            <Text style={styles.ratingText}>
              {preschool.rating} ({preschool.reviewCount} reviews)
            </Text>
          </View>
          <Text style={styles.address}>{preschool.address}</Text>
        </View>
      </View>
    </View>
  );

  const renderActionButtons = () => (
    <View style={styles.actionButtonsContainer}>
      <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
        <Icon name="phone" type="material" size={24} color="#4a90e2" />
        <Text style={styles.actionButtonText}>Call</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.actionButton} onPress={handleOpenMap}>
        <Icon name="directions" type="material" size={24} color="#4a90e2" />
        <Text style={styles.actionButtonText}>Directions</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.actionButton} onPress={handleWebsite}>
        <Icon name="public" type="material" size={24} color="#4a90e2" />
        <Text style={styles.actionButtonText}>Website</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => navigation.navigate('WriteReview', { preschoolId: preschool.id })}
      >
        <Icon name="rate-review" type="material" size={24} color="#4a90e2" />
        <Text style={styles.actionButtonText}>Review</Text>
      </TouchableOpacity>
    </View>
  );

  const renderTabMenu = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
        onPress={() => setActiveTab('overview')}
      >
        <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
          Overview
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'reviews' && styles.activeTab]}
        onPress={() => setActiveTab('reviews')}
      >
        <Text style={[styles.tabText, activeTab === 'reviews' && styles.activeTabText]}>
          Reviews
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'photos' && styles.activeTab]}
        onPress={() => setActiveTab('photos')}
      >
        <Text style={[styles.tabText, activeTab === 'photos' && styles.activeTabText]}>
          Photos
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderOverviewTab = () => (
    <>
      <Card containerStyle={styles.sectionCard}>
        <Card.Title>About</Card.Title>
        <Card.Divider />
        <Text style={styles.description}>
          {showFullDescription 
            ? preschool.description 
            : `${preschool.description.substring(0, 150)}...`}
        </Text>
        {preschool.description.length > 150 && (
          <TouchableOpacity 
            style={styles.readMoreButton}
            onPress={() => setShowFullDescription(!showFullDescription)}
          >
            <Text style={styles.readMoreText}>
              {showFullDescription ? 'Read Less' : 'Read More'}
            </Text>
          </TouchableOpacity>
        )}
      </Card>

      <Card containerStyle={styles.sectionCard}>
        <Card.Title>Information</Card.Title>
        <Card.Divider />
        
        <View style={styles.infoRow}>
          <Icon name="schedule" type="material" size={20} color="#666" />
          <Text style={styles.infoLabel}>Hours:</Text>
          <Text style={styles.infoValue}>{preschool.hours || 'Not provided'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Icon name="attach-money" type="material" size={20} color="#666" />
          <Text style={styles.infoLabel}>Tuition:</Text>
          <Text style={styles.infoValue}>{preschool.tuition || 'Not provided'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Icon name="child-care" type="material" size={20} color="#666" />
          <Text style={styles.infoLabel}>Ages:</Text>
          <Text style={styles.infoValue}>{preschool.ageRange || 'Not provided'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Icon name="school" type="material" size={20} color="#666" />
          <Text style={styles.infoLabel}>Curriculum:</Text>
          <Text style={styles.infoValue}>{preschool.curriculum || 'Not provided'}</Text>
        </View>
      </Card>

      <Card containerStyle={styles.sectionCard}>
        <Card.Title>Location</Card.Title>
        <Card.Divider />
        
        {preschool.latitude && preschool.longitude ? (
          <View style={styles.mapContainer}>
            {renderMapPlaceholder()}
          </View>
        ) : (
          <Text style={styles.notAvailableText}>Map location not available</Text>
        )}
      </Card>
    </>
  );

  const renderReviewsTab = () => (
    <Card containerStyle={styles.sectionCard}>
      <Card.Title>Reviews</Card.Title>
      <Card.Divider />
      
      {preschool.reviews && preschool.reviews.length > 0 ? (
        preschool.reviews.map((review, index) => (
          <React.Fragment key={review.id || index}>
            <View style={styles.reviewContainer}>
              <View style={styles.reviewHeader}>
                <Icon
                  name="account-circle"
                  type="material"
                  size={40}
                  color="#ccc"
                />
                <View style={styles.reviewUserInfo}>
                  <Text style={styles.reviewUserName}>{review.userName}</Text>
                  <Text style={styles.reviewDate}>{review.date}</Text>
                </View>
                <Rating
                  readonly
                  startingValue={review.rating}
                  imageSize={16}
                />
              </View>
              
              <Text style={styles.reviewTitle}>{review.title}</Text>
              <Text style={styles.reviewContent}>{review.content}</Text>
              
              <View style={styles.reviewActions}>
                <TouchableOpacity style={styles.reviewAction}>
                  <Icon name="thumb-up" type="material" size={16} color="#666" />
                  <Text style={styles.reviewActionText}>{review.likes || 0}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.reviewAction}>
                  <Icon name="thumb-down" type="material" size={16} color="#666" />
                  <Text style={styles.reviewActionText}>{review.dislikes || 0}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.reviewAction}>
                  <Icon name="flag" type="material" size={16} color="#666" />
                  <Text style={styles.reviewActionText}>Report</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {index < preschool.reviews.length - 1 && <Divider style={styles.reviewDivider} />}
          </React.Fragment>
        ))
      ) : (
        <View style={styles.emptyReviewsContainer}>
          <Icon name="rate-review" type="material" size={60} color="#ccc" />
          <Text style={styles.emptyReviewsText}>No reviews yet</Text>
          <Button
            title="Be the first to review"
            buttonStyle={styles.writeReviewButton}
            onPress={() => navigation.navigate('WriteReview', { preschoolId: preschool.id })}
          />
        </View>
      )}
      
      {preschool.reviews && preschool.reviews.length > 0 && (
        <Button
          title="Write a Review"
          buttonStyle={styles.writeReviewButton}
          onPress={() => navigation.navigate('WriteReview', { preschoolId: preschool.id })}
        />
      )}
    </Card>
  );

  const renderPhotosTab = () => (
    <Card containerStyle={styles.sectionCard}>
      <Card.Title>Photos</Card.Title>
      <Card.Divider />
      
      {preschool.photos && preschool.photos.length > 0 ? (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.photosScrollContainer}
        >
          {preschool.photos.map((photo, index) => (
            <TouchableOpacity 
              key={index}
              onPress={() => {/* Open full photo viewer */}}
            >
              <Image 
                source={{ uri: photo.url }} 
                style={styles.photoThumbnail}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyPhotosContainer}>
          <Icon name="photo-library" type="material" size={60} color="#ccc" />
          <Text style={styles.emptyPhotosText}>No photos available</Text>
        </View>
      )}
    </Card>
  );

  const renderMapPlaceholder = () => (
    <View style={styles.mapPlaceholder}>
      <Icon name="map" type="material" size={50} color="#ccc" />
      <Text style={styles.mapPlaceholderText}>Map view temporarily unavailable</Text>
      <Button
        title="Get Directions"
        icon={
          <Icon
            name="directions"
            type="material"
            color="white"
            size={18}
            style={{ marginRight: 10 }}
          />
        }
        buttonStyle={styles.directionsButton}
        onPress={handleOpenMap}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {renderHeader()}
      {renderActionButtons()}
      {renderTabMenu()}
      
      {activeTab === 'overview' && renderOverviewTab()}
      {activeTab === 'reviews' && renderReviewsTab()}
      {activeTab === 'photos' && renderPhotosTab()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 15,
    marginBottom: 20,
    color: '#666',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#4a90e2',
    paddingHorizontal: 20,
  },
  headerContainer: {
    position: 'relative',
    height: 200,
  },
  headerImage: {
    width: '100%',
    height: 200,
  },
  placeholderImage: {
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 15,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  rating: {
    marginRight: 5,
  },
  ratingText: {
    color: 'white',
    fontSize: 14,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  address: {
    color: 'white',
    fontSize: 14,
    marginTop: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  actionButton: {
    alignItems: 'center',
  },
  actionButtonText: {
    marginTop: 5,
    fontSize: 12,
    color: '#4a90e2',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4a90e2',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#4a90e2',
    fontWeight: 'bold',
  },
  sectionCard: {
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 10,
    padding: 15,
  },
  description: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  readMoreButton: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  readMoreText: {
    color: '#4a90e2',
    fontSize: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
    width: 80,
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  mapContainer: {
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  directionsButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#4a90e2',
  },
  notAvailableText: {
    textAlign: 'center',
    color: '#666',
    padding: 20,
  },
  reviewContainer: {
    marginBottom: 15,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewUserInfo: {
    flex: 1,
    marginLeft: 10,
  },
  reviewUserName: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  reviewDate: {
    fontSize: 12,
    color: '#666',
  },
  reviewTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  reviewContent: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  reviewActions: {
    flexDirection: 'row',
    marginTop: 10,
  },
  reviewAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  reviewActionText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
  },
  reviewDivider: {
    marginVertical: 15,
  },
  emptyReviewsContainer: {
    alignItems: 'center',
    padding: 20,
  },
  emptyReviewsText: {
    marginTop: 10,
    marginBottom: 15,
    color: '#666',
  },
  writeReviewButton: {
    backgroundColor: '#4a90e2',
    marginTop: 15,
  },
  photosScrollContainer: {
    paddingVertical: 10,
  },
  photoThumbnail: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginRight: 10,
  },
  emptyPhotosContainer: {
    alignItems: 'center',
    padding: 20,
  },
  emptyPhotosText: {
    marginTop: 10,
    color: '#666',
  },
  mapPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  mapPlaceholderText: {
    marginTop: 10,
    color: '#666',
    textAlign: 'center',
  },
});

export default PreschoolDetailScreen; 