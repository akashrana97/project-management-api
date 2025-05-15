// store/sliceConfig.js

export const sliceConfig = {
  navbar: {
    endpoints: {
      fetch: { url: '/nav-items/', method: 'get' },
      create: { url: '/users', method: 'post' },
      delete: { url: (id) => `/users/${id}`, method: 'delete' },
    },
  },
  products: {
    endpoints: {
      fetch: { url: '/products', method: 'get' },
      add: { url: '/products', method: 'post' },
    },
  },
  orders: {
    endpoints: {
      fetch: { url: '/orders', method: 'get' },
    },
  },
};
