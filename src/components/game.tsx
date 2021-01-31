import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Select, InputLabel, FormControl, MenuItem } from '@material-ui/core';
import { Counter } from './counter';
import { Card } from './card';
import { CardModel, PersonModel, StarshipModel } from '../models';
import styled from 'styled-components';

export const Game = () => {
  const API_URL = process.env.REACT_APP_URL_API;
  // const gameType = 'people';

  const [countCards, setCountCards] = useState<number>(0);
  const [gameCount, setGameCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [pointsPlayer, setPointsPlayer] = useState<number>(0);
  const [pointsComputer, setPointsComputer] = useState<number>(0);
  const [cardPlayer, setCardPlayer] = useState<CardModel>();
  const [cardComputer, setCardComputer] = useState<CardModel>();
  const [gameType, setGameType] = useState<string>('people');

  useEffect(() => {
    axios
      .get<PeopleResponse>(`${API_URL}${gameType}`)
      .then((response) => {
        setCountCards(response.data.count);
      })
      .catch((error) => {
        console.log('ERROR');
      });
  }, [gameType]);

  useEffect(() => {
    if (countCards > 0) {
      if (gameCount > 0) {
        handleDrawCard('player');
        handleDrawCard('computer');
      }
    }
  }, [gameCount]);

  useEffect(() => {
    cardPlayer &&
      cardComputer &&
      cardPlayer.gameCount === cardComputer.gameCount &&
      handleCompare(cardPlayer.points, cardComputer.points);
  }, [cardPlayer, cardComputer]);

  const handleChangeGameType = (event: React.ChangeEvent<{ value: unknown }>) => {
    setGameType(event.target.value as string);
  };

  const handleCompare = (playerPoints: number, computerPoints: number) => {
    playerPoints === computerPoints
      ? null
      : playerPoints > computerPoints
      ? setPointsPlayer((points) => points + 1)
      : setPointsComputer((points) => points + 1);
  };

  const handlePlay = () => {
    setLoading(true);
    setGameCount(gameCount + 1);
  };

  const handleSetCard = (owner: 'player' | 'computer', card: CardModel) => {
    owner === 'player' && setCardPlayer(card);
    owner === 'computer' && setCardComputer(card);
  };

  const handleDrawCard = (owner: 'player' | 'computer') => {
    const randomNumber = Math.floor(Math.random() * countCards + 1);
    gameType === 'people' &&
      axios
        .get<PersonModel>(`${API_URL}${gameType}/${randomNumber}`)
        .then((response) => {
          isNaN(Number(response.data.mass))
            ? handleDrawCard(owner)
            : handleSetCard(owner, {
                name: response.data.name,
                points: +response.data.mass,
                gameCount: gameCount,
              });
        })
        .then(() => {
          setLoading(false);
        })
        .catch((error) => {
          console.log('ERROR');
        });
    gameType === 'starships' &&
      axios
        .get<StarshipModel>(`${API_URL}${gameType}/${randomNumber}`)
        .then((response) => {
          isNaN(Number(response.data.crew))
            ? handleDrawCard(owner)
            : handleSetCard(owner, {
                name: response.data.name,
                points: +response.data.crew,
                gameCount: gameCount,
              });
        })
        .then(() => {
          setLoading(false);
        })
        .catch((error) => {
          handleDrawCard(owner);
        });
  };

  const handleResetGame = () => {
    setPointsPlayer(0);
    setPointsComputer(0);
    setGameType('people');
    setLoading(false);
    setCardPlayer(undefined);
    setCardComputer(undefined);
  };

  return (
    <StyledContainer>
      <Counter pointsPlayer={pointsPlayer} pointsComputer={pointsComputer} />
      <FormControl>
        <InputLabel id="game-type">Select</InputLabel>
        <Select
          labelId="game-type"
          id="game-type-select"
          value={gameType}
          onChange={handleChangeGameType}
        >
          <MenuItem value={'people'}>People</MenuItem>
          <MenuItem value={'starships'}>Starships</MenuItem>
        </Select>
      </FormControl>
      <Button variant="contained" color="primary" disabled={loading} onClick={() => handlePlay()}>
        Play
      </Button>
      <Button variant="contained" color="primary" onClick={handleResetGame}>
        Reset game
      </Button>
      {cardPlayer && cardComputer && (
        <CardsWrapper>
          <Card points={cardPlayer.points} name={cardPlayer.name} />
          <Card points={cardComputer.points} name={cardComputer.name} />
        </CardsWrapper>
      )}
    </StyledContainer>
  );
};

type PeopleResponse = {
  count: number;
};

const StyledContainer = styled.div`
  margin: 0 auto;
  padding: 0 15px;
  max-width: 600px;
`;

const CardsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;
