-- CreateTable
CREATE TABLE "calculator_leads" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "builtAreaSqm" INTEGER NOT NULL,
    "constructionFinish" TEXT NOT NULL,
    "pool" TEXT NOT NULL,
    "outdoorAreaSqm" INTEGER NOT NULL,
    "outdoorFinish" TEXT NOT NULL,
    "kitchen" TEXT NOT NULL,
    "carpentry" TEXT NOT NULL,
    "furniture" TEXT NOT NULL,
    "equipment" TEXT NOT NULL,
    "priceDisplay" TEXT NOT NULL,
    "estimateMin" INTEGER NOT NULL,
    "estimateMax" INTEGER NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "calculator_leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calculator_config" (
    "id" TEXT NOT NULL,
    "config" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "calculator_config_pkey" PRIMARY KEY ("id")
);
