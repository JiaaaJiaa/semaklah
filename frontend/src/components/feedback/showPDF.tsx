import React, {useEffect} from 'react';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

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
    const [editingNoteId, setEditingNoteId] = React.useState<number | null>(null);
    const [assign_id, setAssign_id] = React.useState<string>("");
    let noteId = notes.length;
    const [f1, setF1] = React.useState<string>("");
    const [f2, setF2] = React.useState<string>("");
    const [f3, setF3] = React.useState<string>("");


    // useEffect(() => {
    //     console.log("Notes changed", notes);
    // }, [notes]);

    // const noteEles: Map<number, HTMLElement> = new Map();

    

    useEffect(() => {
        fetchNotesFromDatabase(sub_id)
            .then((notes) => {
                setNotes(notes);
            })
            .catch((error) => {
                console.error('Failed to fetch notes:', error);
            });

        fetchsubmission(sub_id)
            .then((data) => {
                // console.log("Data from fetchsubmission", data.assign_id);
                setAssign_id(data.assign_id)
            })
            .catch((error) => {
                console.error('Failed to fetch submission:', error);
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
        // console.log("Data from fetchNotesFromDatabase", data);
        return data[0]?.feedback || [];
    };

    const fetchsubmission = async (sub_id: string) => {
        const response = await fetch(`/api/submission/submission-feedback/${sub_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    
        if (!response.ok) {
            throw new Error('Failed to fetch submission');
        }
    
        const data = await response.json();

        return data || [];
    };

    const generatefeedback = async (selectedText: string) => {
        const response = await fetch('/api/feedbackgeneration/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                assign_id,
                specific_sentence:selectedText }),
        });
    
        if (!response.ok) {
            console.error('Response status:', response.status);
            console.error('Response status text:', response.statusText);
            throw new Error('Failed to generate feedback');
        }
        const data = await response.json();
        if (data.sorted_feedback.length >= 1) {
            setF1(data.sorted_feedback[0]);
        }
        
        if (data.sorted_feedback.length >= 2) {
            setF2(data.sorted_feedback[1]);
        }
        
        if (data.sorted_feedback.length >= 3) {
            setF3(data.sorted_feedback[2]);
        }
    }

    const clearFields = () => {
        setF1('');
        setF2('');
        setF3('');
        setMessage('');
    }

    // PDF PLUGIN

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
                    <Button onClick={ () => {
                        generatefeedback(props.selectedText)
                        props.toggle()}}>
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
                // Validate highlightAreas
                const validHighlightAreas = props.highlightAreas.every(area => {
                    // Add checks for other properties as needed
                    return Number.isInteger(area.pageIndex) && area.pageIndex >= 0;
                });

                if (!validHighlightAreas) {
                    console.error('Invalid highlight area');
                    return;
                }

                const note: Note = {
                    id: uuidv4(), // Generate a unique ID
                    content: message,
                    highlightAreas: props.highlightAreas,
                    quote: props.selectedText,
                };
                setNotes(notes.concat([note]));
                setF1('');
                setF2('');
                setF3('');
                setMessage('');
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
                    minWidth: '150px',  // Minimum width
                    maxWidth: '520px',  // Maximum width
                    left: `${props.selectionRegion.left}%`,
                    top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
                    zIndex: 9999,
                }}
            >
                <div>
                    <textarea
                        rows={5}
                        style={{
                            border: '1px solid rgba(0, 0, 0, .3)',
                            minHeight: '50px',  // Minimum height
                            maxHeight: '200px', // Maximum height
                            minWidth: '100px',  // Minimum width
                            maxWidth: '500px',  // Maximum width
                            resize: 'both'      // Allow the user to resize both horizontally and vertically
                        }}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    ></textarea>
                </div>
                <div
                    style={{
                        display: 'flex',
                        marginTop: '8px',
                        zIndex: 9999,
                    }}
                >
                    <div style={{ marginRight: '8px' }}>
                        <PrimaryButton onClick={addNote}>Add</PrimaryButton>
                    </div>
                    <Button onClick={() => {props.cancel(); clearFields();}}>Cancel</Button>
                </div>

    
                <p className="pt-5" onClick={() => setMessage(f1)}>{f1}</p>
                <p className="pt-5" onClick={() => setMessage(f2)}>{f2}</p>           
                <p className="pt-5" onClick={() => setMessage(f3)}>{f3}</p>
            </div>
        );
    };

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
                                // ref={(ref): void => {
                                //     noteEles.set(note.id, ref as HTMLElement);
                                //     console.log("Element stored for note", note.id, ref);
                                // }}
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

    const deleteNote = (id: number, sub_id: string) => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            const updatedNotes = notes.filter((note) => note.id !== id);
            setNotes(updatedNotes);
            saveNotesToDatabase(updatedNotes, sub_id); // Save the updated notes to the database
            // console.log("Deleting note with id:", id);
        }
    };

    const editNote = (id: number, sub_id: string) => {
        setEditingNoteId(id);
    };

    // Add a function to handle the change of the note content
    const handleNoteContentChange = (id: number, newContent: string) => {
        setNotes(notes.map((note) => note.id === id ? {...note, content: newContent} : note));
    };

    // Add a function to finish editing a note
    const finishEditingNote = (id: number, sub_id: string) => {
        setEditingNoteId(null);
        saveNotesToDatabase(notes, sub_id); // Save the updated notes to the database
    };


    const highlightPluginInstance = highlightPlugin({
        renderHighlightTarget,
        renderHighlightContent,
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
                                    {editingNoteId === note.id ? (
                                        <input
                                            value={note.content}
                                            onChange={(e) => handleNoteContentChange(note.id, e.target.value)}
                                            onBlur={() => finishEditingNote(note.id,sub_id)}
                                        />
                                    ) : (
                                        note.content
                                    )}

                                    <div style={{ textAlign: 'right' }}>
                                        <button onClick={(e) => { e.stopPropagation(); deleteNote(note.id, sub_id); }} style={{ padding: '5px', color: 'red' }}>
                                            <FontAwesomeIcon icon={faTrash} /> 
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); editNote(note.id, sub_id); }} style={{ padding: '5px', color: 'blue' }}>
                                            <FontAwesomeIcon icon={faEdit} /> 
                                        </button>                                
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    
                    <div>                        
                        <button 
                            className="flex items-center justify-center w-1/2 mx-auto mb-10 mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl"
                            onClick={() => saveNotesToDatabase(notes, sub_id)}
                        >
                            Save Comments
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
 
export default ShowPDF;