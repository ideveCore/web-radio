<script lang="ts">
	export let is_loading = false;
</script>

{#if is_loading}
	<div class="loading-animation" />
{/if}

<style>
	.loading-animation {
		width: 1.7em;
		height: 1.7em;
		background-color: rgb(var(--bg-reverse));
		border-radius: 50%;
		position: relative;
		animation: rotate 1000ms linear forwards infinite;
	}
	.loading-animation::after {
		content: '';
		width: 0.7em;
		height: 0.7em;
		background-color: rgb(var(--bg-color));
		position: absolute;
		top: 0.3em;
		left: 0.3em;
		border-radius: 50%;
	}

	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>
