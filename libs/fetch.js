
class FetchInstance {
  constructor(options) {
    this.baseURL = options.baseURL || '';
    this.headers = options.headers || {};
    return this;
  }

  getUrl(url) {
    const normUrl = url.replace(/^\//, '');
    this.baseURL = this.baseURL.replace(/\/$/, '');
    return this.baseURL + '/' + normUrl;
  }

  get(url, params) {
    return fetch(this.getUrl(url), {
      method: 'GET',
      ...this.getHeaders(),
    })
  }

  post(url, data) {
    return new Promise(async (resolve, reject) => {
      const response = await fetch(this.getUrl(url), {
        method: 'POST',
        ...this.getHeaders(),
        body: JSON.stringify(data),
      });
      const body = await response.json();

      return resolve(body);
    }) 
  }

  put(url, data) {
    return fetch(this.getUrl(url), {
      method: 'PUT',
      data: JSON.stringify(data),
      ...this.getHeaders()
    })
  }

  patch(url, data) {
    return fetch(this.getUrl(url), {
      method: 'PATCH',
      body: JSON.stringify(data),
      ...this.getHeaders(),
    })
  }

  delete(url, data) {
    return fetch(this.getUrl(url), {
      method: 'DELETE',
      body: JSON.stringify(data),
      ...this.getHeaders()
    });
  }

  setHeader(name, value) {
    if (
      typeof name !== 'string' &&
      name !== '' &&
      typeof value !== 'string' &&
      value !== ''
    )
      return null;

    this.headers[name] = value;
  }

  getHeaders() {
    return { headers: this.headers };
  }
}

export { FetchInstance };
export default FetchInstance;