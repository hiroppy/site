import * as React from 'react';
import styled from 'styled-components';
import { mediaQueries } from '../../../utils/mediaQueries';

export interface Props {
  className?: string;
}

const Section = styled.section`
  align-items: center;
  display: flex;
  justify-content: center;
  margin: auto;
  padding: 70px 50px;

  ${mediaQueries.smartphone`
    padding: 70px 15px;
    text-align: center;
  `};
`;

export const Container: React.FC<Props> = ({ children, className }) => (
  <Section className={className}>{children}</Section>
);
