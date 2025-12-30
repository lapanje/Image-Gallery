<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<template>
	<div id="app">
		<header class="app-header">
			<img src="@/assets/logo.svg" alt="Logo" class="logo" />
		</header>

		<main class="app-main">
			<RouterView />
		</main>
	</div>
</template>

<style lang="scss">
:root {
	--bg: #fff;
	--secondary-bg: #f4f5f6;
	--border: #e7e8eb;
	--text: #aaacb7;
	--text-dark: #353547;
	--accent: #1765ff;
}

body {
	margin: 0;
	padding: 0;
	font-family: Work Sans;
	background-color: var(--secondary-bg);
}

a {
	text-decoration: none;
}

.download-btn {
	background-color: var(--border);
	border: none;
	padding: 5px 10px;
	border-radius: 5px;
	color: var(--text-dark);
	font-size: 12px;
}

.app-header {
	padding: 16px 16px;
}
</style>
