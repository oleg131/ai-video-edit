<script>
	import { log } from '../lib/utils';

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
								<h1 class="my-3 text-3xl font-semibold text-gray-700 dark:text-gray-200">
									Sign up
								</h1>
								<p class="text-gray-500 dark:text-gray-400">
									Thank you for your interest! Paid service is coming soon. Please feel free to
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

<div class="xl:-mx-8 xl:flex xl:items-center">
	<div class="flex flex-col items-center xl:mx-8 xl:items-start">
		<h1 class="text-3xl font-medium capitalize text-gray-800 dark:text-white lg:text-4xl">
			Upgrade to get more!
		</h1>

		<div class="mt-4">
			<span class="inline-block h-1 w-40 rounded-full bg-blue-500" />
			<span class="mx-1 inline-block h-1 w-3 rounded-full bg-blue-500" />
			<span class="inline-block h-1 w-1 rounded-full bg-blue-500" />
		</div>

		<p class="mt-4 font-medium text-gray-500 dark:text-gray-300">
			You can get lots of more features by upgrading to Premium!
		</p>
	</div>

	<div class="flex-1 xl:mx-8">
		<div
			class="mt-8 space-y-8 md:-mx-4 md:flex md:items-start md:justify-center md:space-y-0 xl:mt-0"
		>
			<div class="mx-auto max-w-sm rounded-lg border dark:border-gray-700 md:mx-4">
				<div class="p-6">
					<h1 class="text-xl font-medium capitalize text-gray-700 dark:text-white lg:text-3xl">
						Free
					</h1>

					<p class="mt-4 text-gray-500 dark:text-gray-300">
						The Free Plan is an excellent starting point for anyone who wants to explore the
						capabilities of our AI video editing tool.
					</p>
				</div>

				<hr class="border-gray-200 dark:border-gray-700" />

				<div class="p-6">
					<h1 class="text-lg font-medium capitalize text-gray-700 dark:text-white lg:text-xl">
						What’s included:
					</h1>

					<div class="mt-8 space-y-4">
						<div class="flex items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 text-blue-500"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clip-rule="evenodd"
								/>
							</svg>

							<span class="mx-4 text-gray-700 dark:text-gray-300"
								>Editing video and audio in browser</span
							>
						</div>

						<div class="flex items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 text-blue-500"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clip-rule="evenodd"
								/>
							</svg>

							<span class="mx-4 text-gray-700 dark:text-gray-300"
								>Provide instructions in plain language</span
							>
						</div>

						<div class="flex items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 text-blue-500"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clip-rule="evenodd"
								/>
							</svg>

							<span class="mx-4 text-gray-700 dark:text-gray-300">Single file processing</span>
						</div>
					</div>
				</div>
			</div>

			<div class="mx-auto max-w-sm rounded-lg border dark:border-gray-700 md:mx-4">
				<div class="p-6">
					<h1 class="text-xl font-medium capitalize text-gray-700 dark:text-white lg:text-3xl">
						Premium
					</h1>

					<p class="mt-4 text-gray-500 dark:text-gray-300">
						The Premium Plan is designed for professionals and businesses who require advanced
						editing features and prioritized support.
					</p>

					<h2 class="mt-4 text-2xl font-medium text-gray-700 dark:text-gray-300 sm:text-4xl">
						$10.00 <span class="text-base font-medium">/ month</span>
					</h2>

					<p class="mt-1 text-gray-500 dark:text-gray-300">One time payment</p>

					<button
						class="mt-6 w-full transform rounded-md bg-blue-600 px-4 py-2 capitalize tracking-wide text-white transition-colors duration-300 hover:bg-blue-500 focus:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
						on:click|preventDefault={showModal}>Sign Up for a Free Trial!</button
					>
				</div>

				<hr class="border-gray-200 dark:border-gray-700" />

				<div class="p-6">
					<h1 class="text-lg font-medium capitalize text-gray-700 dark:text-white lg:text-xl">
						What’s included:
					</h1>

					<div class="mt-8 space-y-4">
						<div class="flex items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 text-blue-500"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clip-rule="evenodd"
								/>
							</svg>

							<span class="mx-4 text-gray-700 dark:text-gray-300 font-bold"
								>Everything in the Free plan</span
							>
						</div>

						<div class="flex items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 text-blue-500"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clip-rule="evenodd"
								/>
							</svg>

							<span class="mx-4 text-gray-700 dark:text-gray-300">Queue multiple jobs</span>
						</div>

						<div class="flex items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 text-blue-500"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clip-rule="evenodd"
								/>
							</svg>

							<span class="mx-4 text-gray-700 dark:text-gray-300"
								>Use multiple files for input and output</span
							>
						</div>

						<div class="flex items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 text-blue-500"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clip-rule="evenodd"
								/>
							</svg>

							<span class="mx-4 text-gray-700 dark:text-gray-300">Use a dedicated machine </span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
