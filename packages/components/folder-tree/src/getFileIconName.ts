/**
 * 根据文件名后缀返回图标名（跨框架图标契约）。
 *
 * 返回值约定：
 * - `Javascript` / `Typescript` / `Css3` / `Html5` / `Markdown` 等：devicon 图标名
 * - `symbol-icon-*`：svg symbol 图标
 * - 其余：fallback 到通用 `File`
 */
export function getFileIconName(filename: string | null | undefined): string {
  if (!filename) return '';
  const lower = filename.toLowerCase();
  if (lower.endsWith('.js') || lower.endsWith('.jsx')) return 'Javascript';
  if (lower.endsWith('.ts') || lower.endsWith('.tsx')) return 'Typescript';
  if (lower.endsWith('.css') || lower.endsWith('.scss') || lower.endsWith('.wxss')) return 'Css3';
  if (lower.endsWith('.json')) return 'symbol-icon-JSON';
  if (lower.endsWith('.html') || lower.endsWith('.htm') || lower.endsWith('.wxml')) return 'Html5';
  if (lower.endsWith('.vue')) return '_Vue';
  if (lower.endsWith('.md')) return 'Markdown';
  if (lower.endsWith('.png')) return 'symbol-icon-tupian';
  if (lower.endsWith('.jpg')) return 'symbol-icon-tupian';
  if (lower.endsWith('.jpeg')) return 'symbol-icon-tupian';
  if (lower.endsWith('.gif')) return 'symbol-icon-tupian';
  return 'File';
}
