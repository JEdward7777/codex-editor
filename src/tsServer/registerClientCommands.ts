import * as vscode from "vscode";
import { LanguageClient } from "vscode-languageclient/node";

export function registerClientCommands(
    context: vscode.ExtensionContext,
    client: LanguageClient
): vscode.Disposable {
    const disposables: vscode.Disposable[] = [];

    disposables.push(
        vscode.commands.registerCommand(
            "translators-copilot.spellCheckText",
            async (text: string) => {
                if (client) {
                    return client.sendRequest("spellcheck/check", { text });
                }
            }
        )
    );

    disposables.push(
        vscode.commands.registerCommand(
            "translators-copilot.getSimilarWords",
            async (word: string) => {
                if (client) {
                    return client.sendRequest("server.getSimilarWords", [word]);
                }
            }
        )
    );

    disposables.push(
        vscode.commands.registerCommand("spellcheck.addWord", async (words: string | string[]) => {
            console.log("spellcheck.addWord command executed", { words });
            if (client) {
                console.log("sending request to language server");
                const wordsArray = Array.isArray(words) ? words : [words];
                try {
                    const response = await client.sendRequest("spellcheck/addWord", {
                        words: wordsArray,
                    });
                    console.log("Add word response from language server:", response);
                    vscode.window.showInformationMessage(
                        "Word(s) added to dictionary successfully."
                    );
                } catch (error: any) {
                    console.error("Error sending request to language server:", error);
                    vscode.window.showErrorMessage(`Error adding word: ${error.message}`);
                }
            } else {
                console.error("Language client is not initialized");
                vscode.window.showErrorMessage("Language client is not initialized");
            }
        })
    );

    context.subscriptions.push(...disposables);

    return {
        dispose: () => {
            disposables.forEach((d) => d.dispose());
        },
    };
}
