import { AppState } from "react-native";

/** Races `promise` against a flat timeout, as a last-resort guard against it never settling at all. */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutMessage: string
): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}

/**
 * Resolves the instant the app leaves the foreground -- which is what
 * happens right when a native camera/picker Activity takes over the screen
 * on Android -- or rejects with `timeoutMessage` if that hasn't happened
 * within `timeoutMs`.
 *
 * This is deliberately NOT a timeout on the picker's own promise: that
 * promise only resolves once the user finishes (takes a photo / picks one /
 * cancels), so racing it against a flat timeout would fire a false error
 * while someone is still legitimately framing a shot. Watching for the
 * foreground->background transition instead means the timeout only fires
 * when the picker genuinely never opened -- which is the actual bug this
 * guards against (some Android devices/OEMs leave expo-image-picker's
 * promise permanently unsettled if it fails to launch the camera intent or
 * the system Photo Picker).
 */
export function waitForNativeUiToOpen(
  timeoutMs: number,
  timeoutMessage: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    let settled = false;

    function finish(action: () => void) {
      if (settled) return;
      settled = true;
      subscription.remove();
      clearTimeout(timer);
      action();
    }

    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "background" || state === "inactive") {
        finish(resolve);
      }
    });

    const timer = setTimeout(() => {
      finish(() => reject(new Error(timeoutMessage)));
    }, timeoutMs);
  });
}
