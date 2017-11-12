import React from 'react';
import Container from '../templates/Container';
import background from '../animations/meteor.css';
import styles from './style.css';

const Footer = () => (
  <footer className={styles.wrapper}>
    {
      [...Array(5)].map((_, i) => (
        <div
          key={i}
          className={background.meteor1Wrapper}
        >
          <i
            className={background.meteor1}
          />
        </div>
      ))
    }
    <Container className={styles.container}>
      <div className={styles.sns}>
        <a href="https://github.com/abouthiroppy">GitHub</a>
        <a href="https://twitter.com/about_hiroppy">Twitter</a>
        <a href="https://www.facebook.com/abouthiroppy">FaceBook</a>
        <a href="http://b.hatena.ne.jp/about_hiroppy">Hatena</a>
        <a href="https://www.linkedin.com/in/yuta-hiroto-340b4952/">LinkedIn</a>
        <a href="https://connpass.com/user/about_hiroppy/">Connpass</a>
      </div>
      <div className={styles.center}>
        <p>
          You can ping me on&nbsp;
          <a
            rel="noopener noreferrer"
            href="https://twitter.com/about_hiroppy"
            target="_blank"
            className={styles.link}
          >
            Twitter
          </a>
          &nbsp; or my contact email.
        </p>
        <p>Request for work, speech, writing, etc are welcome.</p>
      </div>
      <div>
        <p>
          <a
            rel="noopener noreferrer"
            href="https://github.com/abouthiroppy/site"
            target="_blank"
            className={styles.link}
          >
            This site&apos;s codes
          </a>
        </p>
        <p>
          <a
            rel="noopener noreferrer"
            href="http://houzicha.about-hiroppy.com"
            target="_blank"
            className={styles.link}
          >
            Old site is houzicha
          </a>
        </p>
      </div>
    </Container>
    <div className={styles.copyright}>
      © 2017 - Copyright Yuta Hiroto, All Rights Reserved.
    </div>
  </footer>
);

export default Footer;
