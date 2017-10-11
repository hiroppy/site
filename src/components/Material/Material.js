import React from 'react';
import cx from 'classnames';
import Container from '../templates/Container';
import List from '../atoms/List';
import styles from './style.css';

const slides = [
  {
    text: 'the present and future of JavaScript',
    link: 'https://abouthiroppy.github.io/slides/the-present-and-future-of-JavaScript/'
  },
  {
    text: 'node-whatwg-url',
    link: 'https://abouthiroppy.github.io/slides/node-whatwg-url/'
  },
  {
    text: 'node@8.0.0 (Japanese)',
    link: 'https://abouthiroppy.github.io/slides/node8/'
  },
  {
    text: 'nicohaco (Japanese)',
    link: 'https://abouthiroppy.github.io/slides/nicohaco/'
  }
];

const articles = [
  {
    text: 'PWAの実装をしてみた',
    link: 'http://abouthiroppy.hatenablog.jp/entry/2017/07/28/101318'
  },
  {
    text: 'JavaScriptの現状と将来というタイトルで発表してきた',
    link: 'http://abouthiroppy.hatenablog.jp/entry/the-present-and-future-of-JavaScript'
  },
  {
    text: '簡単なアプリケーションでwebpackとbabelの設定をしなくて済むライブラリを作った',
    link: 'http://abouthiroppy.hatenablog.jp/entry/2017/09/11/101235'
  },
  {
    text: '次のリリースであるBabel7の主な変更点まとめ',
    link: 'http://abouthiroppy.hatenablog.jp/entry/babel7'
  },
  {
    text: 'ドワンゴを退職してメルカリに入社した',
    link: 'http://abouthiroppy.hatenablog.jp/entry/2017/06/01/100000'
  },
  {
    text: 'メモ: Node.jsとAyo.jsに分裂したという話',
    link: 'http://abouthiroppy.hatenablog.jp/entry/2017/08/26/094425'
  }
];

const Account = (props) => (
  <h4 className={styles.account}>
    {
      props.children
    }
    <a
      target="_blank"
      href={props.link}
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
          <Account link="https://github.com/abouthiroppy/slides">
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
