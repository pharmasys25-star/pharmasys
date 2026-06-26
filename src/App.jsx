import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── SUPABASE CLIENT ────────────────────────────────────────────
const supabase = createClient(
  "https://ajkncnpxdoxpzdlzzkem.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqa25jbnB4ZG94cHpkbHp6a2VtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzODA3OTgsImV4cCI6MjA5Nzk1Njc5OH0.FJw6-wtxLYMw65oGta-TTCQCNqjo0OqitCA7kNUxEvk"
);

// ─── DESIGN TOKENS ───────────────────────────────────────────────
const COLORS = {
  navy: "#0F1B2D", teal: "#00897B", tealLight: "#E0F2F1", white: "#F7F9FC",
  amber: "#F59E0B", amberLight: "#FEF3C7", red: "#EF4444", redLight: "#FEE2E2",
  slate: "#64748B", slateLight: "#F1F5F9", border: "#E2E8F0", success: "#10B981",
};

// ─── PERMISSIONS ──────────────────────────────────────────────────
const canSeeRevenue = (role) => role === "Admin";
const canSeeReports = (role) => role === "Admin";
const canDeleteDrug = (role) => role === "Admin";
const canResetData = (role) => role === "Admin";
const canManageStaff = (role) => role === "Admin";

// ─── ICONS ───────────────────────────────────────────────────────
const Icon = ({ name, size = 20 }) => {
  const icons = {
    dashboard: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    inventory: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
    sales: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z",
    orders: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
    reports: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    alert: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
    plus: "M12 4v16m8-8H4",
    check: "M5 13l4 4L19 7",
    x: "M6 18L18 6M6 6l12 12",
    menu: "M4 6h16M4 12h16M4 18h16",
    lock: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 10-8 0v2",
    logout: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1",
    staff: "M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m5-3.13a4 4 0 100-8 4 4 0 000 8zm6 0a4 4 0 100-8",
  };
  return (
    <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d={icons[name] || icons.dashboard} />
    </svg>
  );
};

const Badge = ({ label, color }) => {
  const map = {
    green: { bg: "#D1FAE5", text: "#065F46" }, amber: { bg: COLORS.amberLight, text: "#92400E" },
    red: { bg: COLORS.redLight, text: "#991B1B" }, blue: { bg: "#DBEAFE", text: "#1E40AF" },
    slate: { bg: COLORS.slateLight, text: COLORS.slate },
  };
  const c = map[color] || map.slate;
  return <span style={{ background: c.bg, color: c.text, padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{label}</span>;
};

const Card = ({ children, style = {} }) => (
  <div style={{ background: "#fff", borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 20, ...style }}>{children}</div>
);

const StatCard = ({ label, value, sub, accent, icon, locked }) => (
  <Card style={{ display: "flex", alignItems: "flex-start", gap: 14, position: "relative" }}>
    {locked ? (
      <>
        <div style={{ background: COLORS.slateLight, borderRadius: 10, padding: 10, color: COLORS.slate, flexShrink: 0 }}>
          <Icon name="lock" size={22} />
        </div>
        <div>
          <div style={{ fontSize: 13, color: COLORS.slate, marginBottom: 2 }}>{label}</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: COLORS.slate }}>Admin only</div>
        </div>
      </>
    ) : (
      <>
        <div style={{ background: accent + "22", borderRadius: 10, padding: 10, color: accent, flexShrink: 0 }}>
          <Icon name={icon} size={22} />
        </div>
        <div>
          <div style={{ fontSize: 13, color: COLORS.slate, marginBottom: 2 }}>{label}</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: COLORS.navy, lineHeight: 1 }}>{value}</div>
          {sub && <div style={{ fontSize: 12, color: COLORS.slate, marginTop: 4 }}>{sub}</div>}
        </div>
      </>
    )}
  </Card>
);

