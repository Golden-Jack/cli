import semver from 'semver';
import { name, version } from '../../package.json';

export async function versionBehind() {
    const res = await fetch(`https://registry.npmjs.org/${name}`, {
        headers: {
            Accept: 'application/vnd.npm.install-v1+json'
        },
        signal: AbortSignal.timeout(5e3)
    })

    if (!res.ok) throw new Error(`Cannot fetch registry : ${res.status}`);

    const { versions } = await res.json();

    const newer = Object.keys(versions).filter(v => !semver.prerelease(v) && semver.gt(v, version)).sort(semver.compare);

    return newer;
}