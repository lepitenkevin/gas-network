import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';

function Contact() {
  const form = useRef();
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);
  const [lastSent, setLastSent] = useState(0);

  const sendEmail = (e) => {
    e.preventDefault();

    if (form.current._hp_field.value !== "") {
      setStatus({ type: 'success', msg: 'Message sent! We will get back to you soon.' });
      return; 
    }

    const now = Date.now();
    if (now - lastSent < 60000) {
      setStatus({ type: 'error', msg: 'Please wait a minute before sending another message.' });
      return;
    }

    setLoading(true);

    const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY)
      .then((result) => {
          setStatus({ type: 'success', msg: 'Message sent! We will get back to you soon.' });
          setLastSent(Date.now());
          form.current.reset();
      }, (error) => {
          setStatus({ type: 'error', msg: 'Something went wrong. Please try again later.' });
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 px-4">
      <div className="mb-10">
        <Link to="/" className="inline-block text-[#007bff] dark:text-[#66b0ff] font-bold hover:text-[#0056b3] dark:hover:text-[#99ccff] transition-colors flex items-center gap-2 w-max">
          &larr; Back to Dashboard
        </Link>
        <h1 className="text-4xl md:text-5xl font-extrabold mt-6 text-transparent bg-clip-text bg-gradient-to-r from-[#007bff] to-[#ef8b10] tracking-tight">
          Contact & Support
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-3 font-medium text-lg">Spotted a new gas station in your area? Reach out to us!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: CONTACT & DONATION */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Direct Lines Card */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:shadow-[#007bff]/5 transition-all duration-300">
            <h3 className="text-xs font-black uppercase text-gray-400 dark:text-gray-500 mb-6 tracking-widest">Direct Lines</h3>
            <div className="space-y-3">
              <a href="tel:09155181798" className="group flex items-center gap-4 hover:bg-[#007bff]/5 dark:hover:bg-[#007bff]/10 p-3 rounded-2xl transition-all">
                <div className="w-12 h-12 bg-[#007bff]/10 dark:bg-[#007bff]/20 flex items-center justify-center rounded-full text-[#007bff] dark:text-[#66b0ff] text-xl transition-transform group-hover:scale-110">📞</div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-0.5">Call or SMS</p>
                  <p className="font-extrabold text-gray-900 dark:text-white group-hover:text-[#007bff] dark:group-hover:text-[#66b0ff] transition-colors">0915 518 1798</p>
                </div>
              </a>

              <a href="https://facebook.com/varcharnamekevin" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 hover:bg-[#007bff]/5 dark:hover:bg-[#007bff]/10 p-3 rounded-2xl transition-all">
                <div className="w-12 h-12 bg-[#007bff]/10 dark:bg-[#007bff]/20 flex items-center justify-center rounded-full text-[#007bff] dark:text-[#66b0ff] text-xl transition-transform group-hover:scale-110">🔵</div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-0.5">Facebook Profile</p>
                  <p className="font-extrabold text-gray-900 dark:text-white group-hover:text-[#007bff] dark:group-hover:text-[#66b0ff] transition-colors">@varcharnamekevin</p>
                </div>
              </a>

              <a href="https://discord.gg/VYH8F4RE" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 hover:bg-[#007bff]/5 dark:hover:bg-[#007bff]/10 p-3 rounded-2xl transition-all">
                <div className="w-12 h-12 bg-[#007bff]/10 dark:bg-[#007bff]/20 flex items-center justify-center rounded-full text-[#007bff] dark:text-[#66b0ff] text-xl transition-transform group-hover:scale-110">💬</div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-0.5">Community Chat</p>
                  <p className="font-extrabold text-gray-900 dark:text-white group-hover:text-[#007bff] dark:group-hover:text-[#66b0ff] transition-colors">Join our Discord</p>
                </div>
              </a>
            </div>
          </div>

          {/* DONATION / BEER CARD */}
          <div className="bg-[#ef8b10]/5 dark:bg-[#ef8b10]/10 p-8 rounded-3xl shadow-sm border border-[#ef8b10]/20 hover:shadow-xl hover:shadow-[#ef8b10]/10 transition-all duration-300">
            <h3 className="text-xs font-black uppercase text-[#ef8b10] dark:text-[#ef8b10] mb-4 tracking-widest flex items-center gap-2">
              <span className="text-xl">🍺</span> Support the Dev
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-6 font-medium leading-relaxed">
              If this app helped you save some pesos, consider buying the dev a cold beer! Cheers!
            </p>
            <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-[#ef8b10]/30 text-center shadow-inner">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">GCash Number</p>
              <p className="text-2xl font-black text-[#ef8b10] tracking-widest">0915 232 1422</p>
              <p className="text-[11px] font-bold text-gray-500 mt-2 uppercase tracking-wider">Account: Kevin Victor L.</p>
            </div>
          </div>

          <div className="p-2 italic text-sm text-gray-400 dark:text-gray-500 font-medium text-center">
            "Your updates help thousands of drivers in PH save on fuel every day."
          </div>
        </div>

        {/* RIGHT COLUMN: EMAIL FORM */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:shadow-[#007bff]/5 transition-all duration-300">
          <h3 className="text-2xl font-extrabold mb-8 dark:text-white">Send an Email</h3>
          
          {status.msg && (
            <div className={`p-4 mb-8 rounded-2xl text-sm font-bold ${status.type === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
              {status.msg}
            </div>
          )}

          <form ref={form} onSubmit={sendEmail} className="space-y-6">
            <div className="hidden" aria-hidden="true">
              <input type="text" name="_hp_field" tabIndex="-1" autoComplete="off" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Your Name</label>
                <input 
                  type="text" name="from_name" required
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl dark:bg-gray-900/50 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-[#007bff] focus:border-transparent outline-none transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Email Address</label>
                <input 
                  type="email" name="reply_to" required
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl dark:bg-gray-900/50 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-[#007bff] focus:border-transparent outline-none transition-all shadow-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Message</label>
              <textarea 
                name="message" required rows="6"
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl dark:bg-gray-900/50 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-[#007bff] focus:border-transparent outline-none transition-all shadow-sm resize-y"
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-4.5 rounded-xl font-extrabold text-white shadow-lg transition-all active:scale-95 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-[#007bff] to-[#0056b3] hover:shadow-[#007bff]/30 hover:opacity-90'}`}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default Contact;