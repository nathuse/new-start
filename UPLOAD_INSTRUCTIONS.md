# How to Add Images to Your Website

## Simple File-Based System

Since we're using a simple file-based approach without a server, here's how to add images:

## 1. Current Status

✅ **Gallery folder has images**: 3 images are currently loaded
- `c57f57e9-8e3a-4aab-abaf-7dcb3a4f8b95.jpg` - Construction Project 1
- `2025-08-04 22_43_08-TABU COMPANY PROFILE.docx (Protected View) - Word.png` - Company Profile  
- `photo_2025-08-04_17-33-00.jpg` - Construction Site

❌ **Equipment folder is empty**: No equipment images yet

## 2. Add Project Images (Gallery)

1. **Place your project images** in the `uploads/gallery/` folder
2. **Image formats supported**: JPG, PNG, GIF, WebP
3. **Recommended size**: 800x600 pixels or larger
4. **File naming**: Use descriptive names like `modern_office_building.jpg`

## 3. Add Equipment Images

1. **Place your equipment images** in the `uploads/equipment/` folder
2. **Image formats supported**: JPG, PNG, GIF, WebP
3. **Recommended size**: 600x400 pixels or larger
4. **File naming**: Use descriptive names like `excavator_heavy_duty.jpg`

## 4. How It Works

- **Main Website**: Automatically reads images from the uploads folders
- **Admin Panel**: Shows images from the respective folders
- **Gallery Button**: Displays all images from `uploads/gallery/` folder
- **Projects Section**: Shows images from `uploads/gallery/` folder
- **Equipment Section**: Shows images from `uploads/equipment/` folder

## 5. Folder Structure

```
uploads/
├── gallery/           # Project images (shown in Projects section)
│   ├── c57f57e9-8e3a-4aab-abaf-7dcb3a4f8b95.jpg
│   ├── 2025-08-04 22_43_08-TABU COMPANY PROFILE.docx (Protected View) - Word.png
│   └── photo_2025-08-04_17-33-00.jpg
└── equipment/         # Equipment images (currently empty)
```

## 6. Important Notes

- **Images must be physically placed** in the uploads folder
- **No automatic upload** through admin panel (keeps it simple)
- **Refresh the page** after adding new images
- **File names** should be descriptive and unique
- **System automatically detects** new images in folders

## 7. Example Files to Add

### Gallery Folder (`uploads/gallery/`)
- `construction_site_1.jpg`
- `office_building_complete.jpg`
- `residential_project.jpg`

### Equipment Folder (`uploads/equipment/`)
- `excavator_large.jpg`
- `crane_mobile.jpg`
- `bulldozer_heavy.jpg`

## 8. Troubleshooting

- **Images not showing?** Check if they're in the correct folder
- **Wrong folder?** Move images to the appropriate uploads subfolder
- **File format not supported?** Convert to JPG, PNG, GIF, or WebP
- **Page not updating?** Refresh the browser page
- **Still seeing old data?** Clear browser localStorage or use incognito mode

## 9. Current Working Images

The system is now working with your actual images from the uploads folder. No more sample data or 404 errors!

This simple approach keeps your website lightweight and easy to manage! 