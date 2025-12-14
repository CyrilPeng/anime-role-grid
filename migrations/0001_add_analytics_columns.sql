-- Migration: Add Analytics Columns
-- Add bangumi_id, item_category, and subject_type for detailed analytics

ALTER TABLE save_items ADD COLUMN bangumi_id INTEGER;
ALTER TABLE save_items ADD COLUMN item_category TEXT; -- 'character', 'subject', 'person', 'custom'
ALTER TABLE save_items ADD COLUMN subject_type TEXT;  -- 'anime', 'game', 'music' (only if category='subject')

CREATE INDEX idx_items_bangumi_id ON save_items(bangumi_id);
CREATE INDEX idx_items_category ON save_items(item_category);
