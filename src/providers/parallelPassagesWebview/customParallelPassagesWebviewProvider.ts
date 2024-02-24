import * as vscode from "vscode";
import {
    serializeCommentThreadArray,
} from "../../commentsProvider";
import { globalStateEmitter, updateGlobalState } from "../../globalState";
import {
    CommentPostMessages,
    NotebookCommentThread,
    VerseRefGlobalState,
} from "../../../types";
import { registerTextSelectionHandler } from "../../pygls_commands/textSelectionHandler";
import { jumpToCellInNotebook } from "../../utils";


const abortController: AbortController | null = null;
let loading: boolean = false;

interface OpenFileMessage {
    command: "openFileAtLocation";
    uri: string;
    word: string;
}



async function upsertAllCodexFiles(webview: vscode.Webview): Promise<void> {
    await upsertAllFiles(webview, "**/*.codex", ".codex", 'http://localhost:5554/upsert_codex_file');
}

async function upsertAllSourceFiles(webview: vscode.Webview): Promise<void> {
    await upsertAllFiles(webview, "**/*.bible", ".bible", 'http://localhost:5554/upsert_bible_file');
}

async function upsertAllFiles(webview: vscode.Webview, filePattern: string, dbName: string, endpoint: string): Promise<void> {
    const workspaceFolders = vscode.workspace.workspaceFolders;

    if (!workspaceFolders) {
        return;
    }

    let totalFiles = 0;
    let processedFiles = 0;

    // First, count all files to determine total steps for progress update
    for (const folder of workspaceFolders) {
        const pattern = new vscode.RelativePattern(folder, filePattern);
        const files = await vscode.workspace.findFiles(pattern);
        totalFiles += files.length;
    }

    // Then, process each file
    for (const folder of workspaceFolders) {
        const pattern = new vscode.RelativePattern(folder, filePattern);
        const files = await vscode.workspace.findFiles(pattern);

        for (const file of files) {
            // Upsert each file
            const filePath = file.fsPath;
            const db_name = dbName; // Assuming the database name is known and static
            const upsertData = { db_name, path: filePath };

            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(upsertData),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                // Successfully upserted a file, increment processed files count
                processedFiles++;

                // Send a message to the webview to update the loading progress
                webview.postMessage({
                    command: "loadingProgress",
                    currentStep: processedFiles,
                    totalSteps: totalFiles,
                });
            } catch (error) {
                console.error(`Failed to upsert file at ${endpoint}:`, error);
            }
        }
    }
    loading = false;
    webview.postMessage({
        command: "loadingProgress",
        currentStep: 0,
        totalSteps: 0,
    });
}



async function jumpToFirstOccurrence(uri: string, word: string) {

    const chapter = word.split(":");
    jumpToCellInNotebook(uri, parseInt(chapter[0], 10));
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }

    const document = editor.document;
    const text = document.getText();
    const wordIndex = text.indexOf(word);

    if (wordIndex === -1) {
        return;
    }

    const position = document.positionAt(wordIndex);
    editor.selection = new vscode.Selection(position, position);
    editor.revealRange(new vscode.Range(position, position), vscode.TextEditorRevealType.InCenter);

    vscode.window.showInformationMessage(`Jumped to the first occurrence of "${word}"`);
}


const loadWebviewHtml = (
    webviewView: vscode.WebviewView,
    extensionUri: vscode.Uri,
) => {
    webviewView.webview.options = {
        enableScripts: true,
        localResourceRoots: [extensionUri],
    };

    const styleResetUri = webviewView.webview.asWebviewUri(
        vscode.Uri.joinPath(extensionUri, "src", "assets", "reset.css"),
    );
    const styleVSCodeUri = webviewView.webview.asWebviewUri(
        vscode.Uri.joinPath(extensionUri, "src", "assets", "vscode.css"),
    );

    const scriptUri = webviewView.webview.asWebviewUri(
        vscode.Uri.joinPath(
            extensionUri,
            "webviews",
            "codex-webviews",
            "dist",
            "ParallelView",
            "index.js",
        ),
    );
    const styleUri = webviewView.webview.asWebviewUri(
        vscode.Uri.joinPath(
            extensionUri,
            "webviews",
            "codex-webviews",
            "dist",
            "ParallelView",
            "index.css",
        ),
    );
    function getNonce() {
        let text = "";
        const possible =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 32; i++) {
            text += possible.charAt(
                Math.floor(Math.random() * possible.length),
            );
        }
        return text;
    }
    const nonce = getNonce();
    const html = /*html*/ `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <!--
      Use a content security policy to only allow loading images from https or from our extension directory,
      and only allow scripts that have a specific nonce.
    -->
    <meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${
        webviewView.webview.cspSource
    }; script-src 'nonce-${nonce}';">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="${styleResetUri}" rel="stylesheet">
    <link href="${styleVSCodeUri}" rel="stylesheet">
    <link href="${styleUri}" rel="stylesheet">
    <script nonce="${nonce}">
      // const vsCodeApi = acquireVsCodeApi();
      const apiBaseUrl = ${JSON.stringify("http://localhost:3002")}
    </script>
    </head>
    <body>
    <div id="root"></div>
    <script nonce="${nonce}" src="${scriptUri}"></script>
  </body>
  </html>`;

    webviewView.webview.html = html;
    webviewView.webview.onDidReceiveMessage(
        async (message: OpenFileMessage) => {
            if (message.command === "openFileAtLocation") {
                vscode.window.showInformationMessage(message.uri);
                // vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(message.uri), {
                //     selection: new vscode.Range(
                //         new vscode.Position(0, 0),
                //         new vscode.Position(0, 0)
                //     )
                
                // });
                jumpToFirstOccurrence(message.uri, message.word);
            }
            else if (message.command === "embedAllDocuments") {
                upsertAllCodexFiles(webviewView.webview);
                vscode.window.showInformationMessage("Embedding in progress.");        
            }
            else if (message.command === "embedSource") {
                upsertAllSourceFiles(webviewView.webview);
                vscode.window.showInformationMessage("Embedding in progress.");        
            }
        },
    );
};

export class CustomWebviewProvider {
    _context: vscode.ExtensionContext;
    selectionChangeListener: any;
    constructor(context: vscode.ExtensionContext) {
        this._context = context;
    }
 
    resolveWebviewView(webviewView: vscode.WebviewView) {
        loadWebviewHtml(webviewView, this._context.extensionUri);

        registerTextSelectionHandler(this._context, (data: JSON)=>{
            webviewView.webview.postMessage({
                command: "searchResults",
                data: data
            });
        });
        if (webviewView.visible) {
           // sendCommentsToWebview(webviewView);
            // TODO: send verse parallels

        }

    }
}

export function registerParallelViewWebviewProvider(
    context: vscode.ExtensionContext,
) {
    const item = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
    );

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            "parallel-passages-sidebar",
            new CustomWebviewProvider(context),
        ),
    );
    
    item.show();
}
