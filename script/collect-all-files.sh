#!/bin/bash

# ============================================
# Script: Collect ALL files from src folder
# Output: script/collected/collected_files_[timestamp].txt
# ============================================

# Konfigurasi paths
BASE_DIR="d:/REACT-NATIVE/src"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COLLECTED_DIR="$SCRIPT_DIR/collected"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
OUTPUT_FILE="$COLLECTED_DIR/collected_files_${TIMESTAMP}.txt"

# Buat folder collected jika belum ada
mkdir -p "$COLLECTED_DIR"

echo "================================================"
echo "COLLECTING ALL FILES FROM: $BASE_DIR"
echo "Output: $OUTPUT_FILE"
echo "================================================"
echo ""

# Mulai tulis ke file
{
    echo "================================================"
    echo "COLLECTING ALL FILES FROM: $BASE_DIR"
    echo "Generated: $(date '+%Y-%m-%d %H:%M:%S')"
    echo "================================================"
    echo ""
} > "$OUTPUT_FILE"

# ===== SEMUA FILE LENGKAP =====
FILES=(
    # === COMPONENTS (22 files) ===
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
    
    # === UTILS (5 files) ===
    "utils/comparisonHelpers.ts"
    "utils/formatters.ts"
    "utils/imageHelpers.ts"
    "utils/locationHelpers.ts"
    "utils/sortProperties.ts"
)

# Counter
TOTAL_FILES=${#FILES[@]}
SUCCESS_COUNT=0
FAILED_COUNT=0
FAILED_FILES=()

echo "Total files to collect: $TOTAL_FILES"
echo ""

{
    echo "Total files to collect: $TOTAL_FILES"
    echo ""
} >> "$OUTPUT_FILE"

# Loop semua file
for FILE in "${FILES[@]}"; do
    FULL_PATH="$BASE_DIR/$FILE"
    
    if [ -f "$FULL_PATH" ]; then
        {
            echo ""
            echo "====================================================="
            echo "FILE: $FILE"
            echo "====================================================="
            echo ""
            cat "$FULL_PATH"
            echo ""
        } >> "$OUTPUT_FILE"
        
        ((SUCCESS_COUNT++))
        echo "✓ [$SUCCESS_COUNT/$TOTAL_FILES] $FILE"
    else
        ((FAILED_COUNT++))
        FAILED_FILES+=("$FILE")
        echo "✗ [$((SUCCESS_COUNT + FAILED_COUNT))/$TOTAL_FILES] MISSING: $FILE"
    fi
done

# Summary
echo ""
echo "====================================================="
echo "COLLECTION SUMMARY"
echo "====================================================="
echo "Total files: $TOTAL_FILES"
echo "Collected: $SUCCESS_COUNT ✓"
echo "Missing: $FAILED_COUNT ✗"
echo ""

{
    echo ""
    echo "====================================================="
    echo "COLLECTION SUMMARY"
    echo "====================================================="
    echo "Total files: $TOTAL_FILES"
    echo "Collected: $SUCCESS_COUNT ✓"
    echo "Missing: $FAILED_COUNT ✗"
    echo ""
} >> "$OUTPUT_FILE"

if [ $FAILED_COUNT -gt 0 ]; then
    echo "MISSING FILES:"
    {
        echo "MISSING FILES:"
    } >> "$OUTPUT_FILE"
    
    for MISSING in "${FAILED_FILES[@]}"; do
        echo "  - $MISSING"
        echo "  - $MISSING" >> "$OUTPUT_FILE"
    done
    echo ""
    echo "" >> "$OUTPUT_FILE"
fi

{
    echo "====================================================="
    echo "OUTPUT: $OUTPUT_FILE"
    echo "====================================================="
} >> "$OUTPUT_FILE"

# Done
echo "====================================================="
echo "OUTPUT SAVED TO:"
echo "$OUTPUT_FILE"
echo "====================================================="
echo ""

if [ $FAILED_COUNT -eq 0 ]; then
    echo "🎉 SUCCESS! All $SUCCESS_COUNT files collected!"
else
    echo "⚠️  WARNING! $FAILED_COUNT files missing!"
fi

# Buat symlink ke latest
LATEST_LINK="$COLLECTED_DIR/latest.txt"
rm -f "$LATEST_LINK"
ln -sf "$(basename "$OUTPUT_FILE")" "$LATEST_LINK" 2>/dev/null || cp "$OUTPUT_FILE" "$LATEST_LINK"

echo ""
echo "Latest collection available at: $LATEST_LINK"