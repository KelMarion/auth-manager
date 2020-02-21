import Interseptors from './Interceptors';

const Instance = (Decorator = null) => class InterseptDecorator extends Decorator {
  constructor(Instance) {
    super(Instance)
    this.interseptors = {
      request: new Interseptors(),
      response: new Interseptors(),
    }

    return this;
  }

  /**
   * Create http request isntance
   * 
   * @param {Object} options for create instance
   */
  create(options) {
    super.create(options);
    this.interseptors.request.addGroup(options.name);
    this.interseptors.response.addGroup(options.name);
  }

  /**
   * Get instance
   * 
   * @param {String} name instance
   * @returns {Object} instance
   */
  getInstance(name) {
    return super.getInstance(name);
  }

  /**
   * Dispatch request
   * 
   * @param {Object} Object with required field: name, method, url, data
   */
  dispatchRequest({name, method, url, data}) {
    const additionalProps = Array.prototype.slice.call(arguments, 1) || [null];

    return super[method](name, url, data)
      .then(response => {
        return {
          name,
          instance: this,
          response,
          next: this.nextHandler(
            name,
            this,
            response,
            additionalProps[0]
          ),
        };
      }, reject => {
        return Promise.reject({ 
          name,
          instance: this,
          response: reject.response,
          next: this.nextHandler(
            name,
            this,
            reject.response,
            additionalProps[0]
          ),
        });
      });
  }

  /**
   * 
   * 
   * @param {String} instance name
   * @param {String} name request method
   * @param {String} url
   * @param {Object} data for request
   * 
   * @returns {Promise} dispatch request
   */
  async request(name, method, url, data) {
    const additionalProps = Array.prototype.slice.call(arguments, 4) || [null];

    const chain = [this.dispatchRequest.bind(this), undefined];
    let promise = Promise.resolve({
      name,
      method,
      url,
      data,
      ...additionalProps[0]
    });

    this.interseptors.request.forEachHandlers(interceptor => {
      chain.unshift(interceptor.fulfilled, interceptor.rejected);
    }, name);

    this.interseptors.response.forEachHandlers(interceptor => {
      chain.push(interceptor.fulfilled, interceptor.rejected);
    }, name);

    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise
      .then(data => Promise.resolve(data.response))
      .catch(errors => Promise.reject(errors.response));
  }

  /**
   * Add next method to interceptor. He state promise request
   * 
   * @param {String} name, instance name
   * @param {Object} instance, link instance manager
   * @param {Object} response, response object
   * 
   * @return {Function}
   */
  nextHandler(name, instance, response) {
    const self = this;
    const addArgs = Array.prototype.slice.call(arguments, 3) || [null];

    return function next() {
      return Promise.resolve({
        name,
        instance,
        response,
        next: self.nextHandler(name, instance, response, addArgs[0]),
        ...addArgs[0],
      });
    }
  }

  /**
   * Set header for api instance
   * 
   * @param {String} Instance api name
   * @return {Function}
   */
  setHeader(name) {
    return super.setHeader(name);
  }
}

export { Instance as InterseptDecorator };
export default Instance;
