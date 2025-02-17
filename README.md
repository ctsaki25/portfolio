# Portfolio

A full-stack portfolio website built with React (Frontend) and Spring Boot (Backend).

## Technologies Used
- Frontend: React, TypeScript, i18n
- Backend: Spring Boot, Java
- Database: MongoDB
- Containerization: Docker

## Setup Options

### Option 1: Using Docker (Recommended)
The easiest way to run the project is using Docker:

```bash
docker compose up --build
```

This will:
- Build and start both frontend and backend services
- Enable hot-reload for the frontend (changes will reflect automatically)
- Note: Backend changes require rebuilding the container

### Option 2: Manual Setup

#### Frontend Setup
1. Install yarn (if not already installed):
```bash
npm install --global yarn
```

2. Navigate to frontend directory and install dependencies:
```bash
cd portfolio-fe
yarn
```

3. Create necessary environment files (see Environment Variables section)

4. Start the development server:
```bash
yarn dev
```

#### Backend Setup
1. Navigate to backend directory:
```bash
cd portfolio-be
```

2. Configure your MongoDB connection in application.properties

3. Run using Gradle:
```bash
./gradlew bootRun
```
Or use your IDE (IntelliJ IDEA recommended)

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:8080
```

### Backend (application.properties)
```
spring.data.mongodb.uri=your_mongodb_uri
```

## Development Guidelines

1. Always create a new branch for features/fixes
2. Follow the existing code style and conventions
3. Write meaningful commit messages
4. Test your changes before pushing

## Available Scripts

### Frontend
- `yarn dev`: Start development server
- `yarn build`: Build for production
- `yarn test`: Run tests

### Backend
- `./gradlew build`: Build the application
- `./gradlw test`: Run tests

## Project Structure
```
portfolio/
├── portfolio-fe/          # Frontend application
│   ├── public/           # Static files
│   ├── src/              # Source files
│   └── package.json      # Frontend dependencies
│
├── portfolio-be/          # Backend application
│   ├── src/              # Source files
│   └── build.gradle      # Backend dependencies
│
└── docker-compose.yml    # Docker configuration
```

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details
