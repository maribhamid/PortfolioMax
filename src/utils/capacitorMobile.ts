import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { App as CapApp } from '@capacitor/app';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export function isNativeMobile(): boolean {
  return typeof window !== 'undefined' && Capacitor.isNativePlatform();
}

export async function triggerHaptic(style: ImpactStyle = ImpactStyle.Light): Promise<void> {
  if (isNativeMobile()) {
    try {
      await Haptics.impact({ style });
    } catch {
      // ignore
    }
  }
}

export async function initCapacitorNativeMobile(options?: {
  onBackButton?: () => boolean; // return true if the back action was consumed by a modal/admin view
}): Promise<void> {
  if (!isNativeMobile()) return;

  // 1. Configure Native Status Bar
  try {
    await StatusBar.setStyle({ style: Style.Dark });
    if (Capacitor.getPlatform() === 'android') {
      await StatusBar.setBackgroundColor({ color: '#090a0f' });
      await StatusBar.setOverlaysWebView({ overlay: false });
    }
  } catch (err) {
    console.warn('StatusBar configuration notice:', err);
  }

  // 2. Dismiss Splash Screen
  try {
    await SplashScreen.hide();
  } catch (err) {
    console.warn('SplashScreen hide notice:', err);
  }

  // 3. Android Hardware Back Button Handling
  try {
    CapApp.addListener('backButton', ({ canGoBack }) => {
      if (options?.onBackButton) {
        const handled = options.onBackButton();
        if (handled) return;
      }
      if (canGoBack) {
        window.history.back();
      } else {
        CapApp.exitApp();
      }
    });
  } catch (err) {
    console.warn('Android backButton listener notice:', err);
  }
}
