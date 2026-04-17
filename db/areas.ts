import { db } from "./schema";

export interface Area {
  id: number;
  color: number;
  icon: string;
  title: string;
  position: number;
}

export const getAreas = (): Area[] => {
  return db.getAllSync("SELECT * FROM AREAS ORDER BY position ASC") as Area[];
};

export const getAreaById = (id: number): Area | null => {
  return db.getFirstSync("SELECT * FROM AREAS WHERE id = ?", [
    id,
  ]) as Area | null;
};

export const createArea = (
  color: number,
  icon: string,
  title: string,
  position: number,
): void => {
  const insertStmt = db.prepareSync(
    "INSERT INTO AREAS (color, icon, title, position) VALUES (?, ?, ?, ?)",
  );
  insertStmt.executeSync([color, icon, title, position]);
  insertStmt.finalizeSync();
};

export const updateArea = (
  id: number,
  color: number,
  icon: string,
  title: string,
  position: number,
): void => {
  const updateStmt = db.prepareSync(
    "UPDATE AREAS SET color = ?, icon = ?, title = ?, position = ? WHERE id = ?",
  );
  updateStmt.executeSync([color, icon, title, position, id]);
  updateStmt.finalizeSync();
};

export const deleteArea = (id: number): void => {
  const deleteStmt = db.prepareSync("DELETE FROM AREAS WHERE id = ?");
  deleteStmt.executeSync([id]);
  deleteStmt.finalizeSync();
};
