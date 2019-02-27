import styled, { keyframes } from 'styled-components';
import { getRandomInt } from '../../utils/getRandomInt';
import { whiteColor } from '../../variables';

const starAnimation = keyframes`
  0% {
    background: powderblue;
    box-shadow: 0px 0px 10px ${whiteColor};
    height: 1px;
    width: 1px;
  }

  10% {
    background: #b0e5de;
  }

  20% {
    background: #b0e5cc;
  }

  30% {
    background: #cce5b0;
  }

  40% {
    background: #dae5b0;
  }

  50% {
    background: #e5ddb0;
    box-shadow: 0px 0px 10px #d3bd3d;
    height: 5px;
    width: 5px;
  }

  100% {
    background: powderblue;
    box-shadow: 0px 0px 10px ${whiteColor};
    height: 1px;
    width: 1px;
  }
`;

export const Star = styled.i`
  background: powderblue;
  border-radius: 5px;
  box-shadow: 0px 0px 10px ${whiteColor};
  height: 1px;
  position: absolute;
  width: 1px;
  animation-name: ${starAnimation};
  animation-delay: ${() => `${getRandomInt(0, 10)}s;`};
  animation-duration: ${() => `calc(${getRandomInt(0, 10)}s + 5s)`};
  animation-iteration-count: infinite;
  left: ${() => `calc(${getRandomInt(0, 100)} * 1%)`};
  opacity: 1;
  top: ${() => `calc(${getRandomInt(0, 80)} * 1%)`};
`;
