<script>
	import { getContext } from 'svelte';
	import { parse } from 'marked';
	import Viewer from './Viewer.svelte';
	import PaneWithPanel from './PaneWithPanel.svelte';
	import CompilerOptions from './CompilerOptions.svelte';
	import Compiler from './Compiler.js';
	import CodeMirror from '../CodeMirror.svelte';
	import { is_browser } from '../env.js';

	const { register_output } = getContext('REPL');

	export let svelteUrl;
	export let status;
	export let sourceErrorLoc = null;
	export let runtimeError = null;
	export let embedded = false;
	export let relaxed = false;
	export let injectedJS;
	export let injectedCSS;
	export let theme;

	register_output({
		set: async (selected, options) => {
			selected_type = selected.type;

			if (selected.type === 'js' || selected.type === 'json') {
				js_editor.set(`/* Select a component to see its compiled code */`);
				css_editor.set(`/* Select a component to see its compiled code */`);
				return;
			}

			if (selected.type === 'md') {
				markdown = parse(selected.source);
				return;
			}

			const compiled = await compiler.compile(selected, options);
			if (!js_editor) return; // unmounted

			js_editor.set(compiled.js, 'js');
			css_editor.set(compiled.css, 'css');
		},

		update: async (selected, options) => {
			if (selected.type === 'js' || selected.type === 'json') return;

			if (selected.type === 'md') {
				markdown = parse(selected.source);
				return;
			}

			const compiled = await compiler.compile(selected, options);
			if (!js_editor) return; // unmounted

			js_editor.update(compiled.js);
			css_editor.update(compiled.css);
		}
	});

	const compiler = is_browser && new Compiler(svelteUrl);

	// refs
	let js_editor;
	let css_editor;

	let view = 'result';
	let selected_type = '';
	let markdown = '';
</script>

<div class="view-toggle">
	{#if selected_type === 'md'}
		<button class="active">Markdown</button>
	{:else}
		<button class:active={view === 'result'} on:click={() => (view = 'result')}>Result</button>
		<button class:active={view === 'js'} on:click={() => (view = 'js')}>JS output</button>
		<button class:active={view === 'css'} on:click={() => (view = 'css')}>CSS output</button>
	{/if}
</div>

<!-- component viewer -->
<div class="tab-content" class:visible={selected_type !== 'md' && view === 'result'}>
	<Viewer
		bind:error={runtimeError}
		{status}
		{relaxed}
		{injectedJS}
		{injectedCSS}
	/>
</div>

<!-- js output -->
<div class="tab-content" class:visible={selected_type !== 'md' && view === 'js'}>
	{#if embedded}
		<CodeMirror bind:this={js_editor} errorLoc={sourceErrorLoc} {theme} readonly />
	{:else}
		<PaneWithPanel pos={67} panel="Compiler options">
			<div slot="main">
				<CodeMirror bind:this={js_editor} errorLoc={sourceErrorLoc} {theme} readonly />
			</div>

			<div slot="panel-body">
				<CompilerOptions />
			</div>
		</PaneWithPanel>
	{/if}
</div>

<!-- css output -->
<div class="tab-content" class:visible={selected_type !== 'md' && view === 'css'}>
	<CodeMirror bind:this={css_editor} errorLoc={sourceErrorLoc} {theme} readonly />
</div>

<!-- markdown output -->
<div class="tab-content" class:visible={selected_type === 'md'}>
	<iframe title="Markdown" srcdoc={markdown} />
</div>

<style>
	.view-toggle {
		block-size: 4.2rem;
		border-block-end: 1px solid #eee;
		white-space: nowrap;
		box-sizing: border-box;
	}

	button {
		/* inline-size: 50%;
		block-size: 100%; */
		background: white;
		text-align: left;
		position: relative;
		font: 400 12px/1.5 var(--font);
		border: none;
		border-block-end: 3px solid transparent;
		padding: 12px;
		padding-block-end: 8px;
		color: #999;
		border-radius: 0;
	}

	button.active {
		border-block-end: 3px solid var(--prime);
		color: #333;
	}

	div[slot] {
		block-size: 100%;
	}

	.tab-content {
		position: absolute;
		inline-size: 100%;
		block-size: calc(100% - 42px) !important;
		visibility: hidden;
		pointer-events: none;
	}

	.tab-content.visible {
		visibility: visible;
		pointer-events: all;
	}
	iframe {
		inline-size: 100%;
		block-size: 100%;
		border: none;
		display: block;
	}
</style>
