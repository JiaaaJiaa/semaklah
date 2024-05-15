import React, {useEffect} from 'react';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

import {
    highlightPlugin,
    HighlightArea,
    MessageIcon,
    RenderHighlightContentProps,
    RenderHighlightsProps,
    RenderHighlightTargetProps,
} from '@react-pdf-viewer/highlight';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/highlight/lib/styles/index.css';

import { 
    Button, 
    Position, 
    PrimaryButton, 
    Tooltip, 
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

interface ShowPDFProps {
    fileURL: string;
    sub_id: string; // Add this line
}

const ShowPDF: React.FC<ShowPDFProps> = ({ fileURL, sub_id }) => {

    // Create an instance of the default layout plugin
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    const [message, setMessage] = React.useState('');
    const [notes, setNotes] = React.useState<Note[]>([]);
    let noteId = notes.length;

    // useEffect(() => {
    //     console.log("Notes changed", notes);
    // }, [notes]);

    const noteEles: Map<number, HTMLElement> = new Map();

    useEffect(() => {
        fetchNotesFromDatabase(sub_id)
            .then((notes) => {
                setNotes(notes);
            })
            .catch((error) => {
                console.error('Failed to fetch notes:', error);
            });
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
        console.log("Data from fetchNotesFromDatabase", data);
        return data[0]?.feedback || [];
    };

    const renderHighlightTarget = (props: RenderHighlightTargetProps) => (
        <div
            style={{
                background: '#eee',
                display: 'flex',
                position: 'absolute',
                left: `${props.selectionRegion.left}%`,
                top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
                transform: 'translate(0, 8px)',
                zIndex: 1,
            }}
        >
            <Tooltip
                position={Position.TopCenter}
                target={
                    <Button onClick={props.toggle}>
                        <MessageIcon />
                    </Button>
                }
                content={() => <div style={{ width: '100px' }}>Add a note</div>}
                offset={{ left: 0, top: -8 }}
            />
        </div>
    );

    const renderHighlightContent = (props: RenderHighlightContentProps) => {
        const addNote = () => {
            if (message !== '') {
                const note: Note = {
                    id: ++noteId,
                    content: message,
                    highlightAreas: props.highlightAreas,
                    quote: props.selectedText,
                };
                setNotes(notes.concat([note]));
                props.cancel();
            }
        };

        return (
            <div
                style={{
                    background: '#fff',
                    border: '1px solid rgba(0, 0, 0, .3)',
                    borderRadius: '2px',
                    padding: '8px',
                    position: 'absolute',
                    left: `${props.selectionRegion.left}%`,
                    top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
                    zIndex: 1,
                }}
            >
                <div>
                    <textarea
                        rows={3}
                        style={{
                            border: '1px solid rgba(0, 0, 0, .3)',
                        }}
                        onChange={(e) => setMessage(e.target.value)}
                    ></textarea>
                </div>
                <div
                    style={{
                        display: 'flex',
                        marginTop: '8px',
                    }}
                >
                    <div style={{ marginRight: '8px' }}>
                        <PrimaryButton onClick={addNote}>Add</PrimaryButton>
                    </div>
                    <Button onClick={props.cancel}>Cancel</Button>
                </div>
            </div>
        );
    };

    const jumpToNote = (note) => {
    console.log("Attempting to jump to note with id:", note.id);
    const ele = noteEles.get(note.id);
        if (ele) {
            console.log("Found element for note, scrolling into view");
            ele.scrollIntoView();
        } else {
            console.log("No element found for note");
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
                                    },
                                    props.getCssProperties(area, props.rotation)
                                )}
                                onClick={() => {
                                    console.log("Clicked note", note);
                                    jumpToNote(note);
                                }}
                                ref={(ref): void => {
                                    noteEles.set(note.id, ref as HTMLElement);
                                }}
                            />
                        ))}
                </React.Fragment>
            ))}
        </div>
    );

    const saveNotesToDatabase = async (notes: Note[], sub_id: string) => {
        const response = await fetch('/api/feedback/savefeedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sub_id: sub_id, feedback: notes }),
        });
    
        if (!response.ok) {
            throw new Error('Failed to save notes');
        }
        if (response.status === 200) {
            alert('Comments saved successfully');
        }
    };

    const highlightPluginInstance = highlightPlugin({
        renderHighlightTarget,
        renderHighlightContent,
        renderHighlights,
    });

    const { jumpToHighlightArea } = highlightPluginInstance;

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
                            <div
                                key={note.id}
                                style={{
                                    borderBottom: '1px solid rgba(0, 0, 0, .3)',
                                    cursor: 'pointer',
                                    padding: '8px',
                                }}
                                // Jump to the associated highlight area
                                onClick={() => jumpToHighlightArea(note.highlightAreas[0])}
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
                        );
                    })}
                    
                    <div className="pt-5 flex justify-center">
                        <PrimaryButton onClick={() => saveNotesToDatabase(notes, sub_id)}>Save</PrimaryButton>
                    </div>
                </div>
            )}
        </div>
    );
}
 
export default ShowPDF;