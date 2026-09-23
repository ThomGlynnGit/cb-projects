# Editing your website

You can update three parts of the website yourself, from any web browser:

- **Selected Works**: add, edit or remove projects
- **Sketchbook**: add, edit or remove sketches
- **Site settings**: your company name, address, email, phone number and contact form

The other page text (the Practice page and Services) is changed by your web developer. Send them any updates you'd like.

The editor is at:

**https://thomglynngit.github.io/cb-projects/admin/**

Once your own domain name is set up, it will move to `/admin/` on that domain, for example `https://www.yourdomain.co.uk/admin/`.

---

## One-time setup

You'll only need to do this once, plus renew your access key once a year (see [Renewing your access key](#renewing-your-access-key)).

### 1. Set up your GitHub account

Your website is stored on GitHub, and the editor saves your changes there.

1. Create a GitHub account at [github.com](https://github.com) if you haven't already. Use it only for your website.
2. Turn on **two-factor authentication**: click your profile picture (top right) → **Settings** → **Password and authentication** → **Enable two-factor authentication**, then follow the steps. This stops anyone who learns your password from getting in.
3. Your web developer will invite you to the website's project. Accept the invitation from the email GitHub sends you.

### 2. Create your access key

The editor uses an access key (GitHub calls it a "token") instead of your password.

1. On GitHub, click your profile picture → **Settings**.
2. At the bottom of the left-hand menu, click **Developer settings**.
3. Click **Personal access tokens** → **Tokens (classic)**.
4. Click **Generate new token** → **Generate new token (classic)**.
5. Fill in the form:
   - **Note**: `Website editor`
   - **Expiration**: choose **Custom** and pick a date one year from today
   - **Select scopes**: tick **repo** only (this ticks the boxes underneath it too). Leave everything else unticked.
6. Click **Generate token** at the bottom of the page.
7. Copy the key it shows you. It starts with `ghp_`. **GitHub only shows it once**, so keep this page open until you've signed in to the editor.

Treat this key like a password. Never email it or share it with anyone, including your web developer.

### 3. Sign in to the editor

1. Go to the editor address above.
2. Click **Sign In Using Access Token**. (The "Sign In with GitHub" button isn't set up for your site and won't work.)
3. Paste your key and sign in.

Your browser will remember you, so next time you can go straight to the editor.

---

## Making changes

Choose a section from the menu on the left, open an item to change it, or create a new one. Click **Save** when you're done.

**Your changes go live on the website a few minutes after you save.** There's no separate "publish" step, so check your work before saving.

### Projects (Selected Works)

- **Title**, **Summary**, **Main image** and **Year** are required. The editor won't let you save without them.
- **Summary** is a single line. It appears on the project's card and under its title.
- **Location**, **Client**, **Architect** and **Sector** are optional. Any you leave empty won't appear on the page.
- In **Overview** and **Project details**, leave a blank line between paragraphs.
- **Gallery**: add as many images as you like. They appear in the order listed.
- Projects are listed newest year first.

### Sketchbook

- Each sketch needs an **Image**. A **Caption** is optional.
- **Order** controls where it appears: lower numbers come first. Sketches without a number go at the end.

### Site settings

These appear in the footer of every page. Only change **Formspree form ID** if your web developer asks you to, because a wrong value stops the contact form from working.

### Images

Upload photos and scans as they are. The editor automatically shrinks large images and converts them to a web-friendly format before saving, so you don't need to resize anything first.

---

## Keeping your website safe

- **Keep your access key private.** Anyone who has it can change your website.
- **Sign out on shared computers.** Click your profile picture in the editor and choose **Sign Out**. This removes the key from that browser.
- **If you think your key has been seen by someone else**, delete it straight away on GitHub (**Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)** → **Delete**), create a new one, and tell your web developer.
- **Mistakes can always be undone.** Every change you save is kept in the website's history. If something goes wrong, contact your web developer and they can restore an earlier version.

## Renewing your access key

Your key stops working on the expiry date you chose, and GitHub will email you a reminder beforehand. To renew it:

1. Create a new key by following [step 2](#2-create-your-access-key) again.
2. In the editor, sign out, then sign in again with the new key.
3. Delete the old key on GitHub.
