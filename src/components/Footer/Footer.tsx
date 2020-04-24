import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import styled from 'styled-components';
import { Container as ContainerComponent } from '../templates/Container';
import { Meteor1 } from '../animations/meteor';
import { blackColor, whiteColor, mainColor } from '../../variables';
import { mediaQueries } from '../../utils/mediaQueries';
import { DataJson } from '../../../generated-types/gatsby-graphql';

const Wrapper = styled.footer`
  background: ${blackColor};
  color: ${whiteColor};
  overflow: hidden;
  position: relative;
`;

const Container = styled(ContainerComponent)`
  align-items: baseline;
  height: 200px;
  justify-content: space-around;
  min-height: auto;

  & > * {
    text-align: center;
    width: 33%;
  }

  ${mediaQueries.tablet`
   flex-direction: row;
    flex-wrap: wrap;
    height: auto;

    & > * {
      text-align: left;
      width: 100%;
    }
  `};
`;

const SNS = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Center = styled.div`
  align-items: baseline;
  height: 200px;
  justify-content: space-around;

  ${mediaQueries.tablet`
   flex-direction: row;
    flex-wrap: wrap;
    height: auto;

    & > * {
      text-align: left;
      width: 100%;
    }
  `};
`;

const A = styled.a`
  color: ${whiteColor};
  transition: color 500ms;

  line-height: 1.5;
  transition: color 500ms;
  width: 33%;

  ${mediaQueries.smartphone`
    width: 100%;
  `};

  &:hover {
    color: ${mainColor};
  }
`;

const CopyRight = styled.div`
  font-size: 1.5rem;
  text-align: right;
  padding: 20px 50px;

  ${mediaQueries.tablet`
    padding: 20px 15px;
  `};
`;

const Link: React.FC<{
  href: string;
}> = ({ href, children }) => (
  <A rel="noopener noreferrer" href={href} target="_blank">
    {children}
  </A>
);

const query = graphql`
  query {
    dataJson {
      sns {
        service
        url
      }
    }
  }
`;

export const Footer: React.FC = () => {
  const {
    dataJson: { sns },
  } = useStaticQuery<{ dataJson: DataJson }>(query);

  return (
    <Wrapper>
      {[...Array(9)].map((_, i) => (
        <Meteor1 key={i} />
      ))}
      <Container>
        <SNS>{sns && sns.map(({ url, service }: any) => <Link href={url}>{service}</Link>)}</SNS>
        <Center>
          <p>You can ping me on Twitter or my contact email.</p>
          <p>Request for work, speech, writing, etc are welcome.</p>
        </Center>
        <div>
          <p>
            <Link href="https://github.com/hiroppy/site">This site&apos;s code</Link>
          </p>
        </div>
      </Container>
      <CopyRight>© 2020 - Copyright Yuta Hiroto, All Rights Reserved.</CopyRight>
    </Wrapper>
  );
};
