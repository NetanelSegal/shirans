-- Drops the single-page calculator's tables, replaced by the multi-step cost
-- calculator in 20260920071500_cost_calculator_lead_shape.
--
-- `calculator_leads` is empty. `calculator_config` holds one row, last touched
-- 2026-03-01, describing the rate card of a calculator that no longer exists.
-- Its contents are recorded here so dropping the table does not erase what the
-- rates were:
--
--   id: cmm826bau0000c4ucbgphgvq5
--   {"constructionBase":{"min":8000,"max":12000},
--    "outdoorBase":{"min":500,"max":1500},
--    "finishMultipliers":{"standard":{"min":1,"max":1.1},
--                         "invested":{"min":1.2,"max":1.4},
--                         "premium":{"min":1.5,"max":1.8}},
--    "poolAddons":{"none":{"min":0,"max":0},
--                  "small":{"min":120000,"max":180000},
--                  "medium":{"min":200000,"max":300000},
--                  "large":{"min":350000,"max":450000}},
--    "kitchenAddons":{"standard":{"min":80000,"max":120000},
--                     "invested":{"min":150000,"max":220000},
--                     "premium":{"min":250000,"max":350000}},
--    "carpentryAddons":{"none":{"min":0,"max":0},
--                       "ready":{"min":30000,"max":60000},
--                       "custom":{"min":80000,"max":150000}},
--    "furnitureAddons":{"none":{"min":0,"max":0},
--                       "basic":{"min":50000,"max":100000},
--                       "full":{"min":150000,"max":300000}},
--    "equipmentAddons":{"none":{"min":0,"max":0},
--                       "basic":{"min":30000,"max":60000},
--                       "full":{"min":80000,"max":150000}},
--    "vatMultiplier":1.18}

-- DropTable
DROP TABLE "calculator_leads";

-- DropTable
DROP TABLE "calculator_config";
