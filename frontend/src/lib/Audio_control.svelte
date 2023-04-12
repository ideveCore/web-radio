<script lang="ts">
	import { goto } from '$app/navigation';
	import { fly } from 'svelte/transition';
	import axios from 'axios';
	import {
		auth,
		open_audio_control,
		current_station,
		audio,
		backend_uri,
		user_data,
		api
	} from '../stores';
	import { onAuthStateChanged } from 'firebase/auth';
	import Audio from '../Audio';
	import Loader from './Loader.svelte';
	import type { Current_station } from '../Types';

	type Volume = {
		volume: number;
		open: boolean;
		time: number;
	};
	let loading_favorite = false;
	let Open_audio_control = true;
	let Current_radio: Current_station = {
		codec: '',
		bitrate: 0,
		station_id: '',
		favorite: false,
		language: '',
		favicon: '',
		tags: '',
		state: '',
		home_page: '',
		country_codes: '',
		country: '',
		loading: false,
		name: '',
		paused: true,
		url_resolved: '',
		votes: 0
	};

	let volume: Volume = {
		volume: 100,
		open: false,
		time: 0
	};
	const change_volume = () => {
		clearTimeout(volume.time);
		volume.time = setTimeout(() => {
			volume.open = false;
		}, 1500);
	};

	$: if (volume) {
		audio.subscribe((value: HTMLAudioElement) => {
			value.volume = volume.volume / 100;
			volume.volume = value.volume * 100;
		});
	}
	const logo_radio = {
		img: '',
		failed: false,
		loading: false,
		loaded: false
	};
	$: current_station.subscribe((value: any) => {
		if (Current_radio !== value) {
			Current_radio = value;
			const img: HTMLImageElement = new Image();
			img.src = Current_radio.favicon;
			logo_radio.loading = true;

			img.onload = () => {
				logo_radio.loading = false;
				logo_radio.loaded = true;
				logo_radio.img = `<img width="40" height="40" src="${Current_radio.favicon}"/>`;
			};
			img.onerror = () => {
				logo_radio.loading = false;
				logo_radio.loaded = true;
				logo_radio.img = `<i class="bi bi-music-note"></i>`;
			};
		}
	});

	$: open_audio_control.subscribe((value) => {
		if (Open_audio_control !== value) {
			Open_audio_control = value;
		}
	});

	const set_favorite = () => {
		loading_favorite = true;
		onAuthStateChanged(auth, async (user) => {
			if (user) {
				backend_uri.subscribe((uri = '') => {
					axios
						.post(`${uri}/api/v1/favorites`, {
							uid: user.uid,
							station_id: Current_radio.station_id
						})
						.then(async (response) => {
							const favorites: any = await api.getStationsById(
								response.data.user.favorites.map((item: any) => item.station_id)
							);
							const current_station_if_favorite = favorites.filter(
								(item: any) => item.id === Current_radio.station_id
							);
							Current_radio.favorite = current_station_if_favorite.length > 0;
							loading_favorite = false;
							user_data.update(() => ({
								uid: user.uid,
								favorites
							}));

							if (response.data.user.favorites.length > 0) {
								return await goto('/');
							}
							await goto('/radios');
						})
						.catch(async () => {
							loading_favorite = false;
						});
				});
			}
		});
	};
</script>

