# UI Components Specification

## Overview
This document defines the high-end UI components for the Todo application with glassmorphism effects, priority-tagged task cards, and Framer Motion animations. The components follow a professional SaaS dashboard design with modern React patterns and accessibility standards.

## Design System Foundation

### Color Palette
- **Primary Colors**:
  - Primary Blue: #3B82F6 (buttons, accents)
  - Dark Blue: #1E40AF (headers, navigation)
  - Light Blue: #DBEAFE (backgrounds, subtle elements)

- **Secondary Colors**:
  - Success Green: #10B981 (completed tasks, success states)
  - Warning Amber: #F59E0B (urgent tasks, warnings)
  - Danger Red: #EF4444 (errors, deletions)
  - Neutral Gray: #6B7280 (text, borders)

- **Background Colors**:
  - White: #FFFFFF (main backgrounds)
  - Light Gray: #F9FAFB (card backgrounds)
  - Dark Gray: #1F2937 (glassmorphism surfaces)

- **Glassmorphism Tints**:
  - Frosted Glass: rgba(255, 255, 255, 0.1) with backdrop blur
  - Dark Glass: rgba(0, 0, 0, 0.1) with backdrop blur

### Typography System
- **Headings**: Inter, 700 weight, letter-spacing -0.02em
- **Body Text**: Inter, 400-500 weight, line-height 1.6
- **Captions**: Inter, 400 weight, smaller size
- **Monospace**: JetBrains Mono for code elements

### Spacing System
- **Base Unit**: 8px
- **Scale**: 0.5rem, 1rem, 1.5rem, 2rem, 3rem, 4rem
- **Consistency**: All spacing follows the 8px grid

## Core Components

### 1. Glassmorphism Sidebar Component

#### Component: GlassSidebar
**Purpose**: Navigation sidebar with frosted glass effect
**Type**: Client Component with Framer Motion animations
**Props**:
```typescript
interface GlassSidebarProps {
  isOpen: boolean;
  onToggle?: () => void;
  navigationItems: NavigationItem[];
  user?: User;
  className?: string;
}

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
  isActive?: boolean;
}
```

**Features**:
- Frosted glass background with backdrop blur
- Smooth slide-in/out animations with Framer Motion
- Active state highlighting
- User profile section with avatar
- Collapsible sections for mobile responsiveness
- Hover effects with subtle scaling

**Animation Specifications**:
- Slide-in duration: 300ms with ease-out
- Hover scale: 1.02 transform
- Backdrop blur: 12px for premium effect
- Border: 1px solid rgba(255, 255, 255, 0.2)

**Accessibility**:
- Keyboard navigation support
- ARIA labels for navigation items
- Focus ring visibility
- Screen reader compatibility

### 2. Task Cards with Priority Tags

#### Component: PriorityTaskCard
**Purpose**: Display individual tasks with priority-based styling
**Type**: Server Component with Client Component interactions
**Props**:
```typescript
interface PriorityTaskCardProps {
  task: Task;
  onStatusChange?: (taskId: number, newStatus: string) => void;
  onPriorityChange?: (taskId: number, newPriority: string) => void;
  onClick?: () => void;
  showActions?: boolean;
}

interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: User;
}
```

**Features**:
- Priority-based color coding:
  - Low: Blue tag with subtle border
  - Medium: Green tag with standard styling
  - High: Orange tag with accent glow
  - Urgent: Red tag with pulsing animation

- Status indicators with visual feedback
- Due date countdown display
- Progress tracking for in-progress tasks
- Drag-and-drop support for reordering
- Quick action buttons (edit, delete, assign)

**Visual Design**:
- Card elevation with subtle shadow
- Rounded corners (8px radius)
- Hover effects with slight lift
- Priority tag positioning in top-right corner
- Status badge in bottom-left corner

**Animations**:
- Card entrance animation on load
- Priority tag pulse effect for urgent tasks
- Status change transition effects
- Drag-and-drop smooth movement

### 3. Animated Dashboard Widgets

#### Component: AnimatedDashboardCard
**Purpose**: Animated dashboard cards for metrics and summaries
**Type**: Client Component with Framer Motion
**Props**:
```typescript
interface AnimatedDashboardCardProps {
  title: string;
  value: number | string;
  change?: number;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
  loading?: boolean;
  animateOnMount?: boolean;
}
```

**Features**:
- Number counting animation on mount
- Trend arrow with color coding
- Icon integration with Lucide-React
- Loading skeleton states
- Hover information tooltips
- Click-through navigation capability

**Animation Details**:
- Count-up animation duration: 1.5s
- Stagger delay for multiple cards: 100ms
- Hover scale effect: 1.03
- Background gradient animation for active states

### 4. Glassmorphism Modal Component

#### Component: GlassModal
**Purpose**: Frosted glass modal dialogs for forms and confirmations
**Type**: Client Component with Portal rendering
**Props**:
```typescript
interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
  preventOutsideClose?: boolean;
}
```

**Features**:
- Semi-transparent overlay with blur effect
- Glassmorphism content container
- Smooth fade-in/fade-out animations
- Click-outside to close functionality
- Escape key closing
- Responsive sizing options

**Animation Specifications**:
- Overlay fade: 200ms
- Modal scale: 300ms with spring physics
- Backdrop blur transition: 300ms
- Close animation: reverse of open sequence

### 5. Animated Task List Component

