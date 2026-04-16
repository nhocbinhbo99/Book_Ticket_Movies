import React, { useState } from 'react';
import zaloIcon from '../assets/Icon_of_Zalo.svg.png';
import messIcon from '../assets/Facebook_Messenger_logo_2025.svg.png';

const FloatingContact = () => {
  const [open, setOpen] = useState(false);

  const openChatWindow = (url) => {
    const width = 420;
    const height = 680;
    const left = window.screen.width - width - 40;
    const top = window.screen.height - height - 80;

    window.open(
      url,
      "_blank",
      `width=${width},height=${height},top=${top},left=${left},menubar=no,toolbar=no,location=no,status=no,scrollbars=yes,resizable=yes`
    );
  };

  return (
    <div className="fixed bottom-5 right-5 z-[9999]">
      {open && (
        <div className="mb-3 w-72 rounded-2xl border border-white/10 bg-[#111827] shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-white">
            <h3 className="font-semibold text-sm">Hỗ trợ TicketFlix</h3>
            <p className="text-xs text-white/80 mt-1">
              Chọn kênh để liên hệ với chúng tôi
            </p>
          </div>

          <div className="p-3 space-y-3">
            <button
              onClick={() => openChatWindow("https://m.me/61570803120970")}
              className="flex w-full items-center gap-3 rounded-xl bg-white/5 hover:bg-white/10 px-3 py-3 transition"
            >
              <img src={messIcon} alt="Messenger" className="w-10 h-10 rounded-full object-cover" />
              <div className="text-left">
                <p className="text-white text-sm font-medium">Messenger</p>
                <p className="text-xs text-gray-400">Chat với CSKH TicketFlix</p>
              </div>
            </button>

            <button
              onClick={() => openChatWindow("https://zalo.me/0889285559")}
              className="flex w-full items-center gap-3 rounded-xl bg-white/5 hover:bg-white/10 px-3 py-3 transition"
            >
              <img src={zaloIcon} alt="Zalo" className="w-10 h-10 rounded-full object-cover" />
              <div className="text-left">
                <p className="text-white text-sm font-medium">Zalo</p>
                <p className="text-xs text-gray-400">Liên hệ nhanh qua Zalo</p>
              </div>
            </button>

            <div className="text-center text-sm text-gray-400 mt-2">
              Hoặc hotline -{" "}
              <a
                href="tel:0889285559"
                className="text-yellow-400 font-semibold hover:underline"
              >
                0889285559
              </a>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl hover:scale-105 transition"
      >
        {open ? "✕" : "💬"}
      </button>
    </div>
  );
};

export default FloatingContact;
