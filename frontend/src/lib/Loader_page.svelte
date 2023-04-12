<script lang="ts">
	import Loader from './Loader.svelte';
	let is_loading = true;
</script>

<section>
	<Loader {is_loading} />
	<h3>Loading...</h3>
</section>

<style>
	section {
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		flex-direction: column;
		gap: var(--pd);
		background-color: rgb(var(--bg-color));
	}
</style>
