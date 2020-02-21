import Fetch from './libs/fetch';
import Axios from './libs/axios';

import {
  InstanceManagerDecorator,
  InterceptDecorator,
  ProgressDecorator,
  ConfigurateDecorator,
  RetryDecorator,
} from './core/decorators';

import AuthManager from './core/AuthManager';

const mapHttpRequestLib = {
  axios: Axios,
  fetch: Fetch,
};

/**
 * Factory create http request instance
 * 
 * @param {Object} options The options for create instance authorization
 * @param {String} lib The name request lib
 * 
 * @returns {Object} http request instance
 */
function createInstance(options, lib = 'axios') {
  // chain decorators
  const Instance = ([
    InstanceManagerDecorator(),
    InterceptDecorator,
    RetryDecorator,
    ProgressDecorator,
  ]).reduce((decorated, decorator, i) => {
    return (i === 0)
    ? decorated()
    : decorator(decorated)
  });

  const requestInstance = new Instance(
    mapHttpRequestLib[lib],
    options
  );

  return new AuthManager(requestInstance, options);
}

export { createInstance as AuthManager };
export default createInstance;