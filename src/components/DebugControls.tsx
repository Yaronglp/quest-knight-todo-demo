import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

interface ModalData {
  type: 'confirm' | 'alert';
  title: string;
  message: string;
  emoji: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
}

/**
 * Debug controls for development and testing
 * Press Ctrl+Shift+D to toggle visibility
 */
export const DebugControls: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [modalData, setModalData] = useState<ModalData | null>(null);
  const clearAllData = useGameStore((state) => state.clearAllData);
  const cleanupOrphanedEnemies = useGameStore((state) => state.cleanupOrphanedEnemies);
  const tasks = useGameStore((state) => state.tasks);
  const enemies = useGameStore((state) => state.enemies);

  // Toggle visibility with keyboard shortcut: Ctrl+Shift+D
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setIsVisible((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showModal = (data: ModalData) => {
    setModalData(data);
  };

  const closeModal = () => {
    setModalData(null);
  };

  const handleModalConfirm = () => {
    if (modalData?.onConfirm) {
      modalData.onConfirm();
    }
    closeModal();
  };

  const renderModal = () => (
    <AnimatePresence>
      {modalData && (
        <motion.div
          className="fixed inset-0 z-50 bg-dark-900/90 backdrop-blur-sm overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
        >
          <motion.div
            className="absolute top-1/2 left-1/2 w-[90%] max-w-md overflow-hidden rounded-xl sm:rounded-2xl border-2 sm:border-4 border-primary-500 bg-gradient-to-br from-dark-800 to-dark-900 shadow-2xl"
            initial={{ scale: 0.8, x: '-50%', y: '-40%' }}
            animate={{ scale: 1, x: '-50%', y: '-50%' }}
            exit={{ scale: 0.8, x: '-50%', y: '-40%' }}
            transition={{ type: 'spring', duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glow Effect */}
            <motion.div
              className="absolute inset-0 -z-10 rounded-xl sm:rounded-2xl bg-primary-500 opacity-30 blur-3xl pointer-events-none will-change-transform"
              animate={{
                scale: [1, 1.03, 1],
                opacity: [0.3, 0.45, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: [0.45, 0, 0.55, 1],
                repeatType: "loop",
              }}
            />

            {/* Content */}
            <div className="relative p-4 sm:p-6">
            {/* Header */}
            <div className="mb-3 sm:mb-4 text-center">
              <motion.div
                className="mb-2 sm:mb-3 text-4xl sm:text-5xl md:text-6xl will-change-transform"
                animate={{
                  scale: [1, 1.08, 1],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: [0.45, 0, 0.55, 1],
                  repeatType: "loop",
                }}
              >
                {modalData.emoji}
              </motion.div>
              <h2 className="mb-1 sm:mb-2 font-fantasy text-xl sm:text-2xl font-bold text-primary-400">
                {modalData.title}
              </h2>
            </div>

            {/* Message */}
            <div className="mb-4 sm:mb-6 rounded-lg border-2 border-dark-700 bg-dark-850 p-3 sm:p-4">
              <p className="whitespace-pre-line text-center text-sm sm:text-base text-dark-200">
                {modalData.message}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              {modalData.type === 'confirm' ? (
                <>
                  <motion.button
                    onClick={handleModalConfirm}
                    className="flex-1 rounded-lg bg-primary-600 py-2 sm:py-2.5 font-fantasy text-sm sm:text-base font-semibold text-white shadow-lg transition-colors hover:bg-primary-700"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {modalData.confirmText || 'Confirm'}
                  </motion.button>
                  <motion.button
                    onClick={closeModal}
                    className="rounded-lg bg-dark-700 px-6 py-2 sm:py-2.5 font-medium text-sm sm:text-base text-dark-200 transition-colors hover:bg-dark-600"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {modalData.cancelText || 'Cancel'}
                  </motion.button>
                </>
              ) : (
                <motion.button
                  onClick={closeModal}
                  className="w-full rounded-lg bg-primary-600 py-2 sm:py-2.5 font-fantasy text-sm sm:text-base font-semibold text-white shadow-lg transition-colors hover:bg-primary-700"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  OK
                </motion.button>
              )}
            </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (!isVisible) {
    return (
      <>
        <button
          onClick={() => setIsVisible(true)}
          className="fixed bottom-4 left-4 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-dark-700 text-2xl shadow-lg transition-colors hover:bg-dark-600"
          aria-label="Open debug controls"
          title="Debug Controls (Ctrl+Shift+D)"
        >
          🛠️
        </button>
        {renderModal()}
      </>
    );
  }

  const handleClearData = () => {
    showModal({
      type: 'confirm',
      title: 'Clear All Data?',
      message: `This will delete ${tasks.length} task${tasks.length !== 1 ? 's' : ''} and reset your progress.\n\nThis action cannot be undone.`,
      emoji: '⚠️',
      confirmText: 'Clear Data',
      cancelText: 'Cancel',
      onConfirm: () => {
        clearAllData();
        showModal({
          type: 'alert',
          title: 'Success!',
          message: 'All data cleared successfully!',
          emoji: '✅',
        });
      },
    });
  };

  const handleCleanupEnemies = () => {
    const taskIds = new Set(tasks.map(t => t.id));
    const orphanedCount = enemies.filter(e => !taskIds.has(e.taskId)).length;
    
    if (orphanedCount === 0) {
      showModal({
        type: 'alert',
        title: 'All Clear!',
        message: 'No orphaned enemies found. All dragons are properly linked to tasks!',
        emoji: '✅',
      });
      return;
    }

    showModal({
      type: 'confirm',
      title: 'Clean up Orphaned Enemies?',
      message: `Found ${orphanedCount} dragon${orphanedCount !== 1 ? 's' : ''} without associated tasks.\n\nThese will be removed from the game.`,
      emoji: '🐉',
      confirmText: 'Clean Up',
      cancelText: 'Cancel',
      onConfirm: () => {
        cleanupOrphanedEnemies();
        showModal({
          type: 'alert',
          title: 'Success!',
          message: `Removed ${orphanedCount} orphaned dragon${orphanedCount !== 1 ? 's' : ''}!`,
          emoji: '✅',
        });
      },
    });
  };

  return (
    <>
      <div className="fixed bottom-4 left-4 sm:left-auto sm:right-4 z-50 rounded-lg border-2 border-primary-500 bg-dark-800 p-4 shadow-2xl">
        <div className="mb-2 flex items-center justify-between gap-4">
          <h3 className="font-fantasy text-sm font-semibold text-primary-400">Debug Controls</h3>
          <button
            onClick={() => setIsVisible(false)}
            className="text-dark-400 transition-colors hover:text-dark-200"
            aria-label="Close debug controls"
          >
            ✕
          </button>
        </div>

        <div className="space-y-2 text-xs text-dark-300">
          <p>Tasks: {tasks.length}</p>
          <p>Enemies: {enemies.length}</p>
          <p className="text-dark-500">Press Ctrl+Shift+D to toggle</p>
        </div>

        <div className="mt-3 space-y-2">
          <button
            onClick={handleCleanupEnemies}
            className="w-full rounded bg-amber-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-amber-700"
          >
            🐉 Cleanup Orphaned Dragons
          </button>
          
          <button
            onClick={handleClearData}
            className="w-full rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
          >
            Clear All Data
          </button>
        </div>
      </div>
      {renderModal()}
    </>
  );
};

