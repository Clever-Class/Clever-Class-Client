import { useEffect, useRef, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import styles from './ReviewsFeature.module.scss';

interface Review {
  id: number;
  name: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
  date: string;
}

const reviewsRow1: Review[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Math Teacher',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    content:
      'Clever Class has transformed how I teach mathematics. The interactive tools and real-time feedback have made learning more engaging for my students.',
    rating: 5,
    date: 'March 15, 2024',
  },
  {
    id: 2,
    name: 'David Chen',
    role: 'Science Educator',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    content:
      "The platform's ability to create interactive science experiments and visualizations has been invaluable.",
    rating: 5,
    date: 'March 12, 2024',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Language Arts Teacher',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    content:
      'The collaborative features and writing tools have made it easier to provide detailed feedback.',
    rating: 5,
    date: 'March 10, 2024',
  },
  {
    id: 4,
    name: 'Michael Brown',
    role: 'History Teacher',
    avatar: 'https://randomuser.me/api/portraits/men/52.jpg',
    content:
      'An excellent platform that makes teaching history interactive and engaging for students.',
    rating: 5,
    date: 'March 8, 2024',
  },
  {
    id: 5,
    name: 'Lisa Wang',
    role: 'Computer Science Teacher',
    avatar: 'https://randomuser.me/api/portraits/women/89.jpg',
    content:
      'The coding exercises and interactive debugging tools are fantastic for teaching programming.',
    rating: 5,
    date: 'March 5, 2024',
  },
];

const reviewsRow2: Review[] = [
  {
    id: 6,
    name: 'James Wilson',
    role: 'Physics Teacher',
    avatar: 'https://randomuser.me/api/portraits/men/92.jpg',
    content:
      'The physics simulations and interactive experiments have revolutionized my teaching approach.',
    rating: 5,
    date: 'March 3, 2024',
  },
  {
    id: 7,
    name: 'Maria Garcia',
    role: 'Spanish Teacher',
    avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
    content:
      'The language learning tools and pronunciation features are exceptional.',
    rating: 5,
    date: 'March 1, 2024',
  },
  {
    id: 8,
    name: 'Robert Taylor',
    role: 'Biology Teacher',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    content:
      'The 3D models and virtual dissection tools have made biology more accessible.',
    rating: 5,
    date: 'February 28, 2024',
  },
  {
    id: 9,
    name: 'Emma Thompson',
    role: 'Art Teacher',
    avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
    content:
      'The digital art tools and gallery features have enhanced creativity in my classroom.',
    rating: 5,
    date: 'February 25, 2024',
  },
  {
    id: 10,
    name: 'Daniel Lee',
    role: 'Music Teacher',
    avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
    content:
      'The music composition tools and virtual instruments are outstanding.',
    rating: 5,
    date: 'February 22, 2024',
  },
];

const ReviewsFeature = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
      },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const createSeamlessLoop = (reviews: Review[]) => {
    return [...reviews, ...reviews];
  };

  return (
    <section className={styles.reviewsSection} ref={sectionRef}>
      <div className={styles.contentContainer}>
        <div
          className={`${styles.sectionHeader} ${
            isVisible ? styles.visible : ''
          }`}
        >
          <h2 className={styles.title}>What Our Users Are Saying</h2>
          <p className={styles.description}>
            Discover how Clever Class is transforming education through the
            experiences of our dedicated teachers and students.
          </p>
        </div>

        <div className={styles.scrollingReviews}>
          <div className={styles.scrollRow1}>
            {createSeamlessLoop(reviewsRow1).map((review, index) => (
              <div key={`${review.id}-${index}`} className={styles.reviewCard}>
                <div className={styles.reviewHeader}>
                  <div className={styles.avatar}>
                    <img src={review.avatar} alt={review.name} />
                  </div>
                  <div className={styles.userInfo}>
                    <h3 className={styles.name}>{review.name}</h3>
                    <p className={styles.role}>{review.role}</p>
                    <div className={styles.rating}>
                      {[...Array(review.rating)].map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </div>
                  </div>
                </div>
                <p className={styles.reviewContent}>{review.content}</p>
                <p className={styles.reviewDate}>{review.date}</p>
              </div>
            ))}
          </div>

          <div className={styles.scrollRow2}>
            {createSeamlessLoop(reviewsRow2).map((review, index) => (
              <div key={`${review.id}-${index}`} className={styles.reviewCard}>
                <div className={styles.reviewHeader}>
                  <div className={styles.avatar}>
                    <img src={review.avatar} alt={review.name} />
                  </div>
                  <div className={styles.userInfo}>
                    <h3 className={styles.name}>{review.name}</h3>
                    <p className={styles.role}>{review.role}</p>
                    <div className={styles.rating}>
                      {[...Array(review.rating)].map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </div>
                  </div>
                </div>
                <p className={styles.reviewContent}>{review.content}</p>
                <p className={styles.reviewDate}>{review.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsFeature;
