# Design System

This design system provides consistent styling across the application using CSS variables and reusable components.

## CSS Variables

All design tokens are defined as CSS variables in `design-system.css`:

### Colors
- `--color-primary`: Main brand color (#2563eb)
- `--color-primary-hover`: Primary hover state (#1d4ed8)
- `--color-danger`: Error/danger color (#dc2626)
- `--color-success`: Success color (#059669)
- `--color-warning`: Warning color (#d97706)
- `--color-gray-50` to `--color-gray-900`: Gray scale

### Typography
- `--font-family-primary`: Main font stack
- `--font-family-mono`: Monospace font stack
- `--text-xs` to `--text-4xl`: Font sizes

### Spacing
- `--spacing-1` to `--spacing-12`: Consistent spacing values

### Border Radius
- `--radius-sm` to `--radius-2xl`: Border radius values

### Shadows
- `--shadow-sm` to `--shadow-xl`: Box shadow values

## Reusable CSS Classes

### Cards
```css
.card              /* Base card styling */
.card-header       /* Card header container */
.card-title        /* Card title text */
.card-subtitle     /* Card subtitle text */
```

### Buttons
```css
.btn              /* Base button styling */
.btn-primary      /* Primary button variant */
.btn-secondary    /* Secondary button variant */
.btn-danger       /* Danger button variant */
```

### Typography
```css
.text-heading-1   /* Large heading */
.text-heading-2   /* Medium heading */
.text-heading-3   /* Small heading */
.text-body        /* Body text */
.text-caption     /* Caption text */
```

### Layout
```css
.page-container   /* Full page layout */
.page-content     /* Main content area */
.page-header      /* Page header spacing */
```

## React Components

### Card Component
```tsx
import { Card, CardHeader, CardTitle, CardSubtitle, CardContent } from '../components/ui';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardSubtitle>Card subtitle</CardSubtitle>
  </CardHeader>
  <CardContent>
    Card content here
  </CardContent>
</Card>
```

### Button Component
```tsx
import { Button } from '../components/ui';

<Button variant="primary" size="md" onClick={handleClick}>
  Click me
</Button>
```

### Typography Component
```tsx
import { Typography } from '../components/ui';

<Typography variant="h1">Large Heading</Typography>
<Typography variant="body">Body text</Typography>
```

## Tailwind Integration

The design system is integrated with Tailwind CSS. You can use:

- `text-primary-600` for primary color text
- `bg-gray-100` for gray backgrounds
- `rounded-lg` for border radius
- `shadow-md` for box shadows
- `text-2xl` for font sizes
- `p-6` for padding

## Making Changes

To change the design system:

1. **Colors**: Update CSS variables in `design-system.css`
2. **Typography**: Update font variables and Tailwind config
3. **Spacing**: Update spacing variables and Tailwind config
4. **Components**: Update the reusable CSS classes

All changes will automatically apply across the entire application! 