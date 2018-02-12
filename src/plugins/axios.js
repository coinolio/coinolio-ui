import Axios from 'axios';
import Vue from 'vue';

const inBrowser = typeof window !== 'undefined';
const API_URL = process.env.API_URL || 'http://localhost:8080';

const axios = Axios.create({
  baseURL: API_URL + (process.env.API_PREFIX || '/api'),
  timeout: 10000
});

import tough from 'tough-cookie';
const cookiejar = new tough.CookieJar();

axios.interceptors.request.use( (config) => {
  cookiejar.getCookies(config.url, {}, (err, cookies) => {
    if (cookies.length) {
      config.headers.cookie = cookies.join('; ');
    }
  });
  return config;
});

// Throw nice http errors & keep SSR safe
/**
 * Parse errors
 *
 * @param {Error} e
 * @returns {Object}
 */
function onError(e) {
  if (!inBrowser) {
    return {
      status: e
    };
  }

  var response = {};
  if (e.response) {
    response = e.response.data;
  }

  throw Object.assign({
    statusCode: 500,
    message: 'Request error'
  }, response);
}

/**
 * Wrap promise to parse data
 *
 * @param {Promise} p - The promise to be wrapped
 * @returns {Promise}
 */
function wrapPromise(p) {
  return p.then(function(res) {
    return res.data || {};
  }).catch(onError);
}

/**
 *
 * @param {Object} opts
 * @param {string} _url
 * @returns {Object}
 */
function wrapOpts(opts = {}, _url) {
  const url = _url || opts.url || '';

  if (opts.withCredentials === undefined) {
    // Send credentials only to relative and API Backend requests
    if (!/^https?:\/\//i.test(url) || url.indexOf(process.env.API_URL_BROWSER) === 0 || url.indexOf(process.env.API_URL) === 0) {
      opts.withCredentials = true;
    }
  }

  return opts;
}

// Create wrappers
// https://github.com/mzabriskie/axios#request-method-aliases
export const $request = function(opts) {
  return wrapPromise(axios.request(wrapOpts(opts)));
};

export const $get = function(url, opts) {
  return wrapPromise(axios.get(url, wrapOpts(opts, url)));
};

export const $del = function(url, opts) {
  return wrapPromise(axios.delete(url, wrapOpts(opts, url)));
};

export const $head = function(url, opts) {
  return wrapPromise(axios.head(url, wrapOpts(opts, url)));
};

export const $post = function(url, data, opts) {
  return wrapPromise(axios.post(url, data, wrapOpts(opts, url)));
};

export const $put = function(url, data, opts) {
  return wrapPromise(axios.put(url, data, wrapOpts(opts, url)));
};
export const $patch = function(url, data, opts) {
  return wrapPromise(axios.patch(url, data, wrapOpts(opts, url)));
};

// ----------------------------------------
// Vue Plugin
// ----------------------------------------
const VueAxios = {
  install: function(Vue) {
    // Globally register as $http
    Vue.prototype.$http = axios;

    // Mixins
    Vue.mixin({
      methods: {
        $request: $request,
        $get: $get,
        $del: $del,
        $head: $head,
        $post: $post,
        $put: $put,
        $patch: $patch
      }
    });
  }

};

// ----------------------------------------
// Install vue plugin
// ----------------------------------------
Vue.use(VueAxios);

export const setToken = (token) => {
  axios.defaults.headers.common['Authorization'] = token ? 'Bearer ' + token : null;
};
