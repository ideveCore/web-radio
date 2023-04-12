<script lang="ts">
	import { fly } from 'svelte/transition';
	import { open_mini_audio_control, current_station, open_audio_control } from '../stores';
	import Audio from '../Audio';
	import Loader from './Loader.svelte';

	type Current_station_type = {
		name: string;
		favicon: string;
		paused: boolean;
		loading: boolean;
	};

	let Open_mini_audio_control = false;
	let Current_station: Current_station_type = {
		name: '',
		favicon: '',
		paused: true,
		loading: false
	};
	const logo_radio = {
		img: '',
		failed: false,
		loading: false,
		loaded: false
	};
  $: open_mini_audio_control.subscribe((value) => {
    if(Open_mini_audio_control !== value) {
      Open_mini_audio_control = value
    }
  })
	$: current_station.subscribe((value: any) => {
		Current_station = value;
		const img: HTMLImageElement = new Image();
		img.src = Current_station.favicon;
		logo_radio.loading = true;

		img.onload = () => {
			logo_radio.loading = false;
			logo_radio.loaded = true;
			logo_radio.img = `<img width="40" height="40" src="${Current_station.favicon}"/>`;
		};
		img.onerror = () => {
			logo_radio.loading = false;
			logo_radio.loaded = true;
			logo_radio.img = `<i class="bi bi-music-note"></i>`;
		};
	});

	const on_open_audio_control = () => {
		open_audio_control.update(() => true);

		open_mini_audio_control.update(() => false);
	};
</script>

{#if Open_mini_audio_control}
	<main transition:fly={{ y: 200 }}>
		<div class="c-image" on:click={() => on_open_audio_control()}>
			{@html logo_radio.img}
		</div>
		<div class="content" on:click={() => on_open_audio_control()}>
			<p>{Current_station.name}</p>
			<button on:click|stopPropagation={() => new Audio().play_pause()}>
				{#if Current_station.loading}
					<Loader is_loading={true} />
				{:else if Current_station.paused}
					<i class="bi bi-play-fill" />
				{:else}
					<i class="bi bi-stop-fill" />
				{/if}
			</button>
		</div>
	</main>
{/if}

<style>
	main {
		width: 100%;
		height: 3.5em;
		background-color: rgb(var(--bg-color-secondary));
		position: fixed;
		bottom: 0;
		left: 0;
		display: none;
		align-items: center;
		justify-content: center;
		z-index: 2;
		cursor: pointer;
		border-top-left-radius: var(--brdr);
		border-top-right-radius: var(--brdr);
		box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
	}
	main .c-image {
		width: 3em;
		height: 3em;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}
	main .content {
		width: calc(100% - 2em);
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--pd);
	}
	main .content button {
		width: 3.5em;
		height: 3em;
		border-radius: var(--brdr);
		border: none;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--brdr);
		background-color: transparent;
		cursor: pointer;
	}

	@media (max-width: 600px) {
		main {
			display: flex;
		}
	}
</style>
