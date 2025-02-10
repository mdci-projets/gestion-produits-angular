
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "preload": [
      "chunk-IFVXEM27.js",
      "chunk-UEMGFP6J.js"
    ],
    "route": "/"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-IFVXEM27.js",
      "chunk-UEMGFP6J.js"
    ],
    "route": "/products"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-Q3EKA5KR.js",
      "chunk-UEMGFP6J.js"
    ],
    "route": "/products/edit/*"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-6Y3VZTEP.js",
      "chunk-UEMGFP6J.js"
    ],
    "route": "/add-product"
  },
  {
    "renderMode": 2,
    "route": "/login"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-4BLKEIQ5.js"
    ],
    "route": "/not-found"
  },
  {
    "renderMode": 2,
    "redirectTo": "/not-found",
    "route": "/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 47989, hash: 'f0d87cbf10324027773947d61267332c59ecc365e2a75b71f8c7b4f69c89139a', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1259, hash: 'f4f1ed7a4c6f23e210e6dadb95ff88e889941eeb4cd8f5aeeb8ae99e6d587b52', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 109506, hash: '6cbd9c5ffad8ce983b0137ef6216be0d63181bd54ce2792a2726ec52c2d523b2', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'products/index.html': {size: 109506, hash: 'd8102f182787739fc8199bfc1bf32c3ac2dbc7be3e55de7b62a8e7f2bc2c672a', text: () => import('./assets-chunks/products_index_html.mjs').then(m => m.default)},
    'add-product/index.html': {size: 109506, hash: 'c88409eb8507eb7368a6a694b74d8abae699cda1278f8a8ef543deeebe070695', text: () => import('./assets-chunks/add-product_index_html.mjs').then(m => m.default)},
    'login/index.html': {size: 109401, hash: '2a092eab359b52a6fc7dabd4e5aadae042f5396d0f56c7421632fcdc2a18f24a', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'not-found/index.html': {size: 50185, hash: 'c40dc4e260028ef92a926171f1bfaa671b351f6f907afef934bf5b7e5fbcd098', text: () => import('./assets-chunks/not-found_index_html.mjs').then(m => m.default)},
    'styles-O7JGPDFK.css': {size: 88446, hash: '6IT2WBjYub4', text: () => import('./assets-chunks/styles-O7JGPDFK_css.mjs').then(m => m.default)}
  },
};
