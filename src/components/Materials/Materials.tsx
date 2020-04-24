import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import styled from 'styled-components';
import { Container as ContainerComponent } from '../templates/Container';
import { List } from '../atoms/List';
import { Link } from '../atoms/Link';
import { whiteColor, mainColor, blackColor } from '../../variables';
import { Flame } from '../Flame';
import { DataJson } from '../../../generated-types/gatsby-graphql';

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

const query = graphql`
  query {
    dataJson {
      materials {
        accounts {
          article {
            title
            href
          }
          slide {
            href
            title
          }
        }
        articles {
          link
          text
        }
        slides {
          link
          text
        }
      }
    }
  }
`;

export const Materials: React.FC = () => {
  const {
    dataJson: { materials },
  } = useStaticQuery<{ dataJson: DataJson }>(query);

  return (
    <Container className="Material">
      <Flame
        title="Materials"
        left={{
          title: 'Slides',
          children: (
            <>
              <List items={materials?.slides as any} />
              <Accounts accounts={materials?.accounts?.slide as any} />
            </>
          ),
        }}
        right={{
          title: 'Articles',
          children: (
            <>
              <List items={materials?.articles as any} />
              <Accounts accounts={materials?.accounts?.article as any} />
            </>
          ),
        }}
      />
    </Container>
  );
};
