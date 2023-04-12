<script lang="ts">
	import { fade } from 'svelte/transition';
	import { open_audio_control, open_mini_audio_control } from '../stores';

	let Open_audio_control = false;

	$: open_audio_control.subscribe((value) => {
		if (Open_audio_control !== value) {
			Open_audio_control = value;
		}
	});
</script>

{#if Open_audio_control}
	<main
		transition:fade
		on:click={() => {
			open_audio_control.update(() => false);
			open_mini_audio_control.update(() => true);
		}}
	/>
{/if}

<style>
	main {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.2);
		display: none;
		z-index: 1;
	}
	@media (max-width: 600px) {
		main {
			display: flex;
		}
	}
</style>
