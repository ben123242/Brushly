import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { colors, fonts, radii, shadows, spacing, typography } from "../theme";
import PrimaryButton from "../components/PrimaryButton";
import { processPickedImage, ProcessedPhoto } from "../utils/imageProcessing";

type Props = NativeStackScreenProps<RootStackParamList, "Capture">;

function mediumLabel(medium: string): string {
  return medium.charAt(0).toUpperCase() + medium.slice(1);
}

export default function CaptureScreen({ navigation, route }: Props) {
  const { medium, skillLevel } = route.params;
  const [photo, setPhoto] = useState<ProcessedPhoto | null>(null);
  const [processing, setProcessing] = useState(false);

  async function takePhoto() {
    if (processing) return;
    setProcessing(true);
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          "Camera access needed",
          "Enable camera access in Settings to take a photo."
        );
        return;
      }
      // Skip the picker's own base64 encode (slow for a full-resolution camera
      // capture) — we resize + re-encode ourselves in processPickedImage.
      const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
      if (result.canceled || !result.assets?.[0]) return;
      const asset = result.assets[0];
      const processed = await processPickedImage(asset.uri, asset.width);
      setPhoto(processed);
    } catch (error) {
      console.error("Failed to take photo", error);
      Alert.alert(
        "Couldn't open the camera",
        "Something went wrong while opening the camera. Please try again."
      );
    } finally {
      setProcessing(false);
    }
  }

  async function chooseFromLibrary() {
    if (processing) return;
    setProcessing(true);
    try {
      // On Android, launchImageLibraryAsync uses the system Photo Picker,
      // which needs no runtime permission — requesting one first can return
      // a false "denied" in some setups and block the picker from opening.
      // Media library permission is only required on iOS.
      if (Platform.OS === "ios") {
        const permission =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
          Alert.alert(
            "Photo library access needed",
            "Enable photo library access in Settings to choose a photo."
          );
          return;
        }
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });
      if (result.canceled || !result.assets?.[0]) return;
      const asset = result.assets[0];
      const processed = await processPickedImage(asset.uri, asset.width);
      setPhoto(processed);
    } catch (error) {
      console.error("Failed to open photo library", error);
      Alert.alert(
        "Couldn't open your photos",
        "Something went wrong while opening your photo library. Please try again."
      );
    } finally {
      setProcessing(false);
    }
  }

  function analyze() {
    if (!photo) return;
    navigation.navigate("Results", {
      photoUri: photo.uri,
      base64: photo.base64,
      mimeType: photo.mimeType,
      medium,
      skillLevel,
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={typography.title}>Add a Photo</Text>
        <Text style={typography.subtitle}>
          Painting in {mediumLabel(medium)}. Take a photo of a scene, or
          choose one from your library.
        </Text>
      </View>

      <View style={styles.previewArea}>
        {photo ? (
          <Image source={{ uri: photo.uri }} style={styles.preview} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>No photo yet</Text>
          </View>
        )}
        {processing && (
          <View style={styles.processingOverlay}>
            <ActivityIndicator color={colors.gold} size="large" />
            <Text style={styles.processingText}>Preparing your photo…</Text>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        <PrimaryButton
          label={photo ? "Retake Photo" : "Take a Photo"}
          onPress={takePhoto}
          variant={photo ? "secondary" : "primary"}
          disabled={processing}
        />
        <PrimaryButton
          label="Choose from Library"
          onPress={chooseFromLibrary}
          variant="secondary"
          disabled={processing}
        />
        {photo && (
          <PrimaryButton
            label="Analyze This Scene"
            onPress={analyze}
            disabled={processing}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  header: {
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  previewArea: {
    flex: 1,
    marginBottom: spacing.lg,
  },
  preview: {
    flex: 1,
    borderRadius: radii.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  placeholder: {
    flex: 1,
    borderRadius: radii.xl,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    fontFamily: fonts.body,
    color: colors.textMuted,
    fontSize: 15,
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radii.xl,
    backgroundColor: "rgba(11, 11, 13, 0.75)",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  processingText: {
    fontFamily: fonts.bodyMedium,
    color: colors.textPrimary,
    fontSize: 14,
  },
  actions: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
});
