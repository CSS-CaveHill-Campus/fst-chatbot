import type { RequestHandler } from './$types';
import { PUBLIC_CLIENT_EMAIL, PUBLIC_PROJECT_ID } from '$env/static/public';
import { PRIVATE_KEY } from '$env/static/private';
import { decode } from '$lib/utils';
import { json } from '@sveltejs/kit';
import { SessionsClient } from '@google-cloud/dialogflow-cx';

const agentId = 'c9be9f18-cf78-4f38-92f9-cefe0ee1134d';
const location = 'global';
const languageCode = 'en';

const client = new SessionsClient({
	credentials: {
		client_email: PUBLIC_CLIENT_EMAIL,
		private_key: decode(PRIVATE_KEY)
	}
});

const sessionId = crypto.randomUUID();

const sessionPath = client.projectLocationAgentSessionPath(
	PUBLIC_PROJECT_ID,
	location,
	agentId,
	sessionId
);

export const POST: RequestHandler = async ({ request }) => {
	const { message } = await request.json();

	const userrequest = {
		session: sessionPath,
		queryInput: {
			text: {
				text: message
			},
			languageCode
		}
	};

	const [response] = await client.detectIntent(userrequest);

	for (const message of response!.queryResult!.responseMessages!) {
		if (message.text) {
			return json({ bot: message.text.text });
		}
	}
	return json({ message: 'Message received!' });
};
