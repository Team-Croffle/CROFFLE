// ./packages/electron/.eslintrc.cjs
module.exports = {
  root: true,
  env: {
    node: true, // Electron 메인 프로세스는 Node.js 환경
    es2021: true,
  },
  extends: [
    "../../.eslintrc.cjs", // 루트 설정 파일을 확장
  ],
  // 이 패키지에만 적용할 특별한 규칙이 있다면 여기에 추가합니다.
  rules: {},
};
