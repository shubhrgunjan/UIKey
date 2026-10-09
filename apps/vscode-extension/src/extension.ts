import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('uikey.applyStyle', async () => {
        const uikeyId = await vscode.window.showInputBox({
            prompt: 'Enter UIKey ID',
            placeHolder: 'e.g. 8f92a2'
        });

        if (uikeyId) {
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                editor.edit(editBuilder => {
                    editBuilder.insert(new vscode.Position(0, 0), `// UIKey Applied: ${uikeyId}\n`);
                });
                vscode.window.showInformationMessage(`Applied UIKey: ${uikeyId}`);
            } else {
                vscode.window.showErrorMessage('No active text editor to apply UIKey to.');
            }
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
