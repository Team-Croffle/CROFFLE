// ./packages/vue/.eslintrc.cjs
module.exports = {
  // 이 파일이 있는 디렉토리에만 규칙을 적용
  root: true,
  env: {
    browser: true, // Vue는 브라우저 환경에서 실행됨
    node: true,
    es2021: true,
  },
  // 1. 루트 설정을 먼저 불러옵니다.
  extends: [
    "../../.eslintrc.cjs", // 루트 설정 파일 경로
    "plugin:vue/vue3-recommended",
    "plugin:vuejs-accessibility/recommended",
  ],
  parser: "vue-eslint-parser", // Vue 파일을 파싱하기 위해 변경
  parserOptions: {
    parser: "@typescript-eslint/parser", // <script lang="ts">를 파싱
    sourceType: "module",
  },
  plugins: [
    // 루트 설정에 이미 있는 플러그인은 다시 선언할 필요가 없습니다.
    // Vue 관련 플러그인만 추가합니다.
    "vue",
    "vuejs-accessibility",
  ],
  rules: {
    // Vue 관련 규칙은 이곳에만 적용합니다.
    "vue/multi-word-component-names": "off",
    "vue/component-api-style": ["error", ["script-setup", "composition"]],
    "vue/define-props-declaration": ["error", "type-based"],
    "vue/no-v-html": "warn",
  },
};