#### Component: AnimatedTaskList
**Purpose**: Animate task list additions, removals, and updates
**Type**: Client Component with Framer Motion
**Props**:
```typescript
interface AnimatedTaskListProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  onTaskStatusChange?: (taskId: number, newStatus: string) => void;
  loading?: boolean;
  emptyState?: React.ReactNode;
}
```

**Features**:
- Staggered entrance animations for new tasks
- Exit animations for deleted tasks
- Update animations for status changes
- Infinite scroll with loading indicators
- Filtering and sorting transitions
- Empty state animations

**Motion Specifications**:
- Item stagger delay: 50ms
- Spring physics: stiffness 300, damping 25
- Fade-in opacity: 0 to 1
- Slide-in Y-axis: -20px to 0

### 6. Priority Badge Component

#### Component: PriorityBadge
**Purpose**: Consistent priority tagging across the application
**Type**: Client Component
**Props**:
```typescript
interface PriorityBadgeProps {
  priority: 'low' | 'medium' | 'high' | 'urgent';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}
```

**Visual Variants**:
- **Low Priority**: Blue background (#93C5FD), white text
- **Medium Priority**: Green background (#6EE7B7), dark text
- **High Priority**: Amber background (#FCD34D), dark text
- **Urgent Priority**: Red background (#FCA5A5), white text

**Animation Features**:
- Pulse animation for urgent priority
- Hover scale effect
- Size transitions for responsive design
- Icon integration with Lucide-React

### 7. Glassmorphism Navigation Bar

#### Component: GlassNavBar
**Purpose**: Top navigation bar with glass effect
**Type**: Client Component with scroll detection
**Props**:
```typescript
interface GlassNavBarProps {
  user: User;
  navigationItems: NavigationItem[];
  onSearch?: (query: string) => void;
  showSearch?: boolean;
  className?: string;
}
```

**Features**:
- Glassmorphism background with blur effect
- User profile dropdown
- Search functionality with instant results
- Notification badge with counter
- Responsive hamburger menu for mobile
- Scroll-aware transparency changes

**Animation Details**:
- Transparency transition on scroll: 300ms
- Dropdown slide-down: 200ms
- Search expand/collapse: 250ms
- Notification badge pulse: periodic animation

## Framer Motion Animation System

### Global Animation Presets
```typescript
// Animation presets for consistent motion
const ANIMATION_PRESETS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  slideUp: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 20, opacity: 0 }
  },
  slideDown: {
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 }
  },
  scaleIn: {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.95, opacity: 0 }
  }
};
```

### Motion Components
- **motion.div**: Animated containers
- **motion.button**: Interactive animated buttons
- **motion.input**: Animated form inputs
- **motion.img**: Animated images with loading states
- **AnimatePresence**: Exit animations for components

### Spring Physics Configuration
- **Standard**: stiffness 300, damping 25
- **Gentle**: stiffness 200, damping 20
- **Bouncy**: stiffness 400, damping 15
- **Stiff**: stiffness 500, damping 30

## Lucide-React Icon Integration

### Icon Categories
- **Navigation Icons**: Home, Dashboard, Settings, User
- **Action Icons**: Plus, Edit, Trash, Check, X
- **Status Icons**: CheckCircle, AlertTriangle, Clock, Calendar
- **Communication Icons**: Mail, Message, Bell, Share
- **File Icons**: FileText, Folder, Download, Upload

### Icon Styling System
- **Size Variants**: sm (16px), md (20px), lg (24px), xl (32px)
- **Color Variants**: inherit, primary, secondary, success, warning, danger
- **Animation Support**: Spin, pulse, bounce animations
- **Accessibility**: ARIA labels and semantic meaning

## Accessibility Standards

### ARIA Compliance
- **Roles**: Proper landmark roles (banner, navigation, main)
- **Labels**: Descriptive labels for interactive elements
- **States**: Accurate ARIA states (expanded, selected, busy)
- **Properties**: Relevant ARIA properties (owns, describedby)

### Keyboard Navigation
- **Tab Order**: Logical tab sequence
- **Focus Management**: Clear focus indicators
- **Shortcuts**: Accessible keyboard shortcuts
- **Skip Links**: Skip to main content links

### Screen Reader Support
- **Announcements**: Live regions for dynamic content
- **Landmarks**: Semantic HTML structure
- **Descriptions**: Alternative text for visual elements
- **Navigation**: Clear heading hierarchy

## Responsive Design

### Breakpoint System
- **Mobile**: 0px - 640px
- **Tablet**: 641px - 1024px
- **Desktop**: 1025px - 1280px
- **Large Desktop**: 1281px+

### Component Adaptations
- **Sidebar**: Collapses to hamburger menu on mobile
- **Cards**: Single column on mobile, multi-column on desktop
- **Modals**: Full-screen takeover on mobile
- **Forms**: Vertical stacking on mobile, horizontal on desktop

## Performance Optimization

### Component Loading
- **Lazy Loading**: Dynamic imports for heavy components
- **Code Splitting**: Route-based and feature-based splitting
- **Memoization**: React.memo for static components
- **Virtual Scrolling**: For large lists and data tables

### Animation Performance
- **GPU Acceleration**: Transform and opacity for smooth animations
- **Throttling**: Animation frame throttling for performance
- **Cleanup**: Proper cleanup of animation resources
- **Reduced Motion**: Respects user's reduced motion preferences