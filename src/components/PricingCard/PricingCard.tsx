import React from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';

import { PricingCardProps } from './PricingCard.types';

import './PricingCard.scss';
import { Button } from '~components/ui/button';

export const PricingCard = ({
  description,
  price,
  title,
  priceId,
}: PricingCardProps) => {
  const handleSubscribe = async () => {
    // forward to signup page
    window.location.href = `/signup?priceId=${priceId}`;
  };
  return (
    <Card className="pricing_card">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{price}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{description}</p>
      </CardContent>
      <div className="button_wrapper">
        <Button className="subscribe_btn" onClick={handleSubscribe}>
          Subscribe Now
        </Button>
      </div>
    </Card>
  );
};
