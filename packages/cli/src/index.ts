#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';

async function main() {
  const args = process.argv.slice(2);
  
  if (args[0] !== 'get' || !args[1]) {
    console.error('Usage: uikey get [id]');
    process.exit(1);
  }

  const id = args[1];
  console.log(`Fetching UIKey data for id: ${id}...`);

  try {
    const response = await fetch(`http://localhost:3000/k/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }

    const markdown = await response.text();

    const uikeyDir = path.join(process.cwd(), '.uikey');
    if (!fs.existsSync(uikeyDir)) {
      fs.mkdirSync(uikeyDir, { recursive: true });
    }

    const filePath = path.join(uikeyDir, 'context.md');
    fs.writeFileSync(filePath, markdown, 'utf-8');

    console.log(`Successfully wrote context to ${filePath}`);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

main();
