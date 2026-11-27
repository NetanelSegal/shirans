# Git and pull requests

How a change gets from someone's computer to the live site, and how it is reviewed and recorded on the way. Two people work on this repo: **Netanel** (owner, reviews and merges) and **Shiran** (works through Claude Code, opens pull requests). Claude follows this guide for both.

## The rule

**Nothing reaches `main` without a pull request that Netanel has approved.** `main` is production: every push to it deploys the client on Netlify, and server changes deploy on Railway. Never commit to `main`, push to `main`, or merge your own pull request.

## The lifecycle of a change

1. **Start from a fresh `main`.**
   ```bash
   git checkout main
   git pull
   git checkout -b feature/short-description
   ```
   Names: `feature/…` for something new, `fix/…` for a bug, `content/…` for text and image changes, `design/…` for visual changes. Lowercase English, words joined by hyphens: `design/home-hero-spacing`.

2. **One subject per branch.** Changing the gallery and fixing the footer are two branches and two pull requests. A small pull request is reviewed the same day; a big one waits.

3. **Commit as you go**, with [Conventional Commits](https://www.conventionalcommits.org/) in English:
   ```
   feat(gallery): open project photos in a lightbox
   fix(footer): keep the phone number on one line on mobile
   style(home): add breathing room above the services section
   content(about): update Shiran's bio
   ```
   The subject says what changed; the body (optional) says why. Never commit `.env` files, secrets, or large raw images (photos go through `client/src/assets/site/` as WebP, see the [brand guide](../05-Design/brand-guide.md#5-imagery)).

4. **Check before pushing.** From the repo root:
   ```bash
   npm run lint:client
   npm run lint:server
   npm run build
   ```
   Add `npm run test:run` when server logic changed. CI runs the same checks on the pull request and blocks the merge if they fail.

5. **Push and open the pull request.**
   ```bash
   git push -u origin feature/short-description
   gh pr create --base main --fill
   ```
   Then fill in the template (`.github/pull_request_template.md`), which GitHub loads automatically. Request a review from `NetanelSegal`.

6. **Wait for the deploy preview.** Netlify comments a preview link on every pull request within a few minutes. Open it on a phone and a desktop and add the link to the description. **The preview talks to the production server and database:** browsing is safe, but anything saved in the admin on a preview is real.

## What a good pull request contains

The template asks for each of these. A reviewer should understand the change without running it.

- **What and why**, in a sentence or two. Hebrew is fine for the description; the title and commits stay in English.
- **Screenshots, before and after**, on mobile (375px) and desktop, for any visual change. RTL problems show up in screenshots long before they show up in code.
- **The deploy preview link.**
- **What was checked**: lint, build, mobile, desktop, RTL.
- **What was not done or not checked.** Saying it is better than a reviewer finding it.

## How Netanel reviews

1. Open the pull request on GitHub, read the description, open the preview.
2. Read the diff under **Files changed**. For a deeper pass, run `/code-review` in Claude Code against the pull request.
3. Leave comments on specific lines, then submit a review:
   - **Approve**: ready to merge.
   - **Request changes**: something must be fixed first. Each comment says what and why.
   - **Comment**: a question or suggestion that doesn't block.
4. Check against the [brand guide](../05-Design/brand-guide.md) and the [feedback log](../08-Feedback/index.md): one blue (navy), square photos, light large type, no off-system Tailwind classes.
5. When it's approved and CI is green, Netanel merges with **Squash and merge** and deletes the branch.

## Answering review comments

When a pull request gets **Request changes**, Claude (on Shiran's side) reads every comment with `gh pr view <number> --comments`, fixes each one on the **same branch**, pushes, and replies to each comment with what was done. Don't open a new pull request for review fixes, and don't resolve a conversation the reviewer opened; let them resolve it.

## Recording the change

A merged pull request is already a record (description, screenshots, discussion). On top of that:

- **`docs/00-Context/progress.md`**: one line for any change a future reader should know about.
- **`docs/08-Feedback/`**: when a review settles a design decision ("we tried X, Shiran preferred Y because…"), add it to the relevant review file so it isn't relitigated.
- **`docs/05-Design/brand-guide.md`**: when a change adds or changes a token, component variant or rule.

These doc updates go in the same pull request as the change.

## When something goes wrong

- **Pushed to the wrong branch, or a conflict with `main`:** stop and ask Netanel before force-pushing or rebasing a branch someone else may have pulled.
- **Something broke on the live site after a merge:** revert the pull request from GitHub (**Revert** button on the merged pull request), which opens a new pull request that undoes it. Then fix calmly on a new branch.
