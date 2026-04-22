import { db } from "./schema";

export interface AreaCompletion {
  id: number;
  completedDate: string; // Format: YYYY-MM-DD for range queries
  areaId: number;
}

export const getAreaCompletionsByDate = (date: string): AreaCompletion[] => {
  return db.getAllSync(
    "SELECT * FROM AREA_COMPLETIONS WHERE completedDate = ?",
    [date],
  ) as AreaCompletion[];
};

export const getAreaCompletionsByDateRange = (
  startDate: string,
  endDate: string,
): AreaCompletion[] => {
  return db.getAllSync(
    "SELECT * FROM AREA_COMPLETIONS WHERE completedDate BETWEEN ? AND ? ORDER BY completedDate ASC",
    [startDate, endDate],
  ) as AreaCompletion[];
};

export const isAreaCompleted = (date: string, areaId: number): boolean => {
  const result = db.getFirstSync(
    "SELECT COUNT(*) as count FROM AREA_COMPLETIONS WHERE completedDate = ? AND areaId = ?",
    [date, areaId],
  ) as { count: number } | null;
  return result ? result.count > 0 : false;
};

export const toggleAreaCompletion = (date: string, areaId: number): void => {
  if (isAreaCompleted(date, areaId)) {
    // Delete the completion if it exists
    const deleteStmt = db.prepareSync(
      "DELETE FROM AREA_COMPLETIONS WHERE completedDate = ? AND areaId = ?",
    );
    deleteStmt.executeSync([date, areaId]);
    deleteStmt.finalizeSync();
  } else {
    // Insert a new completion
    const insertStmt = db.prepareSync(
      "INSERT INTO AREA_COMPLETIONS (completedDate, areaId) VALUES (?, ?)",
    );
    insertStmt.executeSync([date, areaId]);
    insertStmt.finalizeSync();
  }
};

export const markAreaComplete = (date: string, areaId: number): void => {
  // Only insert if it doesn't already exist
  if (!isAreaCompleted(date, areaId)) {
    const insertStmt = db.prepareSync(
      "INSERT INTO AREA_COMPLETIONS (completedDate, areaId) VALUES (?, ?)",
    );
    insertStmt.executeSync([date, areaId]);
    insertStmt.finalizeSync();
  }
};

export const markAreaIncomplete = (date: string, areaId: number): void => {
  const deleteStmt = db.prepareSync(
    "DELETE FROM AREA_COMPLETIONS WHERE completedDate = ? AND areaId = ?",
  );
  deleteStmt.executeSync([date, areaId]);
  deleteStmt.finalizeSync();
};

export const deleteAreaCompletionsByDate = (date: string): void => {
  const deleteStmt = db.prepareSync(
    "DELETE FROM AREA_COMPLETIONS WHERE completedDate = ?",
  );
  deleteStmt.executeSync([date]);
  deleteStmt.finalizeSync();
};
