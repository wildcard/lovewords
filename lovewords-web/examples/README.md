# Example Boards

This directory contains example `.obf` (Open Board Format) files for testing and demonstration purposes.

## Files

### `example-board.obf`
A simple test board containing common greetings and responses.

**Contents:**
- Hello, Goodbye
- Thank You, You're Welcome
- Yes, No
- Please, Help
- Navigation buttons (Back, Home, Clear, Backspace)

**Grid:** 4×4 layout
**Use Case:** Testing import functionality, demonstrating basic OBF structure

## How to Use

### Option 1: Import via File Upload

1. Start the LoveWords development server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:5173

3. Click "📚 My Boards" in the navigation bar

4. Click "📥 Import Board" button

5. Select "📁 File Upload" tab

6. Click "Choose File" and select `example-board.obf`

7. Review the preview and click "Import"

### Option 2: Import via URL (Local Server)

1. Start a local HTTP server in this directory:
   ```bash
   cd examples
   python3 -m http.server 8080
   ```

2. In LoveWords, use "Import from URL" with:
   ```
   http://localhost:8080/example-board.obf
   ```

### Option 3: Import via URL (GitHub)

You can also import directly from GitHub:
```
https://raw.githubusercontent.com/wildcard/lovewords/main/lovewords-web/examples/example-board.obf
```

## Testing ID Collision

To test the ID collision detection feature:

1. Import `example-board.obf` once
2. Import the same file again
3. You should see a warning about ID collision
4. Test both "Rename" and "Replace" strategies

## Creating Your Own Example Boards

You can create additional example boards by:

1. Creating a custom board in LoveWords
2. Exporting it using the "📤" button
3. (Optional) Edit the `.obf` file to add more content
4. Place it in this directory
5. Update this README with a description

## OBF File Format

All `.obf` files must follow the Open Board Format specification:

```json
{
  "format": "open-board-0.1",
  "id": "unique-id",
  "name": "Board Name",
  "locale": "en-US",
  "description": "Optional description",
  "buttons": [...],
  "images": [...],
  "sounds": [...],
  "grid": {
    "rows": 4,
    "columns": 4,
    "order": [...]
  }
}
```

See [OBF_SPECIFICATION.md](../docs/OBF_SPECIFICATION.md) for full details.

## License

Example boards in this directory are released under CC0 1.0 (Public Domain) unless otherwise specified in the board's license field.
