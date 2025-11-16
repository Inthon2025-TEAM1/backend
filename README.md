# InThon Backend

A NestJS-based backend API server for an educational platform that supports students, parents, and administrators.

## 📋 Project Overview

This backend provides RESTful APIs for an educational platform with features including:
- User authentication and authorization (Firebase-based)
- Quiz management and tracking
- Reward and candy transaction system
- Payment processing
- Mentoring application system
- AI-powered learning analysis
- Admin dashboard functionality

## 🚀 Tech Stack

### Core Framework
- **NestJS 10.0.0** - Progressive Node.js framework
- **TypeScript 5.1.3** - Type-safe JavaScript
- **Express** - HTTP server (via @nestjs/platform-express)

### Database
- **TypeORM 0.3.27** - Object-Relational Mapping
- **MySQL2 3.15.3** - MySQL/MariaDB driver
- **MariaDB/MySQL** - Relational database

### Authentication & Security
- **Firebase Admin SDK 13.6.0** - Server-side Firebase authentication
- **class-validator 0.14.2** - DTO validation
- **class-transformer 0.5.1** - Object transformation

### Additional Libraries
- **OpenAI 6.9.0** - AI-powered learning analysis
- **date-fns 4.1.0** - Date utility library
- **@nestjs/config 4.0.2** - Configuration management

### Development Tools
- **Jest 29.5.0** - Testing framework
- **ESLint** - Code linting
- **Prettier 3.0.0** - Code formatting
- **Supertest 7.0.0** - HTTP assertion library

## 📁 Project Structure

```
backend/
├── src/
│   ├── admin/              # Admin module
│   │   ├── admin.controller.ts
│   │   └── admin.module.ts
│   ├── ai/                 # AI analysis module
│   │   ├── ai.controller.ts
│   │   ├── ai.service.ts
│   │   ├── ai.entity.ts
│   │   └── ai.module.ts
│   ├── auth/               # Authentication module
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── decorators/
│   │   │   └── current-user.decorator.ts
│   │   ├── dto/
│   │   │   ├── create-user.req.dto.ts
│   │   │   └── create-user.res.dto.ts
│   │   ├── firebase/
│   │   │   ├── firebase-auth.guard.ts
│   │   │   └── firebase.module.ts
│   │   ├── guards/
│   │   │   └── subscription.guard.ts
│   │   └── interceptor/
│   │       └── auth.interceptor.ts
│   ├── candy-transaction/  # Candy transaction module
│   │   ├── candy-transaction.controller.ts
│   │   ├── candy-transaction.service.ts
│   │   ├── candy-transaction.entity.ts
│   │   └── candy-transaction.module.ts
│   ├── mentoring/          # Mentoring module
│   │   ├── mentoring.controller.ts
│   │   ├── mentoring.service.ts
│   │   ├── mentoring.dto.ts
│   │   ├── mentor.entity.ts
│   │   ├── mentoring-request.entity.ts
│   │   └── mentoring.module.ts
│   ├── payment/            # Payment module
│   │   ├── payment.controller.ts
│   │   ├── payment.service.ts
│   │   ├── payment.dto.ts
│   │   ├── payment.entity.ts
│   │   └── payment.module.ts
│   ├── quiz/               # Quiz module
│   │   ├── quiz.controller.ts
│   │   ├── quiz.service.ts
│   │   ├── quiz.dto.ts
│   │   ├── quiz-question.entity.ts
│   │   ├── quiz-attempt.entity.ts
│   │   ├── chapter.entity.ts
│   │   └── quiz.module.ts
│   ├── reward/             # Reward module
│   │   ├── reward.controller.ts
│   │   ├── reward.service.ts
│   │   ├── reward.entity.ts
│   │   └── reward.module.ts
│   ├── user/               # User module
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   ├── user.entity.ts
│   │   └── user.module.ts
│   ├── util/              # Utility functions
│   │   └── candy.util.ts
│   ├── types/              # Type definitions
│   │   └── express.d.ts
│   ├── app.module.ts       # Root module
│   ├── app.controller.ts
│   ├── app.service.ts
│   └── main.ts             # Application entry point
├── test/                   # E2E tests
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── dist/                   # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
├── tsconfig.build.json
└── nest-cli.json
```

