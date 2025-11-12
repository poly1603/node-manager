# @ldesign/node-manager

Node.js 版本管理工具，提供 Node.js 版本检测、安装、切换等功能。

## 功能特性

- ✅ 检测当前 Node.js 版本和环境
- ✅ 获取已安装的 Node.js 版本列表
- ✅ 版本比较和验证
- ✅ 解析和格式化版本号
- 🚧 安装指定版本的 Node.js（规划中）
- 🚧 切换 Node.js 版本（规划中）
- 🚧 设置默认版本（规划中）

## 安装

```bash
pnpm add @ldesign/node-manager
```

## 使用方法

### 基本用法

```typescript
import { createNodeManager } from '@ldesign/node-manager'

const manager = createNodeManager({
  verbose: true
})

// 获取当前环境
const env = await manager.getCurrentEnvironment()
console.log('Node version:', env.nodeVersion)
console.log('npm version:', env.npmVersion)

// 获取已安装的版本
const versions = await manager.getInstalledVersions()
console.log('Installed versions:', versions)
```

### 检查 Node 版本

```typescript
import { getCurrentNodeVersion, isNodeInstalled } from '@ldesign/node-manager'

// 检查是否安装 Node.js
const installed = await isNodeInstalled()

if (installed) {
  const version = await getCurrentNodeVersion()
  console.log('Current Node version:', version)
}
```

### 版本比较

```typescript
import { createNodeManager } from '@ldesign/node-manager'

const manager = createNodeManager()

// 比较版本
const result = manager.compareVersions('v18.0.0', 'v20.0.0')
console.log(result) // -1 (v18 < v20)

// 检查版本是否满足要求
const satisfies = manager.satisfiesVersion('v20.1.0', '>=18')
console.log(satisfies) // true
```

## API 文档

### NodeManager

主要的版本管理器类。

#### 方法

- `getCurrentEnvironment()`: 获取当前 Node.js 环境信息
- `getInstalledVersions()`: 获取已安装的版本列表
- `parseVersion(version)`: 解析版本字符串
- `compareVersions(v1, v2)`: 比较两个版本
- `satisfiesVersion(version, range)`: 检查版本是否满足范围要求
- `isVersionInstalled(version)`: 检查版本是否已安装

### 工具函数

- `createNodeManager(config?)`: 创建管理器实例
- `getCurrentNodeVersion()`: 获取当前 Node 版本
- `isNodeInstalled()`: 检查 Node 是否已安装
- `getRecommendedNodeVersion()`: 获取推荐的 Node 版本

## 类型定义

详见 `src/types.ts`

## License

MIT
