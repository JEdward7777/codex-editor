import React from "react";
import { EditorVerseContent } from "../../../../types";

interface EmptyVerseDisplayProps {
    verseMarkers: string[];
    setContentBeingUpdated: React.Dispatch<React.SetStateAction<EditorVerseContent>>;
    textDirection: "ltr" | "rtl";
}

const EmptyVerseDisplay: React.FC<EmptyVerseDisplayProps> = ({
    verseMarkers,
    setContentBeingUpdated,
    textDirection,
}) => {
    const handleClick = () => {
        setContentBeingUpdated({
            verseMarkers,
            content: "",
        });
    };

    return (
        <div
            className="empty-verse-display"
            onClick={handleClick}
            style={{ direction: textDirection }}
        >
            <span className="empty-verse-marker">{verseMarkers.join("-")}</span>
            <span className="empty-verse-prompt">Click to add verse</span>
        </div>
    );
};

export default EmptyVerseDisplay;
