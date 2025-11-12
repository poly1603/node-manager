/**
 * Node.js 版本信息
 */
interface NodeVersion {
    /** 版本号 */
    version: string;
    /** 主版本号 */
    major: number;
    /** 次版本号 */
    minor: number;
    /** 补丁版本号 */
    patch: number;
    /** 是否为 LTS 版本 */
    lts?: string | false;
    /** 发布日期 */
    date?: string;
}
/**
 * 已安装的 Node 版本信息
 */
interface InstalledNodeVersion extends NodeVersion {
    /** 安装路径 */
    path: string;
    /** 是否为当前版本 */
    current: boolean;
    /** 是否为默认版本 */
    default: boolean;
}
/**
 * Node 版本管理器配置
 */
interface NodeManagerConfig {
    /** Node 安装目录 */
    installDir?: string;
    /** 镜像源 */
    mirror?: string;
    /** 代理设置 */
    proxy?: string;
    /** 是否显示详细日志 */
    verbose?: boolean;
}
/**
 * 版本安装选项
 */
interface InstallOptions {
    /** 是否强制重新安装 */
    force?: boolean;
    /** 是否设置为默认版本 */
    setDefault?: boolean;
    /** 是否立即切换到该版本 */
    use?: boolean;
}
/**
 * 当前 Node 环境信息
 */
interface NodeEnvironment {
    /** Node.js 版本 */
    nodeVersion: string;
    /** npm 版本 */
    npmVersion: string;
    /** 可执行文件路径 */
    nodePath: string;
    /** npm 路径 */
    npmPath: string;
    /** 架构 */
    arch: string;
    /** 平台 */
    platform: string;
}

/**
 * Node.js 版本管理器
 *
 * 提供 Node.js 版本检测、安装、切换等功能
 */

/**
 * Node.js 版本管理器类
 */
declare class NodeManager {
    private config;
    constructor(config?: NodeManagerConfig);
    /**
     * 获取当前 Node.js 环境信息
     */
    getCurrentEnvironment(): Promise<NodeEnvironment>;
    /**
     * 解析版本字符串
     */
    parseVersion(versionStr: string): NodeVersion | null;
    /**
     * 比较版本
     */
    compareVersions(v1: string, v2: string): number;
    /**
     * 检查版本是否满足要求
     */
    satisfiesVersion(version: string, range: string): boolean;
    /**
     * 获取已安装的 Node 版本列表
     */
    getInstalledVersions(): Promise<InstalledNodeVersion[]>;
    /**
     * 检查版本是否已安装
     */
    isVersionInstalled(version: string): Promise<boolean>;
    /**
     * 获取版本安装路径
     */
    getVersionPath(version: string): string;
    /**
     * 验证 Node 安装
     */
    validateInstallation(versionPath: string): Promise<boolean>;
    /**
     * 日志输出
     */
    private log;
    /**
     * 错误日志
     */
    private error;
}
/**
 * 创建 Node 版本管理器实例
 */
declare function createNodeManager(config?: NodeManagerConfig): NodeManager;
/**
 * 获取当前 Node 版本
 */
declare function getCurrentNodeVersion(): Promise<string>;
/**
 * 检查 Node 是否已安装
 */
declare function isNodeInstalled(): Promise<boolean>;
/**
 * 获取推荐的 Node 版本
 */
declare function getRecommendedNodeVersion(): string;

export { type InstallOptions, type InstalledNodeVersion, type NodeEnvironment, NodeManager, type NodeManagerConfig, type NodeVersion, createNodeManager, createNodeManager as default, getCurrentNodeVersion, getRecommendedNodeVersion, isNodeInstalled };
