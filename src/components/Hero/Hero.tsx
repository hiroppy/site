import React from 'react';
import styled from 'styled-components';
import { Container } from '../templates/Container';
import { Button as ButtonComponent } from '../atoms/Button';
import { Star } from '../animations/star';
import { Meteor1, Meteor2 } from '../animations/meteor';
import {
  blackColor,
  whiteColor,
  githubColor,
  twitterColor,
  facebookColor,
  hatenaColor
} from '../../variables';
import avatar from '../../../images/avatar.jpg';
import { mediaQueries } from '../../utils/mediaQueries';

const Box = styled(Container)`
  background: ${blackColor};
  color: ${whiteColor};
  flex-direction: column;
  text-align: center;
  overflow: hidden;
  position: relative;
`;

const Avatar = styled.div`
  background: url('${avatar}');
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;
  border-radius: 50%;
  height: 120px;
  width: 120px;
`;

const Buttons = styled.div`
  display: flex;
  margin: 16px 0;

  & > * {
    flex: auto;
    margin: 0 10px;
  }

  ${mediaQueries.tablet`
    flex-wrap: wrap;

    & > * {
      margin: 10px;
      width: 24%;
    }
  `};
`;

const Button = styled(ButtonComponent)`
  color: ${whiteColor};
  font-size: 1.6rem;
  transition: color 0.7s;

  &:visited {
    color: ${whiteColor};
  }

  &:hover {
    color: ${({ color }: { color: string }) => color};
  }

  &:before {
    border-radius: 3px;
    border-bottom: 3px solid ${({ color }: { color: string }) => color};
    border-left: 3px solid ${({ color }: { color: string }) => color};
    transform-origin: 0 100%;
  }

  &:after {
    border-radius: 3px;
    border-top: 3px solid ${({ color }: { color: string }) => color};
    border-right: 3px solid ${({ color }: { color: string }) => color};
    transform-origin: 100% 0%;
  }
`;

export const Hero: React.FC = () => (
  <Box className="Hero">
    <div>{[...Array(29)].map((_, i) => <Star key={i} />)}</div>
    {[...Array(9)].map((_, i) => <Meteor1 key={i} />)}
    {[...Array(4)].map((_, i) => <Meteor2 key={i} />)}
    <Avatar className="transition" />
    <h1 className="transition">hiroppy</h1>
    <p className="transition">I am a JavaScript junkie!</p>
    <p className="transition">
      Working on Node.js, webpack, stylelint, babel, gatsby and Node.js Japan User Group.
    </p>
    <Buttons className="transision">
      <Button link="https://github.com/hiroppy" color={githubColor}>
        GitHub
      </Button>
      <Button link="https://twitter.com/about_hiroppy" color={twitterColor}>
        Twitter
      </Button>
      <Button link="https://www.facebook.com/abouthiroppy" color={facebookColor}>
        FaceBook
      </Button>
      <Button link="http://abouthiroppy.hatenablog.jp/" color={hatenaColor}>
        Blog
      </Button>
    </Buttons>
  </Box>
);
