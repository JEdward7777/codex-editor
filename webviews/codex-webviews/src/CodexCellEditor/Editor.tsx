import { useRef, useEffect, useMemo, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import registerQuillSpellChecker, { getCleanedHtml } from "./react-quill-spellcheck";
import { EditorPostMessages, SpellCheckResponse } from "../../../../types";
import "./TextEditor.css"; // over write the default quill styles so spans flow

const icons: any = Quill.import("ui/icons");
// Assuming you have access to the VSCode API here
const vscode: any = (window as any).vscodeApi;

// Register the QuillSpellChecker with the VSCode API
registerQuillSpellChecker(Quill, vscode);
// Use VSCode icon for autocomplete
icons[
    "autocomplete"
] = `<i class="codicon codicon-sparkle quill-toolbar-icon" style="color: var(--vscode-editor-foreground)"></i>`;
icons[
    "openLibrary"
] = `<i class="codicon codicon-book quill-toolbar-icon" style="color: var(--vscode-editor-foreground)"></i>`;

export interface EditorContentChanged {
    html: string;
}

// Add interface for edit history
interface EditHistoryEntry {
    before: string;
    after: string;
    timestamp: number;
}

export interface EditorProps {
    currentLineId: string;
    initialValue?: string;
    onChange?: (changes: EditorContentChanged) => void;
    spellCheckResponse?: SpellCheckResponse | null;
    textDirection: "ltr" | "rtl";
}

// Update the TOOLBAR_OPTIONS to include both dynamic buttons
const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike", "blockquote", "link"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    ["clean"],
    ["openLibrary"], // Library button
    ["autocomplete"], // Keep only autocomplete
];

