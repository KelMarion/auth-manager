export default function ({ name, instance, response, next }) {
  const token = response?.headers?.['x-csrf-token'];

  token && instance
    .getInstance(name)
    .setHeader('X-Csrf-Token', token);

  return next();
};
