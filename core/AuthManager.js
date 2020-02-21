/** @module core/AuthManager */
import mapMethods from './mapMethods';
import setXCsrefToken from './interseptors/setXCsrfToken';
import retryRequest from './interseptors/retryRequest';

/** 
 * Class representing authorization manager
 */
class AuthManager {
    /**
     * Create instance authorization manager
     * @param {Object} requestManager instance http library
     * @param {Object} options The options for initillize 'auth' instance
     * @param {string} options.signIn The url for sign in
     * @param {string} options.signOut The url for sign out
     * @param {string} options.removeSessions The url remove sessions
     * @param {string} options.update The url for update token
     * @param {string} options.check The url check valid token
     * @return {Object} The constructed AuthManager
     */
    constructor(requestManager, options) {
      this.requestManager = requestManager;
      this.options = options;
  
      this._accessToken = null;
      this._refreshToken = null;

      this.init();
      return this;
    }

    /**
     * Set callback on event load
     * @param {Function} fn to call on event load
     */
    onLoading(fn) {
      this.requestManager.setCallbackOnLoading(fn);
    }

    /**
     * Initilize 'auth' instance
     */
    init() {
      this.create({ name: 'auth', ...this.options });
      const authInstance = this.getInstance('auth'); 

      (['signIn',
        'signOut',
        'removeSessions',
        'update',
        'check'
      ]).forEach(method => {
        this.auth[method] = this[method].bind(this);
      });

      this.requestManager
        .interseptors
        .response
        .use(setXCsrefToken, setXCsrefToken);

      this.requestManager
        .interseptors
        .response
        .use(retryRequest, retryRequest);
    }

    /**
     * Added default interceptor
     * 
     * @param {}
     */
    static setInterceptor() {

    }

    get accessToken() {
      return this._accessToken;
    }

    set accessToken(value) {
      this.forEachInstance(name => {
        this.requestManager.setHeader(name)('Authorization', 'Bearer ' + value);
      });

      this._accessToken = value;
    }

    get refreshToken() {
      return this._refreshToken;
    }

    set refreshToken(value) {
      this._refreshToken = value;
    }

    /**
     * Sign in
     * @param {Object} data authorization data
     * @return {Promise<Object>} server response
     */
    async signIn(data) {
      let response = null;

      try {
        const { response } = await this.requestManager
          .request('auth', 'post', this.options.signIn, data);

        this.accessToken = response?.data?.access_token;
        this.refreshToken = response?.data?.refresh_token;
      } catch (e) {
        return Promise.reject(e);
      }
      
      return Promise.resolve(response);
    }
  
    /**
     * Sign out
     * @return {Promise<Object>} server response
     */
    signOut() {
      return this.requestManager
        .request('auth', 'post', this.options.signOut);
    }

    /**
     * Remove all sessions
     * @return {Promise<Object>} server response
     */
    removeSessions() {
      return this.requestManager
        .request('auth', 'post', this.options.removeSessions);
    }

    /**
     * Update token if expired
     * @return {Promise<Object>} server response
     */
    async update() {
      let responseErrors = null;
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (!accessToken || !refreshToken)
        return Promise.reject();

      this.requestManager.setHeader('auth')('Authorization', 'Bearer ' + accessToken);
      this.requestManager.setHeader('auth')('X-Session-Id', refreshToken);

      const response = await this.requestManager
        .request('auth', 'post', this.options.update)
        .catch(errors => responseErrors = errors);

      if (responseErrors)
        return Promise.reject(responseErrors);

      return Promise.resolve(response);
    }

    /**
     * Check token
     * @return {Promise<Object>} server response
     */
    check() {

    }
  
    /**
     * Initilize instance
     * @param {string} name The name instance
     */
    initInstance(name) {
      const methods = Object.create(null);

      mapMethods.forEach(methodName => {
        methods[methodName] = (url, data) => {
          return this.requestManager.request(
            name,
            methodName,
            url,
            data
          );
        };
      });

      this[name] = methods;
    }
  
    /**
     * Create instance
     * @param {Object} options for initilize instance
     * @param {string} options.name name instance
     * @param {string} options.baseURL base url
     * @param {Object} options.headers set default headers
     * @return {AuthManager} 
     */
    create(options) {
      this.requestManager.create(options)
      this.initInstance(options.name);

      return this;
    }

    getInstance(name) {
      return this.requestManager.getInstance(name);
    }

    forEachInstance(callback) {
      const instances = this.getInstance();

      for (const key of Object.keys(instances)) {
        callback(key, instances[key]);
      }
    }
  };

export default AuthManager;
  