/* eslint-disable no-console */

import { Converter } from 'opencc-js';

// 提供繁体 -> 简体 的转换函数。
// 使用 opencc-js (纯 JS 实现) 替代原生 opencc，避免 .node 模块加载问题。
// 支持港台繁体到大陆简体的精准转换。

// 创建转换器实例 (hk -> cn)
// opencc-js 的 Converter 是同步的，但为了保持接口兼容性，我们保留 async
const converter = Converter({ from: 'hk', to: 'cn' });

export async function toSimplified(text: string): Promise<string> {
  if (!text) return text;
  try {
    return converter(text);
  } catch (e) {
    console.warn('繁体转简体失败:', e);
    return text;
  }
}

export default toSimplified;
