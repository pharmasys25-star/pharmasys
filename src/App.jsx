import { useState, useEffect } from "react";

// ─── DESIGN TOKENS ───────────────────────────────────────────────
// Palette: deep navy (#0F1B2D), clinical white (#F7F9FC), 
// pharmacy teal (#00897B), amber alert (#F59E0B), 
// soft slate (#64748B), danger red (#EF4444)

const COLORS = {
  navy: "#0F1B2D",
  teal: "#00897B",
  tealLight: "#E0F2F1",
  white: "#F7F9FC",
  amber: "#F59E0B",
  amberLight: "#FEF3C7",
  red: "#EF4444",
  redLight: "#FEE2E2",
  slate: "#64748B",
  slateLight: "#F1F5F9",
  border: "#E2E8F0",
  success: "#10B981",
};

// ─── SEED DATA ────────────────────────────────────────────────────
const seedInventory = [
  { id: 1, name: "Amoxicillin 500mg", category: "Antibiotics", qty: 240, reorder: 50, price: 12.5, expiry: "2027-03-01", supplier: "MedCorp" },
  { id: 2, name: "Metformin 850mg", category: "Diabetes", qty: 30, reorder: 60, price: 8.0, expiry: "2026-09-15", supplier: "PharmaSup" },
  { id: 3, name: "Lisinopril 10mg", category: "Cardiovascular", qty: 180, reorder: 40, price: 6.75, expiry: "2027-06-20", supplier: "MedCorp" },
  { id: 4, name: "Atorvastatin 20mg", category: "Cardiovascular", qty: 12, reorder: 50, price: 15.0, expiry: "2026-12-01", supplier: "GlobalPharma" },
  { id: 5, name: "Paracetamol 500mg", category: "Pain Relief", qty: 500, reorder: 100, price: 3.5, expiry: "2028-01-10", supplier: "PharmaSup" },
  { id: 6, name: "Ibuprofen 400mg", category: "Pain Relief", qty: 320, reorder: 80, price: 4.25, expiry: "2027-11-30", supplier: "MedCorp" },
  { id: 7, name: "Omeprazole 20mg", category: "Gastro", qty: 8, reorder: 30, price: 9.0, expiry: "2026-08-05", supplier: "GlobalPharma" },
  { id: 8, name: "Salbutamol Inhaler", category: "Respiratory", qty: 45, reorder: 20, price: 22.0, expiry: "2027-04-18", supplier: "PharmaSup" },
];

const seedPrescriptions = [
  { id: "RX-001", patient: "James Owusu", doctor: "Dr. Mensah", date: "2026-06-14", drug: "Amoxicillin 500mg", qty: 21, status: "Dispensed", notes: "3x daily for 7 days" },
  { id: "RX-002", patient: "Abena Asante", doctor: "Dr. Boateng", date: "2026-06-15", drug: "Metformin 850mg", qty: 30, status: "Pending", notes: "With meals" },
  { id: "RX-003", patient: "Kofi Adu", doctor: "Dr. Mensah", date: "2026-06-16", drug: "Lisinopril 10mg", qty: 30, status: "Pending", notes: "Once daily morning" },
  { id: "RX-004", patient: "Ama Darko", doctor: "Dr. Tetteh", date: "2026-06-13", drug: "Atorvastatin 20mg", qty: 30, status: "Dispensed", notes: "Bedtime" },
];

const seedSales = [
  { id: "S-001", item: "Paracetamol 500mg", qty: 2, price: 3.5, total: 7.0, date: "2026-06-16", cashier: "Akua" },
  { id: "S-002", item: "Amoxicillin 500mg", qty: 1, price: 12.5, total: 12.5, date: "2026-06-16", cashier: "Akua" },
  { id: "S-003", item: "Ibuprofen 400mg", qty: 3, price: 4.25, total: 12.75, date: "2026-06-15", cashier: "Kwame" },
  { id: "S-004", item: "Salbutamol Inhaler", qty: 1, price: 22.0, total: 22.0, date: "2026-06-15", cashier: "Kwame" },
  { id: "S-005", item: "Omeprazole 20mg", qty: 2, price: 9.0, total: 18.0, date: "2026-06-14", cashier: "Akua" },
];

