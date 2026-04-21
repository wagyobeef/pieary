import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("pieary.db");

export const initializeDatabase = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS AREAS (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      color INTEGER NOT NULL CHECK(color >= 1 AND color <= 6),
      icon TEXT NOT NULL,
      title TEXT NOT NULL,
      position INTEGER NOT NULL
    );
  `);

  db.execSync(`
    CREATE TABLE IF NOT EXISTS CRUMBS (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      areaId INTEGER,
      icon TEXT,
      isFavorited BOOLEAN NOT NULL DEFAULT 0,
      content TEXT NOT NULL,
      FOREIGN KEY (areaId) REFERENCES AREAS(id)
    );
  `);

  console.log("Database initialized successfully");
};

export const seedDefaultAreas = () => {
  // Check if areas already exist
  const result = db.getFirstSync("SELECT COUNT(*) as count FROM AREAS");

  if (result && (result as { count: number }).count === 0) {
    // Insert default areas matching the pie sectors
    const defaultAreas = [
      { color: 1, icon: "heart.fill", title: "relationships", position: 1 },
      { color: 2, icon: "fork.knife", title: "nutrition", position: 2 },
      { color: 3, icon: "moon.stars.fill", title: "sleep", position: 3 },
      { color: 4, icon: "figure.walk", title: "exercise", position: 4 },
      { color: 5, icon: "book.fill", title: "learning", position: 5 },
      {
        color: 6,
        icon: "brain.head.profile",
        title: "mindfulness",
        position: 6,
      },
    ];

    const insertStmt = db.prepareSync(
      "INSERT INTO AREAS (color, icon, title, position) VALUES (?, ?, ?, ?)",
    );

    defaultAreas.forEach((area) => {
      insertStmt.executeSync([
        area.color,
        area.icon,
        area.title,
        area.position,
      ]);
    });

    insertStmt.finalizeSync();
    console.log("Default areas seeded successfully");
  }
};

export { db };
