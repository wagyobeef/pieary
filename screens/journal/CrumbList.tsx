import { Crumb } from "@/components/Crumb";
import { Crumb as CrumbType } from "@/db/crumbs";
import React from "react";
import { StyleSheet, View } from "react-native";

interface CrumbListProps {
  crumbs: CrumbType[];
  onFavoriteToggle?: () => void;
}

export function CrumbList({ crumbs, onFavoriteToggle }: CrumbListProps) {
  if (crumbs.length === 0) {
    return null;
  }

  return (
    <View style={styles.listContainer}>
      {[...crumbs].reverse().map((item) => (
        <Crumb
          key={`crumb-${item.id}`}
          crumb={item}
          onFavoriteToggle={onFavoriteToggle}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 0,
    paddingTop: 0,
  },
});
