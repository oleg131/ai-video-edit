<script>
  import { onMount } from "svelte";
  import parse from "shell-quote/parse";
  import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

  const ffmpeg = createFFmpeg({ log: true });

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

    var p = str.split(":"),
      s = 0,
      m = 1;

    while (p.length > 0) {
      s += m * parseInt(p.pop(), 10);
      m *= 60;
    }

    return s;
  }

  const transcode = async ({ file, args, inputIndex, outputIndex }) => {
    if (!ffmpeg.isLoaded()) {
      await ffmpeg.load();
    }

    ffmpeg.FS("writeFile", file.name, await fetchFile(file));

    let endDuration;

    let ss = hmsToSecondsOnly(findArg("-ss", args)) || 0;
    let t = hmsToSecondsOnly(findArg("-t", args));
    let to = hmsToSecondsOnly(findArg("-t", args));
    if (t) {
      endDuration = ss + t;
    } else if (to) {
      endDuration = to;
    }

    ffmpeg.setProgress((e) => {
      console.log("progress", e);

      if (e.ratio === 0) {
        document.getElementById("progress").innerHTML = "0%";
        return;
      }

      if (e.ratio === 1) {
        document.getElementById("progress").innerHTML = null;
        return;
      }

      if (endDuration) {
        document.getElementById("progress").innerHTML = `Progress: ${Math.round(
          (100 * e.time) / endDuration
        )}%`;
      } else {
        document.getElementById("progress").innerHTML = `Progress: ${Math.round(
          e.ratio * 100
        )}%`;
      }
    });

    args[inputIndex] = file.name;

    console.log("args", args);

    const outputName = args[outputIndex];

    await ffmpeg.run(...args);

    try {
      const data = ffmpeg.FS("readFile", outputName);

      const video = document.getElementById("player");
      video.src = null;
      video.src = URL.createObjectURL(
        new Blob([data.buffer], { type: "video/mp4" })
      );

      document
        .getElementById("output-video-container")
        .classList.remove("hidden");
    } catch (error) {
      document.getElementById("status").innerHTML = "Error processing video";
    }

    document.getElementById("submit-button").classList.remove("hidden");
    document.getElementById("spinner").classList.add("hidden");
  };

  // onMount(async () => {

  async function submitData() {
    document.getElementById("player").src = null;
    document.getElementById("output-video-container").classList.add("hidden");
    document.getElementById("submit-button").classList.add("hidden");
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("status").innerHTML = null;

    // @ts-ignore
    const text = document.getElementById("text").value;

    if (!text.length) {
      throw Error("empty command");
    }

    console.log({ text });

    const response = await fetch("http://localhost:5678/api", {
      method: "post",
      body: JSON.stringify({ data: text }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status >= 400 && response.status < 600) {
      document.getElementById("status").innerHTML =
        "Can't understand your query";
      return;
    }

    const answer = await response.json();

    console.log(answer);

    const { command, description } = answer;

    let args = parse(command);

    console.log({ args });

    if (args[0] === "ffmpeg") {
      args = args.slice(1);
      document.getElementById("status").innerHTML = description;
    } else {
      document.getElementById("status").innerHTML =
        "Error parsing command, please try again";
      throw Error("1st arg is not ffmpeg");
    }

    let inputIndex;

    for (let index = 0; index < args.length; index++) {
      const element = args[index];
      if (element === "-i") {
        inputIndex = index + 1;
        break;
      }
    }

    if (!inputIndex) {
      throw Error("no input index");
    }

    console.log({ inputIndex });

    const outputIndex = args.length - 1;

    // document.getElementById("response").innerHTML +=
    //   " " + JSON.stringify(args) + " " + inputIndex;

    transcode({
      file: document.getElementById("uploader").files[0],
      args: args,
      inputIndex,
      outputIndex,
    });
  }

  function onInputChange(e) {
    const file = e.target.files[0];
    document.getElementById("video").src = URL.createObjectURL(file);
    // document.getElementById("video").play();
    document.getElementById("input-file-container").classList.add("hidden");
    document.getElementById("input-video-container").classList.remove("hidden");
  }

  function clearInputVideo() {
    document.getElementById("video").src = null;
    document.getElementById("uploader").value = null;
    document.getElementById("input-file-container").classList.remove("hidden");
    document.getElementById("input-video-container").classList.add("hidden");
  }

  function clearOutputVideo() {}
</script>

<div>
  <div class="flex flex-col w-full">
    <h1 class="text-5xl font-extrabold text-center lg:text-7xl 2xl:text-8xl">
      <span
        class="text-transparent bg-gradient-to-br bg-clip-text from-teal-500 via-indigo-500 to-sky-500 dark:from-teal-200 dark:via-indigo-300 dark:to-sky-500"
      >
        Unleash the Power of AI in Video Editing
      </span>
    </h1>

    <p
      class="max-w-3xl mx-auto mt-6 text-lg text-center text-gray-700 dark:text-white md:text-xl"
    >
      Revolutionize your video editing process with our intelligent and
      user-friendly app. Quickly modify videos in minutes by telling the app
      what you'd like to do in plain language.
    </p>
  </div>
</div>

<main>
  <!-- component -->
  <div class="flex items-center justify-center p-12">
    <!-- Author: FormBold Team -->
    <!-- Learn More: https://formbold.com -->
    <div class="mx-auto w-full max-w-[550px] bg-white">
      <form
        class="py-6 px-9"
        action="https://formbold.com/s/FORM_ID"
        method="POST"
      >
        <div class="mb-6 pt-4">
          <span class="mb-5 block text-xl font-semibold text-[#07074D]">
            1. Select your media file
          </span>

          <div
            id="input-file-container"
            class="flex items-center justify-center w-full"
          >
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
                  <span class="font-semibold">Click to upload</span> or drag and
                  drop
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Compatible with most media file
                </p>
              </div>
              <input
                type="file"
                id="uploader"
                on:change={onInputChange}
                class="hidden"
              />
            </label>
          </div>

          <div id="input-video-container" class="hidden">
            <div class="mt-5 rounded-md bg-[#F5F7FB] overflow-hidden">
              <div class="">
                <video id="video" controls class="w-full" />
              </div>
            </div>

            <small
              class="text-slate-400 cursor-pointer"
              on:click|preventDefault={clearInputVideo}>Clear</small
            >
          </div>

          <span class="mt-5 block text-xl font-semibold text-[#07074D]">
            2. Describe what you would like to do
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
            class="hover:shadow-form w-full rounded-md bg-purple-600 py-3 px-8 text-center text-base font-semibold text-white outline-none"
            on:click|preventDefault={submitData}
          >
            Submit
          </button>
        </div>

        <div
          id="spinner"
          class="mt-5 flex justify-center flex-col items-center hidden"
        >
          <div
            class="w-12 h-12 rounded-full animate-spin
          border-8 border-dashed border-purple-500 border-t-transparent"
          />
          <div id="progress" class="mt-2 text-red-500 font-semibold" />
        </div>

        <div id="status" class="mt-5 text-black font-mono font-semibold" />

        <div id="output-video-container" class="hidden">
          <span class="mt-5 block text-xl font-semibold text-[#07074D]">
            Result
          </span>
          <div class="mt-5 rounded-md bg-[#F5F7FB] overflow-hidden">
            <div class="">
              <video id="player" controls class="w-full" />
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

<style>
</style>
