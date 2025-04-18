// Comment out AsyncStorage import until available in Expo Go
// import AsyncStorage from '@react-native-async-storage/async-storage';

class PreschoolService {
  constructor() {
    this.API_URL = 'https://api.example.com/preschools';
    this.USE_MOCK_DATA = true; // Set to false when real API is available
    this.recommendationService = null; // Will be set by dependency injection
    this.favorites = []; // In-memory storage for favorites (temporary)
  }
  
  setRecommendationService(service) {
    this.recommendationService = service;
  }
  
  async getPreschoolDetails(preschoolId) {
    try {
      if (this.USE_MOCK_DATA) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        if (!this.recommendationService) {
          throw new Error('RecommendationService not set. Call setRecommendationService first.');
        }
        
        const allPreschools = this.recommendationService.getMockPreschools();
        const preschool = allPreschools.find(p => p.id === preschoolId);
        
        if (!preschool) {
          throw new Error(`Preschool with ID ${preschoolId} not found`);
        }
        
        return preschool;
      } else {
        const response = await fetch(`${this.API_URL}/${preschoolId}`, {
          headers: {
            'Authorization': `Bearer ${await this.getAuthToken()}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        return await response.json();
      }
    } catch (error) {
      console.error('Error getting preschool details:', error);
      throw error;
    }
  }
  
  async searchPreschools(query, filters = {}, page = 1, limit = 10) {
    try {
      if (this.USE_MOCK_DATA) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        if (!this.recommendationService) {
          throw new Error('RecommendationService not set. Call setRecommendationService first.');
        }
        
        const allPreschools = this.recommendationService.getMockPreschools();
        
        // Filter by search query
        let filtered = [...allPreschools];
        
        if (query) {
          const lowerQuery = query.toLowerCase();
          filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(lowerQuery) || 
            p.description.toLowerCase().includes(lowerQuery) ||
            p.address.toLowerCase().includes(lowerQuery) ||
            (p.curriculum && p.curriculum.toLowerCase().includes(lowerQuery))
          );
        }
        
        // Apply filters
        if (filters.minRating) {
          filtered = filtered.filter(p => p.rating >= filters.minRating);
        }
        
        if (filters.ageRange) {
          filtered = filtered.filter(p => p.ageRange && p.ageRange.includes(filters.ageRange));
        }
        
        if (filters.curriculum) {
          filtered = filtered.filter(p => 
            p.curriculum && p.curriculum.toLowerCase().includes(filters.curriculum.toLowerCase())
          );
        }
        
        if (filters.priceRange) {
          // This would be more sophisticated in a real app
          // For now we're just checking if the price string contains the filter value
          filtered = filtered.filter(p => 
            p.tuition && p.tuition.includes(filters.priceRange)
          );
        }
        
        // Calculate pagination
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedResults = filtered.slice(startIndex, endIndex);
        
        return {
          results: paginatedResults,
          totalCount: filtered.length,
          page,
          totalPages: Math.ceil(filtered.length / limit)
        };
      } else {
        const queryParams = new URLSearchParams();
        queryParams.append('q', query || '');
        queryParams.append('page', page.toString());
        queryParams.append('limit', limit.toString());
        
        // Add filters to query params
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });
        
        const response = await fetch(`${this.API_URL}/search?${queryParams.toString()}`, {
          headers: {
            'Authorization': `Bearer ${await this.getAuthToken()}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        return await response.json();
      }
    } catch (error) {
      console.error('Error searching preschools:', error);
      throw error;
    }
  }
  
  async savePreschoolToFavorites(preschoolId) {
    try {
      if (this.USE_MOCK_DATA) {
        // Mock implementation
        console.log(`Saving preschool ${preschoolId} to favorites`);
        
        // In a real implementation, this would use AsyncStorage
        // await AsyncStorage.setItem('favorites', JSON.stringify([...currentFavorites, preschoolId]));
        
        // For now, we'll just log it
        return true;
      } else {
        const response = await fetch(`${this.API_URL}/favorites`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await this.getAuthToken()}`
          },
          body: JSON.stringify({ preschoolId })
        });
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        return await response.json();
      }
    } catch (error) {
      console.error('Error saving preschool to favorites:', error);
      throw error;
    }
  }
  
  async removePreschoolFromFavorites(preschoolId) {
    try {
      if (this.USE_MOCK_DATA) {
        // Mock implementation
        console.log(`Removing preschool ${preschoolId} from favorites`);
        
        // In a real implementation, this would use AsyncStorage
        // await AsyncStorage.setItem('favorites', JSON.stringify(currentFavorites.filter(id => id !== preschoolId)));
        
        // For now, we'll just log it
        return true;
      } else {
        const response = await fetch(`${this.API_URL}/favorites/${preschoolId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${await this.getAuthToken()}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        return true;
      }
    } catch (error) {
      console.error('Error removing preschool from favorites:', error);
      throw error;
    }
  }
  
  async getFavoritePreschools() {
    try {
      if (this.USE_MOCK_DATA) {
        // Mock implementation - return first 3 mock preschools as favorites
        const preschools = this.recommendationService.getMockPreschools();
        return preschools.slice(0, 3);
      } else {
        const response = await fetch(`${this.API_URL}/favorites`, {
          headers: {
            'Authorization': `Bearer ${await this.getAuthToken()}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        return await response.json();
      }
    } catch (error) {
      console.error('Error getting favorite preschools:', error);
      throw error;
    }
  }
  
  async isFavorite(preschoolId) {
    try {
      if (this.USE_MOCK_DATA) {
        // Mock implementation - randomly return true or false
        return Math.random() > 0.5;
      } else {
        const response = await fetch(`${this.API_URL}/favorites/${preschoolId}`, {
          headers: {
            'Authorization': `Bearer ${await this.getAuthToken()}`
          }
        });
        
        if (response.status === 404) {
          return false;
        }
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        return true;
      }
    } catch (error) {
      console.error('Error checking if preschool is favorite:', error);
      throw error;
    }
  }
  
  async getAuthToken() {
    // In a real app, this would fetch from storage or context
    return 'mock-auth-token';
  }
}

export default PreschoolService; 