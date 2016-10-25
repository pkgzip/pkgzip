import resolveVersion from './resolve-version';
import { TIMER_VERSION_EXPANSION_TOTAL, timeStart, timeEnd } from './timer-keys';

function expandVersions(requestedPkgs) {
  timeStart(TIMER_VERSION_EXPANSION_TOTAL);
  const expandPromises = requestedPkgs.map(pkg => resolveVersion(pkg.pkgName, pkg.pkgVersion));
  return Promise.all(expandPromises).then((allExpansionResults) => {
    timeEnd(TIMER_VERSION_EXPANSION_TOTAL);
    return allExpansionResults.filter(pkg => !!pkg.pkgVersion);
  });
}

export default expandVersions;