## 🎯 Core Modules

### Authentication (`auth`)
- Firebase token verification
- User registration and login
- Role-based access control
- Custom guards and interceptors

### User Management (`user`)
- User profile management
- Role assignment (Student, Parent, Admin)
- Candy balance management
- Child account management (for parents)
- Purchase history tracking
- Reward history retrieval
- User data retrieval

### Quiz System (`quiz`)
- Quiz question management
- Chapter-based organization
- Quiz attempt tracking
- Chapter completion status
- Unsolved questions tracking
- Grade and subject filtering
- Subscription-based access control

### Rewards & Transactions (`reward`, `candy-transaction`)
- Reward management
- Candy spending functionality
- Transaction tracking
- Balance updates

### Payment (`payment`)
- Payment processing
- Payment history
- Subscription management

### Mentoring (`mentoring`)
- Mentoring request creation
- Mentor management
- Application status tracking

### AI Analysis (`ai`)
- Learning weakness analysis
- AI-powered insights using OpenAI
- Report generation

### Admin (`admin`)
- Quiz creation
- User management
- Payment approval
- Mentoring request management
- System administration

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- MySQL/MariaDB database
- Firebase Admin SDK credentials

### Installation

```bash
# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the backend root directory:

```env
# Server Configuration
PORT=3000

# Database Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USERNAME=your_username
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=your_database

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email

# OpenAI (for AI analysis)
OPENAI_API_KEY=your_openai_api_key
```

### Database Setup

1. Create a MySQL/MariaDB database
2. Update the `.env` file with your database credentials
3. The application will automatically create tables on first run (synchronize: true in development)

**⚠️ Warning**: Set `synchronize: false` in production and use migrations instead.

### Running the Application

```bash
# Development mode (with hot reload)
npm run start:dev

# Production mode
npm run start:prod

# Debug mode
npm run start:debug

# Standard start
npm run start
```

The server will run on `http://localhost:3000` (or the port specified in `.env`).

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

