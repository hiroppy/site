import React, { useEffect, useRef } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import Calendar from 'github-calendar';
import styled from 'styled-components';
import 'github-calendar/dist/github-calendar.css';
import 'github-calendar/dist/github-calendar-responsive.css';
import { Container as WrapperComponent } from '../templates/Container';
import { mainColor, blackColor, maxWidth, whiteColor } from '../../variables';
import { mediaQueries } from '../../utils/mediaQueries';

const Wrapper = styled(WrapperComponent)`
  background: ${whiteColor};
  flex-direction: column;
`;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-width: ${maxWidth}px;
  justify-content: flex-start;
`;

const Box = styled.a`
  cursor: pointer;
  text-decoration: none;
  width: 200px;

  &:after {
    background: transparent;
    content: '';
    display: block;
    height: 3px;
    margin: auto;
    transition: width 0.4s ease, background 0.4s ease;
    width: 0;
  }

  &:hover {
    &:after {
      width: 90%;
      background: ${mainColor};
    }

    > p {
      color: ${mainColor};
    }
  }

  > p {
    color: ${blackColor};
    text-align: center;
    transition: color 400ms;
  }

  ${mediaQueries.smartphone`
    width: 50% !important;
  `};

  ${mediaQueries.pcSize`
    width: 33%;
  `};
`;

const Icon = styled.div`
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;
  background-image: ${({ src }: { src: string }) => `url(${src})`};
  height: 80px;
  margin: 10px auto;
  width: 80px;
`;

const Org: React.FC<{
  title: string;
  src: string;
  link: string;
}> = (props) => (
  <Box rel="noopener" href={`https://github.com/${props.link}`} target="_blank" className="box">
    <Icon src={props.src} />
    <p>{props.title}</p>
  </Box>
);

const SponsorBox = styled(Box)`
  margin-right: 8px;
  width: inherit;
`;

const SponsorIcon = styled(Icon)`
  border-radius: 50%;
`;

const Sponsor: React.FC<{
  url: string;
  img: string;
}> = (props) => (
  <SponsorBox rel="noopener" href={props.url} target="_blank" className="box">
    <SponsorIcon src={props.img} />
  </SponsorBox>
);

const SponsorButton = styled.a`
  color: ${blackColor};
  display: block;
  margin-top: 16px;
  font-size: 2rem;
  border-bottom: 2px solid;
  padding-bottom: 4px;

  &:hover {
    color: ${mainColor};
  }
`;

const CalendarComponent = styled.div`
  max-width: ${maxWidth}px;
  border: 1px solid #ddd;
  border-radius: 3px;
  text-align: center;
  margin: 0 auto;
  width: 100%;
  overflow-x: auto;
`;

const query = graphql`
  query {
    allDataJson {
      edges {
        node {
          organizations {
            name
            link
            image
          }
        }
      }
    }
    allImageSharp {
      edges {
        node {
          fixed(width: 200) {
            srcWebp
            originalName
          }
        }
      }
    }
    githubData {
      data {
        user {
          sponsorshipsAsMaintainer {
            nodes {
              sponsor {
                avatarUrl
                name
                url
              }
            }
          }
        }
      }
    }
  }
`;

type Query = {
  allDataJson: {
    edges: {
      node: {
        organizations: {
          image: string;
          name: string;
          link: string;
        }[];
      };
    }[];
  };
  allImageSharp: {
    edges: {
      node: {
        fixed: {
          srcWebp: string;
          originalName: string;
        };
      };
    }[];
  };
  githubData: {
    data: {
      user: {
        sponsorshipsAsMaintainer: {
          nodes: {
            sponsor: {
              avatarUrl: string;
              name: string;
              url: string;
            };
          }[];
        };
      };
    };
  };
};

export const GitHub: React.FC = () => {
  const calendarEl = useRef(null);
  const {
    allDataJson: { edges: data },
    allImageSharp: { edges: images },
    githubData: {
      data: { user },
    },
  } = useStaticQuery<Query>(query);

  const orgImages = images.map(({ node: { fixed } }) => fixed);
  const orgs = data[0].node.organizations.map(({ image, ...rest }) => {
    const imageSrc = orgImages.find(({ originalName }) => originalName === `${image}.png`);

    return {
      ...rest,
      image: imageSrc ? imageSrc.srcWebp : '',
    };
  });

  const sponsors = user.sponsorshipsAsMaintainer.nodes.map(({ sponsor }) => sponsor);

  useEffect(() => {
    if (calendarEl) {
      new Calendar((calendarEl.current as unknown) as HTMLElement, 'hiroppy');
    }
  }, []);

  return (
    <Wrapper className="github">
      <h2>GitHub</h2>
      <Container>
        {orgs.map(({ image, link, name }, i) => (
          <Org src={image} link={link} title={name} key={i} />
        ))}
      </Container>
      <h3>Contributions</h3>
      <CalendarComponent ref={calendarEl} className="transition" />
      <h3>Sponsors</h3>
      <Container>
        {sponsors.map(({ avatarUrl, url }, i) => (
          <Sponsor url={url} img={avatarUrl} key={i} />
        ))}
      </Container>
      <SponsorButton href="https://github.com/sponsors/hiroppy">
        Become a sponsor to hiroppy
      </SponsorButton>
    </Wrapper>
  );
};
