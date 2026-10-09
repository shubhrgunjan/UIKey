#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const inquirer_1 = __importDefault(require("inquirer"));
const ora_1 = __importDefault(require("ora"));
const chalk_1 = __importDefault(require("chalk"));
const cli_table3_1 = __importDefault(require("cli-table3"));
const uikeyDir = path.join(process.cwd(), '.uikey');
async function fetchUIKey(id) {
    const spinner = (0, ora_1.default)(`Fetching UIKey data for id: ${chalk_1.default.bold(id)}...`).start();
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
            spinner.succeed(chalk_1.default.green(`Successfully fetched UIKey ${id}`));
        }
        catch (e) {
            spinner.warn(chalk_1.default.yellow(`Fetch failed (${e.message}), using mock data.`));
            markdown = `# Mock UIKey ${id}\nThis is mock data because the API call failed.`;
        }
        if (!fs.existsSync(uikeyDir)) {
            fs.mkdirSync(uikeyDir, { recursive: true });
        }
        const filePath = path.join(uikeyDir, `${id}.md`);
        fs.writeFileSync(filePath, markdown, 'utf-8');
        console.log(chalk_1.default.green(`Saved UIKey to ${filePath}`));
        const table = new cli_table3_1.default({
            head: [chalk_1.default.cyan('Property'), chalk_1.default.cyan('Value')],
            colWidths: [20, 50]
        });
        table.push(['ID', chalk_1.default.bold(id)], ['Saved Location', filePath], ['Content Length', `${markdown.length} bytes`]);
        console.log(table.toString());
    }
    catch (error) {
        spinner.fail(chalk_1.default.red(`Error: ${error.message}`));
    }
}
async function listLocalKeys() {
    if (!fs.existsSync(uikeyDir)) {
        console.log(chalk_1.default.yellow('No local keys found.'));
        return;
    }
    const files = fs.readdirSync(uikeyDir).filter(f => f.endsWith('.md'));
    if (files.length === 0) {
        console.log(chalk_1.default.yellow('No local keys found.'));
        return;
    }
    const table = new cli_table3_1.default({
        head: [chalk_1.default.cyan('File'), chalk_1.default.cyan('Size (bytes)')],
    });
    for (const file of files) {
        const stats = fs.statSync(path.join(uikeyDir, file));
        table.push([file, stats.size]);
    }
    console.log(chalk_1.default.blue('\nLocal UIKeys:'));
    console.log(table.toString());
}
async function main() {
    console.log(chalk_1.default.bold.magenta('\n✨ Welcome to UIKey CLI ✨\n'));
    while (true) {
        const { action } = await inquirer_1.default.prompt([
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
            const { id } = await inquirer_1.default.prompt([
                {
                    type: 'input',
                    name: 'id',
                    message: 'Enter the UIKey ID:',
                    validate: (input) => input.trim() !== '' ? true : 'ID cannot be empty'
                }
            ]);
            await fetchUIKey(id.trim());
        }
        else if (action === 'List local keys') {
            await listLocalKeys();
        }
        else {
            console.log(chalk_1.default.gray('Goodbye!'));
            process.exit(0);
        }
        console.log(''); // Empty line for spacing
    }
}
main().catch((err) => {
    console.error(chalk_1.default.red('Fatal Error:'), err);
    process.exit(1);
});
