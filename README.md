# Sports Team Management System
### Software Architecture Document
**Version:** 1.0.0 | **Date:** June 2026 | **Status:** Architecture Design

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Frontend Architecture](#2-frontend-architecture)
3. [Backend Architecture](#3-backend-architecture)
4. [Database Architecture](#4-database-architecture)
5. [API Design](#5-api-design)
6. [Security Architecture](#6-security-architecture)
7. [Deployment Architecture](#7-deployment-architecture)
8. [Scalability Considerations](#8-scalability-considerations)

---

## 1. System Overview

### 1.1 Purpose
A scalable Sports Team Management System designed for colleges and sports academies. It supports full lifecycle management of players, coaches, attendance, performance tracking, match management, and analytics — with a clear role-based access model.

### 1.2 Roles & Responsibilities

| Role | Access Level | Capabilities |
|------|-------------|--------------|
| **Coach (Admin)** | Full Access | Manage players, assign roles, view all analytics, configure teams, manage matches |
| **Captain** | Elevated Player | View team roster, mark attendance, submit performance notes, view team analytics |
| **Player** | Standard | View own profile, attendance, performance scores, match schedule, notifications |

### 1.3 Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Redux Toolkit, React Query |
| Backend | Spring Boot 3.x, Java 21 |
| Database | PostgreSQL 16 |
| Cache | Redis 7 |
| File Storage | AWS S3 |
| Containerization | Docker, Docker Compose |
| Auth | JWT (Access + Refresh Tokens) |
| API Style | RESTful |

---

## 2. Frontend Architecture

### 2.1 Folder Structure

```
frontend/
├── public/
│   └── assets/                    # Static assets, favicons
├── src/
│   ├── api/                       # Axios instances and API call definitions
│   │   ├── axiosClient.ts         # Base Axios config with interceptors
│   │   ├── authApi.ts
│   │   ├── playerApi.ts
│   │   ├── attendanceApi.ts
│   │   ├── performanceApi.ts
│   │   ├── matchApi.ts
│   │   ├── notificationApi.ts
│   │   └── analyticsApi.ts
│   │
│   ├── components/                # Reusable UI components
│   │   ├── common/
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Modal/
│   │   │   ├── Table/
│   │   │   ├── Badge/
│   │   │   ├── Avatar/
│   │   │   ├── Spinner/
│   │   │   └── Notification/
│   │   ├── forms/
│   │   │   ├── PlayerForm/
│   │   │   ├── AttendanceForm/
│   │   │   ├── MatchForm/
│   │   │   └── PerformanceForm/
│   │   ├── charts/
│   │   │   ├── PerformanceChart/
│   │   │   ├── AttendanceChart/
│   │   │   └── MatchStatsChart/
│   │   └── upload/
│   │       └── PhotoUploader/
│   │
│   ├── layouts/                   # Page layout wrappers
│   │   ├── MainLayout.tsx         # Sidebar + Topbar shell
│   │   ├── AuthLayout.tsx         # Centered auth pages layout
│   │   └── DashboardLayout.tsx    # Dashboard-specific layout
│   │
│   ├── pages/                     # Route-level page components
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   └── ForgotPasswordPage.tsx
│   │   ├── dashboard/
│   │   │   └── DashboardPage.tsx
│   │   ├── players/
│   │   │   ├── PlayerListPage.tsx
│   │   │   ├── PlayerDetailPage.tsx
│   │   │   └── PlayerProfilePage.tsx
│   │   ├── attendance/
│   │   │   ├── AttendanceMarkPage.tsx
│   │   │   └── AttendanceReportPage.tsx
│   │   ├── performance/
│   │   │   ├── PerformanceScoringPage.tsx
│   │   │   └── PerformanceHistoryPage.tsx
│   │   ├── matches/
│   │   │   ├── MatchListPage.tsx
│   │   │   └── MatchDetailPage.tsx
│   │   ├── analytics/
│   │   │   └── AnalyticsDashboardPage.tsx
│   │   ├── notifications/
│   │   │   └── NotificationsPage.tsx
│   │   └── profile/
│   │       └── ProfilePage.tsx
│   │
│   ├── store/                     # Redux Toolkit state management
│   │   ├── index.ts               # Store configuration
│   │   ├── slices/
│   │   │   ├── authSlice.ts       # Auth state (user, tokens, role)
│   │   │   ├── playerSlice.ts
│   │   │   ├── attendanceSlice.ts
│   │   │   ├── matchSlice.ts
│   │   │   └── notificationSlice.ts
│   │   └── middleware/
│   │       └── authMiddleware.ts
│   │
│   ├── hooks/                     # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useRole.ts
│   │   ├── useNotifications.ts
│   │   └── usePagination.ts
│   │
│   ├── guards/                    # Route protection
│   │   ├── PrivateRoute.tsx       # Blocks unauthenticated access
│   │   └── RoleGuard.tsx          # Blocks access by insufficient role
│   │
│   ├── utils/                     # Utility functions
│   │   ├── tokenUtils.ts          # JWT decode, expiry check
│   │   ├── dateUtils.ts
│   │   └── formatUtils.ts
│   │
│   ├── types/                     # TypeScript interfaces and types
│   │   ├── auth.types.ts
│   │   ├── player.types.ts
│   │   ├── attendance.types.ts
│   │   ├── match.types.ts
│   │   └── performance.types.ts
│   │
│   ├── constants/                 # App-wide constants
│   │   ├── roles.ts
│   │   ├── routes.ts
│   │   └── apiEndpoints.ts
│   │
│   ├── App.tsx                    # Root component with Router
│   └── main.tsx                   # React DOM entry point
│
├── .env.development
├── .env.production
├── vite.config.ts
└── tsconfig.json
```

### 2.2 Pages

| Page | Route | Accessible By |
|------|-------|--------------|
| Login | `/login` | Public |
| Forgot Password | `/forgot-password` | Public |
| Dashboard | `/dashboard` | All roles |
| Player List | `/players` | Coach, Captain |
| Player Detail | `/players/:id` | Coach, Captain |
| My Profile | `/profile` | All roles |
| Mark Attendance | `/attendance/mark` | Coach, Captain |
| Attendance Report | `/attendance/report` | Coach |
| Performance Scoring | `/performance/score` | Coach |
| Performance History | `/performance/history` | All roles |
| Match List | `/matches` | All roles |
| Match Detail | `/matches/:id` | All roles |
| Analytics Dashboard | `/analytics` | Coach, Captain |
| Notifications | `/notifications` | All roles |

### 2.3 Components

**Common Components**
- `Button` — variants: primary, secondary, danger, ghost
- `Input` — text, password, date, file
- `Modal` — confirmation, form, info
- `Table` — sortable, paginated, filterable
- `Badge` — role badge, status badge
- `Avatar` — player photo with fallback initials
- `Spinner` — loading states
- `Notification` — toast messages (success, error, warning)

**Form Components**
- `PlayerForm` — create/edit player with validation
- `AttendanceForm` — bulk attendance marking with date selector
- `MatchForm` — schedule/edit match
- `PerformanceForm` — score entry per player per match

**Chart Components** (powered by Recharts)
- `PerformanceChart` — line/bar chart of player scores over time
- `AttendanceChart` — pie/bar chart of attendance percentages
- `MatchStatsChart` — win/loss/draw breakdown

**Upload Component**
- `PhotoUploader` — drag-and-drop, preview, size/type validation, uploads to S3 via pre-signed URL

### 2.4 Layouts

| Layout | Purpose |
|--------|---------|
| `AuthLayout` | Centered card layout for login/forgot password |
| `MainLayout` | Persistent sidebar + top navigation bar shell |
| `DashboardLayout` | Grid-based layout for analytics and dashboard widgets |

### 2.5 State Management

**Redux Toolkit** is used for global app state. **React Query (TanStack Query)** is used for server state (data fetching, caching, invalidation).

```
Global State (Redux Toolkit)
├── auth          → current user, role, access token, refresh token expiry
├── notifications → unread count, notification list
├── players       → selected player context
└── ui            → sidebar open/close, theme

Server State (React Query)
├── Players       → useQuery, useMutation with cache invalidation
├── Attendance    → paginated queries
├── Performance   → per-player queries
├── Matches       → list + detail queries
└── Analytics     → dashboard aggregate queries
```

### 2.6 API Layer

All HTTP communication goes through a single Axios instance (`axiosClient.ts`) configured with:
- Base URL from environment variable
- Request interceptor — attaches `Authorization: Bearer <token>` header
- Response interceptor — handles 401 by attempting token refresh, then redirecting to login on failure
- Centralized error normalization

Each module has its own API file (e.g., `playerApi.ts`) that exports typed async functions calling the Axios client.

### 2.7 Route Protection

```
App Router
├── Public Routes
│   ├── /login
│   └── /forgot-password
│
└── Protected Routes (wrapped in <PrivateRoute>)
    ├── /dashboard              → All authenticated users
    ├── /profile                → All authenticated users
    ├── /notifications          → All authenticated users
    ├── /matches/*              → All authenticated users
    ├── /performance/history    → All authenticated users
    │
    ├── /players/*              → <RoleGuard roles={[COACH, CAPTAIN]}>
    ├── /attendance/mark        → <RoleGuard roles={[COACH, CAPTAIN]}>
    ├── /analytics              → <RoleGuard roles={[COACH, CAPTAIN]}>
    │
    ├── /attendance/report      → <RoleGuard roles={[COACH]}>
    └── /performance/score      → <RoleGuard roles={[COACH]}>
```

`PrivateRoute` checks for a valid access token in Redux state. If absent, redirects to `/login`.  
`RoleGuard` checks the user's role against allowed roles. If insufficient, renders a 403 forbidden page.

---

## 3. Backend Architecture

### 3.1 Folder Structure

```
backend/
└── src/
    └── main/
        ├── java/com/sportsmanagement/
        │   │
        │   ├── config/                        # Spring configuration classes
        │   │   ├── SecurityConfig.java        # Spring Security + JWT filter chain
        │   │   ├── CorsConfig.java
        │   │   ├── RedisConfig.java
        │   │   ├── S3Config.java
        │   │   └── OpenApiConfig.java         # Swagger/OpenAPI config
        │   │
        │   ├── controller/                    # REST controllers (HTTP layer)
        │   │   ├── AuthController.java
        │   │   ├── PlayerController.java
        │   │   ├── AttendanceController.java
        │   │   ├── PerformanceController.java
        │   │   ├── MatchController.java
        │   │   ├── AnalyticsController.java
        │   │   ├── NotificationController.java
        │   │   └── ProfileController.java
        │   │
        │   ├── service/                       # Business logic layer
        │   │   ├── AuthService.java
        │   │   ├── PlayerService.java
        │   │   ├── AttendanceService.java
        │   │   ├── PerformanceService.java
        │   │   ├── MatchService.java
        │   │   ├── AnalyticsService.java
        │   │   ├── NotificationService.java
        │   │   ├── ProfileService.java
        │   │   └── FileStorageService.java    # S3 upload logic
        │   │
        │   ├── repository/                    # Data access layer (Spring Data JPA)
        │   │   ├── UserRepository.java
        │   │   ├── PlayerRepository.java
        │   │   ├── AttendanceRepository.java
        │   │   ├── PerformanceRepository.java
        │   │   ├── MatchRepository.java
        │   │   ├── MatchPlayerRepository.java
        │   │   └── NotificationRepository.java
        │   │
        │   ├── entity/                        # JPA entities (DB table mappings)
        │   │   ├── User.java
        │   │   ├── Player.java
        │   │   ├── Team.java
        │   │   ├── Sport.java
        │   │   ├── College.java
        │   │   ├── Attendance.java
        │   │   ├── PerformanceScore.java
        │   │   ├── Match.java
        │   │   ├── MatchPlayer.java
        │   │   └── Notification.java
        │   │
        │   ├── dto/                           # Data Transfer Objects
        │   │   ├── request/
        │   │   │   ├── LoginRequest.java
        │   │   │   ├── RegisterRequest.java
        │   │   │   ├── AttendanceRequest.java
        │   │   │   ├── PerformanceRequest.java
        │   │   │   ├── MatchRequest.java
        │   │   │   └── PlayerUpdateRequest.java
        │   │   └── response/
        │   │       ├── AuthResponse.java
        │   │       ├── PlayerResponse.java
        │   │       ├── AttendanceResponse.java
        │   │       ├── PerformanceSummaryResponse.java
        │   │       ├── MatchResponse.java
        │   │       ├── AnalyticsDashboardResponse.java
        │   │       └── NotificationResponse.java
        │   │
        │   ├── validator/                     # Custom validation logic
        │   │   ├── AttendanceDateValidator.java
        │   │   └── PerformanceScoreValidator.java
        │   │
        │   ├── middleware/                    # Filters and interceptors
        │   │   ├── JwtAuthenticationFilter.java
        │   │   └── RateLimitingFilter.java
        │   │
        │   ├── exception/                     # Global exception handling
        │   │   ├── GlobalExceptionHandler.java
        │   │   ├── ResourceNotFoundException.java
        │   │   ├── UnauthorizedException.java
        │   │   └── ValidationException.java
        │   │
        │   ├── security/                      # Security utilities
        │   │   ├── JwtTokenProvider.java      # Token generation/validation
        │   │   ├── UserDetailsServiceImpl.java
        │   │   └── CustomAuthenticationProvider.java
        │   │
        │   ├── util/                          # Utility classes
        │   │   ├── DateUtils.java
        │   │   └── PaginationUtils.java
        │   │
        │   └── SportsManagementApplication.java
        │
        └── resources/
            ├── application.yml                # Default config
            ├── application-dev.yml
            ├── application-prod.yml
            └── db/migration/                  # Flyway SQL migrations
                ├── V1__create_users.sql
                ├── V2__create_players.sql
                ├── V3__create_attendance.sql
                └── ...
```

### 3.2 Controllers

Controllers are thin — they handle HTTP input/output only. No business logic.

| Controller | Responsibilities |
|-----------|-----------------|
| `AuthController` | Login, logout, refresh token, forgot/reset password |
| `PlayerController` | CRUD operations for players, photo upload endpoint |
| `AttendanceController` | Mark attendance (single/bulk), fetch attendance records |
| `PerformanceController` | Submit scores, fetch performance history |
| `MatchController` | Schedule match, update result, list matches |
| `AnalyticsController` | Aggregate dashboard data for coach/captain views |
| `NotificationController` | List, read, delete notifications |
| `ProfileController` | Get/update own profile, change password |

### 3.3 Services

Services contain all business logic and orchestrate repository calls.

| Service | Key Responsibilities |
|---------|---------------------|
| `AuthService` | Password hashing, JWT issuance, refresh token rotation, blacklisting via Redis |
| `PlayerService` | Player lifecycle, role assignment, search/filter |
| `AttendanceService` | Prevent duplicate entries per date, attendance percentage calculation |
| `PerformanceService` | Score validation, aggregate scoring per player/match |
| `MatchService` | Match scheduling, conflict checks, result recording |
| `AnalyticsService` | Complex aggregate queries, caching results in Redis |
| `NotificationService` | Event-driven notification creation and delivery |
| `FileStorageService` | Generate S3 pre-signed URLs, validate file type/size |

### 3.4 Repositories

All repositories extend `JpaRepository` or `JpaSpecificationExecutor` for dynamic filtering.

Custom query examples:
- `AttendanceRepository.findByPlayerAndDateBetween()`
- `PerformanceRepository.findTopPlayersByTeamAndSeason()`
- `MatchRepository.findUpcomingMatchesByTeam()`
- `NotificationRepository.findUnreadByUser()`

### 3.5 Middleware

| Middleware | Purpose |
|-----------|---------|
| `JwtAuthenticationFilter` | Extracts and validates JWT from `Authorization` header on every request |
| `RateLimitingFilter` | Enforces per-IP and per-user rate limits using Redis counters |

### 3.6 DTOs

DTOs decouple the API contract from the database schema.
- **Request DTOs** — validated with Bean Validation (`@NotNull`, `@Size`, `@Email`, etc.)
- **Response DTOs** — shaped specifically for each API consumer; entities are never exposed directly
- **MapStruct** is used for DTO ↔ Entity mapping to avoid manual boilerplate

### 3.7 Validators

| Validator | Rule |
|-----------|------|
| `AttendanceDateValidator` | Date cannot be in the future |
| `PerformanceScoreValidator` | Score must be within defined min/max range for the sport metric |

### 3.8 Authentication & Authorization Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         LOGIN FLOW                                  │
│                                                                     │
│  Client ──POST /auth/login──► AuthController                        │
│                                    │                                │
│                              AuthService                            │
│                                    │                                │
│                    ┌───────────────┼───────────────┐                │
│                    ▼               ▼               ▼                │
│             Load User       Verify Password   Check active          │
│             from DB         (BCrypt)          status                │
│                    │                                                │
│                    ▼                                                │
│             Generate Access Token (15 min) + Refresh Token (7d)     │
│             Store Refresh Token hash in Redis                       │
│                    │                                                │
│                    ▼                                                │
│             Return tokens + user info + role to client              │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATED REQUEST FLOW                       │
│                                                                     │
│  Client ──Request + Bearer Token──► JwtAuthenticationFilter         │
│                                           │                         │
│                              ┌────────────┼────────────┐            │
│                              ▼            ▼            ▼            │
│                        Validate      Check token   Extract          │
│                        signature     not in        userId           │
│                                      blacklist     + role           │
│                                           │                         │
│                                           ▼                         │
│                                  Set SecurityContext                │
│                                           │                         │
│                                           ▼                         │
│                              @PreAuthorize role check               │
│                              on Controller method                   │
│                                           │                         │
│                                           ▼                         │
│                                  Execute business logic             │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                     TOKEN REFRESH FLOW                              │
│                                                                     │
│  Client ──POST /auth/refresh + Refresh Token──►                     │
│                                                                     │
│  1. Validate refresh token signature                                │
│  2. Look up hash in Redis (verify not revoked)                      │
│  3. Issue new Access Token                                          │
│  4. Rotate Refresh Token (old one invalidated in Redis)             │
│  5. Return new token pair                                           │
└─────────────────────────────────────────────────────────────────────┘
```

**Role Hierarchy:**
```
COACH  ──────────────────────────────► Full system access
CAPTAIN ─────────────────────────────► Team management + own data
PLAYER  ─────────────────────────────► Own data only
```

Spring Security's `@PreAuthorize("hasRole('COACH')")` annotations are placed on controller methods to enforce role checks at the method level.

---

## 4. Database Architecture

### 4.1 ER Diagram Description

The database models a multi-college, multi-sport environment. The central entities are `users`, `players`, `teams`, and `sports`. Attendance and performance are recorded per player per session/match.

### 4.2 Tables

```
┌─────────────────────────────────────────────────────────────────────┐
│  TABLE: colleges                                                    │
├──────────────────┬──────────────────────────────────────────────────┤
│  id              │ UUID, PK                                         │
│  name            │ VARCHAR(255), NOT NULL                           │
│  city            │ VARCHAR(100)                                     │
│  state           │ VARCHAR(100)                                     │
│  created_at      │ TIMESTAMP                                        │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  TABLE: sports                                                      │
├──────────────────┬──────────────────────────────────────────────────┤
│  id              │ UUID, PK                                         │
│  name            │ VARCHAR(100), NOT NULL (Cricket, Football, etc.) │
│  max_players     │ INT                                              │
│  created_at      │ TIMESTAMP                                        │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  TABLE: teams                                                       │
├──────────────────┬──────────────────────────────────────────────────┤
│  id              │ UUID, PK                                         │
│  name            │ VARCHAR(255), NOT NULL                           │
│  college_id      │ UUID, FK → colleges.id                          │
│  sport_id        │ UUID, FK → sports.id                            │
│  season_year     │ INT                                              │
│  created_at      │ TIMESTAMP                                        │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  TABLE: users                                                       │
├──────────────────┬──────────────────────────────────────────────────┤
│  id              │ UUID, PK                                         │
│  email           │ VARCHAR(255), UNIQUE, NOT NULL                   │
│  password_hash   │ VARCHAR(255), NOT NULL                           │
│  role            │ ENUM('COACH','CAPTAIN','PLAYER'), NOT NULL       │
│  is_active       │ BOOLEAN, DEFAULT true                            │
│  college_id      │ UUID, FK → colleges.id                          │
│  created_at      │ TIMESTAMP                                        │
│  updated_at      │ TIMESTAMP                                        │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  TABLE: players                                                     │
├──────────────────┬──────────────────────────────────────────────────┤
│  id              │ UUID, PK                                         │
│  user_id         │ UUID, FK → users.id, UNIQUE                     │
│  team_id         │ UUID, FK → teams.id                             │
│  full_name       │ VARCHAR(255), NOT NULL                           │
│  date_of_birth   │ DATE                                             │
│  phone           │ VARCHAR(20)                                      │
│  position        │ VARCHAR(100) (e.g., Striker, Bowler)            │
│  jersey_number   │ INT                                              │
│  photo_url       │ VARCHAR(500)                                     │
│  bio             │ TEXT                                             │
│  is_captain      │ BOOLEAN, DEFAULT false                           │
│  joined_date     │ DATE                                             │
│  created_at      │ TIMESTAMP                                        │
│  updated_at      │ TIMESTAMP                                        │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  TABLE: attendance_sessions                                         │
├──────────────────┬──────────────────────────────────────────────────┤
│  id              │ UUID, PK                                         │
│  team_id         │ UUID, FK → teams.id                             │
│  session_date    │ DATE, NOT NULL                                   │
│  session_type    │ ENUM('PRACTICE','MATCH','TRAINING')              │
│  marked_by       │ UUID, FK → users.id                             │
│  created_at      │ TIMESTAMP                                        │
│  UNIQUE          │ (team_id, session_date, session_type)            │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  TABLE: attendance_records                                          │
├──────────────────┬──────────────────────────────────────────────────┤
│  id              │ UUID, PK                                         │
│  session_id      │ UUID, FK → attendance_sessions.id               │
│  player_id       │ UUID, FK → players.id                           │
│  status          │ ENUM('PRESENT','ABSENT','LATE','EXCUSED')        │
│  notes           │ TEXT                                             │
│  UNIQUE          │ (session_id, player_id)                          │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  TABLE: matches                                                     │
├──────────────────┬──────────────────────────────────────────────────┤
│  id              │ UUID, PK                                         │
│  team_id         │ UUID, FK → teams.id                             │
│  opponent_name   │ VARCHAR(255), NOT NULL                           │
│  match_date      │ TIMESTAMP, NOT NULL                              │
│  venue           │ VARCHAR(255)                                     │
│  match_type      │ ENUM('FRIENDLY','LEAGUE','TOURNAMENT')           │
│  status          │ ENUM('SCHEDULED','IN_PROGRESS','COMPLETED')      │
│  team_score      │ INT                                              │
│  opponent_score  │ INT                                              │
│  result          │ ENUM('WIN','LOSS','DRAW')                        │
│  notes           │ TEXT                                             │
│  created_by      │ UUID, FK → users.id                             │
│  created_at      │ TIMESTAMP                                        │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  TABLE: performance_scores                                          │
├──────────────────┬──────────────────────────────────────────────────┤
│  id              │ UUID, PK                                         │
│  player_id       │ UUID, FK → players.id                           │
│  match_id        │ UUID, FK → matches.id, NULLABLE                 │
│  session_id      │ UUID, FK → attendance_sessions.id, NULLABLE     │
│  metric_name     │ VARCHAR(100) (Goals, Wickets, Assists, etc.)     │
│  metric_value    │ DECIMAL(8,2)                                     │
│  scored_by       │ UUID, FK → users.id                             │
│  scored_at       │ TIMESTAMP                                        │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  TABLE: notifications                                               │
├──────────────────┬──────────────────────────────────────────────────┤
│  id              │ UUID, PK                                         │
│  recipient_id    │ UUID, FK → users.id                             │
│  title           │ VARCHAR(255), NOT NULL                           │
│  body            │ TEXT                                             │
│  type            │ ENUM('MATCH','ATTENDANCE','PERFORMANCE','SYSTEM')│
│  is_read         │ BOOLEAN, DEFAULT false                           │
│  reference_id    │ UUID (optional link to related entity)           │
│  created_at      │ TIMESTAMP                                        │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  TABLE: refresh_tokens  (alternative to Redis for persistence)      │
├──────────────────┬──────────────────────────────────────────────────┤
│  id              │ UUID, PK                                         │
│  user_id         │ UUID, FK → users.id                             │
│  token_hash      │ VARCHAR(255), NOT NULL                           │
│  expires_at      │ TIMESTAMP                                        │
│  is_revoked      │ BOOLEAN, DEFAULT false                           │
│  created_at      │ TIMESTAMP                                        │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.3 Relationships

```
colleges       ──1:N──► teams
colleges       ──1:N──► users
sports         ──1:N──► teams
teams          ──1:N──► players
teams          ──1:N──► attendance_sessions
teams          ──1:N──► matches
users          ──1:1──► players
players        ──1:N──► attendance_records
players        ──1:N──► performance_scores
attendance_sessions ──1:N──► attendance_records
matches        ──1:N──► performance_scores
users          ──1:N──► notifications
users          ──1:N──► refresh_tokens
```

### 4.4 Indexing Strategy

| Table | Index | Type | Reason |
|-------|-------|------|--------|
| `users` | `email` | UNIQUE B-Tree | Fast login lookup |
| `players` | `team_id` | B-Tree | Team roster queries |
| `players` | `user_id` | UNIQUE B-Tree | User → Player lookup |
| `attendance_records` | `(session_id, player_id)` | UNIQUE B-Tree | Duplicate prevention |
| `attendance_sessions` | `(team_id, session_date)` | B-Tree | Date-range attendance queries |
| `performance_scores` | `player_id` | B-Tree | Player performance history |
| `performance_scores` | `match_id` | B-Tree | Match performance lookup |
| `matches` | `(team_id, match_date)` | B-Tree | Upcoming match queries |
| `notifications` | `(recipient_id, is_read)` | B-Tree | Unread notification count |
| `refresh_tokens` | `user_id` | B-Tree | Token lookup on refresh |

---

## 5. API Design

All APIs follow REST conventions. Base URL: `/api/v1`  
All protected endpoints require: `Authorization: Bearer <access_token>`  
All responses use consistent envelope: `{ "success": true, "data": {...}, "message": "..." }`  
Pagination: `?page=0&size=20&sort=createdAt,desc`

---

### 5.1 Auth Module

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/auth/login` | Login with email + password | Public |
| POST | `/auth/logout` | Invalidate refresh token | Authenticated |
| POST | `/auth/refresh` | Refresh access token | Public (with refresh token) |
| POST | `/auth/forgot-password` | Send reset email | Public |
| POST | `/auth/reset-password` | Reset password with token | Public |
| POST | `/auth/change-password` | Change own password | Authenticated |

---

### 5.2 Players Module

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/players` | List all players (paginated, filterable) | Coach, Captain |
| POST | `/players` | Create new player | Coach |
| GET | `/players/{id}` | Get player detail | Coach, Captain |
| PUT | `/players/{id}` | Update player info | Coach |
| DELETE | `/players/{id}` | Deactivate player | Coach |
| POST | `/players/{id}/photo` | Upload player photo | Coach |
| GET | `/players/me` | Get own player profile | Player |
| PUT | `/players/me` | Update own profile | Player |
| PATCH | `/players/{id}/role` | Assign captain role | Coach |

---

### 5.3 Attendance Module

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/attendance/sessions` | Create attendance session | Coach, Captain |
| GET | `/attendance/sessions` | List sessions (by team, date range) | Coach, Captain |
| GET | `/attendance/sessions/{id}` | Get session detail with records | Coach, Captain |
| POST | `/attendance/sessions/{id}/mark` | Bulk mark attendance for session | Coach, Captain |
| PUT | `/attendance/records/{id}` | Update single attendance record | Coach |
| GET | `/attendance/players/{playerId}` | Player attendance history | Coach, Captain |
| GET | `/attendance/players/{playerId}/percentage` | Attendance % for player | All |
| GET | `/attendance/team/{teamId}/summary` | Team attendance summary | Coach, Captain |

---

### 5.4 Performance Module

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/performance/scores` | Submit performance scores | Coach |
| GET | `/performance/scores` | List scores (filterable) | Coach, Captain |
| GET | `/performance/players/{playerId}` | Player performance history | All |
| GET | `/performance/players/{playerId}/summary` | Aggregated score summary | All |
| PUT | `/performance/scores/{id}` | Update a score entry | Coach |
| DELETE | `/performance/scores/{id}` | Delete a score entry | Coach |
| GET | `/performance/team/{teamId}/leaderboard` | Team performance leaderboard | Coach, Captain |

---

### 5.5 Analytics Module

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/analytics/dashboard` | Dashboard summary cards | Coach, Captain |
| GET | `/analytics/attendance-trends` | Attendance trend over time | Coach, Captain |
| GET | `/analytics/performance-trends` | Performance trend for player/team | Coach, Captain |
| GET | `/analytics/match-stats` | Win/loss/draw breakdown | Coach, Captain |
| GET | `/analytics/top-performers` | Top N players by metric | Coach, Captain |
| GET | `/analytics/player/{playerId}/report` | Full player analytics report | Coach |

---

### 5.6 Matches Module

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/matches` | Schedule a new match | Coach |
| GET | `/matches` | List matches (filter by status, date) | All |
| GET | `/matches/{id}` | Get match detail | All |
| PUT | `/matches/{id}` | Update match info | Coach |
| DELETE | `/matches/{id}` | Cancel match | Coach |
| PATCH | `/matches/{id}/result` | Record match result | Coach |
| GET | `/matches/upcoming` | List upcoming matches | All |

---

### 5.7 Notifications Module

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/notifications` | List own notifications | Authenticated |
| GET | `/notifications/unread-count` | Get unread count | Authenticated |
| PATCH | `/notifications/{id}/read` | Mark notification as read | Authenticated |
| PATCH | `/notifications/read-all` | Mark all as read | Authenticated |
| DELETE | `/notifications/{id}` | Delete notification | Authenticated |
| POST | `/notifications/broadcast` | Send notification to team | Coach |

---

## 6. Security Architecture

### 6.1 JWT Authentication

- **Access Token:** Short-lived (15 minutes), signed with RS256 (asymmetric), contains `userId`, `role`, `collegeId`
- **Refresh Token:** Long-lived (7 days), stored as SHA-256 hash in Redis with TTL
- **Token Rotation:** Every refresh issues a new refresh token and invalidates the old one
- **Blacklisting:** On logout, access token JTI (JWT ID) is stored in Redis with remaining TTL to prevent reuse

### 6.2 Password Hashing

- **Algorithm:** BCrypt with cost factor 12
- **No plaintext storage:** Passwords are hashed at the service layer before any persistence
- **Reset flow:** Time-limited, single-use token (UUID) sent via email, hashed before storage

### 6.3 Role-Based Access Control (RBAC)

```
Permission Matrix:

Feature                    | COACH | CAPTAIN | PLAYER
---------------------------|-------|---------|-------
Create/Delete Players      |  ✓    |   ✗     |   ✗
Update All Players         |  ✓    |   ✗     |   ✗
View All Players           |  ✓    |   ✓     |   ✗
Update Own Profile         |  ✓    |   ✓     |   ✓
Mark Attendance            |  ✓    |   ✓     |   ✗
View Attendance Reports    |  ✓    |   ✓     |   ✗
View Own Attendance        |  ✓    |   ✓     |   ✓
Submit Performance Scores  |  ✓    |   ✗     |   ✗
View Performance Data      |  ✓    |   ✓     |   Own Only
Schedule Matches           |  ✓    |   ✗     |   ✗
View Matches               |  ✓    |   ✓     |   ✓
View Analytics Dashboard   |  ✓    |   ✓     |   ✗
Broadcast Notifications    |  ✓    |   ✗     |   ✗
```

Implementation: Spring Security `@PreAuthorize` annotations with method-level security enabled.

### 6.4 Rate Limiting

- **Implementation:** Redis-backed sliding window counter via `RateLimitingFilter`
- **Login endpoint:** Max 5 attempts per IP per 15 minutes (lockout on breach)
- **General API:** Max 100 requests per user per minute
- **Upload endpoint:** Max 10 uploads per user per hour
- **Response on breach:** HTTP 429 Too Many Requests with `Retry-After` header

### 6.5 File Upload Security

- **Allowed types:** JPEG, PNG, WEBP only (validated via MIME type + magic bytes, not just extension)
- **Max file size:** 5 MB per upload
- **Storage:** Files go directly to AWS S3 — never stored on application server
- **Flow:** Backend generates a pre-signed S3 upload URL (valid 5 minutes), client uploads directly to S3
- **Naming:** Files stored with UUID-based keys, never original filenames (prevents path traversal)
- **Access:** S3 bucket is private; read access via CloudFront signed URLs with expiry

### 6.6 Additional Security Measures

- **CORS:** Strict whitelist of allowed origins, configured per environment
- **HTTPS:** TLS 1.3 enforced; HTTP redirects to HTTPS
- **SQL Injection:** Prevented by JPA parameterized queries; no native string concatenation in queries
- **XSS:** React's JSX escapes output by default; additional Content Security Policy headers
- **CSRF:** Stateless JWT auth; CSRF tokens not required for API-only backend
- **Secrets Management:** Environment variables via AWS Secrets Manager in production; never in code
- **Dependency Scanning:** OWASP Dependency-Check in CI pipeline

---

## 7. Deployment Architecture

### 7.1 Infrastructure Overview

```
                          ┌─────────────────────────────────────────┐
                          │              INTERNET                   │
                          └────────────────┬────────────────────────┘
                                           │
                          ┌────────────────▼────────────────────────┐
                          │         CloudFront CDN                  │
                          │  (React Static Files + S3 Media)        │
                          └────────┬─────────────────────┬──────────┘
                                   │                     │
               ┌───────────────────▼──┐         ┌───────▼──────────────┐
               │   S3 Static Hosting  │         │   AWS S3 Media Bucket │
               │   (React Build)      │         │   (Player Photos)     │
               └──────────────────────┘         └──────────────────────┘
                                           │
                          ┌────────────────▼────────────────────────┐
                          │       Application Load Balancer          │
                          │          (HTTPS, SSL Termination)        │
                          └────────────────┬────────────────────────┘
                                           │
                    ┌──────────────────────▼──────────────────────┐
                    │              ECS / EKS Cluster               │
                    │  ┌──────────────┐    ┌──────────────┐       │
                    │  │ Spring Boot  │    │ Spring Boot  │       │
                    │  │ Container 1  │    │ Container 2  │  ...  │
                    │  └──────────────┘    └──────────────┘       │
                    └──────────────┬───────────────────────────────┘
                                   │
               ┌───────────────────┼───────────────────┐
               │                   │                   │
    ┌──────────▼──────┐  ┌────────▼────────┐  ┌───────▼─────────┐
    │  RDS PostgreSQL  │  │  ElastiCache    │  │  AWS SES        │
    │  (Primary +      │  │  Redis Cluster  │  │  (Email Notifs) │
    │   Read Replica)  │  │  (Cache + Rate  │  └─────────────────┘
    └──────────────────┘  │   Limiting)     │
                          └─────────────────┘
```

### 7.2 Docker Configuration

```
docker-compose.yml structure:

services:
  frontend:
    build: ./frontend
    Multi-stage Dockerfile:
      Stage 1 (builder): Node 20 Alpine → npm run build
      Stage 2 (serve): Nginx Alpine → serve /dist on port 80

  backend:
    build: ./backend
    Multi-stage Dockerfile:
      Stage 1 (builder): Maven → mvn package -DskipTests
      Stage 2 (runtime): Eclipse Temurin 21 JRE → run JAR

  postgres:
    image: postgres:16-alpine
    volume: postgres_data

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}
```

### 7.3 Environment Profiles

| Profile | Database | Redis | S3 | Email |
|---------|----------|-------|-----|-------|
| `dev` | Local Docker PostgreSQL | Local Docker Redis | LocalStack S3 | Mailtrap |
| `staging` | RDS PostgreSQL | ElastiCache | S3 (staging bucket) | SES sandbox |
| `prod` | RDS PostgreSQL (Multi-AZ) | ElastiCache (cluster) | S3 (prod bucket) | SES production |

### 7.4 CI/CD Pipeline (GitHub Actions)

```
On Pull Request:
  ├── Lint (ESLint + Checkstyle)
  ├── Unit Tests (Jest + JUnit)
  ├── Integration Tests
  ├── OWASP Dependency Check
  └── Docker Build Validation

On Merge to main:
  ├── All PR checks
  ├── Build Docker images
  ├── Push to ECR (Elastic Container Registry)
  ├── Deploy to Staging (ECS rolling update)
  └── Run smoke tests

On Release Tag:
  └── Deploy to Production (ECS blue/green deployment)
```

---

## 8. Scalability Considerations

### 8.1 Horizontal Scaling

The Spring Boot backend is **stateless** by design — JWT tokens carry all session state. This means any number of backend container instances can handle any request without sticky sessions. The Application Load Balancer distributes traffic across all instances using round-robin routing.

### 8.2 Multi-Tenancy (Multiple Colleges)

The database schema includes a `college_id` on both `users` and `teams`. Every data query is scoped to the authenticated user's college. This row-level tenancy pattern allows all colleges to share the same database while keeping data isolated. The `@PreAuthorize` layer enforces that users can only access data within their college.

For very large deployments, this can evolve to a **schema-per-tenant** or **database-per-tenant** model by routing queries to different schemas/databases based on `college_id`.

### 8.3 Multi-Sport Support

The `sports` and `teams` tables decouple sport type from all other entities. Performance metrics are stored as flexible `(metric_name, metric_value)` pairs rather than sport-specific columns. This means adding Basketball, Cricket, or any other sport requires only inserting a new row in the `sports` table — no schema changes needed.

### 8.4 Caching Strategy

```
Redis Cache Layers:

L1 - Authentication (TTL: matches token expiry)
  └── Refresh token hashes, JWT blacklist

L2 - Analytics (TTL: 10 minutes)
  └── Dashboard aggregates, leaderboards, trend data
  └── Invalidated on new score/match result entry

L3 - Frequent Lookups (TTL: 5 minutes)
  └── Team roster, college-sport mappings
```

### 8.5 Database Read Scaling

- **Read Replicas:** PostgreSQL read replica for all analytics and reporting queries
- **Connection Pooling:** HikariCP with optimized pool sizing per instance
- **Query Optimization:** All list endpoints paginated; N+1 queries prevented with JPA `@EntityGraph` or JPQL joins
- **Archival:** Historical attendance and performance data older than 2 years moved to a cold storage table

### 8.6 File Storage Scaling

AWS S3 scales infinitely. Photos are served via CloudFront (CDN) with edge caching, so player photo requests never hit the application server or origin S3 directly.

### 8.7 Notification Scaling

For large deployments (thousands of players), broadcast notifications are sent asynchronously using **Spring's @Async** with a thread pool. For very high volume (10K+ users), this can be upgraded to an **AWS SQS + SNS fan-out pattern** where the backend publishes a single message to SNS, and SNS fans out to all subscribed SQS queues for per-user processing.

### 8.8 Future Features Integration Path

**Face Recognition Attendance:**
- A new service `FaceRecognitionService` integrates with AWS Rekognition
- Player face vectors stored in a dedicated `face_embeddings` table
- Mobile app captures photo → sends to backend → backend calls Rekognition → marks attendance
- Existing attendance schema unchanged; only the marking mechanism changes

**AI-Based Performance Analysis:**
- `PerformanceAIService` calls a Python ML microservice (FastAPI) via internal REST
- ML service consumes `performance_scores` data via a read replica
- Results stored in a new `ai_insights` table
- Analytics dashboard gains a new `/analytics/ai-insights` endpoint
- No changes required to existing performance scoring flow

---

## Document Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | June 2026 | Architecture Team | Initial architecture document |

---

*This document is the single source of truth for the Sports Team Management System architecture. All implementation decisions should be validated against this document.*
