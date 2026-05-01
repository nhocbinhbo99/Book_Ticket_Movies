import { useState, useRef } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { updateProfileApi } from "../services/auth";

// ── Variants ─────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, delay: i * 0.07, ease: "easeOut" },
  }),
};

// ── Avatar component ──────────────────────────────────────
function AvatarCircle({ user, size = 96, onClick, uploading }) {
  const initials = user?.fullName
    ? user.fullName.split(" ").map((w) => w[0]).slice(-2).join("").toUpperCase()
    : "?";

  return (
    <div
      className="relative flex-shrink-0 cursor-pointer group"
      onClick={onClick}
      title="Nhấn để đổi ảnh đại diện"
      style={{ width: size, height: size }}
    >
      {/* Avatar */}
      {user?.avatar ? (
        <img
          src={user.avatar}
          alt={user.fullName}
          className="rounded-full object-cover ring-4 ring-yellow-400/60 shadow-xl w-full h-full"
        />
      ) : (
        <div
          className="rounded-full ring-4 ring-yellow-400/60 shadow-xl flex items-center
                     justify-center bg-gradient-to-br from-indigo-600 to-purple-700
                     text-white font-bold w-full h-full"
          style={{ fontSize: size * 0.36 }}
        >
          {initials}
        </div>
      )}

      {/* Overlay khi hover */}
      <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100
                      transition-opacity flex items-center justify-center">
        {uploading ? (
          <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        )}
      </div>

      {/* Online dot */}
      <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-[#0d1b3e]" />
    </div>
  );
}

// ── Stat card ─────────────────────────────────────────────
function StatCard({ icon, label, value, i }) {
  return (
    <Motion.div
      variants={fadeUp} custom={i} initial="hidden" animate="show"
      className="flex flex-col items-center gap-1 rounded-2xl border border-white/10
                 bg-white/5 px-6 py-5 hover:border-yellow-400/40 hover:bg-white/10
                 transition-all duration-300"
    >
      <span className="text-3xl">{icon}</span>
      <span className="text-2xl font-extrabold text-yellow-300">{value}</span>
      <span className="text-xs text-gray-400 tracking-wide">{label}</span>
    </Motion.div>
  );
}

// ── Editable info row ─────────────────────────────────────
function InfoRow({ icon, label, value, editing, onChange, placeholder, readOnly }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5
                    px-5 py-4 hover:border-yellow-400/20 transition-colors">
      <span className="text-xl w-7 text-center flex-shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 mb-0.5">{label}</p>
        {editing && !readOnly ? (
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-transparent text-sm text-white border-b border-yellow-400/50
                       focus:outline-none focus:border-yellow-400 py-0.5 placeholder-gray-500
                       transition-colors"
          />
        ) : (
          <p className={`text-sm font-medium truncate ${value ? "text-white" : "text-gray-500 italic"}`}>
            {value || placeholder}
          </p>
        )}
      </div>
      {readOnly && (
        <span className="text-xs bg-white/5 text-gray-500 px-2 py-0.5 rounded-full flex-shrink-0">
          Cố định
        </span>
      )}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────
export default function ProfilePage() {
  const { user, token, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  // Edit state
  const [editing, setEditing] = useState(false);
  const [editFullName, setEditFullName] = useState(user?.fullName || "");
  const [editPhone, setEditPhone]       = useState(user?.phone    || "");

  // Upload state
  const [uploading, setUploading]   = useState(false);
  const [saving, setSaving]         = useState(false);
  const [saveMsg, setSaveMsg]       = useState("");
  const [saveErr, setSaveErr]       = useState("");

  // Modal logout
  const [showLogout, setShowLogout] = useState(false);

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("vi-VN", { year: "numeric", month: "long" })
    : "Mới tham gia";

  // ─── Upload avatar ─────────────────────────────────────
  const handleAvatarClick = () => fileRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setSaveErr("Chỉ chấp nhận file ảnh"); return; }
    if (file.size > 3 * 1024 * 1024) { setSaveErr("Ảnh phải nhỏ hơn 3MB"); return; }

    setUploading(true);
    setSaveErr("");
    try {
      // Resize + convert to base64 via canvas
      const base64 = await resizeImage(file, 256);

      const result = await updateProfileApi(token, { avatar: base64 });
      updateUser(result.user);
      setSaveMsg("Đã cập nhật ảnh đại diện!");
      setTimeout(() => setSaveMsg(""), 3000);
    } catch (err) {
      setSaveErr(err.message || "Upload thất bại");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  // ─── Save profile ──────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    setSaveErr("");
    try {
      const result = await updateProfileApi(token, {
        fullName: editFullName,
        phone: editPhone,
      });
      updateUser(result.user);
      setSaveMsg("Lưu thành công!");
      setEditing(false);
      setTimeout(() => setSaveMsg(""), 3000);
    } catch (err) {
      setSaveErr(err.message || "Lưu thất bại");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditFullName(user?.fullName || "");
    setEditPhone(user?.phone || "");
    setEditing(false);
    setSaveErr("");
  };

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <div className="min-h-screen bg-[#060e1f] pt-24 pb-16 px-4">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px]
                        rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px]
                        rounded-full bg-purple-700/10 blur-[100px]" />
      </div>

      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="relative z-10 max-w-4xl mx-auto space-y-6">

        {/* ── Toast messages ── */}
        <AnimatePresence>
          {(saveMsg || saveErr) && (
            <Motion.div
              initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl
                          shadow-2xl text-sm font-medium ${saveMsg
                ? "bg-green-500/20 border border-green-400/40 text-green-300"
                : "bg-red-500/20 border border-red-400/40 text-red-300"}`}
            >
              {saveMsg || saveErr}
            </Motion.div>
          )}
        </AnimatePresence>

        {/* ── Hero card ── */}
        <Motion.div
          variants={fadeUp} custom={0} initial="hidden" animate="show"
          className="relative overflow-hidden rounded-3xl border border-white/10
                     bg-gradient-to-br from-[#0d1b3e] via-[#111f4d] to-[#0c2050]
                     shadow-[0_0_60px_rgba(99,102,241,0.15)] p-8 md:p-10"
        >
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full
                          bg-gradient-to-br from-yellow-400/20 to-indigo-600/10 blur-2xl" />

          <div className="relative flex flex-col md:flex-row items-center md:items-end gap-6">
            {/* Avatar — nhấn để upload */}
            <AvatarCircle
              user={user}
              size={104}
              onClick={handleAvatarClick}
              uploading={uploading}
            />

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                {user?.fullName || "Người dùng"}
              </h1>
              <p className="mt-1 text-yellow-300/80 text-sm">{user?.email}</p>
              <div className="mt-3 flex items-center justify-center md:justify-start gap-2">
                <span className="text-xs bg-indigo-600/50 border border-indigo-400/30 px-3 py-1 rounded-full text-indigo-200">
                  🎬 Thành viên
                </span>
                <span className="text-xs bg-yellow-500/10 border border-yellow-500/20 px-3 py-1 rounded-full text-yellow-300">
                  ⭐ {joinedDate}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 flex-wrap justify-center">
              <button
                onClick={() => navigate("/ticket")}
                className="px-5 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black
                           font-semibold text-sm transition-all hover:scale-105 shadow-lg shadow-yellow-500/25"
              >
                🎫 Vé của tôi
              </button>
              <button
                onClick={() => setShowLogout(true)}
                className="px-5 py-2.5 rounded-xl border border-red-500/40 bg-red-500/10
                           hover:bg-red-500/20 text-red-400 font-semibold text-sm transition-all hover:scale-105"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </Motion.div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: "🎫", label: "Vé đã đặt",   value: "0" },
            { icon: "🎬", label: "Phim đã xem",  value: "0" },
            { icon: "⭐", label: "Đánh giá",     value: "0" },
            { icon: "❤️", label: "Yêu thích",    value: "0" },
          ].map((s, i) => <StatCard key={i} {...s} i={i} />)}
        </div>

        {/* ── Info section ── */}
        <Motion.div
          variants={fadeUp} custom={3} initial="hidden" animate="show"
          className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 md:p-8"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-1 h-5 rounded-full bg-yellow-400 inline-block" />
              Thông tin tài khoản
            </h2>

            {/* Edit / Save / Cancel buttons */}
            {!editing ? (
              <button
                onClick={() => { setEditing(true); setSaveMsg(""); setSaveErr(""); }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/20
                           bg-white/5 text-sm text-gray-300 hover:text-yellow-400 hover:border-yellow-400/40
                           transition-all duration-200"
              >
                ✏️ Chỉnh sửa
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 rounded-xl border border-white/20 text-gray-400 text-sm hover:bg-white/5 transition"
                >
                  Huỷ
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black
                             font-semibold text-sm transition disabled:opacity-60 flex items-center gap-2"
                >
                  {saving && <span className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />}
                  Lưu
                </button>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <InfoRow
              icon="👤" label="Họ và tên"
              value={editing ? editFullName : user?.fullName}
              editing={editing}
              onChange={setEditFullName}
              placeholder="Chưa cập nhật"
            />
            <InfoRow
              icon="📧" label="Email"
              value={user?.email}
              editing={false}
              placeholder="—"
              readOnly
            />
            <InfoRow
              icon="📱" label="Số điện thoại"
              value={editing ? editPhone : user?.phone}
              editing={editing}
              onChange={setEditPhone}
              placeholder="Chưa cập nhật"
            />
            <InfoRow
              icon="🔑" label="Loại tài khoản"
              value={user?.googleId ? "Google Account" : "Email & Mật khẩu"}
              editing={false}
              readOnly
            />
          </div>
        </Motion.div>

        {/* ── Quick links ── */}
        <Motion.div
          variants={fadeUp} custom={4} initial="hidden" animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {[
            { icon: "🎟️", title: "Vé của tôi",    desc: "Xem tất cả vé đã đặt",       path: "/ticket", color: "from-yellow-500/20 to-orange-500/10 border-yellow-500/20" },
            { icon: "🎬", title: "Khám phá phim",  desc: "Tìm phim đang chiếu",         path: "/movie",  color: "from-indigo-500/20 to-purple-500/10 border-indigo-500/20" },
            { icon: "📰", title: "Tin điện ảnh",   desc: "Cập nhật tin tức mới nhất",   path: "/news",   color: "from-blue-500/20 to-cyan-500/10 border-blue-500/20" },
            { icon: "🏠", title: "Trang chủ",      desc: "Quay về trang chính",          path: "/",       color: "from-green-500/20 to-teal-500/10 border-green-500/20" },
          ].map((item, i) => (
            <Motion.div key={item.path} variants={fadeUp} custom={i} initial="hidden" animate="show">
              <Link
                to={item.path}
                className={`flex items-center gap-4 rounded-2xl border bg-gradient-to-br
                           ${item.color} p-5 hover:scale-[1.02] transition-all duration-300 group`}
              >
                <span className="text-3xl">{item.icon}</span>
                <div>
                  <p className="font-semibold text-white group-hover:text-yellow-300 transition-colors">{item.title}</p>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </div>
                <span className="ml-auto text-gray-500 group-hover:text-yellow-400 transition-colors text-lg">→</span>
              </Link>
            </Motion.div>
          ))}
        </Motion.div>
      </div>

      {/* ── Logout modal ── */}
      <AnimatePresence>
        {showLogout && (
          <Motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
            onClick={() => setShowLogout(false)}
          >
            <Motion.div
              initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-[#0d1b3e] border border-white/10 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-5xl mb-4">👋</div>
              <h3 className="text-xl font-bold text-white mb-2">Đăng xuất?</h3>
              <p className="text-gray-400 text-sm mb-6">Bạn sẽ cần đăng nhập lại để đặt vé và xem lịch sử.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogout(false)}
                  className="flex-1 py-3 rounded-xl border border-white/20 text-gray-300 hover:bg-white/5 transition"
                >
                  Huỷ
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-400 text-white font-semibold transition"
                >
                  Đăng xuất
                </button>
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Resize ảnh về 256×256, trả base64 ────────────────────
function resizeImage(file, size = 256) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = size;
      const ctx = canvas.getContext("2d");

      // crop trung tâm
      const min = Math.min(img.width, img.height);
      const sx  = (img.width  - min) / 2;
      const sy  = (img.height - min) / 2;
      ctx.drawImage(img, sx, sy, min, min, 0, 0, size, size);

      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.8));
    };
    img.onerror = reject;
    img.src = url;
  });
}
