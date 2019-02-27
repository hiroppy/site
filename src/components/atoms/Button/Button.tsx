import React from 'react';
import styled from 'styled-components';

export interface Props {
  link: string;
  className?: string;
}

const A = styled.a`
  border-radius: 3px;
  border-style: solid;
  border-width: 2px;
  cursor: pointer;
  display: inline-block;
  padding: 10px 25px;
  position: relative;
  text-align: center;
  transition: 0.5s;
  width: 80px;

  &:hover {
    border: 2px solid rgba(255, 255, 255, 0);

    &:after,
    &:before {
      transform: scale(1);
    }
  }

  &:before,
  &:after {
    box-sizing: border-box;
    content: '';
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    transform: scale(0);
    transition: 0.5s;
    width: 100%;
    z-index: 3;
  }
`;

export const Button: React.FC<Props> = ({ link, children, className }) => (
  <A rel="noopener" href={link} target="_blank" className={className}>
    {children}
  </A>
);
