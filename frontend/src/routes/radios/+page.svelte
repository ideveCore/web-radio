<script lang="ts">
	import '@splidejs/svelte-splide/css';
	import '@splidejs/svelte-splide/css/skyblue';
	import '@splidejs/svelte-splide/css/sea-green';
	import '@splidejs/svelte-splide/css/core';

	import { goto } from '$app/navigation';
	import { fade, fly } from 'svelte/transition';
	import { Splide, SplideTrack, SplideSlide } from '@splidejs/svelte-splide';
	import { radios, open_mini_audio_control, open_audio_control } from '../../stores';
	import AudioControl from '$lib/Audio_control.svelte';
	import MiniAudioControl from '$lib/Mini_audio_control.svelte';
	import Overlay from '$lib/Overlay.svelte';
	import Audio from '../../Audio';

	let Open_audio_control = false;
	let Open_mini_audio_control = false;
	let Radios = {
		top_clicks: [],
		recent_clicks: [],
		top_votes: [],
		searchs: []
	};

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
	$: radios.subscribe((value) => {
		Radios = {
			...value
		};
	});
</script>

<section in:fly={{ x: 200, duration: 200, delay: 200 }} out:fade>
	<div
		class="content"
		class:open_audio_control={Open_audio_control}
		class:open_mini_audio_control={Open_mini_audio_control}
	>
		<div class="c-slider">
			<button class="search" on:click={() => goto('/search')}>
				<i class="bi bi-search light" />
			</button>
			<Splide
				hasTrack={false}
				options={{
					autoplay: true,
					type: 'loop',
					classes: {
						page: 'splide__pagination__page pagination__page-progress'
					}
				}}
				style="padding: 2em;"
			>
				<SplideTrack>
					<SplideSlide style="display: flex; align-items: center; justify-content: center;">
						<h4 class="light-color">Browse over 30,000 radio stations</h4>
					</SplideSlide>
					<SplideSlide
						style="text-align: center; display: flex; align-items: center; justify-content; center;flex-direction: column; padding: 0;"
					>
						<h4 class="light-color">Provided by radio-browser.info</h4>
						<a
							style="text-decoration: none;"
							href="https://www.radio-browser.info/"
							target="_blank"
							class="slider__favorite-button light-color">Open site</a
						>
					</SplideSlide>
					<SplideSlide
						style="text-align: center; display: flex; align-items: center; justify-content; center;flex-direction: column; padding: 0;"
					>
						<h4 class="light-color">See your favorite stations at:</h4>
						<button class="slider__favorite-button light-color" on:click={() => goto('/')}
							>Favorites</button
						>
					</SplideSlide>
				</SplideTrack>
				<div class="splide__arrows">
					<button class="splide__arrow splide__arrow--prev">
						<i class="bi bi-chevron-left light-color" />
					</button>
					<button class="splide__arrow splide__arrow--next">
						<i class="bi bi-chevron-right light-color" />
					</button>
				</div>
			</Splide>
		</div>
		<div class="c-radio-list">
			<h3>Top votes</h3>
			<ul>
				{#each Radios.top_votes as radioStation}
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
							}}><i class="bi bi-play-fill" /></button
						>
					</li>
				{/each}
			</ul>

			<h3>Top clicks</h3>
			<ul>
				{#each Radios.top_clicks as radioStation}
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
							}}><i class="bi bi-play-fill" /></button
						>
					</li>
				{/each}
			</ul>

			<h3>Recent clicks</h3>
			<ul>
				{#each Radios.recent_clicks as radioStation}
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
							}}><i class="bi bi-play-fill" /></button
						>
					</li>
				{/each}
			</ul>
		</div>
	</div>
	<AudioControl />
	<MiniAudioControl />
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
	.open_audio_control {
		width: calc(100% - 300px) !important;
	}

	.open_mini_audio_control {
		height: calc(100% - 3em) !important;
	}
	.c-slider {
		width: 100%;
		height: 150px;
		background-color: rgb(var(--blue));
		border-radius: var(--brdr);
		padding: var(--pd);
		position: relative;
	}
	.c-slider button.search {
		position: absolute;
		top: var(--pd);
		right: var(--pd);
		width: 3em;
		height: 3em;
		display: flex;
		align-items: center;
		justify-content: center;
		border: none;
		border-radius: 50%;
		cursor: pointer;
		background-color: transparent;
		color: rgb(255, 255, 255);
		z-index: 1;
	}

	.slider__favorite-button {
		background-color: rgba(0, 0, 0, 0.3);
		width: 200px;
		height: 2.5em;
		border-radius: var(--brdr);
		display: flex;
		align-items: center;
		justify-content: center;
		border: none;
		outline: none;
		cursor: pointer;
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
