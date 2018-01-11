import React from 'react';
import Container from '../templates/Container';
import styles from './style.css';

const Profile = () => (
  <Container className={styles.wrapper}>
    <div className={styles.container}>
      <div className={styles.box}>
        <h1 className={styles.name}>Yuta Hiroto</h1>
        <span className="transition">- Love OSS and traveling</span><br />
        <span className="transition">- Node.js Core Collaborator</span><br />
        <span className="transition">- Node.js Japan User Group</span><br />
        <span className="transition">- Optimisation, Implementation, Evangelist</span>
        <h2>Core skills</h2>
        <span className="transition">
          JavaScript, Node.js, React, Redux, Express, Koa, etc...
        </span>
        <h2>Watching</h2>
        <span className="transition">
          Node.js, TC39, WHATWG, Babel, webpack, Ava, etc...
        </span>
      </div>
      <div className={styles.box}>
        <h2>Contact</h2>
        <span className="transition">hello[at]about-hiroppy.com</span><br /><br />
        <span className="transition">Request for writing, speech, work etc...</span>
        <h2>My Career</h2>
        <h3>Dwango</h3>
        <span className="transition">2017/12 -</span>
        <h3>Mercari</h3>
        <span className="transition">2017/06 -</span>
        <h3>Dwango</h3>
        <span className="transition">2015/04 - 2017/06</span>
      </div>
    </div>
  </Container>
);

export default Profile;
