# HOMELY — Thoughtful Finds for Beautiful Everyday Living

> **Brand:** HOMELY  
> **Market:** India (`amazon.in`)  
> **Business Model:** Pinterest-driven Amazon India affiliate marketing & editorial product discovery.  
> **Tagline:** Thoughtful Finds for Beautiful Everyday Living.

HOMELY is a production-quality affiliate shopping and product-discovery platform designed like a premium home and lifestyle editorial magazine (Kinfolk meets modern Scandinavian & Indian warmth) combined with a functional online shopping catalogue.

---

## 🎨 Official Color Palette & Typography

HOMELY follows the balanced 60/30/10 aesthetic system:

| Color | Hex | Usage | Balance |
|---|---|---|---|
| **Warm Ivory** | `#F6F2E9` | Main page background | ~60% |
| **Muted Sage** | `#879681` | Secondary accents, badges, cards | ~30% |
| **Burnt Terracotta** | `#C4775A` | Primary CTAs, important highlights | ~10% |
| **Deep Charcoal** | `#353A32` | Main typography & footer | Typography |
| **Warm Grey** | `#A29B8E` | Subtitles, meta text, indicators | Supporting |
| **Soft Border** | `#E5DED2` | Editorial borders & dividers | Structure |
| **Pure White** | `#FFFFFF` | Product cards & clean surfaces | Cleanliness |

### Typography
- **Primary Display Font:** `Playfair Display` (Headings, titles, branding)
- **Primary Body Font:** `DM Sans` (Navigation, descriptions, filters, buttons)
- **Editorial Accent Font:** `Cormorant Garamond` (Pull-quotes, philosophy statements)

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14+ with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS with custom editorial configuration
- **Icons:** Lucide React
- **Database:** Supabase PostgreSQL (with automatic zero-downtime runtime fallback)
- **Affiliate Integration:** Official Amazon Creators API (Amazon India `www.amazon.in`)
- **Deployment:** Vercel-ready with zero external dependencies needed to run

---

## 🚀 Operating Modes

### Mode 1: Manual Product Mode (Active by Default)
HOMELY runs **immediately without requiring any Amazon API credentials**.
- Admin can manually create, edit, publish, and feature products.
- Associate tracking tag (`homelyindia-21` or your custom tag) is automatically attached to all Amazon India product URLs.
- Filter products by verified price tiers (Under ₹299, ₹499, ₹999, ₹1,499) or unverified dynamic pricing.
- Complete Journal/Blog system with embedded affiliate products.
- Client-side zero-friction Wishlist backed by `localStorage`.

### Mode 2: Official Amazon Creators API Mode
When approved by Amazon India for the Creators API:
1. Provide `AMAZON_CREATOR_CLIENT_ID` and `AMAZON_CREATOR_CLIENT_SECRET` in `.env.local` or Vercel.
2. The server-side client authenticates via OAuth 2.0 with Amazon India (`https://api.amazon.in/auth/o2/token`).
3. Access tokens are cached securely in server memory and automatically refreshed before expiry.
4. Admins can search live Amazon India products by keyword and import them with 1-click.

---

## 🗄️ Database Setup (Supabase PostgreSQL)

HOMELY includes a complete SQL schema at `supabase/schema.sql`.

To link Supabase:
1. Create a free Supabase project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard and run the code from `supabase/schema.sql`.
3. Add your Supabase credentials to `.env.local` or Vercel Environment Variables:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=eyJ...
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   ```
*Note: If Supabase keys are left empty, HOMELY seamlessly runs in memory mode with pre-curated sample finds.*

---

## 🔐 Admin Studio Access

The admin studio is located at:
```
http://localhost:3000/admin
```
- **Default passkey:** `homely2025`
- Configurable via `ADMIN_SECRET_KEY` in `.env.local` or production environment variables.
- Features:
  - **Catalogue Management:** Add, edit, publish/unpublish, feature, and delete products.
  - **Amazon Creators API Tool:** Search and 1-click import products with associate tags.
  - **Journal Studio:** Write, publish, and link products to lifestyle essays.
  - **Integration Diagnostics:** Live connection status for Amazon Creators API and database.

---

## 📌 Pinterest Traffic Strategy

Pinterest is HOMELY's primary traffic acquisition channel:
- Every product card, category page, and journal article has a one-click **"Pin it"** button.
- Clean OpenGraph, Twitter, and Pinterest Rich Pins metadata are embedded on all pages.
- Dynamic XML Sitemap (`/sitemap.xml`) and `robots.txt` (`/robots.txt`) are generated automatically for Google and Pinterest crawlers.

---

## ⚖️ Affiliate Compliance Statement

HOMELY strictly adheres to the Amazon Associates Operating Agreement:
- **Mandatory Statement Displayed:**  
  *&ldquo;As an Amazon Associate I earn from qualifying purchases.&rdquo;*
- Visible in website footer, dedicated `/affiliate-disclosure` page, and near all Amazon product CTAs.
- No fabricated customer reviews, fake ratings, or fake discounts are displayed.
- Prices are only assigned to budget tiers when verified and current. Unverified products display &ldquo;Check Latest Price on Amazon&rdquo;.

---

## 📦 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Open in browser
http://localhost:3000
```

---

## 🚢 Deploying to Vercel

1. Push this repository to GitHub or GitLab.
2. Import the project into [Vercel](https://vercel.com).
3. Set the Environment Variables:
   - `NEXT_PUBLIC_SITE_URL`: `https://yourdomain.com`
   - `AMAZON_PARTNER_TAG`: `yourtag-21`
   - `ADMIN_SECRET_KEY`: `your-secure-admin-passkey`
   - *(Optional)* `AMAZON_CREATOR_CLIENT_ID` & `AMAZON_CREATOR_CLIENT_SECRET`
   - *(Optional)* `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy! Production builds complete with zero warnings or errors.

**HOMELY — Little finds. Beautiful living.**

