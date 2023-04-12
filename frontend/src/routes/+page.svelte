<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { open_audio_control, open_mini_audio_control, user_data } from '../stores';
	import Audio from '../Audio';
	import MiniAudioControl from '$lib/Mini_audio_control.svelte';
	import AudioControl from '$lib/Audio_control.svelte';
	import Overlay from '$lib/Overlay.svelte';
	import Loader from '$lib/Loader.svelte';
	import { goto } from '$app/navigation';

	let favorite_stations: any = [];
	let Open_audio_control = false;
	let Open_mini_audio_control = false;
	let loading = true;

	$: user_data.subscribe((value) => {
		loading = true;
		if (favorite_stations !== value.favorites) {
			favorite_stations = value.favorites;
		}
		loading = false;
	});
	$: open_audio_control.subscribe((value) => {
		if (Open_audio_control !== value) {
			Open_audio_control = value;
		}
	});
	$: open_mini_audio_control.subscribe((value) => {
		if (Open_mini_audio_control !== value) {
			Open_mini_audio_control = value;
		}
	});
</script>

<section in:fly={{ x: 200, duration: 200, delay: 200 }} out:fade>
	<div
		class="content"
		class:open_audio_control={Open_audio_control}
		class:open_mini_audio_control={Open_mini_audio_control}
	>
		<header>
			<button on:click={() => goto('/radios')}><i class="bi bi-plus-lg" /></button>
			<h3>Favorites</h3>
		</header>
		<div class="c-radio-list">
			{#if loading}
				<div
					style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); display: flex; align-items: center;
        justify-content: center; flex-direction: column; gap: var(--pd)"
				>
					<Loader is_loading={true} />
					<h3>Loading...</h3>
				</div>
			{:else}
				<ul>
					{#if favorite_stations.length > 0}
						{#each favorite_stations as radioStation}
							<li class="c-radio-list">
								<div class="c-image">
									<img
										alt="image"
										src={radioStation.favicon}
										on:error={(event) =>
											(event.target.parentElement.innerHTML = `<i class="bi bi-music-note"></i>`)}
									/>
								</div>
								<p>{radioStation.name}</p>
								<button
									on:click={() => {
										new Audio().init_radio({ radio_station: radioStation });
									}}
								>
									<i class="bi bi-play-fill" />
								</button>
							</li>
						{/each}
					{:else}
						<button class="discover" on:click={() => goto('/radios')}>
							<p class="p light-color">Discover new stations</p>
						</button>
					{/if}
				</ul>
			{/if}
		</div>
	</div>
	<MiniAudioControl />
	<AudioControl />
	<Overlay />
</section>

<style>
	section {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		align-items: flex-start;
		justify-content: center;
		width: 100%;
		height: 100%;
		padding: var(--pd);
		background-color: rgb(var(--bg-color));
	}

	section .content {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		flex-direction: column;
		border-radius: var(--brdr);
		padding-bottom: 2.5em;
		overflow: auto;
	}

	section .content header {
		width: 100%;
		height: 3.5em;
		position: sticky;
		top: 0;
		background-color: rgb(var(--bg-color-secondary));
		border-radius: var(--brdr);
		display: flex;
		align-items: center;
		justify-content: flex-start;
		z-index: 1;
		box-shadow: var(--box-shadow);
		transition: box-shadow ease-in-out 200ms;
		padding: var(--pd);
	}

	section .content header button {
		height: 3em;
		width: 3em;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--brdr);
		background-color: transparent;
		border: none;
		cursor: pointer;
	}

	section .content header h3 {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.open_audio_control {
		width: calc(100% - 300px) !important;
	}

	.open_mini_audio_control {
		height: calc(100% - 3em) !important;
	}
	section .content .c-radio-list {
		width: 100%;
		height: calc(100% - 150px);
		display: flex;
		align-items: flex-start;
		justify-content: flex-start;
		flex-direction: column;
		padding: var(--pd);
		border-radius: var(--brdr);
	}
	section .content .c-radio-list ul {
		width: 100%;
		height: max-content;
		display: grid;
		grid-template-columns: 31% 31% 31%;
		align-items: start;
		justify-content: space-between;
		gap: var(--pd);
		padding-bottom: var(--pd);
	}
	section .content .c-radio-list ul button.discover {
		width: 50%;
		height: 2.7em;
		background-color: rgb(var(--orange));
		color: rgb(255, 255, 255);
		border: none;
		border-radius: var(--brdr);
		outline: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
	section .content .c-radio-list ul button > * {
		pointer-events: none;
	}

	section .content .c-radio-list ul li {
		width: 100%;
		height: 4em;
		list-style: none;
		display: grid;
		grid-template-columns: 70px calc(100% - 140px) 70px;
		align-items: center;
		justify-content: center;
		background-color: rgb(var(--bg-color-secondary));
		border-radius: var(--brdr);
		overflow: hidden;
		gap: var(--pd);
	}

	section .content .c-radio-list ul li .c-image {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	section .content .c-radio-list ul li .c-image img {
		width: 100%;
		height: 100%;
		display: block;
		margin-left: auto;
		margin-right: auto;
	}

	section .content .c-radio-list ul li button {
		width: 3.5em;
		height: 3em;
		border-radius: var(--brdr);
		border: none;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: transparent;
		cursor: pointer;
	}
	@media (max-width: 1000px) {
		section .content .c-radio-list ul {
			grid-template-columns: 49% 49%;
		}
	}
	@media (max-width: 600px) {
		.open_audio_control {
			width: 100% !important;
		}
		section .content .c-radio-list ul {
			grid-template-columns: 100%;
		}
	}
</style>
