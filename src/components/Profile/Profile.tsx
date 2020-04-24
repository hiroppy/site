import * as React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import styled from 'styled-components';
import { Container as ContainerComponent } from '../templates/Container';
import { Flame } from '../Flame';
import { mainColor, blackColor } from '../../variables';
import { Link } from '../atoms/Link';
import { DataJson } from '../../../generated-types/gatsby-graphql';

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

const query = graphql`
  query {
    dataJson {
      jobs {
        current {
          name
          position
        }
        history {
          main {
            name
            period
          }
          side {
            name
            period
          }
        }
      }
    }
  }
`;

export const Profile: React.FC = () => {
  const { dataJson } = useStaticQuery<{ dataJson: DataJson }>(query);
  const { current, history } = dataJson?.jobs!;

  return (
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
          ),
        }}
        right={{
          title: 'Careers',
          children: (
            <>
              <H3>Working at</H3>
              {current &&
                current.map(({ name, position }: any) => (
                  <P>
                    - {name} as {position}
                  </P>
                ))}
              <H3>History</H3>
              <H3 as="h4">Main</H3>
              {history?.main?.map(({ name, period }: any) => (
                <P>
                  - {period}: {name}
                </P>
              ))}
              <H3 as="h4">Side</H3>
              {history?.side?.map(({ name, period }: any) => (
                <P>
                  - {period}: {name}
                </P>
              ))}
            </>
          ),
        }}
      />
    </Container>
  );
};
