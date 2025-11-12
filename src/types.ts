/**
 * Node.js 版本信息
 */
export interface NodeVersion {
  /** 版本号 */
  version: string
  /** 主版本号 */
  major: number
  /** 次版本号 */
  minor: number
  /** 补丁版本号 */
  patch: number
  /** 是否为 LTS 版本 */
  lts?: string | false
  /** 发布日期 */
  date?: string
}

/**
 * 已安装的 Node 版本信息
 */
export interface InstalledNodeVersion extends NodeVersion {
  /** 安装路径 */
  path: string
  /** 是否为当前版本 */
  current: boolean
  /** 是否为默认版本 */
  default: boolean
}

/**
 * Node 版本管理器配置
 */
export interface NodeManagerConfig {
  /** Node 安装目录 */
  installDir?: string
  /** 镜像源 */
  mirror?: string
  /** 代理设置 */
  proxy?: string
  /** 是否显示详细日志 */
  verbose?: boolean
}

/**
 * 版本安装选项
 */
export interface InstallOptions {
  /** 是否强制重新安装 */
  force?: boolean
  /** 是否设置为默认版本 */
  setDefault?: boolean
  /** 是否立即切换到该版本 */
  use?: boolean
}

/**
 * 当前 Node 环境信息
 */
export interface NodeEnvironment {
  /** Node.js 版本 */
  nodeVersion: string
  /** npm 版本 */
  npmVersion: string
  /** 可执行文件路径 */
  nodePath: string
  /** npm 路径 */
  npmPath: string
  /** 架构 */
  arch: string
  /** 平台 */
  platform: string
}
