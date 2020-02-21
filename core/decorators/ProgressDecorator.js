class StateRequest {
  constructor() {
    this.requests = [];
  }

  add() {
    this.requests.push(1);
  }

  remove() {

  }

  isSending() {
    return !!this.requests.length;
  }
}

const Instance = (Decorator = null) => class ProgressDecorator extends Decorator {
  constructor() {
    super(...arguments);
    this.isLoading = false;

    this.state = new StateRequest();

    this.loadingCallback = null;
  }

  get loading() {
    return this.isLoading;
  }

  set loading(value) {
    this.onSend(
      value, // isLoading
      (this.state.isSending() && value) // isDisabled
    );
    this.isLoading = value;
  }

  checkNextRequest() {
    return new Promise((resolve) => setTimeout(() => {
      resolve(this.state.isSending());
    }, 500))
  }

  /**
   * Decorate Dispatch request added loading
   * 
   * @param {Object} Object with required field: name, method, url, data
   */
  async dispatchRequest() {
    let resRejected = null;

    this.state.add();
    this.loading = true;

    let resFullfiled = await super.dispatchRequest(...arguments)
      .catch(errors => resRejected = errors);

    this.state.remove();

    this.loading = false;

    if (resRejected) {
      return Promise.reject(resRejected);
    }

    return Promise.resolve(resFullfiled);
  }

  onSend(isLoading, isDisabled) {
    if (typeof this.loadingCallback === 'function')
      this.loadingCallback(isLoading, isDisabled)
  }

  setCallbackOnLoading(fn) {
    this.loadingCallback = fn;
  }
}

export { Instance as ProgressDecorator };
export default Instance;