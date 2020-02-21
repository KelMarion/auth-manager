class Interceptors {
  constructor() {
    this.handlers = { all: [] };
  }

  /**
   * Added new group to handlers
   * 
   * @param {String} name. The name group
   */
  addGroup(name) {
    name && (this.handlers[name] = []);
  }

  /**
   * Add handler to group or all groups
   * 
   * @param {Function} fullfiled callback
   * @param {Function} rejected callback
   * @param {String} groupName The group name
   */
  use(fulfilled, rejected, groupName) {
    const interceptor = {
      fulfilled: fulfilled,
      rejected: rejected,
    };

    return (groupName && this.handlers[groupName])
      ? this.handlers[groupName].push(interceptor)
      : this.handlers.all.push(interceptor);
  }

  /**
   * Iterate handlers
   * 
   * @param {Function} fn callback for each handlers
   * @param {String} groupName. Iterate only group handlers
   */
  forEachHandlers(fn, groupName = null) {
    const callHandler = handler => fn(handler);

    this.handlers['all'].forEach(callHandler);

    if (groupName)
      this.handlers[groupName].forEach(callHandler);
  }
}

export { Interceptors };
export default Interceptors;