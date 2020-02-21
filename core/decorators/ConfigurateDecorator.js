const instancte = (Decorator = null) => class ConfigurateDecorator extends Decorator {
  constructor(Instance) {
    super(Instance);
    return this;
  }

  /**
   * Decorate request, added option argument
   * 
   * @param {string} instance name
   * @param {string} name request method
   * @param {string} url
   * @param {(Object | string | number)} data for request
   * @param {Object} options The options for request
   * 
   * @return {Promise<Object>} return request response
   */
  async request (name, method, url, data) {
    await super.request(...arguments);
  }
}

export { instancte as ConfigurateDecorator };
export default instancte;
