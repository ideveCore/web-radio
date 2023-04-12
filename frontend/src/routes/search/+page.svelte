<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { open_audio_control, api, open_mini_audio_control } from '../../stores';
	import Audio from '../../Audio';
	import Loader from '$lib/Loader.svelte';
	import AudioControl from '$lib/Audio_control.svelte';
	import MiniAudioControl from '$lib/Mini_audio_control.svelte';
	import Overlay from '$lib/Overlay.svelte';
	import { StationSearchOrder, StationSearchType } from 'radio-browser-api';

	type Order = {
		order: keyof typeof StationSearchOrder;
		reverse: boolean;
		open: boolean;
		time: any;
	};

	let Radios: any = [];
	let loading = false;
	let search_station_value = '';
	let order_reverse = false;

	let Open_audio_control = false;
	let Open_mini_audio_control = false;

	let order: Order = {
		order: StationSearchOrder.name,
		reverse: false,
		open: false,
		time: 0
	};

	$: if (order) {
		order_reverse = order.reverse;
	}

	const change_order = () => {
		clearTimeout(order.time);
		order.time = setTimeout(() => {
			order.open = false;
		}, 1500);
	};

	const search = async () => {
		if (search_station_value.length > 0) {
			loading = true;
			Radios = await api.getStationsBy(StationSearchType.byName, search_station_value.trim(), {
				order: order.order,
				reverse: order.reverse
			});
			loading = false;
		}
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
</script>

<section in:fly={{ x: 200, duration: 200, delay: 200 }} out:fade>
	<div
		class="content"
		class:open_audio_control={Open_audio_control}
		class:open_mini_audio_control={Open_mini_audio_control}
	>
		<header>
			<button class="back" on:click={() => goto('/radios')}><i class="bi bi-chevron-left" /></button
			>
			<input
				type="text"
				placeholder="Radio name"
				bind:value={search_station_value}
				on:change={() => search()}
			/>
			<button
				class="order-by"
				on:click={() => {
					order = { ...order, open: true };
					change_order();
				}}
			>
				{#if order_reverse}
					<i class="bi bi-sort-up" />
				{:else}
					<i class="bi bi-sort-down" />
				{/if}
				<p style="text-transform: capitalize;">{order.order}</p>
				{#if order.open}
					<main transition:fade>
						<div class="row">
							<input
								type="radio"
								id="name"
								value="name"
								name="order-by"
								checked={order.order === StationSearchOrder.name}
								on:change={() => {
									order.order = StationSearchOrder.name;
									search();
								}}
							/>
							<label for="name">Name</label>
						</div>
						<div class="row">
							<input
								type="radio"
								id="language"
								name="order-by"
								checked={order.order === StationSearchOrder.language}
								on:change={() => {
									order.order = StationSearchOrder.language;
									search();
								}}
							/>
							<label for="language">Language</label>
						</div>
						<div class="row">
							<input
								type="radio"
								id="country"
								name="order-by"
								checked={order.order === StationSearchOrder.country}
								on:change={() => {
									order.order = StationSearchOrder.country;
									search();
								}}
							/>
							<label for="country">Country</label>
						</div>
						<div class="row">
							<input
								type="radio"
								id="state"
								name="order-by"
								checked={order.order === StationSearchOrder.state}
								on:change={() => {
									order.order = StationSearchOrder.state;
									search();
								}}
							/>
							<label for="state">State</label>
						</div>
						<div class="row">
							<input
								type="radio"
								id="votes"
								name="order-by"
								checked={order.order === StationSearchOrder.votes}
								on:change={() => {
									order.order = StationSearchOrder.votes;
									search();
								}}
							/>
							<label for="votes">Votes</label>
						</div>
						<div class="row">
							<input
								type="radio"
								id="bitrate"
								name="order-by"
								checked={order.order === StationSearchOrder.bitrate}
								on:change={() => {
									order.order = StationSearchOrder.bitrate;
									search();
								}}
							/>
							<label for="bitrate">Bitrate</label>
						</div>
						<div class="separator" />
						<div class="row">
							<input
								type="radio"
								id="crescent"
								name="mode"
								checked={!order.reverse}
								on:change={() => {
									order.reverse = false;
									search();
								}}
							/>
							<label for="crescent">Crescent</label>
						</div>
						<div class="row">
							<input
								type="radio"
								id="descending"
								name="mode"
								checked={order.reverse}
								on:change={() => {
									order.reverse = true;
									search();
								}}
							/>
							<label for="descending">Descending</label>
						</div>
					</main>
				{/if}
			</button>
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
					{#each Radios as radioStation}
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
				</ul>
			{/if}
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
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--brdr);
		background-color: transparent;
		border: none;
		cursor: pointer;
		padding: var(--pd);
		position: relative;
	}

	section .content header button p {
		pointer-events: none;
	}

	section .content header button.back {
		width: 3em;
		height: 3em;
	}

	section .content header button.order-by {
		gap: var(--pd);
	}

	section .content header button.order-by main {
		width: 200px;
		position: absolute;
		top: 100%;
		right: 0;
		background-color: rgb(var(--bg-color-secondary));
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		box-shadow: 0px 0px 20px 12px rgba(17, 17, 26, 0.18);
		border-radius: var(--brdr);
		padding: var(--pd);
	}

	section .content header button.order-by main .row {
		width: 100%;
		height: max-content;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		padding: var(--pd);
		gap: var(--pd);
	}

	section .content header button.order-by main .row label {
		font-size: 1.3em;
		font-weight: 600;
		color: rgb(var(--text-color));
	}

	section .content header button.order-by main .row input[type='radio'] {
		appearance: none;
		border-radius: 50%;
		width: 16px;
		height: 16px;
		border: 2px solid rgb(var(--orange));
		transition: 0.2s all linear;
		margin-right: 5px;
		position: relative;
		top: 4px;
	}

	section .content header button.order-by main .row input[type='radio']:checked {
		border: 0.4em solid rgb(var(--orange));
	}

	section .content header input {
		width: calc(100% - 3em);
		height: 100%;
		border: none;
		outline: none;
		background-color: transparent;
		border-radius: var(--brdr);
		color: rgb(var(--text-color));
    text-indent: 1em;
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
