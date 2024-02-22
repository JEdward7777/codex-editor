import { useState, useEffect } from "react";
import {
    VSCodeTag,
    VSCodeButton,
    VSCodeDropdown,
    VSCodeOption,
} from "@vscode/webview-ui-toolkit/react";
import { ChatInputTextForm } from "../components/ChatInputTextForm";
import DeleteButtonWithConfirmation from "../components/DeleteButtonWithConfirmation";
import { WebviewHeader } from "../components/WebviewHeader";
import "../App.css";
import {
    ChatMessageThread,
    ChatMessageWithContext,
    ChatPostMessages,
} from "../../../../types";
import { v4 as uuidv4 } from "uuid";

const FLASK_ENDPOINT = "http://localhost:5554";

const vscode = acquireVsCodeApi();

const ChatRoleLabel = {
    system: "System",
    user: "You",
    assistant: "Copilot",
};

function messageWithContext({
    messageHistory,
    userPrompt,
    selectedText,
    contextItems,
}: {
    messageHistory: string;
    userPrompt: string;
    selectedText?: string;
    contextItems?: string[];
}): ChatMessageWithContext {
    let content = `### Instructions:\nPlease use the context below to respond to the user's message. If you know the answer, be concise. If the answer is in the context, please quote the wording of the source. If the answer is not in the context, avoid making up anything.`;

    if (selectedText || (contextItems && contextItems?.length > 0)) {
        content += `\n\n### Context:`;
    }

    if (selectedText) {
        content += `\nThe user has selected the following text in their current document:\n${selectedText}`;
    }

    if (contextItems && contextItems?.length > 0) {
        content += `\n\nAnd here are some other relevant context items from their project and reference resources:\n${contextItems.join(
            "\n",
        )}`;
    }

    if (messageHistory) {
        content += `\n\n### Chat History:\n${messageHistory}`;
    }

    content += `\n\n### User's message: ${userPrompt}`;

    return {
        // FIXME: since we're passing in the conversation history, should we be using a completions endpoint rather than a chat one?
        role: "user",
        content: content,
        createdAt: new Date().toISOString(),
    };
}

