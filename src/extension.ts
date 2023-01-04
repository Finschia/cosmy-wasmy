// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Account } from './models/account';
import { Contract } from './models/contract';
import { Commands } from './commands/command';
import { Utils, Views } from './views/utils';
import { Workspace } from './helpers/workspace';
import { TextEncoder } from 'util';
import { FileWatcher } from './helpers/fileWatcher';


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

	global.workspaceChain = Workspace.GetWorkspaceChainConfig();
	Utils.CreateConnectedChainStatusItem();
	Utils.BeakerAutoSync(context);
	//Utils.ShowRecordStatusItem();

	Commands.Register(context);
	Views.Register(context);
	FileWatcher.Register();

	const rustLangExtension = vscode.extensions.getExtension('rust-lang.rust-analyzer');
	if (!rustLangExtension) {
		vscode.window.showWarningMessage(new vscode.MarkdownString("We recommend to install the [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer) extention while working with Rust on vscode.").value)
	}

	contractViewProvider.refresh(Contract.GetContracts(context.globalState));
	accountViewProvider.refresh(await Account.GetAccounts(context.globalState));
}

// this method is called when your extension is deactivated
export function deactivate() {
	global.schemaFileWatch.dispose();
}