export default function Editor(props: EditorProps) {
    const [showModal, setShowModal] = useState(false);
    const [wordsToAdd, setWordsToAdd] = useState<string[]>([]); // Add state for words
    // Add state to track if editor is empty
    const [isEditorEmpty, setIsEditorEmpty] = useState(true);
    const [editHistory, setEditHistory] = useState<EditHistoryEntry[]>([]);
    const initialContentRef = useRef<string>("");

    useEffect(() => {
        // Store initial content when editor is mounted
        if (quillRef.current) {
            initialContentRef.current = quillRef.current.root.innerHTML;
        }

        // Cleanup function to save edit when component unmounts
        return () => {
            if (quillRef.current) {
                const finalContent = quillRef.current.root.innerHTML;
                if (finalContent !== initialContentRef.current) {
                    setEditHistory((prev) => {
                        const newEntry = {
                            before: initialContentRef.current,
                            after: finalContent,
                            timestamp: Date.now(),
                        };
                        // Keep only the last 7 entries
                        return [...prev, newEntry].slice(-7);
                    });
                }
            }
        };
    }, []); // Empty dependency array since we only want this to run once

    function isQuillEmpty(quill: Quill | null) {
        if (!quill) return true;
        const delta = quill.getContents();
        const text = delta.ops?.reduce((text, op) => {
            return text + (op.insert ? op.insert : "");
        }, "");

        // Trim whitespace and check if empty
        return text?.trim().length === 0;
    }

    const revertedValue = useMemo(() => {
        if (!props.initialValue) return "";
        return props.initialValue
            ?.replace(/^<span>/, "<p>")
            .replace(/<\/span>/, "</p>")
            .replace(/\n$/, "");
    }, [props.initialValue]);

    const quillRef = useRef<Quill | null>(null);
    const editorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (editorRef.current && !quillRef.current) {
            const baseToolbar = [...TOOLBAR_OPTIONS];
            const quill = new Quill(editorRef.current, {
                theme: "snow",
                placeholder: "Start writing...",
                modules: {
                    toolbar: {
                        container: baseToolbar,
                        handlers: {
                            autocomplete: llmCompletion,
                            openLibrary: () => {
                                // Get all words from the current content
                                const content = quill.getText();
                                const words = content
                                    .split(/[\s\n.,!?]+/) // Split by whitespace and punctuation
                                    .filter((word) => word.length > 0) // Remove empty strings
                                    .map((word) => word) // Convert to lowercase (actually don't)
                                    .filter((word, index, self) => self.indexOf(word) === index); // Remove duplicates
                                setWordsToAdd(words);
                                setShowModal(true);
                            },
                        },
                    },
                    spellChecker: {},
                },
            });

            // Store the quill instance in the ref
            quillRef.current = quill;

            // Update visibility of buttons based on content
            const updateToolbar = () => {
                const empty = isQuillEmpty(quill);
                setIsEditorEmpty(empty);

                // Get the autocomplete button only
                const autocompleteButton = document.querySelector(".ql-autocomplete");

                if (autocompleteButton) {
                    if (empty) {
                        (autocompleteButton as HTMLElement).style.display = "";
                    } else {
                        (autocompleteButton as HTMLElement).style.display = "none";
                    }
                }
            };

            // Initial toolbar update
            updateToolbar();

            // Update toolbar on text change
            quill.on("text-change", () => {
                updateToolbar();
                const content = quill.root.innerHTML;
                if (props.onChange) {
                    const cleanedContents = getCleanedHtml(content);

                    // New function to remove excessive empty paragraphs and line breaks
                    const removeExcessiveEmptyTags = (html: string) => {
                        return html
                            .replace(/<p><br><\/p>/g, "<p></p>") // Replace <p><br></p> with <p></p>
                            .replace(/<p><\/p>(\s*<p><\/p>)+/g, "<p></p>") // Remove consecutive empty paragraphs
                            .replace(/^(\s*<p><\/p>)+/, "") // Remove leading empty paragraphs
                            .replace(/(\s*<p><\/p>)+$/, ""); // Remove trailing empty paragraphs
                    };

                    const trimmedContent = removeExcessiveEmptyTags(cleanedContents);

                    const arrayOfParagraphs = trimmedContent
                        .trim()
                        .split("</p>")
                        .map((p) => p.trim())
                        .filter((p) => p !== "");

                    const finalParagraphs = arrayOfParagraphs.map((p) =>
                        p.startsWith("<p>") ? `${p}</p>` : `<p>${p}</p>`
                    );

                    const firstParagraph = finalParagraphs[0] || "";
                    const restOfParagraphs = finalParagraphs.slice(1) || [];
                    const firstParagraphWithoutP = firstParagraph.trim().slice(3, -4);
                    const contentIsEmpty = isQuillEmpty(quill);

                    const finalContent = contentIsEmpty
                        ? ""
                        : [`<span>${firstParagraphWithoutP}</span>`, ...restOfParagraphs].join("");

                    props.onChange({
                        html: contentIsEmpty ? "\n" : finalContent,
                    });
                }
            });

            // Register spellchecker
            if ((window as any).vscodeApi) {
                registerQuillSpellChecker(Quill, (window as any).vscodeApi);
            }
        }
    }, []);

    useEffect(() => {
        if (quillRef.current && revertedValue !== undefined) {
            const quill = quillRef.current;
            // Only update if the content is empty or if revertedValue is non-empty
            if (isQuillEmpty(quill) && revertedValue) {
                quill.root.innerHTML = revertedValue;
                // Move the cursor to the end
                quill.setSelection(quill.getLength(), 0);
            }
        }
    }, [revertedValue]);

    const llmCompletion = async () => {
        window.vscodeApi.postMessage({
            command: "llmCompletion",
            content: {
                currentLineId: props.currentLineId,
            },
        } as EditorPostMessages);
    };

    const handleAddWords = () => {
        if (wordsToAdd.length > 0) {
            window.vscodeApi.postMessage({
                command: "addWord",
                words: wordsToAdd,
            });
        }
        setShowModal(false);
    };

    // Add message listener for prompt response
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (quillRef.current) {
                const quill = quillRef.current;
                if (event.data.type === "providerSendsPromptedEditResponse") {
                    quill.root.innerHTML = event.data.content;
                } else if (event.data.type === "providerSendsLLMCompletionResponse") {
                    const completionText = event.data.content.completion;
                    quill.root.innerHTML = completionText; // Clear existing content
                }
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, []);

    return (
        <>
            <div ref={editorRef}></div>
            {showModal && (
                <div
                    style={{
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: "var(--vscode-editor-background)",
                        padding: "20px",
                        border: "1px solid var(--vscode-editor-foreground)",
                        borderRadius: "4px",
                        zIndex: 1000,
                    }}
                >
                    <h3>Add Words to Dictionary</h3>
                    <p style={{ margin: "10px 0" }}>
                        {wordsToAdd.length > 0
                            ? `Add all words to the dictionary?`
                            : "No words found in the content."}
                    </p>
                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                            justifyContent: "flex-end",
                            marginTop: "20px",
                        }}
                    >
                        <button onClick={() => setShowModal(false)}>Cancel</button>
                        {wordsToAdd.length > 0 && (
                            <button onClick={handleAddWords}>Add Words</button>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
