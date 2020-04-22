const { resolve } = require('path');
const { config } = require('dotenv');

config();

module.exports = {
  siteMetadata: {
    title: 'universe',
    description: "hiroppy's universe",
    author: 'hiroppy',
    languages: ['en'],
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-typescript',
      options: {
        isTSX: true,
        allExtensions: true,
      },
    },
    'gatsby-plugin-styled-components',
    'gatsby-plugin-react-helmet',
    'gatsby-transformer-json',
    // have to do this order if want to get data from json
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'data',
        path: resolve(__dirname, 'data'),
      },
    },

    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: resolve(__dirname, 'static/images'),
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: "hiroppy's universe",
        short_name: 'universe',
        start_url: '/',
        background_color: '#f5f5f5',
        theme_color: '#3498db',
        display: 'minimal-ui',
        icon: resolve(__dirname, 'static/images/avatar.jpg'),
      },
    },
    {
      resolve: 'gatsby-source-github-api',
      options: {
        token: process.env.GITHUB_TOKEN,
        graphQLQuery: `
          {
            user(login: "hiroppy") {
              sponsorshipsAsMaintainer(first: 50, orderBy: {field: CREATED_AT, direction: ASC}) {
                nodes {
                  sponsor {
                    avatarUrl(size: 150)
                    name
                    url
                  }
                }
              }
            }
          }
        `,
      },
    },
  ],
};
