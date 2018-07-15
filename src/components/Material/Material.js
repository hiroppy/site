import React from 'react';
import cx from 'classnames';
import Container from '../templates/Container';
import List from '../atoms/List';
import styles from './style.css';

const slides = [
  {
    text: 'the present and future of JavaScript',
    link: 'https://slides.hiroppy.me/the-present-and-future-of-JavaScript/'
  },
  {
    text: 'how to build a slide',
    link: 'https://slides.hiroppy.me/how-to-build-a-slide/'
  },
  {
    text: 'performance timing api with node.js',
    link: 'http://slides.hiroppy.me/performance-timing-api-with-node.js/'
  },
  {
    text: 'worker_threads (Japanese)',
    link: 'https://slides.hiroppy.me/worker_threads/'
  },
  {
    text: 'how to manage the document of Node.js',
    link: 'http://slides.hiroppy.me/how-to-manage-the-document-of-Node.js/'
  }
];

const articles = [
  {
    text: 'Markdownだけで綺麗なスライドを作るCLIを作っている',
    link: 'http://blog.hiroppy.me/entry/fusuma'
  },
  {
    text: 'PWAの実装をしてみた',
    link: 'http://blog.hiroppy.me/entry/2017/07/28/101318'
  },
  {
    text: 'JavaScriptの現状と将来というタイトルで発表してきた',
    link: 'http://blog.hiroppy.me/entry/the-present-and-future-of-JavaScript'
  },
  {
    text: 'Node.jsのパフォーマンスチューニングのtips',
    link: 'http://blog.hiroppy.me/entry/2017/11/06/095943'
  },
  {
    text: 'Node.jsにworkerが入った',
    link: 'http://blog.hiroppy.me/entry/worker_threads'
  },
  {
    text: 'webpack4への簡単なマイグレーションガイド',
    link: 'http://blog.hiroppy.me/entry/migrate-to-webpack4'
  }
];

const Account = (props) => (
  <h4 className={styles.account}>
    {
      props.children
    }
    <a
      rel="noopener"
      href={props.link}
      target="_blank"
    >
      &gt;
    </a>
  </h4>
);

const Material = () => (
  <Container className={styles.wrapper}>
    <h2>Material</h2>
    <div className={styles.container}>
      <div className={styles.box}>
        <h3 className={styles.title}>Slides</h3>
        <div className={cx(styles.list, 'transition')}>
          <Account link="https://github.com/hiroppy/slides">
            Slides(Main)
          </Account>
          <List
            items={slides}
            className={styles.li}
          />
          <Account link="https://speakerdeck.com/abouthiroppy">
            Speaker Deck
          </Account>
          <Account link="https://www.slideshare.net/about_hiroppy">
            Slide Share
          </Account>
          <Account link="http://niconare.nicovideo.jp/users/48434166">
            Niconare
          </Account>
        </div>
      </div>
      <div className={styles.box}>
        <h3 className={styles.title}>Articles</h3>
        <div className={cx(styles.list, 'transition')}>
          <Account link="http://profile.hatena.ne.jp/about_hiroppy/">
            Hatena Blog
          </Account>
          <List
            items={articles}
            className={styles.li}
          />
          <Account link="https://medium.com/@about_hiroppy">
            Medium
          </Account>
        </div>
      </div>
    </div>
  </Container>
);

export default Material;
