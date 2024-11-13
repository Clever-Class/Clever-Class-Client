import { IconType } from 'react-icons/lib';

export interface SocialButtonProps {
  provider: string; // The provider name, e.g., "apple", "google"
  icon: IconType; // The URL of the provider's logo
  onClick: () => void; // The click handler function
}
