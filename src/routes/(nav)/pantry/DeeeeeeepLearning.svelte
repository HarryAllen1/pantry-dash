<script lang="ts">
	import { browser } from '$app/environment';
	import type { Session, SupabaseClient } from '@supabase/supabase-js';
	import type {
		DetectedObject,
		ObjectDetection,
	} from '@tensorflow-models/coco-ssd';
	import {
		Button,
		Input,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
	} from 'flowbite-svelte';
	import { onDestroy, onMount } from 'svelte';
	import type { Database } from '../../../supabase_types';
	import { recognitionDrawerHidden } from './drawerStore';

	export let supabase: SupabaseClient<Database>;
	export let session: Session | null;

	let videoEl: HTMLVideoElement;
	let videoStream: MediaStream;
	let canvasEl: HTMLCanvasElement;
	let pictureTaken = false;
	let model: ObjectDetection;

	const formatter = new Intl.NumberFormat('en-US', {
		style: 'percent',
		minimumFractionDigits: 0,
		maximumFractionDigits: 2,
	});

	let results: DetectedObject[] | null = null;
	$: tableResults = results
		? results.reduce((acc, curr) => {
				const existing = acc.find((item) => item.class === curr.class);
				if (existing) existing.quantity++;
				else
					acc.push({
						...curr,
						quantity: 1,
						notes: '',
						unit: 'ct',
						location: 'Table',
					});

				return acc;
		  }, [] as { class: string; quantity: number; unit: string; location: string; notes: string }[])
		: null;

	onMount(async () => {
		await import('@tensorflow/tfjs-backend-cpu');
		await import('@tensorflow/tfjs-backend-webgl');
		const { load } = await import('@tensorflow-models/coco-ssd');

		model = await load({
			base: 'mobilenet_v2',
		});

		videoStream = await navigator.mediaDevices.getUserMedia({
			video: true,
			audio: false,
		});
		videoEl.srcObject = videoStream;
		await videoEl.play();
		canvasEl.width = videoEl.videoWidth;
		canvasEl.height = videoEl.videoHeight;
	});

	const doProcessingStuff = async () => {
		pictureTaken = true;
		const ctx = canvasEl.getContext('2d')!;
		ctx.drawImage(videoEl, 0, 0, canvasEl.width, canvasEl.height);
		results = await model.detect(canvasEl);
		ctx.font = '16px Arial';

		for (const res of results) {
			ctx.beginPath();
			ctx.rect(...res.bbox);
			ctx.lineWidth = 2;
			ctx.strokeStyle = 'limegreen';
			ctx.fillStyle = 'limegreen';
			ctx.stroke();
			ctx.fillText(
				`${res.class} (${formatter.format(res.score)})`,
				res.bbox[0],
				res.bbox[1] > 10 ? res.bbox[1] - 5 : 10
			);
		}
	};

	const deleteItem = (item: string) => {
		results = results?.filter((res) => res.class !== item) as DetectedObject[];
	};

	const addAll = async () => {
		await supabase.from('items').insert(
			Array.from(
				tableResults!,
				({ class: fuckJs, location, notes, quantity, unit }) =>
					Array(quantity).fill({
						name: fuckJs,
						location,
						notes,
						unit,
						belongs_to: session?.user.id,
					})
			).flat()
		);
		$recognitionDrawerHidden = true;
	};

	onDestroy(() => {
		if (browser) videoStream.getTracks().forEach((track) => track.stop());
	});
</script>

<div class="relative flex flex-col items-center gap-4">
	<video bind:this={videoEl}>Video stream not available.</video>
	<canvas class="absolute top-0" bind:this={canvasEl} />

	{#if pictureTaken}
		{#if tableResults}
			<Table>
				<TableHead>
					<TableHeadCell>Item name</TableHeadCell>
					<TableHeadCell>Location</TableHeadCell>
					<TableHeadCell>Quantity</TableHeadCell>
					<TableHeadCell>Notes</TableHeadCell>
					<TableHeadCell>Delete</TableHeadCell>
				</TableHead>
				<TableBody tableBodyClass="divide-y">
					{#each tableResults as result}
						<TableBodyRow>
							<TableBodyCell>
								<Input bind:value={result.class} placeholder="Name" />
							</TableBodyCell>
							<TableBodyCell>
								<Input placeholder="Location" bind:value={result.location} />
							</TableBodyCell>
							<TableBodyCell>
								<Input
									type="number"
									bind:value={result.quantity}
									placeholder="Quantity"
								/>
							</TableBodyCell>
							<TableBodyCell>
								<Input bind:value={result.notes} placeholder="Notes" />
							</TableBodyCell>
							<TableBodyCell>
								<Button
									on:click={() => {
										deleteItem(result.class);
									}}
									color="red"
									class="py-0"
									outline={true}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="currentColor"
										class="w-6 h-6"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</Button>
							</TableBodyCell>
						</TableBodyRow>
					{:else}
						<TableBodyRow>
							<TableBodyCell colspan="5" class="text-center">
								No items detected.
							</TableBodyCell>
						</TableBodyRow>
					{/each}
				</TableBody>
			</Table>
			<div class="self-end flex flex-row items-center gap-4">
				<Button
					outline={true}
					on:click={() => {
						pictureTaken = false;
						canvasEl
							.getContext('2d')
							?.clearRect(0, 0, canvasEl.width, canvasEl.height);
					}}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
						/>
					</svg>
				</Button>
				{#if tableResults.length}
					<Button on:click={addAll}>Add all</Button>
				{/if}
			</div>
		{/if}
	{:else}
		<Button on:click={doProcessingStuff}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-6 h-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
				/>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
				/>
			</svg>
		</Button>
	{/if}
</div>
