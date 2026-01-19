# Mobile Camera Testing Guide

## Overview

The LoveWords button editor now supports taking photos directly with the device camera on mobile devices. This feature uses the HTML5 `capture` attribute and requires testing on real devices.

## Camera Implementation

### Technical Details

- **Desktop**: Only "Upload Image" button visible
- **Mobile**: Both "Take Photo" and "Upload Image" buttons visible
- **Input attribute**: `capture="environment"` opens rear camera by default
- **Fallback**: If camera access fails, users can still upload from device storage

### Mobile Detection

```typescript
function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}
```

Detects:
- iOS (iPhone, iPad, iPod)
- Android
- Other mobile browsers

## Testing Requirements

### Priority Platforms (Must Test)

1. **iOS Safari** (iPhone)
   - Most restrictive browser for camera permissions
   - Must test on real device (simulator doesn't support camera)
   - Versions: iOS 15+ recommended

2. **Android Chrome** (Android phone)
   - Most common Android browser
   - Test on real device
   - Versions: Chrome 90+ recommended

### Secondary Platforms (Should Test)

3. **iPad Safari**
   - Verify tablet experience
   - Larger screen different UX

4. **Android Firefox**
   - Alternative Android browser
   - Some users prefer Firefox

## Test Scenarios

### Happy Path

1. Navigate to custom board
2. Enter edit mode
3. Click empty cell
4. Click "Take Photo" button
5. **Expected**: Camera permission prompt appears
6. Grant camera access
7. **Expected**: Camera viewfinder opens
8. Take photo
9. **Expected**: Photo captured, optimized, and shown in preview
10. Click Save
11. **Expected**: Button appears with photo and label

### Camera Permissions

#### First Time (No Permission Yet)

1. Click "Take Photo"
2. **Expected**: Browser shows permission dialog
   - iOS: "LoveWords would like to access the camera"
   - Android: "Allow lovewords-web to take pictures and record video?"
3. Click "Allow" or "OK"
4. **Expected**: Camera opens

#### Permission Denied

1. Click "Take Photo"
2. **Expected**: Browser shows permission dialog
3. Click "Don't Allow" or "Block"
4. **Expected**: Error message or fallback to file upload

#### Permission Previously Denied

1. User previously denied camera access
2. Click "Take Photo"
3. **Expected**: Should show helpful message directing user to settings

### Edge Cases

1. **Device has no camera** (rare on phones)
   - **Expected**: Fall back to file upload gracefully

2. **Camera in use by another app**
   - **Expected**: Error message, offer file upload

3. **Multiple cameras** (front + rear)
   - **Expected**: Opens rear camera by default (`capture="environment"`)
   - User can switch cameras in native interface

4. **Photo too large**
   - Take high-resolution photo (12MP+)
   - **Expected**: Optimization reduces to 200×200px, <100KB

5. **Slow connection** (not applicable - localStorage only)
   - No network needed, should work offline

## Testing Checklist

### iOS Safari

- [ ] Camera permission prompt appears
- [ ] Grant permission → camera opens
- [ ] Deny permission → helpful message
- [ ] Take photo → optimization works
- [ ] Photo displays on button
- [ ] Photo persists after page reload
- [ ] Switch to front camera works (if user switches)
- [ ] Fallback to "Upload Image" works if camera fails

### Android Chrome

- [ ] Camera permission prompt appears
- [ ] Grant permission → camera opens
- [ ] Deny permission → helpful message
- [ ] Take photo → optimization works
- [ ] Photo displays on button
- [ ] Photo persists after page reload
- [ ] Switch cameras works
- [ ] Fallback to "Upload Image" works

### iPad Safari

- [ ] Detects as mobile (shows "Take Photo")
- [ ] Camera works on iPad with camera
- [ ] Fallback works on iPad without camera (older models)

### Android Firefox

- [ ] Camera permission prompt appears
- [ ] Take photo → optimization works
- [ ] Photo displays correctly

## Common Issues & Solutions

### iOS Safari: "Camera won't open"

**Cause**: User previously denied permission
**Solution**: Settings → Safari → Camera → Allow for this site

### Android: "Camera permission denied"

**Cause**: Browser doesn't have camera permission
**Solution**: Settings → Apps → Chrome → Permissions → Camera → Allow

### "Take Photo button doesn't appear"

**Cause**: Desktop browser or mobile detection failed
**Solution**:
- Verify user agent string
- Check mobile detection function
- Test on real device (not desktop browser resized)

### "Photo appears rotated"

**Cause**: EXIF orientation not handled
**Solution**: This is expected behavior, optimization may strip EXIF data
**Note**: Canvas API automatically corrects most orientation issues

### "File size still large after optimization"

**Cause**: High-resolution photo, complex image
**Solution**:
- Check optimization settings (200×200px, 80% quality)
- Log actual size: `(dataUrl.length * 3) / 4 / 1024` KB
- Target is <100KB, but 100-150KB is acceptable

## Performance Benchmarks

### Optimization Times (Expected)

| Photo Size | Device | Optimization Time |
|------------|--------|-------------------|
| 3MB (12MP) | iPhone 12 | ~500ms |
| 5MB (16MP) | Pixel 6 | ~700ms |
| 8MB (20MP) | Galaxy S21 | ~900ms |

**Note**: Optimization happens in browser (Canvas API), no server needed.

## Deployment Notes

### HTTPS Required

Camera access **requires HTTPS** in production:
- `http://` → Camera blocked by browser
- `https://` → Camera allowed (with permission)
- `localhost` → Camera allowed (development only)

### PWA Considerations

If deploying as PWA (Progressive Web App):
- Add `camera` to permissions in manifest.json
- Test installed PWA separately from browser

### localStorage Limits

- 5-10MB localStorage limit (browser-dependent)
- At 200×200px, ~50-100 photos fit in typical limit
- Consider warning at 80% capacity (future enhancement)

## Testing Tools

### Desktop Development

**Cannot fully test camera on desktop**, but can test:
- Mobile detection (spoof user agent)
- File upload flow
- Image optimization
- Button display

### Real Device Required For:

- Camera permission prompts
- Camera viewfinder
- Front/rear camera switching
- Mobile-specific bugs

### Recommended Testing Setup

1. Connect phone to same network as dev machine
2. Run `npm run dev -- --host`
3. Access via phone: `https://<your-ip>:5173`
4. Test camera functionality

**Note**: May need to accept self-signed certificate warning on phone.

## Accessibility

- Camera button has `aria-label="Take photo with camera"`
- Disabled state when optimizing (prevents double-trigger)
- Error messages announced to screen readers
- Fallback to file upload always available

## Future Enhancements

- [ ] Switch camera button (front vs rear)
- [ ] Flash toggle
- [ ] Crop/edit photo before saving
- [ ] Multiple photo support (photo gallery per button)
- [ ] Video support (future consideration)

---

**Last Updated**: Sprint 2 Week 2 Day 11
**Next Steps**: Manual testing on iOS + Android devices
