<script>
	import parse from 'shell-quote/parse';
	import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
	import { v1 as uuidv1 } from 'uuid';
	import { log } from '../lib/utils';
	import { browser } from '$app/environment';
	// import mime from 'mime-types';
	import mime from 'mime';

	import Limitations from './Limitations.svelte';

	// let console = {};
	// console.log = function (arg) {
	// 	if (typeof arg == 'object') {
	// 		arg = JSON.stringify(arg);
	// 	}
	// 	document.getElementById('console').innerHTML += `<br />` + arg;
	// };

	const ENDPOINT = '/.netlify/functions/api';

	if (browser) {
		if (!localStorage.userId) {
			localStorage.userId = uuidv1();
		}
	}

	function findArg(arg, args) {
		for (let index = 0; index < args.length; index++) {
			const element = args[index];
			if (element === arg) {
				return args[index + 1];
			}
		}
	}

	function hmsToSecondsOnly(str) {
		if (!str) {
			return null;
		}

		var p = str.split(':'),
			s = 0,
			m = 1;

		while (p.length > 0) {
			s += m * parseInt(p.pop(), 10);
			m *= 60;
		}

		return s;
	}

	const transcode = async ({ file, args, inputIndex, outputIndex }) => {
		const ffmpeg = createFFmpeg({ log: true });

		ffmpeg.setLogger(({ type, message }) => {
			// console.log({ type, message });
			/*
			 * type can be one of following:
			 *
			 * info: internal workflow debug messages
			 * fferr: ffmpeg native stderr output
			 * ffout: ffmpeg native stdout output
			 */

			if (type === 'fferr') {
				document.getElementById('ffmpeg').innerHTML = message;
			}

			if (message.includes('pthread sent an error')) {
				document.getElementById('status').innerHTML = 'Error processing video';
				document.getElementById('submit-button').classList.remove('hidden');
				document.getElementById('spinner').classList.add('hidden');
			}
		});

		ffmpeg.setProgress((e) => {
			console.log('progress', e);

			if (e.ratio === 0) {
				document.getElementById('progress').innerHTML = '0%';
				return;
			}

			if (e.ratio === 1) {
				document.getElementById('progress').innerHTML = null;
				return;
			}

			if (endDuration) {
				document.getElementById('progress').innerHTML = `Progress: ${Math.round(
					(100 * e.time) / endDuration
				)}%`;
			} else {
				document.getElementById('progress').innerHTML = `Progress: ${Math.round(100 * e.ratio)}%`;
			}
		});

		if (!ffmpeg.isLoaded()) {
			await ffmpeg.load();
		}

		ffmpeg.FS('writeFile', file.name, await fetchFile(file));

		let endDuration;

		let ss = hmsToSecondsOnly(findArg('-ss', args)) || 0;
		let t = hmsToSecondsOnly(findArg('-t', args));
		let to = hmsToSecondsOnly(findArg('-t', args));
		if (t) {
			endDuration = t;
		} else if (to) {
			endDuration = to - ss;
		}

		console.log('end duration', endDuration);

		args[inputIndex] = file.name;

		console.log('new args', args);

		const outputName = args[outputIndex];

		console.log(outputName);

		const mimeType = mime.getType(outputName);
		console.log(mimeType);

		console.log('running ffmpeg');

		try {
			await ffmpeg.run(...args);
		} catch (error) {
			console.error(error);
			document.getElementById('ffmpeg').innerHTML = error;
			document.getElementById('submit-button').classList.remove('hidden');
			document.getElementById('spinner').classList.add('hidden');

			return;
		}

		console.log('finished running ffmpeg');

		console.log('trying to read output');

		try {
			const data = ffmpeg.FS('readFile', outputName);
			const video = document.getElementById('player');

			let media;

			if (mimeType.startsWith('audio/')) {
				media = document.createElement('audio');
				media.setAttribute('controls', '');
			} else if (mimeType.startsWith('image/')) {
				media = document.createElement('img');
			} else {
				media = document.createElement('video');
				media.setAttribute('controls', '');
			}

			media.src = URL.createObjectURL(new Blob([data.buffer], { type: mimeType }));

			video.innerHTML = '';
			video?.appendChild(media);

			// video.src = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));

			document.getElementById('output-video-container').classList.remove('hidden');

			console.log('output read');
		} catch (error) {
			document.getElementById('status').innerHTML = 'Error processing video';

			console.log('output reading error');
		}

		document.getElementById('submit-button').classList.remove('hidden');
		document.getElementById('spinner').classList.add('hidden');
		document.getElementById('ffmpeg').innerHTML = null;
	};

	// onMount(async () => {

	async function submitData() {
		log('user pressed submit');

		// @ts-ignore
		const text = document.getElementById('text').value;

		if (!text.length) {
			throw Error('empty command');
		}

		document.getElementById('output-video-container').classList.add('hidden');
		document.getElementById('submit-button').classList.add('hidden');
		document.getElementById('spinner').classList.remove('hidden');
		document.getElementById('status').innerHTML = null;
		document.getElementById('ffmpeg').innerHTML = null;

		console.log('received text:', text);

		console.log('waiting for response');

		document.getElementById('status').innerHTML = 'Interpreting your query...';

		const response = await fetch(ENDPOINT, {
			method: 'post',
			body: JSON.stringify({ data: text }),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (response.status >= 400 && response.status < 600) {
			const text = await response.text();
			if (text.toLowerCase().includes('task timed out after')) {
				document.getElementById('status').innerHTML = 'Servers are overloaded.';
			} else {
				document.getElementById('status').innerHTML = "Can't understand your query.";
			}

			document.getElementById('submit-button').classList.remove('hidden');
			document.getElementById('spinner').classList.add('hidden');

			return;
		}

		const answer = await response.json();

		console.log('received response', answer);

		const { command, description } = answer;

		console.log('parsing command', command);

		let args = parse(command);

		console.log('parsed command to args', args);

		if (args[0] === 'ffmpeg') {
			args = args.slice(1);
			document.getElementById('status').innerHTML =
				'Processing your file... ' + description || null;
		} else {
			document.getElementById('status').innerHTML = 'Error parsing command, please try again';
			throw Error('1st arg is not ffmpeg');
		}

		let inputIndex;

		for (let index = 0; index < args.length; index++) {
			const element = args[index];
			if (element === '-i') {
				inputIndex = index + 1;
				break;
			}
		}

		if (!inputIndex) {
			throw Error('no input index');
		}

		console.log({ inputIndex });

		const outputIndex = args.length - 1;

		console.log('processing command with input index and output index', inputIndex, outputIndex);

		transcode({
			file: document.getElementById('uploader').files[0],
			args: args,
			inputIndex,
			outputIndex
		});

		console.log('processing done');
	}

	function onInputChange(e) {
		const file = e.target.files[0];

		let media;

		if (file.type.startsWith('audio/')) {
			media = document.createElement('audio');
			media.setAttribute('controls', '');
		} else if (file.type.startsWith('image/')) {
			media = document.createElement('img');
		} else {
			media = document.createElement('video');
			media.setAttribute('controls', '');
		}

		media.src = URL.createObjectURL(file);

		document.getElementById('video').innerHTML = '';
		document.getElementById('video')?.appendChild(media);

		// document.getElementById('video').src = URL.createObjectURL(file);
		// document.getElementById("video").play();

		document.getElementById('input-file-container').classList.add('hidden');
		document.getElementById('input-video-container').classList.remove('hidden');
	}

	function clearInputVideo() {
		// document.getElementById('video').src = '';
		document.getElementById('video').innerHTML = '';
		document.getElementById('uploader').value = null;
		document.getElementById('input-file-container').classList.remove('hidden');
		document.getElementById('input-video-container').classList.add('hidden');
	}

	function clearOutputVideo() {}

	log('user loaded website');
</script>

<div>
	<div class="flex flex-col w-full">
		<h1 class="text-5xl font-extrabold text-center lg:text-7xl 2xl:text-8xl">
			<span
				class="text-transparent bg-gradient-to-br bg-clip-text from-teal-500 via-indigo-500 to-sky-500 dark:from-teal-200 dark:via-indigo-300 dark:to-sky-500"
			>
				Unleash the Power of AI in Media Editing
			</span>
		</h1>

		<p class="max-w-3xl mx-auto mt-6 text-lg text-center text-gray-700 dark:text-white md:text-xl">
			Revolutionize your video and audio editing process using the power of AI with our intelligent
			and user-friendly app Cinema AI. Quickly modify media in minutes by telling the app what you'd
			like to do in plain language and received modified video according to your instructions.
		</p>
	</div>
</div>

<main>
	<!-- component -->
	<div class="flex items-center justify-center">
		<!-- Author: FormBold Team -->
		<!-- Learn More: https://formbold.com -->
		<div class="mx-auto w-full max-w-[550px] bg-white">
			<form class="py-6 px-9" action="https://formbold.com/s/FORM_ID" method="POST">
				<div class="mb-6 pt-4">
					<span class="mb-5 block text-xl font-semibold text-[#07074D]">
						Select your media file
					</span>

					<div id="input-file-container" class="flex items-center justify-center w-full">
						<label
							for="uploader"
							class="flex flex-col items-center justify-center w-full h-36 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
						>
							<div class="flex flex-col items-center justify-center pt-5 pb-6">
								<svg
									class="w-10 h-10 mb-3 text-gray-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
									><path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
									/></svg
								>
								<p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
									<span class="font-semibold">Click to upload</span> or drag and drop
								</p>
								<p class="text-xs text-gray-500 dark:text-gray-400">
									Compatible with most media file
								</p>
							</div>
							<input type="file" id="uploader" on:change={onInputChange} class="hidden" />
						</label>
					</div>

					<div id="input-video-container" class="hidden text-center">
						<div class="mt-5 rounded-md bg-[#F5F7FB] overflow-hidden">
							<div class="">
								<!-- <video id="video" controls class="w-full" /> -->
								<div id="video" class="w-full" />
							</div>
						</div>

						<small class="text-slate-400 cursor-pointer" on:click|preventDefault={clearInputVideo}
							>Clear</small
						>
					</div>

					<span class="mt-5 block text-xl font-semibold text-[#07074D]">
						Describe what you would like to do
					</span>

					<div class="mt-5 rounded-md bg-[#F5F7FB] py-4 px-8">
						<textarea
							id="text"
							rows="4"
							class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							placeholder="Extract first 2 seconds and flip the video horizontally."
						/>
					</div>
				</div>

				<div id="submit-button">
					<button
						class="hover:shadow-form w-full rounded-md bg-indigo-700 hover:bg-indigo-500 focus:ring-indigo-300 py-3 px-8 text-center text-base font-semibold text-white outline-none"
						on:click|preventDefault={submitData}
					>
						Submit
					</button>
				</div>

				<div id="spinner" class="mt-5 flex justify-center flex-col items-center hidden">
					<div
						class="w-12 h-12 rounded-full animate-spin
			border-8 border-dashed border-indigo-500 border-t-transparent"
					/>
					<div id="progress" class="mt-2 text-indigo-500 font-mono font-bold">Progress</div>
				</div>

				<div id="status" class="mt-5 text-black font-mono font-semibold text-center" />
				<div id="ffmpeg" class="mt-5 text-gray-700 font-mono font-semibold text-center" />

				<div id="console" />

				<div
					id="output-video-container"
					class="mt-5 flex justify-center flex-col items-center hidden"
				>
					<!-- <span class="mt-5 block text-xl font-semibold text-[#07074D]"> Result </span> -->
					<span class="w-16 block text-indigo-400">
						<svg
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M19.5 5.25l-7.5 7.5-7.5-7.5m15 6l-7.5 7.5-7.5-7.5"
							/>
						</svg>
					</span>

					<div class="mt-5 rounded-md bg-[#F5F7FB] overflow-hidden">
						<div class="">
							<!-- <video id="player" controls class="w-full" /> -->
							<div id="player" class="w-full" />
						</div>
					</div>
				</div>
			</form>
		</div>
	</div>

	<!-- <input type="file" id="uploader" on:change={onInputChange} />

	<div class="hidden"><video id="player" controls /></div>

	<textarea id="text" rows="4" cols="50">extract first 2 seconds</textarea>

	<button on:click={onClick}>button</button> -->
</main>

<Limitations />
<main class="mb-auto h-10" />
<footer class="text-center">
	Resources used: <a href="https://github.com/ffmpegwasm/ffmpeg.wasm">ffmpeg.wasm</a> ·
	<a href="https://chat.openai.com/">ChatpGPT</a>
	· <a href="https://kit.svelte.dev/">SvelteKit</a> ·
	<a href="https://tailwindcss.com/">Tailwind CSS</a>
</footer>
