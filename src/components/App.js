import React from 'react';
import ScrollReveal from 'scrollreveal';
import Hero from './Hero';
import Profile from './Profile';
import GitHub from './GitHub';
import Material from './Material';
import Footer from './Footer';

import 'normalize.css';
import './common.css';
import styles from './app.css';

export const sr = ScrollReveal();

class App extends React.Component {
  componentDidMount() {
    const config = {
      origin  : 'top',
      duration: 1000,
      delay   : 300,
      scale   : 1,
      easing  : 'ease',
      reset   : true
    };

    sr.reveal('.transition', config);
  }

  render() {
    return (
      <div className={styles.container}>
        <Hero />
        <Profile />
        <GitHub />
        <Material />
        <Footer />
      </div>
    );
  }
}

export default App;
