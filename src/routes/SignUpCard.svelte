<script>
	import { log } from '../lib/utils';

	const no = `<svg class="h-8 w-8 flex-none fill-sky-100 stroke-sky-500 stroke-2" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>`;

	function submit() {
		const message = document.getElementById('message').value;
		log(`user left message: ${message}`);

		document.getElementById('form').innerHTML = 'Thank you!';
	}

	function hideModal() {
		document.getElementById('modal').classList.add('hidden');
	}

	function showModal() {
		log('user clicked on sign up button');
		document.getElementById('modal').classList.remove('hidden');
	}
</script>

<div
	class="relative bg-white px-6 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10"
>
	<div class="mx-auto max-w-md p-6">
		<div class="divide-y divide-gray-300/50">
			<!-- <div class="space-y-6 py-8 text-base leading-7 text-gray-600">
				<h3
					class="mb-4 font-extrabold leading-none tracking-tight text-gray-900 text-3xl dark:text-white"
				>
					Current limitations
				</h3>

				<ul class="space-y-4">
					<li class="flex items-center">
						{@html no}
						<p class="ml-4">50 invocations per day</p>
					</li>
					<li class="flex items-center">
						{@html no}
						<p class="ml-4">Single file input and single file output</p>
					</li>
					<li class="flex items-center">
						{@html no}

						<p class="ml-4">Download limited to MP3 and MP4 formats</p>
					</li>
				</ul>
				<p />
			</div> -->

			<div class="bg-white pb-8">
				<h2 class="text-3xl font-bold text-indigo-700 mb-6 text-center">Why Choose Cinema AI</h2>
				<div class="space-y-6">
					<div class="flex items-start space-x-3">
						<div
							class="inline-flex items-center justify-center h-10 w-10 rounded-md bg-indigo-500 text-white text-2xl p-2"
						>
							🗣️
						</div>
						<div>
							<h3 class="text-lg leading-6 font-medium text-indigo-700">Utilize Plain English</h3>
							<p class="mt-2 text-base text-gray-600">
								Our service requires no technical knowledge. Simply provide your instructions in
								plain English.
							</p>
						</div>
					</div>
					<div class="flex items-start space-x-3">
						<div
							class="inline-flex items-center justify-center h-10 w-10 rounded-md bg-indigo-500 text-white text-2xl p-2"
						>
							💽
						</div>
						<div>
							<h3 class="text-lg leading-6 font-medium text-indigo-700">Local File Processing</h3>
							<p class="mt-2 text-base text-gray-600">
								Your files are processed directly on your device, ensuring your data's privacy and
								security.
							</p>
						</div>
					</div>
					<div class="flex items-start space-x-3">
						<div
							class="inline-flex items-center justify-center h-10 w-10 rounded-md bg-indigo-500 text-white text-2xl p-2"
						>
							🌐
						</div>
						<div>
							<h3 class="text-lg leading-6 font-medium text-indigo-700">Browser-Based Service</h3>
							<p class="mt-2 text-base text-gray-600">
								Our service works seamlessly within your web browser, offering a user-friendly and
								efficient experience.
							</p>
						</div>
					</div>
				</div>
			</div>

			<div class="pt-8 text-base leading-7">
				<p class="text-gray-900">Are you ready to revolutionize your content creation?</p>
				<button
					class="mt-6 w-full rounded-lg bg-gradient-to-br from-indigo-600 via-sky-600 to-sky-400 px-6 py-3 text-lg font-bold text-white transition ease-in-out hover:scale-105 hover:border-sky-800 hover:bg-sky-800 hover:shadow-lg"
					on:click|preventDefault={showModal}>Sign Up today!</button
				>
			</div>
		</div>
	</div>
</div>

<div
	class="relative z-10 hidden"
	aria-labelledby="modal-title"
	role="dialog"
	aria-modal="true"
	id="modal"
>
	<!--
        Background backdrop, show/hide based on modal state.

        Entering: "ease-out duration-300"
          From: "opacity-0"
          To: "opacity-100"
        Leaving: "ease-in duration-200"
          From: "opacity-100"
          To: "opacity-0"
      -->
	<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

	<div class="fixed inset-0 z-10 overflow-y-auto">
		<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
			<!--
            Modal panel, show/hide based on modal state.

            Entering: "ease-out duration-300"
              From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              To: "opacity-100 translate-y-0 sm:scale-100"
            Leaving: "ease-in duration-200"
              From: "opacity-100 translate-y-0 sm:scale-100"
              To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          -->
			<div
				class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
			>
				<div class="flex items-center bg-white dark:bg-gray-900">
					<div class="container mx-auto">
						<div id="form" class="max-w-md mx-auto my-10">
							<div class="text-center">
								<h3 class="my-3 text-3xl font-semibold text-gray-700 dark:text-gray-200">
									Sign up
								</h3>
								<p class="text-gray-500 dark:text-gray-400">
									Thank you for your interest! This service is coming soon. Please feel free to
									leave your feedback below. What features would you like to have implemented? How
									much are you willing to pay?
								</p>
							</div>
							<div class="m-7">
								<form action="">
									<div class="mb-6">
										<label for="email" class="block mb-2 text-sm text-gray-600 dark:text-gray-400"
											>Your input</label
										>
										<textarea
											name="message"
											id="message"
											class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
										/>
									</div>

									<div class="mb-6">
										<button
											type="button"
											class="w-full px-3 py-4 text-white bg-indigo-500 rounded-md focus:bg-indigo-600 focus:outline-none"
											on:click|preventDefault={submit}>Send</button
										>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>

				<div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
					<button
						type="button"
						class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
						on:click|preventDefault={hideModal}>Cancel</button
					>
				</div>
			</div>
		</div>
	</div>
</div>
