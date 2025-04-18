// Comment out AsyncStorage import until available in Expo Go
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAllPreschools, getPreschoolsNearLocation } from '../data';

class RecommendationService {
  constructor() {
    this.API_URL = 'https://api.example.com/recommendations';
    this.USE_MOCK_DATA = true; // Set to false when real API is available
  }

  async getRecommendations(userId, preferences = {}, limit = 5) {
    try {
      if (this.USE_MOCK_DATA) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Use data from our warehouse instead of hardcoded mock data
        const preschools = this.getMockPreschools();
        
        // Filter preschools based on preferences
        let filtered = [...preschools];
        
        // Filter by location if provided (would use actual distance calculation in real app)
        if (preferences.location) {
          // This is a simplistic filter - would use geolocation in a real app
          filtered = filtered.filter(p => 
            p.address.toLowerCase().includes(preferences.location.toLowerCase()) ||
            p.city.toLowerCase().includes(preferences.location.toLowerCase()) ||
            p.zip_code.includes(preferences.location)
          );
        }
        
        // Filter by minimum rating
        if (preferences.minRating) {
          filtered = filtered.filter(p => p.rating >= preferences.minRating);
        }
        
        // Filter by preferred curriculum
        if (preferences.curriculum) {
          filtered = filtered.filter(p => 
            p.curriculum && p.curriculum.toLowerCase().includes(preferences.curriculum.toLowerCase())
          );
        }
        
        // Sort by recommendation score (would be more sophisticated in real app)
        filtered.sort((a, b) => {
          // Sort by rating as a simple recommendation score
          return b.rating - a.rating;
        });
        
        // Add recommendation reasons
        const recommendations = filtered.slice(0, limit).map(preschool => ({
          ...preschool,
          matchReasons: this.generateMatchReasons(preschool, preferences)
        }));
        
        return recommendations;
      } else {
        const queryParams = new URLSearchParams();
        queryParams.append('userId', userId);
        queryParams.append('limit', limit.toString());
        
        // Add preferences to query params
        Object.entries(preferences).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });
        
        const response = await fetch(`${this.API_URL}?${queryParams.toString()}`, {
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
      console.error('Error getting recommendations:', error);
      throw error;
    }
  }
  
  async getFeaturedPreschools(limit = 3) {
    try {
      if (this.USE_MOCK_DATA) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 700));
        
        // Use data from our warehouse instead of hardcoded mock data
        const preschools = this.getMockPreschools();
        
        // Sort by rating and review count to find featured preschools
        const featured = [...preschools].sort((a, b) => {
          // Prioritize higher ratings and more reviews
          const aScore = a.rating * Math.log(a.reviewCount + 1);
          const bScore = b.rating * Math.log(b.reviewCount + 1);
          return bScore - aScore;
        });
        
