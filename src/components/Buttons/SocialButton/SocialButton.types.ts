export interface SocialButtonProps {
  provider: string; // The provider name, e.g., "apple", "google"
  logo: string; // The URL of the provider's logo
  onClick: () => void; // The click handler function
}
