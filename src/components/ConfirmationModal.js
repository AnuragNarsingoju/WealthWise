import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X, Check } from 'lucide-react';

const ConfirmationModal = ({ stock, onConfirm, onClose }) => {

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto overflow-x-hidden"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-md mx-4 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-white/10 flex items-center">
            <AlertCircle className="w-6 h-6 text-white mr-3" />
            <h2 className="text-xl font-semibold text-white flex-1">Confirm Purchase</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-white/70" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="space-y-4">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-white/60">Stock</div>
                    <div className="text-lg font-semibold text-white">{stock.name}</div>
                    <div className="text-sm text-blue-400">{stock.symbol}</div>
                  </div>
                  <div>
                    <div className="text-sm text-white/60">Quantity</div>
                    <div className="text-lg font-semibold text-white">{stock.quantity}</div>
                  </div>
                  <div>
                    <div className="text-sm text-white/60">Price per Share</div>
                    <div className="text-lg font-semibold text-white">₹{stock.price.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-white/60">Total Amount</div>
                    <div className="text-lg font-semibold text-white">
                      ₹{(stock.price * stock.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-white/70 text-sm">
                Please confirm your purchase of {stock.quantity} shares of {stock.name} ({stock.symbol}).
                This action cannot be undone.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-white/10 flex justify-end space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-white/80 hover:bg-white/10 transition-colors flex items-center"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onConfirm}
              className="px-4 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center shadow-lg shadow-blue-500/20"
            >
              <Check className="w-4 h-4 mr-2" />
              Confirm Purchase
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default ConfirmationModal;