//   <AnimatePresence>
//             {open && (
//                 <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//                     {/* Backdrop */}
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                         onClick={() => onOpenChange(false)}
//                         className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
//                     />

//                     {/* Modal Content */}
//                     <motion.div
//                         initial={{ opacity: 0, scale: 0.95, y: 10 }}
//                         animate={{ opacity: 1, scale: 1, y: 0 }}
//                         exit={{ opacity: 0, scale: 0.95, y: 10 }}
//                         className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-100 overflow-hidden"
//                     >
//                         <div className="flex flex-col gap-1 mb-6">
//                             <h2 className="text-xl font-bold text-slate-900 tracking-tight">Share Notes (P2P)</h2>
//                             <p className="text-sm text-slate-500">
//                                 Upload your notes to help fellow students. Notes will be reviewed before publishing.
//                             </p>
//                         </div>

//                         <div className="space-y-4">
//                             <div>
//                                 <label className="text-sm font-medium text-slate-700">Title</label>
//                                 <input
//                                     type="text"
//                                     placeholder="e.g., Java Collections Framework"
//                                     className="mt-1.5 w-full h-10 px-3 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 rounded-lg text-sm transition-all"
//                                 />
//                             </div>

//                             <div>
//                                 <label className="text-sm font-medium text-slate-700">Subject</label>
//                                 <select className="mt-1.5 w-full h-10 px-3 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 rounded-lg text-sm appearance-none cursor-pointer">
//                                     <option value="">Select subject</option>
//                                     <option value="java">Java Programming</option>
//                                     <option value="scilab">Scilab</option>
//                                     <option value="dsa">Data Structures</option>
//                                     <option value="webdev">Web Development</option>
//                                 </select>
//                             </div>

//                             <div>
//                                 <label className="text-sm font-medium text-slate-700">Description</label>
//                                 <textarea
//                                     placeholder="Brief description of your notes..."
//                                     className="mt-1.5 w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 rounded-lg text-sm min-h-24 resize-none transition-all"
//                                 />
//                             </div>

//                             {/* File Upload */}
//                             <div>
//                                 <label className="text-sm font-medium text-slate-700">File</label>
//                                 <div
//                                     className={`mt-1.5 border-2 border-dashed rounded-xl p-6 text-center transition-all ${file ? "border-slate-900 bg-slate-50" : "border-slate-200 hover:border-slate-400 hover:bg-slate-50"}`}
//                                 >
//                                     {file ? (
//                                         <div className="flex items-center gap-3">
//                                             <FileText className="w-8 h-8 text-slate-900" />
//                                             <div className="text-left flex-1 min-w-0">
//                                                 <p className="font-semibold text-slate-900 truncate">{file.name}</p>
//                                                 <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
//                                             </div>
//                                             <button
//                                                 className="p-1.5 hover:bg-slate-200 rounded-full transition-colors"
//                                                 onClick={() => setFile(null)}
//                                             >
//                                                 <X className="w-4 h-4 text-slate-500" />
//                                             </button>
//                                         </div>
//                                     ) : (
//                                         <label className="cursor-pointer block">
//                                             <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
//                                             <p className="text-sm text-slate-600 font-medium">
//                                                 <span className="text-slate-900 underline decoration-slate-300 underline-offset-4">Click to upload</span>
//                                             </p>
//                                             <p className="text-xs text-slate-400 mt-1">PDF, DOC, or images up to 10MB</p>
//                                             <input
//                                                 type="file"
//                                                 className="hidden"
//                                                 onChange={(e) => setFile(e.target.files?.[0] || null)}
//                                                 accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
//                                             />
//                                         </label>
//                                     )}
//                                 </div>
//                             </div>

//                             <button
//                                 onClick={handleUpload}
//                                 disabled={!file || uploading || uploaded}
//                                 className={`w-full h-12 flex items-center justify-center gap-2 font-medium rounded-lg transition-all shadow-sm ${!file || uploading || uploaded
//                                     ? "bg-slate-100 text-slate-400 cursor-not-allowed"
//                                     : "bg-slate-900 hover:bg-slate-800 text-white active:scale-[0.99]"
//                                     }`}
//                             >
//                                 {uploaded ? (
//                                     <>
//                                         <Check className="w-4 h-4" /> Uploaded Successfully
//                                     </>
//                                 ) : uploading ? (
//                                     <>
//                                         <motion.div
//                                             animate={{ rotate: 360 }}
//                                             transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                                             className="w-4 h-4 border-2 border-slate-400 border-t-white rounded-full"
//                                         />
//                                         Uploading...
//                                     </>
//                                 ) : (
//                                     <>
//                                         <Upload className="w-4 h-4" /> Submit for Review
//                                     </>
//                                 )}
//                             </button>
//                         </div>

//                         <button
//                             onClick={() => onOpenChange(false)}
//                             className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
//                         >
//                             <X className="w-5 h-5" />
//                         </button>
//                     </motion.div>
//                 </div>
//             )}
//         </AnimatePresence>