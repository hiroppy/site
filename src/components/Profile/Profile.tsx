import * as React from 'react';
import styled from 'styled-components';
import { Container as ContainerComponent } from '../templates/Container';
import { Flame } from '../Flame';
import { mainColor, blackColor } from '../../variables';
import { Link } from '../atoms/Link';

const Container = styled(ContainerComponent)`
  background: #fff;
  flex-direction: column;
`;

const P = styled.p`
  color: ${mainColor};
  margin: 0 0 4px;
`;

const H3 = styled.h3`
  color: ${blackColor};
`;

const A = styled(Link)`
  && {
    color: ${mainColor};

    &:visited {
      color: ${mainColor};
    }

    &:hover {
      color: ${blackColor};
    }
  }
`;

export const Profile: React.FC = () => (
  <Container className="profile">
    <Flame
      title="Profile"
      left={{
        title: 'Meta',
        children: (
          <>
            <H3>Yuta Hiroto</H3>
            <P>- Love OSS and traveling</P>
            <P>- A Web engineer and Architect</P>
            <P>- Optimisation, Implementation, Evangelist</P>
            <H3>Contact</H3>
            <P>- hello[at]hiroppy.me</P>
            <H3>Community</H3>
            <P>
              - <A href="https://nodejs.jp/">Japan Node.js Association</A>
            </P>
            <P>
              - <A href="https://reactjs-meetup.connpass.com/">React.js meetup</A>
            </P>
          </>
        )
      }}
      right={{
        title: 'Careers',
        children: (
          <>
            <H3>Working at</H3>
            <P>- Mercari, Inc. as a web frontend developer</P>
            <P>- Kakaku.com, Inc. as a web technical advisor</P>
            <P>- Black, Inc. as a web technical advisor</P>
            <H3>History</H3>
            <H3 as="h4">Main</H3>
            <P>- 2017/12 - 2019/10: Dwango, Inc.</P>
            <P>- 2017/06 - 2017/12: Mercari, Inc.</P>
            <P>- 2015/04 - 2017/06: Dwango, Inc.</P>
            <H3 as="h4">Side</H3>
            <P>- 2018/09 - 2019/10: Mercari, Inc. as a web technical advisor</P>
            <P>- 2018/06 - 2018/09: BizReach, Inc.</P>
            <P>- 2014/07 - 2014/08: CyberAgent, Inc.</P>
            <P>- 2013/04 - 2015/01: Eyes, JAPAN Co. Ltd.</P>
          </>
        )
      }}
    />
  </Container>
);
