<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useGalleryStore } from "@/stores/gallery";

const router = useRouter();
const store = useGalleryStore();

onMounted(() => {
	if (store.images.length === 0) {
		store.fetchImages(1);
	}
});

function handleImageClick(imageId: string) {
	store.setSelectedImageId(imageId);
	router.push({ name: "photo-detail", params: { id: imageId } });
}

function isSelectedImage(imageId: string): boolean {
	return store.selectedImageId === imageId;
}

const imageRange = computed(() => {
	const start = (store.currentPage - 1) * 20 + 1;
	const end = Math.min(store.currentPage * 20, 1000);
	return `${start}-${end} of 1000`;
});

// Show 5 pages centered around active page
const visiblePages = computed(() => {
	const current = store.currentPage;
	const total = store.totalPages;
	const pages = [];

	let start = Math.max(1, current - 2);
	let end = Math.min(total, start + 4);

	if (end - start < 4) {
		start = Math.max(1, end - 4);
	}

	for (let i = start; i <= end; i++) {
		pages.push(i);
	}

	return pages;
});

function goToPage(page: number) {
	store.fetchImages(page);
}

function retryFetch() {
	store.fetchImages(store.currentPage);
}
</script>

<template>
	<div class="gallery-view">
		<div v-if="store.isLoading" class="loading">Loading images...</div>

		<div v-else-if="store.error" class="error">
			<p>{{ store.error }}</p>
			<button @click="retryFetch" class="retry-button">Try Again</button>
		</div>

		<div v-else>
			<div class="top-bar">
				<div class="image-counter">
					{{ imageRange }}
				</div>

				<div class="pagination">
					<button
						class="page-button"
						:disabled="store.currentPage === 1"
						@click="store.previousPage()"
					>
						<img
							src="@/assets/caret-left-regular.svg"
							alt="Previous"
						/>
					</button>

					<button
						v-for="page in visiblePages"
						:key="page"
						class="page-number"
						:class="{ active: page === store.currentPage }"
						@click="goToPage(page)"
					>
						{{ page }}
					</button>

					<button
						class="page-button"
						:disabled="store.currentPage === store.totalPages"
						@click="store.nextPage()"
					>
						<img
							src="@/assets/caret-right-regular.svg"
							alt="Next"
						/>
					</button>
				</div>
			</div>

			<div class="gallery-grid">
				<article
					v-for="image in store.images"
					:key="image.id"
					class="gallery-item"
					:class="{ selected: isSelectedImage(image.id) }"
					@click="handleImageClick(image.id)"
				>
					<img
						:src="`https://picsum.photos/id/${image.id}/300/300`"
						:alt="image.author"
						class="gallery-image"
					/>
					<div class="meta">
						<div class="author">{{ image.author }}</div>
						<hr />
						<a
							class="download-btn"
							:href="image.download_url"
							target="_blank"
							rel="noreferrer"
							@click.stop
						>
							Download
						</a>
					</div>
				</article>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.gallery-view {
	background-color: var(--bg);
	margin-left: 8px;
	margin-right: 8px;
	border-radius: 4px;
}

.top-bar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-bottom: 1px solid var(--border);
	color: var(--text);
	font-size: 12px;
	padding: 8px 24px;
}

.gallery-grid {
	padding: 24px;
	display: flex;
	gap: 20px;
	flex-wrap: wrap;
}

.gallery-item {
	border-radius: 10px;
	background-color: var(--secondary-bg);
	width: 20vw;
	min-width: 240px;

	&.selected {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}
}

.pagination {
	display: flex;
	align-items: center;
	gap: 6px;
}

.page-button {
	background-color: var(--bg);
	border: none;
	width: 30px;
	height: 30px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;

	img {
		width: 16px;
		height: 16px;
	}

	&:disabled {
		opacity: 0.3;
	}
}

.page-number {
	background: var(--bg);
	border: none;
	width: 30px;
	height: 30px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 14px;

	&:hover {
		border: 1px solid var(--border);
		border-radius: 4px;
	}

	&.active {
		border: 1px solid var(--accent);
		border-radius: 4px;
	}
}

.loading,
.error {
	text-align: center;
	padding: 12px;
	font-size: 14px;
	font-weight: 500;
}
.error {
	color: #d32f2f;
}

.retry-button {
	padding: 6px;
	margin: 20px;
	border: 1px solid var(--text-dark);
	border-radius: 4px;
	background-color: var(--secondary-bg);
	color: var(--text-dark);
	font-weight: 500;
}

.image-counter {
	font-size: 14px;
	color: var(--text);
	font-weight: 500;
}

.gallery-image {
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
	width: 100%;
}

.meta {
	padding: 12px 14px 14px 14px;
}

.author {
	font-size: 14px;
	font-weight: 500;
	color: var(--text-dark);
}

hr {
	border: none;
	height: 1px;
	background-color: var(--border);
	margin: 12px 0;
}
</style>
