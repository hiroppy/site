import React, { useEffect, useRef } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import Calendar from 'github-calendar';
import styled from 'styled-components';
import 'github-calendar/dist/github-calendar.css';
import 'github-calendar/dist/github-calendar-responsive.css';
import { Container as WrapperComponent } from '../templates/Container';
import { mainColor, blackColor, maxWidth, whiteColor } from '../../variables';
import { GithubData } from '../../../generated-types/gatsby-graphql';
import { organizationsWhitelist } from '../../../graphql/github';

const Wrapper = styled(WrapperComponent)`
  background: ${whiteColor};
  flex-direction: column;
`;

const Container = styled.div<{ size: number }>`
  grid-gap: 8px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(${({ size }) => size}px, 1fr));
  width: 100%;
  max-width: 1200px;
`;

const SubTitle = styled.h3`
  margin-top: 32px;
`;

const Box = styled.a`
  cursor: pointer;
  text-decoration: none;

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
`;

const BoxContainer: React.FC<{
  url: string;
}> = ({ url, children }) => (
  <Box rel="noopener" href={url} target="_blank" className="box" aria-label="icon">
    {children}
  </Box>
);

const Icon = styled.img`
  display: block;
  height: 80px;
  margin: 10px auto;
  width: 80px;
`;

const SponsorIcon = styled(Icon)`
  border-radius: 50%;
`;

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
    githubData {
      data {
        user {
          sponsorshipsAsMaintainer {
            nodes {
              sponsor {
                id
                avatarUrl
                name
                url
              }
            }
          }
          organizations {
            nodes {
              id
              avatarUrl
              name
              url
            }
          }
        }
      }
    }
  }
`;

export const GitHub: React.FC = () => {
  const calendarEl = useRef(null);
  const {
    githubData: { data },
  } = useStaticQuery<{ githubData: GithubData }>(query);

  if (!data?.user) {
    return null;
  }

  const { sponsorshipsAsMaintainer, organizations } = data.user;
  const orgs = organizations?.nodes!.filter((organization) =>
    organizationsWhitelist.includes(organization?.name || '')
  );
  const sponsors = sponsorshipsAsMaintainer?.nodes?.map((sponsor) => sponsor!.sponsor);

  useEffect(() => {
    if (calendarEl) {
      new Calendar((calendarEl.current as unknown) as HTMLElement, 'hiroppy');
    }
  }, []);

  return (
    <Wrapper className="github">
      <h2>GitHub</h2>
      <Container size={150}>
        {orgs &&
          orgs.map(({ avatarUrl, url, name, id }: any) => (
            <BoxContainer url={url} key={id}>
              <Icon src={avatarUrl} loading="lazy" alt={name} />
              <p>{name}</p>
            </BoxContainer>
          ))}
      </Container>
      <SubTitle>Sponsors</SubTitle>
      <Container size={80}>
        {sponsors &&
          sponsors.map(({ avatarUrl, url, id, name }: any) => (
            <BoxContainer url={url} key={id}>
              <SponsorIcon src={avatarUrl} loading="lazy" alt={name || 'user'} />
            </BoxContainer>
          ))}
      </Container>
      <SponsorButton href="https://github.com/sponsors/hiroppy">
        Become a sponsor to hiroppy
      </SponsorButton>
      <SubTitle>Contributions</SubTitle>
      <CalendarComponent ref={calendarEl} className="transition" />
    </Wrapper>
  );
};