{#if Open_audio_control}
	<main transition:fly={{ x: 200 }}>
		<div class="c-image">
			{@html logo_radio.img}
		</div>
		<h3 style="text-align: center;">{Current_radio.name}</h3>
		<div class="controls">
			<div>
				<button
					id="volume"
					on:click={() => {
						volume = { ...volume, open: true };
						change_volume();
					}}
				>
					<i class="bi bi-volume-up-fill" />
				</button>
				{#if volume.open}
					<div class="volume-control">
						<button
							on:click={() => {
								volume.volume = volume.volume < 90 ? volume.volume + 10 : (volume.volume = 100);
								change_volume();
							}}><i class="bi bi-plus" /></button
						>
						<input
							type="range"
							orient="vertical"
							bind:value={volume.volume}
							on:input={() => change_volume()}
						/>
						<button
							on:click={() =>
								(volume.volume = volume.volume > 10 ? volume.volume - 10 : (volume.volume = 0))}
							><i class="bi bi-dash" /></button
						>
					</div>
				{/if}
			</div>
			<button id="stop" on:click={() => new Audio().play_pause()}>
				{#if Current_radio.loading}
					<Loader is_loading={true} />
				{:else if Current_radio.paused}
					<i class="bi bi-play-fill" />
				{:else}
					<i class="bi bi-stop-fill" />
				{/if}
			</button>
			<button id="favorite" on:click={() => set_favorite()}>
				{#if loading_favorite}
					<Loader is_loading={true} />
				{:else if Current_radio.favorite}
					<i class="bi bi-star-fill" />
				{:else}
					<i class="bi bi-star" />
				{/if}
			</button>
		</div>
		<h4 style="text-indent: 0.5em; align-self: flex-start;">Informations</h4>
		<ul class="details">
			<li>
				<p>Language</p>
				<p>{Current_radio.language}</p>
			</li>
			<li>
				<p>Tags</p>
				<p>{Current_radio.tags}</p>
			</li>
			<li>
				<p>Votes</p>
				<p>{Current_radio.votes}</p>
			</li>
		</ul>

		<h4 style="text-indent: 0.5em; align-self: flex-start;">Audio</h4>
		<ul class="details">
			<li>
				<p>Bitrate</p>
				<p>{Current_radio.bitrate}</p>
			</li>
			<li>
				<p>Codec</p>
				<p>{Current_radio.codec}</p>
			</li>
			<li>
				<p>Reprodution</p>
				<p><a href={Current_radio.url_resolved} target="_blank">{Current_radio.url_resolved}</a></p>
			</li>
		</ul>
	</main>
{/if}

<style>
	main {
		gap: var(--pd);
		width: 300px;
		height: 100%;
		z-index: 2;
		padding: var(--pd);
		overflow-y: auto;
		background-color: rgb(var(--bg-color));
		border-radius: var(--brdr);
	}
	main .c-image {
		width: 100%;
		height: 200px;
		background-color: rgb(var(--bg-color-secondary));
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--brdr);
		overflow: hidden;
	}
	main .controls {
		width: 100%;
		height: max-content;
		display: flex;
		align-items: center;
		justify-content: space-evenly;
	}
	main .controls button {
		width: 3.5em;
		height: 3em;
		display: flex;
		align-items: center;
		justify-content: center;
		border: none;
		outline: none;
		background-color: transparent;
		border-radius: var(--brdr);
		cursor: pointer;
	}
	main .controls div {
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}
	main .controls div .volume-control {
		background-color: rgb(var(--bg-color-secondary));
		position: absolute;
		top: 100%;
		left: 0;
		height: 250px;
		width: 3em;
		border-radius: var(--brdr);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		overflow: hidden;
		gap: var(--pd);

		box-shadow: 0px 0px 20px 12px rgba(17, 17, 26, 0.18);
	}

	main .controls div .volume-control button {
		width: 100%;
		height: 4em;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: transparent;
		border: none;
		border-radius: 0;
	}

	/* ++++++++ INPUT RANGE ++++++ */
	main .controls div .volume-control input[type='range'] {
		width: 1.1em;
		height: calc(100% - 6em);
		appearance: none;
		-webkit-appearance: slider-vertical;
		background-color: rgba(0, 0, 0, 0.2);
		outline: none;
		overflow: hidden;
		border-radius: var(--brdr);
		cursor: pointer;
	}

	main .controls div .volume-control input[type='range']::-webkit-slider-thumb {
		width: 1.1em;
		height: 1.1em;
		background-color: rgb(var(--orange));
		border: none;
		border-radius: 50%;
		outline: none;
		box-shadow: 0px 410px 0px 400px rgb(var(--orange));
		cursor: pointer;
	}

	main .controls div .volume-control input[type='range']::-moz-range-thumb {
		width: 1.1em;
		height: 1.1em;
		background-color: rgb(var(--orange));
		border: none;
		border-radius: 50%;
		outline: none;
		box-shadow: 0px 410px 0px 400px rgb(var(--orange));
		cursor: pointer;
	}

	main ul.details {
		width: 100%;
		background-color: rgb(var(--bg-color-secondary));
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		border-radius: var(--brdr);
		overflow: hidden;
	}

	main ul.details li {
		width: 100%;
		height: 4em;
		list-style: none;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--pd);
		overflow-x: auto;
		text-align: right;
		gap: var(--pd);
	}

	main ul.details li + li {
		border-top: 0.1em solid rgb(var(--bg-color));
	}

	main ul.details li p:last-child {
		text-transform: capitalize;
		width: max-content;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	main .controls button:nth-child(2) {
		width: 5em;
		background-color: rgb(var(--bg-color-secondary));
	}
	@media (max-width: 600px) {
		main {
			padding: var(--pd);
			position: fixed;
			right: 0;
			top: 0;
			bottom: 0;
			border-top-right-radius: 0;
			border-bottom-right-radius: 0;
		}
	}
</style>
