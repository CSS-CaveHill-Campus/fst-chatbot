<script>
	import '../app.css';
	import Header from '$lib/Header.svelte';
</script>

<div class="relative z-10 mx-auto flex max-w-[80rem] flex-col place-items-center px-4 h-full">
	<Header />
	<slot />
</div>
