<script lang="ts">
	import '../styles/styles.css';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import axios from 'axios';
	import { onAuthStateChanged } from 'firebase/auth';
	import {
		auth,
		user_data,
		radios,
		backend_uri,
		audio,
		open_audio_control,
		open_mini_audio_control,
		api
	} from '../stores';
	import LoaderPage from '../lib/Loader_page.svelte';

	const get_stations = async (favorites: string[]) => {
		return {
			top_votes: await api.getStationsByVotes(10),
			top_clicks: await api.getStationsByClicks(10),
			recent_clicks: await api.getStationsByRecentClicks(10),
			favorites: await api.getStationsById(favorites)
		};
	};

	let is_loading = false;
	onMount(async () => {
		onAuthStateChanged(auth, async (user) => {
			if (user) {
				backend_uri.subscribe((uri = '') => {
					axios
						.post(`${uri}/api/v1/user-sync`, {
							uid: user.uid
						})
						.then(async (response) => {
							const stations: any = await get_stations(
								response.data.user.favorites.map((item: any) => item.station_id)
							);
							radios.update((value: any) => {
								return {
									...value,
									top_votes: stations.top_votes,
									top_clicks: stations.top_clicks,
									recent_clicks: stations.recent_clicks
								};
							});
							user_data.update(() => ({
								uid: user.uid,
								favorites: stations.favorites
							}));
							is_loading = true;
						})
						.catch(async () => {
							await goto('/login');
							is_loading = false;
						});
				});
				return await goto('/');
			} else {
				await goto('/login');
				is_loading = true;
			}
		});
		const audio_element = document.querySelector<HTMLAudioElement>('audio')!;

		audio.update(() => audio_element);
		window.onresize = () => {
			if (audio_element.src && window.innerWidth <= 600) {
				open_audio_control.update(() => false);
				open_mini_audio_control.update(() => true);
				return;
			}
			if (audio_element.src && window.innerWidth > 600) {
				open_audio_control.update(() => true);
				open_mini_audio_control.update(() => false);
			}
		};
	});
</script>

{#if is_loading}
	<slot />
{:else}
	<LoaderPage />
{/if}
<audio />
