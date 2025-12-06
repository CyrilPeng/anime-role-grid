DROP TABLE IF EXISTS save_items;
DROP TABLE IF EXISTS saves;

CREATE TABLE saves (
    id TEXT PRIMARY KEY,
    template_id TEXT NOT NULL,
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE TABLE save_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    save_id TEXT NOT NULL,
    slot_index INTEGER NOT NULL,
    character_name TEXT NOT NULL,
    FOREIGN KEY(save_id) REFERENCES saves(id)
);

CREATE INDEX idx_saves_template ON saves(template_id);
CREATE INDEX idx_items_char ON save_items(character_name);
