const Instance = (Decorator = null) => class RetryDecorator extends Decorator {
  constructor(Instance) {
    super(Instance);
    this.lastRequest = [];
  }

  /**
   * Add request to queue
   * 
   * @param {Object[]}
   */
  add() {
    this.clear();
    this.lastRequest.push([...arguments]);
  }

  /**
   * Clear queue last requests.
   * 
   * @returns {VoidFunction}
   */
  clear() {
    if (this.isFulledQueue())
      this.lastRequest = [];
  }

  isFulledQueue() {
    return this.lastRequest.length >= 4
  }

  async retry() {
    for (let args of this.lastRequest.reverse()) {
      await super.dispatchRequest(...args);
    }

    this.clear();
  }

  async dispatchRequest({name, method, url, data}) {
    let resRejected = null;

    this.add(...arguments);

    const resResolve = await super.dispatchRequest({
      name,
      method,
      url,
      data,
    }, {
      retry: this.retry.bind(this),
    })
      .catch(errors => resRejected = errors);

    if (resRejected) {
      return Promise.reject(resRejected);
    }

    return Promise.resolve(resResolve);
  }
}

export { Instance };
export default Instance;