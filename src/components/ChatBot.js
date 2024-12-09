              <div className="bg-gray-700 p-3 rounded-lg flex items-center text-white">
                <BadgeDollarSign className="mr-2 h-4 w-4 animate-spin text-purple-400" />
                <span>Niveshak is typing...</span>
              </div>
            </motion.div>
          )}
          
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`
          border-t border-gray-600 p-4 bg-gray-800/50 
          ${isMinimized ? 'hidden' : 'block'}
        `}
      >
        <div className="flex items-center space-x-2">
        <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress} 
            placeholder="Message Niveshak..."
            
            className="
              flex-grow p-2 border border-gray-600 bg-gray-800 text-white rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-purple-500
              resize-none h-20
              disabled:bg-gray-700 disabled:text-gray-400
            "
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSendMessage}
            disabled={input.trim() === '' || isLoading}
            className="
              bg-gradient-to-r from-blue-600 to-purple-600 
              text-white p-3 rounded-full 
              disabled:opacity-50 transition-all
            "
          >
            <Send className="h-6 w-6" />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ChatBot;
