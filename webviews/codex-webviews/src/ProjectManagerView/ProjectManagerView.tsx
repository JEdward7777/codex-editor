import { useEffect, useState } from "react";
import {
    VSCodeButton,
    VSCodeDataGrid,
    VSCodeDataGridCell,
    VSCodeDataGridRow,
    VSCodePanelTab,
    VSCodePanelView,
    VSCodePanels,
} from "@vscode/webview-ui-toolkit/react";
import { ProjectOverview } from "../../../../types";
import { ProjectList } from "./ProjectList";
import "./App.css";

declare const vscode: {
    postMessage: (message: any) => void;
};

interface ProjectState {
    projects:
        | Array<{
              name: string;
              path: string;
              lastOpened?: Date;
              lastModified: Date;
              version: string;
              hasVersionMismatch?: boolean;
              isOutdated?: boolean;
          }>
        | [];
    watchedFolders: [];
    projectOverview: ProjectOverview | null;
    isScanning: boolean;
    canInitializeProject: boolean;
    workspaceIsOpen: boolean;
}

const getLanguageDisplay = (languageObj: any): string => {
    if (!languageObj) return "Missing";
    if (typeof languageObj === "string") return languageObj;
    if (languageObj.name && typeof languageObj.name === "object") {
        const name = languageObj.name.en || Object.values(languageObj.name)[0];
        return languageObj.tag ? `${name} (${languageObj.tag})` : name;
    }
    return "Unknown";
};

// Add this helper component for consistent styling
interface ProjectFieldProps {
    label: string;
    value: React.ReactNode;
    icon?: string;
    onAction?: () => void;
    hasWarning?: boolean;
}

const ProjectField = ({ label, value, icon, onAction, hasWarning }: ProjectFieldProps) => (
    <div
        style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            padding: "0.75rem",
            backgroundColor: "var(--vscode-list-hoverBackground)",
            borderRadius: "4px",
        }}
    >
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "1rem",
            }}
        >
            <span style={{ fontWeight: "bold" }}>{label}</span>
            {onAction && icon && (
                <VSCodeButton onClick={onAction}>
                    <i className={`codicon codicon-${icon}`}></i>
                </VSCodeButton>
            )}
        </div>
        <div
            style={{
                color: hasWarning ? "var(--vscode-errorForeground)" : "inherit",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
            }}
        >
            {value}
            {hasWarning && <i className="codicon codicon-warning"></i>}
        </div>
    </div>
);

