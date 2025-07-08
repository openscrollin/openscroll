import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
//import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, auth } from './firebase'; // adjust path based on your project structure
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function AddArticle() {
const navigate = useNavigate();
const quillRef = useRef(null);

// State

const [title, setTitle] = useState('');
const [body, setBody] = useState('');
const [excerpt, setExcerpt] = useState('');
const [coverImage, setCoverImage] = useState('');

const [category, setCategory] = useState('');

const [isPremium, setIsPremium] = useState(false);
const [price, setPrice] = useState('');
const [saving, setSaving] = useState(false);
const [publishing, setPublishing] = useState(false);
const [error, setError] = useState('');
const [successMessage, setSuccessMessage] = useState('');
const [uploadingImage, setUploadingImage] = useState(false);


// Example categories (customize as needed)

const categories = [

'',

'Technology',
'Science',
'Fiction',
'Non-fiction',
'AI',
'Cyberpunk',
'Culture',
'Tutorial',
'Opinion',
'Other'

];





const handleImageUpload = async (e) => {

const file = e.target.files[0];

if (!file) return;

// Check if user is authenticated to Firebase
const user = auth.currentUser;
console.log("🔥 Firebase User during upload:", user);
if (!user) {
  setError('Please ensure you are logged in to upload images.');
  return;
}

setUploadingImage(true);
setError(''); // Clear any previous errors

try {

const storageRef = ref(storage, `coverImages/${Date.now()}_${file.name}`);

await uploadBytes(storageRef, file);

const downloadURL = await getDownloadURL(storageRef);

console.log("Uploaded URL:", downloadURL); // For debugging/confirmation

setCoverImage(downloadURL); // This will update your state and can be sent to MongoDB

} catch (err) {

console.error("Image upload failed:", err); // Log the actual error for debugging
console.error("Error details:", {
  code: err.code,
  message: err.message,
  stack: err.stack
});

// Assuming setError is a state setter function for displaying errors to the user.

setError(`Failed to upload image: ${err.message || 'Please try again.'}`);

} finally {

// This ensures setUploadingImage(false) is called regardless of success or failure.

setUploadingImage(false);

}

};





// Save as draft

const saveAsDraft = async () => {

setSaving(true);

setError('');

setSuccessMessage('');

await handleSubmit(false);

setSaving(false);

};



// Publish

const publishArticle = async () => {

setPublishing(true);

setError('');

setSuccessMessage('');

await handleSubmit(true);

setPublishing(false);

};



// Main submit logic

const handleSubmit = async (publish) => {

if (!title.trim() || !body.trim()) {

setError('Title and content are required.');

return;

}

if (!category) {

setError('Please select a category.');

return;

}



const writerData = JSON.parse(localStorage.getItem('openscroll_current_user'));

const token = localStorage.getItem('writerToken');

if (!writerData || !token) {

setError('User not authenticated.');

return;

}



const articleData = {

title: title.trim(),

body,

excerpt: excerpt || body.replace(/<[^>]+>/g, '').substring(0, 200) + '...',

category,

coverImage,

price: isPremium ? price : '0',

isPremium,

isPublished: publish,

authorName: writerData.name || writerData.fullName || 'Unknown Author',

authorEmail: writerData.email,

createdAt: new Date().toISOString(),

};



try {

const response = await fetch('https://openscroll-backend.onrender.com/api/addArticle', {

method: 'POST',

headers: {

'Authorization': Bearer ${token},

'Content-Type': 'application/json',

},

body: JSON.stringify(articleData),

});



const result = await response.json();

if (response.ok) {

setSuccessMessage(publish ? 'Article published successfully! Redirecting...' : 'Draft saved!');

setTimeout(() => navigate('/writer/dashboard'), 1800);

} else {

setError(result.message || 'Failed to save article.');

}

} catch (err) {

setError('Something went wrong. Please try again later.');

}

};



useEffect(() => {

// Remove AI suggestion trigger

// if (body.length > 100) {

// generateAISuggestions(body);

// }

}, [body]);



// --- Styles ---

const glass = {

background: 'rgba(24,26,19,0.85)',

borderRadius: 16,

boxShadow: '0 4px 32px #d0f33011',

border: '1.5px solid #d0f33022',

padding: 24,

marginBottom: 0,

};

const neon = { boxShadow: '0 0 24px #d0f33055' };

const input = {

width: '100%',

padding: '0.9rem 1rem',

fontSize: '1rem',

borderRadius: '12px',

border: '1px solid #e5e7eb',

backgroundColor: '#181a13',

color: '#fff',

marginBottom: '0.75rem',

outline: 'none'

};

const label = {

display: 'block',

fontWeight: '600',

fontSize: '0.95rem',

color: '#b6c2b6',

marginBottom: '0.4rem',

marginTop: '1rem',

};

const button = {

marginTop: 0,

padding: '0.8rem 1.5rem',

background: 'linear-gradient(90deg, #d0f330 60%, #b0e000 100%)',

color: '#111',

fontWeight: 700,

fontSize: '1rem',

border: 'none',

borderRadius: '12px',

cursor: 'pointer',

marginLeft: 8,

marginRight: 0,

boxShadow: '0 0 16px #d0f33044',

transition: 'background 0.18s, color 0.18s'

};

const ghostBtn = {

...button,

background: 'none',

color: '#d0f330',

boxShadow: 'none',

border: '1.5px solid #d0f33044',

marginLeft: 0,

marginRight: 8,

};



return (

<div

style={{

maxWidth: 1200,

margin: '0 auto',

padding: '2rem 1rem',

minHeight: '100vh',

background: '#07080a',

fontFamily: "'Nunito Sans', sans-serif",

position: 'relative',

}}

>

{/* Header */}

<div

style={{

display: 'flex',

alignItems: 'center',

justifyContent: 'space-between',

marginBottom: 32,

flexWrap: 'wrap',

gap: 16,

}}

>

<div>

<h1

style={{

fontSize: '2.2rem',

fontWeight: 700,

color: '#fff',

marginBottom: 6,

}}

>

Editor

</h1>

<p

style={{

color: '#d0f330',

opacity: 0.7,

fontFamily: 'monospace',

fontWeight: 600,

letterSpacing: 2,

}}

>

NEURAL.WRITING.ASSISTANT

</p>

</div>

{/* REMOVE BUTTONS FROM HEADER */}

{/* <div

style={{

display: 'flex',

alignItems: 'center',

gap: 12,

flexWrap: 'wrap',

}}

>

<button style={ghostBtn} onClick={saveAsDraft} disabled={saving}>

Save Draft

</button>

<button style={button} onClick={publishArticle} disabled={publishing}>

Publish

</button>

</div> */}

</div>



<div

className="add-article-grid"

style={{

display: 'grid',

gridTemplateColumns: '3fr 1fr',

gap: 32,

}}

>

{/* Main Editor */}

<div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

{/* Title */}

<div style={{ ...glass, ...neon }}>

<div

style={{

display: 'flex',

alignItems: 'center',

gap: 12,

marginBottom: 12,

flexDirection: 'row',

}}

>

<input

type="text"

placeholder="Enter your article title..."

value={title}

onChange={e => setTitle(e.target.value)}

style={{

...input,

fontSize: 22,

fontWeight: 600,

marginBottom: 0,

flex: 1,

minWidth: 0,

}}

/>

{/* Removed the AI Enhance button */}

</div>

</div>

{/* Content */}

<div style={{ ...glass, ...neon }}>

<div

style={{

display: 'flex',

alignItems: 'center',

justifyContent: 'space-between',

marginBottom: 12,

flexWrap: 'wrap',

gap: 8,

}}

>

<span style={{ color: '#fff', fontWeight: 600, fontSize: 17 }}>

Content

</span>

<div

style={{

display: 'flex',

alignItems: 'center',

gap: 8,

flexWrap: 'wrap',

}}

>

{/*

<button style={ghostBtn} onClick={() => setShowAiPanel(!showAiPanel)}>

AI Assistant

</button>

*/}

<span

style={{

color: '#b6c2b6',

fontFamily: 'monospace',

fontSize: 13,

}}

>

{body.length} chars

</span>

</div>

</div>

<div style={{ marginBottom: 50 }}>

<ReactQuill

value={body}

onChange={setBody}

ref={quillRef}

style={{

height: 260,

background: '#181a13',

color: '#fff',

borderRadius: 12,

}}

/>

</div>

</div>

{/* AI Suggestions */}

{/*

{aiSuggestions.length > 0 && (

<div style={{ ...glass, ...neon }}>

<div

style={{

display: 'flex',

alignItems: 'center',

gap: 8,

marginBottom: 12,

}}

>

<span

style={{

fontSize: 20,

color: '#d0f330',

animation: 'pulse 1s infinite alternate',

}}

>

⚡

</span>

<span

style={{

color: '#fff',

fontWeight: 600,

fontSize: 17,

}}

>

AI Suggestions

</span>

</div>

<div>

{aiSuggestions.map((s, i) => (

<div

key={i}

style={{

background: '#181a13',

border: '1px solid #d0f33022',

borderRadius: 10,

padding: '0.7rem 1rem',

marginBottom: 10,

}}

>

<span

style={{

fontSize: 12,

fontWeight: 700,

color:

s.type === 'grammar'

? '#f87171'

: s.type === 'style'

? '#38bdf8'

: '#a78bfa',

background:

s.type === 'grammar'

? '#f8717122'

: s.type === 'style'

? '#38bdf822'

: '#a78bfa22',

borderRadius: 8,

padding: '2px 8px',

marginRight: 8,

}}

>

{s.type.toUpperCase()}

</span>

<span style={{ color: '#b6c2b6', fontSize: 14 }}>

Replace "

<span style={{ color: '#f87171' }}>{s.text}</span>" with "

<span style={{ color: '#d0f330' }}>{s.suggestion}</span>"

</span>

</div>

))}

</div>

</div>

)}

*/}

</div>

{/* Sidebar */}

<div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

{/* Article Settings */}

<div style={{ ...glass, ...neon }}>

<span

style={{

color: '#fff',

fontWeight: 600,

fontSize: 17,

marginBottom: 16,

display: 'block',

}}

>

Article Settings

</span>

{/* Excerpt */}

<div style={{ marginBottom: 16 }}>

<label style={label}>Summary</label>

<textarea

value={excerpt}

onChange={e => setExcerpt(e.target.value)}

placeholder="Brief description of your article..."

style={{ ...input, height: 80, resize: 'none' }}

/>

{/* <button style={ghostBtn} onClick={generateExcerpt}>

Auto-generate

</button> */}

</div>

{/* Cover Image */}

<div style={{ marginBottom: 16 }}>

<label style={label}>Cover Image</label>

<input

type="file"

accept="image/*"

style={input}

onChange={handleImageUpload}

/>

{coverImage && (

<img

src={coverImage}

alt="cover"

style={{

width: '100%',

borderRadius: 10,

marginTop: 8,

maxHeight: 120,

objectFit: 'cover',

}}

/>

)}

</div>

{/* Category Dropdown */}

<div style={{ marginBottom: 16 }}>

<label style={label}>Category</label>

<select

value={category}

onChange={e => setCategory(e.target.value)}

style={{ ...input, marginBottom: 0 }}

>

{categories.map((cat, idx) => (

<option key={idx} value={cat}>

{cat ? cat : 'Select a category'}

</option>

))}

</select>

</div>

{/* Premium */}

<div

style={{

borderTop: '1px solid #d0f33022',

paddingTop: 16,

}}

>

<div

style={{

display: 'flex',

alignItems: 'center',

justifyContent: 'space-between',

marginBottom: 12,

}}

>

<label

style={{

color: '#b6c2b6',

fontWeight: 600,

fontSize: 15,

}}

>

Premium Article

</label>

<button

onClick={() => setIsPremium(!isPremium)}

style={{

width: 44,

height: 24,

borderRadius: 12,

background: isPremium ? '#d0f330' : '#444',

border: 'none',

position: 'relative',

cursor: 'pointer',

transition: 'background 0.2s',

}}

>

<span

style={{

display: 'block',

width: 18,

height: 18,

borderRadius: '50%',

background: '#fff',

position: 'absolute',

left: isPremium ? 22 : 4,

top: 3,

transition: 'left 0.2s',

}}

/>

</button>

</div>

{isPremium && (

<div>

<label style={label}>Price (INR)</label>

<input

type="number"

placeholder="0"

value={price}

onChange={e => setPrice(e.target.value)}

style={{ ...input, paddingLeft: 32 }}

min="0"

/>

<span

style={{

position: 'absolute',

marginLeft: -28,

marginTop: 12,

color: '#b6c2b6',

}}

>

₹

</span>

</div>

)}

</div>

</div>

</div>

</div>

{/* Error/Success */}

{(error || successMessage) && (

<div

style={{

marginTop: 24,

textAlign: 'center',

color: error ? 'red' : 'green',

fontWeight: 600,

fontSize: 16,

}}

>

{error || successMessage}

</div>

)}






<style>{

@media (max-width: 900px) {

.add-article-grid {

grid-template-columns: 1fr !important;

gap: 20px !important;

}

}

@media (max-width: 600px) {

.add-article-grid {

grid-template-columns: 1fr !important;

gap: 12px !important;

}

.add-article-grid > div {

padding: 0 !important;

}

input, textarea, select {

font-size: 1rem !important;

}

}

@media (max-width: 500px) {

h1 {

font-size: 1.3rem !important;

}

.add-article-grid {

gap: 8px !important;

}

}

.floating-action-bar {

position: fixed;

left: 0;

right: 0;

bottom: 0;

z-index: 100;

background: rgba(24,26,19,0.97);

box-shadow: 0 -2px 24px #000a;

display: flex;

justify-content: center;

gap: 16px;

padding: 1rem 0.5rem;

border-top: 1.5px solid #d0f33022;

}

@media (min-width: 700px) {

.floating-action-bar {

left: 50%;

transform: translateX(-50%);

max-width: 700px;

border-radius: 16px 16px 0 0;

margin-bottom: 12px;

}

}

@keyframes pulse {

0% { text-shadow: 0 0 8px #d0f33055; }

100% { text-shadow: 0 0 24px #d0f330; }

}

}</style>

</div>

);

}

export default AddArticle;