import React, { useState } from "react";
import {
  Alert,
  Image,
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

type Props = NativeStackScreenProps<RootStackParamList, "Capture">;

interface PickedPhoto {
  uri: string;
  base64: string;
  mimeType: string;
}

function mediumLabel(medium: string): string {
  return medium.charAt(0).toUpperCase() + medium.slice(1);
}

export default function CaptureScreen({ navigation, route }: Props) {
  const { medium } = route.params;
  const [photo, setPhoto] = useState<PickedPhoto | null>(null);

  async function takePhoto() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Camera access needed",
        "Enable camera access in Settings to take a photo."
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      base64: true,
    });
    handlePickerResult(result);
  }

  async function chooseFromLibrary() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Photo library access needed",
        "Enable photo library access in Settings to choose a photo."
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      base64: true,
    });
    handlePickerResult(result);
  }

  function handlePickerResult(result: ImagePicker.ImagePickerResult) {
    if (result.canceled || !result.assets?.[0]?.base64) return;
    const asset = result.assets[0];
    setPhoto({
      uri: asset.uri,
      base64: asset.base64 as string,
      mimeType: asset.mimeType ?? "image/jpeg",
    });
  }

  function analyze() {
    if (!photo) return;
    navigation.navigate("Results", {
      photoUri: photo.uri,
      base64: photo.base64,
      mimeType: photo.mimeType,
      medium,
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
      </View>

      <View style={styles.actions}>
        <PrimaryButton
          label={photo ? "Retake Photo" : "Take a Photo"}
          onPress={takePhoto}
          variant={photo ? "secondary" : "primary"}
        />
        <PrimaryButton
          label="Choose from Library"
          onPress={chooseFromLibrary}
          variant="secondary"
        />
        {photo && (
          <PrimaryButton label="Analyze This Scene" onPress={analyze} />
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
  actions: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
});
