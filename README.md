🛒 Shopping List Application

A modern Shopping List Management Application built using React + Ant Design, featuring item management, filtering, sorting, reporting, and data visualization with amCharts.

Folder Structure

src/
│
├── components/
│   ├── ReportModal.tsx
│   ├── SalesReportChart.tsx
│   ├── SectionHeader.tsx
│   └── ShoppingTable.tsx
│
├── context/
│   └── ShoppingContext.tsx
│
├── hooks/
│   └── useInfiniteScroll.ts
│
├── data/
│   └── data.js
│
├── pages/
│   └── ShoppingListPage.tsx
│
├── styles/
│   └── (Component-specific CSS files)
│
├── App.tsx
└── App.css

Components Overview

1. ReportModal.tsx

Used for displaying the Sales Report Modal in the shopping list page.
Shows overall spending insights and integrates the sales chart component.

Features:

Total spending
Highest cost item
Average cost
Dark / light theme support

2. SalesReportChart.tsx

Responsible for rendering the Sales Report Bar Chart using amCharts.

Features:

Scrollable and zoomable bar chart
Average cost displayed as a dotted horizontal line
Custom tooltip showing:
    Total cost
    Price per unit
    Quantity

3. SectionHeader.tsx

A reusable header component used across pages.

Props:
Title
CTA button text
CTA click handler

Use Case:
Ideal for pages that require a title with a call-to-action button .

4.ShoppingTable.tsx

Displays the list of shopping items using Ant Design Table.

Features:

Column sorting with custom sort icons
Category & sub-category support
Search functionality
Dark mode optimized styling
Export-friendly structure


5. CSS Folder

Contains all component-specific CSS files used for:
Layout alignment
Dark / light theme styling
Table and modal overrides
Pixel-perfect UI consistency
Global theme-related styles are handled in App.css.

6. Data & Utilities

data/data.js
Contains mock data for:
Categories
Sub-categories
Shopping items
Used for initial rendering and local testing.

7. useInfiniteScroll.ts

A custom React hook used to implement infinite scrolling.
Behavior:

Loads a fixed number of items as the user scrolls
Automatically stops loading when no more data is available

8. Pages
ShoppingListPage.tsx

The main page of the application.
Responsibilities:

Item creation form
Category & sub-category filters
Search functionality
Sorting logic
Table rendering
Sales report modal integration

9. State Management
ShoppingContext.tsx
Uses React Context API for state management.

Manages:

Shopping items list
Categories and sub-categories
Add item functionality
Centralized and reusable state logic

Key Features

Add and manage shopping items
Filter by category, sub-category, and search
Visual sales analytics with amCharts
Dark / Light theme support
Infinite scrolling for large datasets
Export shopping data (CSV / JSON)

Tech Stack

React (TypeScript)
Ant Design v5
amCharts 5
Context API
Day.js
