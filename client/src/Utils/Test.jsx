import React from 'react';
import { Alert } from 'antd';

const App = () => (
  <>
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-[#E5E5E5] dark:border-slate-800 shadow-sm w-full max-w-5xl">
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row justify-between gap-4">
            <div className="w-full">
              <label htmlFor="practical-subject" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Subject
              </label>
              <select
                id="practical-subject"
                disabled
                className="mt-2 w-full px-4 h-11 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg cursor-not-allowed text-slate-500"
              >
                <option>Select subject</option>
              </select>
            </div>

            <div className="w-full">
              <label htmlFor="practical-number" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Practical No
              </label>
              <input
                type="text"
                id="practical-number"
                disabled
                value="01"
                placeholder="Practical number"
                className="mt-2 w-full px-4 h-11 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500"
              />
            </div>
          </div>

          <div className="border-blue-400/50 border-dashed border rounded-lg p-4 space-y-8 bg-blue-50/10 dark:bg-blue-900/10">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between w-full">
                  <label htmlFor="practical-question-0" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Question 1
                  </label>
                </div>
                <input
                  type="text"
                  id="practical-question-0"
                  disabled
                  value="Describe how to solve the practical problem."
                  className="mt-2 w-full px-4 h-11 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500"
                />
              </div>

              <div>
                <label htmlFor="practical-code-0" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Code Template
                </label>
                <textarea
                  id="practical-code-0"
                  disabled
                  value="// Starter code for students..."
                  className="mt-2 w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 font-mono text-sm rounded-lg min-h-40 text-slate-500"
                />
              </div>

              <div className="mt-2 text-slate-700 dark:text-slate-300">
                <label className="text-sm font-medium block mb-2">
                  Reference Image or File (Optional)
                </label>
                <div className="flex items-center justify-center w-full">
                  <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-200 dark:border-slate-800 border-dashed rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-500">
                    <p className="text-sm font-medium">Upload reference file</p>
                    <p className="text-xs uppercase tracking-wider mt-2">Images, PDFs, or Code files</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="w-full bg-slate-900 dark:bg-slate-100 mt-4 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 font-medium rounded-lg h-12 transition-all active:scale-[0.99]"
            >
              + Add Question
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              className="w-full bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 font-medium rounded-lg h-12 transition-all active:scale-[0.99]"
            >
              Add Practical
            </button>
            <button
              type="button"
              className="w-full sm:w-auto px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg h-12 transition-all active:scale-[0.99]"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </>
);

export default App;