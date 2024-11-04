import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
export default function RichTextEditor() {
    const editorRef = useRef(null);
    const quillRef = useRef(null);
    useEffect(() => {
        if (!quillRef.current) {
            quillRef.current = new Quill(editorRef.current, {
                theme: 'snow',
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline'],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        ['link', 'image'],
                    ],
                },
            });
        }
    }, []);
    return (<div className="mt-2">
      <label className="block font-medium text-gray-700 ">Description</label> 
      <div className="border border-gray-300 rounded-md   shadow-sm mt-2">
        <div ref={editorRef} className="p-2" style={{ height: '200px' }}></div>
      </div>
    </div>);
}
