module.exports = ({ config }) => ({
  ...config,
  extra: {
    apiUrl: process.env.API_URL || undefined,
  },
});
