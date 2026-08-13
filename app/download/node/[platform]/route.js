const NODE_RELEASE_INDEX = 'https://nodejs.org/dist/index.json';
const NODE_DOWNLOAD_PAGE = 'https://nodejs.org/en/download';

const INSTALLERS = {
  windows: {
    releaseFile: 'win-x64-msi',
    filename(version) {
      return `node-${version}-x64.msi`;
    }
  },
  'windows-arm64': {
    // Node's release index currently omits this otherwise official installer
    // asset. Every current LTS release that ships the x64 MSI also ships the
    // matching ARM64 MSI, so use the listed asset to select the release.
    releaseFile: 'win-x64-msi',
    filename(version) {
      return `node-${version}-arm64.msi`;
    }
  },
  macos: {
    releaseFile: 'osx-x64-pkg',
    filename(version) {
      return `node-${version}.pkg`;
    }
  }
};

function redirect(location, cache = true) {
  return new Response(null, {
    status: 307,
    headers: {
      Location: location,
      'Cache-Control': cache
        ? 'public, s-maxage=3600, stale-while-revalidate=86400'
        : 'no-store'
    }
  });
}

function latestLtsWithFile(releases, releaseFile) {
  if (!Array.isArray(releases)) return null;

  return releases.find(
    (release) =>
      release &&
      release.lts &&
      /^v\d+\.\d+\.\d+$/.test(release.version) &&
      Array.isArray(release.files) &&
      release.files.includes(releaseFile)
  );
}

export async function GET(_request, { params }) {
  const installer = INSTALLERS[params.platform];
  if (!installer) {
    return Response.json({ error: 'Unknown platform.' }, { status: 404 });
  }

  try {
    const response = await fetch(NODE_RELEASE_INDEX, {
      next: { revalidate: 3600 }
    });
    if (!response.ok) throw new Error(`Node release index returned ${response.status}`);

    const release = latestLtsWithFile(await response.json(), installer.releaseFile);
    if (!release) throw new Error('No compatible Node.js LTS installer found');

    const filename = installer.filename(release.version);
    return redirect(`https://nodejs.org/dist/${release.version}/${filename}`);
  } catch (error) {
    console.error('Could not resolve the latest Node.js LTS installer:', error);
    return redirect(NODE_DOWNLOAD_PAGE, false);
  }
}