interface MessageItemProps {
    messageItem: ChatMessageWithContext;
    showSenderRoleLabels?: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({
    messageItem,
    showSenderRoleLabels = false,
}) => {
    return (
        <div
            style={{
                display: messageItem.role === "system" ? "none" : "flex",
                flexDirection: "column",
                gap: "0.5em",
                justifyContent:
                    messageItem.role === "user"
                        ? "flex-start"
                        : messageItem.role === "assistant"
                          ? "flex-end"
                          : "center",
                padding: "0.5em 1em",
                // maxWidth: messageItem.role === "context" ? "100%" : "80%", // full width for 'context' messages
                alignSelf:
                    messageItem.role === "assistant"
                        ? "flex-start"
                        : messageItem.role === "user"
                          ? "flex-end"
                          : "center",
            }}
        >
            {(messageItem.role === "user" ||
                messageItem.role === "assistant") && (
                <div
                    style={{
                        fontSize: "0.7em",
                        color: "lightgrey",
                        marginBottom: "0.2em",
                        marginLeft:
                            messageItem.role === "assistant" ? "9px" : "0px",
                        marginRight:
                            messageItem.role === "user" ? "9px" : "0px",
                        alignSelf:
                            messageItem.role === "assistant"
                                ? "flex-start"
                                : "flex-end",
                    }}
                >
                    {new Date(messageItem.createdAt).toLocaleTimeString()}{" "}
                    {/* FIXME: add actual timestamps */}
                </div>
            )}
            <div
                style={{
                    display: messageItem.role === "system" ? "none" : "flex",
                    flexDirection:
                        messageItem.role === "assistant"
                            ? "row"
                            : messageItem.role === "user"
                              ? "row-reverse"
                              : "column",
                    gap: "0.5em",
                    justifyContent:
                        messageItem.role === "assistant"
                            ? "flex-start"
                            : messageItem.role === "user"
                              ? "flex-end"
                              : "center",
                    borderRadius: "20px",
                    backgroundColor:
                        messageItem.role === "assistant"
                            ? "var(--vscode-editor-background)"
                            : messageItem.role === "user"
                              ? "var(--vscode-button-background)"
                              : "lightblue", // distinct style for 'context' messages
                    color:
                        messageItem.role === "assistant"
                            ? "var(--vscode-editor-foreground)"
                            : messageItem.role === "user"
                              ? "var(--vscode-button-foreground)"
                              : "black", // distinct style for 'context' messages
                    padding: "0.5em 1em",
                    // maxWidth: messageItem.role === "context" ? "100%" : "80%", // full width for 'context' messages
                    alignSelf:
                        messageItem.role === "assistant"
                            ? "flex-start"
                            : messageItem.role === "user"
                              ? "flex-end"
                              : "center",
                }}
            >
                {showSenderRoleLabels && (
                    <VSCodeTag>
                        {
                            ChatRoleLabel[
                                messageItem.role as keyof typeof ChatRoleLabel
                            ]
                        }
                    </VSCodeTag>
                )}
                <div style={{ display: "flex" }}>{messageItem.content}</div>
            </div>
        </div>
    );
};

function App() {
    const systemMessage: ChatMessageWithContext = {
        role: "system",
        content: "You are are helpful Bible translation assistant.",
        createdAt: new Date().toISOString(),
        // TODO: allow user to modify the system message
    };
    const dummyUserMessage: ChatMessageWithContext = {
        role: "user",
        content: "How do we normally translate cases like this?",
        createdAt: new Date().toISOString(),
    };
    const dummyAssistantMessage: ChatMessageWithContext = {
        role: "assistant",
        content: "Let me check your current translation drafts...",
        createdAt: new Date().toISOString(),
    };
    const [pendingMessage, setPendingMessage] =
        useState<ChatMessageWithContext>();
    const [selectedTextContext, setSelectedTextContext] = useState<string>("");
    const [contextItems, setContextItems] = useState<string[]>([]); // TODO: fetch from RAG server
    const [messageLog, setMessageLog] = useState<ChatMessageWithContext[]>([
        systemMessage,
        dummyUserMessage,
        dummyAssistantMessage,
    ]);

    const [currentMessageThreadId, setCurrentMessageThreadId] =
        useState<string>();

    const [availableMessageThreads, setAvailableMessageThreads] =
        useState<ChatMessageThread[]>();

    const SHOW_SENDER_ROLE_LABELS = false;

    async function fetchContextItems(query: string): Promise<string[]> {
        try {
            // FIXME: finish implementing this function.
            // The Flask server is either crashing or not starting sometimes
            // and we need a more graceful way to handle using context items.

            // Also, need to truncate retrieved items to reasonable length based on count
            // and length of the items.
            const response = await fetch(
                `${FLASK_ENDPOINT}/search?db_name=drafts&query=${encodeURIComponent(
                    query,
                )}`,
            );
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }
            const data = await response.json();
            console.log("fhe8w9hew98h Context items response -->", response);
            if (!Array.isArray(data) || data.length === 0) {
                return [];
            }
            return data.map(
                (item) =>
                    `${item.book} ${item.chapter}:${item.verse} - ${item.text}`,
            );
        } catch (error) {
            console.error(
                "Failed to fetch context items due to an error:",
                error,
            );
            vscode.postMessage({
                command: "notifyUserError",
                message: `Failed to fetch context items due to an error: ${
                    (error as Error).message
                }`,
            } as ChatPostMessages);
            return [];
        }
    }

    function formatMessageLogToString(
        messages: ChatMessageWithContext[],
    ): string {
        return messages
            .map((message) => {
                return `${ChatRoleLabel[message.role]}: ${message.content}`;
            })
            .join("\n");
    }

    function getResponseToUserNewMessage(newMessageTextContent: string) {
        const pendingMessage: ChatMessageWithContext = {
            role: "user",
            content: newMessageTextContent,
            createdAt: new Date().toISOString(),
        };
        vscode.postMessage({
            command: "saveMessageToThread",
            message: pendingMessage,
            threadId: currentMessageThreadId,
        } as ChatPostMessages);
        const updatedMessageLog = [...messageLog, pendingMessage];

        const contextItemsFromState = contextItems;

        const formattedPrompt: ChatMessageWithContext[] = [
            messageWithContext({
                messageHistory: formatMessageLogToString(messageLog),
                userPrompt: newMessageTextContent,
                selectedText: selectedTextContext,
                contextItems: contextItemsFromState,
            }),
        ];
        console.log("Formatted prompt -->", formattedPrompt);
        setMessageLog(updatedMessageLog);
        vscode.postMessage({
            command: "fetch",
            messages: JSON.stringify(formattedPrompt),
        } as ChatPostMessages);
    }

