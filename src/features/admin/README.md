# Admin Feature Structure

This admin feature follows a modular, industry-style layout.

## Folders

- `modules/`: Route-level and domain-specific modules.
  - `auth/`: Admin authentication pages.
  - `dashboard/`: Main admin dashboard and management tabs.
  - `analytics/`, `customers/`, `orders/`, `products/`, `reports/`, `settings/`: Standalone admin module pages.
- `components/layout/`: Admin layout shell components.
- `components/shared/`: Reusable admin UI components.
- `pages/`: Backward-compatible re-export entry points.

## Conventions

- Keep route/page containers inside `modules/*`.
- Keep cross-module reusable UI in `components/shared/`.
- Keep navigation/shell wrappers in `components/layout/`.
- Keep files in `pages/` as compatibility wrappers only.
