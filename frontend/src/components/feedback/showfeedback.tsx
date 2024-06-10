import React, {useEffect, useRef} from 'react';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import type { ToolbarProps, ToolbarSlot, TransformToolbarSlot } from '@react-pdf-viewer/toolbar';


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

        
      //=====================================================================
      const transform: TransformToolbarSlot = (slot: ToolbarSlot) => ({
        ...slot,
        GoToNextPage: () => <></>,
        GoToNextPageMenuItem: () => <></>,
        GoToPreviousPage: () => <></>,
        GoToPreviousPageMenuItem: () => <></>,
        GoToLastPage: () => <></>,
        GoToLastPageMenuItem: () => <></>,
        GoToFirstPage: () => <></>,
        GoToFirstPageMenuItem: () => <></>,
        Download: () => <></>,
        DownloadMenuItem: () => <></>,
        EnterFullScreen: () => <></>,
        EnterFullScreenMenuItem: () => <></>,
        Open: () => <></>,
        OpenMenuItem: () => <></>,
        Print: () => <></>,
        PrintMenuItem: () => <></>, 
        Rotate: () => <></>,
        RotateBackwardMenuItem: () => <></>,
        RotateForwardMenuItem: () => <></>,
        ShowProperties: () => <></>,
        ShowPropertiesMenuItem: () => <></>,
        SwitchScrollMode: () => <></>,
        SwitchScrollModeMenuItem: () => <></>,
        SwitchSelectionMode: () => <></>,
        SwitchSelectionModeMenuItem: () => <></>,
        SwitchTheme: () => <></>,
        SwitchThemeMenuItem: () => <></>,
        CurrentPageInput: () => <></>,
        CurrentPage: () => <></>,
        CurrentPagePanel: () => <></>,
        CurrentPageInputPopover: () => <></>,
        CurrentPageInputMenuItem: () => <></>,
        MoreActionsPopover: () => <></>,
        MoreActionsPopoverMenuItem: () => <></>,          
        NumberOfPages: () => <></>,
        NumberOfPagesMenuItem: () => <></>,
        ShowSearchPopover: () => <></>,
        ShowSearchPopoverMenuItem: () => <></>,
    });

    const renderToolbar = (Toolbar: (props: ToolbarProps) => React.ReactElement) => (
        <Toolbar>{renderDefaultToolbar(transform)}</Toolbar>
    );
        
    // Create an instance of the default layout plugin
    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        sidebarTabs: (defaultTabs) => [ ],
        renderToolbar,
    });

    const { renderDefaultToolbar } = defaultLayoutPluginInstance.toolbarPluginInstance;


    const [notes, setNotes] = React.useState<Note[]>([]);

    const [numPages, setNumPages] = React.useState(0);

    const onDocumentLoad = ({ numPages }) => {
    setNumPages(numPages);
    };


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
    // const jumpToNote = (note: Note) => {
    //     console.log("jumpToNote called with note", note);
    //     // Use the first highlight area of the note to jump to it
    //     if (note.highlightAreas.length > 0) {
    //         jumpToHighlightArea(note.highlightAreas[0]);
    //     } else {
    //         console.log("No highlight areas found for note");
    //     }
    // };

    const highlightEles = useRef(new Map()).current;

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
                                ref={ele => highlightEles.set(`${note.id}-${idx}`, ele)}
                            />
                        ))}
                </React.Fragment>
            ))}
        </div>
    );

    const highlightPluginInstance = highlightPlugin({
        renderHighlights,
    });

    // const { jumpToHighlightArea } = highlightPluginInstance;

    // const jumpToNote = (highlightArea) => {
    //     // Get the container element that holds your PDF viewer
    //     const container = document.getElementById('pdf-viewer-container');
    
    //     if (!container) {
    //         console.error('Container element not found');
    //         return;
    //     }
    
    //     // Calculate the scroll position
    //     // These calculations may need to be adjusted based on the size of your pages and the scale of your viewer
    //     const pageHeight = container.scrollHeight / numPages; // Replace numPages with the total number of pages in your document
    //     const scrollTop = pageHeight * highlightArea.pageIndex + highlightArea.top;
    //     const scrollLeft = highlightArea.left;
    
    //     // Scroll to the calculated position
    //     container.scrollTop = scrollTop;
    //     container.scrollLeft = scrollLeft;
    // };

    // Scroll 
    function Note({ note }) {
        const noteRef = useRef(null);

        const jumpToHighlightArea = (note) => {
            const highlightEle = highlightEles.get(`${note.id}-0`);
            if (highlightEle) {
                const yOffset = -90; // Adjust this value to set the height offset
                const y = highlightEle.getBoundingClientRect().top + window.pageYOffset + yOffset;
                
                window.scrollTo({
                    top: y,
                    behavior: 'smooth'
                });
            }
        };
        return (
          <div key={note.id} ref={noteRef}>
            <div
              style={{
                borderBottom: '1px solid rgba(0, 0, 0, .3)',
                cursor: 'pointer',
                padding: '8px',
              }}
              onClick={() => {
                jumpToHighlightArea(note);
              }}
            >
              {/* ...rest of your note component */}
              <blockquote
                    style={{
                        borderLeft: '2px solid rgba(0, 0, 0, 0.2)',
                        fontSize: '.75rem',
                        lineHeight: 1.5,
                        margin: '0 0 8px 0',
                        paddingLeft: '8px',
                        textAlign: 'justify',
                        color: 'grey',
                    }}
                >
                    {note.quote}
                </blockquote>
                {note.content}          
            </div>
          </div>
        );
      }
    

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
                id="pdf-viewer-container"
                style={{
                    flex: '1 1 0',
                    overflow: 'auto',
                }}
            >
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">                
                {fileURL && 
                        <Viewer 
                            fileUrl={fileURL} 
                            plugins={[defaultLayoutPluginInstance,highlightPluginInstance]} 
                            onDocumentLoad={onDocumentLoad}
                        />
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
                    {notes.map((note) => (
                        <Note note={note} />
                    ))}             
                </div>
            )}
        </div>
    );
}
 
export default ShowFeedback;