"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
const http = require("http");
const fs = require("fs");
const path = require("path");
function activate(context) {
    let disposable = vscode.commands.registerCommand('uikey.applyStyle', async () => {
        const uikeyId = await vscode.window.showInputBox({
            prompt: 'Enter UIKey ID',
            placeHolder: 'e.g. 8f92a2'
        });
        if (uikeyId) {
            try {
                const markdown = await fetchUIKey(uikeyId);
                const workspaceFolders = vscode.workspace.workspaceFolders;
                if (workspaceFolders && workspaceFolders.length > 0) {
                    const workspacePath = workspaceFolders[0].uri.fsPath;
                    const uikeyDir = path.join(workspacePath, '.uikey');
                    if (!fs.existsSync(uikeyDir)) {
                        fs.mkdirSync(uikeyDir);
                    }
                    const contextPath = path.join(uikeyDir, 'context.md');
                    fs.writeFileSync(contextPath, markdown);
                    const cursorRulesPath = path.join(workspacePath, '.cursorrules');
                    const cursorRuleText = '\n\nAlways follow the design system and UI rules defined in .uikey/context.md';
                    if (fs.existsSync(cursorRulesPath)) {
                        fs.appendFileSync(cursorRulesPath, cursorRuleText);
                    }
                    else {
                        fs.writeFileSync(cursorRulesPath, cursorRuleText.trim());
                    }
                    vscode.window.showInformationMessage(`UIKey context written to .uikey/context.md`);
                }
                else {
                    const editor = vscode.window.activeTextEditor;
                    if (editor) {
                        editor.edit((editBuilder) => {
                            editBuilder.insert(new vscode.Position(0, 0), `/*\n${markdown}\n*/\n`);
                        });
                        vscode.window.showInformationMessage(`Applied UIKey: ${uikeyId}`);
                    }
                    else {
                        vscode.window.showErrorMessage('No active workspace or text editor to apply UIKey to.');
                    }
                }
            }
            catch (error) {
                vscode.window.showErrorMessage(`Failed to fetch UIKey: ${error.message}`);
            }
        }
    });
    context.subscriptions.push(disposable);
}
function fetchUIKey(id) {
    return new Promise((resolve, reject) => {
        http.get(`http://localhost:3000/api/k/${id}`, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        const json = JSON.parse(data);
                        resolve(json.markdown || json.prompt || json.content || data);
                    }
                    catch {
                        resolve(data);
                    }
                }
                else {
                    reject(new Error(`Status ${res.statusCode}: ${data}`));
                }
            });
        }).on('error', (err) => reject(err));
    });
}
function deactivate() { }
//# sourceMappingURL=extension.js.map