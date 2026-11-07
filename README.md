# ぐるり屋本舗｜神奈川の便利屋（トップページ）確認用

https://gururiyahonpo.com/ のトップページ（WordPress テンプレート「Full Page LP」）を、本番に入れる前に GitHub Pages で確かめるためのリポジトリです。

- 確認用 URL：https://katsumi-h.github.io/gururiya-benriya-lp/
- **正本は Vault 側**：`メインフォルダ/03_プロジェクト/04_便利屋/神奈川_サイト本体/gururiya-theme/page-fullpage-lp.php`
- `wordpress/page-fullpage-lp.php` は正本の写し（下の道具を動かすたびに上書きされる）。ここを直接直さない

## 確認用ページを作り直す

```bash
node scripts/build-static.mjs
```

## 注意

- GitHub Pages では PHP は動きません。計測（wp_head・wp_footer）は外してあります
- 検索に出ないよう `noindex, nofollow` と robots.txt を付けています
- 電話・フォームのボタンは本番の電話番号と本番の問い合わせページにつながります
