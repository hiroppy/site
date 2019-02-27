import * as React from 'react';
import styled from 'styled-components';
import { mediaQueries } from '../../utils/mediaQueries';

export interface Props {
  title: string;
  left: {
    title: string;
    children: React.ReactNode;
  };
  right: {
    title: string;
    children: React.ReactNode;
  };
}

const Box = styled.div`
  border: 3px solid;
  border-radius: 3px;
  display: flex;
  padding: 16px 0;
  width: 80%;

  ${mediaQueries.pcSize`
    flex-direction: column;
    width: 100%;
  `};
`;

const Section = styled.section`
  flex: 0.5;
  text-align: center;
  max-size: 50%;

  ${mediaQueries.pcSize`
    max-width: 100%%;
  `};
`;

const SectionTitle = styled.h3`
  border-bottom: 3px solid;
  margin: 20px auto;
  padding-bottom: 5px;
  width: 60%;
`;

const SectionBox = styled.div`
  text-align: left;
  margin: 0 50px;
`;

export const Flame: React.FC<Props> = ({ title, left, right }) => (
  <>
    <h2>{title}</h2>
    <Box>
      <Section>
        <SectionTitle>{left.title}</SectionTitle>
        <SectionBox className="transition">{left.children}</SectionBox>
      </Section>
      <Section>
        <SectionTitle>{right.title}</SectionTitle>
        <SectionBox className="transition">{right.children}</SectionBox>
      </Section>
    </Box>
  </>
);
