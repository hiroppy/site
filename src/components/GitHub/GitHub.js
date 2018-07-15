import React from 'react';
import cx from 'classnames';
import Calendar from 'github-calendar';
import Container from '../templates/Container';
import { sr } from '../App';

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
import myDish from '../../../images/my-dish.jpeg';

import styles from './style.css';

const Org = (props) => (
  <a
    rel="noopener"
    href={`https://github.com/${props.link}`}
    target="_blank"
    className={cx('box', styles.box)}
  >
    <div
      style={{ backgroundImage: `url(${props.src})` }}
      className={styles.icon}
    />
    <p className={styles.title}>{props.title}</p>
  </a>
);

class GitHub extends React.Component {
  componentDidMount() {
    new Calendar(this.calendar, 'hiroppy');

    // [TODO] combine
    const config = {
      origin  : 'top',
      duration: 1000,
      delay   : 300,
      scale   : 1,
      easing  : 'ease',
      reset   : true
    };

    sr.reveal('.box', config, 50);
  }

  render() {
    return (
      <Container className={styles.wrapper}>
        <h2>GitHub</h2>
        <div className={styles.container}>
          <Org
            src={nodejs}
            link="nodejs"
            title="Node.js Foundation"
          />
          <Org
            src={nodejsjp}
            link="nodejsjp"
            title="nodejsjp"
          />
          <Org
            src={babel}
            link="babel"
            title="Babel"
          />
          <Org
            src={webpack}
            link="webpack"
            title="webpack"
          />
          <Org
            src={maintainer}
            link="maintainers"
            title="Open Source Maintainers on GitHub"
          />
          <Org
            src={stylelint}
            link="stylelint"
            title="stylelint"
          />
          <Org
            src={crowi}
            link="crowi"
            title="crowi"
          />
          <Org
            src={jekyll}
            link="jekyll"
            title="jekyll"
          />
          <Org
            src={clipy}
            link="clipy"
            title="Clipy Project"
          />
          <Org
            src={nicoHaco}
            link="nicohaco"
            title="NicoHaco"
          />
          <Org
            src={myDish}
            link="my-dish"
            title="my-dish"
          />
        </div>
        <h2>Contributions</h2>
        <div
          ref={(calendar) => this.calendar = calendar}
          className={cx(styles.calendar, 'transition')}
        />
      </Container>
    );
  }
}

export default GitHub;
