import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useGalleryStore } from "@/stores/gallery";

global.fetch = vi.fn();

function createFetchResponse(data: any) {
	return {
		ok: true,
		json: async () => data,
	};
}

describe("Gallery Store", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
		vi.clearAllMocks();
	});

	it("initializes with correct default values", () => {
		const store = useGalleryStore();

		expect(store.images).toEqual([]);
		expect(store.currentPage).toBe(1);
		expect(store.selectedImageId).toBe(null);
		expect(store.isLoading).toBe(false);
		expect(store.error).toBe(null);
	});

	it("calculates total pages correctly", () => {
		const store = useGalleryStore();

		expect(store.totalPages).toBe(50);
	});

	it("fetches images successfully", async () => {
		const store = useGalleryStore();

		const mockImages = [
			{
				id: "1",
				author: "Test Author 1",
				width: 1920,
				height: 1080,
				url: "https://example.com/1",
				download_url: "https://example.com/download/1",
			},
			{
				id: "2",
				author: "Test Author 2",
				width: 1920,
				height: 1080,
				url: "https://example.com/2",
				download_url: "https://example.com/download/2",
			},
		];

		(global.fetch as any).mockResolvedValueOnce(
			createFetchResponse(mockImages)
		);

		await store.fetchImages(1);

		expect(store.images).toEqual(mockImages);
		expect(store.currentPage).toBe(1);
		expect(store.isLoading).toBe(false);
		expect(store.error).toBe(null);
	});

	it("handles fetch errors", async () => {
		const store = useGalleryStore();

		(global.fetch as any).mockResolvedValueOnce({
			ok: false,
		});

		await store.fetchImages(1);

		expect(store.error).toBe("Failed to fetch images");
		expect(store.isLoading).toBe(false);
	});

	it("navigates to next page", async () => {
		const store = useGalleryStore();
		store.currentPage = 1;

		(global.fetch as any).mockResolvedValueOnce(createFetchResponse([]));

		await store.nextPage();

		expect(store.currentPage).toBe(2);
	});

	it("does not navigate past last page", async () => {
		const store = useGalleryStore();
		store.currentPage = store.totalPages;

		await store.nextPage();

		expect(store.currentPage).toBe(store.totalPages);
	});

	it("navigates to previous page", async () => {
		const store = useGalleryStore();
		store.currentPage = 2;

		(global.fetch as any).mockResolvedValueOnce(createFetchResponse([]));

		await store.previousPage();

		expect(store.currentPage).toBe(1);
	});

	it("does not navigate before first page", async () => {
		const store = useGalleryStore();
		store.currentPage = 1;

		await store.previousPage();

		expect(store.currentPage).toBe(1);
	});

	it("finds image by ID", () => {
		const store = useGalleryStore();

		store.images = [
			{
				id: "1",
				author: "Author 1",
				width: 1920,
				height: 1080,
				url: "https://example.com/1",
				download_url: "https://example.com/download/1",
			},
			{
				id: "2",
				author: "Author 2",
				width: 1920,
				height: 1080,
				url: "https://example.com/2",
				download_url: "https://example.com/download/2",
			},
		];

		const image = store.getImageById("2");

		expect(image).toBeDefined();
		expect(image?.author).toBe("Author 2");
	});

	it("returns undefined for non-existent image ID", () => {
		const store = useGalleryStore();
		store.images = [];

		const image = store.getImageById("999");

		expect(image).toBeUndefined();
	});

	it("sets selected image ID", () => {
		const store = useGalleryStore();

		store.setSelectedImageId("123");
		expect(store.selectedImageId).toBe("123");

		store.setSelectedImageId(null);
		expect(store.selectedImageId).toBe(null);
	});
});
