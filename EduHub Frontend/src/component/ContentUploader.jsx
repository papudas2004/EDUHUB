// src/component/ContentUploader.jsx
import React, { useState } from 'react';
import './components.css'; // 🟢 Links to your standard stylesheet classes

function ContentUploader() {
  const [fileName, setFileName] = useState('');

  return (
    <div className="edu-uploader-box"> {/* 🟢 FIXED: Changed from style={styles.uploaderBox} */}
      <p style={{ color: '#aaa', margin: '0 0 10px 0' }}>Upload Course Materials (Videos/PDFs)</p>
      <label className="edu-upload-label"> {/* 🟢 FIXED: Changed from style={styles.uploadLabel} */}
        Browse Files
        <input 
          type="file" 
          style={{ display: 'none' }} 
          onChange={(e) => setFileName(e.target.files[0]?.name || '')} 
        />
      </label>
      {fileName && <p className="edu-file-name">📄 {fileName}</p>} {/* 🟢 FIXED: Changed from style={styles.fileName} */}
    </div>
  );
}

export default ContentUploader;
