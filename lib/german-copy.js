import copy from '../content/locales/de.json';

export function german(id) {
  if (typeof copy[id] !== 'string' || !copy[id].trim()) {
    throw new Error(`Missing German translation: ${id}`);
  }
  return copy[id];
}
