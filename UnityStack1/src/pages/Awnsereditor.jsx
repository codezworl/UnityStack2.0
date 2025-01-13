import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import the Quill styles

function AnswerEditor({ onSubmit }) {
  const [answer, setAnswer] = useState(''); // State to store the editor content

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(answer); // Pass the answer to the parent component
    }
    setAnswer(''); // Clear the editor after submission
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <h2 style={{ marginBottom: '10px' }}>Your Answer</h2>
      <ReactQuill
        value={answer}
        onChange={setAnswer}
        modules={{
          toolbar: [
            ['bold', 'italic', 'underline'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image', 'code-block'],
            [{ header: [1, 2, 3, false] }],
            ['clean'],
          ],
        }}
        style={{
          height: '200px',
          marginBottom: '20px',
          border: '1px solid #ccc',
          borderRadius: '5px',
        }}
      />
      <button
        onClick={handleSubmit}
        style={{
          backgroundColor: '#007BFF',
          color: '#fff',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Post Your Answer
      </button>
    </div>
  );
}

export default AnswerEditor;
