import { execa } from 'execa';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import semver from 'semver';

// src/node-manager.ts
var NodeManager = class {
  config;
  constructor(config = {}) {
    this.config = {
      installDir: config.installDir || path.join(os.homedir(), ".ldesign", "node"),
      mirror: config.mirror || "https://nodejs.org/dist",
      verbose: config.verbose ?? false,
      ...config
    };
  }
  /**
   * 获取当前 Node.js 环境信息
   */
  async getCurrentEnvironment() {
    try {
      const { stdout: nodeVersion } = await execa("node", ["--version"]);
      const { stdout: npmVersion } = await execa("npm", ["--version"]);
      const { stdout: nodePath } = await execa("which", ["node"], {
        shell: true
      }).catch(() => execa("where", ["node"], { shell: true }));
      const { stdout: npmPath } = await execa("which", ["npm"], {
        shell: true
      }).catch(() => execa("where", ["npm"], { shell: true }));
      return {
        nodeVersion: nodeVersion.trim(),
        npmVersion: npmVersion.trim(),
        nodePath: nodePath.split("\n")[0].trim(),
        npmPath: npmPath.split("\n")[0].trim(),
        arch: process.arch,
        platform: process.platform
      };
    } catch (error) {
      throw new Error(`Failed to get Node environment: ${error}`);
    }
  }
  /**
   * 解析版本字符串
   */
  parseVersion(versionStr) {
    const cleanVersion = versionStr.replace(/^v/, "");
    const parsed = semver.parse(cleanVersion);
    if (!parsed) {
      return null;
    }
    return {
      version: `v${parsed.version}`,
      major: parsed.major,
      minor: parsed.minor,
      patch: parsed.patch
    };
  }
  /**
   * 比较版本
   */
  compareVersions(v1, v2) {
    const clean1 = v1.replace(/^v/, "");
    const clean2 = v2.replace(/^v/, "");
    return semver.compare(clean1, clean2);
  }
  /**
   * 检查版本是否满足要求
   */
  satisfiesVersion(version, range) {
    const cleanVersion = version.replace(/^v/, "");
    return semver.satisfies(cleanVersion, range);
  }
  /**
   * 获取已安装的 Node 版本列表
   */
  async getInstalledVersions() {
    try {
      const installDir = this.config.installDir;
      if (!await fs.pathExists(installDir)) {
        return [];
      }
      const entries = await fs.readdir(installDir, { withFileTypes: true });
      const versions = [];
      const currentEnv = await this.getCurrentEnvironment().catch(() => null);
      for (const entry of entries) {
        if (entry.isDirectory() && entry.name.startsWith("v")) {
          const versionInfo = this.parseVersion(entry.name);
          if (versionInfo) {
            const versionPath = path.join(installDir, entry.name);
            const isCurrent = currentEnv?.nodeVersion === entry.name;
            versions.push({
              ...versionInfo,
              path: versionPath,
              current: isCurrent,
              default: false
              // TODO: 实现默认版本检测
            });
          }
        }
      }
      return versions.sort((a, b) => this.compareVersions(b.version, a.version));
    } catch (error) {
      if (this.config.verbose) {
        console.error("Failed to get installed versions:", error);
      }
      return [];
    }
  }
  /**
   * 检查版本是否已安装
   */
  async isVersionInstalled(version) {
    const installedVersions = await this.getInstalledVersions();
    return installedVersions.some((v) => v.version === version);
  }
  /**
   * 获取版本安装路径
   */
  getVersionPath(version) {
    return path.join(this.config.installDir, version);
  }
  /**
   * 验证 Node 安装
   */
  async validateInstallation(versionPath) {
    try {
      const binPath = process.platform === "win32" ? path.join(versionPath, "node.exe") : path.join(versionPath, "bin", "node");
      if (!await fs.pathExists(binPath)) {
        return false;
      }
      const { stdout } = await execa(binPath, ["--version"]);
      return stdout.trim().startsWith("v");
    } catch {
      return false;
    }
  }
  /**
   * 日志输出
   */
  log(message) {
    if (this.config.verbose) {
      console.log(`[NodeManager] ${message}`);
    }
  }
  /**
   * 错误日志
   */
  error(message, error) {
    console.error(`[NodeManager] ${message}`, error || "");
  }
};
function createNodeManager(config) {
  return new NodeManager(config);
}
async function getCurrentNodeVersion() {
  try {
    const { stdout } = await execa("node", ["--version"]);
    return stdout.trim();
  } catch (error) {
    throw new Error(`Failed to get Node version: ${error}`);
  }
}
async function isNodeInstalled() {
  try {
    await execa("node", ["--version"]);
    return true;
  } catch {
    return false;
  }
}
function getRecommendedNodeVersion() {
  return "20";
}

export { NodeManager, createNodeManager, createNodeManager as default, getCurrentNodeVersion, getRecommendedNodeVersion, isNodeInstalled };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map