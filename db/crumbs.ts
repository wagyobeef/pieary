import { db } from "./schema";

export interface Crumb {
  id: number;
  createdAt: string;
  areaId: number | null;
  icon: string | null;
  isFavorited: boolean;
  content: string;
}

export const getCrumbs = (): Crumb[] => {
  return db.getAllSync(
    "SELECT * FROM CRUMBS ORDER BY createdAt DESC",
  ) as Crumb[];
};

export const getCrumbById = (id: number): Crumb | null => {
  return db.getFirstSync("SELECT * FROM CRUMBS WHERE id = ?", [
    id,
  ]) as Crumb | null;
};

export const getCrumbsByDate = (date: string): Crumb[] => {
  return db.getAllSync(
    "SELECT * FROM CRUMBS WHERE DATE(createdAt) = DATE(?) ORDER BY createdAt DESC",
    [date],
  ) as Crumb[];
};

export const createCrumb = (
  areaId: number | null,
  icon: string | null,
  content: string,
): void => {
  const insertStmt = db.prepareSync(
    "INSERT INTO CRUMBS (createdAt, areaId, icon, isFavorited, content) VALUES (datetime('now'), ?, ?, 0, ?)",
  );
  insertStmt.executeSync([areaId, icon, content]);
  insertStmt.finalizeSync();
};

export const updateCrumb = (
  id: number,
  areaId: number | null,
  icon: string | null,
  isFavorited: boolean,
  content: string,
): void => {
  const updateStmt = db.prepareSync(
    "UPDATE CRUMBS SET areaId = ?, icon = ?, isFavorited = ?, content = ? WHERE id = ?",
  );
  updateStmt.executeSync([areaId, icon, isFavorited ? 1 : 0, content, id]);
  updateStmt.finalizeSync();
};

export const toggleFavorite = (id: number): void => {
  const toggleStmt = db.prepareSync(
    "UPDATE CRUMBS SET isFavorited = NOT isFavorited WHERE id = ?",
  );
  toggleStmt.executeSync([id]);
  toggleStmt.finalizeSync();
};

export const deleteCrumb = (id: number): void => {
  const deleteStmt = db.prepareSync("DELETE FROM CRUMBS WHERE id = ?");
  deleteStmt.executeSync([id]);
  deleteStmt.finalizeSync();
};
