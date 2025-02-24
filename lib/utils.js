import { isFunction, template, union } from "lodash-es";
import semver from "semver";
import hideSensitive from "./hide-sensitive.js";

export function extractErrors(err) {
  return err && err.errors ? [...err.errors] : [err];
}

export function hideSensitiveValues(env, objs) {
  const hideFunction = hideSensitive(env);
  return objs.map((object) => {
    Object.getOwnPropertyNames(object).forEach((prop) => {
      if (object[prop]) {
        object[prop] = hideFunction(object[prop]);
      }
    });
    return object;
  });
}

export function tagsToVersions(tags) {
  return tags.map(({ version }) => version);
}

export function isMajorRange(range) {
  return /^\d+\.x(?:\.x)?$/i.test(range);
}

export function isMaintenanceRange(range) {
  return /^\d+(?:\.(?:\d+|x))?\.x$/i.test(range);
}

export function getUpperBound(range) {
  const result = semver.valid(range)
    ? range
    : ((semver.validRange(range) || "").match(/<(?<upperBound>\d+\.\d+\.\d+(-\d+)?)$/) || [])[1];

  return result
    ? // https://github.com/npm/node-semver/issues/322
      result.replace(/-\d+$/, "")
    : result;
}

export function getLowerBound(range) {
  return ((semver.validRange(range) || "").match(/(?<lowerBound>\d+\.\d+\.\d+)/) || [])[1];
}

export function highest(version1, version2) {
  return version1 && version2 ? (semver.gt(version1, version2) ? version1 : version2) : version1 || version2;
}

export function lowest(version1, version2) {
  return version1 && version2 ? (semver.lt(version1, version2) ? version1 : version2) : version1 || version2;
}

export function getLatestVersion(versions, { withPrerelease } = {}) {
  return versions.filter((version) => withPrerelease || !semver.prerelease(version)).sort(semver.rcompare)[0];
}

export function getEarliestVersion(versions, { withPrerelease } = {}) {
  return versions.filter((version) => withPrerelease || !semver.prerelease(version)).sort(semver.compare)[0];
}

export function getFirstVersion(versions, lowerBranches) {
  const lowerVersion = union(...lowerBranches.map(({ tags }) => tagsToVersions(tags))).sort(semver.rcompare);
  if (lowerVersion[0]) {
    return versions.sort(semver.compare).find((version) => semver.gt(version, lowerVersion[0]));
  }

  return getEarliestVersion(versions);
}

export function getRange(min, max) {
  return `>=${min}${max ? ` <${max}` : ""}`;
}

export function makeTag(tagFormat, version) {
  return template(tagFormat)({ version });
}

export function isSameChannel(channel, otherChannel) {
  return channel === otherChannel || (!channel && !otherChannel);
}

export function getFilesToCommit(plugins) {
  const files = new Set();

  // Get files from changelog plugin
  const changelogPlugin = plugins.find(plugin =>
    Array.isArray(plugin) && plugin[0] === '@semantic-release/changelog');
  if (changelogPlugin && changelogPlugin[1] && changelogPlugin[1].changelogFile) {
    files.add(changelogPlugin[1].changelogFile);
  }

  // Get files from replace plugin
  const replacePlugin = plugins.find(plugin =>
    Array.isArray(plugin) && plugin[0] === 'semantic-release-replace-plugin');
  if (replacePlugin && replacePlugin[1] && replacePlugin[1].replacements) {
    replacePlugin[1].replacements.forEach(replacement => {
      if (replacement.files) {
        replacement.files.forEach(file => files.add(file));
      }
    });
  }

  return Array.from(files);
}
