import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import logo from '../IMG/Picture1.png'

function SubmissionForm() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  // Loading animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000) // Show loading for 2 seconds

    return () => clearTimeout(timer)
  }, [])

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    setSubmitSuccess(false)

    try {
      // Prepare the submission data
      const submissionData = {
        user_email: 'anonymous@paryavaran.org', // Default email for anonymous submissions
        name: data.name,
        contact_number: data.contact_number,
        district: data.district,
        place: data.place,
        completed_by: data.completed_by,
        work_description: data.work_description,
        result: data.result,
        google_drive_link: data.google_drive_link || null,
      }

      console.log('Attempting to submit:', submissionData)

      // Insert into Supabase
      const { data: insertedData, error } = await supabase
        .from('submissions')
        .insert([submissionData])
        .select()

      if (error) {
        console.error('Supabase error details:', error)
        throw error
      }

      // Show success popup
      setSubmitSuccess(true)
      reset() // Reset form fields

      console.log('Submission successful:', insertedData)
    } catch (error) {
      console.error('Error submitting form:', error)
      console.error('Error message:', error.message)
      console.error('Error details:', error.details)
      console.error('Error hint:', error.hint)
      
      let errorMessage = 'फॉर्म सबमिट करने में त्रुटि। कृपया पुनः प्रयास करें।\n\n'
      
      // Check for RLS policy error
      if (error.message && error.message.includes('row-level security policy')) {
        errorMessage = 'Database Security Error!\n\n'
        errorMessage += 'Please configure Supabase:\n'
        errorMessage += '1. Go to Supabase Dashboard\n'
        errorMessage += '2. Go to Authentication > Policies\n'
        errorMessage += '3. Add INSERT policy for "submissions" table\n'
        errorMessage += '4. Enable public access or disable RLS\n\n'
        errorMessage += 'Error: ' + error.message
      } else if (error.message) {
        errorMessage += 'Error: ' + error.message
      }
      
      if (error.hint) {
        errorMessage += '\nHint: ' + error.hint
      }
      
      alert(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const closeSuccessPopup = () => {
    setSubmitSuccess(false)
  }

  // Loading Animation Screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Logo with Animation */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="mb-8"
          >
            <img
              src={logo}
              alt="Paryavaran Sanrakshan Logo"
              className="w-48 h-48 mx-auto object-contain drop-shadow-2xl"
            />
          </motion.div>

          {/* Loading Text */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-green-800 mb-4"
          >
            पर्यावरण संरक्षण
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-green-600 text-lg"
          >
            Loading...
          </motion.p>

          {/* Loading Spinner */}
          <motion.div
            className="mt-6 flex justify-center space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <motion.div
              className="w-3 h-3 bg-green-600 rounded-full"
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
            />
            <motion.div
              className="w-3 h-3 bg-green-600 rounded-full"
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div
              className="w-3 h-3 bg-green-600 rounded-full"
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
            />
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-8 px-4"
    >
      {/* Success Popup Modal */}
      {submitSuccess && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
          onClick={closeSuccessPopup}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-6"
            >
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </motion.div>

            {/* Success Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-3xl font-bold text-green-800 mb-3">
                सफलता! Success!
              </h2>
              <p className="text-gray-700 text-lg mb-2">
                आपका फॉर्म सफलतापूर्वक सबमिट हो गया है।
              </p>
              <p className="text-gray-600 mb-6">
                Your submission has been recorded successfully.
              </p>
              
              {/* Decorative Elements */}
              <div className="flex justify-center space-x-2 mb-6">
                <span className="text-3xl">🌱</span>
                <span className="text-3xl">🌿</span>
                <span className="text-3xl">🌳</span>
              </div>

              {/* Close Button */}
              <motion.button
                onClick={closeSuccessPopup}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-200"
              >
                बंद करें (Close)
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-3xl mx-auto relative"
      >
        {/* Admin Login Button - Top Right */}
        <motion.button
          onClick={() => navigate('/admin')}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute top-0 right-0 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-200 flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          Admin
        </motion.button>

        {/* Header with Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
            className="mb-6"
          >
            <img
              src={logo}
              alt="Paryavaran Sanrakshan Logo"
              className="w-32 h-32 mx-auto object-contain drop-shadow-lg"
            />
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-2">
            पर्यावरण गतिविधि मालवा प्रांत (सफल प्रयोग)
          </h1>
          <p className="text-green-700 text-lg">Paryavaran Gathividhi Malwa Prant (Safal Prayog)</p>
        </div>

        {/* Success Message - Removed inline message since we have popup */}

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-xl shadow-lg p-6 md:p-8 space-y-6 border border-green-200"
        >
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-green-800 font-semibold mb-2">
              नाम (Name) <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              {...register('name', { required: 'यह फील्ड आवश्यक है' })}
              className="input-field"
              placeholder="अपना नाम दर्ज करें"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Contact Number Field */}
          <div>
            <label htmlFor="contact_number" className="block text-green-800 font-semibold mb-2">
              संपर्क नंबर (Contact Number) <span className="text-red-500">*</span>
            </label>
            <input
              id="contact_number"
              type="tel"
              {...register('contact_number', { 
                required: 'यह फील्ड आवश्यक है',
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें'
                }
              })}
              className="input-field"
              placeholder="10 अंकों का मोबाइल नंबर"
              maxLength="10"
            />
            {errors.contact_number && (
              <p className="text-red-500 text-sm mt-1">{errors.contact_number.message}</p>
            )}
          </div>

          {/* District Field */}
          <div>
            <label htmlFor="district" className="block text-green-800 font-semibold mb-2">
              जिला (District) <span className="text-red-500">*</span>
            </label>
            <input
              id="district"
              type="text"
              {...register('district', { required: 'यह फील्ड आवश्यक है' })}
              className="input-field"
              placeholder="अपना जिला दर्ज करें"
            />
            {errors.district && (
              <p className="text-red-500 text-sm mt-1">{errors.district.message}</p>
            )}
          </div>

          {/* Place Field */}
          <div>
            <label htmlFor="place" className="block text-green-800 font-semibold mb-2">
              नगर/ग्राम <span className="text-red-500">*</span>
            </label>
            <input
              id="place"
              type="text"
              {...register('place', { required: 'यह फील्ड आवश्यक है' })}
              className="input-field"
              placeholder="नगर/ग्राम का नाम दर्ज करें"
            />
            {errors.place && (
              <p className="text-red-500 text-sm mt-1">{errors.place.message}</p>
            )}
          </div>

          {/* Completed By Field */}
          <div>
            <label htmlFor="completed_by" className="block text-green-800 font-semibold mb-2">
              कार्य सम्पन्न (Completed By) <span className="text-red-500">*</span>
            </label>
            <select
              id="completed_by"
              {...register('completed_by', { required: 'कृपया एक विकल्प चुनें' })}
              className="input-field"
            >
              <option value="">-- चुनें --</option>
              <option value="व्यक्तिगत">व्यक्तिगत (Individual)</option>
              <option value="संस्था/ संगठन">संस्था/ संगठन (Institution/Organization)</option>
              <option value="शासन/ प्रशासन">शासन/ प्रशासन (Government/Administration)</option>
              <option value="संघ/गतिविधि">संघ/गतिविधि (Association/Activity)</option>
              <option value="समाज">समाज (Society)</option>
            </select>
            {errors.completed_by && (
              <p className="text-red-500 text-sm mt-1">{errors.completed_by.message}</p>
            )}
          </div>

          {/* Work Description Field */}
          <div>
            <label htmlFor="work_description" className="block text-green-800 font-semibold mb-2">
              सफल प्रयोग <span className="text-red-500">*</span>
            </label>
            <textarea
              id="work_description"
              {...register('work_description', { required: 'यह फील्ड आवश्यक है' })}
              rows="4"
              className="input-field resize-none"
              placeholder="सफल प्रयोग का विस्तृत विवरण लिखें..."
            />
            {errors.work_description && (
              <p className="text-red-500 text-sm mt-1">{errors.work_description.message}</p>
            )}
          </div>

          {/* Result Field */}
          <div>
            <label htmlFor="result" className="block text-green-800 font-semibold mb-2">
              परिणाम (Parinam) <span className="text-red-500">*</span>
            </label>
            <textarea
              id="result"
              {...register('result', { required: 'यह फील्ड आवश्यक है' })}
              rows="4"
              className="input-field resize-none"
              placeholder="परिणाम का विवरण लिखें..."
            />
            {errors.result && (
              <p className="text-red-500 text-sm mt-1">{errors.result.message}</p>
            )}
          </div>

          {/* Google Drive Link Field */}
          <div>
            <label htmlFor="google_drive_link" className="block text-green-800 font-semibold mb-2">
              चित्र (Google Drive Link)
            </label>
            <input
              id="google_drive_link"
              type="url"
              {...register('google_drive_link')}
              className="input-field"
              placeholder="https://drive.google.com/..."
            />
            <p className="text-sm text-green-600 mt-1">
              कृपया Google Drive से शेयर की गई लिंक यहाँ पेस्ट करें (वैकल्पिक)
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'
              }`}
            >
              {isSubmitting ? 'सबमिट हो रहा है...' : 'फॉर्म सबमिट करें (Submit Form)'}
            </motion.button>
          </div>
        </form>

        {/* Footer Note */}
        <div className="mt-6 text-center text-sm text-green-700">
          <p>सभी आवश्यक फील्ड (<span className="text-red-500">*</span>) भरें।</p>
          <p>All required fields must be filled.</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default SubmissionForm
