/**
 * Capitalises the first letter in a given string.
 * @param {string} text String to capitalise.
 * @returns A capitalised string.
 */
export default function capitalise(text) {
	return text?.trim().replace(/^\w/, c => c.toUpperCase());
}
