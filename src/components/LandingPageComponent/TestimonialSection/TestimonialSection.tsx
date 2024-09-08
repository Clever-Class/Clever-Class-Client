import React from 'react';
import './Testimonials.scss';

const testimonials = [
  {
    name: 'Amanda R.',
    review:
      "Flowboard's intuitive interface streamlines collaboration, making design projects effortless and efficient.",
    stars: 5,
    avatarUrl:
      'https://ae-pic-a1.aliexpress-media.com/kf/Sa855458c0aa5488cbc7c9bd9fd8ecd48U.jpg_640x640Q90.jpg_.webp', // Replace with actual avatar path
  },
  {
    name: 'Amanda R.',
    review:
      "Flowboard's intuitive interface streamlines collaboration, making design projects effortless and efficient.",
    stars: 5,
    avatarUrl:
      'https://ae-pic-a1.aliexpress-media.com/kf/Sa855458c0aa5488cbc7c9bd9fd8ecd48U.jpg_640x640Q90.jpg_.webp', // Replace with actual avatar path
  },
  {
    name: 'Amanda R.',
    review:
      "Flowboard's intuitive interface streamlines collaboration, making design projects effortless and efficient.",
    stars: 5,
    avatarUrl:
      'https://ae-pic-a1.aliexpress-media.com/kf/Sa855458c0aa5488cbc7c9bd9fd8ecd48U.jpg_640x640Q90.jpg_.webp', // Replace with actual avatar path
  },
  {
    name: 'Amanda R.',
    review:
      "Flowboard's intuitive interface streamlines collaboration, making design projects effortless and efficient.",
    stars: 5,
    avatarUrl:
      'https://ae-pic-a1.aliexpress-media.com/kf/Sa855458c0aa5488cbc7c9bd9fd8ecd48U.jpg_640x640Q90.jpg_.webp', // Replace with actual avatar path
  },
  {
    name: 'Amanda R.',
    review:
      "Flowboard's intuitive interface streamlines collaboration, making design projects effortless and efficient.",
    stars: 5,
    avatarUrl:
      'https://ae-pic-a1.aliexpress-media.com/kf/Sa855458c0aa5488cbc7c9bd9fd8ecd48U.jpg_640x640Q90.jpg_.webp', // Replace with actual avatar path
  },
  {
    name: 'Amanda R.',
    review:
      "Flowboard's intuitive interface streamlines collaboration, making design projects effortless and efficient.",
    stars: 5,
    avatarUrl:
      'https://ae-pic-a1.aliexpress-media.com/kf/Sa855458c0aa5488cbc7c9bd9fd8ecd48U.jpg_640x640Q90.jpg_.webp', // Replace with actual avatar path
  },
  {
    name: 'Amanda R.',
    review:
      "Flowboard's intuitive interface streamlines collaboration, making design projects effortless and efficient.",
    stars: 5,
    avatarUrl:
      'https://ae-pic-a1.aliexpress-media.com/kf/Sa855458c0aa5488cbc7c9bd9fd8ecd48U.jpg_640x640Q90.jpg_.webp', // Replace with actual avatar path
  },
  {
    name: 'Amanda R.',
    review:
      "Flowboard's intuitive interface streamlines collaboration, making design projects effortless and efficient.",
    stars: 5,
    avatarUrl:
      'https://ae-pic-a1.aliexpress-media.com/kf/Sa855458c0aa5488cbc7c9bd9fd8ecd48U.jpg_640x640Q90.jpg_.webp', // Replace with actual avatar path
  },
  // Add more testimonials as needed
];

export const TestimonialsSection = () => {
  return (
    <div className="testimonials-section-wrapper">
      <section className="testimonials-section">
        <h2>What are they saying about us?</h2>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="testimonial-header">
                <div className="avatar">
                  <img src={testimonial.avatarUrl} alt={testimonial.name} />
                </div>
                <div className="testimonial-name-and-stars">
                  <h3>{testimonial.name}</h3>
                  <div className="stars">
                    {Array(testimonial.stars)
                      .fill(null, 0, testimonial.stars)
                      .map((_, i) => (
                        <span key={i}>⭐</span>
                      ))}
                  </div>
                </div>
              </div>
              <p>{testimonial.review}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
