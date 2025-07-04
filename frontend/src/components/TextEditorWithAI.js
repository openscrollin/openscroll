import React, { useEffect, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import axios from 'axios';

const TextEditorWithAI = ({ value, onChange }) => {
  const [loading, setLoading] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  const getSelectedText = () => {
    if (!editor) return '';
    const { from, to } = editor.state.selection;
    return editor.state.doc.textBetween(from, to, ' ');
  };

  const replaceSelectedText = (newText) => {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    editor.commands.insertContentAt({ from, to }, newText);
  };

  const handleEnhance = async (mode) => {
    const text = getSelectedText();
    if (!text) return alert('Please select some text to enhance.');

    setLoading(true);
    try {
      const res = await axios.post('/api/ai-enhance', { text, mode });
      replaceSelectedText(res.data.result);
    } catch (err) {
      console.error('AI Enhancement failed:', err);
      alert('Something went wrong.');
    }
    setLoading(false);
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
          marginBottom: '1rem',
        }}
      >
        <button
          onClick={() => handleEnhance('rephrase')}
          disabled={loading}
          style={buttonStyle}
        >
          ✍️ Rephrase
        </button>
        <button
          onClick={() => handleEnhance('correct')}
          disabled={loading}
          style={buttonStyle}
        >
          🛠 Fix Grammar
        </button>
        <button
          onClick={() => handleEnhance('tone')}
          disabled={loading}
          style={buttonStyle}
        >
          🎯 Improve Tone
        </button>
        {loading && <span style={{ fontSize: '0.95rem' }}>✨ Enhancing...</span>}
      </div>

      <div
        style={{
          border: '1px solid #ccc',
          padding: '1rem',
          borderRadius: '8px',
          minHeight: '150px',
          background: 'white',
        }}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

const buttonStyle = {
  padding: '0.5rem 1rem',
  backgroundColor: '#000',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  fontSize: '0.95rem',
  cursor: 'pointer',
};

export default TextEditorWithAI;
