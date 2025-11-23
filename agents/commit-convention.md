# commit-convention.md

- Conventional Commits を採用。
  - 例: `feat: add life grid rendering`, `fix(auth): refresh token on 401`。
- scope は任意だが推奨（`auth`, `ui`, `api`, `docs` など）。
- コミット前に `npm run lint` と `npm run format:check` を通す（Husky が実行）。
- 大きな変更は小さく分割し、PR では概要/テスト結果/スクショ（UI変更時）を添付。
