import * as vscode from "vscode";
import {
    importLocalUsfmSourceBible,
    createCodexNotebookFromWebVTT,
} from "../../utils/codexNotebookUtils";
import { initializeProject } from "../../projectManager/projectInitializers";
import { FileType } from "../../../types";

function getNonce(): string {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
export class SourceUploadProvider
    implements vscode.TextDocumentContentProvider, vscode.CustomTextEditorProvider
{
    public static readonly viewType = "sourceUploadProvider";
    onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();
    onDidChange = this.onDidChangeEmitter.event;

    constructor(private readonly context: vscode.ExtensionContext) {}

    public async resolveCustomDocument(
        document: vscode.CustomDocument,
        cancellationToken: vscode.CancellationToken
    ): Promise<void> {}

    provideTextDocumentContent(uri: vscode.Uri): string {
        return "Source Upload Provider Content";
    }
    async openCustomDocument(
        uri: vscode.Uri,
        openContext: vscode.CustomDocumentOpenContext,
        token: vscode.CancellationToken
    ): Promise<vscode.CustomDocument> {
        return { uri, dispose: () => {} };
    }

    public async resolveCustomTextEditor(
        document: vscode.TextDocument,
        webviewPanel: vscode.WebviewPanel,
        _token: vscode.CancellationToken
    ): Promise<void> {
        webviewPanel.webview.options = {
            enableScripts: true,
            localResourceRoots: [this.context.extensionUri],
        };

        webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview);

        webviewPanel.webview.onDidReceiveMessage(async (message) => {
            switch (message.command) {
                case "processUploadedFile":
                    try {
                        const fileType = message.fileType as FileType;
                        const notebookName = await vscode.window.showInputBox({
                            prompt: "Enter the name of this source file",
                        });
                        switch (fileType) {
                            case "subtitles":
                                if (notebookName) {
                                    await createCodexNotebookFromWebVTT(
                                        message.fileContent,
                                        notebookName
                                    );
                                }
                                break;
                            case "usfm":
                                // Save the uploaded USFM files and initialize the project
                                await initializeProject(true);
                                break;
                            case "plaintext":
                                // Handle plaintext import using recursive document splitter
                                vscode.window.showInformationMessage(
                                    "Plaintext import is not yet implemented."
                                );
                                break;
                            default:
                                vscode.window.showErrorMessage(
                                    `Unsupported file type: ${fileType}`
                                );
                        }
                    } catch (error) {
                        console.error(`Error processing uploaded file: ${error}`);
                        vscode.window.showErrorMessage(`Error processing uploaded file.`);
                    }
                    break;
                default:
                    console.log("Unknown command:", message.command);
                    break;
            }
        });
    }

    private getHtmlForWebview(webview: vscode.Webview): string {
        const styleResetUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this.context.extensionUri, "src", "assets", "reset.css")
        );
        const styleVSCodeUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this.context.extensionUri, "src", "assets", "vscode.css")
        );
        const codiconsUri = webview.asWebviewUri(
            vscode.Uri.joinPath(
                this.context.extensionUri,
                "node_modules",
                "@vscode/codicons",
                "dist",
                "codicon.css"
            )
        );
        const scriptUri = webview.asWebviewUri(
            vscode.Uri.joinPath(
                this.context.extensionUri,
                "webviews",
                "codex-webviews",
                "dist",
                "SourceUpload",
                "index.js"
            )
        );

        const nonce = getNonce();
        return /*html*/ `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}'; worker-src ${webview.cspSource}; img-src ${webview.cspSource} https:; font-src ${webview.cspSource};">
                <link href="${styleResetUri}" rel="stylesheet" nonce="${nonce}">
                <link href="${styleVSCodeUri}" rel="stylesheet" nonce="${nonce}">
                <link href="${codiconsUri}" rel="stylesheet" nonce="${nonce}" />
                <title>Codex Cell Editor</title>
            </head>
            <body>
                <div id="root"></div>
                <script nonce="${nonce}" src="${scriptUri}"></script>
            </body>
            </html>`;
    }
}
