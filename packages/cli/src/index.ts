#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';
import Table from 'cli-table3';

const uikeyDir = path.join(process.cwd(), '.uikey');

async function fetchUIKey(id: string) {
  const spinner = ora(`Fetching UIKey data for id: ${chalk.bold(id)}...`).start();
  try {
    // Try to fetch from API, or mock if we want
    // Using global fetch (available in Node.js 18+)
    let markdown = '';
    try {
      const response = await fetch(`https://uikey.dev/api/k/${id}`);
      
      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }
      markdown = await response.text();
      spinner.succeed(chalk.green(`Successfully fetched UIKey ${id}`));
    } catch (e: any) {
      spinner.warn(chalk.yellow(`Fetch failed (${e.message}), using mock data.`));
      markdown = `# Mock UIKey ${id}\nThis is mock data because the API call failed.`;
    }

    if (!fs.existsSync(uikeyDir)) {
      fs.mkdirSync(uikeyDir, { recursive: true });
    }

    const filePath = path.join(uikeyDir, `${id}.md`);
    fs.writeFileSync(filePath, markdown, 'utf-8');
    
    console.log(chalk.green(`Saved UIKey to ${filePath}`));

    const table = new Table({
      head: [chalk.cyan('Property'), chalk.cyan('Value')],
      colWidths: [20, 50]
    });
    
    table.push(
      ['ID', chalk.bold(id)],
      ['Saved Location', filePath],
      ['Content Length', `${markdown.length} bytes`]
    );
    
    console.log(table.toString());
  } catch (error: any) {
    spinner.fail(chalk.red(`Error: ${error.message}`));
  }
}

async function listLocalKeys() {
  if (!fs.existsSync(uikeyDir)) {
    console.log(chalk.yellow('No local keys found.'));
    return;
  }
  
  const files = fs.readdirSync(uikeyDir).filter(f => f.endsWith('.md'));
  
  if (files.length === 0) {
    console.log(chalk.yellow('No local keys found.'));
    return;
  }

  const table = new Table({
    head: [chalk.cyan('File'), chalk.cyan('Size (bytes)')],
  });

  for (const file of files) {
    const stats = fs.statSync(path.join(uikeyDir, file));
    table.push([file, stats.size]);
  }

  console.log(chalk.blue('\nLocal UIKeys:'));
  console.log(table.toString());
}

async function main() {
  console.log(chalk.bold.magenta('\n✨ Welcome to UIKey CLI ✨\n'));

  while (true) {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          'Fetch a UIKey',
          'List local keys',
          'Exit'
        ]
      }
    ]);

    if (action === 'Fetch a UIKey') {
      const { id } = await inquirer.prompt([
        {
          type: 'input',
          name: 'id',
          message: 'Enter the UIKey ID:',
          validate: (input: string) => input.trim() !== '' ? true : 'ID cannot be empty'
        }
      ]);
      await fetchUIKey(id.trim());
    } else if (action === 'List local keys') {
      await listLocalKeys();
    } else {
      console.log(chalk.gray('Goodbye!'));
      process.exit(0);
    }
    console.log(''); // Empty line for spacing
  }
}

main().catch((err) => {
  console.error(chalk.red('Fatal Error:'), err);
  process.exit(1);
});
