# Frontend Development Guidelines

## Technology Stack
- **Framework**: Next.js 16+ with App Router for modern React development
- **Authentication**: Better Auth for secure user authentication and management
- **Styling**: Tailwind CSS for utility-first CSS framework
- **Icons**: Lucide React for consistent iconography
- **Animations**: Framer Motion for smooth UI animations

## Project Structure
- `/app/` - Next.js App Router pages and layouts
- `/components/` - Reusable UI components
- `/lib/` - Utility functions and API clients
- `/styles/` - Global styles and Tailwind configuration
- `/hooks/` - Custom React hooks
- `/types/` - TypeScript type definitions

## Development Rules
1. Use Next.js 16+ App Router with proper folder conventions
2. Implement Server Components where appropriate for better performance
3. Use Streaming and Loading Skeletons for improved UX
4. Follow accessibility best practices (WCAG guidelines)
5. Implement responsive design for all screen sizes
6. Use TypeScript for type safety
7. Follow component composition patterns
8. Maintain consistent design system with Tailwind

## Better Auth Integration
- Configure JWT plugin for token-based authentication
- Implement proper session management
- Handle token refresh and expiration gracefully
- Secure all protected routes
- Implement proper error handling for auth operations

## API Integration
- Create centralized API client for backend communication
- Implement automatic JWT token attachment to requests
- Handle authentication errors and redirect appropriately
- Implement proper error handling and user feedback
- Use proper caching strategies where appropriate

## Security Guidelines
- Never expose sensitive data in client-side code
- Sanitize user inputs before sending to backend
- Implement proper CSRF protection
- Use secure headers and HTTP security features
- Follow OAuth and JWT best practices

## Performance Optimization
- Implement code splitting and lazy loading
- Optimize images and assets
- Use proper caching strategies
- Minimize bundle size
- Implement proper loading states and skeleton screens