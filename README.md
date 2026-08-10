<p align="center">
    <a href="#"><img alt="Visual Studio Code" src="https://custom-icon-badges.demolab.com/badge/Visual%20Studio%20Code-0078d7.svg?logo=visualstudiocode&amp;logoColor=white" /></a>
    <a href="#"><img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&amp;logoColor=000" /></a>
    <a href="#"><img alt="JSON" src="https://img.shields.io/badge/JSON-000?logo=json&amp;logoColor=fff" /></a>
</p>

<p align="center">
    <a href="https://htmlpreview.github.io/?https://github.com/HWCronicus/midas-burger/blob/main/lighthouse/midas-burger-report.html" target="_blank"><img alt="Lighthouse Performance" src="./lighthouse/badges/lighthouse_performance.svg" />
    <a href="https://htmlpreview.github.io/?https://github.com/HWCronicus/midas-burger/blob/main/lighthouse/midas-burger-report.html" target="_blank"><img alt="Lighthouse Accessibility" src="./lighthouse/badges/lighthouse_accessibility.svg" /></a>
    <a href="https://htmlpreview.github.io/?https://github.com/HWCronicus/midas-burger/blob/main/lighthouse/midas-burger-report.html" target="_blank"><img alt="Lighthouse Best Practices" src="./lighthouse/badges/lighthouse_best-practices.svg" /></a>
    <a href="https://htmlpreview.github.io/?https://github.com/HWCronicus/midas-burger/blob/main/lighthouse/midas-burger-report.html" target="_blank"><img alt="Lighthouse SEO" src="./lighthouse/badges/lighthouse_seo.svg" /></a>
    <a href="https://htmlpreview.github.io/?https://github.com/HWCronicus/midas-burger/blob/main/lighthouse/midas-burger-report.html" target="_blank"><img alt="Lighthouse Agentic Browsing" src="./lighthouse/badges/lighthouse_agentic-browsing.svg" /></a>
</p>

# Midas Burgers 🍔✨

A web development project for class COP2822C (Professor Masline) featuring a fully functional front-end for a local hamburger restaurant. Built entirely with vanilla web technologies, this site includes an interactive shopping cart system, dynamic page effects, and uses locally generated AI media assets.

---

## 📌 Project Overview

**Midas Burger** is a fictitious hamburger restaurant concept designed to demonstrate modern, interactive front-end web development techniques without relying on third-party frameworks or external libraries.

> **Disclaimer:** This website is strictly for demonstration and educational purposes for a college coursework assignment. It is **not** a real business and **does not** accept, process, or deliver actual food orders.

---

## 🛠️ Built With

- **HTML5:** Semantic layout structure across all site pages.
- **CSS3:** Custom styling, responsive layouts, animations, and visual theme design.
- **Vanilla JavaScript (ES6+):** Interactive shopping cart logic, simulated checkout flow, and dynamic UI page effects.

---

## ✨ Features

- **Interactive Shopping Cart:** Add items, adjust quantities, calculate totals in real time, and persist cart state using JavaScript.
- **Simulated Checkout Flow:** Walk through a multi-step checkout process without real payment processing.
- **Dynamic Page Effects:** Custom UI interactions, smooth animations, and event-driven elements built with native JS DOM manipulation.
- **Custom AI Media:** All restaurant photography, item images, and promotional video assets were locally generated using AI tools (ComfyUI) specifically for this project.
- **Zero External Dependencies:** Built purely with standard, lightweight web technologies for optimal performance and easy hosting.
- **Containerized Deployment:** Packaged with Docker and Docker Compose for easy local runs and straightforward server deployment.

---

## 🐳 Run Locally with Docker

### Prerequisites

- Docker Desktop (Windows/macOS) or Docker Engine + Docker Compose plugin (Linux)

### Start the website container

From the project root, run:

```bash
docker compose up -d --build
```

The site will be available at:

```text
http://localhost:8080
```

### Stop the container

```bash
docker compose down
```

### Rebuild after changes

```bash
docker compose up -d --build
```

---

## 📂 Project Structure

```text
midas-burger/
├── index.html          # Home / Landing Page
├── about.html          # About Us Page
├── menu.html           # Restaurant Menu & Ordering Page
├── locations.html      # Locations and Map Page
├── checkout.html       # Cart Summary & Simulated Checkout
├── robots.txt          # Search crawler directives
├── sitemap.xml         # XML sitemap for search engines
├── Dockerfile          # Nginx static site container image
├── docker-compose.yml  # Local container orchestration
├── nginx.conf          # Nginx site configuration
├── .dockerignore       # Docker build context exclusions
├── css/
│   ├── styles.css      # Shared global styles
│   ├── home.css        # Home page styles
│   ├── about.css       # About page styles
│   ├── menu.css        # Menu page styles
│   ├── locations.css   # Locations page styles
│   └── checkout.css    # Checkout page styles
├── js/
│   ├── main.js         # Navigation and shared UI behavior
│   ├── cart.js         # Cart state management
│   ├── menu.js         # Menu rendering and interactions
│   ├── locations.js    # Map and location interactions
│   └── checkout.js     # Checkout flow behavior
├── data/
│   └── menu.json       # Menu item data source
└── assets/
    ├── images/         # Locally AI-generated images
    └── video/          # Locally AI-generated video assets
```

