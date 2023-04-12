<script lang="ts">
	import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
	import { auth } from '../../stores';

	const provider = new GoogleAuthProvider();
	const login = async () => {
		signInWithPopup(auth, provider);
	};
</script>

<section>
	<div class="card">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" class="logo-icon"
			><path
				fill="#4D4D4D"
				d="M40 17H24a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1z"
			/><path
				fill="#CCC"
				d="M20 21h-2v-6a1 1 0 0 1 1-1h4v2h-3v5zM46 21h-2v-5h-3v-2h4a1 1 0 0 1 1 1v6z"
			/><path
				fill="#FF8000"
				d="M51 20H13C6.935 20 2 24.935 2 31v10c0 6.065 4.935 11 11 11h38c6.065 0 11-4.935 11-11V31c0-6.065-4.935-11-11-11z"
			/><path
				fill="none"
				stroke="#000"
				stroke-linejoin="round"
				stroke-miterlimit="10"
				stroke-width="2"
				d="M21 27h22v12H21z"
			/><path
				fill="#FF8000"
				d="M21 25H3.792A10.93 10.93 0 0 0 2 31v10c0 1.412.277 2.758.764 4H21V25z"
			/><path
				fill="#4D4D4D"
				d="M60.208 25c-1.966-3.006-5.356-5-9.208-5h-8v5h17.208zM2.764 45C4.369 49.091 8.347 52 13 52h8v-7H2.764zM21 20h-8c-3.852 0-7.242 1.994-9.208 5H21v-5z"
			/><path fill="#CCC" d="M43 25v-5H21v32h22v-6z" /><path
				fill="#FF8000"
				d="M62 31a10.93 10.93 0 0 0-1.792-6H43v21h17.786A10.928 10.928 0 0 0 62 41V31z"
			/><path fill="#4D4D4D" d="M43 52h8c4.264 0 7.961-2.444 9.786-6H43v6z" /><circle
				cx="12"
				cy="35"
				r="5"
				fill="#3EBBDD"
			/><path
				fill="#FFF"
				d="M12 41c-3.309 0-6-2.691-6-6s2.691-6 6-6 6 2.691 6 6-2.691 6-6 6zm0-10c-2.206 0-4 1.794-4 4s1.794 4 4 4 4-1.794 4-4-1.794-4-4-4z"
			/><circle cx="52" cy="35" r="5" fill="#3EBBDD" /><path
				fill="#FFF"
				d="M52 41c-3.309 0-6-2.691-6-6s2.691-6 6-6 6 2.691 6 6-2.691 6-6 6zm0-10c-2.206 0-4 1.794-4 4s1.794 4 4 4 4-1.794 4-4-1.794-4-4-4zM28 36c-1.654 0-3-1.346-3-3s1.346-3 3-3 3 1.346 3 3-1.346 3-3 3zm0-4c-.551 0-1 .449-1 1s.449 1 1 1 1-.449 1-1-.449-1-1-1zM36 36c-1.654 0-3-1.346-3-3s1.346-3 3-3 3 1.346 3 3-1.346 3-3 3zm0-4c-.551 0-1 .449-1 1s.449 1 1 1 1-.449 1-1-.449-1-1-1zM25 43h14v2H25zM25 47h14v2H25zM11 34h2v2h-2z"
			/><path fill="#FFF" d="M51 34h2v2h-2z" /><path
				fill="#4D4D4D"
				d="M43 41H21V25h22v16zm-20-2h18V27H23v12z"
			/></svg
		>
		<p>Login in to web radio get access to over 30,000 radio stations worldwide</p>
		<button on:click={() => login()}>
			<i class="bi bi-google" />
			<p>Google Login</p>
		</button>
	</div>
</section>

<style>
	section {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		padding: var(--pd);
		background-color: rgb(var(--bg-color));
	}

	section .card {
		width: 100%;
		max-width: 400px;
		height: 400px;
		border-radius: var(--brdr);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		gap: 1em;
	}
	section .card p {
		text-align: center;
	}
	section .card button {
		width: 80%;
		height: 2.7em;
		background-color: rgb(var(--orange));
		border-radius: var(--brdr);
		border: none;
		outline: none;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--pd);
		cursor: pointer;
    padding: var(--pd);
	}

	section .card button p,
	section .card button i {
		color: rgb(255, 255, 255);
	}

	.logo-icon {
		width: 150px;
		height: 150px;
	}
</style>
