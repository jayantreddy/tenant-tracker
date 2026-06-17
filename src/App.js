import { useRef, useState } from "react";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const today = new Date();
const CURRENT_MONTH = today.getMonth();
const CURRENT_YEAR = today.getFullYear();

const USERS = ["jayant", "pooja", "aarna", "thulasi", "kkram"];
const DEFAULT_PASSWORD = "rent@blr";

const COLORS = {
  page: "#F5F7FB",
  card: "#FFFFFF",
  text: "#111827",
  muted: "#6B7280",
  faint: "#9CA3AF",
  border: "#E5E7EB",
  borderLight: "#EEF0F4",
  primary: "#4F46E5",
  primary2: "#7C3AED",
  primaryLight: "#EEF2FF",
  green: "#059669",
  greenLight: "#ECFDF5",
  red: "#DC2626",
  redLight: "#FEF2F2",
  amber: "#D97706",
  amberLight: "#FFFBEB",
  blue: "#0891B2",
  blueLight: "#ECFEFF",
  sidebar: "#111827",
  sidebar2: "#1F2937",
  shadow: "0 18px 45px rgba(15, 23, 42, 0.08)"
};

const PROPERTY_COLORS = [
  "#4F46E5",
  "#059669",
  "#0891B2",
  "#9333EA",
  "#DC2626",
  "#D97706",
  "#DB2777",
  "#0D9488"
];

const CURRENCIES = [
  { code: "INR", symbol: "Rs ", label: "Indian Rupee (INR)" },
  { code: "USD", symbol: "$", label: "US Dollar (USD)" },
  { code: "GBP", symbol: "GBP ", label: "British Pound (GBP)" },
  { code: "EUR", symbol: "EUR ", label: "Euro (EUR)" }
];

const COUNTRY_OPTIONS = [
  { country: "India", currency: "INR" },
  { country: "USA", currency: "USD" },
  { country: "UK", currency: "GBP" },
  { country: "Europe", currency: "EUR" }
];

const REPAIR_CATEGORIES = [
  "Plumbing",
  "Electrician",
  "Security",
  "BBMP",
  "BESCOM",
  "BWSSB",
  "Other"
];

const MAINTENANCE_CATEGORIES = [
  "Electricity bill",
  "Water bill",
  "Regular repair",
  "Salary",
  "Water tanker",
  "General"
];

const CATEGORY_COLORS = {
  Plumbing: "#0891B2",
  Electrician: "#D97706",
  Security: "#9333EA",
  BBMP: "#DC2626",
  BESCOM: "#EA580C",
  BWSSB: "#059669",
  Other: "#6B7280",
  "Electricity bill": "#D97706",
  "Water bill": "#0891B2",
  "Regular repair": "#9333EA",
  Salary: "#059669",
  "Water tanker": "#0D9488",
  General: "#6B7280"
};

const INITIAL_BUILDINGS = [
  {
    id: 1,
    name: "Bangalore Residences",
    address: "12 MG Road, Bangalore, Karnataka",
    country: "India",
    currency: "INR"
  },
  {
    id: 2,
    name: "Mumbai Heights",
    address: "45 Marine Drive, Mumbai, Maharashtra",
    country: "India",
    currency: "INR"
  },
  {
    id: 3,
    name: "Chennai Villas",
    address: "8 Anna Salai, Chennai, Tamil Nadu",
    country: "India",
    currency: "INR"
  },
  {
    id: 4,
    name: "Sunset Apartments",
    address: "12 Sunset Blvd, Miami FL, USA",
    country: "USA",
    currency: "USD"
  }
];

function makeMonthKey(month, year) {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

function getCurrency(code) {
  return CURRENCIES.find((currency) => currency.code === code) || CURRENCIES[0];
}

function formatMoneyByCurrency(value, currencyCode) {
  const amount = Number(value) || 0;
  const currency = getCurrency(currencyCode);
  const sign = amount < 0 ? "-" : "";
  return `${sign}${currency.symbol}${Math.abs(amount).toLocaleString()}`;
}

function getPortfolioLabel(currencyCode) {
  if (currencyCode === "INR") return "India portfolio";
  if (currencyCode === "USD") return "USA portfolio";
  if (currencyCode === "GBP") return "UK portfolio";
  if (currencyCode === "EUR") return "Europe portfolio";
  return `${currencyCode} portfolio`;
}

function generateTenants() {
  return Array.from({ length: 40 }, (_, index) => {
    const buildingIndex = Math.floor(index / 10);
    const building = INITIAL_BUILDINGS[buildingIndex];
    const isIndia = building.currency === "INR";

    const rents = isIndia
      ? [8000, 9500, 10000, 11000, 12000, 12500, 13000, 14000, 15000]
      : [800, 950, 1000, 1100, 1200, 1250, 1300, 1400, 1500];

    const leaseEnd = new Date(
      CURRENT_YEAR + (index % 2 === 0 ? 1 : 0),
      (index * 2 + 3) % 12,
      1
    );

    return {
      id: index + 1,
      unit: `${buildingIndex + 1}0${(index % 10) + 1}`,
      name: `Tenant ${index + 1}`,
      phone: isIndia
        ? `+91 98${String(1000 + index * 7).slice(-4)}`
        : `+1 55${String(1000 + index * 7).slice(-4)}`,
      email: `tenant${index + 1}@email.com`,
      rent: rents[index % rents.length],
      leaseEnd: leaseEnd.toISOString().slice(0, 10),
      buildingId: building.id
    };
  });
}

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  border: `1px solid ${COLORS.border}`,
  borderRadius: 12,
  padding: "11px 13px",
  fontSize: 14,
  color: COLORS.text,
  background: "#FFFFFF",
  outline: "none"
};

const labelStyle = {
  display: "block",
  marginBottom: 6,
  fontSize: 12,
  color: COLORS.muted,
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: 0.4
};

function buttonStyle(type = "default") {
  const base = {
    border: "none",
    borderRadius: 12,
    padding: "10px 14px",
    fontSize: 13,
    fontWeight: 800,
    cursor: "pointer",
    whiteSpace: "nowrap"
  };

  if (type === "primary") {
    return {
      ...base,
      color: "#FFFFFF",
      background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primary2})`,
      boxShadow: "0 10px 22px rgba(79, 70, 229, 0.25)"
    };
  }

  if (type === "green") {
    return {
      ...base,
      color: "#FFFFFF",
      background: COLORS.green
    };
  }

  if (type === "danger") {
    return {
      ...base,
      color: COLORS.red,
      background: COLORS.redLight,
      border: `1px solid ${COLORS.redLight}`
    };
  }

  if (type === "blue") {
    return {
      ...base,
      color: COLORS.blue,
      background: COLORS.blueLight,
      border: `1px solid ${COLORS.blueLight}`
    };
  }

  return {
    ...base,
    color: COLORS.text,
    background: "#FFFFFF",
    border: `1px solid ${COLORS.border}`
  };
}

function Card({ children, padding = 22, background = COLORS.card }) {
  return (
    <div
      style={{
        background,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 22,
        padding,
        boxShadow: COLORS.shadow,
        marginBottom: 18
      }}
    >
      {children}
    </div>
  );
}

function MetricCard({ label, value, color = COLORS.text, subText }) {
  return (
    <div
      style={{
        background: COLORS.card,
        border: `1px solid ${COLORS.borderLight}`,
        borderRadius: 18,
        padding: 18
      }}
    >
      <div style={{ color: COLORS.muted, fontSize: 13, fontWeight: 800 }}>
        {label}
      </div>
      <div style={{ color, fontSize: 28, fontWeight: 950, marginTop: 8 }}>
        {value}
      </div>
      {subText && (
        <div style={{ color: COLORS.faint, fontSize: 12, marginTop: 5 }}>
          {subText}
        </div>
      )}
    </div>
  );
}

function Progress({ value, color }) {
  const barColor =
    color ||
    (value >= 80 ? COLORS.green : value >= 50 ? COLORS.amber : COLORS.red);

  return (
    <div
      style={{
        height: 12,
        background: COLORS.borderLight,
        borderRadius: 999,
        overflow: "hidden"
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${Math.max(0, Math.min(100, value))}%`,
          borderRadius: 999,
          background: barColor,
          transition: "width .35s ease"
        }}
      />
    </div>
  );
}

