import path from 'path';
import { fileURLToPath } from 'url';

// Helper to get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: 'development', 
  entry: './dist/scripts/index.js',
  // Output configuration
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'), // The output directory
    clean: false,
  },
  module: {
        rules: [
          {
            test: /\.hbs$/,
            loader: path.resolve(__dirname, "node_modules", "handlebars-loader/")
          }
        ]
      }
};