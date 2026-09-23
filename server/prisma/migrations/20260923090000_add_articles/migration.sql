-- The knowledge centre. One table: an article is self-contained, and its FAQ
-- rides along as JSON rather than a second table, because nothing ever queries
-- a question on its own.
--
-- "publishedAt" is nullable and set the first time an article is published, so
-- a later edit never moves the date a reader (or Google) already saw.

-- CreateTable
CREATE TABLE "articles" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "coverImage" TEXT NOT NULL,
    "coverImageAlt" TEXT,
    "coverImagePublicId" TEXT,
    "category" TEXT,
    "readingMinutes" INTEGER NOT NULL DEFAULT 1,
    "faq" JSONB NOT NULL DEFAULT '[]',
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "articles_slug_key" ON "articles"("slug");

-- The listing reads published articles newest first.
CREATE INDEX "articles_published_publishedAt_idx" ON "articles"("published", "publishedAt");

CREATE INDEX "articles_category_idx" ON "articles"("category");
