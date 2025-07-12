# StaticPageLayout Component

A reusable layout component designed for static pages like Privacy Policy, About Us, Terms of Service, etc.

## Features

- **Navbar Integration**: Automatically includes the main navigation with auth functionality
- **Footer Integration**: Includes the site footer
- **Auth Popup**: Built-in authentication modal handling
- **Responsive Design**: Mobile-first responsive layout
- **Customizable**: Flexible styling and content options
- **Accessible**: Proper semantic HTML structure

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | The main content of the page |
| `className` | `string` | `''` | Additional CSS classes for the layout wrapper |
| `title` | `string` | `undefined` | Optional page title (renders as h1) |
| `containerClassName` | `string` | `''` | Additional CSS classes for the content container |

## Usage

### Basic Usage

```tsx
import { StaticPageLayout } from '~components/Layout';

export const MyPage = () => {
  return (
    <StaticPageLayout title="My Page">
      <p>Your content here...</p>
    </StaticPageLayout>
  );
};
```

### With Custom Styling

```tsx
import { StaticPageLayout } from '~components/Layout';
import styles from './MyPage.module.scss';

export const MyPage = () => {
  return (
    <StaticPageLayout 
      title="My Page" 
      className={styles.myPage}
      containerClassName={styles.container}
    >
      <section className={styles.section}>
        <h2>Section Title</h2>
        <p>Section content...</p>
      </section>
    </StaticPageLayout>
  );
};
```

### Without Title

```tsx
import { StaticPageLayout } from '~components/Layout';

export const MyPage = () => {
  return (
    <StaticPageLayout>
      <h1>Custom Title</h1>
      <p>Your content here...</p>
    </StaticPageLayout>
  );
};
```

## Styling

The component uses CSS modules for styling. The following classes are available:

- `.staticPageLayout` - Main layout wrapper
- `.staticPageContent` - Main content area
- `.contentContainer` - Content container with max-width
- `.pageTitle` - Page title styling
- `.pageContent` - Content wrapper with typography styles

### CSS Variables

The component respects the following CSS variables:

- `--text-primary` - Primary text color
- `--text-secondary` - Secondary text color

## Examples

### Privacy Policy Page

```tsx
import { StaticPageLayout } from '~components/Layout';

export const PrivacyPolicy = () => {
  return (
    <StaticPageLayout title="Privacy Policy">
      <section>
        <h2>Information We Collect</h2>
        <p>We collect information you provide directly to us...</p>
      </section>
      <section>
        <h2>How We Use Your Information</h2>
        <p>We use the information we collect to...</p>
      </section>
    </StaticPageLayout>
  );
};
```

### About Us Page

```tsx
import { StaticPageLayout } from '~components/Layout';

export const AboutUs = () => {
  return (
    <StaticPageLayout title="About Us">
      <section>
        <h2>Our Mission</h2>
        <p>We believe that every student deserves...</p>
      </section>
      <section>
        <h2>Our Story</h2>
        <p>Founded in 2024, Clever Class was born...</p>
      </section>
    </StaticPageLayout>
  );
};
```

## Best Practices

1. **Use Semantic HTML**: Structure your content with proper heading hierarchy
2. **Mobile-First**: Design for mobile devices first, then enhance for desktop
3. **Accessibility**: Use proper ARIA labels and semantic elements
4. **Performance**: Keep content optimized and images compressed
5. **SEO**: Use proper meta tags and structured data

## Integration with React Router

```tsx
// In your Routes.tsx
import { StaticPageLayout } from '~components/Layout';
import { PrivacyPolicy } from '~pages/PrivacyPolicy';
import { AboutUs } from '~pages/AboutUs';

const Routes = () => {
  return (
    <Routes>
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/about-us" element={<AboutUs />} />
    </Routes>
  );
};
```

## Troubleshooting

### Common Issues

1. **Footer Import Error**: Make sure Footer is imported correctly
2. **Styling Issues**: Check that CSS modules are properly configured
3. **Auth Popup Not Working**: Ensure AuthPopup component is properly imported

### Debug Tips

- Use browser dev tools to inspect the layout structure
- Check console for any import errors
- Verify that all required props are passed correctly 