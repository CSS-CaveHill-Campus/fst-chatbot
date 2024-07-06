<script lang="ts">
	import { afterUpdate } from 'svelte';

	let input = '';
	let messages: { sender: string; text: string }[] = [
		{ sender: 'bot', text: 'Hello! How can I help you today?' }
	];

	// Function to scroll to the bottom of the chat
	function scrollToBottom() {
		const chatbotDiv = document.querySelector('.chatbot');
		if (chatbotDiv) {
			chatbotDiv.scrollTop = chatbotDiv.scrollHeight;
		}
	}

	// Watch for updates to the messages array and scroll to the bottom
	afterUpdate(() => {
		scrollToBottom();
	});

	// Function to send a message
	function sendMessage() {
		if (input.trim() === '') return; // Prevent sending empty messages

		messages = [...messages, { sender: 'user', text: input }];
		input = '';

		// Simulate a bot response with a delay
		setTimeout(() => {
			messages = [
				...messages,
				{
					sender: 'bot',
					text: 'I am a bot. I do not understand that yet.'
				}
			];
		}, 2000); // 1 second delay
	}
</script>

<main class="max-w-3xl px-6 mt-6 pb-8 w-full grid grid-rows-flow h-full overflow-hidden">
	<div class="chatbot flow mb-4">
		{#each messages as message}
			{#if message.sender === 'bot'}
				<div class="chat_message mr-auto">
					<p class="font-inter font-medium text-gray-700">
						{message.text}
					</p>
				</div>
			{:else}
				<div class="chat_message ml-auto user">
					<p class="font-inter font-medium text-white">
						{message.text}
					</p>
				</div>
			{/if}
		{/each}
	</div>
	<div class="relative justify-center items-center flex">
		<input
			type="text"
			bind:value={input}
			placeholder="Ask your Question"
			class="url_input peer"
			on:keypress={(e) => (e.key === 'Enter' ? sendMessage() : null)}
		/>
		<button
			type="button"
			on:click={sendMessage}
			class="submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700">⬆️</button
		>
	</div>
</main>
