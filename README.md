# Dennis K. Muriithi — Portfolio Website

A static, dependency-free portfolio (HTML/CSS/JS) built from your CV, profile photo,
and MalariaAI Kenya / CardioPredict AI / DiabetesAI dashboard screenshots.

## Files

```
index.html      — the whole site (all sections, styles inline in <style>)
script.js       — theme toggle, typing effect, scroll reveal, counters, project filter, contact form
404.html        — custom not-found page
robots.txt      / sitemap.xml — basic SEO
vercel.json     — clean URLs config for Vercel
assets/
  profile.jpg
  cardiopredict.png
  diabetesai.png
  malariaai.png
  Dennis_K_Muriithi_CV.pdf
```

## Before you publish — please check these

1. **CV file contains referee contact details.** `assets/Dennis_K_Muriithi_CV.pdf` is
   your CV as uploaded, which lists your referees' personal emails and phone numbers.
   Consider removing the referees section (or emails/phone numbers) from the PDF
   before it's publicly downloadable from the "Download CV" button, so their
   personal contact information isn't exposed without their consent.
2. **Live demo links** — I matched the two Posit Connect Cloud links you shared to
   CardioPredict AI and MalariaAI Kenya based on the order you sent them. Please
   verify each "Live demo" button opens the correct dashboard, and swap them in
   `index.html` if reversed.
3. **GitHub repo links** — your CV/message didn't include individual repo URLs, so
   every "Repository" button currently points to `github.com/kamuriithi`. Replace
   `href="https://github.com/kamuriithi"` in each project block with the specific
   repo URL once you have them.
4. **Google Scholar** — no direct profile URL was provided, so that link currently
   points to `scholar.google.com`. Swap in your profile URL when you have it.

## Deploying to Vercel

1. Push this folder to a GitHub repo (or drag-and-drop the folder into the Vercel
   dashboard's "Add New Project" flow).
2. In Vercel: **New Project → Import** the repo. No framework preset needed — leave
   build command empty and output directory as `/` (or `.`).
3. Deploy. Your site will be live at `your-project.vercel.app`; add a custom domain
   under Project Settings → Domains if you'd like `cdam.chuka.ac.ke` or similar.

## Making the contact form actually send email

Right now "Send Message" opens the visitor's email client with the message
pre-filled (no backend required, works everywhere). To send messages directly
without that step:

1. Create a free account at [emailjs.com](https://www.emailjs.com).
2. Add the SDK to `index.html`, just before `<script src="script.js"></script>`:
   ```html
   <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
   ```
3. In `script.js`, replace the `contactForm.addEventListener('submit', ...)` block
   with an `emailjs.send('SERVICE_ID', 'TEMPLATE_ID', {...}, 'PUBLIC_KEY')` call
   using your own EmailJS service ID, template ID and public key.

## Customizing

- **Colors / fonts**: edit the CSS variables at the top of the `<style>` block in
  `index.html` (`--teal`, `--terracotta`, `--gold`, `--font-display`, etc.) — dark
  mode variables are in the adjacent `[data-theme="dark"]` block.
- **Typed hero roles**: edit the `roles` array near the top of `script.js`.
- **Add a project**: duplicate a `.project-card` block in the Projects section and
  drop a new screenshot into `assets/`.