    async function handleSubmit(submittedMessageValue: string) {
        try {
            const contextItemsFromServer = await fetchContextItems(
                submittedMessageValue,
            );
            setContextItems(contextItemsFromServer);
            getResponseToUserNewMessage(submittedMessageValue);
            setSelectedTextContext("");
        } catch (error) {
            console.error(
                "Failed to fetch context items due to an error:",
                error,
            );
            vscode.postMessage({
                command: "error",
                message: `Failed to fetch context items. ${JSON.stringify(
                    error,
                )}`,
                messages: [],
            } as unknown as ChatPostMessages);
        }
    }

    useEffect(() => {
        vscode.postMessage({
            command: "fetchThread",
        } as ChatPostMessages);
    }, []);

    useEffect(() => {
        if (
            currentMessageThreadId &&
            availableMessageThreads &&
            availableMessageThreads?.length > 0
        ) {
            setMessageLog(
                availableMessageThreads.find(
                    (messageThread) =>
                        messageThread.id === currentMessageThreadId,
                )?.messages || [],
            );
        }
    }, [currentMessageThreadId]);

    window.addEventListener(
        "message",
        (event: MessageEvent<ChatPostMessages>) => {
            const message = event.data; // The JSON data our extension sent
            switch (message?.command) {
                case "select":
                    if (message.textDataWithContext) {
                        console.log("Received a select command", message);
                        const {
                            completeLineContent,
                            selectedText,
                            vrefAtStartOfLine,
                        } = message.textDataWithContext;
                        setSelectedTextContext(
                            `Reference: ${vrefAtStartOfLine}, Selected: ${selectedText}, Line: ${completeLineContent}`,
                        );
                    }
                    break;
                case "response":
                    if (!message.finished) {
                        const messageContent =
                            (pendingMessage?.content || "") +
                            (message.text || "");
                        setPendingMessage({
                            role: "assistant",
                            content: messageContent,
                            createdAt: new Date().toISOString(),
                        });
                    } else {
                        if (pendingMessage) {
                            vscode.postMessage({
                                command: "saveMessageToThread",
                                message: pendingMessage,
                                threadId: currentMessageThreadId,
                            } as ChatPostMessages);
                            setMessageLog([...messageLog, pendingMessage]);
                        }
                        setPendingMessage(undefined);
                    }
                    break;
                case "threadsFromWorkspace":
                    if (message.content) {
                        const messageThreadArray = message.content;
                        const lastMessageThreadId =
                            messageThreadArray[messageThreadArray.length - 1]
                                ?.id;
                        const messageThreadsExist = !!lastMessageThreadId;
                        if (messageThreadsExist) {
                            setAvailableMessageThreads(messageThreadArray);
                        }

                        let messageThreadIdToUse: string;

                        if (currentMessageThreadId) {
                            messageThreadIdToUse = currentMessageThreadId;
                        } else if (messageThreadsExist) {
                            messageThreadIdToUse = lastMessageThreadId;
                        } else {
                            messageThreadIdToUse = uuidv4();
                        }

                        if (!currentMessageThreadId) {
                            setCurrentMessageThreadId(messageThreadIdToUse);
                        }

                        const messageThreadForContext = messageThreadArray.find(
                            (thread) => thread.id === messageThreadIdToUse,
                        );

                        if (
                            messageThreadForContext?.messages?.length &&
                            messageThreadForContext?.messages?.length > 0
                        ) {
                            setMessageLog(messageThreadForContext.messages);
                        }
                    }
                    break;
                default:
                    break;
            }
        },
    );

    function clearChat() {
        setMessageLog([systemMessage]);
    }

    interface ClearChatButtonProps {
        callback: () => void;
    }

