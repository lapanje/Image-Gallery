import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { Image } from "@/types/image";

const IMAGES_PER_PAGE = 20;
const TOTAL_IMAGES = 1000;

export const useGalleryStore = defineStore("gallery", () => {
	// State
	const images = ref<Image[]>([]);
	const currentPage = ref(1);
	const selectedImageId = ref<string | null>(null);
	const isLoading = ref(false);
	const error = ref<string | null>(null);

	// Total pages computed
	const totalPages = computed(() => Math.ceil(TOTAL_IMAGES / IMAGES_PER_PAGE));

	// Actions
	async function fetchImages(page: number) {
		isLoading.value = true;
		error.value = null;

		try {
			const response = await fetch(`https://picsum.photos/v2/list?page=${page}&limit=${IMAGES_PER_PAGE}`);

			if (!response.ok) {
				throw new Error("Failed to fetch images");
			}

			images.value = await response.json();
			currentPage.value = page;
		} catch (err) {
			error.value = err instanceof Error ? err.message : "An error occurred";
			console.error("Error fetching images:", err);
		} finally {
			isLoading.value = false;
		}
	}

	async function nextPage() {
		if (currentPage.value < totalPages.value) {
			await fetchImages(currentPage.value + 1);
		}
	}

	async function previousPage() {
		if (currentPage.value > 1) {
			await fetchImages(currentPage.value - 1);
		}
	}

	function getImageById(id: string): Image | undefined {
		return images.value.find((img) => img.id === id);
	}

	function setSelectedImageId(id: string | null) {
		selectedImageId.value = id;
	}

	return {
		images,
		currentPage,
		selectedImageId,
		isLoading,
		error,
		totalPages,
		fetchImages,
		nextPage,
		previousPage,
		getImageById,
		setSelectedImageId,
		IMAGES_PER_PAGE,
		TOTAL_IMAGES,
	};
});
