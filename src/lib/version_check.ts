/* eslint-disable no-console */

'use client';

// 版本检查结果枚举
export enum UpdateStatus {
  HAS_UPDATE = 'has_update', // 有新版本
  NO_UPDATE = 'no_update', // 无新版本
  FETCH_FAILED = 'fetch_failed', // 获取失败
}

const VERSION_CHECK_ENDPOINT = '/api/version/check';

type VersionCheckPayload = {
  success?: boolean;
  hasUpdate?: boolean;
  current?: {
    timestamp?: string;
  };
  remote?: {
    timestamp?: string;
  } | null;
};

/**
 * 检查是否有新版本可用
 */
export async function checkForUpdates(): Promise<{
  status: UpdateStatus;
  currentTimestamp?: string;
  remoteTimestamp?: string;
}> {
  try {
    const response = await fetch(VERSION_CHECK_ENDPOINT, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`请求版本信息失败: ${response.status}`);
    }

    const payload: VersionCheckPayload = await response.json();

    if (!payload?.success || !payload?.current?.timestamp) {
      throw new Error('版本检测响应无效');
    }

    return {
      status: payload.hasUpdate
        ? UpdateStatus.HAS_UPDATE
        : UpdateStatus.NO_UPDATE,
      currentTimestamp: payload.current.timestamp,
      remoteTimestamp: payload.remote?.timestamp,
    };
  } catch (error) {
    console.warn('版本检测失败:', error);
    return { status: UpdateStatus.FETCH_FAILED };
  }
}
