export default async function ({ name, instance, response, next, retry }) {
  const status = response?.status;

  if (status === 401) {
    await instance.getInstance('auth').update();
    await retry();
  }

  return next();
}