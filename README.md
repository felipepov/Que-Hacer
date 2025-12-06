# Que Hacer?

A modern web application that helps users discover activities when they're bored, integrating external APIs with cloud-based user data synchronization.

**Live Demo:** [https://que-hacer-01.web.app](https://que-hacer-01.web.app)

## Overview

Que Hacer? (What to Do?) is a single-page application that suggests random activities to users when they're feeling bored. The app integrates with the Bored API to fetch activity suggestions and allows users to save their favorite activities, create custom activities, and sync their preferences across devices using Firebase authentication.

## Features

- **Random Activity Generator**: Get instant activity suggestions from the Bored API
- **User Authentication**: Google OAuth integration via Firebase Authentication
- **Cloud Sync**: Save and sync favorite activities across devices using Firestore
- **Custom Activities**: Create and share your own activities with the community
- **Like System**: Like activities and track your favorites
- **Real-time Updates**: See community-contributed activities in real-time
- **Responsive Design**: Fully responsive UI built with Tailwind CSS
- **Progressive Web App**: Optimized for both desktop and mobile devices

## Technologies Used

### Frontend
- **JavaScript (ES6+)**: Modern JavaScript with ES6 modules, async/await, and classes
- **HTML5**: Semantic markup with accessibility considerations
- **CSS3**: Custom styling with Tailwind CSS utility framework
- **Webpack 4**: Module bundler with development and production configurations
- **PostCSS**: CSS processing with autoprefixer and precss

### Backend & Services
- **Firebase Authentication**: Google OAuth provider for user authentication
- **Cloud Firestore**: NoSQL database for user data and custom activities
- **Firebase Hosting**: Static site hosting with CDN distribution

### APIs
- **Bored API**: External REST API for activity suggestions ([bored-api.appbrewery.com](https://bored-api.appbrewery.com))

### Development Tools
- **Webpack Dev Server**: Hot module replacement for development
- **Firebase CLI**: Deployment and emulator tools
- **Git**: Version control

## Architecture

The application follows a modular architecture pattern:

```
src/
├── index.js           # Main application controller and event handlers
├── modules/           # Business logic modules
│   ├── Activity.js   # Activity data model and API integration
│   ├── AppActivity.js # Firestore operations for custom activities
│   └── Likes.js      # Local storage and like management
├── views/            # View layer components
│   ├── base.js       # DOM element references and utilities
│   ├── activityView.js # Activity rendering logic
│   └── likesView.js  # Likes list rendering
├── assets/           # SVG icons and images
├── styles.css        # Global styles and Tailwind imports
└── template.html     # HTML template with Firebase config
```

### Key Design Patterns
- **MVC-like Architecture**: Separation of concerns between models, views, and controllers
- **Module Pattern**: ES6 modules for code organization
- **Observer Pattern**: Firebase real-time listeners for data synchronization
- **State Management**: Centralized application state object

## Getting Started

### Prerequisites

- Node.js (v14 or higher recommended)
- npm or yarn package manager
- Firebase account and project setup

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/felipepov/Que-Hacer.git
   cd Que-Hacer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication with Google provider
   - Create a Firestore database
   - Copy your Firebase config to `src/template.html`

4. **Configure Firebase locally**
   ```bash
   npx firebase-tools login
   npx firebase-tools use your-project-id
   ```

### Development

Start the development server with hot reloading:

```bash
npm start
```

The application will open at `http://localhost:8080`

### Building for Production

Build optimized production bundle:

```bash
NODE_OPTIONS=--openssl-legacy-provider npm run build
```

The built files will be in the `dist/` directory.

### Deployment

Deploy to Firebase Hosting:

```bash
# Deploy hosting
npx firebase-tools deploy --only hosting

# Deploy Firestore rules (if updated)
npx firebase-tools deploy --only firestore:rules
```

## Security

- **Firestore Security Rules**: Implemented to protect user data
  - Users can only access their own user documents
  - Activities are publicly readable but only authenticated users can create
  - Field-level validation for activity updates
- **Firebase API Keys**: Public API keys are safe to expose (security handled by Firestore rules)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Design

The application features a modern, clean design with:
- Custom color palette optimized for readability
- Responsive grid layout using Tailwind CSS
- Smooth animations and transitions
- Mobile-first approach
- Accessible UI components

## Project Status

- Core functionality implemented
- User authentication and cloud sync
- Activity generation and favorites
- Custom activity creation
- Category filtering (planned)
- Activity search (planned)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License.

## Acknowledgments

- [Bored API](https://bored-api.appbrewery.com) for activity data
- [Firebase](https://firebase.google.com) for backend services
- [Tailwind CSS](https://tailwindcss.com) for styling framework


