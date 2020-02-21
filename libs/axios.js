import axios from 'axios';

class AxiosWrapper {
  constructor(options) {
    if (!options && !options.name)
      throw new Error('Error create instance. Options field "name" not found.');

    this.instance = axios.create(options);
    return this;
  }

  getInstance(name) {
    return (name && this.instances[name])
      ? this.instances[name]
      : this.instances;
  }

  post(url, data) {
    return this.instance.post(url, data);
  }

  get(url, data) {
    return this.instance.get(
      url,
      { params: data }
    );
  }

  put(url, data) {
    return this.instance.put(
      url,
      data
    );
  }

  delete(url, data) {
    return this.instance.delete(
      url,
      data
    );
  }

  patch(url, data) {
    return this.instance.patch(
      url,
      data
    );
  }

  setHeader(prop, value) {
    this.instance.defaults.headers.common[prop] = value;
  }

  setOptions(name) {

  }
};

export default AxiosWrapper;