// ─── LOGIN SCREEN ─────────────────────────────────────────────────
const LoginScreen = ({ onLogin }) => {
  const [staffList, setStaffList] = useState([]);
  const [mode, setMode] = useState("pick"); // pick | pin | new
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("Staff");
  const [newPin, setNewPin] = useState("");

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("staff").select("*").eq("active", true).order("created_at");
    if (!error) setStaffList(data || []);
    setLoading(false);
  };

  const pickStaff = (s) => {
    setSelectedStaff(s);
    setPin("");
    setError("");
    setMode("pin");
  };

  const tryLogin = () => {
    if (pin === selectedStaff.pin) {
      onLogin(selectedStaff);
    } else {
      setError("Incorrect PIN. Try again.");
      setPin("");
    }
  };

  const createStaff = async () => {
    if (!newName.trim() || newPin.length !== 4) {
      setError("Enter a name and a 4-digit PIN.");
      return;
    }
    const { data, error } = await supabase.from("staff").insert([{ name: newName.trim(), role: newRole, pin: newPin }]).select().single();
    if (error) {
      setError("Could not create account. Try again.");
      return;
    }
    onLogin(data);
  };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.navy, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', system-ui, sans-serif", padding: 20 }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 28, marginBottom: 4 }}>💊</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.navy }}>SSMS</div>
          <div style={{ fontSize: 13, color: COLORS.slate }}>Sign in to continue</div>
        </div>

        {error && <div style={{ background: COLORS.redLight, color: COLORS.red, padding: 10, borderRadius: 8, fontSize: 13, marginBottom: 14, textAlign: "center" }}>{error}</div>}

        {mode === "pick" && (
          <>
            {loading ? (
              <div style={{ textAlign: "center", color: COLORS.slate, padding: 20 }}>Loading staff…</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                {staffList.map(s => (
                  <button key={s.id} onClick={() => pickStaff(s)} style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10,
                    border: `1px solid ${COLORS.border}`, background: "#fff", cursor: "pointer", textAlign: "left"
                  }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: COLORS.teal, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                      {s.name[0].toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: COLORS.navy, fontSize: 14 }}>{s.name}</div>
                      <div style={{ fontSize: 12, color: COLORS.slate }}>{s.role}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
            <button onClick={() => { setMode("new"); setError(""); }} style={{ width: "100%", padding: 12, borderRadius: 10, border: `1px dashed ${COLORS.teal}`, background: COLORS.tealLight, color: COLORS.teal, fontWeight: 600, cursor: "pointer" }}>
              + Add new staff member
            </button>
          </>
        )}

        {mode === "pin" && (
          <>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <div style={{ width: 50, height: 50, borderRadius: "50%", background: COLORS.teal, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 20, margin: "0 auto 10px" }}>
                {selectedStaff.name[0].toUpperCase()}
              </div>
              <div style={{ fontWeight: 700, color: COLORS.navy }}>{selectedStaff.name}</div>
              <div style={{ fontSize: 12, color: COLORS.slate }}>{selectedStaff.role}</div>
            </div>
            <input
              type="password" inputMode="numeric" maxLength={4} autoFocus
              value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, ""))}
              onKeyDown={e => e.key === "Enter" && tryLogin()}
              placeholder="Enter 4-digit PIN"
              style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: `1px solid ${COLORS.border}`, fontSize: 18, textAlign: "center", letterSpacing: 8, boxSizing: "border-box", marginBottom: 14 }}
            />
            <button onClick={tryLogin} style={{ width: "100%", padding: 12, borderRadius: 10, border: "none", background: COLORS.teal, color: "#fff", fontWeight: 700, cursor: "pointer", marginBottom: 8 }}>
              Sign In
            </button>
            <button onClick={() => { setMode("pick"); setError(""); }} style={{ width: "100%", padding: 10, borderRadius: 10, border: "none", background: "none", color: COLORS.slate, cursor: "pointer", fontSize: 13 }}>
              ← Back
            </button>
          </>
        )}

        {mode === "new" && (
          <>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: COLORS.slate, display: "block", marginBottom: 4 }}>Name</label>
              <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Akua" style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${COLORS.border}`, fontSize: 14, boxSizing: "border-box" }} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: COLORS.slate, display: "block", marginBottom: 4 }}>Role</label>
              <select value={newRole} onChange={e => setNewRole(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${COLORS.border}`, fontSize: 14 }}>
                <option>Staff</option>
                <option>Cashier</option>
                <option>Pharmacist</option>
                <option>Admin</option>
              </select>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: COLORS.slate, display: "block", marginBottom: 4 }}>Set a 4-digit PIN</label>
              <input type="password" inputMode="numeric" maxLength={4} value={newPin} onChange={e => setNewPin(e.target.value.replace(/\D/g, ""))} placeholder="••••" style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${COLORS.border}`, fontSize: 16, letterSpacing: 4, boxSizing: "border-box" }} />
            </div>
            <button onClick={createStaff} style={{ width: "100%", padding: 12, borderRadius: 10, border: "none", background: COLORS.teal, color: "#fff", fontWeight: 700, cursor: "pointer", marginBottom: 8 }}>
              Create & Sign In
            </button>
            <button onClick={() => { setMode("pick"); setError(""); }} style={{ width: "100%", padding: 10, borderRadius: 10, border: "none", background: "none", color: COLORS.slate, cursor: "pointer", fontSize: 13 }}>
              ← Back
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// ─── AI SCAN MODAL ────────────────────────────────────────────────
const ScanModal = ({ onClose, onImport }) => {
  const [stage, setStage] = useState("upload");
  const [imageData, setImageData] = useState(null);
  const [mediaType, setMediaType] = useState("image/jpeg");
  const [scanned, setScanned] = useState([]);
  const [selected, setSelected] = useState({});
  const [error, setError] = useState("");

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMediaType(file.type || "image/jpeg");
    const reader = new FileReader();
    reader.onload = () => setImageData(reader.result.split(",")[1]);
    reader.readAsDataURL(file);
  };

  const runScan = async () => {
    if (!imageData) return;
    setStage("scanning");
    setError("");
    try {
      const GEMINI_API_KEY = "AQ.Ab8RN6J0Ca0N8P6a0viAveDFTx7KTpQyKdqXwnFJzXq0GOSLzw";
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [
              { inline_data: { mime_type: mediaType, data: imageData } },
              { text: `You are a pharmacy inventory assistant. Look carefully at this image, which contains a printed or handwritten drug/medicine list (it may be a table, a list, or freeform text).
Extract every single drug/medicine entry you can see and return ONLY a JSON array, no explanation, no markdown formatting, no code fences — just raw JSON starting with [ and ending with ], like:
[{"name":"Amoxicillin 500mg","category":"Antibiotics","qty":100,"reorder":20,"price":0,"expiry":"","supplier":""}]
- name: full drug name with strength/dosage if visible
- category: guess from drug type (Antibiotics, Pain Relief, Diabetes, Cardiovascular, Gastro, Respiratory, Vitamins, Other)
- qty: quantity/stock count if visible as a number, else 0
- reorder: 20% of qty rounded, or 10 if qty unknown
- price: unit price as a number if visible, else 0
- expiry: expiry date in YYYY-MM-DD format if visible, else ""
- supplier: supplier name if visible, else ""
Be thorough — scan every row/line in the image, even if the list is long. If you genuinely cannot find any drug names anywhere in the image, return [].` }
            ]
          }]
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        setError(`Scan request failed (${res.status}). ${errText.slice(0, 150)}`);
        setStage("upload");
        return;
      }

      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
      const clean = text.replace(/```json|```/g, "").trim();

      let items;
      try {
        items = JSON.parse(clean);
      } catch {
        setError("AI response couldn't be read. Try a clearer or simpler photo.");
        setStage("upload");
        return;
      }

      if (!Array.isArray(items) || items.length === 0) {
        setError("No drugs could be identified in this image. Try better lighting or a closer photo.");
        setStage("upload");
        return;
      }
      setScanned(items);
      const sel = {};
      items.forEach((_, i) => sel[i] = true);
      setSelected(sel);
      setStage("review");
    } catch {
      setError("Could not reach the scanning service. Check your internet connection.");
      setStage("upload");
    }
  };

  const confirmImport = () => {
    const toAdd = scanned.filter((_, i) => selected[i]).map(item => ({
      ...item, qty: +item.qty || 0, reorder: +item.reorder || 10, price: +item.price || 0
    }));
    onImport(toAdd);
    onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#fff", borderRadius: 14, width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto", padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: COLORS.navy, margin: 0 }}>📸 Scan Drug List</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.slate }}><Icon name="x" size={20} /></button>
        </div>

        {stage === "upload" && (
          <>
            <div style={{ background: COLORS.tealLight, borderRadius: 10, padding: 16, marginBottom: 16, fontSize: 13, color: "#00695C" }}>
              📋 Take a clear photo of your handwritten or printed drug list, or choose one from your gallery. Your browser will ask permission to access the camera/photos — please tap "Allow".
            </div>
            {error && <div style={{ background: COLORS.redLight, color: COLORS.red, borderRadius: 8, padding: 12, marginBottom: 14, fontSize: 13 }}>{error}</div>}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
              <label style={{ display: "block", border: `2px dashed ${COLORS.teal}`, borderRadius: 10, padding: 22, textAlign: "center", cursor: "pointer", color: COLORS.teal }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>📷</div>
                <div style={{ fontWeight: 600 }}>Take a photo</div>
                <input type="file" accept="image/*" capture="environment" onChange={handleFile} style={{ display: "none" }} />
              </label>
              <label style={{ display: "block", border: `2px dashed ${COLORS.slate}`, borderRadius: 10, padding: 22, textAlign: "center", cursor: "pointer", color: COLORS.slate }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>🖼️</div>
                <div style={{ fontWeight: 600 }}>Choose from gallery</div>
                <input type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
              </label>
            </div>
            {imageData && <div style={{ textAlign: "center", color: COLORS.success, fontWeight: 600, marginBottom: 14, fontSize: 14 }}>✅ Image selected — ready to scan</div>}
            <button onClick={runScan} disabled={!imageData} style={{ width: "100%", background: imageData ? COLORS.teal : COLORS.border, color: imageData ? "#fff" : COLORS.slate, border: "none", borderRadius: 8, padding: 12, cursor: imageData ? "pointer" : "not-allowed", fontWeight: 700, fontSize: 15 }}>
              Scan with AI →
            </button>
          </>
        )}

        {stage === "scanning" && (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🤖</div>
            <div style={{ fontWeight: 700, color: COLORS.navy, fontSize: 16, marginBottom: 8 }}>Reading your drug list…</div>
            <div style={{ color: COLORS.slate, fontSize: 13 }}>AI is extracting drug names, quantities and details</div>
          </div>
        )}

        {stage === "review" && (
          <>
            <div style={{ background: COLORS.tealLight, borderRadius: 8, padding: 12, marginBottom: 14, fontSize: 13, color: "#00695C" }}>
              ✅ Found <strong>{scanned.length} drugs</strong>. Tick the ones you want to import, then click Confirm.
            </div>
            {scanned.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                <input type="checkbox" checked={!!selected[i]} onChange={e => setSelected(s => ({ ...s, [i]: e.target.checked }))} style={{ marginTop: 3, accentColor: COLORS.teal, width: 16, height: 16 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: COLORS.navy, fontSize: 14 }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: COLORS.slate }}>
                    {item.category} · Qty: {item.qty} · Price: ₹{item.price}
                    {item.expiry ? ` · Exp: ${item.expiry}` : ""}{item.supplier ? ` · ${item.supplier}` : ""}
                  </div>
                </div>
              </div>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button onClick={confirmImport} style={{ flex: 1, background: COLORS.teal, color: "#fff", border: "none", borderRadius: 8, padding: 11, cursor: "pointer", fontWeight: 700 }}>
                Import {Object.values(selected).filter(Boolean).length} Drugs
              </button>
              <button onClick={() => setStage("upload")} style={{ background: COLORS.slateLight, color: COLORS.slate, border: "none", borderRadius: 8, padding: 11, cursor: "pointer" }}>Rescan</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ─── DASHBOARD ───────────────────────────────────────────────────
const Dashboard = ({ inventory, sales, orders, user }) => {
  const lowStock = inventory.filter(i => i.qty <= i.reorder);
  const today = new Date().toISOString().slice(0, 10);
  const todaySales = sales.filter(s => s.created_at?.slice(0, 10) === today);
  const todayRevenue = todaySales.reduce((a, s) => a + Number(s.total), 0);
  const seeRevenue = canSeeRevenue(user.role);

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: COLORS.navy, marginBottom: 6 }}>Hi, {user.name} 👋</h2>
      <p style={{ color: COLORS.slate, marginBottom: 24, fontSize: 14 }}>Here's your pharmacy at a glance.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14, marginBottom: 28 }}>
        {seeRevenue ? (
          <StatCard label="Today's Revenue" value={`₹${todayRevenue.toFixed(2)}`} sub={`${todaySales.length} transactions`} accent={COLORS.teal} icon="sales" />
        ) : (
          <StatCard label="Today's Revenue" locked />
        )}
        <StatCard label="Low Stock Items" value={lowStock.length} sub="Need reordering" accent={COLORS.red} icon="alert" />
        <StatCard label="Total Products" value={inventory.length} sub="Active SKUs" accent="#6366F1" icon="inventory" />
        <StatCard label="Open Orders" value={orders.filter(o => o.status !== "Delivered").length} sub="Pending delivery" accent={COLORS.amber} icon="orders" />
      </div>

      {lowStock.length > 0 && (
        <Card style={{ marginBottom: 20, borderColor: COLORS.amberLight, background: COLORS.amberLight }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
            <span style={{ color: COLORS.amber }}><Icon name="alert" size={18} /></span>
            <strong style={{ color: "#92400E" }}>Low Stock Alerts</strong>
          </div>
          {lowStock.map(item => (
            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderTop: `1px solid #FDE68A` }}>
              <span style={{ fontSize: 14, color: COLORS.navy }}>{item.name}</span>
              <span style={{ fontSize: 13, color: "#B45309", fontWeight: 600 }}>{item.qty} left (min {item.reorder})</span>
            </div>
          ))}
        </Card>
      )}

      {seeRevenue && (
        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.navy, marginBottom: 14 }}>Recent Sales</h3>
          {sales.slice(0, 5).map(s => (
            <div key={s.id} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${COLORS.border}`, fontSize: 13 }}>
              <div>
                <div style={{ fontWeight: 600, color: COLORS.navy }}>{s.item}</div>
                <div style={{ color: COLORS.slate }}>{s.cashier_name} · {new Date(s.created_at).toLocaleDateString()}</div>
              </div>
              <span style={{ fontWeight: 700, color: COLORS.teal }}>₹{Number(s.total).toFixed(2)}</span>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
};

// ─── INVENTORY ────────────────────────────────────────────────────
const Inventory = ({ inventory, reload, user }) => {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showScan, setShowScan] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", category: "", qty: "", reorder: "", price: "", expiry: "", supplier: "" });
  const [saving, setSaving] = useState(false);

  const filtered = inventory.filter(i => i.name.toLowerCase().includes(search.toLowerCase()) || (i.category || "").toLowerCase().includes(search.toLowerCase()));

  const resetForm = () => setForm({ name: "", category: "", qty: "", reorder: "", price: "", expiry: "", supplier: "" });

  const addItem = async () => {
    if (!form.name || !form.qty) return;
    setSaving(true);
    await supabase.from("inventory").insert([{
      name: form.name, category: form.category, qty: +form.qty, reorder: +form.reorder || 10,
      price: +form.price || 0, expiry: form.expiry || null, supplier: form.supplier
    }]);
    await supabase.from("activity_log").insert([{ staff_id: user.id, staff_name: user.name, action: "Added drug", details: form.name }]);
    resetForm();
    setShowForm(false);
    setSaving(false);
    reload();
  };

  const startEdit = (item) => {
    setForm({
      name: item.name || "", category: item.category || "", qty: String(item.qty ?? ""),
      reorder: String(item.reorder ?? ""), price: String(item.price ?? ""),
      expiry: item.expiry || "", supplier: item.supplier || ""
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const saveEdit = async () => {
    if (!form.name || !form.qty) return;
    setSaving(true);
    const before = inventory.find(i => i.id === editingId);
    await supabase.from("inventory").update({
      name: form.name, category: form.category, qty: +form.qty, reorder: +form.reorder || 10,
      price: +form.price || 0, expiry: form.expiry || null, supplier: form.supplier
    }).eq("id", editingId);
    const changes = [];
    if (before) {
      if (String(before.qty) !== form.qty) changes.push(`qty ${before.qty}→${form.qty}`);
      if (String(before.price) !== form.price) changes.push(`price ${before.price}→${form.price}`);
      if ((before.category || "") !== form.category) changes.push(`category ${before.category}→${form.category}`);
      if ((before.supplier || "") !== form.supplier) changes.push(`supplier ${before.supplier}→${form.supplier}`);
    }
    await supabase.from("activity_log").insert([{ staff_id: user.id, staff_name: user.name, action: "Edited drug", details: `${form.name}${changes.length ? " (" + changes.join(", ") + ")" : ""}` }]);
    resetForm();
    setEditingId(null);
    setShowForm(false);
    setSaving(false);
    reload();
  };

  const cancelForm = () => {
    resetForm();
    setEditingId(null);
    setShowForm(false);
  };

  const deleteItem = async (item) => {
    if (!canDeleteDrug(user.role)) return;
    if (!window.confirm(`Delete ${item.name}? This cannot be undone.`)) return;
    await supabase.from("inventory").delete().eq("id", item.id);
    await supabase.from("activity_log").insert([{ staff_id: user.id, staff_name: user.name, action: "Deleted drug", details: item.name }]);
    reload();
  };

  const handleScanImport = async (items) => {
    await supabase.from("inventory").insert(items);
    await supabase.from("activity_log").insert([{ staff_id: user.id, staff_name: user.name, action: "Imported via scan", details: `${items.length} drugs` }]);
    reload();
  };

  const getStatus = (item) => {
    if (item.qty === 0) return <Badge label="Out of Stock" color="red" />;
    if (item.qty <= item.reorder) return <Badge label="Low Stock" color="amber" />;
    return <Badge label="In Stock" color="green" />;
  };

  return (
    <div>
      {showScan && <ScanModal onClose={() => setShowScan(false)} onImport={handleScanImport} />}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.navy }}>Inventory</h2>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search drugs…" style={{ padding: "8px 14px", borderRadius: 8, border: `1px solid ${COLORS.border}`, fontSize: 14, outline: "none", width: 160 }} />
          <button onClick={() => setShowScan(true)} style={{ background: COLORS.navy, color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>📸 Scan</button>
          <button onClick={() => { resetForm(); setEditingId(null); setShowForm(!showForm); }} style={{ background: COLORS.teal, color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600 }}>
            <Icon name="plus" size={16} /> Add Drug
          </button>
        </div>
      </div>

      {showForm && (
        <Card style={{ marginBottom: 20, borderColor: COLORS.teal }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, color: COLORS.navy }}>{editingId ? `Edit Drug — ${form.name}` : "New Drug Entry"}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
            {[["Drug Name", "name"], ["Category", "category"], ["Quantity", "qty"], ["Reorder Level", "reorder"], ["Unit Price (₹)", "price"], ["Expiry Date", "expiry"], ["Supplier", "supplier"]].map(([label, key]) => (
              <div key={key}>
                <label style={{ fontSize: 12, color: COLORS.slate, display: "block", marginBottom: 4 }}>{label}</label>
                <input type={["qty", "reorder", "price"].includes(key) ? "number" : key === "expiry" ? "date" : "text"} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: 7, border: `1px solid ${COLORS.border}`, fontSize: 14, boxSizing: "border-box" }} />
              </div>
            ))}
          </div>
          {!editingId && user.role !== "Admin" && <div style={{ fontSize: 12, color: COLORS.amber, marginTop: 10 }}>⚠️ This will be tagged as added by you ({user.name}) for Admin review.</div>}
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button onClick={editingId ? saveEdit : addItem} disabled={saving} style={{ background: COLORS.teal, color: "#fff", border: "none", borderRadius: 8, padding: "8px 20px", cursor: "pointer", fontWeight: 600 }}>{saving ? "Saving…" : editingId ? "Save Changes" : "Save"}</button>
            <button onClick={cancelForm} style={{ background: COLORS.slateLight, color: COLORS.slate, border: "none", borderRadius: 8, padding: "8px 20px", cursor: "pointer" }}>Cancel</button>
          </div>
        </Card>
      )}

      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: COLORS.slateLight }}>
                {["Drug Name", "Category", "Qty", "Reorder", "Price", "Expiry", "Supplier", "Status", ""].map(h => (
                  <th key={h} style={{ padding: "11px 14px", textAlign: "left", color: COLORS.slate, fontWeight: 600, fontSize: 13, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => (
                <tr key={item.id} onClick={() => startEdit(item)} style={{ background: i % 2 === 0 ? "#fff" : COLORS.white, borderTop: `1px solid ${COLORS.border}`, cursor: "pointer" }}>
                  <td style={{ padding: "11px 14px", fontWeight: 600, color: COLORS.navy }}>{item.name}</td>
                  <td style={{ padding: "11px 14px", color: COLORS.slate }}>{item.category}</td>
                  <td style={{ padding: "11px 14px", fontWeight: 700, color: item.qty <= item.reorder ? COLORS.red : COLORS.navy }}>{item.qty}</td>
                  <td style={{ padding: "11px 14px", color: COLORS.slate }}>{item.reorder}</td>
                  <td style={{ padding: "11px 14px" }}>₹{Number(item.price).toFixed(2)}</td>
                  <td style={{ padding: "11px 14px", color: COLORS.slate }}>{item.expiry || "—"}</td>
                  <td style={{ padding: "11px 14px", color: COLORS.slate }}>{item.supplier || "—"}</td>
                  <td style={{ padding: "11px 14px" }}>{getStatus(item)}</td>
                  <td style={{ padding: "11px 14px" }} onClick={e => e.stopPropagation()}>
                    {canDeleteDrug(user.role) && (
                      <button onClick={() => deleteItem(item)} style={{ background: "none", border: "none", color: COLORS.red, cursor: "pointer" }}><Icon name="x" size={16} /></button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: "10px 14px", fontSize: 12, color: COLORS.slate, borderTop: `1px solid ${COLORS.border}` }}>💡 Tap any row to edit its details.</div>
      </Card>
    </div>
  );
};

// ─── SALES / POS ──────────────────────────────────────────────────
const Sales = ({ sales, inventory, reload, user }) => {
  const [drug, setDrug] = useState("");
  const [qty, setQty] = useState(1);
  const [cart, setCart] = useState([]);
  const [receipt, setReceipt] = useState(null);
  const seeRevenue = canSeeRevenue(user.role);

  const addToCart = () => {
    const item = inventory.find(i => i.name === drug);
    if (!item || qty < 1) return;
    setCart(c => {
      const existing = c.find(i => i.name === drug);
      if (existing) return c.map(i => i.name === drug ? { ...i, qty: i.qty + qty } : i);
      return [...c, { name: drug, qty, price: Number(item.price), invId: item.id }];
    });
    setDrug(""); setQty(1);
  };

  const checkout = async () => {
    const newSales = cart.map(item => ({
      item: item.name, qty: item.qty, price: item.price, total: item.qty * item.price,
      cashier_id: user.id, cashier_name: user.name
    }));
    await supabase.from("sales").insert(newSales);
    for (const item of cart) {
      const invItem = inventory.find(i => i.id === item.invId);
      if (invItem) {
        await supabase.from("inventory").update({ qty: Math.max(0, invItem.qty - item.qty) }).eq("id", item.invId);
      }
    }
    setReceipt(cart);
    setCart([]);
    reload();
  };

  const cartTotal = cart.reduce((a, i) => a + i.qty * i.price, 0);

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.navy, marginBottom: 20 }}>Sales & Billing</h2>

      {receipt && (
        <Card style={{ marginBottom: 20, borderColor: COLORS.success, background: "#F0FDF4" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong style={{ color: "#065F46" }}>✅ Sale complete!</strong>
            <button onClick={() => setReceipt(null)} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.slate }}><Icon name="x" size={16} /></button>
          </div>
          {receipt.map((s, idx) => <div key={idx} style={{ fontSize: 13, color: COLORS.navy, marginTop: 6 }}>{s.name} × {s.qty} = ₹{(s.qty * s.price).toFixed(2)}</div>)}
          <div style={{ fontWeight: 700, marginTop: 8, color: "#065F46" }}>Total: ₹{receipt.reduce((a, s) => a + s.qty * s.price, 0).toFixed(2)}</div>
        </Card>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16, alignItems: "start" }}>
        <div>
          <Card style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.navy, marginBottom: 12 }}>Add to Cart</h3>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <select value={drug} onChange={e => setDrug(e.target.value)} style={{ flex: 1, minWidth: 180, padding: "8px 10px", borderRadius: 7, border: `1px solid ${COLORS.border}`, fontSize: 14 }}>
                <option value="">Select drug…</option>
                {inventory.filter(i => i.qty > 0).map(i => <option key={i.id} value={i.name}>{i.name} (₹{i.price})</option>)}
              </select>
              <input type="number" min={1} value={qty} onChange={e => setQty(+e.target.value)} style={{ width: 80, padding: "8px 10px", borderRadius: 7, border: `1px solid ${COLORS.border}`, fontSize: 14 }} />
              <button onClick={addToCart} style={{ background: COLORS.teal, color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontWeight: 600 }}>Add</button>
            </div>
          </Card>

          {seeRevenue ? (
            <Card style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ padding: "14px 16px", borderBottom: `1px solid ${COLORS.border}` }}><strong style={{ color: COLORS.navy }}>Recent Sales</strong></div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead><tr style={{ background: COLORS.slateLight }}>{["Drug", "Qty", "Price", "Total", "Cashier", "Date"].map(h => <th key={h} style={{ padding: "9px 12px", textAlign: "left", color: COLORS.slate, fontWeight: 600 }}>{h}</th>)}</tr></thead>
                  <tbody>
                    {sales.slice(0, 20).map((s, i) => (
                      <tr key={s.id} style={{ borderTop: `1px solid ${COLORS.border}`, background: i % 2 === 0 ? "#fff" : COLORS.white }}>
                        <td style={{ padding: "9px 12px" }}>{s.item}</td>
                        <td style={{ padding: "9px 12px" }}>{s.qty}</td>
                        <td style={{ padding: "9px 12px" }}>₹{Number(s.price).toFixed(2)}</td>
                        <td style={{ padding: "9px 12px", fontWeight: 700 }}>₹{Number(s.total).toFixed(2)}</td>
                        <td style={{ padding: "9px 12px", color: COLORS.slate }}>{s.cashier_name}</td>
                        <td style={{ padding: "9px 12px", color: COLORS.slate }}>{new Date(s.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ) : (
            <Card style={{ textAlign: "center", padding: 30 }}>
              <Icon name="lock" size={24} />
              <div style={{ marginTop: 8, color: COLORS.slate, fontSize: 14 }}>Sales history is visible to Admin only</div>
            </Card>
          )}
        </div>

        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.navy, marginBottom: 14 }}>Current Cart</h3>
          {cart.length === 0 ? <p style={{ color: COLORS.slate, fontSize: 13 }}>Cart is empty.</p> : (
            <>
              {cart.map(item => (
                <div key={item.name} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${COLORS.border}`, fontSize: 13 }}>
                  <div><div style={{ fontWeight: 600 }}>{item.name}</div><div style={{ color: COLORS.slate }}>× {item.qty} @ ₹{item.price}</div></div>
                  <span style={{ fontWeight: 700, color: COLORS.teal }}>₹{(item.qty * item.price).toFixed(2)}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontWeight: 700, fontSize: 16 }}>
                <span>Total</span><span style={{ color: COLORS.teal }}>₹{cartTotal.toFixed(2)}</span>
              </div>
              <button onClick={checkout} style={{ width: "100%", marginTop: 14, background: COLORS.navy, color: "#fff", border: "none", borderRadius: 8, padding: "11px", cursor: "pointer", fontWeight: 700, fontSize: 15 }}>Checkout</button>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

// ─── PURCHASE ORDERS ──────────────────────────────────────────────
const Orders = ({ orders, reload, user }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ supplier: "", drug: "", qty: "", cost: "" });

  const addOrder = async () => {
    if (!form.supplier || !form.drug) return;
    await supabase.from("purchase_orders").insert([{
      supplier: form.supplier, drug: form.drug, qty: +form.qty, cost: +form.cost,
      status: "Pending", created_by_id: user.id, created_by_name: user.name
    }]);
    setForm({ supplier: "", drug: "", qty: "", cost: "" });
    setShowForm(false);
    reload();
  };

  const updateStatus = async (order, status) => {
    await supabase.from("purchase_orders").update({ status, delivered_at: status === "Delivered" ? new Date().toISOString() : null }).eq("id", order.id);

    if (status === "Delivered") {
      const { data: existing } = await supabase.from("inventory").select("*").ilike("name", order.drug).maybeSingle();
      if (existing) {
        await supabase.from("inventory").update({ qty: existing.qty + order.qty }).eq("id", existing.id);
      } else {
        await supabase.from("inventory").insert([{ name: order.drug, category: "Other", qty: order.qty, reorder: 10, price: 0, supplier: order.supplier }]);
      }
      await supabase.from("activity_log").insert([{ staff_id: user.id, staff_name: user.name, action: "Order delivered → stock updated", details: `${order.drug} +${order.qty}` }]);
    }
    reload();
  };

  const statusColor = (s) => s === "Delivered" ? "green" : s === "In Transit" ? "blue" : "amber";

  return (
    <div>
      <div style={{ background: COLORS.tealLight, borderRadius: 10, padding: 14, marginBottom: 18, fontSize: 13, color: "#00695C" }}>
        💡 <strong>What this tab does:</strong> Track orders you place with suppliers/distributors (e.g. MedCorp) to restock drugs. Create an order → update status as it ships → when marked <strong>Delivered</strong>, the stock is automatically added to your Inventory.
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.navy }}>Purchase Orders</h2>
        <button onClick={() => setShowForm(!showForm)} style={{ background: COLORS.teal, color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600 }}>
          <Icon name="plus" size={16} /> New Order
        </button>
      </div>

      {showForm && (
        <Card style={{ marginBottom: 20, borderColor: COLORS.teal }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, color: COLORS.navy }}>New Purchase Order</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
            {[["Supplier", "supplier"], ["Drug", "drug"], ["Quantity", "qty"], ["Total Cost (₹)", "cost"]].map(([label, key]) => (
              <div key={key}>
                <label style={{ fontSize: 12, color: COLORS.slate, display: "block", marginBottom: 4 }}>{label}</label>
                <input value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} style={{ width: "100%", padding: "8px 10px", borderRadius: 7, border: `1px solid ${COLORS.border}`, fontSize: 14, boxSizing: "border-box" }} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button onClick={addOrder} style={{ background: COLORS.teal, color: "#fff", border: "none", borderRadius: 8, padding: "8px 20px", cursor: "pointer", fontWeight: 600 }}>Submit Order</button>
            <button onClick={() => setShowForm(false)} style={{ background: COLORS.slateLight, color: COLORS.slate, border: "none", borderRadius: 8, padding: "8px 20px", cursor: "pointer" }}>Cancel</button>
          </div>
        </Card>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {orders.map(o => (
          <Card key={o.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ display: "flex", gap: 10, marginBottom: 4 }}>
                <span style={{ fontWeight: 700, color: COLORS.teal }}>{o.id.slice(0, 8)}</span>
                <Badge label={o.status} color={statusColor(o.status)} />
              </div>
              <div style={{ fontWeight: 700, color: COLORS.navy }}>{o.drug}</div>
              <div style={{ fontSize: 13, color: COLORS.slate }}>Supplier: {o.supplier} · Qty: {o.qty} · ₹{Number(o.cost).toFixed(2)} · Ordered by {o.created_by_name}</div>
            </div>
            {o.status !== "Delivered" && (
              <div style={{ display: "flex", gap: 8 }}>
                {o.status === "Pending" && <button onClick={() => updateStatus(o, "In Transit")} style={{ background: COLORS.slateLight, color: COLORS.navy, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Mark In Transit</button>}
                <button onClick={() => updateStatus(o, "Delivered")} style={{ background: COLORS.teal, color: "#fff", border: "none", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Mark Delivered</button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

// ─── REPORTS ──────────────────────────────────────────────────────
const Reports = ({ sales, inventory, orders }) => {
  const totalRevenue = sales.reduce((a, s) => a + Number(s.total), 0);
  const lowStock = inventory.filter(i => i.qty <= i.reorder).length;
  const totalOrdersCost = orders.reduce((a, o) => a + Number(o.cost), 0);

  const byCategory = inventory.reduce((acc, item) => { acc[item.category || "Other"] = (acc[item.category || "Other"] || 0) + item.qty; return acc; }, {});
  const salesByDay = sales.reduce((acc, s) => { const d = s.created_at?.slice(0, 10); acc[d] = (acc[d] || 0) + Number(s.total); return acc; }, {});

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.navy, marginBottom: 20 }}>Reports & Analytics</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14, marginBottom: 24 }}>
        <StatCard label="Total Revenue" value={`₹${totalRevenue.toFixed(2)}`} accent={COLORS.teal} icon="sales" />
        <StatCard label="Low Stock SKUs" value={lowStock} accent={COLORS.amber} icon="alert" />
        <StatCard label="Total Purchases" value={`₹${totalOrdersCost.toLocaleString()}`} accent={COLORS.navy} icon="orders" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.navy, marginBottom: 14 }}>Revenue by Day</h3>
          {Object.entries(salesByDay).sort().map(([date, rev]) => (
            <div key={date} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${COLORS.border}` }}>
              <span style={{ fontSize: 13, color: COLORS.slate }}>{date}</span><span style={{ fontWeight: 700, color: COLORS.teal }}>₹{rev.toFixed(2)}</span>
            </div>
          ))}
        </Card>
        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.navy, marginBottom: 14 }}>Stock by Category</h3>
          {Object.entries(byCategory).map(([cat, qty]) => {
            const totalQty = inventory.reduce((a, i) => a + i.qty, 0) || 1;
            const pct = Math.round((qty / totalQty) * 100);
            return (
              <div key={cat} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}><span>{cat}</span><span style={{ color: COLORS.slate }}>{qty} units</span></div>
                <div style={{ background: COLORS.border, borderRadius: 99, height: 7 }}><div style={{ background: COLORS.teal, borderRadius: 99, height: 7, width: `${pct}%` }} /></div>
              </div>
            );
          })}
        </Card>
        <Card style={{ gridColumn: "1 / -1" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.navy, marginBottom: 14 }}>Top Selling Drugs</h3>
          {Object.entries(sales.reduce((acc, s) => { acc[s.item] = (acc[s.item] || 0) + Number(s.total); return acc; }, {})).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, rev]) => (
            <div key={name} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${COLORS.border}`, fontSize: 14 }}>
              <span>{name}</span><span style={{ fontWeight: 700, color: COLORS.navy }}>₹{rev.toFixed(2)}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

// ─── STAFF MANAGEMENT ─────────────────────────────────────────────
const StaffManagement = ({ user }) => {
  const [staffList, setStaffList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", role: "Staff", pin: "" });

  const load = async () => {
    const { data } = await supabase.from("staff").select("*").order("created_at");
    setStaffList(data || []);
  };
  useEffect(() => { load(); }, []);

  const addStaff = async () => {
    if (!form.name || form.pin.length !== 4) return;
    await supabase.from("staff").insert([form]);
    setForm({ name: "", role: "Staff", pin: "" });
    setShowForm(false);
    load();
  };

  const toggleActive = async (s) => {
    await supabase.from("staff").update({ active: !s.active }).eq("id", s.id);
    load();
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.navy }}>Staff Management</h2>
        <button onClick={() => setShowForm(!showForm)} style={{ background: COLORS.teal, color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>+ Add Staff</button>
      </div>
      {showForm && (
        <Card style={{ marginBottom: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            <input placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={{ padding: "8px 10px", borderRadius: 7, border: `1px solid ${COLORS.border}` }} />
            <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} style={{ padding: "8px 10px", borderRadius: 7, border: `1px solid ${COLORS.border}` }}>
              <option>Staff</option><option>Cashier</option><option>Pharmacist</option><option>Admin</option>
            </select>
            <input placeholder="4-digit PIN" maxLength={4} value={form.pin} onChange={e => setForm(f => ({ ...f, pin: e.target.value.replace(/\D/g, "") }))} style={{ padding: "8px 10px", borderRadius: 7, border: `1px solid ${COLORS.border}` }} />
          </div>
          <button onClick={addStaff} style={{ marginTop: 12, background: COLORS.teal, color: "#fff", border: "none", borderRadius: 8, padding: "8px 20px", cursor: "pointer", fontWeight: 600 }}>Save</button>
        </Card>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {staffList.map(s => (
          <Card key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 600, color: COLORS.navy }}>{s.name} {s.id === user.id && "(you)"}</div>
              <div style={{ fontSize: 13, color: COLORS.slate }}>{s.role}</div>
            </div>
            <button onClick={() => toggleActive(s)} style={{ background: s.active ? COLORS.redLight : COLORS.tealLight, color: s.active ? COLORS.red : COLORS.teal, border: "none", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
              {s.active ? "Deactivate" : "Reactivate"}
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
};

// ─── MAIN APP ─────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ps_user")); } catch { return null; }
  });
  const [tab, setTab] = useState("dashboard");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [inventory, setInventory] = useState([]);
  const [sales, setSales] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const loadAll = async () => {
    const [inv, sal, ord] = await Promise.all([
      supabase.from("inventory").select("*").order("name"),
      supabase.from("sales").select("*").order("created_at", { ascending: false }),
      supabase.from("purchase_orders").select("*").order("created_at", { ascending: false }),
    ]);
    setInventory(inv.data || []);
    setSales(sal.data || []);
    setOrders(ord.data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (!user) return;
    loadAll();
    const channel = supabase.channel("pharmasys-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "inventory" }, loadAll)
      .on("postgres_changes", { event: "*", schema: "public", table: "sales" }, loadAll)
      .on("postgres_changes", { event: "*", schema: "public", table: "purchase_orders" }, loadAll)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const handleLogin = (staffUser) => {
    setUser(staffUser);
    localStorage.setItem("ps_user", JSON.stringify(staffUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("ps_user");
  };

  const resetAll = async () => {
    if (!canResetData(user.role)) return;
    if (!window.confirm("This will delete ALL inventory, sales, and order data. Are you sure?")) return;
    await supabase.from("inventory").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("sales").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("purchase_orders").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    loadAll();
  };

  if (!user) return <LoginScreen onLogin={handleLogin} />;

  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: "dashboard" },
    { key: "inventory", label: "Inventory", icon: "inventory" },
    { key: "sales", label: "Sales & POS", icon: "sales" },
    { key: "orders", label: "Purchase Orders", icon: "orders" },
    ...(canSeeReports(user.role) ? [{ key: "reports", label: "Reports", icon: "reports" }] : []),
    ...(canManageStaff(user.role) ? [{ key: "staff", label: "Staff", icon: "staff" }] : []),
  ];

  const bottomNav = [
    { key: "dashboard", label: "Home", icon: "dashboard" },
    { key: "inventory", label: "Stock", icon: "inventory" },
    { key: "sales", label: "Sales", icon: "sales" },
    { key: "orders", label: "Orders", icon: "orders" },
    { key: "more", label: "More", icon: "menu" },
  ];

  const moreItems = [
    ...(canSeeReports(user.role) ? [{ key: "reports", label: "Reports", icon: "reports" }] : []),
    ...(canManageStaff(user.role) ? [{ key: "staff", label: "Staff Management", icon: "staff" }] : []),
  ];

  const lowStockCount = inventory.filter(i => i.qty <= i.reorder).length;

  const renderContent = () => {
    if (loading) return <div style={{ textAlign: "center", padding: 60, color: COLORS.slate }}>Loading…</div>;
    switch (tab) {
      case "dashboard": return <Dashboard inventory={inventory} sales={sales} orders={orders} user={user} />;
      case "inventory": return <Inventory inventory={inventory} reload={loadAll} user={user} />;
      case "sales": return <Sales sales={sales} inventory={inventory} reload={loadAll} user={user} />;
      case "orders": return <Orders orders={orders} reload={loadAll} user={user} />;
      case "reports": return canSeeReports(user.role) ? <Reports sales={sales} inventory={inventory} orders={orders} /> : null;
      case "staff": return canManageStaff(user.role) ? <StaffManagement user={user} /> : null;
      default: return null;
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Inter', system-ui, sans-serif", background: COLORS.white, overflow: "hidden" }}>
      {!isMobile && (
        <aside style={{ width: 220, background: COLORS.navy, color: "#fff", display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <div style={{ padding: "22px 20px 14px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.5 }}>💊 SSMS</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>Management Suite</div>
          </div>
          <nav style={{ flex: 1, padding: "14px 10px" }}>
            {navItems.map(item => (
              <button key={item.key} onClick={() => setTab(item.key)} style={{
                display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 8, border: "none", cursor: "pointer", marginBottom: 2, fontSize: 14,
                background: tab === item.key ? "rgba(0,137,123,0.25)" : "transparent", color: tab === item.key ? "#fff" : "rgba(255,255,255,0.6)", fontWeight: tab === item.key ? 700 : 400,
              }}>
                <Icon name={item.icon} size={17} /><span>{item.label}</span>
                {item.key === "inventory" && lowStockCount > 0 && <span style={{ marginLeft: "auto", background: COLORS.red, color: "#fff", borderRadius: 99, padding: "1px 7px", fontSize: 11, fontWeight: 700 }}>{lowStockCount}</span>}
              </button>
            ))}
          </nav>
          <div style={{ padding: "14px 20px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: COLORS.teal, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>{user.name[0]}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{user.name}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{user.role}</div>
              </div>
            </div>
            <button onClick={handleLogout} style={{ width: "100%", background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)", border: "none", borderRadius: 6, padding: "6px 10px", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <Icon name="logout" size={14} /> Sign out
            </button>
            {canResetData(user.role) && (
              <button onClick={resetAll} style={{ marginTop: 8, background: "rgba(239,68,68,0.15)", color: "#FCA5A5", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontSize: 11, width: "100%" }}>Reset All Data</button>
            )}
          </div>
        </aside>
      )}

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <header style={{ background: "#fff", borderBottom: `1px solid ${COLORS.border}`, padding: isMobile ? "12px 16px" : "14px 24px", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {isMobile && <span style={{ fontSize: 20 }}>💊</span>}
            <h1 style={{ fontSize: isMobile ? 16 : 17, fontWeight: 700, color: COLORS.navy, margin: 0 }}>{tab === "more" ? "More" : navItems.find(n => n.key === tab)?.label || "More"}</h1>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
            {lowStockCount > 0 && <div style={{ display: "flex", alignItems: "center", gap: 4, color: COLORS.amber, fontSize: 12, fontWeight: 600 }}><Icon name="alert" size={14} /> {lowStockCount}</div>}
            {isMobile && <button onClick={handleLogout} style={{ background: "none", border: "none", color: COLORS.slate, cursor: "pointer" }}><Icon name="logout" size={18} /></button>}
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: COLORS.teal, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 }}>{user.name[0]}</div>
          </div>
        </header>

        <main style={{ flex: 1, overflowY: "auto", padding: isMobile ? "16px 14px" : 24, paddingBottom: isMobile ? 80 : 24 }}>
          {tab === "more" ? (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: COLORS.navy, marginBottom: 16 }}>More</h2>
              {moreItems.map(item => (
                <button key={item.key} onClick={() => setTab(item.key)} style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", padding: "16px", marginBottom: 10, background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: 12, cursor: "pointer", textAlign: "left" }}>
                  <div style={{ background: COLORS.tealLight, borderRadius: 10, padding: 10, color: COLORS.teal }}><Icon name={item.icon} size={20} /></div>
                  <span style={{ fontSize: 15, fontWeight: 600, color: COLORS.navy }}>{item.label}</span>
                </button>
              ))}
              {canResetData(user.role) && (
                <button onClick={resetAll} style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", padding: "16px", marginTop: 20, background: COLORS.redLight, border: `1px solid #FECACA`, borderRadius: 12, cursor: "pointer" }}>
                  <div style={{ background: "#FEE2E2", borderRadius: 10, padding: 10, color: COLORS.red }}><Icon name="x" size={20} /></div>
                  <span style={{ fontSize: 15, fontWeight: 600, color: COLORS.red }}>Reset All Data</span>
                </button>
              )}
            </div>
          ) : renderContent()}
        </main>
      </div>

      {isMobile && (
        <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: 64, background: "#fff", borderTop: `1px solid ${COLORS.border}`, display: "flex", zIndex: 50, boxShadow: "0 -2px 12px rgba(0,0,0,0.08)" }}>
          {bottomNav.map(item => {
            const isActive = item.key === "more" ? ["more", "reports", "staff"].includes(tab) : tab === item.key;
            return (
              <button key={item.key} onClick={() => setTab(item.key)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, border: "none", background: "none", cursor: "pointer", color: isActive ? COLORS.teal : COLORS.slate, position: "relative" }}>
                <Icon name={item.icon} size={22} />
                <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 400 }}>{item.label}</span>
                {item.key === "inventory" && lowStockCount > 0 && <span style={{ position: "absolute", top: 6, right: "calc(50% - 18px)", background: COLORS.red, color: "#fff", borderRadius: 99, padding: "0 5px", fontSize: 10, fontWeight: 700 }}>{lowStockCount}</span>}
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}