const seedOrders = [
  { id: "PO-001", supplier: "MedCorp", drug: "Amoxicillin 500mg", qty: 200, cost: 2100, status: "Delivered", date: "2026-06-10" },
  { id: "PO-002", supplier: "GlobalPharma", drug: "Atorvastatin 20mg", qty: 100, cost: 1400, status: "Pending", date: "2026-06-16" },
  { id: "PO-003", supplier: "PharmaSup", drug: "Metformin 850mg", qty: 150, cost: 1080, status: "In Transit", date: "2026-06-14" },
];

// ─── ICONS ───────────────────────────────────────────────────────
const Icon = ({ name, size = 20 }) => {
  const icons = {
    dashboard: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    inventory: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
    prescription: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    sales: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z",
    orders: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
    reports: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    alert: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
    plus: "M12 4v16m8-8H4",
    check: "M5 13l4 4L19 7",
    x: "M6 18L18 6M6 6l12 12",
    menu: "M4 6h16M4 12h16M4 18h16",
    close: "M6 18L18 6M6 6l12 12",
  };
  return (
    <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d={icons[name] || icons.dashboard} />
    </svg>
  );
};

// ─── BADGE ───────────────────────────────────────────────────────
const Badge = ({ label, color }) => {
  const map = {
    green: { bg: "#D1FAE5", text: "#065F46" },
    amber: { bg: COLORS.amberLight, text: "#92400E" },
    red: { bg: COLORS.redLight, text: "#991B1B" },
    blue: { bg: "#DBEAFE", text: "#1E40AF" },
    slate: { bg: COLORS.slateLight, text: COLORS.slate },
  };
  const c = map[color] || map.slate;
  return (
    <span style={{ background: c.bg, color: c.text, padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
      {label}
    </span>
  );
};

// ─── CARD ─────────────────────────────────────────────────────────
const Card = ({ children, style = {} }) => (
  <div style={{ background: "#fff", borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 20, ...style }}>
    {children}
  </div>
);

// ─── STAT CARD ────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, accent, icon }) => (
  <Card style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
    <div style={{ background: accent + "22", borderRadius: 10, padding: 10, color: accent, flexShrink: 0 }}>
      <Icon name={icon} size={22} />
    </div>
    <div>
      <div style={{ fontSize: 13, color: COLORS.slate, marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: COLORS.navy, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: COLORS.slate, marginTop: 4 }}>{sub}</div>}
    </div>
  </Card>
);

