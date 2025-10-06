**BLineScan** is a CLI tool that scans your web project’s **HTML**, **CSS**, and (soon) **JavaScript** source code to
analyze browser compatibility using the **Baseline** dataset.  
It generates a detailed, visual **compatibility report** that can be viewed locally or shared remotely through a
dashboard helping teams **collaborate** on code readiness and ensure **browser-wide stability** before deployment.

<div align="center">
   <img alt="npm version" src="https://img.shields.io/npm/v/blinescan">
   <img alt="NPM Downloads" src="https://img.shields.io/npm/dw/blinescan">
   <img alt="GitHub Org's stars" src="https://img.shields.io/github/stars/belabdesmd?style=social">
   <img alt="GitHub License" src="https://img.shields.io/github/license/belabdesmd/blinescan">
   <img alt="Static Badge" src="https://img.shields.io/badge/yes-a?label=maintained">
</div>

<div align="center">
   <img alt="GitHub Issues or Pull Requests" src="https://img.shields.io/github/issues/belabdesmd/blinescan?color=blue">
   <img alt="GitHub Issues or Pull Requests" src="https://img.shields.io/github/issues-pr/belabdesmd/blinescan?color=blue">
   <img alt="GitHub commit activity" src="https://img.shields.io/github/commit-activity/m/belabdesmd/blinescan">
</div>

---

## Overview

Modern web features evolve fast, and ensuring browser compatibility is often a guessing game.  
While existing tools focus on linting or performance, **BLineScan** focuses on **visibility and collaboration**
transforming technical compatibility data into a **clear, shareable Baseline Health report**.

The tool consists of:

- A **CLI** to scan source code and generate reports.
- A **Dashboard** to visualize the analysis results.
- A **Backend (Bucket)** to handle temporary remote storage and access of reports.

---

## Features

- **Feature Scanning:** Detects HTML and CSS features used in your source code (JavaScript analysis coming soon).
- **Baseline Health Score:** Calculates how “safe” your project is to deploy based on modern feature support.
- **Detailed Metrics:** Baseline coverage, feature counts, adoption timelines, and category breakdowns.
- **Interactive Dashboard:** View results through charts and tables across HTML, CSS, and JS categories.
- **Remote Sharing:** Upload reports to a temporary bucket with `--remote` (auto-deleted after expiration).
- **Collaborative Insights:** Share reports easily with teammates or supervisors via secure links.

---

## 🏗️ Project Structure

```
BLineScan/
├── /bucket/         # Backend (Node.js + Express) for remote report storage
├── /dashboard/      # Frontend dashboard for report visualization
├── /src/            # CLI source code (TypeScript)
├── .env             # Root environment configuration (dashboard & backend URLs)
├── package.json
└── README.md
└── LICENSE
```

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/belabdesmd/BLineScan.git
cd BLineScan
```

### 2. Install Dependencies

```bash
npm install
```

---

## Configuration

### 1. Root `.env` File

At the root of the project, update `.env` file to link the CLI with your dashboard and backend:

```env
DASHBOARD_URL=http://your-vps-or-domain/dashboard
BACKEND_URL=http://your-vps-or-domain/bucket
```

You can also specify these when deploying or testing locally:

```env
DASHBOARD_URL=http://localhost:5173
BACKEND_URL=http://localhost:3000
```

---

## Backend (`/bucket`)

The **bucket** directory contains the backend service responsible for:

- Accepting uploaded report JSON files from the CLI.
- Storing them temporarily on the server.
- Automatically deleting them after the set duration (default: 24 hours).

### Setup

```bash
cd bucket
npm install
npm run build
npm start
```

By default, the backend runs on **port 3000**.  
To configure automatic deletion time or other behavior, check the configuration in `/bucket/config`.

> **Security Note:**  
> Currently, uploads are made directly to your VPS. In future updates, the upload system will be replaced with a *
*secure storage service** (e.g. Firebase Storage) to prevent exposing the VPS publicly.

---

## Dashboard (`/dashboard`)

The **dashboard** visualizes the generated reports with charts and tables for HTML, CSS, and (soon) JS.

### Setup

```bash
cd dashboard
npm install
npm run build-prod
```

To change the backend (bucket) API endpoint, edit:

```
/dashboard/src/environments.ts
```

Update:

```ts
export const environment = {
    bucketUrl: 'http://your-vps-or-domain/bucket'
};
```

> The built dashboard is currently hosted on your VPS but will be moved to a dedicated domain and hosting environment
> soon.

---

## CLI Usage

Run BLineScan in your project directory to generate a compatibility report.

### Local Report

```bash
npx blinescan
```

This command scans your source files and opens the report locally in your browser.

```bash
npx blinescan --src ./tools/
```

You can specify a directory to scan files within

### Remote Report

```bash
npx blinescan --remote --hours=12
```

This uploads the report to the backend, making it accessible remotely via a generated link.  
Reports expire automatically after the set duration (default: 24 hours).

---

## Report Contents

Each generated report includes:

- **Overall Summary:** Total features, Baseline coverage, health percentage.
- **HTML / CSS / JS Tabs:** Per-category analysis and recommendations.
- **Charts:**
    - Pie chart – feature distribution by Baseline level (low/high/experimental).
    - Line chart – adoption timeline (features reaching Baseline per year).
    - Bar chart – feature count comparison across HTML, CSS, and JS.

---

## Roadmap

- [ ] Add complete JavaScript analysis and feature detection
- [ ] Replace direct VPS uploads with Firebase Storage or another secure service
- [ ] CI/CD integration for automated scanning
- [ ] Report versioning and comparison
- [ ] Public API and IDE extensions

---

## Contributing

Want to contribute to the project? That's awesome! Head over to our [Contribution Guidelines](CONTRIBUTING.md).

## License

This project is licensed under the [Apache 2.0 License](https://github.com/belabdesmd/BLineScan/blob/main/LICENSE).

