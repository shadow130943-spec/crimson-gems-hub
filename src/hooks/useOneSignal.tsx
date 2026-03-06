import { useEffect } from 'react';
import { useAuth } from './useAuth';

const ONESIGNAL_APP_ID = 'YOUR_ONESIGNAL_APP_ID'; // Will be replaced with env var

export function useOneSignal() {
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    const initOneSignal = async () => {
      // Wait for OneSignal SDK to load
      if (typeof window === 'undefined') return;

      const OneSignalModule = await import('react-onesignal').catch(() => null);
      if (!OneSignalModule) return;

      const OneSignal = OneSignalModule.default;

      try {
        await OneSignal.init({
          appId: ONESIGNAL_APP_ID,
          allowLocalhostAsSecureOrigin: true,
          serviceWorkerParam: { scope: '/' },
          serviceWorkerPath: '/OneSignalSDKWorker.js',
        });

        if (user) {
          await OneSignal.login(user.id);

          if (isAdmin) {
            await OneSignal.User.addTag('role', 'admin');
          }
        }
      } catch (err) {
        console.error('OneSignal init error:', err);
      }
    };

    initOneSignal();
  }, [user, isAdmin]);
}
