
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
    'products/index.html': {size: 109506, hash: '6cbd9c5ffad8ce983b0137ef6216be0d63181bd54ce2792a2726ec52c2d523b2', text: () => import('./assets-chunks/products_index_html.mjs').then(m => m.default)},
    'add-product/index.html': {size: 109506, hash: 'ec2faafde2c7e7d28dd169c05858af66abe7538d7eeeccdc44af6cdc0c394f11', text: () => import('./assets-chunks/add-product_index_html.mjs').then(m => m.default)},
    'login/index.html': {size: 109401, hash: '8866ccf140fc57b4b4dc4679f5fb6018b476b1932b57a28958a0e118b6807465', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'not-found/index.html': {size: 50185, hash: 'c40dc4e260028ef92a926171f1bfaa671b351f6f907afef934bf5b7e5fbcd098', text: () => import('./assets-chunks/not-found_index_html.mjs').then(m => m.default)},
    'styles-O7JGPDFK.css': {size: 88446, hash: '6IT2WBjYub4', text: () => import('./assets-chunks/styles-O7JGPDFK_css.mjs').then(m => m.default)}
  },
};
