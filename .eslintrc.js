module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-strongly-recommended',
    '@vue/airbnb',
    '@vue/typescript/recommended',
  ],
  plugins: [
    'html',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'arrow-body-style': 0,
    camelcase: 0,
    'global-require': 0,
    indent: 0,
    'import/no-dynamic-require': 0,
    'import/no-unresolved': 0,
    'import/no-webpack-loader-syntax': 0,
    'import/order': 0,
    'import/extensions': 0,
    'import/first': 0,
    'import/no-duplicates': 0,
    'linebreak-style': 0,
    'max-len': 0,
    'no-param-reassign': 0,
    'no-plusplus': 0,
    'no-multiple-empty-lines': [2, {
      max: 1,
      maxBOF: 3,
      maxEOF: 1,
    }],
    quotes: [2, 'single', {
      allowTemplateLiterals: true,
    }],

    'vue/attributes-order': [2, {
      order: [
        'DEFINITION', //  'is', 'v-is'
        'LIST_RENDERING', // 'v-for item in items'
        'CONDITIONALS', // 'v-if', 'v-else-if', 'v-else', 'v-show', 'v-cloak'
        'RENDER_MODIFIERS', // 'v-once', 'v-pre'
        'SLOT', // 'v-slot'
        'OTHER_DIRECTIVES', // 'v-custom-directive'
        'TWO_WAY_BINDING', // 'v-model'
        'EVENTS', // '@click="functionCall"', 'v-on="event"'
        'OTHER_ATTR', // 'custom-prop="foo"', 'v-bind:prop="foo"', ':prop="foo"'
        'CONTENT', // 'v-text', 'v-html'
        'UNIQUE', // 'ref', 'key'
        'GLOBAL', //  'id'
      ],
      alphabetical: true,
    }],
    'vue/attribute-hyphenation': [2, 'always'],
    'vue/html-indent': [2, 2, {
      attribute: 0,
      baseIndent: 1,
      closeBracket: 0,
      alignAttributesVertically: true,
      ignores: [],
    }],
    'vue/html-closing-bracket-spacing': [2, {
      startTag: 'never',
      endTag: 'never',
      selfClosingTag: 'never',
    }],
    'vue/html-closing-bracket-newline': [2, {
      singleline: 'never',
      multiline: 'never',
    }],
    'vue/max-attributes-per-line': [2, {
      singleline: 3,
    }],
    'vue/no-v-html': 0,
    'vue/order-in-components': [2, {
      order: [
        'name',
        'components',
        'mixins',
        ['props', 'propsData'],
        'ROUTER_GUARDS',
        'LIFECYCLE_HOOKS',
        'methods',
        'computed',
        'data',
        'filters',
        'watch',
      ],
    }],
    'vue/script-indent': [2, 2, {
      baseIndent: 1,
      switchCase: 0,
      ignores: [],
    }],
    'vuejs-accessibility/form-control-has-label': 0,
    'vuejs-accessibility/label-has-for': 0,
    'vuejs-accessibility/click-events-have-key-events': 0,
    'vuejs-accessibility/alt-text': 0,
  },
};
