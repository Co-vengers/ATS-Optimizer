import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, XCircle, Loader2, Sparkles } from 'lucide-react';

const ResumeAnalyzer = ({ user }) => {
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setError(null);
        // We keep the result visible until they hit analyze, or you can clear it here:
        // setResult(null); 
      } else {
        setError("Please upload a PDF file.");
      }
    }
  };

  const removeFile = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFile(null);
    setResult(null); // Clear previous results when file is removed
    setError(null);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
        setError(null);
      } else {
        setError("Please upload a PDF file.");
      }
    }
  };

  const handleSubmit = async () => {
    if (!file || !jobDesc.trim()) {
      setError("Please provide both a resume and a job description.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setProgress(0);

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('job_description', jobDesc);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);

    try {
      const response = await fetch('http://136.119.223.185:8000/api/calculate-score/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze resume');
      }

      const data = await response.json();

      clearInterval(progressInterval);
      setProgress(100);
      
      setTimeout(() => {
        setResult(data);
        setLoading(false);
        setProgress(0);
      }, 500);

    } catch (err) {
      clearInterval(progressInterval);
      setLoading(false);
      setProgress(0);
      console.error(err);
      setError(err.message || "An error occurred while processing the resume.");
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-600 border-emerald-500 bg-emerald-50";
    if (score >= 50) return "text-amber-600 border-amber-500 bg-amber-50";
    return "text-rose-600 border-rose-500 bg-rose-50";
  };

  const getScoreGradient = (score) => {
    if (score >= 80) return "from-emerald-500 to-teal-500";
    if (score >= 50) return "from-amber-500 to-orange-500";
    return "from-rose-500 to-red-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 pt-4 pb-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-xl shadow-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                ATS Optimizer
              </h1>
              <p className="text-xs text-slate-500">AI-Powered Resume Analysis</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-slate-900 sm:text-5xl mb-4">
            Optimize Your Resume for Success
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Get instant AI-powered insights and improve your chances of landing interviews
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column: Input Form */}
          <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-3xl p-8 border border-slate-200">
            <div className="space-y-6">
              {/* Job Description */}
              <div>
                <label htmlFor="jobDesc" className="flex items-center text-sm font-bold text-slate-700 mb-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs mr-2">1</span>
                  Job Description
                </label>
                <textarea
                  id="jobDesc"
                  rows={7}
                  className="block w-full rounded-2xl border-2 border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-20 sm:text-sm p-4 resize-none bg-white hover:border-slate-300 transition-all duration-200"
                  placeholder="Paste the complete job description here...&#10;&#10;Include required skills, qualifications, and responsibilities."
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                />
                <p className="mt-2 text-xs text-slate-500 flex items-center">
                  <FileText className="h-3 w-3 mr-1" />
                  Be as detailed as possible for better matching
                </p>
              </div>

              {/* Resume Upload */}
              <div>
                <label className="flex items-center text-sm font-bold text-slate-700 mb-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs mr-2">2</span>
                  Upload Your Resume
                </label>
                <div 
                  className={`relative mt-1 flex justify-center px-6 pt-8 pb-8 border-2 border-dashed rounded-2xl transition-all duration-300 ease-in-out ${
                    dragActive 
                      ? 'border-indigo-500 bg-indigo-50 scale-[1.02]' 
                      : file 
                        ? 'border-emerald-400 bg-emerald-50' 
                        : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50 cursor-pointer'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="space-y-3 text-center w-full">
                    {file ? (
                      <div className="relative animate-fadeIn">
                        {/* Remove File Button */}
                        <button
                          onClick={removeFile}
                          className="absolute -top-10 -right-4 p-2 bg-white rounded-full shadow-md border border-slate-200 text-slate-400 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-200 transition-all duration-200 z-10"
                          title="Remove resume"
                        >
                          <XCircle size={20} />
                        </button>

                        <div className="mx-auto h-16 w-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-3">
                          <FileText className="h-9 w-9 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-emerald-800 truncate max-w-[200px] mx-auto">{file.name}</p>
                          <p className="text-xs text-emerald-600 mt-1 font-medium">{(file.size / 1024).toFixed(2)} KB</p>
                        </div>
                        <div className="mt-4 flex items-center justify-center space-x-2">
                           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                             Ready for analysis
                           </span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="mx-auto h-14 w-14 bg-slate-100 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110">
                          <Upload className="h-8 w-8 text-slate-400" />
                        </div>
                        <div>
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md font-semibold text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                          >
                            <span>Click to upload</span>
                            <input 
                              id="file-upload" 
                              name="file-upload" 
                              type="file" 
                              accept=".pdf" 
                              className="sr-only" 
                              onChange={handleFileChange} 
                            />
                          </label>
                          <span className="text-slate-600"> or drag and drop</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">PDF format only • Max 10MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 flex items-start animate-pulse">
                  <AlertCircle className="h-5 w-5 text-rose-500 mr-3 flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-medium text-rose-800">{error}</p>
                </div>
              )}

              {/* Progress Bar */}
              {loading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 font-medium">Analyzing resume...</span>
                    <span className="text-indigo-600 font-bold">{progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full flex items-center justify-center py-4 px-6 border border-transparent rounded-2xl shadow-lg text-base font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-200 ${
                  loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                    Processing Your Resume...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Analyze My Resume
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-3xl p-8 min-h-[600px] flex flex-col border border-slate-200">
            {!result && !loading && (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 space-y-6">
                <div className="bg-gradient-to-br from-slate-100 to-slate-200 p-6 rounded-3xl">
                  <FileText className="h-16 w-16 text-slate-400" />
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-slate-700 mb-2">Ready to Analyze</p>
                  <p className="text-sm text-slate-500 max-w-xs">
                    Upload your resume and paste a job description to get started
                  </p>
                </div>
              </div>
            )}

            {loading && (
              <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                <div className="relative">
                  <div className="w-24 h-24 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-indigo-600" />
                  </div>
                </div>
                <p className="text-slate-600 font-medium">Analyzing your resume...</p>
              </div>
            )}

            {result && !loading && (
              <div className="flex-1 flex flex-col space-y-8 animate-fadeIn">
                {/* Score Display */}
                <div className="text-center">
                  <h3 className="text-sm text-slate-500 uppercase tracking-wider font-bold mb-6">Your ATS Match Score</h3>
                  <div className="relative inline-block">
                    <div className={`w-44 h-44 rounded-full border-8 flex items-center justify-center shadow-xl ${getScoreColor(result.ats_score)}`}>
                      <span className={`text-6xl font-extrabold ${getScoreColor(result.ats_score).split(' ')[0]}`}>
                        {Math.round(result.ats_score)}
                      </span>
                    </div>
                    <div className={`absolute -bottom-3 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full bg-gradient-to-r ${getScoreGradient(result.ats_score)} text-white text-xs font-bold shadow-lg`}>
                      {result.ats_score >= 80 ? "Excellent" : result.ats_score >= 50 ? "Good" : "Needs Work"}
                    </div>
                  </div>
                  <p className="text-slate-700 text-base font-medium max-w-sm mx-auto mt-8">
                    {result.ats_score >= 80 
                      ? "Outstanding! Your resume is highly optimized for this role." 
                      : result.ats_score >= 50 
                        ? "You're on the right track. A few improvements will boost your score." 
                        : "Let's optimize your resume to increase your interview chances."}
                  </p>
                </div>

                {/* Missing Keywords */}
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border-2 border-slate-200">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                    <div className="bg-rose-100 p-2 rounded-xl mr-3">
                      <XCircle className="text-rose-600" size={20} />
                    </div>
                    Missing Keywords
                  </h3>
                  {result.missing_skills && result.missing_skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {result.missing_skills.map((skill, index) => (
                        <span 
                          key={index} 
                          className="bg-white text-rose-700 px-4 py-2 rounded-xl text-sm font-semibold border-2 border-rose-200 shadow-sm hover:shadow-md transition-shadow"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-emerald-700 bg-emerald-50 p-4 rounded-xl border-2 border-emerald-200">
                      <CheckCircle size={24} className="flex-shrink-0" />
                      <span className="font-semibold">Excellent! No critical skills missing from your resume.</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;