# Installation

## Local installation

For [Node modules projects](https://docs.npmjs.com/getting-started/creating-node-modules) we recommend installing **contiamo-semantic-release** locally and running the `semantic-release` command with [npx](https://www.npmjs.com/package/npx):

```bash
npm install --save-dev contiamo-semantic-release
```

Then in the CI environment:

```bash
npx contiamo-semantic-release
```

**Note:** `npx` is a tool bundled with `npm@>=5.2.0`. It is used to conveniently find the contiamo-semantic-release binary and to execute it. See [What is npx](../support/FAQ.md#what-is-npx) for more details.

## Global installation

For other type of projects we recommend installing **contiamo-semantic-release** directly in the CI environment, also with [npx](https://www.npmjs.com/package/npx):

```bash
npx contiamo-semantic-release
```

### Notes

1. If you've globally installed **contiamo-semantic-release** then we recommend that you set the major version to install.
   For example, by using `npx contiamo-semantic-release@1`.
   This way you control which major version is used by your build, and thus avoid breaking the build when there's a new major version.
2. Pinning **contiamo-semantic-release** to an exact version makes your releases even more deterministic.
   But pinning also means you, or a bot, must upgrade when a new version is released.
3. You can use [Renovate's regex manager](https://docs.renovatebot.com/modules/manager/regex/) to get automatic updates in either of the above scenarios.
   Put this in your Renovate configuration file:
   ```json
   {
     "regexManagers": [
       {
         "description": "Update contiamo-semantic-release version used by npx",
         "fileMatch": ["^\\.github/workflows/[^/]+\\.ya?ml$"],
         "matchStrings": ["\\srun: npx contiamo-semantic-release@(?<currentValue>.*?)\\s"],
         "datasourceTemplate": "npm",
         "depNameTemplate": "contiamo-semantic-release"
       }
     ]
   }
   ```
4. `npx` is a tool bundled with `npm@>=5.2.0`. You can use it to install (and run) the **contiamo-semantic-release** binary.
   See [What is npx](../support/FAQ.md#what-is-npx) for more details.
