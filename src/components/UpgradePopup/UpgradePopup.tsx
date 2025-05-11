import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LiaTimesSolid } from 'react-icons/lia';
import {
  HiOutlineLightningBolt,
  HiOutlineSparkles,
  HiOutlineBadgeCheck,
  HiOutlineChip,
} from 'react-icons/hi';
import { Button } from '~/components/ui/Button/Button';
import styles from './UpgradePopup.module.scss';

interface UpgradePopupProps {
  onClose: () => void;
}

export const UpgradePopup: React.FC<UpgradePopupProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleUpgradeClick = () => {
    setLoading(true);
    // Navigate to pricing or subscription page
    navigate('/pricing');
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close"
        >
          <LiaTimesSolid />
        </button>

        <div className={styles.header}>
          <div className={styles.illustration}>
            <HiOutlineLightningBolt size={60} />
          </div>
          <h2>AI Credits Depleted</h2>
          <p>
            Upgrade to our <span className={styles.highlight}>Pro plan</span> to
            unlock unlimited AI-powered learning features.
          </p>
        </div>

        <div className={styles.benefits}>
          <div className={styles.benefitItem}>
            <div className={styles.benefitIcon}>
              <HiOutlineSparkles size={24} />
            </div>
            <div className={styles.benefitText}>
              <h3>Unlimited AI Conversations</h3>
              <p>
                Get unlimited access to our AI tutor for all your learning needs
              </p>
            </div>
          </div>

          <div className={styles.benefitItem}>
            <div className={styles.benefitIcon}>
              <HiOutlineLightningBolt size={24} />
            </div>
            <div className={styles.benefitText}>
              <h3>Faster Response Times</h3>
              <p>Priority processing for quicker help with your questions</p>
            </div>
          </div>

          <div className={styles.benefitItem}>
            <div className={styles.benefitIcon}>
              <HiOutlineChip size={24} />
            </div>
            <div className={styles.benefitText}>
              <h3>AI-Enhanced Education</h3>
              <p>
                Personalized learning experience adapted to your unique style
              </p>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <Button
            type="button"
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleUpgradeClick}
            isLoading={loading}
          >
            Upgrade to Pro
          </Button>

          <button className={styles.secondaryAction} onClick={onClose}>
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradePopup;
