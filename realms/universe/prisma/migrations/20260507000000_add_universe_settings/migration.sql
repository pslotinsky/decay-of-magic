ALTER TABLE "universe"
  ADD COLUMN "settings" JSONB NOT NULL
  DEFAULT '{"codex":{"cardArt":{"aspect":1,"width":600}}}'::jsonb;
