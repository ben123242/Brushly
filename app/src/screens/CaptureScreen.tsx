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
import { waitForNativeUiToOpen, withTimeout } from "../utils/nativePickerTimeout";

type Props = NativeStackScreenProps<RootStackParamList, "Capture">;

// How long we wait for the camera/library Activity to actually take over the
// screen before concluding it silently failed to open (see nativePickerTimeout.ts).
const PICKER_OPEN_TIMEOUT_MS = 3000;
// Generous last-resort ceiling on the permission check itself, in case that
// promise never settles -- much longer than PICKER_OPEN_TIMEOUT_MS since the
// user may need real time to read and respond to a system permission dialog.
const PERMISSION_TIMEOUT_MS = 30000;
// Final safety net once we know the camera/library genuinely opened: long
// enough to never bother someone actually using it, but bounded so a rare
// orphaned promise (Android can kill the app's activity while the camera is
// open under memory pressure, per expo-image-picker's own docs) can't leave
// the UI stuck forever either.
const PICKER_RESULT_TIMEOUT_MS = 5 * 60 * 1000;

function mediumLabel(medium: string): string {
  return medium.charAt(0).toUpperCase() + medium.slice(1);
}

function errorDetail(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

export default function CaptureScreen({ navigation, route }: Props) {
  const { medium, skillLevel } = route.params;
  const [photo, setPhoto] = useState<ProcessedPhoto | null>(null);
  const [processing, setProcessing] = useState(false);

  async function takePhoto() {
    if (processing) return;
    setProcessing(true);
    try {
      const permission = await withTimeout(
        ImagePicker.requestCameraPermissionsAsync(),
        PERMISSION_TIMEOUT_MS,
        "Checking camera permission took too long. Please try again."
      );
      if (!permission.granted) {
        Alert.alert(
          "Camera access needed",
          permission.canAskAgain
            ? "Brushly needs camera access to take a photo. Please allow it and try again."
            : "Camera access is turned off for Brushly. Enable it in your device Settings > Apps > Brushly > Permissions."
        );
        return;
      }

      // Skip the picker's own base64 encode (slow for a full-resolution camera
      // capture) — we resize + re-encode ourselves in processPickedImage.
      const launchPromise = ImagePicker.launchCameraAsync({ quality: 0.8 });
      // Avoid an unhandled-rejection warning if this settles after we've
      // already bailed out via the timeout branch below.
      launchPromise.catch(() => {});

      // Don't race the whole picker call against the timeout — it only
      // resolves once the user finishes, which could legitimately take a
      // while. Instead, wait for either a result OR clear evidence the
      // camera actually opened (the app leaving the foreground); only if
      // NEITHER happens do we conclude it silently failed to launch.
      await Promise.race([
        launchPromise,
        waitForNativeUiToOpen(
          PICKER_OPEN_TIMEOUT_MS,
          'The camera didn\'t open. This can happen if no camera app is available on this device, or if camera access is blocked at the system level. Try again, or use "Choose from Library" instead.'
        ),
      ]);

      const result = await withTimeout(
        launchPromise,
        PICKER_RESULT_TIMEOUT_MS,
        "This is taking unusually long. Please try again."
      );
      if (result.canceled || !result.assets?.[0]) return;
      const asset = result.assets[0];
      const processed = await processPickedImage(asset.uri, asset.width);
      setPhoto(processed);
    } catch (error) {
      console.error("Failed to take photo", error);
      Alert.alert("Couldn't open the camera", errorDetail(error));
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
        const permission = await withTimeout(
          ImagePicker.requestMediaLibraryPermissionsAsync(),
          PERMISSION_TIMEOUT_MS,
          "Checking photo library permission took too long. Please try again."
        );
        if (!permission.granted) {
          Alert.alert(
            "Photo library access needed",
            "Enable photo library access in Settings to choose a photo."
          );
          return;
        }
      }

      const launchPromise = ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });
      launchPromise.catch(() => {});

      await Promise.race([
        launchPromise,
        waitForNativeUiToOpen(
          PICKER_OPEN_TIMEOUT_MS,
          "Your photo library didn't open. Please try again, or take a photo instead."
        ),
      ]);

      const result = await withTimeout(
        launchPromise,
        PICKER_RESULT_TIMEOUT_MS,
        "This is taking unusually long. Please try again."
      );
      if (result.canceled || !result.assets?.[0]) return;
      const asset = result.assets[0];
      const processed = await processPickedImage(asset.uri, asset.width);
      setPhoto(processed);
    } catch (error) {
      console.error("Failed to open photo library", error);
      Alert.alert("Couldn't open your photos", errorDetail(error));
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
