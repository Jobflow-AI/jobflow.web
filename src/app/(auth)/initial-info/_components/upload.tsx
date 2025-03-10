import React from 'react'
import { Upload, FileType } from 'lucide-react'

interface UploadProps {
  file: File | null;
  isUploading: boolean;
  isParsing: boolean;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpload: () => void;
}

const UploadComponent = ({ file, isUploading, isParsing, handleFileChange, handleUpload }: UploadProps) => {
  return (
    <div className="bg-gray-800 rounded-xl shadow-2xl p-8 mb-8">
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center">
          <Upload size={40} className="text-blue-400" />
        </div>
        
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Upload Your Resume</h2>
          <p className="text-gray-400 mb-6">Supported formats: PDF, DOCX, TXT</p>
        </div>
        
        <label className="relative cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
          <span>Choose File</span>
          <input 
            type="file" 
            className="hidden" 
            accept=".pdf,.docx,.txt" 
            onChange={handleFileChange}
            disabled={isUploading || isParsing}
          />
        </label>
        
        {file && (
          <div className="flex items-center space-x-2 text-gray-300">
            <FileType size={20} />
            <span>{file.name}</span>
          </div>
        )}
        
        <button
          className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
            file ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
          onClick={handleUpload}
          disabled={!file || isUploading || isParsing}
        >
          {isUploading ? 'Uploading...' : isParsing ? 'Parsing...' : 'Upload & Parse Resume'}
        </button>
      </div>
    </div>
  )
}

export default UploadComponent