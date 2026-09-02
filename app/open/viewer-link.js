const EXTENSION_ID_RE = /^[a-p]{32}$/;
const MAX_DOC_ID_LENGTH = 512;

export function viewerUrlFromHash(hash) {
  const params = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash);
  const docId = params.get('docId') || '';
  const extensionId = params.get('extensionId') || '';

  if (
    !docId ||
    docId.length > MAX_DOC_ID_LENGTH ||
    /[\u0000-\u001f\u007f]/.test(docId) ||
    !EXTENSION_ID_RE.test(extensionId)
  ) {
    return null;
  }

  return `chrome-extension://${extensionId}/viewer.html?docId=${encodeURIComponent(docId)}`;
}
