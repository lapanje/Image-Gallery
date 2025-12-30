# Image Gallery

A Vue.js image gallery app that uses the Picsum API to display images with pagination.

## What it does

-   Shows a grid of images (20 per page)
-   Click on an image to see it in detail with more info
-   Navigate between pages and images
-   When you go back to the gallery, the last image you viewed is highlighted

## Built with

-   Vue 3 (Composition API)
-   TypeScript
-   Pinia for state management
-   Vue Router
-   SCSS
-   Vitest for testing
-   Vite

## Setup

Install dependencies:

```sh
npm install
```

Run the development server:

```sh
npm run dev
```

The app will be available at `http://localhost:5173`

## Other commands

Build for production:

```sh
npm run build
```

Run tests:

```sh
npm run test:unit
```

## Project structure

```
src/
├── stores/         # Pinia store for images and pagination
├── views/          # Gallery and detail page components
├── router/         # Route configuration
├── types/          # TypeScript interfaces
├── __tests__/      # Unit tests
└── App.vue         # Main app component
```

## How it works

The app fetches images from the Picsum API (`https://picsum.photos/v2/list`) and stores them in a Pinia store. The gallery shows 20 images at a time, and you can navigate between pages. When you click an image, the router takes you to a detail page where you can see a larger version and navigate to the next/previous image.

When you return to the gallery, the store remembers which image you were looking at and highlights it.
