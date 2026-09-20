-- The multi-step cost calculator stores a different shape from the calculator
-- it replaces. Additive only: the previous tables are left in place so nothing
-- is lost, and retiring them stays a separate, deliberate decision.

-- CreateTable
CREATE TABLE "cost_calculator_leads" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "marketingConsent" BOOLEAN NOT NULL DEFAULT false,
    "projectStage" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "builtAreaSqm" INTEGER NOT NULL,
    "levels" TEXT NOT NULL,
    "components" TEXT[],
    "finishLevel" TEXT NOT NULL,
    "carpentry" TEXT NOT NULL,
    "interiorDesign" TEXT NOT NULL,
    "timeline" TEXT NOT NULL,
    "estimateMin" INTEGER NOT NULL,
    "estimateMax" INTEGER NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cost_calculator_leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cost_calculator_config" (
    "id" TEXT NOT NULL,
    "config" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cost_calculator_config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "cost_calculator_leads_createdAt_idx" ON "cost_calculator_leads"("createdAt");
