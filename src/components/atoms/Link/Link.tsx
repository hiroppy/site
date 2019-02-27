import * as React from 'react';
import { whiteColor, blackColor } from '../../../variables';
import styled from 'styled-components';

const A = styled.a`
  color: ${whiteColor};
  transition: color 0.5s;
  margin: 0 10px;

  &:visited {
    color: ${whiteColor};
  }

  &:hover {
    color: ${blackColor};
  }
`;

export interface Props {
  href: string;
  className?: string;
}

export const Link: React.FC<Props> = ({ children, href, className }) => (
  <A rel="noopener" href={href} target="_blank" className={className}>
    {children}
  </A>
);