        return featured.slice(0, limit);
      } else {
        const response = await fetch(`${this.API_URL}/featured?limit=${limit}`, {
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
      console.error('Error getting featured preschools:', error);
      throw error;
    }
  }
  
  async getNearbyPreschools(latitude, longitude, radius = 5, limit = 5) {
    try {
      if (this.USE_MOCK_DATA) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Use our warehouse data with distance calculation
        const preschools = getPreschoolsNearLocation(latitude, longitude, radius);
        return preschools.slice(0, limit);
      } else {
        const queryParams = new URLSearchParams();
        queryParams.append('lat', latitude.toString());
        queryParams.append('lng', longitude.toString());
        queryParams.append('radius', radius.toString());
        queryParams.append('limit', limit.toString());
        
        const response = await fetch(`${this.API_URL}/nearby?${queryParams.toString()}`, {
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
      console.error('Error getting nearby preschools:', error);
      throw error;
    }
  }
  
  generateMatchReasons(preschool, preferences) {
    const reasons = [];
    
    // Add reasons based on rating
    if (preschool.rating >= 4.5) {
      reasons.push('Top-rated preschool');
    } else if (preschool.rating >= 4.0) {
      reasons.push('Highly rated by parents');
    }
    
    // Add reason based on curriculum match
    if (preferences.curriculum && preschool.curriculum && 
        preschool.curriculum.toLowerCase().includes(preferences.curriculum.toLowerCase())) {
      reasons.push(`Offers ${preschool.curriculum} curriculum`);
    }
    
    // Add reason based on reviews
    if (preschool.reviewCount > 50) {
      reasons.push('Popular with many positive reviews');
    }
    
    // Add reason for CSPP program
    if (preschool.program_type === 'CSPP' || preschool.id.startsWith('CSPP_')) {
      reasons.push('California State Preschool Program');
    }
    
    // Add reason based on facilities or features
    if (preschool.features && preschool.features.length > 0) {
      const feature = preschool.features[0]; // Just pick the first feature for simplicity
      reasons.push(`Offers ${feature}`);
    }
    
    // Make sure we have at least one reason
    if (reasons.length === 0) {
      reasons.push('Matches your preferences');
    }
    
    return reasons;
  }
  
  async getAuthToken() {
    // In a real app, this would fetch from storage or context
    return 'mock-auth-token';
  }
  
  getMockPreschools() {
    // Try to get data from our warehouse first
    try {
      const warehouseData = getAllPreschools();
      
      // If we have data in the warehouse, use it
      if (warehouseData && warehouseData.length > 0) {
        console.log(`Using ${warehouseData.length} preschools from data warehouse`);
        return warehouseData;
      }
    } catch (error) {
      console.warn('Failed to load data from warehouse, falling back to mock data:', error);
    }
    
    // Fall back to hardcoded mock data if warehouse data is not available
    return [
      {
        id: 'p1',
        name: 'Sunshine Preschool',
        description: 'A nurturing environment where children learn through play and discovery. Our curriculum focuses on social-emotional development, early literacy, and STEM exploration.',
        address: '123 Main St, Palo Alto, CA 94301',
        phone: '(650) 555-1234',
        website: 'https://sunshinepreschool.example.com',
        rating: 4.7,
        reviewCount: 128,
        tuition: '$1,500-$1,800/month',
        hours: 'Monday-Friday: 7:30am-6:00pm',
        ageRange: '2-5 years',
        curriculum: 'Play-based, Montessori-inspired',
        images: [
          'https://example.com/images/sunshine1.jpg',
          'https://example.com/images/sunshine2.jpg',
          'https://example.com/images/sunshine3.jpg'
        ],
        features: [
          'Outdoor playground',
          'Organic meals included',
          'Multilingual staff',
          'Music and art programs'
        ],
        reviews: [
          {
            id: 'r1',
            userId: 'u1',
            userName: 'Jennifer K.',
            rating: 5,
            title: 'Excellent preschool with caring teachers',
            content: 'My daughter has been attending Sunshine for a year now and she loves it. The teachers are warm and attentive, and the facilities are clean and well-maintained.'
          }
        ]
      },
      {
        id: 'p2',
        name: 'Little Explorers Academy',
        description: 'An innovative preschool focused on project-based learning and outdoor education. We encourage children to explore, question, and discover through hands-on activities.',
        address: '456 Oak Ave, Menlo Park, CA 94025',
        phone: '(650) 555-5678',
        website: 'https://littleexplorers.example.com',
        rating: 4.5,
        reviewCount: 85,
        tuition: '$1,700-$2,000/month',
        hours: 'Monday-Friday: 8:00am-5:30pm',
        ageRange: '18 months-5 years',
        curriculum: 'Reggio Emilia, Project-based',
        images: [
          'https://example.com/images/explorers1.jpg',
          'https://example.com/images/explorers2.jpg',
          'https://example.com/images/explorers3.jpg'
        ],
        features: [
          'Nature-based learning',
          'Large outdoor space',
          'STEM curriculum',
          'Field trips'
        ],
        reviews: [
          {
            id: 'r2',
            userId: 'u2',
            userName: 'Michael T.',
            rating: 4,
            title: 'Great curriculum and outdoor activities',
            content: 'The project-based learning approach is fantastic. My son is always excited to tell me about what he did at school. The only downside is the limited parking during pickup times.'
          }
        ]
      },
      {
        id: 'p3',
        name: 'Montessori Garden',
        description: 'A true Montessori experience with certified teachers and a carefully prepared environment. Children progress at their own pace through individualized learning plans.',
        address: '789 Pine Ln, Palo Alto, CA 94303',
        phone: '(650) 555-9012',
        website: 'https://montessorigarden.example.com',
        rating: 4.8,
        reviewCount: 156,
        tuition: '$1,900-$2,200/month',
        hours: 'Monday-Friday: 7:00am-6:30pm',
        ageRange: '18 months-6 years',
        curriculum: 'Authentic Montessori',
        images: [
          'https://example.com/images/montessori1.jpg',
          'https://example.com/images/montessori2.jpg',
          'https://example.com/images/montessori3.jpg'
        ],
        features: [
          'AMI-certified teachers',
          'Montessori materials',
          'Mixed-age classrooms',
          'Foreign language instruction'
        ],
        reviews: [
          {
            id: 'r3',
            userId: 'u3',
            userName: 'Sarah L.',
            rating: 5,
            title: 'Outstanding Montessori program',
            content: 'The authentic Montessori approach has been wonderful for my child\'s development. Teachers are knowledgeable and caring. My only wish is that they had an elementary program as well!'
          }
        ]
      },
      {
        id: 'p4',
        name: 'Bright Horizons',
        description: 'A national chain with a strong local presence, offering balanced education for children with a focus on social development and kindergarten readiness.',
        address: '321 Maple Dr, Menlo Park, CA 94025',
        phone: '(650) 555-3456',
        website: 'https://brighthorizons.example.com',
        rating: 4.3,
        reviewCount: 210,
        tuition: '$1,600-$1,900/month',
        hours: 'Monday-Friday: 6:30am-7:00pm',
        ageRange: '6 weeks-5 years',
        curriculum: 'Balanced learning approach',
        images: [
          'https://example.com/images/horizons1.jpg',
          'https://example.com/images/horizons2.jpg',
          'https://example.com/images/horizons3.jpg'
        ],
        features: [
          'Extended hours',
          'Infant care available',
          'Summer programs',
          'Corporate partnerships'
        ],
        reviews: [
          {
            id: 'r4',
            userId: 'u4',
            userName: 'David R.',
            rating: 4,
            title: 'Reliable and convenient',
            content: 'As working parents, we appreciate the flexible hours and reliable care. The curriculum is solid and our daughter has made good progress with her letters and numbers.'
          }
        ]
      },
      {
        id: 'p5',
        name: 'Creative Kids Cooperative',
        description: 'A parent-participation preschool where families are actively involved in the classroom. Emphasizes creativity, community, and parent education.',
        address: '567 Willow Way, Palo Alto, CA 94306',
        phone: '(650) 555-7890',
        website: 'https://creativekidscoop.example.com',
        rating: 4.6,
        reviewCount: 72,
        tuition: '$900-$1,200/month',
        hours: 'Monday-Friday: 9:00am-1:00pm, Extended care until 3:00pm',
        ageRange: '2-5 years',
        curriculum: 'Play-based, Cooperative',
        images: [
          'https://example.com/images/creative1.jpg',
          'https://example.com/images/creative2.jpg',
          'https://example.com/images/creative3.jpg'
        ],
        features: [
          'Parent participation',
          'Lower tuition',
          'Strong community',
          'Art-focused curriculum'
        ],
        reviews: [
          {
            id: 'r5',
            userId: 'u5',
            userName: 'Emily W.',
            rating: 5,
            title: 'Wonderful community experience',
            content: 'The co-op model has been perfect for our family. I love being involved in the classroom and my son has thrived in this loving environment. The parent education nights are an added bonus.'
          }
        ]
      },
      {
        id: 'p6',
        name: 'Little Scholars Preparatory',
        description: 'An academically-focused preschool that prepares children for success in elementary school through structured learning activities and assessments.',
        address: '890 Cedar St, Menlo Park, CA 94025',
        phone: '(650) 555-2345',
        website: 'https://littlescholars.example.com',
        rating: 4.2,
        reviewCount: 95,
        tuition: '$2,000-$2,300/month',
        hours: 'Monday-Friday: 8:30am-5:00pm',
        ageRange: '3-5 years',
        curriculum: 'Academic, Structured',
        images: [
          'https://example.com/images/scholars1.jpg',
          'https://example.com/images/scholars2.jpg',
          'https://example.com/images/scholars3.jpg'
        ],
        features: [
          'Academic readiness focus',
          'Regular assessments',
          'Reading and math programs',
          'Computer lab'
        ],
        reviews: [
          {
            id: 'r6',
            userId: 'u6',
            userName: 'Robert M.',
            rating: 4,
            title: 'Strong academic foundation',
            content: 'If you\'re looking for a preschool that will prepare your child academically, this is it. Our son was reading basic words before kindergarten. The environment is more structured than other preschools, which worked well for our child.'
          }
        ]
      }
    ];
  }
}

export default RecommendationService; 