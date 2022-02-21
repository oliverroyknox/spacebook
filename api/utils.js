import { baseUrl } from '../config/server.config.json';

/**
 * Constructs a safe URL to the server.
 * @param {string} path Path in URL to add.
 * @returns A safe URL.
 */
export default function url(path) {
	return new URL(path, baseUrl);
}
