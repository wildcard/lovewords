# Image Library Guide

This guide explains how to use the Image Library feature in LoveWords for managing button images across all your custom boards.

## Overview

The Image Library is a centralized storage system for button images that:

- **Stores images once**: Images are deduplicated using SHA-256 hashing
- **Tracks usage**: See which images are used by which buttons
- **Saves storage**: Shared images don't take up additional space
- **Easy management**: Browse, search, sort, and delete unused images

## Accessing the Image Library

### From Board Library

1. Click the **My Boards** button in the navigation bar
2. Click the **Images** button (amber colored) in the header
3. The Image Library Manager modal will open

### When Editing Buttons

1. Enter edit mode on a custom board
2. Click any cell to open the Button Editor
3. Click **Choose from Library** to browse existing images
4. Or upload a new image which automatically adds it to the library

## Using the Image Library Manager

### Statistics Bar

The top bar shows:
- **Total Images**: Number of images in your library
- **Total Size**: Combined storage used
- **Avg Size**: Average image size
- **Total Usage**: How many buttons use library images
- **Unused**: Images not currently used by any button

### Search and Filter

- **Search**: Type to filter by image name or tags
- **Sort**: Choose from:
  - Name (A-Z)
  - Newest First
  - Oldest First
  - Size (Largest)
  - Most Used

### Image Grid

Each image card shows:
- Thumbnail preview
- Image name
- File size and dimensions
- Usage count (how many buttons use this image)
- Tags (if any)

### Deleting Images

- **Individual delete**: Click the trash icon on unused images
- **Bulk delete**: Click **Delete Unused (N)** to remove all images not used by any button

**Note**: Images in use cannot be deleted. Remove them from buttons first.

## Adding Images to the Library

### Method 1: Button Editor

1. Open Button Editor for any cell
2. Click **Choose from Library**
3. Click the **Upload** tab
4. Drag and drop an image or click to browse
5. Preview the image and click **Add to Library**

### Method 2: ImagePicker Upload

The upload interface:
- Accepts PNG, JPEG, GIF, WebP images
- Maximum file size: 5 MB
- Shows duplicate detection if image already exists
- Allows naming the image before upload

## Deduplication

When you upload an image:
1. The library calculates a unique hash (SHA-256)
2. If the same image already exists, it reuses the existing entry
3. No duplicate storage is wasted

This means:
- Uploading the same photo twice only stores it once
- Multiple buttons can share the same image efficiently

## Migration from Embedded Images

If you have existing boards with embedded images (from before the Image Library):

1. On first load, LoveWords automatically migrates embedded images to the library
2. Button references are updated to use the library
3. Duplicate images are detected and merged
4. Original board files are updated

This migration runs once and is automatic.

## Best Practices

### Organizing Images

1. **Use descriptive names**: "Happy Emoji" is better than "image-1234"
2. **Add tags**: Tags help with searching and categorizing
3. **Clean up unused**: Periodically delete unused images to save space

### Storage Considerations

- Images are stored in your browser's localStorage
- Total storage limit varies by browser (typically 5-10 MB)
- Use appropriately sized images (200x200 pixels is often sufficient)
- Compress images before uploading if needed

### Performance

- Images are cached in the library
- Shared images load faster (only fetched once)
- Large libraries may take slightly longer to browse

## Troubleshooting

### Image won't upload
- Check file size (must be under 5 MB)
- Ensure it's a supported format (PNG, JPEG, GIF, WebP)
- Try refreshing the page if upload stalls

### Can't delete an image
- Image is in use by one or more buttons
- Check the usage count on the image card
- Remove image from buttons first, then delete

### Images not showing on buttons
- Image may have been deleted from library
- Re-add the image using Button Editor
- Check browser console for storage errors

### Storage full
- Delete unused images from the library
- Remove some custom boards
- Consider using smaller image files

## Technical Details

### Storage Format

Images are stored as:
- Base64-encoded data URIs
- Metadata: name, size, hash, usage count, timestamps
- Stored in localStorage under `lovewords_image_library`

### Image Library Entry Structure

```typescript
{
  id: string;           // Unique identifier
  name: string;         // Display name
  dataUrl: string;      // Base64 data URI
  contentType: string;  // MIME type
  sizeBytes: number;    // File size
  hash: string;         // SHA-256 hash for deduplication
  usageCount: number;   // Number of buttons using this image
  createdAt: string;    // ISO timestamp
  lastUsedAt?: string;  // Last usage timestamp
  width?: number;       // Image width in pixels
  height?: number;      // Image height in pixels
  tags?: string[];      // User-defined tags
}
```

### Button Reference

Buttons reference library images via:
```typescript
{
  imageLibraryId: string;  // Reference to image in library
}
```

This replaces the older `image_id` + embedded image approach.
