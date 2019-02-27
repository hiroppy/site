import React from 'react';
import styled, { keyframes } from 'styled-components';
import { getRandomInt } from '../../utils/getRandomInt';

const Meteor = styled.i`
  position: absolute;
  width: 3px;
  animation-delay: ${() => `${getRandomInt(0, 30)}s`};
  animation-duration: ${() => `${getRandomInt(0, 10) + 20}s`};
  animation-iteration-count: infinite;
  transition-timing-function: ease-in;
  opacity: 0;
`;

const meteor1Animation = keyframes`
  from {
    transform: scale(0) translate3d(0, 0, 0);
  }

  1% {
    opacity: ${(getRandomInt(0, 30) + 30) * 0.01};
  }

  5% {
    transform: scale(1) translate3d(0, 0, 0);
  }

  10% {
    opacity: 0;
  }

  to {
    opacity: 0;
  }
`;

const Meteor1Sub = styled(Meteor)`
  background: linear-gradient(to top, rgba(255, 255, 255, 0) 0%, #fff 100%);
  height: 300px;
  animation-name: ${() => meteor1Animation};
`;

const Meteor1Wrapper = styled.div`
  position: absolute;
  left: ${() => `calc(${getRandomInt(0, 100)}%)`};
  top: ${() => `calc(${getRandomInt(0, 60)}%)`};
  transform: ${() => `rotate(${getRandomInt(0, 360)}deg)`};
`;

const meteor2Animation = keyframes`
  from {
    transform: rotate(0deg) translateX(150px);
  }

  1% {
    opacity: ${(getRandomInt(0, 30) + 30) * 0.01};
  }

  10% {
    opacity: 0;
    transform: rotate(${getRandomInt(0, 120)}deg) translateX(150px);
  }

  to {
    opacity: 0;
  }
`;

const Meteor2Sub = styled(Meteor)`
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, #fff 100%);
  height: 50px;
  animation-name: ${() => meteor2Animation};
  left: ${() => `calc(${getRandomInt(0, 100)}%)`};
  top: ${() => `calc(${getRandomInt(0, 70)}%)`};
`;

export const Meteor1: React.FC = () => (
  <Meteor1Wrapper>
    <Meteor1Sub />
  </Meteor1Wrapper>
);

export const Meteor2: React.FC = () => <Meteor2Sub />;
