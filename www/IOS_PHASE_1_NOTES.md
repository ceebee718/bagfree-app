# BagFree iOS Prep - Phase 1 Notes

## Confirmed
- Capacitor iOS wrapper created.
- Existing web platform loads inside iOS shell.
- Core app transfers into mobile wrapper better than expected.

## Issues Found
- Safe area / notch spacing needs mobile adjustment.
- Some sections use horizontal layouts that should stack on mobile.
- Loading/hero layout needs cleanup for smaller screens.
- External links need a defined in-app vs Safari policy.
- Stripe/payment flows need validation on device.
- App Store compliance review still needed for web-wrapper risk.

## Commerce Notes
- Marketplace appears focused on physical goods/vendor services.
- Stripe may be acceptable if purchases are physical goods/services fulfilled outside the app.
- Need avoid presenting digital content/subscriptions as in-app-consumed digital goods.

## Next
- Fix safe area CSS.
- Fix mobile stacking layout.
- Test login/account/vendor/shop/checkout flows.
- Prepare App Store asset requirements.
