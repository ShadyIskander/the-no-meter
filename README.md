# Tia’s No-Meter

A scoreboard that reads from a Google Sheet. Hosted on Vercel.

## 1. Set up the Google Sheet

Make a sheet with this header row (row 1):

| Date | Ask | Reply | Score | Note |
|------|-----|-------|-------|------|

- **Score** is 0–10. 10 is a clean, confident no. 0 is a yes before the question ended. 7+ counts as a strong no.
- Add a new row each time you ask her something.

Then publish it:

1. In Google Sheets: **File → Share → Publish to web**
2. Choose the sheet tab and **Comma-separated values (.csv)**
3. Click **Publish** and copy the link

## 2. Deploy on Vercel

1. Put this folder in a GitHub repo (or run `vercel` from this folder with the Vercel CLI).
2. Import the repo in Vercel. No build settings are needed.
3. Add an environment variable: `SHEET_CSV_URL` = the CSV link you copied.
4. Deploy. Updates to the sheet show up within about a minute.

## Folder structure

```
index.html      the dashboard
api/scores.js   reads the sheet and returns JSON
```

If the sheet can’t be reached, the page shows demo data with a yellow banner so you can tell.