// ─── DASHBOARD ───────────────────────────────────────────────────
const Dashboard = ({ inventory, prescriptions, sales, orders }) => {
  const lowStock = inventory.filter(i => i.qty <= i.reorder);
  const pending = prescriptions.filter(p => p.status === "Pending");
  const todaySales = sales.filter(s => s.date === "2026-06-16");
  const todayRevenue = todaySales.reduce((a, s) => a + s.total, 0);

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: COLORS.navy, marginBottom: 6 }}>Good morning 👋</h2>
      <p style={{ color: COLORS.slate, marginBottom: 24, fontSize: 14 }}>Tuesday, June 16, 2026 — Here's your pharmacy at a glance.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14, marginBottom: 28 }}>
        <StatCard label="Today's Revenue" value={`GH₵${todayRevenue.toFixed(2)}`} sub={`${todaySales.length} transactions`} accent={COLORS.teal} icon="sales" />
        <StatCard label="Pending Rx" value={pending.length} sub="Awaiting dispensing" accent={COLORS.amber} icon="prescription" />
        <StatCard label="Low Stock Items" value={lowStock.length} sub="Need reordering" accent={COLORS.red} icon="alert" />
        <StatCard label="Total Products" value={inventory.length} sub="Active SKUs" accent="#6366F1" icon="inventory" />
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

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.navy, marginBottom: 14 }}>Recent Sales</h3>
          {sales.slice(0, 4).map(s => (
            <div key={s.id} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${COLORS.border}`, fontSize: 13 }}>
              <div>
                <div style={{ fontWeight: 600, color: COLORS.navy }}>{s.item}</div>
                <div style={{ color: COLORS.slate }}>{s.date}</div>
              </div>
              <span style={{ fontWeight: 700, color: COLORS.teal }}>GH₵{s.total.toFixed(2)}</span>
            </div>
          ))}
        </Card>
        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.navy, marginBottom: 14 }}>Pending Prescriptions</h3>
          {pending.length === 0 ? <p style={{ color: COLORS.slate, fontSize: 13 }}>All clear!</p> : pending.map(p => (
            <div key={p.id} style={{ padding: "7px 0", borderBottom: `1px solid ${COLORS.border}`, fontSize: 13 }}>
              <div style={{ fontWeight: 600, color: COLORS.navy }}>{p.patient}</div>
              <div style={{ color: COLORS.slate }}>{p.drug} · {p.date}</div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

// ─── INVENTORY ────────────────────────────────────────────────────
const Inventory = ({ inventory, setInventory }) => {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", category: "", qty: "", reorder: "", price: "", expiry: "", supplier: "" });

  const filtered = inventory.filter(i => i.name.toLowerCase().includes(search.toLowerCase()) || i.category.toLowerCase().includes(search.toLowerCase()));

  const addItem = () => {
    if (!form.name || !form.qty) return;
    setInventory(prev => [...prev, { ...form, id: Date.now(), qty: +form.qty, reorder: +form.reorder, price: +form.price }]);
    setForm({ name: "", category: "", qty: "", reorder: "", price: "", expiry: "", supplier: "" });
    setShowForm(false);
  };

  const getStatus = (item) => {
    if (item.qty === 0) return <Badge label="Out of Stock" color="red" />;
    if (item.qty <= item.reorder) return <Badge label="Low Stock" color="amber" />;
    return <Badge label="In Stock" color="green" />;
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.navy }}>Inventory</h2>
        <div style={{ display: "flex", gap: 10 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search drugs…" style={{ padding: "8px 14px", borderRadius: 8, border: `1px solid ${COLORS.border}`, fontSize: 14, outline: "none", width: 200 }} />
          <button onClick={() => setShowForm(!showForm)} style={{ background: COLORS.teal, color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600 }}>
            <Icon name="plus" size={16} /> Add Drug
          </button>
        </div>
      </div>

      {showForm && (
        <Card style={{ marginBottom: 20, borderColor: COLORS.teal }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, color: COLORS.navy }}>New Drug Entry</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
            {[["Drug Name", "name"], ["Category", "category"], ["Quantity", "qty"], ["Reorder Level", "reorder"], ["Unit Price (GH₵)", "price"], ["Expiry Date", "expiry"], ["Supplier", "supplier"]].map(([label, key]) => (
              <div key={key}>
                <label style={{ fontSize: 12, color: COLORS.slate, display: "block", marginBottom: 4 }}>{label}</label>
                <input type={["qty", "reorder", "price"].includes(key) ? "number" : key === "expiry" ? "date" : "text"} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: 7, border: `1px solid ${COLORS.border}`, fontSize: 14, boxSizing: "border-box" }} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button onClick={addItem} style={{ background: COLORS.teal, color: "#fff", border: "none", borderRadius: 8, padding: "8px 20px", cursor: "pointer", fontWeight: 600 }}>Save</button>
            <button onClick={() => setShowForm(false)} style={{ background: COLORS.slateLight, color: COLORS.slate, border: "none", borderRadius: 8, padding: "8px 20px", cursor: "pointer" }}>Cancel</button>
          </div>
        </Card>
      )}

      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: COLORS.slateLight }}>
                {["Drug Name", "Category", "Qty", "Reorder", "Price", "Expiry", "Supplier", "Status"].map(h => (
                  <th key={h} style={{ padding: "11px 14px", textAlign: "left", color: COLORS.slate, fontWeight: 600, fontSize: 13, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => (
                <tr key={item.id} style={{ background: i % 2 === 0 ? "#fff" : COLORS.white, borderTop: `1px solid ${COLORS.border}` }}>
                  <td style={{ padding: "11px 14px", fontWeight: 600, color: COLORS.navy }}>{item.name}</td>
                  <td style={{ padding: "11px 14px", color: COLORS.slate }}>{item.category}</td>
                  <td style={{ padding: "11px 14px", fontWeight: 700, color: item.qty <= item.reorder ? COLORS.red : COLORS.navy }}>{item.qty}</td>
                  <td style={{ padding: "11px 14px", color: COLORS.slate }}>{item.reorder}</td>
                  <td style={{ padding: "11px 14px" }}>GH₵{item.price.toFixed(2)}</td>
                  <td style={{ padding: "11px 14px", color: COLORS.slate }}>{item.expiry}</td>
                  <td style={{ padding: "11px 14px", color: COLORS.slate }}>{item.supplier}</td>
                  <td style={{ padding: "11px 14px" }}>{getStatus(item)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

// ─── PRESCRIPTIONS ───────────────────────────────────────────────
const Prescriptions = ({ prescriptions, setPrescriptions }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ patient: "", doctor: "", drug: "", qty: "", notes: "" });

  const addRx = () => {
    if (!form.patient || !form.drug) return;
    const newRx = { ...form, id: `RX-${String(prescriptions.length + 1).padStart(3, "0")}`, date: "2026-06-16", status: "Pending", qty: +form.qty };
    setPrescriptions(prev => [newRx, ...prev]);
    setForm({ patient: "", doctor: "", drug: "", qty: "", notes: "" });
    setShowForm(false);
  };

  const dispense = (id) => setPrescriptions(prev => prev.map(p => p.id === id ? { ...p, status: "Dispensed" } : p));

  const statusColor = (s) => s === "Dispensed" ? "green" : s === "Pending" ? "amber" : "slate";

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.navy }}>Prescriptions</h2>
        <button onClick={() => setShowForm(!showForm)} style={{ background: COLORS.teal, color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600 }}>
          <Icon name="plus" size={16} /> New Rx
        </button>
      </div>

      {showForm && (
        <Card style={{ marginBottom: 20, borderColor: COLORS.teal }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, color: COLORS.navy }}>New Prescription</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
            {[["Patient Name", "patient"], ["Doctor", "doctor"], ["Drug", "drug"], ["Quantity", "qty"], ["Notes", "notes"]].map(([label, key]) => (
              <div key={key}>
                <label style={{ fontSize: 12, color: COLORS.slate, display: "block", marginBottom: 4 }}>{label}</label>
                <input value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: 7, border: `1px solid ${COLORS.border}`, fontSize: 14, boxSizing: "border-box" }} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button onClick={addRx} style={{ background: COLORS.teal, color: "#fff", border: "none", borderRadius: 8, padding: "8px 20px", cursor: "pointer", fontWeight: 600 }}>Save</button>
            <button onClick={() => setShowForm(false)} style={{ background: COLORS.slateLight, color: COLORS.slate, border: "none", borderRadius: 8, padding: "8px 20px", cursor: "pointer" }}>Cancel</button>
          </div>
        </Card>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {prescriptions.map(rx => (
          <Card key={rx.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.teal }}>{rx.id}</span>
                <Badge label={rx.status} color={statusColor(rx.status)} />
              </div>
              <div style={{ fontWeight: 700, color: COLORS.navy, fontSize: 15 }}>{rx.patient}</div>
              <div style={{ color: COLORS.slate, fontSize: 13 }}>{rx.doctor} · {rx.date}</div>
              <div style={{ marginTop: 6, fontSize: 14 }}><strong>{rx.drug}</strong> — Qty: {rx.qty}</div>
              {rx.notes && <div style={{ fontSize: 13, color: COLORS.slate, marginTop: 3 }}>📋 {rx.notes}</div>}
            </div>
            {rx.status === "Pending" && (
              <button onClick={() => dispense(rx.id)} style={{ background: COLORS.teal, color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontWeight: 600, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                <Icon name="check" size={14} /> Dispense
              </button>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

// ─── SALES / POS ──────────────────────────────────────────────────
const Sales = ({ sales, setSales, inventory }) => {
  const [drug, setDrug] = useState("");
  const [qty, setQty] = useState(1);
  const [cart, setCart] = useState([]);
  const [receipt, setReceipt] = useState(null);

  const addToCart = () => {
    const item = inventory.find(i => i.name === drug);
    if (!item || qty < 1) return;
    setCart(c => {
      const existing = c.find(i => i.name === drug);
      if (existing) return c.map(i => i.name === drug ? { ...i, qty: i.qty + qty } : i);
      return [...c, { name: drug, qty, price: item.price }];
    });
    setDrug(""); setQty(1);
  };

  const checkout = () => {
    const newSales = cart.map(item => ({
      id: `S-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      item: item.name, qty: item.qty, price: item.price,
      total: item.qty * item.price, date: "2026-06-16", cashier: "Akua"
    }));
    setSales(prev => [...newSales, ...prev]);
    setReceipt(newSales);
    setCart([]);
  };

  const cartTotal = cart.reduce((a, i) => a + i.qty * i.price, 0);

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.navy, marginBottom: 20 }}>Sales & Billing</h2>

      {receipt && (
        <Card style={{ marginBottom: 20, borderColor: COLORS.success, background: "#F0FDF4" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong style={{ color: "#065F46" }}>✅ Sale complete! Receipt</strong>
            <button onClick={() => setReceipt(null)} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.slate }}><Icon name="x" size={16} /></button>
          </div>
          {receipt.map(s => <div key={s.id} style={{ fontSize: 13, color: COLORS.navy, marginTop: 6 }}>{s.item} × {s.qty} = GH₵{s.total.toFixed(2)}</div>)}
          <div style={{ fontWeight: 700, marginTop: 8, color: "#065F46" }}>Total: GH₵{receipt.reduce((a, s) => a + s.total, 0).toFixed(2)}</div>
        </Card>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16, alignItems: "start" }}>
        <div>
          <Card style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.navy, marginBottom: 12 }}>Add to Cart</h3>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <select value={drug} onChange={e => setDrug(e.target.value)} style={{ flex: 1, minWidth: 180, padding: "8px 10px", borderRadius: 7, border: `1px solid ${COLORS.border}`, fontSize: 14 }}>
                <option value="">Select drug…</option>
                {inventory.filter(i => i.qty > 0).map(i => <option key={i.id} value={i.name}>{i.name} (GH₵{i.price})</option>)}
              </select>
              <input type="number" min={1} value={qty} onChange={e => setQty(+e.target.value)} style={{ width: 80, padding: "8px 10px", borderRadius: 7, border: `1px solid ${COLORS.border}`, fontSize: 14 }} />
              <button onClick={addToCart} style={{ background: COLORS.teal, color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontWeight: 600 }}>
                Add
              </button>
            </div>
          </Card>

          <Card style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "14px 16px", borderBottom: `1px solid ${COLORS.border}` }}>
              <strong style={{ color: COLORS.navy }}>Today's Sales</strong>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: COLORS.slateLight }}>
                    {["ID", "Drug", "Qty", "Price", "Total", "Date"].map(h => (
                      <th key={h} style={{ padding: "9px 12px", textAlign: "left", color: COLORS.slate, fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sales.map((s, i) => (
                    <tr key={s.id} style={{ borderTop: `1px solid ${COLORS.border}`, background: i % 2 === 0 ? "#fff" : COLORS.white }}>
                      <td style={{ padding: "9px 12px", color: COLORS.teal, fontWeight: 600 }}>{s.id}</td>
                      <td style={{ padding: "9px 12px" }}>{s.item}</td>
                      <td style={{ padding: "9px 12px" }}>{s.qty}</td>
                      <td style={{ padding: "9px 12px" }}>GH₵{s.price.toFixed(2)}</td>
                      <td style={{ padding: "9px 12px", fontWeight: 700 }}>GH₵{s.total.toFixed(2)}</td>
                      <td style={{ padding: "9px 12px", color: COLORS.slate }}>{s.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.navy, marginBottom: 14 }}>Current Cart</h3>
          {cart.length === 0 ? <p style={{ color: COLORS.slate, fontSize: 13 }}>Cart is empty.</p> : (
            <>
              {cart.map(item => (
                <div key={item.name} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${COLORS.border}`, fontSize: 13 }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{item.name}</div>
                    <div style={{ color: COLORS.slate }}>× {item.qty} @ GH₵{item.price}</div>
                  </div>
                  <span style={{ fontWeight: 700, color: COLORS.teal }}>GH₵{(item.qty * item.price).toFixed(2)}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontWeight: 700, fontSize: 16 }}>
                <span>Total</span>
                <span style={{ color: COLORS.teal }}>GH₵{cartTotal.toFixed(2)}</span>
              </div>
              <button onClick={checkout} style={{ width: "100%", marginTop: 14, background: COLORS.navy, color: "#fff", border: "none", borderRadius: 8, padding: "11px", cursor: "pointer", fontWeight: 700, fontSize: 15 }}>
                Checkout
              </button>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

// ─── PURCHASE ORDERS ──────────────────────────────────────────────
const Orders = ({ orders, setOrders }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ supplier: "", drug: "", qty: "", cost: "" });

  const addOrder = () => {
    if (!form.supplier || !form.drug) return;
    setOrders(prev => [{ ...form, id: `PO-${String(prev.length + 1).padStart(3, "0")}`, qty: +form.qty, cost: +form.cost, status: "Pending", date: "2026-06-16" }, ...prev]);
    setForm({ supplier: "", drug: "", qty: "", cost: "" });
    setShowForm(false);
  };

  const markDelivered = (id) => setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "Delivered" } : o));

  const statusColor = (s) => s === "Delivered" ? "green" : s === "In Transit" ? "blue" : "amber";

  return (
    <div>
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
            {[["Supplier", "supplier"], ["Drug", "drug"], ["Quantity", "qty"], ["Total Cost (GH₵)", "cost"]].map(([label, key]) => (
              <div key={key}>
                <label style={{ fontSize: 12, color: COLORS.slate, display: "block", marginBottom: 4 }}>{label}</label>
                <input value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: 7, border: `1px solid ${COLORS.border}`, fontSize: 14, boxSizing: "border-box" }} />
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
                <span style={{ fontWeight: 700, color: COLORS.teal }}>{o.id}</span>
                <Badge label={o.status} color={statusColor(o.status)} />
              </div>
              <div style={{ fontWeight: 700, color: COLORS.navy }}>{o.drug}</div>
              <div style={{ fontSize: 13, color: COLORS.slate }}>Supplier: {o.supplier} · Qty: {o.qty} · GH₵{o.cost.toFixed ? o.cost.toFixed(2) : o.cost} · {o.date}</div>
            </div>
            {o.status !== "Delivered" && (
              <button onClick={() => markDelivered(o.id)} style={{ background: COLORS.slateLight, color: COLORS.navy, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                Mark Delivered
              </button>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

// ─── REPORTS ──────────────────────────────────────────────────────
const Reports = ({ sales, inventory, prescriptions, orders }) => {
  const totalRevenue = sales.reduce((a, s) => a + s.total, 0);
  const totalRx = prescriptions.length;
  const dispensed = prescriptions.filter(p => p.status === "Dispensed").length;
  const lowStock = inventory.filter(i => i.qty <= i.reorder).length;
  const totalOrdersCost = orders.reduce((a, o) => a + (+o.cost), 0);

  const byCategory = inventory.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.qty;
    return acc;
  }, {});

  const salesByDay = sales.reduce((acc, s) => {
    acc[s.date] = (acc[s.date] || 0) + s.total;
    return acc;
  }, {});

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.navy, marginBottom: 20 }}>Reports & Analytics</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14, marginBottom: 24 }}>
        <StatCard label="Total Revenue" value={`GH₵${totalRevenue.toFixed(2)}`} accent={COLORS.teal} icon="sales" />
        <StatCard label="Rx Dispensed" value={`${dispensed}/${totalRx}`} sub="Completion rate" accent="#6366F1" icon="prescription" />
        <StatCard label="Low Stock SKUs" value={lowStock} accent={COLORS.amber} icon="alert" />
        <StatCard label="Total Purchases" value={`GH₵${totalOrdersCost.toLocaleString()}`} accent={COLORS.navy} icon="orders" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.navy, marginBottom: 14 }}>Revenue by Day</h3>
          {Object.entries(salesByDay).sort().map(([date, rev]) => (
            <div key={date} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${COLORS.border}` }}>
              <span style={{ fontSize: 13, color: COLORS.slate }}>{date}</span>
              <span style={{ fontWeight: 700, color: COLORS.teal }}>GH₵{rev.toFixed(2)}</span>
            </div>
          ))}
        </Card>

        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.navy, marginBottom: 14 }}>Stock by Category</h3>
          {Object.entries(byCategory).map(([cat, qty]) => {
            const pct = Math.round((qty / inventory.reduce((a, i) => a + i.qty, 0)) * 100);
            return (
              <div key={cat} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                  <span>{cat}</span><span style={{ color: COLORS.slate }}>{qty} units</span>
                </div>
                <div style={{ background: COLORS.border, borderRadius: 99, height: 7 }}>
                  <div style={{ background: COLORS.teal, borderRadius: 99, height: 7, width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </Card>

        <Card style={{ gridColumn: "1 / -1" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.navy, marginBottom: 14 }}>Top Selling Drugs</h3>
          {Object.entries(sales.reduce((acc, s) => { acc[s.item] = (acc[s.item] || 0) + s.total; return acc; }, {}))
            .sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, rev]) => (
              <div key={name} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${COLORS.border}`, fontSize: 14 }}>
                <span>{name}</span>
                <span style={{ fontWeight: 700, color: COLORS.navy }}>GH₵{rev.toFixed(2)}</span>
              </div>
            ))}
        </Card>
      </div>
    </div>
  );
};

// ─── MAIN APP ─────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [inventory, setInventory] = useState(seedInventory);
  const [prescriptions, setPrescriptions] = useState(seedPrescriptions);
  const [sales, setSales] = useState(seedSales);
  const [orders, setOrders] = useState(seedOrders);

  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: "dashboard" },
    { key: "inventory", label: "Inventory", icon: "inventory" },
    { key: "prescriptions", label: "Prescriptions", icon: "prescription" },
    { key: "sales", label: "Sales & POS", icon: "sales" },
    { key: "orders", label: "Purchase Orders", icon: "orders" },
    { key: "reports", label: "Reports", icon: "reports" },
  ];

  const lowStockCount = inventory.filter(i => i.qty <= i.reorder).length;

  const renderContent = () => {
    switch (tab) {
      case "dashboard": return <Dashboard inventory={inventory} prescriptions={prescriptions} sales={sales} orders={orders} />;
      case "inventory": return <Inventory inventory={inventory} setInventory={setInventory} />;
      case "prescriptions": return <Prescriptions prescriptions={prescriptions} setPrescriptions={setPrescriptions} />;
      case "sales": return <Sales sales={sales} setSales={setSales} inventory={inventory} />;
      case "orders": return <Orders orders={orders} setOrders={setOrders} />;
      case "reports": return <Reports sales={sales} inventory={inventory} prescriptions={prescriptions} orders={orders} />;
      default: return null;
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Inter', system-ui, sans-serif", background: COLORS.white, overflow: "hidden" }}>
      {/* Sidebar */}
      <aside style={{
        width: 220, background: COLORS.navy, color: "#fff", display: "flex", flexDirection: "column",
        flexShrink: 0, transition: "transform 0.2s",
        position: window.innerWidth < 768 ? "fixed" : "relative",
        zIndex: 100, height: "100vh",
        transform: window.innerWidth < 768 && !menuOpen ? "translateX(-220px)" : "none",
      }}>
        <div style={{ padding: "22px 20px 14px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.5 }}>💊 PharmaSys</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>Management Suite</div>
        </div>
        <nav style={{ flex: 1, padding: "14px 10px" }}>
          {navItems.map(item => (
            <button key={item.key} onClick={() => { setTab(item.key); setMenuOpen(false); }} style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px",
              borderRadius: 8, border: "none", cursor: "pointer", marginBottom: 2, fontSize: 14,
              background: tab === item.key ? "rgba(0,137,123,0.25)" : "transparent",
              color: tab === item.key ? "#fff" : "rgba(255,255,255,0.6)",
              fontWeight: tab === item.key ? 700 : 400, transition: "all 0.15s",
            }}>
              <Icon name={item.icon} size={17} />
              <span>{item.label}</span>
              {item.key === "inventory" && lowStockCount > 0 && (
                <span style={{ marginLeft: "auto", background: COLORS.red, color: "#fff", borderRadius: 99, padding: "1px 7px", fontSize: 11, fontWeight: 700 }}>{lowStockCount}</span>
              )}
            </button>
          ))}
        </nav>
        <div style={{ padding: "14px 20px", borderTop: "1px solid rgba(255,255,255,0.08)", fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
          v1.0 · MedCore Systems
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Topbar */}
        <header style={{ background: "#fff", borderBottom: `1px solid ${COLORS.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.slate, display: "none" }}>
            <Icon name="menu" size={22} />
          </button>
          <h1 style={{ fontSize: 17, fontWeight: 700, color: COLORS.navy, margin: 0 }}>
            {navItems.find(n => n.key === tab)?.label}
          </h1>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 14 }}>
            {lowStockCount > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: COLORS.amber, fontSize: 13, fontWeight: 600 }}>
                <Icon name="alert" size={16} /> {lowStockCount} low stock
              </div>
            )}
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: COLORS.teal, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 15 }}>A</div>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          {renderContent()}
        </main>
      </div>

      {/* Mobile overlay */}
      {menuOpen && (
        <div onClick={() => setMenuOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 99 }} />
      )}
    </div>
  );
}
