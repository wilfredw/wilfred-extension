// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');


/**
 * unescape String。
 * @param {string} input String surrounded by "" in Java code
 * @returns {string} result string after unescape
 */
function unescapeJavaString(input) {
    return input
        .replace(/\\n/g, '\n') // unescape \n 
        .replace(/\\t/g, '\t') // unescape \t 
        .replace(/\\r/g, '\r') // unescape \r 
        .replace(/\\"/g, '"')  // unescape \" 
        .replace(/\\\\/g, '\\'); // unescape \\ 
}

function trimQuotes(str) {
    str = str.trim();
    if (str.startsWith('"') && str.endsWith('"')) {
        return str.substring(1, str.length - 1);
    }
    return str;
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "wilfred-extension" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('wilfred-extension.reverseString', function () {
		const editor = vscode.window.activeTextEditor;

        if (!editor) {
            vscode.window.showErrorMessage('No active editor!');
            return;
        }

        const document = editor.document;
        const selection = editor.selection;

        // get selection or whole document
        const text = selection.isEmpty
            ? document.getText()
            : document.getText(selection);

        // regx match java string and convert
		const trimQuotesText = trimQuotes(text);
        const updatedText = unescapeJavaString(trimQuotesText);

        // update
        editor.edit(editBuilder => {
            if (selection.isEmpty) {
                // whole document
                const start = new vscode.Position(0, 0);
                const end = new vscode.Position(document.lineCount, 0);
                const range = new vscode.Range(start, end);
                editBuilder.replace(range, updatedText);
            } else {
                // selection
                editBuilder.replace(selection, updatedText);
            }
        });

        vscode.window.showInformationMessage('String reversal complete!');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
