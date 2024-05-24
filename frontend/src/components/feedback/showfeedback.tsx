import React, {useEffect} from 'react';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

import {
    highlightPlugin,
    HighlightArea,
    RenderHighlightsProps,
} from '@react-pdf-viewer/highlight';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/highlight/lib/styles/index.css';

import { 
    Viewer, 
    Worker 
} from '@react-pdf-viewer/core';

interface Note {
    // The generated unique identifier
    id: number;
    // The note content
    content: string;
    // The list of highlight areas
    highlightAreas: HighlightArea[];
    // The selected text
    quote: string;
}

interface ShowFeedback {
    fileURL: string;
    sub_id: string; // Add this line
}

const ShowFeedback: React.FC<ShowFeedback> = ({ fileURL, sub_id }) => {

        
    // Create an instance of the default layout plugin
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    const [notes, setNotes] = React.useState<Note[]>([]);

    useEffect(() => {

        if(sub_id) {
        // Fetch notes from the database
        fetchNotesFromDatabase(sub_id)
            .then((notes) => {
                setNotes(notes);
            })
            .catch((error) => {
                console.error('Failed to fetch notes:', error);
            });
        }

    }, [sub_id]);

    const fetchNotesFromDatabase = async (sub_id: string) => {
        const response = await fetch(`/api/feedback/getfeedback?sub_id=${sub_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    
        if (!response.ok) {
            throw new Error('Failed to fetch notes');
        }
    
        const data = await response.json();
        // console.log("Data from fetchNotesFromDatabase", data);
        return data[0]?.feedback || [];
    };

    // PDF PLUGIN

    // Modify the jumpToNote function
    const jumpToNote = (note: Note) => {
        console.log("jumpToNote called with note", note);
        // Use the first highlight area of the note to jump to it
        if (note.highlightAreas.length > 0) {
            jumpToHighlightArea(note.highlightAreas[0]);
        } else {
            console.log("No highlight areas found for note");
        }
    };

    const renderHighlights = (props: RenderHighlightsProps) => (
        <div>
            {notes.map((note) => (
                <React.Fragment key={note.id}>
                    {note.highlightAreas
                        .filter((area) => area.pageIndex === props.pageIndex)
                        .map((area, idx) => (
                            <div
                                key={idx}
                                style={Object.assign(
                                    {},
                                    {
                                        background: 'yellow',
                                        opacity: 0.4,
                                        pointerEvents: 'auto',
                                    },
                                    props.getCssProperties(area, props.rotation)
                                )}
                                onClick={(event) => {
                                    console.log("Highlight clicked");
                                    event.stopPropagation();
                                    console.log("Clicked note", note);
                                    jumpToNote(note);
                                }}
                            />
                        ))}
                </React.Fragment>
            ))}
        </div>
    );

    const highlightPluginInstance = highlightPlugin({
        renderHighlights,
    });

    const { jumpToHighlightArea } = highlightPluginInstance;
    

    // console.log(typeof jumpToHighlightArea); // should log 'function'

    return ( 
        <div
            style={{
                border: '1px solid rgba(0, 0, 0, 0.3)',
                display: 'flex',
                height: '100%',
                overflow: 'hidden',
            }}
        >
            <div
                style={{
                    flex: '1 1 0',
                    overflow: 'auto',
                }}
            >
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">                
                {fileURL && 
                        <Viewer fileUrl={fileURL} plugins={[defaultLayoutPluginInstance,highlightPluginInstance]} />
                }
            </Worker>
            </div>

            {notes.length > 0 && (
                <div
                    style={{
                        borderLeft: '1px solid rgba(0, 0, 0, 0.3)',
                        width: '25%',
                        overflow: 'auto',
                    }}
                >
                    {notes.map((note) => {
                        return (
                            <div key={note.id}>
                                <div
                                    style={{
                                        borderBottom: '1px solid rgba(0, 0, 0, .3)',
                                        cursor: 'pointer',
                                        padding: '8px',
                                    }}
                                    // Jump to the associated highlight area
                                    onClick={() => {
                                        // console.log('Clicked note with highlight area', note.highlightAreas[0]);
                                        jumpToHighlightArea(note.highlightAreas[0]);
                                    }}
                                >
                                    <blockquote
                                        style={{
                                            borderLeft: '2px solid rgba(0, 0, 0, 0.2)',
                                            fontSize: '.75rem',
                                            lineHeight: 1.5,
                                            margin: '0 0 8px 0',
                                            paddingLeft: '8px',
                                            textAlign: 'justify',
                                        }}
                                    >
                                        {note.quote}
                                    </blockquote>
                                    {note.content}                            
                                </div>
                            </div>
                        );
                    })}                 
                </div>
            )}
        </div>
    );
}
 
export default ShowFeedback;