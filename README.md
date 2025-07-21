# Breus - Professional Diving Management System

## Overview

Breus is a comprehensive professional diving management system specifically designed for the salmon farming industry. It provides a complete solution for managing diving operations, crew coordination, digital documentation, and safety compliance in aquaculture environments.

## Main Features

### 🤿 Immersion Management
- Complete diving operation planning and execution
- Real-time dive monitoring and safety protocols
- Digital dive logs with automatic data capture
- Equipment tracking and maintenance schedules

### 📋 Digital Documentation
- Paperless operation reports and forms
- Digital signatures for legal compliance
- Automated report generation and distribution
- Document version control and audit trails

### 👥 Crew Management
- Diver certification and qualification tracking
- Team assignment and scheduling
- Performance monitoring and analytics
- Training record management

### 🔐 Digital Signatures
- Legally compliant electronic signatures
- Multi-party approval workflows
- Tamper-proof document integrity
- Audit trail for all signed documents

### 📊 Advanced Reports
- Comprehensive operational analytics
- Safety compliance reporting
- Performance metrics and KPIs
- Customizable dashboard views

## Modular Architecture

Breus is built with a flexible modular system that allows organizations to activate only the features they need:

### Core Modules
- **Core Immersions**: Essential diving operation management
- **Planning Operations**: Advanced operation planning and scheduling
- **Maintenance Networks**: Equipment and infrastructure maintenance
- **Advanced Reporting**: Comprehensive analytics and reporting
- **External Integrations**: Third-party system connections

### Module Activation
The system supports different activation contexts:
- **Salmon Farm Context**: Full operational capabilities
- **Contractor Context**: Focused on service delivery
- **Minimal Setup**: Core functionality only
- **Enterprise Setup**: All modules activated

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **Styling**: Tailwind CSS with shadcn/ui components
- **Forms**: React Hook Form with Zod validation
- **State Management**: React Query for server state
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Authentication**: Supabase Auth with role-based access
- **Real-time**: Supabase Realtime subscriptions

## Installation and Development

### Prerequisites
- Node.js 18+ and npm
- Git for version control

### Setup Instructions

```bash
# Clone the repository
git clone https://github.com/robvandam12/breus.git
cd breus

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Configuration

Create a `.env.local` file with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── forms/          # Form components
│   ├── layout/         # Layout components
│   └── shared/         # Shared components
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── lib/                # Utility libraries
├── types/              # TypeScript type definitions
├── utils/              # Helper functions
└── integrations/       # External service integrations
```

## Key Features

### Security
- Row Level Security (RLS) with Supabase
- Role-based access control
- Encrypted data transmission
- Audit logging for all operations

### Performance
- Optimized React Query caching
- Lazy loading for large datasets
- Progressive Web App (PWA) capabilities
- Offline functionality for critical operations

### User Experience
- Responsive design for all devices
- Intuitive navigation and workflows
- Real-time updates and notifications
- Accessibility compliance (WCAG 2.1)

## Development Guidelines

### Code Quality
- TypeScript for type safety
- ESLint and Prettier for code formatting
- Component-driven development
- Comprehensive error handling

### Testing
- Unit tests for critical functions
- Integration tests for user workflows
- End-to-end testing for complete scenarios

## Deployment

The application can be deployed to various platforms:

- **Vercel**: Recommended for production deployments
- **Netlify**: Alternative hosting platform
- **Docker**: Containerized deployment option

### Production Build

```bash
npm run build
npm run preview
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and ensure code quality
5. Submit a pull request

## License

This project is proprietary software. All rights reserved.

## Support

For technical support or questions, please contact the development team.

---

**Breus** - Revolutionizing professional diving operations in aquaculture through digital innovation.