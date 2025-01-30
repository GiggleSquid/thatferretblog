const purgeImport = require('@fullhuman/postcss-purgecss')
const purgeCSSPlugin = purgeImport.purgeCSSPlugin || purgeImport.default || purgeImport
const purgecss = purgeCSSPlugin({
  content: ["./hugo_stats.json"],
  defaultExtractor: (content) => {
    const els = JSON.parse(content).htmlElements;
    return [...(els.tags || []), ...(els.classes || []), ...(els.ids || [])];
  },
  safelist: [],
  variables: true,
});

module.exports = {
  plugins: [
    ...(process.env.HUGO_ENVIRONMENT === "production" ? [purgecss] : []),
  ],
};
