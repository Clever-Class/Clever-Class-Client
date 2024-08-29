import React, { useState } from 'react';
import './FAQ.scss';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    'How do I reset my password?',
    'What payment methods do you accept?',
    'Can I cancel my subscription at any time?',
    'Is my data backed up regularly?',
    'How do I invite collaborators to my projects?',
    'Are there any discounts available for educational institutions?',
  ];

  const toggleFAQ = (index: any) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <div className="faq-container">
        <h2>FAQ</h2>
        <ul className="faq-list">
          {faqs.map((faq, index) => (
            <li key={index} className="faq-item">
              <button className="faq-question" onClick={() => toggleFAQ(index)}>
                {faq}
                <span className="faq-icon">
                  {openIndex === index ? '-' : '+'}
                </span>
              </button>
              {openIndex === index && (
                <div className="faq-answer">
                  {/* Replace the following text with the actual answer */}
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </p>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default FAQ;
