<script>
	import Repl from '@sveltejs/repl';
	import { onMount } from 'svelte';
	import '../../../site-kit/base.css';
	import '../../../site-kit/code.css';

	let repl;

	onMount(() => {
		repl.set({
			components: [
				{
					name: 'App',
					type: 'svelte',
					source: `<scr` + `ipt>
	let name = 'world';
</scr` + `ipt>

<h1>Hello {name}!</h1>`
				}
			]
		});
	});
</script>

<main>
	<Repl bind:this={repl}/>
</main>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}

	main {
		block-size: 100vh;
	}
</style>