## 📝 Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format
```

## 🔧 Development Configuration

### CORS Configuration

The application is configured to accept requests from the frontend:

```typescript
// main.ts
app.enableCors({
  origin: ['https://frontend-mu-gules-72.vercel.app/'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});
```

### Database Configuration

TypeORM is configured with the following settings:

```typescript
TypeOrmModule.forRoot({
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT),
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: [/* ... */],
  synchronize: true, // false in production
  charset: 'utf8mb4', // Emoji support
})
```

## 📚 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `GET /auth/login` - Login (Firebase token required)

### User Management
- `GET /user/me` - Get current user info
- `GET /user/role` - Get user role
- `POST /user/set-role` - Set user role (body: `{ role }`)
- `GET /user/candy` - Get candy balance
- `POST /user/spend-candy` - Spend candy (body: `{ amount, itemName }`)
- `GET /user/purchase-history` - Get purchase history
- `GET /user/rewards?month={YYYY-MM}` - Get child rewards (optional month query parameter)
- `GET /user/children` - Get children (for parents)
- `POST /user/children` - Add child (body: `{ childEmail }`)
- `DELETE /user/children/:childId` - Remove child
- `GET /user/children-count` - Get children count
- `GET /user/reward-candy-history` - Get reward candy history

### Quiz
- `GET /quiz?chapterId={id}&grade={grade}&subject={subject}&schoolLevel={level}&quizId={id}` - Get quiz questions (requires subscription)
- `GET /quiz/unsolved?chapterId={id}` - Get unsolved questions by chapter
- `GET /quiz/chapters?gradeLevel={level}` - Get available chapters by grade level
- `GET /quiz/status?chapterId={id}` - Get chapter completion status
- `POST /quiz/submit` - Submit quiz attempt (requires subscription, body: `{ quizId, answer }`)
- `GET /quiz/attempts` - Get quiz attempt history

### Rewards & Candy
- `GET /reward` - Get available rewards
- `POST /candy/spend` - Spend candy on items (body: `{ amount, itemName }`)

### Payment
- `POST /payment/create` - Create payment (body: `{ payment: { amount, depositorName, startAt?, endAt? } }`)

### Mentoring
- `POST /mentoring/applications` - Create mentoring request (body: `{ childId, title, childName, childAge, requirement }`)
- `GET /mentoring/applications` - Get mentoring requests
- `GET /mentoring/applications/:id` - Get specific request
- `DELETE /mentoring/applications/:id` - Cancel request
- `PATCH /mentoring/applications/:id/status` - Update request status (body: `{ status, mentorName? }`)

### AI Analysis
- `GET /ai/analyze-weakness?childId={id}&forceRefresh={true|false}` - Analyze learning weaknesses (optional childId for parents, optional forceRefresh to bypass cache)

### Admin
- `POST /admin/create-quiz` - Create quiz (body: `{ quizs: [...] }`)
- `POST /admin/increment-candy` - Increment user candy (body: `{ userId, amount }`)
- `GET /admin/get-all-users` - Get all users
- `GET /admin/get-all-quizzes` - Get all quiz attempts
- `POST /admin/create-mentor-mockup` - Create mentor mockup
- `PATCH /admin/:id/approve` - Approve payment (paymentId as path parameter)
- `GET /admin/pending-payments` - Get pending payments
- `GET /admin/pending` - Get pending mentoring requests
- `PATCH /admin/:id/status` - Update mentoring request status (body: `{ status }`, id as path parameter)

## 🔐 Authentication

The API uses Firebase Authentication for securing endpoints:

1. Client sends Firebase ID token in the `Authorization` header
2. `FirebaseAuthGuard` verifies the token using Firebase Admin SDK
3. `UserLoadInterceptor` loads user data from the database
4. `@CurrentUserId()` and `@CurrentDbUser()` decorators provide user context

### Example Request

```bash
curl -X GET http://localhost:3000/user/me \
  -H "Authorization: Bearer <firebase_id_token>"
```

## 🏗️ Architecture Patterns

### Module Structure
- Each feature is organized as a NestJS module
- Modules contain controllers, services, entities, and DTOs
- Dependency injection for loose coupling

### Guards
- `FirebaseAuthGuard`: Verifies Firebase authentication
- `SubscriptionGuard`: Checks user subscription status

### Interceptors
- `UserLoadInterceptor`: Automatically loads user data from database

### Decorators
- `@CurrentUserId()`: Get current user ID
- `@CurrentDbUser()`: Get current user entity

## 📦 Build

```bash
# Build for production
npm run build

# Output will be in dist/ directory
```

## 🚀 Deployment

1. Set environment variables in your production environment
2. Build the application: `npm run build`
3. Run the production build: `npm run start:prod`
4. Ensure database migrations are applied
5. Set `synchronize: false` in production

## 🔍 Database Entities

- **User**: User accounts and profiles
- **QuizQuestion**: Quiz questions
- **QuizAttempt**: User quiz attempts
- **Chapter**: Quiz chapters
- **Payment**: Payment records
- **MentoringRequest**: Mentoring applications
- **Mentor**: Mentor information
- **Reward**: Available rewards
- **CandyTransaction**: Candy transaction history
- **Report**: AI-generated learning reports

## 🤝 Contributing

When contributing to this project:

1. Follow NestJS best practices
2. Write unit tests for new features
3. Use DTOs for request/response validation
4. Follow the existing code structure
5. Update documentation as needed

## 📄 License

This project is private and proprietary.

---

## NestJS Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