function Badge({ status }) {
  const config = {
    paid: { label: "Paid", color: COLORS.green, bg: COLORS.greenLight },
    partial: { label: "Partial", color: COLORS.amber, bg: COLORS.amberLight },
    unpaid: { label: "Unpaid", color: COLORS.red, bg: COLORS.redLight },
    open: { label: "Open", color: COLORS.amber, bg: COLORS.amberLight },
    resolved: { label: "Resolved", color: COLORS.green, bg: COLORS.greenLight }
  };

  const item = config[status] || config.unpaid;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: 999,
        padding: "4px 10px",
        fontSize: 12,
        fontWeight: 800,
        color: item.color,
        background: item.bg
      }}
    >
      {item.label}
    </span>
  );
}

function EmptyState({ title, text, compact }) {
  return (
    <div
      style={{
        padding: compact ? 18 : 34,
        textAlign: "center",
        color: COLORS.muted
      }}
    >
      <div style={{ fontWeight: 900, color: COLORS.text }}>{title}</div>
      <div style={{ marginTop: 5, fontSize: 13 }}>{text}</div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        value={value || ""}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        style={inputStyle}
      />
    </div>
  );
}

function SelectField({ label, value, onChange, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={labelStyle}>{label}</label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        style={inputStyle}
      >
        {children}
      </select>
    </div>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "rgba(15, 23, 42, 0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20
      }}
      onMouseDown={onClose}
    >
      <div
        style={{
          width: 560,
          maxWidth: "100%",
          maxHeight: "92vh",
          overflow: "auto",
          background: "#FFFFFF",
          borderRadius: 22,
          boxShadow: "0 30px 90px rgba(0,0,0,.28)",
          padding: 26
        }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div
          style={{
            fontSize: 18,
            fontWeight: 900,
            marginBottom: 18,
            color: COLORS.text
          }}
        >
          {title}
        </div>
        {children}
      </div>
    </div>
  );
}

