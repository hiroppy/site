import React from 'react';
import cx from 'classnames';
import styles from './style.css';

const Container = (props) => (
  <section className={cx(styles.container, props.className)}>
    {
      props.children
    }
  </section>
);

export default Container;
