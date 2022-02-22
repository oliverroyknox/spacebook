export default function capitalise(text) {
	// capitalises the first letter of the input text.
	return text?.trim().replace(/^\w/, c => c.toUpperCase());
}
