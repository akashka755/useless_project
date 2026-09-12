import React from 'react';
import { ShieldCheck, MapPin, PhoneCall } from 'lucide-react';


export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#172337] text-gray-300 text-xs mt-12 border-t-4 border-[#2874f0]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 pb-8 border-b border-gray-700">
          {/* Column 1: ABOUT */}
          <div>
            <h4 className="text-gray-400 font-bold uppercase tracking-wider text-[11px] mb-2.5">
              ABOUT FLOPKART
            </h4>
            <ul className="space-y-1.5 text-[11.5px]">
              <li><a href="#about" onClick={(e) => { e.preventDefault(); alert('About Us: We were founded on a dare in 2007 and haven\'t shipped a functioning item since.'); }} className="hover:underline">Contact Us (Please Don't)</a></li>
              <li><a href="#careers" onClick={(e) => { e.preventDefault(); alert('Careers: We are hiring unpaid interns to apologize to customers.'); }} className="hover:underline">Unpaid Careers</a></li>
              <li><a href="#stories" onClick={(e) => { e.preventDefault(); alert('Flopkart Stories: The Tale of the Missing Left Shoe.'); }} className="hover:underline">Fictional Stories</a></li>
              <li><a href="#press" onClick={(e) => { e.preventDefault(); alert('Press: 42 Cease and Desist letters currently pending.'); }} className="hover:underline">Legal Notices</a></li>
              <li><a href="#wholesale" onClick={(e) => { e.preventDefault(); alert('Wholesale: Buy 100 damp boxes, get 0 free.'); }} className="hover:underline">Flopkart Wholesale</a></li>
            </ul>
          </div>

          {/* Column 2: HELP */}
          <div>
            <h4 className="text-gray-400 font-bold uppercase tracking-wider text-[11px] mb-2.5">
              CUSTOMER AGONY
            </h4>
            <ul className="space-y-1.5 text-[11.5px]">
              <li><a href="#payments" onClick={(e) => { e.preventDefault(); alert('Payments: We only take Monopoly cash, IOU crayons, or handshakes.'); }} className="hover:underline">Broken Payments</a></li>
              <li><a href="#shipping" onClick={(e) => { e.preventDefault(); alert('Shipping: Sometime between next Tuesday and the year 2048.'); }} className="hover:underline">Lost In Transit</a></li>
              <li><a href="#returns" onClick={(e) => { e.preventDefault(); alert('Returns: Strictly prohibited by cosmic decree.'); }} className="hover:underline">Non-Return Policy</a></li>
              <li><a href="#faq" onClick={(e) => { e.preventDefault(); alert('FAQ: Why did you buy this? Because of marketing.'); }} className="hover:underline">Existential FAQ</a></li>
            </ul>
          </div>

          {/* Column 3: POLICY */}
          <div>
            <h4 className="text-gray-400 font-bold uppercase tracking-wider text-[11px] mb-2.5">
              LEGAL LOOPHOLES
            </h4>
            <ul className="space-y-1.5 text-[11.5px]">
              <li><a href="#security" onClick={(e) => { e.preventDefault(); alert('Security: We leaked your ancient Egyptian hieroglyphic password.'); }} className="hover:underline">Compromised Security</a></li>
              <li><a href="#privacy" onClick={(e) => { e.preventDefault(); alert('Privacy: We sell your mouse velocity data to third-party ad brokers.'); }} className="hover:underline">Privacy Forfeiture</a></li>
              <li><a href="#terms" onClick={(e) => { e.preventDefault(); alert('Terms: By visiting this page, you owe us one damp cardboard box.'); }} className="hover:underline">Terms of Despair</a></li>
              <li><a href="#sitemap" onClick={(e) => { e.preventDefault(); alert('Sitemap: A labyrinth with no exit.'); }} className="hover:underline">Unnavigable Sitemap</a></li>
            </ul>
          </div>

          {/* Column 4: SOCIAL */}
          <div>
            <h4 className="text-gray-400 font-bold uppercase tracking-wider text-[11px] mb-2.5">
              ABANDONED SOCIAL
            </h4>
            <ul className="space-y-1.5 text-[11.5px]">
              <li><a href="#x" onClick={(e) => { e.preventDefault(); alert('X / Twitter: Banned for spamming wet cardboard images.'); }} className="hover:underline">X (Permanently Suspended)</a></li>
              <li><a href="#yt" onClick={(e) => { e.preventDefault(); alert('YouTube: 10-hour loop of server cooling fans malfunctioning.'); }} className="hover:underline">YouTube (Fan Noise)</a></li>
              <li><a href="#fb" onClick={(e) => { e.preventDefault(); alert('Facebook: Poked by random bot accounts in 2012.'); }} className="hover:underline">Facebook (Ghost Town)</a></li>
            </ul>
          </div>

          {/* Column 5 & 6: FAKE ADDRESS */}
          <div className="col-span-2 border-t md:border-t-0 md:border-l border-gray-700 md:pl-6 text-[11px] text-gray-400 space-y-2">
            <div>
              <p className="font-bold text-gray-200 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                Registered Dumpster Address:
              </p>
              <p className="leading-relaxed">
                Flopkart Internet Agony Private Limited,<br />
                Buildings Alyssa, Begonia & Broken Hopes,<br />
                Behind Dumpster #4, Koramangala 4th Block,<br />
                Bengaluru, 560034, Karnataka, India<br />
                CIN : U51109KA2012PTC066107 (Void)
              </p>
            </div>
            <div className="pt-2">
              <p className="font-bold text-gray-200 flex items-center gap-1">
                <PhoneCall className="w-3.5 h-3.5 text-amber-500" />
                Grievance Hotline:
              </p>
              <p className="text-amber-400 font-mono">080-404-NO-ANSWER (Rings forever)</p>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-400 gap-4">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-yellow-400 font-bold">
              <ShieldCheck className="w-4 h-4" /> 100% Insecure Transactions
            </span>
            <span className="hidden md:inline text-gray-500">•</span>
            <span className="text-gray-400">Zero Customer Satisfaction Guaranteed</span>
          </div>
          <div>
            © 2007-2026 Flopkart.com | Parody engineered with 100% satirical precision.
          </div>
        </div>
      </div>
    </footer>
  );
};
