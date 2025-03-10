import React, { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { uploadResume } from '@/actions/user_actions';
import toast from 'react-hot-toast';

interface ResumeUploadPopupProps {
  onClose: () => void;
}

const ResumeUploadPopup = ({ onClose }: ResumeUploadPopupProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a resume file");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      
      const response = await uploadResume(formData);
      
      if (!response.success) {
        throw new Error(response.message || "Failed to upload resume");
      }
      
      toast.success("Resume uploaded successfully!");
      // Set a flag in localStorage to indicate resume has been uploaded
      localStorage.setItem('resumeUploaded', 'true');
      onClose();
    } catch (error: any) {
      console.error("Resume upload error:", error);
      toast.error(error.message || "An error occurred while uploading your resume");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSkip = () => {
    // Set a flag in localStorage to not show this popup again
    localStorage.setItem('resumeUploadSkipped', 'true');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-800 rounded-xl max-w-md w-full p-6 relative animate-fade-in">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[#53ffe930] rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload className="text-[#53ffe9] w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Upload Your Resume</h3>
          <p className="text-gray-400 text-sm">
            This will help our model find more personalized job opportunities for you based on your skills and experience.
          </p>
        </div>
        
        <div 
          className={`border-2 border-dashed rounded-lg p-8 mb-6 text-center ${
            dragActive ? 'border-[#53ffe9] bg-[#53ffe915]' : 'border-gray-600'
          } transition-colors`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {file ? (
            <div className="flex flex-col items-center">
              <div className="bg-[#53ffe930] rounded-full p-2 mb-2">
                <Upload className="text-[#53ffe9] w-5 h-5" />
              </div>
              <p className="text-sm font-medium mb-1">{file.name}</p>
              <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
              <button 
                className="text-xs text-[#53ffe9] mt-2 hover:underline"
                onClick={() => setFile(null)}
              >
                Remove
              </button>
            </div>
          ) : (
            <>
              <div className="bg-zinc-700 rounded-full p-3 inline-block mb-3">
                <Upload className="text-gray-400 w-6 h-6" />
              </div>
              <p className="text-sm mb-2">Drag & drop your resume here</p>
              <p className="text-xs text-gray-400 mb-4">Supports PDF, DOCX, TXT (Max 5MB)</p>
              <label className="bg-zinc-700 hover:bg-zinc-600 text-white text-sm py-2 px-4 rounded-md cursor-pointer inline-block">
                Browse Files
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".pdf,.doc,.docx,.txt" 
                  onChange={handleFileChange}
                />
              </label>
            </>
          )}
        </div>
        
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 border-gray-600 hover:bg-zinc-700 text-white"
            onClick={handleSkip}
          >
            Skip for now
          </Button>
          <Button
            className="flex-1 bg-[#53ffe9d9] hover:bg-[#53ffe9] text-black"
            onClick={handleUpload}
            disabled={isUploading || !file}
          >
            {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            {isUploading ? 'Uploading...' : 'Upload Resume'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResumeUploadPopup;