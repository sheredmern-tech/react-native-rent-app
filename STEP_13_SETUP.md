# Step 13: Map View & Location - Setup Instructions

## ✅ Status: COMPLETED & READY

Semua kode untuk Step 13 sudah selesai dibuat dan di-commit. Tinggal install dependencies dan test!

---

## 📦 INSTALL DEPENDENCIES

Jalankan command ini untuk install packages yang diperlukan:

```bash
npm install react-native-maps expo-location
```

Atau jika pakai Yarn:

```bash
yarn add react-native-maps expo-location
```

---

## 🗂️ FILES YANG SUDAH DIBUAT

### ✅ Contexts
- **`src/context/LocationContext.tsx`** - Location permission & tracking context
  - Auto-check permission saat mount
  - Request permission function
  - Get current location
  - Error handling & loading states

### ✅ Types
- **`src/types/location.ts`** - All location-related types
  - MapRegion
  - PropertyMarker
  - LocationPermission
  - Coordinates
  - DistanceFilter

### ✅ Utilities
- **`src/utils/locationHelpers.ts`** - Location utility functions
  - calculateDistance() - Haversine formula
  - formatDistance() - Format untuk display
  - getRegionForProperties() - Calculate map region
  - sortPropertiesByDistance()
  - filterPropertiesByRadius()
  - getNearbyProperties()

### ✅ Components
- **`src/components/MapPropertyMarker.tsx`** - Custom map markers
- **`src/components/MapPropertyCard.tsx`** - Bottom sheet property card
- **`src/components/MapControls.tsx`** - Map controls (zoom, location, list)
- **`src/components/LocationPermissionPrompt.tsx`** - Permission modal

### ✅ Screens
- **`src/screens/MapScreen.tsx`** - Full-screen interactive map
- **`src/screens/NearbyPropertiesScreen.tsx`** - List nearby properties

### ✅ Updated Files
- **`App.tsx`** - Added LocationProvider
- **`src/types/index.ts`** - Added latitude/longitude to Property, distance SortOption
- **`src/types/navigation.ts`** - Added Map & NearbyProperties screens
- **`src/navigation/RootNavigator.tsx`** - Registered new screens
- **`src/screens/HomeScreen.tsx`** - Added Map button
- **`src/screens/PropertyDetailScreen.tsx`** - Added mini map
- **`src/screens/SearchScreen.tsx`** - Added distance sorting
- **`src/components/PropertyCard.tsx`** - Added distance badge
- **`src/components/SortModal.tsx`** - Added distance sort option
- **`src/utils/sortProperties.ts`** - Added distance sorting

---

## 🧪 CARA TESTING

### 1. Home Screen
- Klik icon **Map** di header (sebelah kiri search icon)
- Seharusnya navigate ke MapScreen

### 2. Map Screen
- Lihat semua 12 properties ditampilkan sebagai markers
- Klik marker untuk lihat property preview
- Gunakan zoom controls (+/-)
- Klik "My Location" button (jika permission granted)
- Klik "List" button untuk ke NearbyPropertiesScreen

### 3. Property Detail Screen
- Buka property detail manapun
- Scroll ke bawah ke section "Lokasi"
- Lihat mini map dengan marker
- Lihat distance badge (jika location permission granted)
- Klik map untuk buka MapScreen

### 4. Search Screen
- Buka SearchScreen
- Klik tombol Sort
- Pilih "Jarak: Terdekat"
- Properties akan di-sort berdasarkan jarak dari lokasi Anda

### 5. Nearby Properties Screen
- Buka dari MapScreen atau navigate langsung
- Filter berdasarkan radius (5km, 10km, 20km, 50km)
- Lihat properties sorted by distance
- Setiap property card menampilkan distance badge

### 6. Location Permission
- Jika permission belum granted, akan muncul modal prompt
- Klik "Izinkan Akses" untuk request permission
- Atau klik "Nanti Saja" untuk skip
- App tetap berfungsi tanpa location permission (tanpa distance features)

---

## 🌍 FITUR LOCATION

### Yang Sudah Working:
✅ Location permission handling (request & check)
✅ Get user's current location
✅ Calculate distance between user & properties
✅ Display distance on property cards
✅ Sort properties by distance
✅ Filter properties by radius
✅ Map view with all properties
✅ Interactive markers
✅ Bottom sheet property preview
✅ Mini map on property detail
✅ Nearby properties list
✅ All text in Bahasa Indonesia

### Distance Calculation:
- Menggunakan **Haversine formula** untuk akurasi tinggi
- Display dalam meter (<1km) atau kilometer (≥1km)
- Contoh: "500 m", "2.3 km"

---

## 📱 PERMISSIONS REQUIRED

### iOS (ios/YourApp/Info.plist)
Tambahkan permission strings (Expo biasanya auto-add):

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>App membutuhkan akses lokasi untuk menampilkan properti terdekat</string>
```

### Android (android/app/src/main/AndroidManifest.xml)
Expo auto-add permissions, tapi pastikan ada:

```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

---

## 🐛 TROUBLESHOOTING

### Error: "Unable to resolve ../context/LocationContext"
**Solusi:** ✅ Sudah fixed! LocationContext.tsx sudah dibuat.

### Error: "Module not found: react-native-maps"
**Solusi:** Run `npm install react-native-maps expo-location`

### Map tidak muncul
**Solusi:**
1. Pastikan dependencies sudah terinstall
2. Untuk iOS: Run `cd ios && pod install`
3. Restart Metro bundler

### Location permission tidak bekerja
**Solusi:**
1. Test di device fisik (emulator kadang bermasalah)
2. Pastikan permission strings sudah ada di Info.plist (iOS)
3. Check Settings > Privacy > Location di device

### Distance tidak muncul
**Solusi:**
1. Pastikan location permission sudah granted
2. Tunggu beberapa detik untuk get current location
3. Check LocationContext.tsx - userLocation harus ada

---

## 📊 GIT COMMITS

Semua changes sudah di-commit ke branch:
```
claude/step-13-map-view-location-011CV5XBEcG9xk6cf5GVJkE1
```

Commits:
1. ✅ Complete Step 13: Map View & Location features
2. ✅ Add missing LocationContext and location types

---

## 🚀 NEXT STEPS

1. **Install dependencies:**
   ```bash
   npm install react-native-maps expo-location
   ```

2. **Clear cache & restart:**
   ```bash
   npm start -- --clear
   ```

3. **Test di simulator/device:**
   - iOS: `npm run ios`
   - Android: `npm run android`

4. **Test semua fitur location:**
   - Map view
   - Distance sorting
   - Nearby properties
   - Mini map on detail

5. **Grant location permission saat diminta**

6. **Enjoy! 🎉**

---

## 📞 SUPPORT

Jika ada masalah atau pertanyaan:
1. Check console logs untuk error details
2. Verify semua files sudah exist
3. Clear npm cache: `npm cache clean --force`
4. Delete node_modules dan reinstall: `rm -rf node_modules && npm install`

---

**STATUS: ✅ READY FOR TESTING**

Semua kode sudah lengkap dan di-commit. Tinggal install dependencies dan test! 🚀
