-- The result page now shows one figure instead of a range, so a lead records
-- one figure too.
--
-- Existing rows keep a value rather than being reset: the midpoint of the range
-- they were quoted is exactly what the single-figure calculation produces, so
-- nothing is lost and nothing is invented.

-- AddColumn
ALTER TABLE "cost_calculator_leads" ADD COLUMN "estimate" INTEGER;

-- Backfill from the range each lead was actually quoted.
UPDATE "cost_calculator_leads"
SET "estimate" = ROUND(("estimateMin" + "estimateMax") / 2.0)
WHERE "estimate" IS NULL;

-- Only now that every row has a value can the column be required.
ALTER TABLE "cost_calculator_leads" ALTER COLUMN "estimate" SET NOT NULL;

-- DropColumn
ALTER TABLE "cost_calculator_leads" DROP COLUMN "estimateMin";
ALTER TABLE "cost_calculator_leads" DROP COLUMN "estimateMax";
