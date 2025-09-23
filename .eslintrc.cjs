// ./ .eslintrc.cjs
module.exports = {
  root: true, // ESLint가 이 파일을 최상위 설정으로 인식하도록 함
  env: {
    node: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:promise/recommended",
    "plugin:sonarjs/recommended",
    "plugin:unicorn/recommended",
    "prettier", // Prettier와 충돌하는 규칙 비활성화 (항상 마지막에)
  ],
  parser: "@typescript-eslint/parser", // 기본 파서를 TypeScript용으로 설정
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "import", "promise", "sonarjs", "unicorn"],
  rules: {
    // 여기에 프로젝트 전체에 적용할 공통 규칙을 넣습니다.
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",

    "import/order": [
      // ... (기존 import/order 규칙 복사)
    ],
    "unicorn/filename-case": [
      // ... (기존 unicorn/filename-case 규칙 복사)
    ],
    "unicorn/prevent-abbreviations": "off",
    "unicorn/no-null": "off",
  },
};
