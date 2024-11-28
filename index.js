const fs = require('fs');
const path = require('path');
const sourceMap = require('source-map');
const babel = require('@babel/core');

async function extractSourceCode(minifiedPath, sourceMapPath) {
    try {
        // Create a starter folder for extracted sources
        const starterFolder = path.join(process.cwd(), 'starter');
        if (!fs.existsSync(starterFolder)) {
            fs.mkdirSync(starterFolder, { recursive: true });
        }

        // Read files
        const minifiedCode = fs.readFileSync(minifiedPath, 'utf8');
        const sourceMapData = fs.readFileSync(sourceMapPath, 'utf8');

        // Parse source map
        const consumer = await new sourceMap.SourceMapConsumer(sourceMapData);

        // Iterate through sources and extract original code
        const sources = {};
        consumer.sources.forEach(sourceName => {
            const sourceContent = consumer.sourceContentFor(sourceName);

            if (sourceContent) {
                try {
                    // More aggressive parsing configuration
                    const transformed = babel.transformSync(sourceContent, {
                        filename: sourceName,
                        presets: [
                            ['@babel/preset-env', {
                                targets: {
                                    browsers: ['last 2 versions', 'ie >= 11']
                                }
                            }],
                            '@babel/preset-react',
                            '@babel/preset-typescript'
                        ],
                        plugins: [
                            '@babel/plugin-transform-typescript',
                            '@babel/plugin-proposal-class-properties',
                            '@babel/plugin-proposal-optional-chaining',
                            '@babel/plugin-proposal-nullish-coalescing-operator',
                            ['@babel/plugin-transform-runtime', {
                                regenerator: true
                            }]
                        ],
                        sourceType: 'module',
                        configFile: false,
                        babelrc: false
                    });

                    sources[sourceName] = transformed.code;
                } catch (parseError) {
                    console.error(`Error parsing ${sourceName}:`, parseError);
                    // Optionally save the original content if transformation fails
                    sources[sourceName] = sourceContent;
                }
            }
        });

        // Write extracted sources to files, preserving directory structure
        Object.entries(sources).forEach(([filename, content]) => {
            // Sanitize filename and create full path in starter folder
            const sanitizedPath = filename.replace(/[^a-z0-9.\/]/gi, '_');
            const fullExtractPath = path.join(starterFolder, sanitizedPath);

            // Ensure directory exists
            const dirPath = path.dirname(fullExtractPath);
            fs.mkdirSync(dirPath, { recursive: true });

            // Write file
            fs.writeFileSync(fullExtractPath, content);
            console.log(`Extracted: ${filename} -> ${fullExtractPath}`);
        });

        // Optional: Create a README.md to guide navigation
        const readmePath = path.join(starterFolder, 'README.md');
        fs.writeFileSync(readmePath, `# Extracted Source Code

## Overview
This folder contains the deobfuscated source code extracted from the minified bundle.

### How to Use
1. Review the extracted files
2. Check the original directory structure
3. Use this as a starting point for understanding or rebuilding the project

### Extraction Details
- Source Map: ${path.basename(sourceMapPath)}
- Minified Bundle: ${path.basename(minifiedPath)}
- Extraction Date: ${new Date().toISOString()}

## Notes
- Some file names may have been sanitized
- Complex transformations might slightly alter original code
- Verify functionality after extraction
`);

        console.log('Source code extraction complete.');
        console.log(`Extracted files are in: ${starterFolder}`);
    } catch (error) {
        console.error('Comprehensive error extracting source code:', error);
        console.error(error.stack);
    }
}

// Usage
extractSourceCode('m.js', 'm.js.map');