function LoginScreen({ onLogin }) {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function login() {
    const username = user.trim().toLowerCase();

    if (!USERS.includes(username)) {
      setError("Username not found.");
      return;
    }

    const savedPasswords = JSON.parse(localStorage.getItem("manne_pwds") || "{}");
    const expectedPassword = savedPasswords[username] || DEFAULT_PASSWORD;

    if (password !== expectedPassword) {
      setError("Incorrect password.");
      return;
    }

    localStorage.setItem("manne_auth", JSON.stringify({ user: username }));
    onLogin(username);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(99,102,241,.65), transparent 34%), linear-gradient(135deg, #0F172A, #1E293B)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        fontFamily:
          "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
      }}
    >
      <div
        style={{
          width: 410,
          maxWidth: "100%",
          background: "rgba(255,255,255,0.97)",
          border: "1px solid rgba(255,255,255,0.55)",
          borderRadius: 26,
          padding: "42px 38px",
          boxShadow: "0 30px 90px rgba(0,0,0,0.35)"
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 18,
              margin: "0 auto 14px",
              background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primary2})`,
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              fontWeight: 900
            }}
          >
            M
          </div>
          <div style={{ fontSize: 32, fontWeight: 900, color: COLORS.text }}>
            Manne
          </div>
          <div style={{ fontSize: 14, color: COLORS.muted, marginTop: 5 }}>
            Property management dashboard
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Username</label>
          <input
            value={user}
            onChange={(event) => {
              setUser(event.target.value);
              setError("");
            }}
            onKeyDown={(event) => event.key === "Enter" && login()}
            placeholder="Enter your username"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: 18 }}>
          <label style={labelStyle}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setError("");
            }}
            onKeyDown={(event) => event.key === "Enter" && login()}
            placeholder="Enter your password"
            style={inputStyle}
          />
        </div>

        {error && (
          <div
            style={{
              background: COLORS.redLight,
              color: COLORS.red,
              borderRadius: 12,
              padding: 12,
              fontSize: 13,
              fontWeight: 700,
              marginBottom: 14
            }}
          >
            {error}
          </div>
        )}

        <button
          onClick={login}
          style={{ ...buttonStyle("primary"), width: "100%", padding: 13 }}
        >
          Sign in
        </button>

        <div
          style={{
            textAlign: "center",
            marginTop: 16,
            color: COLORS.faint,
            fontSize: 12
          }}
        >
          Contact the administrator if you need access.
        </div>
      </div>
    </div>
  );
}

function ChangePasswordModal({ user, onClose }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  function save() {
    const savedPasswords = JSON.parse(localStorage.getItem("manne_pwds") || "{}");
    const expectedPassword = savedPasswords[user] || DEFAULT_PASSWORD;

    if (currentPassword !== expectedPassword) {
      setError("Current password is incorrect.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    savedPasswords[user] = newPassword;
    localStorage.setItem("manne_pwds", JSON.stringify(savedPasswords));
    setSaved(true);
  }

  return (
    <Modal title="Change password" onClose={onClose}>
      {saved ? (
        <div
          style={{
            background: COLORS.greenLight,
            color: COLORS.green,
            borderRadius: 12,
            padding: 14,
            fontWeight: 800,
            marginBottom: 16
          }}
        >
          Password updated successfully.
        </div>
      ) : (
        <>
          <Field
            label="Current password"
            type="password"
            value={currentPassword}
            onChange={setCurrentPassword}
          />
          <Field
            label="New password"
            type="password"
            value={newPassword}
            onChange={setNewPassword}
          />
          <Field
            label="Confirm new password"
            type="password"
            value={confirmPassword}
            onChange={setConfirmPassword}
          />

          {error && (
            <div
              style={{
                background: COLORS.redLight,
                color: COLORS.red,
                borderRadius: 12,
                padding: 12,
                fontSize: 13,
                fontWeight: 700,
                marginBottom: 14
              }}
            >
              {error}
            </div>
          )}
        </>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
        <button onClick={onClose} style={buttonStyle()}>
          Close
        </button>
        {!saved && (
          <button onClick={save} style={buttonStyle("primary")}>
            Update password
          </button>
        )}
      </div>
    </Modal>
  );
}

function Dashboard({ currentUser, onLogout }) {
  const [tenants, setTenants] = useState(generateTenants);
  const [payments, setPayments] = useState({});
  const [repairs, setRepairs] = useState({});
  const [maintenance, setMaintenance] = useState({});
  const [buildings, setBuildings] = useState(INITIAL_BUILDINGS);
  const [propertyDocs, setPropertyDocs] = useState({});
  const [tenantDocs, setTenantDocs] = useState({});
  const [view, setView] = useState("dashboard");
  const [selectedMonth, setSelectedMonth] = useState(CURRENT_MONTH);
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [statusFilter, setStatusFilter] = useState("all");
  const [buildingFilter, setBuildingFilter] = useState(0);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [repairForm, setRepairForm] = useState({
    buildingId: "",
    tenantId: "",
    category: "Plumbing",
    text: "",
    amount: "",
    docs: []
  });

  const [maintenanceForm, setMaintenanceForm] = useState({
    buildingId: "",
    category: "Electricity bill",
    text: "",
    amount: "",
    docs: []
  });

  const monthKey = makeMonthKey(selectedMonth, selectedYear);
  const monthRepairs = repairs[monthKey] || [];
  const monthMaintenance = maintenance[monthKey] || [];

  function getBuilding(buildingId) {
    return buildings.find((building) => building.id === Number(buildingId));
  }

  function getBuildingCurrency(buildingId) {
    return getCurrency(getBuilding(buildingId)?.currency || "INR");
  }

  function formatMoney(value, buildingId) {
    const building = getBuilding(buildingId);
    const currencyCode = building?.currency || "INR";
    return formatMoneyByCurrency(value, currencyCode);
  }

  function getPayment(tenantId) {
    return payments[monthKey]?.[tenantId] || {
      status: "unpaid",
      amount: 0,
      date: ""
    };
  }

  function setPayment(tenantId, status, amount, date) {
    const tenant = tenants.find((item) => item.id === tenantId);

    const value =
      status === "paid"
        ? {
            status: "paid",
            amount: tenant.rent,
            date: today.toISOString().slice(0, 10)
          }
        : status === "partial"
        ? {
            status: "partial",
            amount: Number(amount) || 0,
            date: date || today.toISOString().slice(0, 10)
          }
        : {
            status: "unpaid",
            amount: 0,
            date: ""
          };

    setPayments((previous) => ({
      ...previous,
      [monthKey]: {
        ...previous[monthKey],
        [tenantId]: value
      }
    }));
  }

  function filesToDocs(files) {
    return Array.from(files || []).map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      date: today.toISOString().slice(0, 10)
    }));
  }

  function uploadDocs(setter, id, files) {
    const docs = filesToDocs(files);

    setter((previous) => ({
      ...previous,
      [id]: [...(previous[id] || []), ...docs]
    }));
  }

  function removeDoc(setter, id, index) {
    setter((previous) => ({
      ...previous,
      [id]: previous[id].filter((_, currentIndex) => currentIndex !== index)
    }));
  }

  function addRepair() {
    if (!repairForm.buildingId || !repairForm.text.trim()) return;

    const newRepair = {
      id: Date.now(),
      buildingId: Number(repairForm.buildingId),
      tenantId: repairForm.tenantId ? Number(repairForm.tenantId) : "",
      category: repairForm.category,
      text: repairForm.text.trim(),
      amount: Number(repairForm.amount) || 0,
      docs: repairForm.docs,
      date: today.toISOString().slice(0, 10),
      status: "open"
    };

    setRepairs((previous) => ({
      ...previous,
      [monthKey]: [...(previous[monthKey] || []), newRepair]
    }));

    setRepairForm({
      buildingId: "",
      tenantId: "",
      category: "Plumbing",
      text: "",
      amount: "",
      docs: []
    });
  }

  function toggleRepair(repairId) {
    setRepairs((previous) => ({
      ...previous,
      [monthKey]: (previous[monthKey] || []).map((repair) =>
        repair.id === repairId
          ? {
              ...repair,
              status: repair.status === "open" ? "resolved" : "open"
            }
          : repair
      )
    }));
  }

  function addMaintenance() {
    if (!maintenanceForm.buildingId || !maintenanceForm.text.trim()) return;

    const newItem = {
      id: Date.now(),
      buildingId: Number(maintenanceForm.buildingId),
      category: maintenanceForm.category,
      text: maintenanceForm.text.trim(),
      amount: Number(maintenanceForm.amount) || 0,
      docs: maintenanceForm.docs,
      date: today.toISOString().slice(0, 10)
    };

    setMaintenance((previous) => ({
      ...previous,
      [monthKey]: [...(previous[monthKey] || []), newItem]
    }));

    setMaintenanceForm({
      buildingId: "",
      category: "Electricity bill",
      text: "",
      amount: "",
      docs: []
    });
  }

  function removeMaintenance(itemId) {
    setMaintenance((previous) => ({
      ...previous,
      [monthKey]: (previous[monthKey] || []).filter((item) => item.id !== itemId)
    }));
  }

  function exportCSV() {
    const rows = [
      [
        "Building",
        "Country",
        "Unit",
        "Tenant",
        "Rent",
        "Currency",
        "Status",
        "Amount Paid",
        "Date",
        "Lease End"
      ]
    ];

    tenants.forEach((tenant) => {
      const payment = getPayment(tenant.id);
      const building = getBuilding(tenant.buildingId);

      rows.push([
        building?.name || "",
        building?.country || "",
        tenant.unit,
        tenant.name,
        tenant.rent,
        building?.currency || "",
        payment.status,
        payment.amount || "",
        payment.date,
        tenant.leaseEnd
      ]);
    });

    const csv = rows.map((row) => row.join(",")).join("\n");
    const link = document.createElement("a");
    link.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
    link.download = `rent_${monthKey}.csv`;
    link.click();
  }

  function getTenantName(tenantId) {
    if (!tenantId) return "No tenant selected";
    const tenant = tenants.find((item) => item.id === Number(tenantId));
    return tenant ? `Unit ${tenant.unit} - ${tenant.name}` : "Tenant not found";
  }

  function getPropertyExpense(buildingId) {
    const repairExpense = monthRepairs
      .filter((repair) => repair.buildingId === buildingId)
      .reduce((sum, repair) => sum + Number(repair.amount || 0), 0);

    const maintenanceExpense = monthMaintenance
      .filter((item) => item.buildingId === buildingId)
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);

    return repairExpense + maintenanceExpense;
  }

  function getCurrencySummary(currencyCode) {
    const currencyBuildings = buildings.filter(
      (building) => building.currency === currencyCode
    );

    const currencyBuildingIds = currencyBuildings.map((building) => building.id);

    const currencyTenants = tenants.filter((tenant) =>
      currencyBuildingIds.includes(tenant.buildingId)
    );

    const expected = currencyTenants.reduce(
      (sum, tenant) => sum + Number(tenant.rent || 0),
      0
    );

    const collected = currencyTenants.reduce((sum, tenant) => {
      const payment = getPayment(tenant.id);

      if (payment.status === "paid") {
        return sum + Number(tenant.rent || 0);
      }

      if (payment.status === "partial") {
        return sum + Number(payment.amount || 0);
      }

      return sum;
    }, 0);

    const repairExpense = monthRepairs
      .filter((repair) => currencyBuildingIds.includes(repair.buildingId))
      .reduce((sum, repair) => sum + Number(repair.amount || 0), 0);

    const maintenanceExpense = monthMaintenance
      .filter((item) => currencyBuildingIds.includes(item.buildingId))
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);

    const expenses = repairExpense + maintenanceExpense;
    const net = collected - expenses;
    const progress = expected > 0 ? Math.round((collected / expected) * 100) : 0;

    return {
      currencyCode,
      buildings: currencyBuildings,
      expected,
      collected,
      repairExpense,
      maintenanceExpense,
      expenses,
      net,
      progress
    };
  }

  const filteredTenants = tenants.filter((tenant) => {
    const payment = getPayment(tenant.id);
    const query = search.toLowerCase();

    return (
      (statusFilter === "all" || payment.status === statusFilter) &&
      (buildingFilter === 0 || tenant.buildingId === buildingFilter) &&
      (tenant.name.toLowerCase().includes(query) || tenant.unit.includes(query))
    );
  });

  const paidCount = tenants.filter(
    (tenant) => getPayment(tenant.id).status === "paid"
  ).length;

  const partialCount = tenants.filter(
    (tenant) => getPayment(tenant.id).status === "partial"
  ).length;

  const unpaidCount = tenants.filter(
    (tenant) => getPayment(tenant.id).status === "unpaid"
  ).length;

  const collectionProgress =
    tenants.length > 0
      ? Math.round(((paidCount + partialCount * 0.5) / tenants.length) * 100)
      : 0;

  const currencySummaries = Array.from(
    new Set(buildings.map((building) => building.currency))
  )
    .map(getCurrencySummary)
    .filter((summary) => summary.buildings.length > 0);

  const repairSummaryByCurrency = currencySummaries.reduce((map, summary) => {
    map[summary.currencyCode] = summary.repairExpense;
    return map;
  }, {});

  const maintenanceSummaryByCurrency = currencySummaries.reduce((map, summary) => {
    map[summary.currencyCode] = summary.maintenanceExpense;
    return map;
  }, {});

  const openRepairs = monthRepairs.filter((repair) => repair.status === "open");
  const resolvedRepairs = monthRepairs.filter(
    (repair) => repair.status === "resolved"
  );

  const expiringLeases = tenants.filter((tenant) => {
    const days = (new Date(tenant.leaseEnd) - today) / 86400000;
    return days >= 0 && days <= 60;
  });

  const navItems = [
    ["dashboard", "Dashboard"],
    ["tenants", "Tenants"],
    ["repairs", "Repairs"],
    ["maintenance", "Maintenance"],
    ["documents", "Documents"]
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: COLORS.page,
        color: COLORS.text,
        fontFamily:
          "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
        display: "flex"
      }}
    >
      {showPassword && (
        <ChangePasswordModal
          user={currentUser}
          onClose={() => setShowPassword(false)}
        />
      )}

      {modal?.type === "tenant" && (
        <TenantModal
          tenant={modal.tenant}
          buildings={buildings}
          tenantDocs={tenantDocs[modal.tenant.id] || []}
          getBuildingCurrency={getBuildingCurrency}
          formatMoney={formatMoney}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          setTenants={setTenants}
          setPayment={setPayment}
          uploadDocs={(files) => uploadDocs(setTenantDocs, modal.tenant.id, files)}
          removeDoc={(index) => removeDoc(setTenantDocs, modal.tenant.id, index)}
          onClose={() => setModal(null)}
        />
      )}

      {modal?.type === "building" && (
        <BuildingModal
          building={modal.building}
          buildings={buildings}
          setBuildings={setBuildings}
          onClose={() => setModal(null)}
        />
      )}

      <aside
        style={{
          width: 248,
          minHeight: "100vh",
          background: `linear-gradient(180deg, ${COLORS.sidebar}, ${COLORS.sidebar2})`,
          color: "#FFFFFF",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0
        }}
      >
        <div
          style={{
            padding: "26px 24px",
            borderBottom: "1px solid rgba(255,255,255,.08)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 14,
                background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primary2})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                fontSize: 19
              }}
            >
              M
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 900 }}>Manne</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.48)" }}>
                Property Manager
              </div>
            </div>
          </div>
        </div>

        <nav style={{ padding: "14px 10px", flex: 1 }}>
          {navItems.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setView(key)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                padding: "12px 14px",
                marginBottom: 6,
                borderRadius: 14,
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                color: view === key ? "#FFFFFF" : "rgba(255,255,255,.58)",
                background:
                  view === key ? "rgba(255,255,255,.10)" : "transparent",
                fontSize: 14,
                fontWeight: view === key ? 800 : 600
              }}
            >
              {label}
            </button>
          ))}
        </nav>

        <div
          style={{
            padding: 20,
            borderTop: "1px solid rgba(255,255,255,.08)"
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,.42)",
              textTransform: "uppercase"
            }}
          >
            Signed in as
          </div>
          <div
            style={{
              fontWeight: 900,
              marginTop: 4,
              textTransform: "capitalize"
            }}
          >
            {currentUser}
          </div>

          <div style={{ marginTop: 18 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
                color: "rgba(255,255,255,.55)"
              }}
            >
              <span>Collection progress</span>
              <strong style={{ color: "#FFFFFF" }}>{collectionProgress}%</strong>
            </div>
            <div
              style={{
                height: 8,
                background: "rgba(255,255,255,.12)",
                borderRadius: 99,
                marginTop: 8,
                overflow: "hidden"
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${collectionProgress}%`,
                  background:
                    collectionProgress >= 80
                      ? "#34D399"
                      : collectionProgress >= 50
                      ? "#FCD34D"
                      : "#F87171"
                }}
              />
            </div>
          </div>

          <button
            onClick={() => setShowPassword(true)}
            style={{
              ...buttonStyle(),
              width: "100%",
              marginTop: 18,
              background: "rgba(255,255,255,.08)",
              color: "rgba(255,255,255,.78)",
              border: "1px solid rgba(255,255,255,.10)"
            }}
          >
            Change password
          </button>

          <button
            onClick={onLogout}
            style={{
              ...buttonStyle("danger"),
              width: "100%",
              marginTop: 8,
              background: "rgba(220,38,38,.14)",
              color: "#FCA5A5",
              border: "1px solid rgba(220,38,38,.20)"
            }}
          >
            Sign out
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, minWidth: 0 }}>
        <header
          style={{
            background: "#FFFFFF",
            borderBottom: `1px solid ${COLORS.border}`,
            padding: "20px 34px",
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            alignItems: "center",
            flexWrap: "wrap"
          }}
        >
          <div>
            <div style={{ fontSize: 24, fontWeight: 950 }}>
              {navItems.find((item) => item[0] === view)?.[1]}
            </div>
            <div style={{ color: COLORS.muted, fontSize: 14, marginTop: 4 }}>
              {tenants.length} units - {buildings.length} buildings -{" "}
              {MONTHS[selectedMonth]} {selectedYear}
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <select
              value={selectedMonth}
              onChange={(event) => setSelectedMonth(Number(event.target.value))}
              style={{ ...inputStyle, width: 150 }}
            >
              {MONTHS.map((month, index) => (
                <option key={month} value={index}>
                  {month}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(event) => setSelectedYear(Number(event.target.value))}
              style={{ ...inputStyle, width: 110 }}
            >
              {[CURRENT_YEAR - 1, CURRENT_YEAR, CURRENT_YEAR + 1].map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <button onClick={exportCSV} style={buttonStyle("primary")}>
              Export CSV
            </button>
          </div>
        </header>

        <section style={{ padding: "30px 34px", maxWidth: 1220 }}>
          {view === "dashboard" && (
            <>
              {currencySummaries.map((summary) => (
                <Card key={summary.currencyCode}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 12,
                      flexWrap: "wrap",
                      marginBottom: 18
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 950 }}>
                        {getPortfolioLabel(summary.currencyCode)}
                      </div>
                      <div
                        style={{
                          color: COLORS.muted,
                          fontSize: 13,
                          marginTop: 4
                        }}
                      >
                        {summary.buildings.length} properties -{" "}
                        {summary.currencyCode}
                      </div>
                    </div>

                    <span
                      style={{
                        background: COLORS.primaryLight,
                        color: COLORS.primary,
                        borderRadius: 999,
                        padding: "6px 12px",
                        fontSize: 12,
                        fontWeight: 900
                      }}
                    >
                      {summary.currencyCode}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                      gap: 14
                    }}
                  >
                    <MetricCard
                      label="Expected rent"
                      value={formatMoneyByCurrency(
                        summary.expected,
                        summary.currencyCode
                      )}
                    />

                    <MetricCard
                      label="Collected rent"
                      value={formatMoneyByCurrency(
                        summary.collected,
                        summary.currencyCode
                      )}
                      color={COLORS.green}
                    />

                    <MetricCard
                      label="Total expenses"
                      value={formatMoneyByCurrency(
                        summary.expenses,
                        summary.currencyCode
                      )}
                      color={COLORS.red}
                      subText={`Repairs ${formatMoneyByCurrency(
                        summary.repairExpense,
                        summary.currencyCode
                      )} - Maintenance ${formatMoneyByCurrency(
                        summary.maintenanceExpense,
                        summary.currencyCode
                      )}`}
                    />

                    <MetricCard
                      label="Net gain"
                      value={formatMoneyByCurrency(
                        summary.net,
                        summary.currencyCode
                      )}
                      color={summary.net >= 0 ? COLORS.green : COLORS.red}
                      subText="Collected rent minus expenses"
                    />
                  </div>

                  <div style={{ marginTop: 18 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 13,
                        color: COLORS.muted,
                        marginBottom: 8
                      }}
                    >
                      <span>Collection progress</span>
                      <strong>{summary.progress}%</strong>
                    </div>
                    <Progress value={summary.progress} />
                  </div>
                </Card>
              ))}

              <Card>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 10,
                    marginBottom: 12
                  }}
                >
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 900 }}>
                      Overall occupancy collection status
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: COLORS.muted,
                        marginTop: 4
                      }}
                    >
                      {paidCount} paid - {partialCount} partial - {unpaidCount} unpaid
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 28,
                      fontWeight: 950,
                      color:
                        collectionProgress >= 80
                          ? COLORS.green
                          : collectionProgress >= 50
                          ? COLORS.amber
                          : COLORS.red
                    }}
                  >
                    {collectionProgress}%
                  </div>
                </div>
                <Progress value={collectionProgress} />
              </Card>

              <Card>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 16
                  }}
                >
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 900 }}>Properties</div>
                    <div
                      style={{
                        fontSize: 13,
                        color: COLORS.muted,
                        marginTop: 4
                      }}
                    >
                      Rent, expenses, and net gain by property
                    </div>
                  </div>
                  <button
                    onClick={() => setModal({ type: "building", building: null })}
                    style={buttonStyle("primary")}
                  >
                    Add building
                  </button>
                </div>

                {buildings.map((building, index) => {
                  const buildingTenants = tenants.filter(
                    (tenant) => tenant.buildingId === building.id
                  );

                  const expected = buildingTenants.reduce(
                    (sum, tenant) => sum + tenant.rent,
                    0
                  );

                  const collected = buildingTenants.reduce((sum, tenant) => {
                    const payment = getPayment(tenant.id);
                    if (payment.status === "paid") return sum + tenant.rent;
                    if (payment.status === "partial") {
                      return sum + Number(payment.amount || 0);
                    }
                    return sum;
                  }, 0);

                  const expenses = getPropertyExpense(building.id);
                  const net = collected - expenses;
                  const percent =
                    expected > 0 ? Math.round((collected / expected) * 100) : 0;
                  const color = PROPERTY_COLORS[index % PROPERTY_COLORS.length];

                  return (
                    <div
                      key={building.id}
                      style={{
                        border: `1px solid ${COLORS.borderLight}`,
                        borderRadius: 18,
                        padding: 18,
                        marginBottom: 14,
                        background: "#FFFFFF"
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 14,
                          flexWrap: "wrap"
                        }}
                      >
                        <div style={{ display: "flex", gap: 14 }}>
                          <div
                            style={{
                              width: 46,
                              height: 46,
                              borderRadius: 16,
                              background: color,
                              color: "#FFFFFF",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 950
                            }}
                          >
                            {index + 1}
                          </div>
                          <div>
                            <div style={{ fontSize: 16, fontWeight: 900 }}>
                              Property {index + 1}: {building.name}
                            </div>
                            <div
                              style={{
                                color: COLORS.muted,
                                fontSize: 13,
                                marginTop: 3
                              }}
                            >
                              {building.address}
                            </div>
                            <div
                              style={{
                                display: "flex",
                                gap: 8,
                                marginTop: 7,
                                flexWrap: "wrap"
                              }}
                            >
                              <span
                                style={{
                                  background: COLORS.primaryLight,
                                  color: COLORS.primary,
                                  borderRadius: 999,
                                  padding: "4px 9px",
                                  fontSize: 11,
                                  fontWeight: 900
                                }}
                              >
                                {building.country || "India"}
                              </span>
                              <span
                                style={{
                                  background: COLORS.blueLight,
                                  color: COLORS.blue,
                                  borderRadius: 999,
                                  padding: "4px 9px",
                                  fontSize: 11,
                                  fontWeight: 900
                                }}
                              >
                                {building.currency}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => setModal({ type: "building", building })}
                          style={buttonStyle()}
                        >
                          Edit
                        </button>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: 18,
                          flexWrap: "wrap",
                          marginTop: 16,
                          fontSize: 13,
                          color: COLORS.muted
                        }}
                      >
                        <span>
                          Expected:{" "}
                          <strong style={{ color: COLORS.text }}>
                            {formatMoney(expected, building.id)}
                          </strong>
                        </span>
                        <span>
                          Collected:{" "}
                          <strong style={{ color: COLORS.green }}>
                            {formatMoney(collected, building.id)}
                          </strong>
                        </span>
                        <span>
                          Expenses:{" "}
                          <strong style={{ color: COLORS.red }}>
                            {formatMoney(expenses, building.id)}
                          </strong>
                        </span>
                        <span>
                          Net:{" "}
                          <strong
                            style={{ color: net >= 0 ? COLORS.green : COLORS.red }}
                          >
                            {formatMoney(net, building.id)}
                          </strong>
                        </span>
                      </div>

                      <div style={{ marginTop: 12 }}>
                        <Progress value={percent} color={color} />
                      </div>
                    </div>
                  );
                })}
              </Card>

              {expiringLeases.length > 0 && (
                <Card background={COLORS.amberLight}>
                  <div
                    style={{
                      color: COLORS.amber,
                      fontWeight: 900,
                      marginBottom: 10
                    }}
                  >
                    Leases expiring within 60 days
                  </div>
                  {expiringLeases.map((tenant) => (
                    <div
                      key={tenant.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "8px 0",
                        borderBottom: `1px solid rgba(217,119,6,.15)`,
                        fontSize: 14
                      }}
                    >
                      <span>
                        Unit {tenant.unit} - {tenant.name}
                      </span>
                      <strong>{tenant.leaseEnd}</strong>
                    </div>
                  ))}
                </Card>
              )}
            </>
          )}

          {view === "tenants" && (
            <>
              <Card>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by tenant or unit..."
                    style={{ ...inputStyle, width: 240 }}
                  />

                  <select
                    value={buildingFilter}
                    onChange={(event) =>
                      setBuildingFilter(Number(event.target.value))
                    }
                    style={{ ...inputStyle, width: 260 }}
                  >
                    <option value={0}>All properties</option>
                    {buildings.map((building, index) => (
                      <option key={building.id} value={building.id}>
                        Property {index + 1}: {building.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    style={{ ...inputStyle, width: 170 }}
                  >
                    <option value="all">All statuses</option>
                    <option value="paid">Paid</option>
                    <option value="partial">Partial</option>
                    <option value="unpaid">Unpaid</option>
                  </select>
                </div>
              </Card>

              {buildings
                .filter(
                  (building) =>
                    buildingFilter === 0 || building.id === buildingFilter
                )
                .map((building, buildingIndex) => {
                  const color =
                    PROPERTY_COLORS[buildingIndex % PROPERTY_COLORS.length];

                  const buildingTenants = filteredTenants.filter(
                    (tenant) => tenant.buildingId === building.id
                  );

                  if (buildingTenants.length === 0) {
                    return null;
                  }

                  const expected = buildingTenants.reduce(
                    (sum, tenant) => sum + Number(tenant.rent || 0),
                    0
                  );

                  const collected = buildingTenants.reduce((sum, tenant) => {
                    const payment = getPayment(tenant.id);

                    if (payment.status === "paid") {
                      return sum + Number(tenant.rent || 0);
                    }

                    if (payment.status === "partial") {
                      return sum + Number(payment.amount || 0);
                    }

                    return sum;
                  }, 0);

                  const propertyProgress =
                    expected > 0 ? Math.round((collected / expected) * 100) : 0;

                  const propertyPaid = buildingTenants.filter(
                    (tenant) => getPayment(tenant.id).status === "paid"
                  ).length;

                  const propertyPartial = buildingTenants.filter(
                    (tenant) => getPayment(tenant.id).status === "partial"
                  ).length;

                  const propertyUnpaid = buildingTenants.filter(
                    (tenant) => getPayment(tenant.id).status === "unpaid"
                  ).length;

                  return (
                    <Card key={building.id} padding={0}>
                      <div
                        style={{
                          borderTop: `5px solid ${color}`,
                          padding: 20,
                          background: "#FFFFFF",
                          borderRadius: "22px 22px 0 0"
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 14,
                            alignItems: "center",
                            flexWrap: "wrap"
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              gap: 14,
                              alignItems: "center"
                            }}
                          >
                            <div
                              style={{
                                width: 50,
                                height: 50,
                                borderRadius: 16,
                                background: color,
                                color: "#FFFFFF",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 950,
                                fontSize: 18
                              }}
                            >
                              {buildingIndex + 1}
                            </div>

                            <div>
                              <div style={{ fontSize: 18, fontWeight: 950 }}>
                                Property {buildingIndex + 1}: {building.name}
                              </div>

                              <div
                                style={{
                                  color: COLORS.muted,
                                  fontSize: 13,
                                  marginTop: 4
                                }}
                              >
                                {building.address}
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  gap: 8,
                                  marginTop: 8,
                                  flexWrap: "wrap"
                                }}
                              >
                                <span
                                  style={{
                                    background: COLORS.primaryLight,
                                    color: COLORS.primary,
                                    borderRadius: 999,
                                    padding: "4px 9px",
                                    fontSize: 11,
                                    fontWeight: 900
                                  }}
                                >
                                  {building.country || "India"}
                                </span>

                                <span
                                  style={{
                                    background: COLORS.blueLight,
                                    color: COLORS.blue,
                                    borderRadius: 999,
                                    padding: "4px 9px",
                                    fontSize: 11,
                                    fontWeight: 900
                                  }}
                                >
                                  {building.currency}
                                </span>

                                <span
                                  style={{
                                    background: COLORS.greenLight,
                                    color: COLORS.green,
                                    borderRadius: 999,
                                    padding: "4px 9px",
                                    fontSize: 11,
                                    fontWeight: 900
                                  }}
                                >
                                  {buildingTenants.length} tenants
                                </span>
                              </div>
                            </div>
                          </div>

                          <div style={{ minWidth: 220 }}>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                color: COLORS.muted,
                                fontSize: 12,
                                marginBottom: 8
                              }}
                            >
                              <span>Collection</span>
                              <strong style={{ color }}>
                                {propertyProgress}%
                              </strong>
                            </div>

                            <Progress value={propertyProgress} color={color} />

                            <div
                              style={{
                                color: COLORS.muted,
                                fontSize: 12,
                                marginTop: 8,
                                textAlign: "right"
                              }}
                            >
                              {propertyPaid} paid - {propertyPartial} partial -{" "}
                              {propertyUnpaid} unpaid
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        {buildingTenants.map((tenant, index) => {
                          const payment = getPayment(tenant.id);
                          const docs = tenantDocs[tenant.id] || [];

                          return (
                            <div
                              key={tenant.id}
                              style={{
                                padding: "16px 20px",
                                borderTop: `1px solid ${COLORS.borderLight}`,
                                display: "flex",
                                alignItems: "center",
                                gap: 16,
                                flexWrap: "wrap",
                                background: index % 2 === 0 ? "#FFFFFF" : "#FAFBFC"
                              }}
                            >
                              <div style={{ minWidth: 110 }}>
                                <div
                                  style={{
                                    fontSize: 11,
                                    color,
                                    fontWeight: 950
                                  }}
                                >
                                  UNIT {tenant.unit}
                                </div>

                                <div
                                  style={{
                                    fontSize: 16,
                                    fontWeight: 900,
                                    marginTop: 3
                                  }}
                                >
                                  {tenant.name}
                                </div>

                                <div
                                  style={{
                                    color: COLORS.muted,
                                    fontSize: 13,
                                    marginTop: 2
                                  }}
                                >
                                  {formatMoney(tenant.rent, tenant.buildingId)}/mo
                                </div>
                              </div>

                              <div
                                style={{
                                  minWidth: 230,
                                  color: COLORS.muted,
                                  fontSize: 13,
                                  lineHeight: 1.6
                                }}
                              >
                                <div>{tenant.email}</div>
                                <div>{tenant.phone}</div>
                                <div>Lease ends {tenant.leaseEnd}</div>
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 8,
                                  marginLeft: "auto",
                                  flexWrap: "wrap"
                                }}
                              >
                                <Badge status={payment.status} />

                                {payment.status === "partial" && (
                                  <strong
                                    style={{
                                      color: COLORS.amber,
                                      fontSize: 13
                                    }}
                                  >
                                    {formatMoney(
                                      payment.amount,
                                      tenant.buildingId
                                    )}
                                  </strong>
                                )}

                                <button
                                  onClick={() => setPayment(tenant.id, "paid")}
                                  style={buttonStyle("green")}
                                >
                                  Paid
                                </button>

                                <button
                                  onClick={() => setPayment(tenant.id, "unpaid")}
                                  style={buttonStyle("danger")}
                                >
                                  Unpaid
                                </button>

                                <button
                                  onClick={() =>
                                    setModal({ type: "tenant", tenant })
                                  }
                                  style={buttonStyle()}
                                >
                                  Edit
                                </button>
                              </div>

                              {docs.length > 0 && (
                                <div
                                  style={{
                                    width: "100%",
                                    display: "flex",
                                    gap: 8,
                                    flexWrap: "wrap",
                                    marginTop: 4
                                  }}
                                >
                                  {docs.map((doc, docIndex) => (
                                    <a
                                      key={docIndex}
                                      href={doc.url}
                                      download={doc.name}
                                      style={{
                                        color: COLORS.primary,
                                        background: COLORS.primaryLight,
                                        borderRadius: 999,
                                        padding: "5px 10px",
                                        textDecoration: "none",
                                        fontSize: 12,
                                        fontWeight: 800
                                      }}
                                    >
                                      File: {doc.name}
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </Card>
                  );
                })}

              {filteredTenants.length === 0 && (
                <Card>
                  <EmptyState
                    title="No tenants found"
                    text="Try changing your search or filters."
                  />
                </Card>
              )}
            </>
          )}

          {view === "repairs" && (
            <>
              <Card>
                <div style={{ fontSize: 17, fontWeight: 900, marginBottom: 14 }}>
                  Add repair expense
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.4fr 1.4fr 1.4fr 2fr 1fr",
                    gap: 10
                  }}
                >
                  <select
                    value={repairForm.buildingId}
                    onChange={(event) =>
                      setRepairForm((previous) => ({
                        ...previous,
                        buildingId: event.target.value,
                        tenantId: ""
                      }))
                    }
                    style={inputStyle}
                  >
                    <option value="">Select property...</option>
                    {buildings.map((building) => (
                      <option key={building.id} value={building.id}>
                        {building.name} - {building.currency}
                      </option>
                    ))}
                  </select>

                  <select
                    value={repairForm.tenantId}
                    onChange={(event) =>
                      setRepairForm((previous) => ({
                        ...previous,
                        tenantId: event.target.value
                      }))
                    }
                    style={inputStyle}
                  >
                    <option value="">Tenant optional</option>
                    {tenants
                      .filter(
                        (tenant) =>
                          !repairForm.buildingId ||
                          tenant.buildingId === Number(repairForm.buildingId)
                      )
                      .map((tenant) => (
                        <option key={tenant.id} value={tenant.id}>
                          Unit {tenant.unit} - {tenant.name}
                        </option>
                      ))}
                  </select>

                  <select
                    value={repairForm.category}
                    onChange={(event) =>
                      setRepairForm((previous) => ({
                        ...previous,
                        category: event.target.value
                      }))
                    }
                    style={inputStyle}
                  >
                    {REPAIR_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>

                  <input
                    value={repairForm.text}
                    onChange={(event) =>
                      setRepairForm((previous) => ({
                        ...previous,
                        text: event.target.value
                      }))
                    }
                    placeholder="Repair details..."
                    style={inputStyle}
                  />

                  <input
                    type="number"
                    value={repairForm.amount}
                    onChange={(event) =>
                      setRepairForm((previous) => ({
                        ...previous,
                        amount: event.target.value
                      }))
                    }
                    placeholder="Amount"
                    style={inputStyle}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 10,
                    flexWrap: "wrap",
                    marginTop: 12
                  }}
                >
                  <label style={{ ...buttonStyle("blue"), display: "inline-block" }}>
                    Attach document
                    <input
                      type="file"
                      multiple
                      style={{ display: "none" }}
                      onChange={(event) => {
                        const docs = filesToDocs(event.target.files);
                        setRepairForm((previous) => ({
                          ...previous,
                          docs: [...previous.docs, ...docs]
                        }));
                        event.target.value = "";
                      }}
                    />
                  </label>

                  <button onClick={addRepair} style={buttonStyle("primary")}>
                    Add repair
                  </button>
                </div>

                {repairForm.docs.length > 0 && (
                  <div
                    style={{
                      marginTop: 10,
                      fontSize: 13,
                      color: COLORS.muted
                    }}
                  >
                    Attached: {repairForm.docs.map((doc) => doc.name).join(", ")}
                  </div>
                )}
              </Card>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
                  gap: 18,
                  marginBottom: 18
                }}
              >
                {Object.entries(repairSummaryByCurrency).map(
                  ([currencyCode, value]) => (
                    <MetricCard
                      key={currencyCode}
                      label={`Repair expenses - ${currencyCode}`}
                      value={formatMoneyByCurrency(value, currencyCode)}
                      color={COLORS.red}
                    />
                  )
                )}
                <MetricCard
                  label="Open repairs"
                  value={openRepairs.length}
                  color={COLORS.amber}
                />
                <MetricCard
                  label="Resolved repairs"
                  value={resolvedRepairs.length}
                  color={COLORS.green}
                />
              </div>

              <Card padding={0}>
                {monthRepairs.length === 0 && (
                  <EmptyState
                    title="No repairs yet"
                    text="Repair expenses will appear here after you add them."
                  />
                )}

                {monthRepairs.map((repair, index) => {
                  const building = getBuilding(repair.buildingId);

                  return (
                    <div
                      key={repair.id}
                      style={{
                        padding: 18,
                        borderBottom:
                          index < monthRepairs.length - 1
                            ? `1px solid ${COLORS.borderLight}`
                            : "none",
                        display: "flex",
                        gap: 12,
                        alignItems: "center",
                        flexWrap: "wrap"
                      }}
                    >
                      <span
                        style={{
                          background:
                            CATEGORY_COLORS[repair.category] || COLORS.muted,
                          color: "#FFFFFF",
                          borderRadius: 999,
                          padding: "5px 10px",
                          fontSize: 12,
                          fontWeight: 900
                        }}
                      >
                        {repair.category}
                      </span>

                      <div style={{ flex: 1, minWidth: 240 }}>
                        <div style={{ fontWeight: 900 }}>{repair.text}</div>
                        <div
                          style={{
                            color: COLORS.muted,
                            fontSize: 13,
                            marginTop: 4
                          }}
                        >
                          {building?.name} - {building?.currency} -{" "}
                          {getTenantName(repair.tenantId)} - {repair.date}
                        </div>
                        {repair.docs.length > 0 && (
                          <div
                            style={{
                              display: "flex",
                              gap: 8,
                              flexWrap: "wrap",
                              marginTop: 8
                            }}
                          >
                            {repair.docs.map((doc, docIndex) => (
                              <a
                                key={docIndex}
                                href={doc.url}
                                download={doc.name}
                                style={{
                                  color: COLORS.primary,
                                  background: COLORS.primaryLight,
                                  borderRadius: 999,
                                  padding: "5px 10px",
                                  textDecoration: "none",
                                  fontSize: 12,
                                  fontWeight: 800
                                }}
                              >
                                File: {doc.name}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>

                      <strong style={{ color: COLORS.red }}>
                        {formatMoney(repair.amount, repair.buildingId)}
                      </strong>

                      <Badge status={repair.status} />

                      <button
                        onClick={() => toggleRepair(repair.id)}
                        style={buttonStyle(
                          repair.status === "open" ? "green" : "default"
                        )}
                      >
                        {repair.status === "open" ? "Resolve" : "Reopen"}
                      </button>
                    </div>
                  );
                })}
              </Card>
            </>
          )}

          {view === "maintenance" && (
            <>
              <Card>
                <div style={{ fontSize: 17, fontWeight: 900, marginBottom: 14 }}>
                  Add maintenance expense
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.5fr 1.5fr 2fr 1fr",
                    gap: 10
                  }}
                >
                  <select
                    value={maintenanceForm.buildingId}
                    onChange={(event) =>
                      setMaintenanceForm((previous) => ({
                        ...previous,
                        buildingId: event.target.value
                      }))
                    }
                    style={inputStyle}
                  >
                    <option value="">Select property...</option>
                    {buildings.map((building) => (
                      <option key={building.id} value={building.id}>
                        {building.name} - {building.currency}
                      </option>
                    ))}
                  </select>

                  <select
                    value={maintenanceForm.category}
                    onChange={(event) =>
                      setMaintenanceForm((previous) => ({
                        ...previous,
                        category: event.target.value
                      }))
                    }
                    style={inputStyle}
                  >
                    {MAINTENANCE_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>

                  <input
                    value={maintenanceForm.text}
                    onChange={(event) =>
                      setMaintenanceForm((previous) => ({
                        ...previous,
                        text: event.target.value
                      }))
                    }
                    placeholder="Description..."
                    style={inputStyle}
                  />

                  <input
                    type="number"
                    value={maintenanceForm.amount}
                    onChange={(event) =>
                      setMaintenanceForm((previous) => ({
                        ...previous,
                        amount: event.target.value
                      }))
                    }
                    placeholder="Amount"
                    style={inputStyle}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 10,
                    flexWrap: "wrap",
                    marginTop: 12
                  }}
                >
                  <label style={{ ...buttonStyle("blue"), display: "inline-block" }}>
                    Attach document
                    <input
                      type="file"
                      multiple
                      style={{ display: "none" }}
                      onChange={(event) => {
                        const docs = filesToDocs(event.target.files);
                        setMaintenanceForm((previous) => ({
                          ...previous,
                          docs: [...previous.docs, ...docs]
                        }));
                        event.target.value = "";
                      }}
                    />
                  </label>

                  <button onClick={addMaintenance} style={buttonStyle("primary")}>
                    Add maintenance
                  </button>
                </div>

                {maintenanceForm.docs.length > 0 && (
                  <div
                    style={{
                      marginTop: 10,
                      fontSize: 13,
                      color: COLORS.muted
                    }}
                  >
                    Attached:{" "}
                    {maintenanceForm.docs.map((doc) => doc.name).join(", ")}
                  </div>
                )}
              </Card>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
                  gap: 18,
                  marginBottom: 18
                }}
              >
                {Object.entries(maintenanceSummaryByCurrency).map(
                  ([currencyCode, value]) => (
                    <MetricCard
                      key={currencyCode}
                      label={`Maintenance - ${currencyCode}`}
                      value={formatMoneyByCurrency(value, currencyCode)}
                      color={COLORS.red}
                    />
                  )
                )}
                <MetricCard
                  label="Entries this month"
                  value={monthMaintenance.length}
                />
              </div>

              <Card padding={0}>
                {monthMaintenance.length === 0 && (
                  <EmptyState
                    title="No maintenance expenses yet"
                    text="Electricity, water, salary, tanker, and general expenses will appear here."
                  />
                )}

                {monthMaintenance.map((item, index) => {
                  const building = getBuilding(item.buildingId);

                  return (
                    <div
                      key={item.id}
                      style={{
                        padding: 18,
                        borderBottom:
                          index < monthMaintenance.length - 1
                            ? `1px solid ${COLORS.borderLight}`
                            : "none",
                        display: "flex",
                        gap: 12,
                        alignItems: "center",
                        flexWrap: "wrap"
                      }}
                    >
                      <span
                        style={{
                          background: CATEGORY_COLORS[item.category] || COLORS.muted,
                          color: "#FFFFFF",
                          borderRadius: 999,
                          padding: "5px 10px",
                          fontSize: 12,
                          fontWeight: 900
                        }}
                      >
                        {item.category}
                      </span>

                      <div style={{ flex: 1, minWidth: 240 }}>
                        <div style={{ fontWeight: 900 }}>{item.text}</div>
                        <div
                          style={{
                            color: COLORS.muted,
                            fontSize: 13,
                            marginTop: 4
                          }}
                        >
                          {building?.name} - {building?.currency} - {item.date}
                        </div>
                        {item.docs.length > 0 && (
                          <div
                            style={{
                              display: "flex",
                              gap: 8,
                              flexWrap: "wrap",
                              marginTop: 8
                            }}
                          >
                            {item.docs.map((doc, docIndex) => (
                              <a
                                key={docIndex}
                                href={doc.url}
                                download={doc.name}
                                style={{
                                  color: COLORS.primary,
                                  background: COLORS.primaryLight,
                                  borderRadius: 999,
                                  padding: "5px 10px",
                                  textDecoration: "none",
                                  fontSize: 12,
                                  fontWeight: 800
                                }}
                              >
                                File: {doc.name}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>

                      <strong style={{ color: COLORS.red }}>
                        {formatMoney(item.amount, item.buildingId)}
                      </strong>

                      <button
                        onClick={() => removeMaintenance(item.id)}
                        style={buttonStyle("danger")}
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}
              </Card>
            </>
          )}

          {view === "documents" && (
            <>
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 22, fontWeight: 950 }}>
                  Property documents
                </div>
                <div
                  style={{
                    color: COLORS.muted,
                    fontSize: 14,
                    marginTop: 5
                  }}
                >
                  Store lease agreements, insurance files, permits, and other
                  property records.
                </div>
              </div>

              {buildings.map((building, index) => {
                const docs = propertyDocs[building.id] || [];
                const color = PROPERTY_COLORS[index % PROPERTY_COLORS.length];

                return (
                  <Card key={building.id}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 14,
                        flexWrap: "wrap",
                        alignItems: "center"
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: 14,
                          alignItems: "center"
                        }}
                      >
                        <div
                          style={{
                            width: 46,
                            height: 46,
                            borderRadius: 16,
                            background: color,
                            color: "#FFFFFF",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 950
                          }}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <div style={{ fontSize: 16, fontWeight: 900 }}>
                            Property {index + 1}: {building.name}
                          </div>
                          <div
                            style={{
                              fontSize: 13,
                              color: COLORS.muted,
                              marginTop: 3
                            }}
                          >
                            {building.address}
                          </div>
                          <div
                            style={{
                              color: COLORS.faint,
                              fontSize: 12,
                              marginTop: 3
                            }}
                          >
                            {building.country || "India"} - {building.currency}
                          </div>
                        </div>
                      </div>

                      <label
                        style={{
                          ...buttonStyle("primary"),
                          display: "inline-block"
                        }}
                      >
                        Upload files
                        <input
                          type="file"
                          multiple
                          style={{ display: "none" }}
                          onChange={(event) => {
                            uploadDocs(
                              setPropertyDocs,
                              building.id,
                              event.target.files
                            );
                            event.target.value = "";
                          }}
                        />
                      </label>
                    </div>

                    <div style={{ marginTop: 18 }}>
                      {docs.length === 0 ? (
                        <EmptyState
                          title="No documents uploaded"
                          text="Upload property files to keep them organized here."
                          compact
                        />
                      ) : (
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fill, minmax(230px, 1fr))",
                            gap: 12
                          }}
                        >
                          {docs.map((doc, docIndex) => (
                            <div
                              key={docIndex}
                              style={{
                                background: COLORS.page,
                                borderRadius: 16,
                                padding: 14,
                                display: "flex",
                                gap: 12,
                                alignItems: "center"
                              }}
                            >
                              <div
                                style={{
                                  fontSize: 12,
                                  fontWeight: 900,
                                  color: COLORS.primary
                                }}
                              >
                                FILE
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <a
                                  href={doc.url}
                                  download={doc.name}
                                  style={{
                                    display: "block",
                                    color: COLORS.primary,
                                    textDecoration: "none",
                                    fontSize: 13,
                                    fontWeight: 900,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap"
                                  }}
                                >
                                  {doc.name}
                                </a>
                                <div
                                  style={{
                                    color: COLORS.faint,
                                    fontSize: 11
                                  }}
                                >
                                  {doc.date}
                                </div>
                              </div>
                              <button
                                onClick={() =>
                                  removeDoc(setPropertyDocs, building.id, docIndex)
                                }
                                style={buttonStyle("danger")}
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </>
          )}
        </section>
      </main>
    </div>
  );
}

function TenantModal({
  tenant,
  buildings,
  tenantDocs,
  getBuildingCurrency,
  formatMoney,
  selectedMonth,
  selectedYear,
  setTenants,
  setPayment,
  uploadDocs,
  removeDoc,
  onClose
}) {
  const [form, setForm] = useState({ ...tenant });
  const [partialAmount, setPartialAmount] = useState("");
  const [partialDate, setPartialDate] = useState(
    today.toISOString().slice(0, 10)
  );
  const fileRef = useRef(null);
  const currency = getBuildingCurrency(form.buildingId);

  function updateField(field, value) {
    setForm((previous) => ({
      ...previous,
      [field]: value
    }));
  }

  function saveTenant() {
    setTenants((previous) =>
      previous.map((item) =>
        item.id === form.id
          ? {
              ...item,
              ...form,
              rent: Number(form.rent) || 0,
              buildingId: Number(form.buildingId)
            }
          : item
      )
    );
    onClose();
  }

  return (
    <Modal title={`Edit tenant - Unit ${tenant.unit}`} onClose={onClose}>
      <Field
        label="Name"
        value={form.name}
        onChange={(value) => updateField("name", value)}
      />
      <Field
        label="Phone"
        value={form.phone}
        onChange={(value) => updateField("phone", value)}
      />
      <Field
        label="Email"
        type="email"
        value={form.email}
        onChange={(value) => updateField("email", value)}
      />
      <Field
        label={`Monthly rent (${currency.symbol})`}
        type="number"
        value={form.rent}
        onChange={(value) => updateField("rent", value)}
      />
      <Field
        label="Lease end"
        type="date"
        value={form.leaseEnd}
        onChange={(value) => updateField("leaseEnd", value)}
      />

      <SelectField
        label="Building"
        value={form.buildingId}
        onChange={(value) => updateField("buildingId", Number(value))}
      >
        {buildings.map((building, index) => (
          <option key={building.id} value={building.id}>
            Property {index + 1}: {building.name} - {building.currency}
          </option>
        ))}
      </SelectField>

      <div
        style={{
          marginTop: 18,
          paddingTop: 18,
          borderTop: `1px solid ${COLORS.borderLight}`
        }}
      >
        <div style={{ fontWeight: 900, marginBottom: 10 }}>
          Payment - {MONTHS[selectedMonth]} {selectedYear}
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: 10
          }}
        >
          <button
            onClick={() => {
              setPayment(form.id, "paid");
              onClose();
            }}
            style={buttonStyle("green")}
          >
            Mark paid
          </button>

          <button
            onClick={() => {
              setPayment(form.id, "unpaid");
              onClose();
            }}
            style={buttonStyle("danger")}
          >
            Mark unpaid
          </button>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input
            type="number"
            value={partialAmount}
            onChange={(event) => setPartialAmount(event.target.value)}
            placeholder={`Partial amount ${currency.symbol}`}
            style={{ ...inputStyle, width: 170 }}
          />

          <input
            type="date"
            value={partialDate}
            onChange={(event) => setPartialDate(event.target.value)}
            style={{ ...inputStyle, width: 160 }}
          />

          <button
            onClick={() => {
              if (!partialAmount) return;
              setPayment(form.id, "partial", partialAmount, partialDate);
              onClose();
            }}
            style={buttonStyle()}
          >
            Save partial
          </button>
        </div>
      </div>

      <div
        style={{
          marginTop: 18,
          paddingTop: 18,
          borderTop: `1px solid ${COLORS.borderLight}`
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10
          }}
        >
          <div style={{ fontWeight: 900 }}>Documents</div>
          <button onClick={() => fileRef.current.click()} style={buttonStyle()}>
            Upload
          </button>
        </div>

        <input
          ref={fileRef}
          type="file"
          multiple
          style={{ display: "none" }}
          onChange={(event) => {
            uploadDocs(event.target.files);
            event.target.value = "";
          }}
        />

        {tenantDocs.length === 0 ? (
          <EmptyState
            title="No documents"
            text="Upload tenant documents here."
            compact
          />
        ) : (
          tenantDocs.map((doc, index) => (
            <div
              key={index}
              style={{
                background: COLORS.page,
                borderRadius: 14,
                padding: 12,
                marginBottom: 8,
                display: "flex",
                justifyContent: "space-between",
                gap: 10,
                alignItems: "center"
              }}
            >
              <a
                href={doc.url}
                download={doc.name}
                style={{
                  color: COLORS.primary,
                  textDecoration: "none",
                  fontWeight: 900,
                  fontSize: 13
                }}
              >
                File: {doc.name}
              </a>
              <button
                onClick={() => removeDoc(index)}
                style={buttonStyle("danger")}
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 10,
          marginTop: 22
        }}
      >
        <div style={{ color: COLORS.muted, fontSize: 13 }}>
          Current rent: <strong>{formatMoney(form.rent, form.buildingId)}</strong>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={buttonStyle()}>
            Cancel
          </button>
          <button onClick={saveTenant} style={buttonStyle("primary")}>
            Save changes
          </button>
        </div>
      </div>
    </Modal>
  );
}

function BuildingModal({ building, buildings, setBuildings, onClose }) {
  const isNew = !building;
  const [form, setForm] = useState(
    building || {
      name: "",
      address: "",
      country: "India",
      currency: "INR"
    }
  );

  function updateField(field, value) {
    setForm((previous) => ({
      ...previous,
      [field]: value
    }));
  }

  function save() {
    if (!form.name.trim() || !form.address.trim()) {
      alert("Please enter building name and address.");
      return;
    }

    if (isNew) {
      const id = Math.max(0, ...buildings.map((item) => item.id)) + 1;
      setBuildings((previous) => [
        ...previous,
        {
          id,
          name: form.name.trim(),
          address: form.address.trim(),
          country: form.country || "India",
          currency: form.currency || "INR"
        }
      ]);
    } else {
      setBuildings((previous) =>
        previous.map((item) =>
          item.id === form.id
            ? {
                ...item,
                name: form.name.trim(),
                address: form.address.trim(),
                country: form.country || "India",
                currency: form.currency || "INR"
              }
            : item
        )
      );
    }

    onClose();
  }

  function remove() {
    if (!window.confirm("Delete this building?")) return;
    setBuildings((previous) => previous.filter((item) => item.id !== form.id));
    onClose();
  }

  return (
    <Modal title={isNew ? "Add building" : "Edit building"} onClose={onClose}>
      <Field
        label="Building name"
        value={form.name}
        onChange={(value) => updateField("name", value)}
      />
      <Field
        label="Address"
        value={form.address}
        onChange={(value) => updateField("address", value)}
      />

      <SelectField
        label="Country"
        value={form.country || "India"}
        onChange={(value) => {
          const selected = COUNTRY_OPTIONS.find(
            (item) => item.country === value
          );

          setForm((previous) => ({
            ...previous,
            country: value,
            currency: selected ? selected.currency : previous.currency
          }));
        }}
      >
        {COUNTRY_OPTIONS.map((item) => (
          <option key={item.country} value={item.country}>
            {item.country}
          </option>
        ))}
      </SelectField>

      <SelectField
        label="Currency"
        value={form.currency || "INR"}
        onChange={(value) => updateField("currency", value)}
      >
        {CURRENCIES.map((currency) => (
          <option key={currency.code} value={currency.code}>
            {currency.label}
          </option>
        ))}
      </SelectField>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 10,
          marginTop: 20
        }}
      >
        <div>
          {!isNew && (
            <button onClick={remove} style={buttonStyle("danger")}>
              Delete
            </button>
          )}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={buttonStyle()}>
            Cancel
          </button>
          <button onClick={save} style={buttonStyle("primary")}>
            {isNew ? "Add building" : "Save changes"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("manne_auth") || "null");
      return saved ? saved.user : null;
    } catch {
      return null;
    }
  });

  function logout() {
    localStorage.removeItem("manne_auth");
    setCurrentUser(null);
  }

  if (!currentUser) {
    return <LoginScreen onLogin={setCurrentUser} />;
  }

  return <Dashboard currentUser={currentUser} onLogout={logout} />;
}