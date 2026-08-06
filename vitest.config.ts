import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    exclude: [
      '**/node_modules/**',
      '**/.pnpm-store/**',
      '**/dist/**',
      '**/*BackendSecurity.test.ts',
      '**/*ProductionGate.test.ts',
      '**/*Deployment*.test.ts',
      '**/*ControlPlane.test.ts',
      '**/*Security.test.ts',
      '**/accessibilityRegression.test.ts',
      '**/giftCheckoutContract.test.ts',
      '**/giftFulfillmentV3.test.ts',
      '**/mobile*.test.ts',
      '**/nativeProjectVerification.test.ts',
      '**/realtimeCommunications.test.ts',
      '**/referralBasePass.test.ts',
      '**/storeReleaseManifest.test.ts',
      '**/pilotDeploymentWorkflow.test.ts',
      '**/chatPrivacyControls.test.ts',
    ],
  },
});
