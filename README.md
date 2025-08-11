# 🚗 Car Maintenance Tracker

A simple **local-only** web app to track maintenance schedules for your vehicles.  
No internet, no accounts, no cloud storage — all data is stored on your own computer.

---

## 📋 Features

- **Vehicle Management**  
  Add, edit, and delete vehicles with make, model, year, and mileage.

- **Maintenance Scheduling**  
  Track upcoming and completed tasks with due dates, mileage thresholds, and recurrence (e.g., every 5,000 miles).

- **Dashboard Overview**  
  See all due and overdue maintenance tasks at a glance.

- **Offline-First**  
  Works entirely without internet access.

- **Local Data Storage**  
  Saves data to your browser’s `localStorage` or `IndexedDB` (no servers involved).

- **Data Backup/Restore**  
  Export and import your data as JSON files.

---

## 🛠 Tech Stack

- **Frontend:** HTML, CSS, JavaScript (Vanilla or React/Vue/Svelte)
- **Storage:** `localStorage` or `IndexedDB`
- **Build Tool:** Vite or none (can run as static HTML)
- **Styling:** Tailwind CSS or plain CSS

---

## 📦 Installation

1. **Clone or Download the Repository**
   ```bash
   git clone https://github.com/yourusername/car-maintenance-tracker.git
   cd car-maintenance-tracker
