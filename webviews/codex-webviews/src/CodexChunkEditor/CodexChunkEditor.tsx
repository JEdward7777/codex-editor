import React from "react";
import { useState, useEffect } from "react";
import Editor from "./Editor";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
declare function acquireVsCodeApi(): any;
const vscode = acquireVsCodeApi();

// make vscode available globally
(window as any).vscodeApi = vscode;

import {
    EditorVerseContent,
    EditorPostMessages,
    CustomNotebookData,
} from "../../../../types";
import CloseButtonWithConfirmation from "../components/CloseButtonWithConfirmation";
import { getCleanedHtml } from "./react-quill-spellcheck";
// TODO: add a language type for the translation unit heading aka the book names
// TODO: stop user from closing current editor when they have unsaved changes
// TODO: save each change to the verse metadata as "working copy"

const CodexChunkEditor: React.FC = () => {
    const [content, setContent] = useState<CustomNotebookData>(
        {} as CustomNotebookData,
    );
    const [spellCheckResponse, setSpellCheckResponse] =
        useState<CustomNotebookData>({} as CustomNotebookData);
    const [contentBeingUpdated, setContentBeingUpdated] =
        useState<EditorVerseContent>({} as EditorVerseContent);

    const [chapterIndex, setChapterIndex] = useState<number>(0);

    useEffect(() => {
        const messageListener = (event: MessageEvent) => {
            console.log({ event });
            const message = event.data;
            switch (message.type) {
                case "update":
                    try {
                        const jsonContent = JSON.parse(message.content);
                        setContent(jsonContent);
                    } catch (error) {
                        console.error("Failed to parse JSON content:", error);
                    }
                    break;
                case "spellCheckResponse":
                    try {
                        console.log({ message });

                        setSpellCheckResponse(message.content);
                    } catch (error) {
                        console.error("Failed to parse JSON content:", error);
                    }
                    break;
            }
        };

        window.addEventListener("message", messageListener);
        vscode.postMessage({
            command: "getContent",
        } as EditorPostMessages);

        return () => window.removeEventListener("message", messageListener);
    }, []);

    const scriptureCells = content?.cells?.filter(
        (cell) => cell.language === "scripture",
    );
    const verseRefRegex = /(?<=^|\s)(?=[A-Z, 1-9]{3} \d{1,3}:\d{1,3})/;
    const processVerseContent = (cellContent: string) => {
        console.log({ cellContent });
        const lines = cellContent.split(verseRefRegex);
        console.log({ lines });
        const processedLines: {
            verseMarkers: string[];
            verseContent: string;
        }[] = lines
            .map((line) => {
                const verseMarker = line.match(
                    /(\b[A-Z, 1-9]{3}\s\d+:\d+\b)/,
                )?.[0];

                if (verseMarker) {
                    const lineWithoutVerseRefMarker = line
                        .replace(`${verseMarker} `, "")
                        .replace(`${verseMarker}\n`, "")
                        .replace(`${verseMarker}`, "");

                    return {
                        verseMarkers: [verseMarker],
                        verseContent: lineWithoutVerseRefMarker,
                    };
                }
                return null;
            })
            .filter((line) => line !== null);
        return processedLines;
    };

    const translationUnits =
        scriptureCells?.length > 0
            ? processVerseContent(scriptureCells[chapterIndex].value).filter(
                  (value) => !!value,
              )
            : [];
    const unsavedChanges = !!(
        contentBeingUpdated.content &&
        getCleanedHtml(contentBeingUpdated.content) &&
        getCleanedHtml(contentBeingUpdated.content).replace(/\s/g, "") !==
            translationUnits?.[
                contentBeingUpdated.verseIndex
            ]?.verseContent.replace(/\s/g, "")
    );

    const handleCloseEditor = () => {
        setContentBeingUpdated({} as EditorVerseContent);
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <h1>{translationUnits[0]?.verseMarkers[0].split(":")[0]}</h1>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    maxWidth: "30rem",
                    width: "100%",
                }}
            >
                <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                >
                    <button
                        disabled={chapterIndex === 0 || unsavedChanges}
                        onClick={() => {
                            setChapterIndex(chapterIndex - 1);
                        }}
                    >
                        ⬅
                    </button>
                    <button
                        disabled={
                            chapterIndex === scriptureCells?.length - 1 ||
                            unsavedChanges
                        }
                        style={{
                            transform: "rotate(180deg)",
                        }}
                        onClick={() => {
                            setChapterIndex(chapterIndex + 1);
                        }}
                    >
                        ⬅
                    </button>
                </div>
                <p>
                    {translationUnits?.map(
                        ({ verseMarkers, verseContent }, verseIndex) => {
                            const verseMarker = verseMarkers?.join(" ");
                            if (
                                verseMarker ===
                                contentBeingUpdated.verseMarkers?.join(" ")
                            ) {
                                return (
                                    <div key={verseIndex}>
                                        <div key={`${verseIndex}`}>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flex: 1,
                                                    justifyContent:
                                                        "space-between",
                                                }}
                                            >
                                                <h3>{verseMarker}</h3>
                                                {!unsavedChanges && (
                                                    <button
                                                        onClick={
                                                            handleCloseEditor
                                                        }
                                                        disabled={
                                                            unsavedChanges
                                                        }
                                                    >
                                                        ❌
                                                    </button>
                                                )}
                                                {unsavedChanges && (
                                                    <CloseButtonWithConfirmation
                                                        handleDeleteButtonClick={
                                                            handleCloseEditor
                                                        }
                                                    />
                                                )}
                                            </div>
                                            <div className="text-editor">
                                                <Editor
                                                    // vscode={vscode}
                                                    key={`${verseIndex}-quill`}
                                                    value={verseContent}
                                                    spellCheckResponse={
                                                        spellCheckResponse
                                                    }
                                                    onChange={({
                                                        html,
                                                        // markdown,
                                                    }) => {
                                                        console.log({
                                                            verseIndex,
                                                            verseMarker,
                                                            // markdown,
                                                            html,
                                                        });
                                                        setContentBeingUpdated({
                                                            verseIndex,
                                                            verseMarkers,
                                                            content:
                                                                html.endsWith(
                                                                    "\n",
                                                                )
                                                                    ? html
                                                                    : `${html}\n`,
                                                        });
                                                    }}
                                                />
                                                <button
                                                    onClick={() => {
                                                        vscode.postMessage({
                                                            command:
                                                                "saveMarkdown",
                                                            content:
                                                                contentBeingUpdated,
                                                        } as EditorPostMessages);

                                                        // TODO: set a loading state until the message is processed and the content is saved
                                                        handleCloseEditor();
                                                    }}
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            } else if (verseContent.length > 0) {
                                return (
                                    <>
                                        {" "}
                                        <sup style={{ marginRight: "0.1rem" }}>
                                            {
                                                verseMarker
                                                    .split(" ")[1]
                                                    .split(":")[1]
                                            }
                                        </sup>
                                        <span
                                            onClick={() => {
                                                if (!unsavedChanges) {
                                                    setContentBeingUpdated({
                                                        verseMarkers,
                                                        content: verseContent,
                                                        verseIndex,
                                                    });
                                                    vscode.postMessage({
                                                        command:
                                                            "setCurrentIdToGlobalState",
                                                        content: {
                                                            currentLineId:
                                                                verseMarker,
                                                        },
                                                    } as EditorPostMessages);
                                                }
                                            }}
                                            style={{
                                                cursor: !unsavedChanges
                                                    ? "pointer"
                                                    : "default",
                                                transition: !unsavedChanges
                                                    ? "none"
                                                    : "background-color 0.3s",
                                            }}
                                            onMouseEnter={(e) =>
                                                (e.currentTarget.style.backgroundColor =
                                                    "#f0f0f0")
                                            }
                                            onMouseLeave={(e) =>
                                                (e.currentTarget.style.backgroundColor =
                                                    "transparent")
                                            }
                                            dangerouslySetInnerHTML={{
                                                __html: verseContent,
                                            }}
                                        />
                                    </>
                                );
                            } else {
                                return (
                                    <p
                                        style={{
                                            cursor: "pointer",
                                            transition: "background-color 0.3s",
                                        }}
                                        onMouseEnter={(e) =>
                                            (e.currentTarget.style.backgroundColor =
                                                "#f0f0f0")
                                        }
                                        onMouseLeave={(e) =>
                                            (e.currentTarget.style.backgroundColor =
                                                "transparent")
                                        }
                                        onClick={() => {
                                            setContentBeingUpdated({
                                                verseMarkers,
                                                content: "",
                                                verseIndex,
                                            });
                                        }}
                                    >
                                        {verseMarker}
                                    </p>
                                );
                            }
                        },
                    )}
                </p>
            </div>
        </div>
    );
};

export default CodexChunkEditor;