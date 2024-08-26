import React from 'react';

import { PricingCard } from '~components/PricingCard';

import './Packages.scss';

export const Packages = () => {
  // make a array of objects with the pricing card data
  const pricingData = [
    {
      title: 'One Month Subscription',
      price: '$10',
      priceId: 'pri_01j2m6kcy7zrwey4j07dzgc5ea',
      description: 'This is a basic package',
      isHighlighted: false,
    },
    {
      title: 'Three Month Subscription',
      price: '$20',
      priceId: 'pri_01j2pvh294ernfyf1hjwhxbbcb',
      description: 'This is a pro package',
      isHighlighted: true,
    },
    {
      title: 'Whole Semester Subscription',
      price: '$30',
      priceId: 'pri_01j2pvmb54ew8nbv3szzt0q39s',
      description: 'This is an enterprise package',
      isHighlighted: false,
    },
  ];
  return (
    <div className="all_pricing_packages">
      {pricingData.map((pricingCardData, key) => (
        <PricingCard
          key={key}
          title={pricingCardData.title}
          price={pricingCardData.price}
          priceId={pricingCardData.priceId}
          description={pricingCardData.description}
          isHighlighted={pricingCardData.isHighlighted}
        />
      ))}
    </div>
  );
};
