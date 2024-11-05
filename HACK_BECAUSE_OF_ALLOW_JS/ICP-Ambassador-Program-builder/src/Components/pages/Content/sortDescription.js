import React, { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
export default function SortDescription({ initialDescription }) {
    const editorRef = useRef(null);
    const quillRef = useRef(null);
    const [description, setDescription] = useState(initialDescription || '');
    useEffect(() => {
        if (!quillRef.current) {
            quillRef.current = new Quill(editorRef.current, {
                theme: 'snow',
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'strike'],
                        ['blockquote', 'code-block', 'link', 'image'],
                        [{ 'align': [] }],
                        ['clean'],
                        [{ 'header': 1 }, { 'header': 2 }],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        [{ 'script': 'sub' }, { 'script': 'super' }],
                        ['hr'],
                    ],
                },
                placeholder: 'Type your description here...',
            });
            quillRef.current.clipboard.dangerouslyPasteHTML(description);
            quillRef.current.on('text-change', () => {
                setDescription(quillRef.current.root.innerHTML);
            });
        }
    }, [description]);
    return (<div className="mt-2">
      <div className="border border-gray-300 rounded-md shadow-sm mt-2">
        <div ref={editorRef} className="p-2 " style={{ height: '200px' }}></div>
      </div>
    </div>);
}
