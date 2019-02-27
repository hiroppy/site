import React from 'react';
import 'github-calendar/dist/github-calendar.css';
import 'github-calendar/dist/github-calendar-responsive.css';
import Calendar from 'github-calendar';
import styled from 'styled-components';
import { Container as WrapperComponent } from '../templates/Container';
import { sr } from '../App';
import { mainColor, blackColor, maxWidth, whiteColor } from '../../variables';
import { mediaQueries } from '../../utils/mediaQueries';

import nodejs from '../../../images/nodejs.png';
import nodejsjp from '../../../images/nodejsjp.png';
import babel from '../../../images/babel.png';
import webpack from '../../../images/webpack.png';
import maintainer from '../../../images/maintainer.png';
import stylelint from '../../../images/stylelint.png';
import crowi from '../../../images/crowi.png';
import clipy from '../../../images/clipy.png';
import jekyll from '../../../images/jekyll.png';
import nicoHaco from '../../../images/nicohaco.png';
import gatsby from '../../../images/gatsby.png';

const Wrapper = styled(WrapperComponent)`
  background: ${whiteColor};
  flex-direction: column;
`;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-width: ${maxWidth}px;
  justify-content: flex-start;
`;

const Box = styled.a`
  cursor: pointer;
  text-decoration: none;
  width: 200px;

  &:after {
    background: transparent;
    content: '';
    display: block;
    height: 3px;
    margin: auto;
    transition: width 0.4s ease, background 0.4s ease;
    width: 0;
  }

  &:hover {
    &:after {
      width: 90%;
      background: ${mainColor};
    }

    > p {
      color: ${mainColor};
    }
  }

  > p {
    color: ${blackColor};
    text-align: center;
    transition: color 400ms;
  }

  ${mediaQueries.smartphone`
    width: 50% !important;
  `};

  ${mediaQueries.pcSize`
    width: 33%;
  `};
`;

const Icon = styled.div`
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;
  background-image: ${({ src }: { src: string }) => `url(${src})`};
  height: 80px;
  margin: 10px auto;
  width: 80px;
`;

const Org: React.FC<{
  title: string;
  src: string;
  link: string;
}> = (props) => (
  <Box rel="noopener" href={`https://github.com/${props.link}`} target="_blank" className="box">
    <Icon src={props.src} />
    <p>{props.title}</p>
  </Box>
);

const CalendarComponent = styled.div`
  max-width: ${maxWidth}px;
  border: 1px solid #ddd;
  border-radius: 3px;
  text-align: center;
  margin: 0 auto;
  width: 100%;
  overflow-x: auto;
`;

export class GitHub extends React.PureComponent {
  calendar: HTMLElement | null;

  constructor(props: {}) {
    super(props);

    this.calendar = null;
  }

  componentDidMount() {
    if (this.calendar) {
      new Calendar(this.calendar, 'hiroppy');
    }

    // [TODO] combine
    const config = {
      origin: 'top',
      duration: 1000,
      delay: 300,
      scale: 1,
      easing: 'ease',
      reset: true
    };

    sr.reveal('.box', config, 50);
  }

  render() {
    return (
      <Wrapper className="github">
        <h2>GitHub</h2>
        <Container>
          <Org src={nodejs} link="nodejs" title="node.js Foundation" />
          <Org src={babel} link="babel" title="babel" />
          <Org src={webpack} link="webpack" title="webpack" />
          <Org src={gatsby} link="gatsbyjs" title="gatsby" />
          <Org src={maintainer} link="maintainers" title="open source maintainers on github" />
          <Org src={stylelint} link="stylelint" title="stylelint" />
          <Org src={jekyll} link="jekyll" title="jekyll" />
          <Org src={crowi} link="crowi" title="crowi" />
          <Org src={nodejsjp} link="nodejsjp" title="nodejsjp" />
          <Org src={clipy} link="clipy" title="clipy project" />
          <Org src={nicoHaco} link="nicohaco" title="nicohaco" />
        </Container>
        <h3>Contributions</h3>
        <CalendarComponent ref={(calendar) => (this.calendar = calendar)} className="transition" />
      </Wrapper>
    );
  }
}
