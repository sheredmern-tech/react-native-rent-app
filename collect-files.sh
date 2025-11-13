#!/bin/bash

# Script untuk mengumpulkan file dari d:\REACT-NATIVE\src
# Output: collected_files.txt

OUTPUT_FILE="collected_files.txt"
BASE_DIR="d:/REACT-NATIVE/src"

# Hapus file output jika sudah ada
rm -f "$OUTPUT_FILE"

# Array berisi semua file yang akan dikumpulkan
FILES=(
    "constants/colors.ts"
    "constants/fonts.ts"
    "constants/index.ts"
    "navigation/index.ts"
    "navigation/RootNavigator.tsx"
    "screens/HomeScreen.tsx"
    "screens/index.ts"
    "types/index.ts"
    "types/navigation.ts"
)

echo "Mengumpulkan file dari $BASE_DIR..." | tee -a "$OUTPUT_FILE"
echo "====================================================" | tee -a "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Loop melalui setiap file
for FILE in "${FILES[@]}"; do
    FULL_PATH="$BASE_DIR/$FILE"
    
    # Cek apakah file ada
    if [ -f "$FULL_PATH" ]; then
        echo "" >> "$OUTPUT_FILE"
        echo "================================================" >> "$OUTPUT_FILE"
        echo "File: $FILE" >> "$OUTPUT_FILE"
        echo "================================================" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
        
        # Tambahkan isi file
        cat "$FULL_PATH" >> "$OUTPUT_FILE"
        
        echo "" >> "$OUTPUT_FILE"
        echo "Berhasil: $FILE"
    else
        echo "Warning: File tidak ditemukan - $FILE"
    fi
done

echo ""
echo "Selesai! Semua file telah dikumpulkan ke: $OUTPUT_FILE"