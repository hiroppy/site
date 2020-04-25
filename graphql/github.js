const organizationsWhitelist = [
  'Node.js Japan User Group',
  'webpack',
  'Jekyll',
  'crowi',
  'Babel',
  'Node.js',
  'stylelint',
  'dwango JavaScript repositories',
  'Gatsby',
  'Clipy Project',
  'Danger',
  'Open Source Maintainers on GitHub',
  'NicoHaco',
  'reactjapan',
];

const query = `{
  user(login: "hiroppy") {
    sponsorshipsAsMaintainer(first: 50, orderBy: {field: CREATED_AT, direction: ASC}) {
      nodes {
        sponsor {
          id
          avatarUrl(size: 100)
          name
          url
        }
      }
    }
    organizations(first: 50) {
      nodes {
        id
        avatarUrl(size: 120)
        name
        url
      }
    }
  }
}`;

module.exports = {
  query,
  organizationsWhitelist,
};
