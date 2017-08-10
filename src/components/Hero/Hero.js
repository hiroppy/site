import React from 'react';
import cx from 'classnames';
import Container from '../templates/Container';
import Button from '../atoms/Button';
import background from '../animations/meteor.css';
import star from '../animations/star.css';
import styles from './style.css';

const Hero = () => (
  <Container className={styles.hero}>
    <div>
      {
        [...Array(29)].map((_, i) => (
          <i
            key={i}
            className={star.star}
          />
        ))
      }
    </div>
    {
      [...Array(4)].map((_, i) => (
        <i
          key={i}
          className={background.meteor1}
        />
      ))
    }
    {
      [...Array(4)].map((_, i) => (
        <i
          key={i}
          className={background.meteor2}
        />
      ))
    }
    <div className={cx('transition', styles.avator)} />
    <h1 className="transition">Yuta Hiroto</h1>
    <p className="transition">I am a JavaScript junkie!</p>
    <p className="transition">
      I work as a developer and a Node.js core collaborator
      for Mercari and Node.js Foundation.
    </p>
    <div className={cx('transition', styles.buttons)}>
      <Button
        link="https://github.com/abouthiroppy"
        className={styles.github}
      >
        GitHub
      </Button>
      <Button
        link="https://twitter.com/about_hiroppy"
        className={styles.twitter}
      >
        Twitter
      </Button>
      <Button
        link="https://www.facebook.com/abouthiroppy"
        className={styles.facebook}
      >
        FaceBook
      </Button>
      <Button
        link="http://abouthiroppy.hatenablog.jp/"
        className={styles.hatena}
      >
        Blog
      </Button>
    </div>
  </Container>
);

export default Hero;
