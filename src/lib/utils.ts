// src/lib/utils.js
export function decode(encodedKey: string | null = null) {
	if (!encodedKey) {
		throw new Error('PRIVATE_KEY is not defined in the environment variables.');
	}

	// Replace \n with actual newlines
	const privateKey = encodedKey.replace(/-<>-/g, '\n');
	return privateKey;
}
