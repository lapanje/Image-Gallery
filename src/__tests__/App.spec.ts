import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { createRouter, createMemoryHistory } from "vue-router";
import { createPinia } from "pinia";
import App from "@/App.vue";

describe("App Component", () => {
	it("renders the app structure", async () => {
		const router = createRouter({
			history: createMemoryHistory(),
			routes: [
				{
					path: "/",
					name: "gallery",
					component: { template: "<div>Gallery</div>" },
				},
			],
		});

		const pinia = createPinia();

		const wrapper = mount(App, {
			global: {
				plugins: [router, pinia],
			},
		});

		expect(wrapper.find("#app").exists()).toBe(true);
		expect(wrapper.find(".app-header").exists()).toBe(true);
		expect(wrapper.find(".app-main").exists()).toBe(true);
	});

	it("displays the logo in the header", async () => {
		const router = createRouter({
			history: createMemoryHistory(),
			routes: [
				{
					path: "/",
					name: "gallery",
					component: { template: "<div>Gallery</div>" },
				},
			],
		});

		const pinia = createPinia();

		const wrapper = mount(App, {
			global: {
				plugins: [router, pinia],
			},
		});

		const logo = wrapper.find(".logo");
		expect(logo.exists()).toBe(true);
		expect(logo.attributes("alt")).toBe("Logo");
	});
});
