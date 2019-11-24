import React from 'react';
import styled from 'styled-components';
import { Container as ContainerComponent } from '../templates/Container';
import { List } from '../atoms/List';
import { Link } from '../atoms/Link';
import { whiteColor, mainColor, blackColor } from '../../variables';
import { Flame } from '../Flame';

const slides = [
  {
    text: 'Introduce the new ESM implementation of Node.js',
    link: 'https://slides.hiroppy.me/node-esm/'
  },
  {
    text: 'webpack の イママデ と コレカラ',
    link: 'https://slides.hiroppy.me/webpack-history'
  },
  {
    text: 'the present and future of JavaScript',
    link: 'https://slides.hiroppy.me/the-present-and-future-of-JavaScript/'
  },
  {
    text: 'The event loop of node',
    link: 'https://slides.hiroppy.me/the-event-loop-of-node'
  },
  {
    text: 'performance timing api with node.js',
    link: 'http://slides.hiroppy.me/performance-timing-api-with-node.js/'
  },
  {
    text: 'worker_threads',
    link: 'https://slides.hiroppy.me/worker_threads/'
  },
  {
    text: 'how to manage the document of Node.js',
    link: 'http://slides.hiroppy.me/how-to-manage-the-document-of-Node.js/'
  }
];

const slideAccounts = [
  {
    title: 'GitHub (Main)',
    href: 'https://github.com/hiroppy/slides'
  },
  {
    title: 'SpeakerDeck',
    href: 'https://speakerdeck.com/abouthiroppy'
  },
  {
    title: 'SlideShare',
    href: 'https://www.slideshare.net/about_hiroppy'
  }
];

const articles = [
  {
    text: 'SPA + SSR + PWA の作り方とセキュリティについて',
    link: 'https://blog.hiroppy.me/entry/ssr-sample_2'
  },
  {
    text: 'OSSで報酬が支給された話',
    link: 'https://blog.hiroppy.me/entry/open-collective'
  },
  {
    text: 'OSSの現状と今後',
    link: 'https://blog.hiroppy.me/entry/current-status-and-future-of-oss'
  },
  {
    text: 'webpackの仕組みを簡潔に説明する',
    link: 'https://blog.hiroppy.me/entry/mechanism-of-webpack'
  },
  {
    text: 'Node.jsでのイベントループの仕組みとタイマーについて',
    link: 'https://blog.hiroppy.me/entry/nodejs-event-loop'
  },
  {
    text: 'Node.jsのアプリケーションデバッグ・改善方法をおさらいする',
    link: 'https://blog.hiroppy.me/entry/nodejs-performance'
  },
  {
    text: 'Node.jsのパフォーマンスチューニングのtips',
    link: 'http://blog.hiroppy.me/entry/2017/11/06/095943'
  }
];

const articleAccounts = [
  {
    title: 'Hatena Blog',
    href: 'https://blog.hiroppy.me/'
  },
  {
    title: 'Medium',
    href: 'https://medium.com/@about_hiroppy'
  }
];

const Container = styled(ContainerComponent)`
  color: ${whiteColor};
  flex-direction: column;
  background: ${mainColor};
`;

const AccountBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  & > a {
    color: ${whiteColor};
    transition: color 0.5s;
    margin: 0 10px;

    &:visited {
      color: ${whiteColor};
    }

    &:hover {
      color: ${blackColor};
    }
  }
`;

const Accounts: React.FC<{
  accounts: Array<{
    title: string;
    href: string;
  }>;
}> = ({ accounts }) => (
  <AccountBox>
    {accounts.map(({ title, href }, i) => (
      <Link href={href} key={i}>
        {title}
      </Link>
    ))}
  </AccountBox>
);

export const Material: React.FC = () => (
  <Container className="Material">
    <Flame
      title="Material"
      left={{
        title: 'Slides',
        children: (
          <>
            <List items={slides} />
            <Accounts accounts={slideAccounts} />
          </>
        )
      }}
      right={{
        title: 'Articles',
        children: (
          <>
            <List items={articles} />
            <Accounts accounts={articleAccounts} />
          </>
        )
      }}
    />
  </Container>
);
