import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PhotoshopErrorApp() {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="flex items-center justify-center h-full bg-transparent">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="rounded-xl overflow-hidden shadow-2xl"
        style={{
          width: 420,
          background: 'linear-gradient(180deg, #f5f5f5 0%, #e8e8e8 100%)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(0,0,0,0.1)',
        }}
      >
        {/* Content - Window component provides title bar */}
        <div className="p-6">
          <div className="flex items-start gap-4">
            {/* Photoshop Icon */}
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: '#001E36' }}
            >
              <span style={{ color: '#31A8FF', fontFamily: 'Arial', fontWeight: 900, fontSize: 28 }}>Ps</span>
            </div>

            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-800 mb-1">
                Photoshop has encountered an error
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                The application encountered an unrecoverable problem and needs to quit.
                Please save your work in any open documents before clicking "OK".
              </p>
            </div>
          </div>

          {/* Error Code */}
          <div className="mt-4 p-3 rounded-lg bg-gray-100 border border-gray-300">
            <p className="text-xs text-gray-500 font-mono">
              Error: 0xC0000005 (ACCESS_VIOLATION)
            </p>
            <p className="text-xs text-gray-500 font-mono mt-1">
              Module: Photoshop.exe
            </p>
            <p className="text-xs text-gray-500 font-mono mt-1">
              Address: 0x00007FF6A3B21420
            </p>
          </div>

          {/* Details section */}
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-3 p-3 rounded-lg bg-gray-50 border border-gray-300">
                  <p className="text-[10px] text-gray-500 font-mono leading-relaxed">
                    Thread 0 Crashed:
                    0   Photoshop.exe                 0x00007ff6a3b21420 0x0000000000000000
                    1   Photoshop.exe                 0x00007ff6a3b21890 0x0000000000000000
                    2   libsystem_kernel.dylib        0x00007fff6c3f433a __pthread_kill + 10
                    3   libsystem_pthread.dylib       0x00007fff6c4b1a60 pthread_kill + 430
                    4   libsystem_c.dylib             0x00007fff6c37b808 abort + 120
                    5   AdobeAGM.framework            0x0000000123456789 AGMInitialize + 1234
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Buttons */}
          <div className="mt-5 flex items-center justify-between">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showDetails ? 'Hide Details' : 'Show Details'}
            </button>

            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2 rounded-md text-sm font-medium text-white transition-all"
              style={{
                background: 'linear-gradient(180deg, #007AFF 0%, #0051D5 100%)',
                boxShadow: '0 1px 2px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(180deg, #0051D5 0%, #0039A8 100%)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(180deg, #007AFF 0%, #0051D5 100%)';
              }}
            >
              OK
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
