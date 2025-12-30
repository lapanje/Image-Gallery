import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),

	routes: [
		{
			path: "/",
			name: "gallery",
			component: () => import("@/views/GalleryView.vue"),
		},
		{
			path: "/photo/:id",
			name: "photo-detail",
			component: () => import("@/views/ImageDetailView.vue"),
			props: true,
		},
	],
});

export default router;
