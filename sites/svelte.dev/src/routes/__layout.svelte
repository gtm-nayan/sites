<script>
	import '@sveltejs/site-kit/base.css';
	import { setContext } from 'svelte';
	import { page, navigating, session } from '$app/stores';
	import { Icon, Icons, Nav, NavItem } from '@sveltejs/site-kit';
	import PreloadingIndicator from '../components/PreloadingIndicator.svelte';

	setContext('app', {
		login: () => {
			const login_window = window.open(
				`${window.location.origin}/auth/login`,
				'login',
				'width=600,height=400'
			);

			window.addEventListener('message', function handler(event) {
				login_window.close();
				window.removeEventListener('message', handler);
				$session.user = event.data.user;
			});
		},

		logout: async () => {
			const r = await fetch(`/auth/logout`, {
				credentials: 'include'
			});

			if (r.ok) $session.user = null;
		}
	});
</script>

<Icons />

{#if $navigating && $navigating.to}
	<PreloadingIndicator />
{/if}

{#if $page.path !== '/repl/embed'}
	<Nav {page} logo="/svelte-logo-horizontal.svg">
		<svelte:fragment slot="nav-center">
			<NavItem href="/tutorial">Tutorial</NavItem>
			<NavItem href="/docs">Docs</NavItem>
			<NavItem href="/examples">Examples</NavItem>
			<NavItem href="/repl">REPL</NavItem>
			<NavItem href="/blog">Blog</NavItem>
			<NavItem href="/faq">FAQ</NavItem>
		</svelte:fragment>

		<svelte:fragment slot="nav-right">
			<NavItem external="https://kit.svelte.dev">SvelteKit</NavItem>

			<NavItem external="/chat" title="Discord Chat">
				<span class="small">Discord</span>
				<span class="large"><Icon name="message-square" /></span>
			</NavItem>

			<NavItem external="https://github.com/sveltejs/svelte" title="GitHub Repo">
				<span class="small">GitHub</span>
				<span class="large"><Icon name="github" /></span>
			</NavItem>
		</svelte:fragment>
	</Nav>
{/if}

<main>
	<slot />
</main>

<style>
	main {
		position: relative;
		margin-inline: auto;
		margin-block: 0;
		/* padding-inline: var(--side-nav);
		padding-block: var(--nav-h) 0; */
		padding-block-start: var(--nav-h);
	}

	.small {
		display: inline;
	}

	.large {
		display: none;
	}

	@media (min-width: 800px) {
		.small {
			display: none;
		}

		.large {
			display: inline;
		}
	}
</style>
