<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useGalleryStore } from "@/stores/gallery";

const props = defineProps<{
	id: string;
}>();

const router = useRouter();

const store = useGalleryStore();

const currentImage = computed(() => {
	return store.getImageById(props.id);
});

const currentImageIndex = computed(() => {
	return store.images.findIndex((img) => img.id === props.id);
});

const hasPreviousImage = computed(() => {
	return !(currentImageIndex.value === 0 && store.currentPage === 1);
});

const hasNextImage = computed(() => {
	return !(currentImageIndex.value === store.images.length - 1 && store.currentPage === store.totalPages);
});

const previousImageId = computed(() => {
	if (hasPreviousImage.value) {
		const prevImage = store.images[currentImageIndex.value - 1];
		return prevImage ? prevImage.id : null;
	}
	return null;
});

const nextImageId = computed(() => {
	if (hasNextImage.value) {
		const nextImage = store.images[currentImageIndex.value + 1];
		return nextImage ? nextImage.id : null;
	}
	return null;
});

onMounted(() => {
	if (store.images.length === 0) {
		store.fetchImages(1);
	}
});

function goBackToGallery() {
	store.setSelectedImageId(props.id);
	router.push({ name: "gallery" });
}

async function goToPreviousImage() {
	if (previousImageId.value) {
		router.push({
			name: "photo-detail",
			params: { id: previousImageId.value },
		});
	}
	// Load previous page when at the start of current page
	else if (currentImageIndex.value === 0 && store.currentPage > 1) {
		await store.previousPage();
		const lastImage = store.images[store.images.length - 1];
		if (lastImage) {
			router.push({
				name: "photo-detail",
				params: { id: lastImage.id },
			});
		}
	}
}

async function goToNextImage() {
	if (nextImageId.value) {
		router.push({
			name: "photo-detail",
			params: { id: nextImageId.value },
		});
	}
	// Load next page when at the end of current page
	else if (currentImageIndex.value === store.images.length - 1 && store.currentPage < store.totalPages) {
		await store.nextPage();
		const firstImage = store.images[0];
		if (firstImage) {
			router.push({
				name: "photo-detail",
				params: { id: firstImage.id },
			});
		}
	}
}
</script>

<template>
	<div class="photo-detail-view">
		<div v-if="store.isLoading" class="loading">Loading...</div>

		<div v-else-if="!currentImage" class="not-found">
			<p>Image not found</p>
			<button @click="goBackToGallery" class="back-button">Back to Gallery</button>
		</div>

		<div v-else class="image-detail">
			<div class="top-bar">
				<div class="left-section">
					<button @click="goBackToGallery" class="back-button">
						<img src="@/assets/arrow-left-regular.svg" alt="Back" />
						<span>{{ currentImage.author }}</span>
					</button>
				</div>

				<div class="middle-section">
					<button class="nav-button" :disabled="!hasPreviousImage" @click="goToPreviousImage">
						<img src="@/assets/caret-left-regular.svg" alt="Previous" />
					</button>

					<button class="nav-button" :disabled="!hasNextImage" @click="goToNextImage">
						<img src="@/assets/caret-right-regular.svg" alt="Next" />
					</button>
				</div>

				<div class="right-section">
					<a :href="currentImage.download_url" class="download-btn" target="_blank"> Download </a>
				</div>
			</div>

			<div class="details-container">
				<div class="resolution-info">{{ currentImage.width }} x {{ currentImage.height }}</div>

				<div class="image-container">
					<img
						:src="`https://picsum.photos/id/${currentImage.id}/1080/1080`"
						:alt="`Photo by ${currentImage.author}`"
						class="image"
						loading="lazy"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.photo-detail-view {
	background-color: var(--bg);
	margin-left: 8px;
	margin-right: 8px;
	border-radius: 4px;
	overflow: hidden;
}

.top-bar {
	display: flex;
	align-items: center;
	border-bottom: 1px solid var(--border);
	padding: 14px 20px;
}

.left-section {
	flex: 1;
}

.back-button {
	display: flex;
	align-items: center;
	gap: 10px;
	background-color: var(--bg);
	border: none;
	img {
		width: 20px;
		height: 20px;
		cursor: pointer;
	}
	span {
		font-weight: 700;
		font-size: 14px;
		color: var(--text-dark);
	}
}

.middle-section {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 80px;
	img {
		width: 12px;
		height: 12px;
		cursor: pointer;
	}
}

.nav-button {
	background-color: var(--bg);
	border: none;
}

.right-section {
	flex: 1;
	display: flex;
	justify-content: flex-end;
}

.details-container {
	margin: 20px;
	padding: 12px;
	border-radius: 6px;
	background-color: var(--secondary-bg);
	display: flex;
	flex-direction: column;
	align-items: center;
}
.resolution-info {
	align-self: flex-start;
	font-size: 14px;
	font-weight: 500;
	color: var(--text);
	margin-bottom: 12px;
}

.image {
	max-height: 70vh;
	border-radius: 6px;
	object-fit: contain;
}
</style>
