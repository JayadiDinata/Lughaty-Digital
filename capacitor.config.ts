import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ac.id.uika.lughatydigital',
  appName: 'Lughaty Digital',
  webDir: 'www',
  server: {
    androidScheme: 'http',
    iosScheme: 'https',
    allowNavigation: [
      'translate.googleapis.com',
      'translate.google.com',
      'api.mymemory.translated.net',
    ]
  },
  ios: {
    contentInset: 'always',
    preferredContentMode: 'mobile'
  }
};

export default config;
