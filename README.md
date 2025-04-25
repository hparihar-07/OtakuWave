
# OtakuWave

**OtakuWave** is a music streaming web application designed for anime and otaku culture fans. It allows users to browse, search, and play songs from a curated selection of tracks while providing an intuitive and responsive UI. The app features song management via an admin panel, where songs can be uploaded, viewed, and deleted. Built with React, Vite, Supabase, and styled with Tailwind CSS, OtakuWave delivers a modern and seamless music streaming experience.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Contributing](#contributing)


## Overview

OtakuWave allows users to:
- Browse songs from a wide range of anime-inspired music.
- Search for tracks by name or artist.
- Listen to high-quality streaming audio directly from Supabase Storage.
- Discover trending tracks, featured randomly on the homepage.
- View all available songs in a grid layout with cover art, song title, and artist.
- Use an interactive, sticky audio player for seamless playback.

Admins can upload new songs and manage content via a user-friendly admin interface.

## Features

### User Features:
- **Search Songs**: A search bar to filter songs by name or artist.
- **Trending Tracks**: Display the most recently uploaded or trending track.
- **Song Grid**: A responsive grid of songs displaying cover art, title, and artist.
- **Audio Player**: A sticky audio player to play selected songs with smooth streaming support.
- **Responsive Design**: Fully responsive web application built with Tailwind CSS.

### Admin Features:
- **Song Upload**: Admins can upload new songs with metadata (song name, artist, cover art).
- **Song Deletion**: Admins can delete songs, which removes both the metadata and the actual files from Supabase.

## Tech Stack

- **Frontend**: React (Vite), JavaScript
- **Styling**: Tailwind CSS v4
- **Routing**: React Router DOM
- **Audio**: HTML5 `<audio>` or react-h5-audio-player
- **Backend**: Supabase (Storage, Database, Auth)
- **Deployment**: Netlify, Vercel, GitHub Pages

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [Git](https://git-scm.com/)
- [Supabase Account](https://supabase.io/) (For setting up the database and storage)

### Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/otakuWave.git
    cd otakuWave
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Set up Supabase**: Follow the Supabase setup instructions below to connect the app to Supabase.

4. **Start the development server**:
    ```bash
    npm run dev
    ```

    This will start the app locally at [http://localhost:3000](http://localhost:3000).




## Contributing

We welcome contributions to OtakuWave! Here’s how you can help:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a Pull Request to the `main` branch.

