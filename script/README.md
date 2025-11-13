# Scripts Directory

This directory contains utility scripts for development and maintenance tasks.

## Directory Structure

```
script/
├── README.md                    # This file
├── collect-all-files.sh        # Main collection script
└── collected/                  # Output directory (git-ignored)
    ├── collected_files_YYYYMMDD_HHMMSS.txt
    └── latest.txt              # Symlink to latest collection
```

## Available Scripts

### 📦 collect-all-files.sh

Collects all source files from `src/` directory into a single timestamped file.

**Usage:**
```bash
# From project root
bash script/collect-all-files.sh

# Or make it executable and run directly
chmod +x script/collect-all-files.sh
./script/collect-all-files.sh
```

**Output:**
- Creates timestamped file: `script/collected/collected_files_YYYYMMDD_HHMMSS.txt`
- Updates symlink: `script/collected/latest.txt` (points to latest collection)
- Displays summary with success/missing files count

**Features:**
- ✅ Collects 57 files from src/ directory
- ✅ Timestamped outputs (no overwriting)
- ✅ Progress indicator
- ✅ Missing files detection
- ✅ Summary report
- ✅ Latest symlink for quick access

## Output Directory

The `collected/` directory is git-ignored to prevent committing large collection files. All outputs are stored here with timestamps for version tracking.

## Notes

- Old scripts (`collect-files.sh`, `collected_files.txt`) in root are deprecated
- All new scripts should be added to this directory
- All script outputs should go to `collected/` subdirectory