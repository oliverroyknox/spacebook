import { baseUrl } from '../config/server.config.json';

export default function url(path) {
  // combine path to base of url and construct safe url.
  return new URL(path, baseUrl);
}
