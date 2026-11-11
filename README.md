# Academic Hub: Dr. Sani Isah Abba

A personal academic website with an admin dashboard for publishing research, publications and news.

**Public site:** Home, About, Research, Publications (search, filter by year and type, copy APA and BibTeX citations, PDF downloads), News, Contact.

**Admin dashboard (`/admin`):**
- **Publications:** add, edit and delete papers; paste a DOI to fill in the details automatically (Crossref); bulk-import a list of DOIs; attach full-text PDFs; star papers to feature them on the home page.
- **Research:** ongoing and completed projects, with ordering.
- **News and updates:** new papers, awards, talks, grants and media, with drafts.
- **Gallery:** upload several photos at once (resized automatically), write captions, reorder, and star photos for the home page.
- **Messages:** inbox for the contact form.
- **Profile and CV:** name, headline, biography, photo, CV PDF, facts at a glance, interests, appointments, education and research-profile links.

Stack: React 19, TypeScript, Vite, Tailwind CSS, with Supabase for the database, file storage and login. Hosted on Vercel.

---

## 1. Run it locally

```bash
npm install
npm run dev
```

Without Supabase keys the site runs in **demo mode**. Content is saved in your browser only, and the admin password is `admin123`.

## 2. Connect Supabase (needed for real use)

1. Create a free project at supabase.com.
2. Open **SQL Editor**, paste the contents of `supabase/schema.sql` and choose **Run**. This creates the tables, the security rules and the `files` storage bucket.
3. Under **Authentication → Providers → Email**, turn off **Allow new users to sign up**.
4. Under **Authentication → Users → Add user**, create the admin login (email and password).
5. Under **Project Settings → API**, copy the **Project URL** and **anon public key** into `.env.local`:
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```
6. Sign in at `/admin` and choose **Load starter content** on the Overview page. Then edit the profile and add publications.

## 3. Deploy to Vercel

1. Push this folder to a GitHub repository.
2. In Vercel, choose **Add New → Project**, import the repository, and keep the framework preset at **Vite**.
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` under **Environment Variables**.
4. Deploy. `vercel.json` already handles page routing, so `/publications` and `/admin` work on refresh.
5. Optional: add a custom domain such as `saniabba.com` under **Settings → Domains**. A custom domain looks far more credible internationally than a `vercel.app` address.

## 4. Before launch, confirm with Dr. Abba

The starter content comes from his 2026 CV (Abba_CV_FV_2026_ADUST). Please check:

- [ ] Home-page headline and biography wording
- [ ] Status of the 2024 KFUPM projects and the Blue Flag beach project (shown as completed)
- [ ] Year of the book chapter "Groundwater Development Within the Nigerian Crystalline and Sedimentary Aquifers" (not in the CV; set to 2025, like the other chapters in that book)
- [ ] Venue of "Groundwater modelling and GIS-based vulnerability mapping…" (not in the CV; set to Earth Science Informatics)
- [ ] Add DOIs for the publications: use **Admin → Publications → Import from DOIs** to add the full list from Scopus or ORCID
- [ ] Google Scholar and ResearchGate links, if he wants them shown
- [ ] Gallery captions, events and dates
- [ ] CV PDF upload

## Project structure

```
src/
  lib/        data layer (store.ts), types, citation helpers, starter content
  components/ site layout, hydrograph, publication entry
  pages/      public pages
  admin/      dashboard screens and form widgets
supabase/schema.sql
```
