# 📊 PriceProfile

A full‑stack **ASP.NET & JavaScript** application for managing pricing profiles and related data — designed to help businesses organize, track, and analyze pricing structures with a clean architecture and modular services.

---

## 🧩 Project Overview

**PriceProfile** is a modular solution built with:

✔ ASP.NET Core backend for API and business logic
✔ Entity Framework Core for data access (EFDataService)
✔ Domain models separated in `PriceProfile.Models`
✔ Front‑end UI (JavaScript/CSS) for interactive user experience

This project demonstrates best practices in layered architecture, dependency injection, and clean separation of concerns — suitable for real‑world enterprise applications. ([github.com](https://github.com/jsh2182/PriceProfile))

---

## 🚀 Features

* **Pricing Profile Management** – Create, update, delete pricing profiles.
* **Entity Framework Data Layer** – Abstracted data access service.
* **Clean Architecture** – Separate layers for models, data, and application logic.
* **Scalable Structure** – Ready to integrate with frontend frameworks (React, Angular, Blazor).

---

## 🛠 Architecture

```
PriceProfile.sln
├── PriceProfile/               # Core application
├── PriceProfile.Models/        # Domain models
├── PriceProfile.EFDataService/ # EF data access implementation
└── Frontend/                  # UI assets (JS, CSS)
```

This structure promotes:

✔ Maintainability
✔ Testability
✔ Clear separation between UI, business logic, and data access

---

## 📦 Tech Stack

| Layer       | Technology             |
| ----------- | ---------------------- |
| Backend     | ASP.NET Core           |
| Data Access | Entity Framework Core  |
| Frontend    | JavaScript & CSS       |
| Build Tools | .NET CLI / VS Solution |

---

## 📌 Getting Started

### Prerequisites

Install:

* .NET SDK 4.7+
* SQL Server / SQLite (or your chosen DB)
* Node.js (if frontend tooling applies)

---

### Setup

1. **Clone the repo**

   ```bash
   git clone https://github.com/jsh2182/PriceProfile.git
   ```

2. **Restore .NET Packages**

   ```bash
   dotnet restore
   ```

3. **Apply Migrations**
   (If migrations exist)

   ```bash
   dotnet ef database update
   ```

4. **Run the App**

   ```bash
   dotnet run --project PriceProfile
   ```

---

## 🧪 Testing

Add **unit/integration tests** for:

* Services
* Data interactions
* API endpoints

(NOTE: Currently tests are not included — leaving room for extension.)

---

## 🎯 Use Cases

This solution can be used as:

✅ A sample enterprise backend project
✅ Starter template for pricing management systems
✅ Case study for layered architecture in ASP.NET

---

## 📁 Folder Highlights

### 🧠 PriceProfile.Models

Domain entities (e.g., PricingProfile, PriceTier, Category).

### 🗄 PriceProfile.EFDataService

EF Core data service implementing repository patterns and context.

### 💻 PriceProfile

Main application logic and startup configuration.

---

## 👨‍💻 Developer Notes

* Clean architecture enables plugging in alternative data stores.
* Ready to expand with SPA front‑end frameworks like React or Blazor.
* Suitable for SaaS pricing modules in business systems.
