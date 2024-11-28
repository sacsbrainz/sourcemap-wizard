# sourcemap-wizard

# Source Code Extractor

This project provides a Node.js script to extract and deobfuscate source code from minified JavaScript bundles using their source maps. The extracted code is written to a structured directory, allowing for easier navigation and analysis.

---

## Tested

- **React.js app written in typescript**

---

## Features

- **Extract original source files**: Reconstructs source files from a minified JavaScript bundle and its source map.
- **Preserves directory structure**: Maintains the original file organization.
- **Transforms modern JavaScript**: Uses Babel to parse and transpile code for compatibility and readability.
- **Error handling**: Falls back to original code if transformations fail.
- **Automatic README generation**: Creates a README in the output directory to document the extraction process.

---

## Prerequisites

- **Node.js**: Version 14.x or later.
- **NPM/Yarn**: For managing dependencies.

Install required dependencies:

```bash
npm install
```

---

## Usage

1. Place your **minified JavaScript bundle** and its **source map** in the same directory as the script.
2. Modify the script call to use the correct file paths for your minified file and source map:
   ```javascript
   extractSourceCode('bundle.js', 'bundle.js.map');
   ```
3. Run the script:
   ```bash
   node index.js
   ```
4. Extracted files will be saved in the `starter` folder.

---

## Output Directory Structure

- **starter/**: The folder where extracted files are saved.
  - Contains deobfuscated source code.
  - Preserves original directory structure (with sanitized filenames if necessary).
  - Includes a `README.md` summarizing the extraction process.

---

## Example Extraction

After running the script:

```plaintext
starter/
├── src/
│   ├── main.js
│   └── utils/
│       ├── helper.js
│       └── validator.js
├── README.md
```

---

## Notes

- Some file names may be sanitized to ensure compatibility.
- The transformed files may differ slightly from their original versions due to Babel parsing and transpilation.
- Verify and test the extracted code before deploying or further use.

---

## Error Handling

If the script encounters issues (e.g., missing files or unsupported transformations):
- Check the input file paths.
- Review console logs for detailed error messages.

---

## License

This project is open-source. Feel free to modify and use it as needed.