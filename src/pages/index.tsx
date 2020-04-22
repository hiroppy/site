import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { Head } from '../components/Head';
import { App } from '../components/App';
import { Hero } from '../components/Hero';
import { Profile } from '../components/Profile';
import { GitHub } from '../components/GitHub';
import { Material } from '../components/Material';
import { Footer } from '../components/Footer';

const query = graphql`
  query {
    site {
      siteMetadata {
        title
        description
      }
    }
  }
`;

const Index: React.FC = () => {
  const {
    site: {
      siteMetadata: { title, description },
    },
  } = useStaticQuery(query);

  return (
    <>
      <Head title={title} description={description} />
      <App>
        <Hero />
        <Profile />
        <GitHub />
        <Material />
        <Footer />
      </App>
    </>
  );
};

export default Index;
