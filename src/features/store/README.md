# Store Feature Structure

This store feature now follows a modular and maintainable folder layout.

## Folders

- `modules/`: Domain-oriented page modules.
  - `home/`: Store home page.
  - `catalog/`: Product browsing and discovery pages.
  - `cart/`: Cart and checkout entry page.
  - `orders/`: Order history and confirmation pages.
  - `wishlist/`, `offers/`, `more/`, `chat/`, `scan/`: Standalone user sections.
- `pages/`: Backward-compatible re-export wrappers.
- `components/`: Store-specific reusable UI components.
  - `ui/StoreCard`: Reusable card wrapper with tone and padding variants.
  - `ui/StoreButton`: Reusable button wrapper with tone, size, and width variants.
  - `ui/StorePageHeader`: Reusable sticky header with configurable back action.

## Conventions

- Add new user pages under `modules/<domain>/`.
- Keep shared UI in `components/`.
- Reuse `StoreCard`, `StoreButton`, and `StorePageHeader` for consistent user-facing UI.
- Keep `pages/` files as wrappers only (for compatibility).
- Prefer importing from `modules/*` in new routing and feature composition code.
