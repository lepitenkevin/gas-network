import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';

function Contact() {
  const form = useRef();
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);

  const sendEmail = (e) => {
  e.preventDefault();
  setLoading(true);

  // Pulling from Vite Environment Variables
  const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY)
    .then((result) => {
        setStatus({ type: 'success', msg: 'Message sent! We will get back to you soon.' });
        form.current.reset();
    }, (error) => {
        console.error("EmailJS Error:", error);
        setStatus({ type: 'error', msg: 'Something went wrong. Please try again later.' });
    })
    .finally(() => setLoading(false));
};

  return (
    <div className="max-w-4xl mx-auto pb-20 px-4">
      <div className="mb-8">
        <Link to="/" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2">
          &larr; Back to Dashboard
        </Link>
        <h1 className="text-4xl font-bold mt-4 dark:text-white">Contact Support</h1>
        <p className="text-gray-500 mt-2">Spotted a new gas station in Bogo? Let us know!</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
        {status.msg && (
          <div className={`p-4 mb-6 rounded-xl text-sm font-medium ${status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {status.msg}
          </div>
        )}

        <form ref={form} onSubmit={sendEmail} className="space-y-5">
          {/* EmailJS uses the 'name' attribute to map variables to your template */}
          <div>
            <label className="block text-sm font-semibold mb-1 dark:text-gray-300">Your Name</label>
            <input 
              type="text" name="from_name" required
              className="w-full p-3 rounded-xl border dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 dark:text-gray-300">Email Address</label>
            <input 
              type="email" name="reply_to" required
              className="w-full p-3 rounded-xl border dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 dark:text-gray-300">Message</label>
            <textarea 
              name="message" required rows="5"
              className="w-full p-3 rounded-xl border dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            ></textarea>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200 dark:shadow-none'}`}
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Contact;