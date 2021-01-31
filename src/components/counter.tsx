import React from 'react';
import styled from 'styled-components';

interface CounterProps {
  pointsPlayer: number;
  pointsComputer: number;
}

export const Counter = ({ pointsPlayer, pointsComputer }: CounterProps) => {
  return (
    <StyledContainer>
      <p>
        Player points: <b>{pointsPlayer}</b>
      </p>
      <p>
        Computer points: <b>{pointsComputer}</b>
      </p>
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
