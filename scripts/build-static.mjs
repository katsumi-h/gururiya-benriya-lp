// 確認用の静的ページ（GitHub Pages 用の index.html）を作る。
// 正本は Vault 側の page-fullpage-lp.php。ここの wordpress/ は写しで、この道具を動かすたびに上書きされる。
// 使い方：node scripts/build-static.mjs [元にする PHP のパス]（省略すると Vault の正本）
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const themeDir = '/Users/higuchikatsumi/AIエージェント作業用/メインフォルダ/03_プロジェクト/04_便利屋/神奈川_サイト本体/gururiya-theme';
const sourcePath = process.argv[2] || path.join(themeDir, 'page-fullpage-lp.php');

const php = fs.readFileSync(sourcePath, 'utf8');
fs.writeFileSync(path.join(repoDir, 'wordpress', 'page-fullpage-lp.php'), php);

const site = 'https://gururiyahonpo.com';
let html = php
  .replace(/^<\?php[\s\S]*?\?>\s*/, '')
  .replace(/<\?php wp_head\(\); \?>/g, '<meta name="robots" content="noindex, nofollow">')
  .replace(/<\?php body_class\('hc-lp'\); \?>/g, 'class="hc-lp"')
  .replace(/<\?php echo esc_url\(home_url\('([^']*)'\)\); \?>/g, (m, p) => site + p)
  .replace(/<\?php echo esc_url\(\$gr_contact_url\); \?>/g, site + '/contact/')
  .replace(/<\?php echo esc_url\(\$gr_hero_image\); \?>/g, './images/hero_new.png')
  .replace(/<\?php echo get_stylesheet_directory_uri\(\); \?>/g, '.')
  .replace(/<\?php wp_footer\(\); \?>/g, '');
const left = html.match(/<\?php[\s\S]*?\?>/g);
if (left) throw new Error('置き換えていない PHP が残っています: ' + left.join(' | '));
// 確認用だと分かる帯を一番上に出す
html = html.replace(/<body([^>]*)>/, '<body$1>\n<div style="background:#333;color:#fff;font-size:12px;text-align:center;padding:4px 8px;">確認用のページです（本番：https://gururiyahonpo.com/ ）</div>');
fs.writeFileSync(path.join(repoDir, 'index.html'), html);

// 使っている画像だけを写す
const used = [...new Set([...html.matchAll(/\.\/images\/[^"'\s)?#]+/g)].map(m => m[0].slice(2)))];
for (const rel of used) {
  const from = path.join(themeDir, rel);
  if (!fs.existsSync(from)) throw new Error('画像がありません: ' + rel);
  fs.mkdirSync(path.join(repoDir, path.dirname(rel)), { recursive: true });
  fs.copyFileSync(from, path.join(repoDir, rel));
}
console.log('書き出し:', path.basename(sourcePath), '→ index.html', '画像', used.length, '個');
