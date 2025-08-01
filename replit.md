# Laboratory Information System (LIS)

## Overview

This is a comprehensive Laboratory Information System (LIS) built as a full-stack web application designed for modern medical laboratories. The system provides complete workflow management from patient registration through sample processing, test result management, quality control, and financial reporting. It features a React-based frontend with a Node.js/Express backend, utilizing PostgreSQL for data persistence and real-time WebSocket communications for live updates.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React 19** with TypeScript for type safety and modern component patterns
- **Vite** as the build tool for fast development and optimized production builds
- **Wouter** for lightweight client-side routing without the overhead of React Router
- **TanStack Query** for server state management, caching, and data synchronization
- **Zustand** for client-side state management with persistence capabilities
- **Tailwind CSS** with CSS variables for theming and responsive design
- **Shadcn/ui** component library built on Radix UI primitives for accessibility

### Backend Architecture
- **Express.js** server with TypeScript for robust API development
- **RESTful API design** with proper HTTP methods and status codes
- **WebSocket integration** using 'ws' library for real-time notifications and updates
- **Session-based authentication** with middleware for route protection
- **Modular route organization** separating concerns by domain (auth, patients, samples, etc.)

### Database Layer
- **Drizzle ORM** with PostgreSQL for type-safe database operations
- **Neon serverless PostgreSQL** for cloud-native database hosting
- **Schema-first approach** with shared TypeScript types between client and server
- **Migration system** using Drizzle Kit for database versioning

### State Management Strategy
- **Server state**: TanStack Query for API data with automatic caching and invalidation
- **Client state**: Zustand stores for UI state, user authentication, and temporary data
- **Persistent state**: LocalStorage integration for user preferences and session data
- **Real-time updates**: WebSocket integration with state stores for live data synchronization

### Authentication & Authorization
- **Session-based authentication** with secure cookie handling
- **Role-based access control** supporting multiple user types (admin, technician, receptionist, doctor, lab_manager)
- **Route protection** at both frontend and backend levels
- **Password hashing** using bcrypt for secure credential storage

### Component Architecture
- **Compound component patterns** for complex UI elements
- **Custom hooks** for business logic abstraction and reusability
- **Shared TypeScript interfaces** between frontend and backend
- **Responsive design** with mobile-first approach using Tailwind breakpoints

## External Dependencies

### Core Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting with automatic scaling
- **WebSocket Server**: Real-time communication for live updates and notifications

### Development Tools
- **Vite**: Modern build tool with HMR for fast development cycles
- **TypeScript**: Static type checking across the entire application stack
- **Drizzle Kit**: Database migration and schema management tools
- **ESBuild**: Fast JavaScript bundler for production builds

### UI & Styling
- **Radix UI**: Accessible component primitives for complex UI elements
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Lucide React**: Consistent icon library with React components
- **Recharts**: React charting library for data visualization

### Authentication & Security
- **bcryptjs**: Password hashing for secure user credential storage
- **connect-pg-simple**: PostgreSQL session store for Express sessions

### Form Management & Validation
- **React Hook Form**: Performant form library with minimal re-renders
- **Zod**: TypeScript-first schema validation library
- **@hookform/resolvers**: Integration between React Hook Form and Zod

### Data Fetching & State
- **TanStack Query**: Powerful data synchronization for React applications
- **Zustand**: Lightweight state management with TypeScript support

### Utilities & Helpers
- **date-fns**: Modern date utility library for formatting and manipulation
- **clsx**: Utility for constructing className strings conditionally
- **nanoid**: URL-safe unique string ID generator