function ProjectManagerView() {
    const [state, setState] = useState<ProjectState>({
        projects: [],
        projectOverview: null,
        isScanning: true,
        watchedFolders: [],
        canInitializeProject: false,
        workspaceIsOpen: true,
    });

    const [initialized, setInitialized] = useState(false);
    const [retryCount, setRetryCount] = useState(0);

    const handleAction = (command: string, data?: any) => {
        vscode.postMessage({ command, data });
        
        // List of commands that modify the project state
        const stateChangingCommands = [
            "initializeProject",
            "renameProject",
            "changeUserName",
            "changeSourceLanguage",
            "changeTargetLanguage",
            "editAbbreviation",
            "selectCategory",
            "openSourceUpload",
            "openAISettings",
            "exportProjectAsPlaintext"
        ];

        // If the command modifies state, request a refresh
        if (stateChangingCommands.includes(command)) {
            // Add a small delay to allow the command to complete
            setTimeout(() => {
                vscode.postMessage({ command: "refreshState" });
            }, 100);
        }
    };

    useEffect(() => {
        const handler = (message: MessageEvent) => {
            if (message.data.type === "stateUpdate") {
                setState(message.data.state);
                setInitialized(true);
            }
        };

        window.addEventListener("message", handler);

        // Initial state request with retry logic
        const requestInitialState = () => {
            vscode.postMessage({ command: "webviewReady" });
        };

        const retryWithBackoff = () => {
            if (!initialized && retryCount < 5) {
                // Max 5 retries
                const backoffTime = Math.min(1000 * Math.pow(2, retryCount), 10000); // Max 10 seconds
                setTimeout(() => {
                    requestInitialState();
                    setRetryCount((prev) => prev + 1);
                }, backoffTime);
            }
        };

        // Initial request
        requestInitialState();

        // Setup retry timer
        const retryTimer = setTimeout(retryWithBackoff, 1000);

        return () => {
            window.removeEventListener("message", handler);
            clearTimeout(retryTimer);
        };
    }, [initialized, retryCount]);

    // Show loading state with retry information
    if (!initialized) {
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    gap: "1rem",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                    }}
                >
                    <i className="codicon codicon-loading codicon-modifier-spin"></i>
                    <span>
                        Loading project manager
                        {retryCount > 0 ? ` (attempt ${retryCount + 1})` : ""}...
                    </span>
                </div>
                {retryCount >= 5 && (
                    <VSCodeButton
                        onClick={() => {
                            setRetryCount(0);
                            vscode.postMessage({ command: "webviewReady" });
                        }}
                    >
                        <i className="codicon codicon-refresh"></i>
                        Retry Loading
                    </VSCodeButton>
                )}
            </div>
        );
    }

    // Show scanning indicator only after initial load
    if (state.isScanning) {
        return (
            <div
                style={{
                    padding: "1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                }}
            >
                <i className="codicon codicon-loading codicon-modifier-spin"></i>
                <span>Scanning projects...</span>
            </div>
        );
    }

    const activePanel = state.projectOverview ? "current-project" : "all-projects";

    return (
        <div
            style={{
                height: "100vh",
                padding: "0.25rem",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <VSCodePanels activeid={activePanel}>
                <VSCodePanelTab id="current-project">Current Project</VSCodePanelTab>
                <VSCodePanelTab id="all-projects">All Projects</VSCodePanelTab>

                <VSCodePanelView id="current-project-view">
                    {state.canInitializeProject ? (
                        // Show initialize button when we can initialize
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100%",
                            }}
                        >
                            <VSCodeButton onClick={() => handleAction("initializeProject")}>
                                <i className="codicon codicon-plus"></i>
                                <div style={{ marginInline: "0.25rem" }}>Initialize Project</div>
                            </VSCodeButton>
                        </div>
                    ) : state.projectOverview ? (
                        // Show project details when we have metadata
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "1rem",
                                margin: "0 auto",
                                width: "100%",
                            }}
                        >
                            <ProjectField
                                label="Project Name"
                                value={state.projectOverview.projectName ?? "Missing"}
                                icon="pencil"
                                onAction={() => handleAction("renameProject")}
                                hasWarning={!state.projectOverview.projectName}
                            />

                            <ProjectField
                                label="User Name"
                                value={state.projectOverview.userName ?? "Missing"}
                                icon="account"
                                onAction={() => handleAction("changeUserName")}
                                hasWarning={!state.projectOverview.userName}
                            />

                            <ProjectField
                                label="Source Language"
                                value={getLanguageDisplay(state.projectOverview.sourceLanguage)}
                                icon="source-control"
                                onAction={() => handleAction("changeSourceLanguage")}
                                hasWarning={!state.projectOverview.sourceLanguage}
                            />

                            <ProjectField
                                label="Target Language"
                                value={getLanguageDisplay(state.projectOverview.targetLanguage)}
                                icon="globe"
                                onAction={() => handleAction("changeTargetLanguage")}
                                hasWarning={!state.projectOverview.targetLanguage}
                            />

                            <ProjectField
                                label="Abbreviation"
                                value={state.projectOverview.abbreviation?.toString() ?? "Missing"}
                                icon="pencil"
                                onAction={() => handleAction("editAbbreviation")}
                                hasWarning={!state.projectOverview.abbreviation}
                            />

                            <ProjectField
                                label="Category"
                                value={String(state.projectOverview.category) ?? "Missing"}
                                icon="pencil"
                                onAction={() => handleAction("selectCategory")}
                                hasWarning={!state.projectOverview.category}
                            />

                            <ProjectField
                                label="Source Texts"
                                value={
                                    state.projectOverview.sourceTexts &&
                                    state.projectOverview.sourceTexts.length > 0
                                        ? `${state.projectOverview.sourceTexts.length} texts`
                                        : "Missing"
                                }
                                icon="preview"
                                onAction={() => handleAction("openSourceUpload")}
                                hasWarning={!state.projectOverview.sourceTexts?.length}
                            />

                            <div
                                style={{
                                    display: "flex",
                                    gap: "1rem",
                                    flexWrap: "wrap",
                                    marginTop: "1rem",
                                }}
                            >
                                <VSCodeButton onClick={() => handleAction("openAISettings")}>
                                    <i className="codicon codicon-settings"></i> Copilot Settings
                                </VSCodeButton>

                                <VSCodeButton
                                    onClick={() => handleAction("exportProjectAsPlaintext")}
                                >
                                    <i className="codicon codicon-export"></i> Export Project
                                </VSCodeButton>

                                <VSCodeButton
                                    onClick={() => alert("Publish Project not implemented yet.")}
                                >
                                    <i className="codicon codicon-cloud-upload"></i> Publish Project
                                </VSCodeButton>
                            </div>
                        </div>
                    ) : (
                        // Show message when no project is available
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100%",
                            }}
                        >
                            <span>No project found in current workspace</span>
                        </div>
                    )}
                </VSCodePanelView>

                <VSCodePanelView id="all-projects-view">
                    <ProjectList
                        projects={state.projects}
                        watchedFolders={state.watchedFolders || []}
                        onCreateNew={() => handleAction("createNewWorkspaceAndProject")}
                        onOpenProject={(path) => handleAction("openProject", { path })}
                        onAddWatchFolder={() => handleAction("addWatchFolder")}
                        onRemoveWatchFolder={(path) => handleAction("removeWatchFolder", { path })}
                        onRefreshProjects={() => handleAction("refreshProjects")}
                        showBackButton={false}
                    />
                </VSCodePanelView>
            </VSCodePanels>
        </div>
    );
}

export default ProjectManagerView;
