import { Crumb } from "@/components/Crumb";
import { Crumb as CrumbType } from "@/db/crumbs";
import React from "react";
import { StyleSheet, View } from "react-native";

interface CrumbListProps {
  crumbs: CrumbType[];
}

export function CrumbList({ crumbs }: CrumbListProps) {
  if (crumbs.length === 0) {
    return null;
  }

  return (
    <View style={styles.listContainer}>
      {[...crumbs].reverse().map((item) => (
        <Crumb key={`crumb-${item.id}`} crumb={item} />
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
