import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAreas } from "@/contexts/AreasContext";
import { getCrumbById, updateCrumb, deleteCrumb } from "@/db/crumbs";
import { useThemeColor } from "@/hooks/use-theme-color";
import { colorIndexToHex } from "@/utils/colorIndexToHex";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function CrumbDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { areas } = useAreas();
  const [crumb, setCrumb] = useState<any>(null);
  const [content, setContent] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(true);

  const backgroundColor = useThemeColor(
    { light: "#faf6f0", dark: "#1c1c1e" },
    "background"
  );
  const headerTextColor = useThemeColor(
    { light: "#5a4a3a", dark: "#ffffff" },
    "text"
  );
  const textColor = useThemeColor(
    { light: "#3d2f2a", dark: "#ffffff" },
    "text"
  );
  const placeholderColor = useThemeColor(
    { light: "#8e8e93", dark: "#8e8e93" },
    "text"
  );
  const inputBackgroundColor = useThemeColor(
    { light: "#ffffff", dark: "#2c2c2e" },
    "background"
  );
  const borderColor = useThemeColor(
    { light: "#e5e5e7", dark: "#3a3a3c" },
    "background"
  );

  useEffect(() => {
    if (id) {
      const crumbData = getCrumbById(parseInt(id));
      setCrumb(crumbData);
      setContent(crumbData?.content || "");
      setLoading(false);
    }
  }, [id]);

  const handleContentChange = (text: string) => {
    setContent(text);
    setHasChanges(text !== crumb?.content);
  };

  const handleSave = () => {
    if (crumb && hasChanges) {
      updateCrumb(
        crumb.id,
        crumb.areaId,
        crumb.icon,
        crumb.isFavorited,
        content
      );
      router.back();
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Crumb",
      "Are you sure you want to delete this crumb? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            if (crumb) {
              deleteCrumb(crumb.id);
              router.back();
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <ActivityIndicator size="large" color={textColor} />
      </SafeAreaView>
    );
  }

  if (!crumb) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <View style={[styles.header, { borderBottomColor: borderColor }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <IconSymbol name="chevron.left" size={24} color={headerTextColor} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: headerTextColor }]}>
            not found
          </Text>
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>
    );
  }

  // Format date in lowercase like DateBar
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const months = [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
    ];
    const month = months[date.getMonth()];
    const day = date.getDate();

    const getOrdinalSuffix = (day: number) => {
      if (day > 3 && day < 21) return "th";
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    return `${month} ${day}${getOrdinalSuffix(day)}`;
  };

  const saveIconColor = hasChanges ? headerTextColor : "#8e8e93";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: borderColor }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={headerTextColor} />
        </TouchableOpacity>
        <View style={styles.headerSpacer} />
        <TouchableOpacity
          onPress={handleSave}
          style={styles.saveButton}
          disabled={!hasChanges}
        >
          <IconSymbol
            name="square.and.pencil"
            size={28}
            color={saveIconColor}
          />
        </TouchableOpacity>
      </View>

      {/* Editable Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        keyboardDismissMode="on-drag"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.contentWrapper}>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: inputBackgroundColor,
                  color: textColor,
                  borderColor,
                },
              ]}
              value={content}
              onChangeText={handleContentChange}
              placeholder="what's on your mind?"
              placeholderTextColor={placeholderColor}
              multiline
              textAlignVertical="top"
            />

            {/* Delete Button */}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
            >
              <IconSymbol name="trash" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  headerSpacer: {
    flex: 1,
  },
  saveButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  contentWrapper: {
    flex: 1,
  },
  textInput: {
    fontSize: 16,
    lineHeight: 24,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 120,
    maxHeight: 400,
  },
  deleteButton: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#c74440",
  },
});
