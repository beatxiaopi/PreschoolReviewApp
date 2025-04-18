# PreschoolReviewApp

A mobile application for searching, reviewing, and discovering preschools in California, with a focus on California State Preschool Programs (CSPP).

## Tech Stack Overview

### Frontend
- **React Native** - Core framework for building the mobile application
- **Expo** - Development platform for streamlining React Native development
- **React Navigation** - Navigation library with stack, tab, and drawer navigators
- **@rneui/themed** - UI component library based on React Native Elements
- **Ionicons** - Icon set for visual elements

### State Management
- **Redux** - Global state management
- **Redux Toolkit** - Utilities to simplify Redux development

### Data Management
- **ETL Pipeline** - Python-based extraction, transformation, and loading scripts
- **SQLite** - Lightweight database for storing preschool data
- **React Native AsyncStorage** - Local storage for user preferences and settings

### Data Sources
- **California State Preschool Program (CSPP)** - Primary data source
- **Geocoding** - Location data enrichment via Google Maps API

### Services
- **Recommendation Service** - Custom algorithm for personalized preschool recommendations
- **Preschool Service** - API for preschool data operations
- **Review Service** - Management of user reviews

## Architecture

### Mobile App Structure
```
src/
├── components/         # Reusable UI components
├── screens/            # App screens (PreschoolList, Detail, Settings, etc.)
├── navigation/         # Navigation configuration
├── redux/              # State management (actions, reducers, store)
├── services/           # API and business logic services
├── data/               # Data import and integration
├── utils/              # Helper functions and utilities
└── types/              # TypeScript type definitions
```

### ETL Pipeline Structure
```
data/
├── scripts/           # ETL scripts
│   ├── extract_cspp_data.py      # Extract data from CA preschool sources
│   ├── geocode_addresses.py      # Add geographic coordinates
│   ├── integrate_with_app.py     # Format data for the mobile app
│   └── run_etl.py               # Orchestration script
├── raw/               # Raw data storage
├── processed/         # Processed data files
└── logs/              # Log files from ETL processes
```

## Key Features

1. **Preschool Discovery**
   - Search by location, name, or features
   - Filter by rating, distance, or program type
   - Browse featured and recommended preschools

2. **Personalized Recommendations**
   - Based on user preferences and location
   - Customizable filtering options

3. **Detailed Preschool Profiles**
   - Comprehensive information (hours, curriculum, facilities)
   - Photo galleries
   - Rating and review system

4. **User Reviews**
   - Create, edit, and delete reviews
   - Rate different aspects (safety, curriculum, staff, etc.)
   - Like/dislike other reviews

5. **Favorites & Bookmarks**
   - Save preschools for later viewing
   - Compare multiple preschools

6. **Offline Capability**
   - Cache preschool data for offline browsing
   - Configurable cache settings

## Development Setup

### Prerequisites
- Node.js (v14+)
- npm or yarn
- Expo CLI
- Python 3.7+ (for ETL scripts)
- Python libraries: pandas, requests, sqlite3

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/PreschoolReviewApp.git
cd PreschoolReviewApp
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up the ETL pipeline (optional)
```bash
cd data
pip install -r requirements.txt
```

4. Start the development server
```bash
npx expo start
```

### Running the ETL Pipeline
```bash
cd data/scripts
python run_etl.py
```

## Configuration

The app uses several configuration files:
- `app.json` - Expo configuration
- `metro.config.js` - Metro bundler settings
- Data source settings in ETL scripts

## Deployment

### Expo Deployment
The app can be deployed using Expo's services:
```bash
npx expo publish
```

### Native Build
Generate native builds for iOS and Android:
```bash
npx expo build:ios
npx expo build:android
```

## Contributing

Please see the CONTRIBUTING.md file for guidelines on how to contribute to this project.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