    const ClearChatButton: React.FC<ClearChatButtonProps> = ({ callback }) => (
        <DeleteButtonWithConfirmation handleDeleteButtonClick={callback} />
    );
    interface NavigateChatHistoryProps {
        callback: (newMessageThreadId: string) => void;
    }
    const NavigateChatHistoryButton: React.FC<
        NavigateChatHistoryProps
    > = () => {
        const [threadSelectorIsVisable, setThreadSelectorIsVisable] =
            useState(false);

        return (
            <>
                <VSCodeButton
                    aria-label="Start New Thread"
                    appearance="icon"
                    title="⨁"
                    onClick={() => {
                        setCurrentMessageThreadId(uuidv4());
                        setMessageLog([systemMessage]);
                        // vscode.postMessage({
                        //     command: "fetchThread",
                        // } as ChatPostMessages);
                    }}
                    style={{
                        backgroundColor: "var(--vscode-button-background)",
                        color: "var(--vscode-button-foreground)",
                    }}
                >
                    <i className="codicon codicon-add"></i>
                </VSCodeButton>
                {/* {threadSelectorIsVisable && ( */}
                <VSCodeDropdown
                    value={currentMessageThreadId}
                    style={{ minWidth: "max-content" }}
                    // disabled={!selectedBook}
                    onInput={(e: any) => {
                        console.log({ e });
                        console.log((e.target as HTMLSelectElement).value);
                        setCurrentMessageThreadId(
                            (e.target as HTMLSelectElement).value,
                        );
                    }}
                >
                    {availableMessageThreads?.map((messageThread) => (
                        <VSCodeOption
                            key={messageThread.id}
                            selected={
                                messageThread.id === currentMessageThreadId
                            }
                            value={messageThread.id}
                        >
                            {messageThread.threadTitle ||
                                new Date(
                                    messageThread.createdAt,
                                ).toLocaleTimeString()}
                        </VSCodeOption>
                    ))}
                </VSCodeDropdown>
                {/* )} */}
                <VSCodeButton
                    aria-label="History"
                    appearance="icon"
                    title="📖"
                    onClick={() =>
                        setThreadSelectorIsVisable(!threadSelectorIsVisable)
                    }
                    style={{
                        backgroundColor: "var(--vscode-button-background)",
                        color: "var(--vscode-button-foreground)",
                    }}
                >
                    <i className="codicon codicon-history"></i>
                </VSCodeButton>
            </>
        );
    };
    const currentMessageThreadTitle = availableMessageThreads?.find(
        (messageThread) => messageThread.id === currentMessageThreadId,
    )?.threadTitle;
    return (
        <main
            style={{
                display: "flex",
                flexDirection: "column",
                height: "100vh",
                width: "100%",
                backgroundImage:
                    "linear-gradient(45deg, var(--vscode-sideBar-background), transparent)",
                backgroundSize: "cover",
                overflowX: "hidden",
            }}
        >
            <WebviewHeader
                title={currentMessageThreadTitle || "Translator's Copilot Chat"}
            >
                <div
                    style={{
                        display: "flex",
                        gap: 10,
                    }}
                >
                    <NavigateChatHistoryButton
                        callback={(newMessageThreadId) => {
                            setCurrentMessageThreadId(newMessageThreadId);
                            // vscode.postMessage({
                            //     command: "fetchThread",
                            // } as ChatPostMessages);
                        }}
                    />
                    <ClearChatButton callback={clearChat} />
                </div>
            </WebviewHeader>
            <div
                className="chat-container"
                style={{
                    flex: 1,
                    overflowY: "auto",
                    overflowX: "hidden",
                    gap: "0.5em",
                    flexDirection: "column",
                    padding: "1em",
                    display: "flex",
                    width: "100%",
                }}
            >
                {messageLog.map((messageLogItem, index) => (
                    <MessageItem
                        key={index}
                        messageItem={messageLogItem}
                        showSenderRoleLabels={SHOW_SENDER_ROLE_LABELS}
                    />
                ))}
                {pendingMessage?.role === "assistant" &&
                pendingMessage?.content.length > 0 ? (
                    <MessageItem messageItem={pendingMessage} />
                ) : null}
            </div>
            <ChatInputTextForm
                contextItems={contextItems}
                selectedText={selectedTextContext}
                handleSubmit={handleSubmit}
            />
        </main>
    );
}

export default App;
