# Shiran's Review of the Redesign — September 2026

Shiran reviewed the redesign preview (PR #78, `deploy-preview-78--shirans.netlify.app`) in two rounds over WhatsApp, and sent full page designs for the new pages. This file records what she asked for, what was done, and why — so the next person doesn't reintroduce something she already rejected.

**Where the work lives:** branch `redesign/design-language`, PR [#78](https://github.com/NetanelSegal/shirans/pull/78). The articles API went to `main` separately in PR [#79](https://github.com/NetanelSegal/shirans/pull/79).

---

## Page designs she supplied (21.9.2026)

Twelve full-page mockups, sent as images:

- **Main pages:** home, process, projects, about, contact
- **Five service pages:** אדריכלות ובנייה פרטית, עיצוב פנים, ייעוץ אדריכלי, ליווי אונליין, רישוי
- **Knowledge centre:** the blog index, and an article template

The service-page copy was transcribed from these images into [`client/src/data/service-pages.ts`](../../client/src/data/service-pages.ts).

**What the designs could not supply:**
- **FAQ answers.** The accordions are drawn closed, so only the questions were hers. Draft answers were written deliberately free of prices and fixed timelines, then reviewed by her in round 2.
- **A photo for ליווי אונליין.** Her photo folder had four service images for five services. The page borrows `servicesHero` until she sends one.
- **Per-step photos** for each service page's "איך זה עובד". The steps render as a numbered timeline instead.

---

## Round 1 — 22.9.2026

| # | Her note | What was done |
|---|---|---|
| 1 | Remove "עיצוב מסחרי" and "דירות יוקרה" from the home page and the services page | Removed from `SERVICES`. Their photos were deleted, and the `/services` meta description updated |
| 2 | Services should link to the inner pages she sent | Five service pages built at their own URLs; cards link to them |
| 3 | Everything mustard → blue | Bronze/sand palette replaced at the token layer (superseded by round 2) |
| 4 | Mobile: "בואו נתחיל יחד" is too big | Button size `lg` only reaches full size from `sm` up |
| 5 | Mobile: the menu is see-through | **Not a colour problem.** See the note below |
| 6 | Don't round photos, on mobile or desktop | Radius removed from every photo and photo-flush panel |
| 7 | Her photo beside "התהליך מתחילתו ועד סופו" is blurry | Re-cropped 4:5 from the original frame (see the note below) |
| 8 | An articles page is missing | Knowledge centre built: `/blog`, `/blog/:slug`, and an admin screen |
| 9 | New folder "תמונות חדשות לאתר" | Ten images wired in: four services, five process steps, the contact banner |

**The mobile menu.** `backdrop-filter` on `<header>` made it the containing block for its `position: fixed` descendants, so the menu sheet resolved `top: nav` / `bottom: 0` against the 72px bar and came out **zero pixels tall**. It painted no background while its links spilled over the page. The blur now lives on an inner bar.

**The blurry photo.** A 4:5 box was being filled from a 16:9 export, so the browser stretched about 900px of detail across the whole column. The fix was cropping from the 6231×4154 original.

---

## Round 2 — 23–24.9.2026

| # | Her note | What was done |
|---|---|---|
| 1 | "קראו עוד עליי" and "נעים להכיר" should be blue, not pale blue — *"there is no pale blue on the site"* | Accent darkened |
| 2 | On desktop, all services on one row | `lg:grid-cols-5` |
| 3 | The licensing card should say only "רישוי והיתרים" | A separate `cardTitle`. The page H1 stays "אדריכלות, רישוי והיתרים" as the SEO brief specifies |
| 4 | "לכל הפרויקטים" is almost invisible | The `text` button variant had no underline until hover; it is underlined at rest now |
| 5 | Everything pale blue → dark blue | See "The colour decision" below |
| 6 | Contact band: photo across the whole band, not half navy | Full-bleed photo under a navy gradient |
| 7 | The contact page is strange in colour and not dramatic enough | It was a cream card on a cream page. The band is navy now, with a white form card and a tall hero |
| 8 | Project page photos: no rounding, no frame | Radius and the 2px border removed, in the gallery and the lightbox |
| + | Calculator and result pages don't match the new design (via Netanel) | Landing page rebuilt on `PageHero` + `FeatureStrip`; result page moved from white to cream and onto the type scale |
| + | Hover on a project card: the photo spills out (via Netanel) | The photo wrapper had no `overflow-hidden`; the zoom slid an un-faded sliver over the title |

### FAQ answers

Her replies, per page:

- **All five pages:** keep the drafts, except below
- **אדריכלות לבנייה פרטית, Q1** and **רישוי והיתרים, Q1** ("how long does it take"): *"מינימום של שנה. משך ההליך תלוי ברשות המקומית, במורכבות התכנון ובדרישות שיעלו."*
- **רישוי והיתרים:** the page has five questions and she answered four. Q5 ("האם הליווי כולל גם את שלב הביצוע?") keeps the draft. **Open — needs her confirmation.**

---

## The colour decision

This took three passes, and the end state is deliberate.

1. **Round 1:** mustard → a mid blue (`#5a8cc2`). Rejected: *"there is no pale blue on the site."*
2. **Round 2:** a deep blue (`#265c96`). Netanel, looking at a secondary button: *"I don't like this light blue."* Beside the navy, any second blue read as light.
3. **Final:** **no second blue at all.** The accent is the navy itself.

Netanel also noted there were "lots of shades of every colour": five navies, three creams, two blues. The palette was cut to **six colours and a hairline**:
- navy 900 / 800 / 600
- cream 100 / 200
- white
- stone 300 for hairlines

This was checked by walking the computed colours of every element across nine public pages.

**Do not reintroduce a second blue, a sand or a bronze.** The full palette is in the [brand guide](../05-Design/brand-guide.md).

---

## Still open

- [ ] A photo for **ליווי אונליין**
- [ ] Her confirmation of the **home page headline**, changed per the SEO brief from "בית יפה מתחיל בתכנון נכון" to "אדריכלות ועיצוב פנים לבית שמרגיש בדיוק שלכם"
- [ ] **רישוי והיתרים FAQ Q5** — keep, change or remove
- [ ] The **first article** — the knowledge centre is live but empty
