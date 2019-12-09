exports.corsWhitelist = () =>
{
  const whitelist = ['http://localhost:3000', 'http://localhost:4200', 'https://yadegariahmad.github.io'];
  const corsOptions = {
    origin: (origin, callback) =>
    {
      if (whitelist.indexOf(origin) !== -1)
      {
        callback(null, true)
      } else
      {
        callback(new Error('Not allowed by CORS'))
      }
    }
  }

  return corsOptions;
}