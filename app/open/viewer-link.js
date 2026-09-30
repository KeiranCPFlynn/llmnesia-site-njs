// Parser for LLMnesia MCP source links: #docId=<id>&extensionId=<optional 32-char id>.
//
// The conversation identifier stays in the URL fragment, which browsers never
// send to this website. The extensionId, when present, is a PREFERENCE ONLY:
// older links always carry one, but a machine-wide ID cannot identify the
// extension in whichever browser receives the link, so the hand-off page treats
// it as a hint and discovers the installed build instead. An extensionId that
// fails this format check is ignored, not fatal — the link stays usable.

const EXTENSION_ID_RE = /^[a-p]{32}$/;
const MAX_DOC_ID_LENGTH = 512;
const CONTROL_CHARS = /[\u0000-\u001f\u007f]/;

export function parseHandoffHash(hash) {
  const params = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash);
  const docId = (params.get('docId') || '').trim();
  const rawExtensionId = params.get('extensionId') || '';

  if (!docId || docId.length > MAX_DOC_ID_LENGTH || CONTROL_CHARS.test(docId)) {
    return null;
  }

  return {
    docId,
    extensionId: EXTENSION_ID_RE.test(rawExtensionId) ? rawExtensionId : ''
  };
}

// Fallback for extensions released before the discovery handshake: they only
// understand a direct redirect, which is correct whenever the link's ID
// matches the installation that generated it.
export function legacyViewerUrl(extensionId, docId) {
  return `chrome-extension://${extensionId}/viewer.html?docId=${encodeURIComponent(docId)}`;
}
