/**
 * Node.js 版本管理器
 * 
 * 提供 Node.js 版本检测、安装、切换等功能
 */

import { execa } from 'execa'
import fs from 'fs-extra'
import path from 'node:path'
import os from 'node:os'
import semver from 'semver'
import type {
  NodeVersion,
  InstalledNodeVersion,
  NodeManagerConfig,
  InstallOptions,
  NodeEnvironment,
} from './types'

/**
 * Node.js 版本管理器类
 */
export class NodeManager {
  private config: NodeManagerConfig

  constructor(config: NodeManagerConfig = {}) {
    this.config = {
      installDir: config.installDir || path.join(os.homedir(), '.ldesign', 'node'),
      mirror: config.mirror || 'https://nodejs.org/dist',
      verbose: config.verbose ?? false,
      ...config,
    }
  }

  /**
   * 获取当前 Node.js 环境信息
   */
  async getCurrentEnvironment(): Promise<NodeEnvironment> {
    try {
      const { stdout: nodeVersion } = await execa('node', ['--version'])
      const { stdout: npmVersion } = await execa('npm', ['--version'])
      const { stdout: nodePath } = await execa('which', ['node'], {
        shell: true,
      }).catch(() => execa('where', ['node'], { shell: true }))
      const { stdout: npmPath } = await execa('which', ['npm'], {
        shell: true,
      }).catch(() => execa('where', ['npm'], { shell: true }))

      return {
        nodeVersion: nodeVersion.trim(),
        npmVersion: npmVersion.trim(),
        nodePath: nodePath.split('\n')[0].trim(),
        npmPath: npmPath.split('\n')[0].trim(),
        arch: process.arch,
        platform: process.platform,
      }
    } catch (error) {
      throw new Error(`Failed to get Node environment: ${error}`)
    }
  }

  /**
   * 解析版本字符串
   */
  parseVersion(versionStr: string): NodeVersion | null {
    // 移除 'v' 前缀
    const cleanVersion = versionStr.replace(/^v/, '')
    const parsed = semver.parse(cleanVersion)

    if (!parsed) {
      return null
    }

    return {
      version: `v${parsed.version}`,
      major: parsed.major,
      minor: parsed.minor,
      patch: parsed.patch,
    }
  }

  /**
   * 比较版本
   */
  compareVersions(v1: string, v2: string): number {
    const clean1 = v1.replace(/^v/, '')
    const clean2 = v2.replace(/^v/, '')
    return semver.compare(clean1, clean2)
  }

  /**
   * 检查版本是否满足要求
   */
  satisfiesVersion(version: string, range: string): boolean {
    const cleanVersion = version.replace(/^v/, '')
    return semver.satisfies(cleanVersion, range)
  }

  /**
   * 获取已安装的 Node 版本列表
   */
  async getInstalledVersions(): Promise<InstalledNodeVersion[]> {
    try {
      const installDir = this.config.installDir!
      
      if (!await fs.pathExists(installDir)) {
        return []
      }

      const entries = await fs.readdir(installDir, { withFileTypes: true })
      const versions: InstalledNodeVersion[] = []
      const currentEnv = await this.getCurrentEnvironment().catch(() => null)

      for (const entry of entries) {
        if (entry.isDirectory() && entry.name.startsWith('v')) {
          const versionInfo = this.parseVersion(entry.name)
          if (versionInfo) {
            const versionPath = path.join(installDir, entry.name)
            const isCurrent = currentEnv?.nodeVersion === entry.name

            versions.push({
              ...versionInfo,
              path: versionPath,
              current: isCurrent,
              default: false, // TODO: 实现默认版本检测
            })
          }
        }
      }

      return versions.sort((a, b) => this.compareVersions(b.version, a.version))
    } catch (error) {
      if (this.config.verbose) {
        console.error('Failed to get installed versions:', error)
      }
      return []
    }
  }

  /**
   * 检查版本是否已安装
   */
  async isVersionInstalled(version: string): Promise<boolean> {
    const installedVersions = await this.getInstalledVersions()
    return installedVersions.some(v => v.version === version)
  }

  /**
   * 获取版本安装路径
   */
  getVersionPath(version: string): string {
    return path.join(this.config.installDir!, version)
  }

  /**
   * 验证 Node 安装
   */
  async validateInstallation(versionPath: string): Promise<boolean> {
    try {
      const binPath = process.platform === 'win32'
        ? path.join(versionPath, 'node.exe')
        : path.join(versionPath, 'bin', 'node')

      if (!await fs.pathExists(binPath)) {
        return false
      }

      // 尝试执行 node --version
      const { stdout } = await execa(binPath, ['--version'])
      return stdout.trim().startsWith('v')
    } catch {
      return false
    }
  }

  /**
   * 日志输出
   */
  private log(message: string): void {
    if (this.config.verbose) {
      console.log(`[NodeManager] ${message}`)
    }
  }

  /**
   * 错误日志
   */
  private error(message: string, error?: any): void {
    console.error(`[NodeManager] ${message}`, error || '')
  }
}

/**
 * 创建 Node 版本管理器实例
 */
export function createNodeManager(config?: NodeManagerConfig): NodeManager {
  return new NodeManager(config)
}

/**
 * 获取当前 Node 版本
 */
export async function getCurrentNodeVersion(): Promise<string> {
  try {
    const { stdout } = await execa('node', ['--version'])
    return stdout.trim()
  } catch (error) {
    throw new Error(`Failed to get Node version: ${error}`)
  }
}

/**
 * 检查 Node 是否已安装
 */
export async function isNodeInstalled(): Promise<boolean> {
  try {
    await execa('node', ['--version'])
    return true
  } catch {
    return false
  }
}

/**
 * 获取推荐的 Node 版本
 */
export function getRecommendedNodeVersion(): string {
  // 返回当前 LTS 版本
  return '20' // Node.js 20 是当前 LTS
}
