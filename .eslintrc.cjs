module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
    browser: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:promise/recommended',
    'plugin:sonarjs/recommended',
    'plugin:vue/vue3-recommended',
    'plugin:vuejs-accessibility/recommended',
    'plugin:unicorn/recommended',
    'prettier',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    'import',
    'promise',
    'sonarjs',
    'vue',
    'vuejs-accessibility',
    'unicorn',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

    // 한 단어로 된 컴포넌트 이름 허용
    'vue/multi-word-component-names': 'off',
    // 컴포넌트 API 스타일 강제 (<script setup> 또는 composition을 사용해야 함)
    'vue/component-api-style': ['error', ['script-setup', 'composition']],
    // defineProps 선언 방식 강제 (타입 기반으로 선언)
    'vue/define-props-declaration': ['error', 'type-based'],
    // XSS 공격 방지를 위해 v-html 사용 경고
    'vue/no-v-html': 'warn',

    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
        pathGroups: [
          {
            // vue 관련 패키지를 external 그룹의 맨 앞에 배치
            pattern: '{vue,vue-router,vuex,pinia}',
            group: 'external',
            position: 'before',
          },
          {
            // @/로 시작하는 경로를 internal 그룹의 맨 앞에 배치
            pattern: '@/**',
            group: 'internal',
            position: 'before',
          },
          {
            // 상대 경로 import를 parent, sibling, index 그룹의 맨 뒤에 배치
            pattern: './**',
            group: 'sibling',
            position: 'after',
          },
        ],
        // 'builtin'은 항상 맨 앞에 있어야 하므로 제외
        pathGroupsExcludedImportTypes: ['builtin'],
        // 각 그룹 사이에 항상 빈 줄 추가
        'newlines-between': 'always',
        // 알파벳 순서로 정렬, 대소문자 구분 없음
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],

    // 파일명을 PascalCase 또는 camelCase로 강제
    'unicorn/filename-case': [
      'error',
      {
        cases: {
          kebabCase: false,
          pascalCase: true,
          snakeCase: false,
          camelCase: true,
        },
      },
    ],
    // unicorn 룰 비활성화
    // 'props' 대신 'properties'를 사용하도록 강제하는 룰 비활성화
    'unicorn/prevent-abbreviations': 'off',
    // 'null' 사용을 금지하는 룰 비활성화
    'unicorn/no-null': 'off',
  },
};
