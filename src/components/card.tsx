import React from 'react';
import { Card as MaterialCard } from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

interface CardProps {
  name: string;
  points: number;
}
export const Card = ({ name, points }: CardProps) => {
  return (
    <MaterialCard>
      <CardContent>
        <Typography>Name: {name}</Typography>
        <Typography>Points: {points}</Typography>
      </CardContent>
    </MaterialCard>
  );
};
