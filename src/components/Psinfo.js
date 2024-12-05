import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const generateColorPalette = () => {
  const hue = Math.floor(Math.random() * 360);
  return {
    primary: `hsl(${hue}, 70%, 50%)`,
    light: `hsl(${hue}, 70%, 90%)`,
    dark: `hsl(${hue}, 70%, 30%)`,
    text: `hsl(${hue}, 70%, 20%)`,
    background: `hsl(${hue}, 70%, 95%)`
  };
};

const Psinfo = () => {
  const [colors, setColors] = useState(generateColorPalette());
  const [formData, setFormData] = useState({
    income: '',
    age: ''
  });
  const [formStep, setFormStep] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [city,setcity]=useState('')

  
  useEffect(() => {
    setColors(generateColorPalette());
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const nextStep = () => {
    setFormStep(prev => Math.min(prev + 1, 2));
  };

  const prevStep = () => {
    setFormStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormSubmitted(true);
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  if (formSubmitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex justify-center items-center min-h-screen"
        style={{ 
          background: `linear-gradient(to bottom right, ${colors.light}, ${colors.background})` 
        }}
      >
        <div 
          className="w-full max-w-md p-8 rounded-xl shadow-2xl text-center"
          style={{ 
            backgroundColor: 'white',
            borderColor: colors.primary,
            borderWidth: '2px'
          }}
        >
          <h2 
            className="text-2xl font-bold mb-4"
            style={{ color: colors.dark }}
          >
            Thank You!
          </h2>
          <p 
            className="mb-4"
            style={{ color: colors.text }}
          >
            Your information has been submitted successfully.
          </p>
          <button 
            onClick={() => {
              setFormSubmitted(false);
              setFormStep(0);
              setColors(generateColorPalette());
            }}
            className="px-4 py-2 rounded-lg transition-colors"
            style={{ 
              backgroundColor: colors.primary,
              color: 'white',
              ':hover': { backgroundColor: colors.dark }
            }}
          >
            Submit Another
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div 
      className="flex justify-center items-center min-h-screen"
      style={{ 
        background: `linear-gradient(to bottom right, ${colors.light}, ${colors.background})` 
      }}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md"
      >
        <div 
          className="rounded-xl shadow-2xl overflow-hidden"
          style={{ backgroundColor: 'white' }}
        >
          <div 
            className="py-4"
            style={{ 
              backgroundColor: colors.primary,
              color: 'white' 
            }}
          >
            <h1 className="text-2xl font-bold text-center">
              Personal Information
            </h1>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {formStep === 0 && (
                  <motion.div
                    key="income-step"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="space-y-4"
                  >
                    <div>
                      <label 
                        htmlFor="income" 
                        className="block font-semibold mb-2"
                        style={{ color: colors.text }}
                      >
                        Annual Income
                      </label>
                      <input 
                        type="number" 
                        id="income"
                        name="income"
                        placeholder="Enter your annual income"
                        value={formData.income}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2"
                        style={{
                          borderColor: colors.primary,
                          ':focus': {
                            ringColor: colors.primary
                          }
                        }}
                        required
                      />
                    </div>
                    <button 
                      type="button" 
                      onClick={nextStep} 
                      className="w-full px-4 py-2 rounded-lg transition-colors"
                      style={{ 
                        backgroundColor: colors.primary,
                        color: 'white',
                        opacity: formData.income ? 1 : 0.5
                      }}
                      disabled={!formData.income}
                    >
                      Next
                    </button>
                  </motion.div>
                )}

                {formStep === 1 && (
                  <motion.div
                    key="age-step"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="space-y-4"
                  >
                    <div>
                      <label 
                        htmlFor="age" 
                        className="block font-semibold mb-2"
                        style={{ color: colors.text }}
                      >
                        Age
                      </label>
                      <input 
                        type="number" 
                        id="age"
                        name="age"
                        placeholder="Enter your age"
                        value={formData.age}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2"
                        style={{
                          borderColor: colors.primary,
                          ':focus': {
                            ringColor: colors.primary
                          }
                        }}
                        min="0"
                        max="120"
                        required
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        type="button" 
                        onClick={prevStep} 
                        className="w-full px-4 py-2 border-2 rounded-lg transition-colors"
                        style={{
                          borderColor: colors.primary,
                          color: colors.text,
                          ':hover': { backgroundColor: colors.light }
                        }}
                      >
                        Back
                      </button>
                      <button 
                        type="button" 
                        onClick={nextStep} 
                        className="w-full px-4 py-2 rounded-lg transition-colors"
                        style={{ 
                          backgroundColor: colors.primary,
                          color: 'white',
                          opacity: formData.age ? 1 : 0.5
                        }}
                        disabled={!formData.age}
                      >
                        Next
                      </button>
                    </div>
                  </motion.div>
                )}

                {formStep === 2 && (
                  <motion.div
                    key="city-step"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="space-y-4"
                  >
                    <div>
                      <label 
                        className="block font-semibold mb-2"
                        style={{ color: colors.text }}
                      >
                        City Type
                      </label>
                      <select
                        value={city}
                        onChange={(e) => setcity(e.target.value)}
                        className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2"
                        style={{
                          borderColor: colors.primary,
                          ':focus': {
                            ringColor: colors.primary
                          }
                        }}
                      >
                        <option value="">Select city type</option>
                        <option value="metropolitan">Metropolitan</option>
                        <option value="city">City</option>
                        <option value="town">Town</option>
                        <option value="village">Village</option>
                      </select>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        type="button" 
                        onClick={prevStep} 
                        className="w-full px-4 py-2 border-2 rounded-lg transition-colors"
                        style={{
                          borderColor: colors.primary,
                          color: colors.text,
                          ':hover': { backgroundColor: colors.light }
                        }}
                      >
                        Back
                      </button>
                      <button 
                        type="submit" 
                        className="w-full px-4 py-2 rounded-lg transition-colors"
                        style={{ 
                          backgroundColor: colors.primary,
                          color: 'white',
                          opacity: city ? 1 : 0.5
                        }}
                        disabled={!city}
                        onClick={() => {setFormSubmitted(true);}}
                      >
                        Submit
                      </button>
                    </div>
                  </motion.div>
                )}

                
              </AnimatePresence>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Psinfo;
