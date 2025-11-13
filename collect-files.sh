#!/bin/bash

# ============================================
# Script: Collect ALL files from src folder
# Output: collected_files.txt
# ============================================

OUTPUT_FILE="collected_files.txt"
BASE_DIR="d:/REACT-NATIVE/src"

# Hapus file output lama
rm -f "$OUTPUT_FILE"

echo "================================================" | tee "$OUTPUT_FILE"
echo "COLLECTING ALL FILES FROM: $BASE_DIR" | tee -a "$OUTPUT_FILE"
echo "Date: $(date)" | tee -a "$OUTPUT_FILE"
echo "================================================" | tee -a "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# ===== SEMUA FILE LENGKAP =====
FILES=(
    # === COMPONENTS (20 files) ===
    "components/ComparisonButton.tsx"
    "components/ComparisonRow.tsx"
    "components/ContactMethodButton.tsx"
    "components/ContactOwnerModal.tsx"
    "components/EmptyState.tsx"
    "components/FilterButton.tsx"
    "components/FilterChip.tsx"
    "components/ImageCarousel.tsx"
    "components/ImageThumbnailGrid.tsx"
    "components/ImageViewerModal.tsx"
    "components/index.ts"
    "components/LoadingSpinner.tsx"
    "components/LocationPermissionPrompt.tsx"
    "components/MapControls.tsx"
    "components/MapPropertyCard.tsx"
    "components/MapPropertyMarker.tsx"
    "components/MenuButton.tsx"
    "components/OwnerCard.tsx"
    "components/PropertyCard.tsx"
    "components/SearchBar.tsx"
    "components/SettingItem.tsx"
    "components/SortModal.tsx"
    
    # === CONSTANTS (4 files) ===
    "constants/animations.ts"
    "constants/colors.ts"
    "constants/fonts.ts"
    "constants/index.ts"
    
    # === CONTEXT (4 files) ===
    "context/ComparisonContext.tsx"
    "context/FavoritesContext.tsx"
    "context/LocationContext.tsx"
    "context/UserContext.tsx"
    
    # === DATA (2 files) ===
    "data/index.ts"
    "data/mockProperties.ts"
    
    # === NAVIGATION (2 files) ===
    "navigation/index.ts"
    "navigation/RootNavigator.tsx"
    
    # === SCREENS (14 files) ===
    "screens/AboutScreen.tsx"
    "screens/ComparisonScreen.tsx"
    "screens/EditProfileScreen.tsx"
    "screens/FavoritesScreen.tsx"
    "screens/HomeScreen.tsx"
    "screens/index.ts"
    "screens/MapScreen.tsx"
    "screens/NearbyPropertiesScreen.tsx"
    "screens/PrivacyScreen.tsx"
    "screens/ProfileScreen.tsx"
    "screens/PropertyDetailScreen.tsx"
    "screens/SearchScreen.tsx"
    "screens/SettingsScreen.tsx"
    "screens/TermsScreen.tsx"
    
    # === TYPES (4 files) ===
    "types/comparison.ts"
    "types/index.ts"
    "types/location.ts"
    "types/navigation.ts"
    
    # === UTILS (4 files) ===
    "utils/comparisonHelpers.ts"
    "utils/imageHelpers.ts"
    "utils/locationHelpers.ts"
    "utils/sortProperties.ts"
)

# Counter
TOTAL_FILES=${#FILES[@]}
SUCCESS_COUNT=0
FAILED_COUNT=0
FAILED_FILES=()

echo "Total files to collect: $TOTAL_FILES" | tee -a "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Loop semua file
for FILE in "${FILES[@]}"; do
    FULL_PATH="$BASE_DIR/$FILE"
    
    if [ -f "$FULL_PATH" ]; then
        echo "" >> "$OUTPUT_FILE"
        echo "====================================================" >> "$OUTPUT_FILE"
        echo "FILE: $FILE" >> "$OUTPUT_FILE"
        echo "====================================================" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
        
        # Tambahkan isi file
        cat "$FULL_PATH" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
        
        ((SUCCESS_COUNT++))
        echo "✓ [$SUCCESS_COUNT/$TOTAL_FILES] $FILE"
    else
        ((FAILED_COUNT++))
        FAILED_FILES+=("$FILE")
        echo "✗ [$((SUCCESS_COUNT + FAILED_COUNT))/$TOTAL_FILES] MISSING: $FILE"
    fi
done

# Summary
echo "" | tee -a "$OUTPUT_FILE"
echo "====================================================" | tee -a "$OUTPUT_FILE"
echo "COLLECTION SUMMARY" | tee -a "$OUTPUT_FILE"
echo "====================================================" | tee -a "$OUTPUT_FILE"
echo "Total files: $TOTAL_FILES" | tee -a "$OUTPUT_FILE"
echo "Collected: $SUCCESS_COUNT ✓" | tee -a "$OUTPUT_FILE"
echo "Missing: $FAILED_COUNT ✗" | tee -a "$OUTPUT_FILE"
echo "" | tee -a "$OUTPUT_FILE"

if [ $FAILED_COUNT -gt 0 ]; then
    echo "MISSING FILES:" | tee -a "$OUTPUT_FILE"
    for MISSING in "${FAILED_FILES[@]}"; do
        echo "  - $MISSING" | tee -a "$OUTPUT_FILE"
    done
    echo "" | tee -a "$OUTPUT_FILE"
fi

echo "====================================================" | tee -a "$OUTPUT_FILE"
echo "OUTPUT: $OUTPUT_FILE" | tee -a "$OUTPUT_FILE"
echo "====================================================" | tee -a "$OUTPUT_FILE"

# Done
if [ $FAILED_COUNT -eq 0 ]; then
    echo ""
    echo "🎉 SUCCESS! All $SUCCESS_COUNT files collected!"
else
    echo ""
    echo "⚠️  WARNING! $FAILED_COUNT files missing!"
fi