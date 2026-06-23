import { useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// ====== CLOUD SYNC CONFIG ======
// Create a free project at https://supabase.com, then:
//   Project Settings -> API -> copy "Project URL" and the "anon public" key.
// The anon key is safe to expose in frontend code.
const SUPABASE_URL = "https://teswckonlxvpeyenbjdq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3dja29ubHh2cGV5ZW5iamRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxNDIzNjMsImV4cCI6MjA5NzcxODM2M30.lwKEXeX437oR7hTYCR9yxDOylGt3omdt0FrxNLlf8XY";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
// ================================

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
  "#4F46E5", "#059669", "#0891B2", "#9333EA",
  "#DC2626", "#D97706", "#DB2777", "#0D9488"
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
  "Plumbing", "Electrician", "Security", "BBMP", "BESCOM", "BWSSB", "Other"
];

const MAINTENANCE_CATEGORIES = [
  "Electricity bill", "Water bill", "Regular repair", "Salary", "Water tanker", "General"
];

const RECURRING_CATEGORIES = [
  "HOA",
  "Loan payment",
  "Salary",
  "Property tax",
  "Insurance",
  "Pest control - Azura",
  "Warranty - AHS",
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
  General: "#6B7280",
  HOA: "#4F46E5",
  "Loan payment": "#DC2626",
  "Property tax": "#9333EA",
  Insurance: "#0891B2",
  "Pest control - Azura": "#D97706",
  "Warranty - AHS": "#0D9488"
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

function monthIndex(month, year) {
  return year * 12 + month;
}

function numberToWords(num) {
  num = Math.round(Number(num) || 0);
  if (num === 0) return "Zero";

  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight",
    "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
    "Sixteen", "Seventeen", "Eighteen", "Nineteen"
  ];
  const tens = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy",
    "Eighty", "Ninety"
  ];

  function twoDigits(n) {
    if (n < 20) return ones[n];
    return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
  }

  function threeDigits(n) {
    const hundred = Math.floor(n / 100);
    const rest = n % 100;
    let out = "";
    if (hundred) out += ones[hundred] + " Hundred";
    if (hundred && rest) out += " ";
    if (rest) out += twoDigits(rest);
    return out;
  }

  let words = "";
  const crore = Math.floor(num / 10000000);
  num %= 10000000;
  const lakh = Math.floor(num / 100000);
  num %= 100000;
  const thousand = Math.floor(num / 1000);
  num %= 1000;
  const hundred = num;

  if (crore) words += threeDigits(crore) + " Crore ";
  if (lakh) words += threeDigits(lakh) + " Lakh ";
  if (thousand) words += threeDigits(thousand) + " Thousand ";
  if (hundred) words += threeDigits(hundred);

  return words.trim();
}

function getCurrency(code) {
  return CURRENCIES.find((currency) => currency.code === code) || CURRENCIES[0];
}

function formatMoneyByCurrency(value, currencyCode) {
  const amount = Number(value) || 0;
  const currency = getCurrency(currencyCode);
  const sign = amount < 0 ? "-" : "";
  return `${sign}${currency.symbol}${Math.abs(amount).toLocaleString(undefined, {
    maximumFractionDigits: 2
  })}`;
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

function useStoredState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Wait for the first Supabase read before pushing, so local default/demo
  // data never overwrites real cloud data on startup.
  const [loaded, setLoaded] = useState(false);

  // Last value we synced (sent OR received) - stops our own writes from
  // echoing back through the real-time channel and looping.
  const lastSyncedRef = useRef(null);

  // 1) Pull the latest value from Supabase once on mount.
  useEffect(() => {
    let active = true;
    supabase
      .from("app_state")
      .select("value")
      .eq("key", key)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!active) return;
        if (!error && data && data.value != null) {
          lastSyncedRef.current = JSON.stringify(data.value);
          setValue(data.value);
        }
        setLoaded(true);
      });
    return () => {
      active = false;
    };
  }, [key]);

  // 2) Live updates: apply changes other users make to this key.
  useEffect(() => {
    const channel = supabase
      .channel("app_state:" + key)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "app_state", filter: "key=eq." + key },
        (payload) => {
          const next = payload.new && payload.new.value;
          if (next == null) return;
          const serialized = JSON.stringify(next);
          if (serialized === lastSyncedRef.current) return;
          lastSyncedRef.current = serialized;
          try {
            localStorage.setItem(key, serialized);
          } catch {
            // Ignore storage errors.
          }
          setValue(next);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [key]);

  // 3) Save local changes to localStorage (instant) and Supabase (permanent).
  useEffect(() => {
    if (!loaded) return;
    const serialized = JSON.stringify(value);
    try {
      localStorage.setItem(key, serialized);
    } catch {
      // Ignore storage errors.
    }
    if (serialized === lastSyncedRef.current) return;
    lastSyncedRef.current = serialized;
    supabase
      .from("app_state")
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" })
      .then(() => {});
  }, [key, value, loaded]);

  return [value, setValue];
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
    return { ...base, color: "#FFFFFF", background: COLORS.green };
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
    resolved: { label: "Resolved", color: COLORS.green, bg: COLORS.greenLight },
    monthly: { label: "Monthly", color: COLORS.green, bg: COLORS.greenLight },
    yearly: { label: "Yearly", color: COLORS.blue, bg: COLORS.blueLight },
    inactive: { label: "Inactive", color: COLORS.red, bg: COLORS.redLight },
    vacant: { label: "Vacant", color: COLORS.muted, bg: COLORS.borderLight }
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
          width: 580,
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
  const [tenants, setTenants] = useStoredState("manne_tenants_v2", generateTenants());
  const [payments, setPayments] = useStoredState("manne_payments_v2", {});
  const [repairs, setRepairs] = useStoredState("manne_repairs_v2", {});
  const [maintenance, setMaintenance] = useStoredState("manne_maintenance_v2", {});
  const [recurring, setRecurring] = useStoredState("manne_recurring_v1", []);
  const [buildings, setBuildings] = useStoredState("manne_buildings_v2", INITIAL_BUILDINGS);

  const [propertyDocs, setPropertyDocs] = useState({});
  const [tenantDocs, setTenantDocs] = useState({});
  const [view, setView] = useState("dashboard");
  const [selectedMonth, setSelectedMonth] = useState(CURRENT_MONTH);
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [yearlyReportYear, setYearlyReportYear] = useState(CURRENT_YEAR);
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

  const [recurringForm, setRecurringForm] = useState({
    buildingId: "",
    category: "HOA",
    text: "",
    amount: "",
    frequency: "monthly",
    startMonth: CURRENT_MONTH,
    startYear: CURRENT_YEAR,
    coverageMonths: 12,
    endMonth: "",
    endYear: "",
    active: true,
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

  function getPayment(tenantId, month = selectedMonth, year = selectedYear) {
    const key = makeMonthKey(month, year);
    return payments[key]?.[tenantId] || {
      status: "unpaid",
      amount: 0,
      date: ""
    };
  }

  function setPayment(tenantId, status, amount, date) {
    const tenant = tenants.find((item) => item.id === tenantId);
    if (!tenant) return;

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
      [id]: (previous[id] || []).filter((_, currentIndex) => currentIndex !== index)
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
          ? { ...repair, status: repair.status === "open" ? "resolved" : "open" }
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

  function addRecurring() {
    if (!recurringForm.buildingId || !recurringForm.text.trim()) return;

    const amount = Number(recurringForm.amount) || 0;
    if (amount <= 0) {
      alert("Please enter an amount.");
      return;
    }

    const newItem = {
      id: Date.now(),
      buildingId: Number(recurringForm.buildingId),
      category: recurringForm.category,
      text: recurringForm.text.trim(),
      amount,
      frequency: recurringForm.frequency,
      startMonth: Number(recurringForm.startMonth),
      startYear: Number(recurringForm.startYear),
      coverageMonths: Number(recurringForm.coverageMonths) || 12,
      endMonth: recurringForm.endMonth === "" ? "" : Number(recurringForm.endMonth),
      endYear: recurringForm.endYear === "" ? "" : Number(recurringForm.endYear),
      active: true,
      docs: recurringForm.docs
    };

    setRecurring((previous) => [...previous, newItem]);

    setRecurringForm({
      buildingId: "",
      category: "HOA",
      text: "",
      amount: "",
      frequency: "monthly",
      startMonth: CURRENT_MONTH,
      startYear: CURRENT_YEAR,
      coverageMonths: 12,
      endMonth: "",
      endYear: "",
      active: true,
      docs: []
    });
  }

  function removeRecurring(id) {
    if (!window.confirm("Remove this recurring expense?")) return;
    setRecurring((previous) => previous.filter((item) => item.id !== id));
  }

  function toggleRecurring(id) {
    setRecurring((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, active: !item.active } : item
      )
    );
  }

  function recurringMonthlyAmount(item, month, year) {
    if (!item.active) return 0;

    const currentIndex = monthIndex(month, year);
    const startIndex = monthIndex(Number(item.startMonth), Number(item.startYear));

    if (item.frequency === "monthly") {
      if (currentIndex < startIndex) return 0;

      if (item.endMonth !== "" && item.endYear !== "") {
        const endIndex = monthIndex(Number(item.endMonth), Number(item.endYear));
        if (currentIndex > endIndex) return 0;
      }

      return Number(item.amount) || 0;
    }

    const coverageMonths = Number(item.coverageMonths) || 12;
    const finalIndex = startIndex + coverageMonths - 1;

    if (currentIndex < startIndex || currentIndex > finalIndex) return 0;

    return (Number(item.amount) || 0) / coverageMonths;
  }

  function getRecurringExpense(buildingId, month = selectedMonth, year = selectedYear) {
    return recurring
      .filter((item) => item.buildingId === Number(buildingId))
      .reduce((sum, item) => sum + recurringMonthlyAmount(item, month, year), 0);
  }

  function getTenantName(tenantId) {
    if (!tenantId) return "No tenant selected";
    const tenant = tenants.find((item) => item.id === Number(tenantId));
    return tenant ? `Unit ${tenant.unit} - ${tenant.name}` : "Tenant not found";
  }

  function getPropertyExpense(buildingId, month = selectedMonth, year = selectedYear) {
    const key = makeMonthKey(month, year);
    const repairExpense = (repairs[key] || [])
      .filter((repair) => repair.buildingId === Number(buildingId))
      .reduce((sum, repair) => sum + Number(repair.amount || 0), 0);

    const maintenanceExpense = (maintenance[key] || [])
      .filter((item) => item.buildingId === Number(buildingId))
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);

    const recurringExpense = getRecurringExpense(buildingId, month, year);

    return repairExpense + maintenanceExpense + recurringExpense;
  }

  function getCurrencySummary(currencyCode, month = selectedMonth, year = selectedYear) {
    const key = makeMonthKey(month, year);

    const currencyBuildings = buildings.filter(
      (building) => building.currency === currencyCode
    );

    const currencyBuildingIds = currencyBuildings.map((building) => building.id);

    const currencyTenants = tenants.filter((tenant) =>
      currencyBuildingIds.includes(tenant.buildingId)
    );

    const occupiedTenants = currencyTenants.filter((tenant) => !tenant.vacant);
    const vacantUnits = currencyTenants.length - occupiedTenants.length;

    const expected = occupiedTenants.reduce(
      (sum, tenant) => sum + Number(tenant.rent || 0),
      0
    );

    const collected = occupiedTenants.reduce((sum, tenant) => {
      const payment = getPayment(tenant.id, month, year);

      if (payment.status === "paid") {
        return sum + Number(tenant.rent || 0);
      }

      if (payment.status === "partial") {
        return sum + Number(payment.amount || 0);
      }

      return sum;
    }, 0);

    const repairExpense = (repairs[key] || [])
      .filter((repair) => currencyBuildingIds.includes(repair.buildingId))
      .reduce((sum, repair) => sum + Number(repair.amount || 0), 0);

    const maintenanceExpense = (maintenance[key] || [])
      .filter((item) => currencyBuildingIds.includes(item.buildingId))
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);

    const recurringExpense = recurring
      .filter((item) => currencyBuildingIds.includes(item.buildingId))
      .reduce((sum, item) => sum + recurringMonthlyAmount(item, month, year), 0);

    const expenses = repairExpense + maintenanceExpense + recurringExpense;
    const net = collected - expenses;
    const progress = expected > 0 ? Math.round((collected / expected) * 100) : 0;

    return {
      currencyCode,
      buildings: currencyBuildings,
      units: currencyTenants.length,
      occupiedUnits: occupiedTenants.length,
      vacantUnits,
      expected,
      collected,
      repairExpense,
      maintenanceExpense,
      recurringExpense,
      expenses,
      net,
      progress
    };
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
        tenant.vacant ? "VACANT" : tenant.name,
        tenant.vacant ? 0 : tenant.rent,
        building?.currency || "",
        tenant.vacant ? "vacant" : payment.status,
        tenant.vacant ? "" : payment.amount || "",
        tenant.vacant ? "" : payment.date,
        tenant.vacant ? "" : tenant.leaseEnd
      ]);
    });

    const csv = rows.map((row) => row.join(",")).join("\n");
    const link = document.createElement("a");
    link.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
    link.download = `rent_${monthKey}.csv`;
    link.click();
  }

  const filteredTenants = tenants.filter((tenant) => {
    const payment = getPayment(tenant.id);
    const query = search.toLowerCase();

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "vacant"
        ? !!tenant.vacant
        : !tenant.vacant && payment.status === statusFilter;

    return (
      matchesStatus &&
      (buildingFilter === 0 || tenant.buildingId === buildingFilter) &&
      ((tenant.name || "").toLowerCase().includes(query) ||
        String(tenant.unit).toLowerCase().includes(query))
    );
  });

  const occupiedTenants = tenants.filter((tenant) => !tenant.vacant);

  const paidCount = occupiedTenants.filter(
    (tenant) => getPayment(tenant.id).status === "paid"
  ).length;

  const partialCount = occupiedTenants.filter(
    (tenant) => getPayment(tenant.id).status === "partial"
  ).length;

  const unpaidCount = occupiedTenants.filter(
    (tenant) => getPayment(tenant.id).status === "unpaid"
  ).length;

  const vacantCount = tenants.filter((tenant) => tenant.vacant).length;

  const collectionProgress =
    occupiedTenants.length > 0
      ? Math.round(
          ((paidCount + partialCount * 0.5) / occupiedTenants.length) * 100
        )
      : 0;

  const currencyCodes = Array.from(new Set(buildings.map((building) => building.currency)));

  const currencySummaries = currencyCodes
    .map((currencyCode) => getCurrencySummary(currencyCode))
    .filter((summary) => summary.buildings.length > 0);

  const repairSummaryByCurrency = currencySummaries.reduce((map, summary) => {
    map[summary.currencyCode] = summary.repairExpense;
    return map;
  }, {});

  const maintenanceSummaryByCurrency = currencySummaries.reduce((map, summary) => {
    map[summary.currencyCode] = summary.maintenanceExpense;
    return map;
  }, {});

  const recurringSummaryByCurrency = currencySummaries.reduce((map, summary) => {
    map[summary.currencyCode] = summary.recurringExpense;
    return map;
  }, {});

  const openRepairs = monthRepairs.filter((repair) => repair.status === "open");
  const resolvedRepairs = monthRepairs.filter(
    (repair) => repair.status === "resolved"
  );

  const expiringLeases = tenants.filter((tenant) => {
    if (tenant.vacant) return false;
    const days = (new Date(tenant.leaseEnd) - today) / 86400000;
    return days >= 0 && days <= 60;
  });

  const navItems = [
    ["dashboard", "Dashboard"],
    ["tenants", "Tenants"],
    ["repairs", "Repairs"],
    ["maintenance", "Maintenance"],
    ["recurring", "Recurring"],
    ["lease", "Lease Generator"],
    ["yearly", "Yearly Report"],
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

      {modal?.type === "addTenant" && (
        <AddTenantModal
          building={modal.building}
          buildings={buildings}
          tenants={tenants}
          setTenants={setTenants}
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
              {tenants.length} units - {buildings.length} buildings
              {view !== "yearly" && ` - ${MONTHS[selectedMonth]} ${selectedYear}`}
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {view === "yearly" ? (
              <select
                value={yearlyReportYear}
                onChange={(event) => setYearlyReportYear(Number(event.target.value))}
                style={{ ...inputStyle, width: 130 }}
              >
                {[CURRENT_YEAR - 2, CURRENT_YEAR - 1, CURRENT_YEAR, CURRENT_YEAR + 1, CURRENT_YEAR + 2].map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            ) : (
              <>
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
                  {[CURRENT_YEAR - 2, CURRENT_YEAR - 1, CURRENT_YEAR, CURRENT_YEAR + 1, CURRENT_YEAR + 2].map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </>
            )}

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
                        {summary.buildings.length} properties - {summary.currencyCode}
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
                      value={formatMoneyByCurrency(summary.expected, summary.currencyCode)}
                    />

                    <MetricCard
                      label="Collected rent"
                      value={formatMoneyByCurrency(summary.collected, summary.currencyCode)}
                      color={COLORS.green}
                    />

                    <MetricCard
                      label="Total expenses"
                      value={formatMoneyByCurrency(summary.expenses, summary.currencyCode)}
                      color={COLORS.red}
                      subText={`Repairs ${formatMoneyByCurrency(summary.repairExpense, summary.currencyCode)} - Maintenance ${formatMoneyByCurrency(summary.maintenanceExpense, summary.currencyCode)} - Recurring ${formatMoneyByCurrency(summary.recurringExpense, summary.currencyCode)}`}
                    />

                    <MetricCard
                      label="Net gain"
                      value={formatMoneyByCurrency(summary.net, summary.currencyCode)}
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
                      {paidCount} paid - {partialCount} partial - {unpaidCount}{" "}
                      unpaid - {vacantCount} vacant
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
                    flexWrap: "wrap",
                    gap: 10,
                    marginBottom: vacantCount > 0 ? 14 : 0
                  }}
                >
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 900 }}>
                      Vacant units
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: COLORS.muted,
                        marginTop: 4
                      }}
                    >
                      Units with no tenant assigned
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 28,
                      fontWeight: 950,
                      color: vacantCount > 0 ? COLORS.amber : COLORS.green
                    }}
                  >
                    {vacantCount}
                  </div>
                </div>

                {vacantCount > 0 && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 8
                    }}
                  >
                    {tenants
                      .filter((tenant) => tenant.vacant)
                      .map((tenant) => {
                        const building = getBuilding(tenant.buildingId);
                        return (
                          <button
                            key={tenant.id}
                            onClick={() => {
                              setView("tenants");
                              setModal({ type: "tenant", tenant });
                            }}
                            style={{
                              border: `1px solid ${COLORS.border}`,
                              background: COLORS.page,
                              borderRadius: 12,
                              padding: "8px 12px",
                              fontSize: 13,
                              fontWeight: 800,
                              color: COLORS.text,
                              cursor: "pointer"
                            }}
                          >
                            Unit {tenant.unit}
                            <span
                              style={{
                                color: COLORS.muted,
                                fontWeight: 600,
                                marginLeft: 6
                              }}
                            >
                              {building?.name || ""}
                            </span>
                          </button>
                        );
                      })}
                  </div>
                )}
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
                    (tenant) => tenant.buildingId === building.id && !tenant.vacant
                  );

                  const vacantInBuilding = tenants.filter(
                    (tenant) => tenant.buildingId === building.id && tenant.vacant
                  ).length;

                  const expected = buildingTenants.reduce(
                    (sum, tenant) => sum + Number(tenant.rent || 0),
                    0
                  );

                  const collected = buildingTenants.reduce((sum, tenant) => {
                    const payment = getPayment(tenant.id);
                    if (payment.status === "paid") return sum + Number(tenant.rent || 0);
                    if (payment.status === "partial") return sum + Number(payment.amount || 0);
                    return sum;
                  }, 0);

                  const recurringExpense = getRecurringExpense(building.id);
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
                              {vacantInBuilding > 0 && (
                                <span
                                  style={{
                                    background: COLORS.borderLight,
                                    color: COLORS.muted,
                                    borderRadius: 999,
                                    padding: "4px 9px",
                                    fontSize: 11,
                                    fontWeight: 900
                                  }}
                                >
                                  {vacantInBuilding} vacant
                                </span>
                              )}
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
                          Recurring:{" "}
                          <strong style={{ color: COLORS.amber }}>
                            {formatMoney(recurringExpense, building.id)}
                          </strong>
                        </span>
                        <span>
                          Total expenses:{" "}
                          <strong style={{ color: COLORS.red }}>
                            {formatMoney(expenses, building.id)}
                          </strong>
                        </span>
                        <span>
                          Net:{" "}
                          <strong style={{ color: net >= 0 ? COLORS.green : COLORS.red }}>
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
                    <option value="vacant">Vacant</option>
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

                  const allTenantsInBuilding = tenants.filter(
                    (tenant) => tenant.buildingId === building.id
                  );

                  const occupiedInBuilding = allTenantsInBuilding.filter(
                    (tenant) => !tenant.vacant
                  );

                  const propertyVacant = allTenantsInBuilding.filter(
                    (tenant) => tenant.vacant
                  ).length;

                  const expected = occupiedInBuilding.reduce(
                    (sum, tenant) => sum + Number(tenant.rent || 0),
                    0
                  );

                  const collected = occupiedInBuilding.reduce((sum, tenant) => {
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

                  const propertyPaid = occupiedInBuilding.filter(
                    (tenant) => getPayment(tenant.id).status === "paid"
                  ).length;

                  const propertyPartial = occupiedInBuilding.filter(
                    (tenant) => getPayment(tenant.id).status === "partial"
                  ).length;

                  const propertyUnpaid = occupiedInBuilding.filter(
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
                                  {occupiedInBuilding.length} occupied
                                </span>

                                {propertyVacant > 0 && (
                                  <span
                                    style={{
                                      background: COLORS.borderLight,
                                      color: COLORS.muted,
                                      borderRadius: 999,
                                      padding: "4px 9px",
                                      fontSize: 11,
                                      fontWeight: 900
                                    }}
                                  >
                                    {propertyVacant} vacant
                                  </span>
                                )}
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

                            <button
                              onClick={() =>
                                setModal({ type: "addTenant", building })
                              }
                              style={{
                                ...buttonStyle("primary"),
                                width: "100%",
                                marginTop: 12
                              }}
                            >
                              Add tenant
                            </button>
                          </div>
                        </div>
                      </div>

                      <div>
                        {buildingTenants.length === 0 && (
                          <EmptyState
                            title="No tenants shown"
                            text="No tenants match the current filter for this property."
                            compact
                          />
                        )}

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
                                    marginTop: 3,
                                    color: tenant.vacant ? COLORS.muted : COLORS.text
                                  }}
                                >
                                  {tenant.vacant ? "Vacant" : tenant.name}
                                </div>

                                <div
                                  style={{
                                    color: COLORS.muted,
                                    fontSize: 13,
                                    marginTop: 2
                                  }}
                                >
                                  {tenant.vacant
                                    ? "No tenant"
                                    : `${formatMoney(tenant.rent, tenant.buildingId)}/mo`}
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
                                {tenant.vacant ? (
                                  <div>Unoccupied unit - available to rent</div>
                                ) : (
                                  <>
                                    <div>{tenant.email}</div>
                                    <div>{tenant.phone}</div>
                                    <div>Lease ends {tenant.leaseEnd}</div>
                                  </>
                                )}
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
                                {tenant.vacant ? (
                                  <Badge status="vacant" />
                                ) : (
                                  <>
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
                                  </>
                                )}

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

          {view === "lease" && (
            <LeaseGenerator
              tenants={tenants}
              buildings={buildings}
            />
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

          {view === "recurring" && (
            <>
              <Card>
                <div style={{ fontSize: 17, fontWeight: 900, marginBottom: 14 }}>
                  Add recurring expense
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.4fr 1.3fr 1.5fr 1fr",
                    gap: 10
                  }}
                >
                  <select
                    value={recurringForm.buildingId}
                    onChange={(event) =>
                      setRecurringForm((previous) => ({
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
                    value={recurringForm.category}
                    onChange={(event) =>
                      setRecurringForm((previous) => ({
                        ...previous,
                        category: event.target.value
                      }))
                    }
                    style={inputStyle}
                  >
                    {RECURRING_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>

                  <input
                    value={recurringForm.text}
                    onChange={(event) =>
                      setRecurringForm((previous) => ({
                        ...previous,
                        text: event.target.value
                      }))
                    }
                    placeholder="Description..."
                    style={inputStyle}
                  />

                  <input
                    type="number"
                    value={recurringForm.amount}
                    onChange={(event) =>
                      setRecurringForm((previous) => ({
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
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr 1fr",
                    gap: 10,
                    marginTop: 12
                  }}
                >
                  <select
                    value={recurringForm.frequency}
                    onChange={(event) =>
                      setRecurringForm((previous) => ({
                        ...previous,
                        frequency: event.target.value
                      }))
                    }
                    style={inputStyle}
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly spread by coverage months</option>
                  </select>

                  <select
                    value={recurringForm.startMonth}
                    onChange={(event) =>
                      setRecurringForm((previous) => ({
                        ...previous,
                        startMonth: Number(event.target.value)
                      }))
                    }
                    style={inputStyle}
                  >
                    {MONTHS.map((month, index) => (
                      <option key={month} value={index}>
                        Start {month}
                      </option>
                    ))}
                  </select>

                  <select
                    value={recurringForm.startYear}
                    onChange={(event) =>
                      setRecurringForm((previous) => ({
                        ...previous,
                        startYear: Number(event.target.value)
                      }))
                    }
                    style={inputStyle}
                  >
                    {[CURRENT_YEAR - 2, CURRENT_YEAR - 1, CURRENT_YEAR, CURRENT_YEAR + 1, CURRENT_YEAR + 2].map((year) => (
                      <option key={year} value={year}>
                        Start {year}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    min="1"
                    value={recurringForm.coverageMonths}
                    onChange={(event) =>
                      setRecurringForm((previous) => ({
                        ...previous,
                        coverageMonths: event.target.value
                      }))
                    }
                    placeholder="Coverage months"
                    style={inputStyle}
                  />
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 10,
                    marginTop: 12
                  }}
                >
                  <select
                    value={recurringForm.endMonth}
                    onChange={(event) =>
                      setRecurringForm((previous) => ({
                        ...previous,
                        endMonth: event.target.value
                      }))
                    }
                    style={inputStyle}
                  >
                    <option value="">No end month for monthly expenses</option>
                    {MONTHS.map((month, index) => (
                      <option key={month} value={index}>
                        End {month}
                      </option>
                    ))}
                  </select>

                  <select
                    value={recurringForm.endYear}
                    onChange={(event) =>
                      setRecurringForm((previous) => ({
                        ...previous,
                        endYear: event.target.value
                      }))
                    }
                    style={inputStyle}
                  >
                    <option value="">No end year for monthly expenses</option>
                    {[CURRENT_YEAR - 2, CURRENT_YEAR - 1, CURRENT_YEAR, CURRENT_YEAR + 1, CURRENT_YEAR + 2].map((year) => (
                      <option key={year} value={year}>
                        End {year}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ color: COLORS.muted, fontSize: 13, marginTop: 10 }}>
                  Tip: For yearly insurance/tax, enter the full yearly amount and set coverage months to 12. Example: $2,400 starting February 2026 with 12 coverage months becomes $200 per month from February 2026 through January 2027.
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
                        setRecurringForm((previous) => ({
                          ...previous,
                          docs: [...previous.docs, ...docs]
                        }));
                        event.target.value = "";
                      }}
                    />
                  </label>

                  <button onClick={addRecurring} style={buttonStyle("primary")}>
                    Add recurring
                  </button>
                </div>

                {recurringForm.docs.length > 0 && (
                  <div style={{ marginTop: 10, fontSize: 13, color: COLORS.muted }}>
                    Attached: {recurringForm.docs.map((doc) => doc.name).join(", ")}
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
                {Object.entries(recurringSummaryByCurrency).map(([currencyCode, value]) => (
                  <MetricCard
                    key={currencyCode}
                    label={`Recurring this month - ${currencyCode}`}
                    value={formatMoneyByCurrency(value, currencyCode)}
                    color={COLORS.red}
                  />
                ))}
                <MetricCard label="Recurring items" value={recurring.length} />
              </div>

              <Card padding={0}>
                {recurring.length === 0 && (
                  <EmptyState
                    title="No recurring expenses yet"
                    text="Add HOA, loan payment, salary, tax, insurance, pest control, warranty, or general recurring expenses."
                  />
                )}

                {recurring.map((item, index) => {
                  const building = getBuilding(item.buildingId);
                  const monthlyAmount = recurringMonthlyAmount(
                    item,
                    selectedMonth,
                    selectedYear
                  );
                  const coverageMonths = Number(item.coverageMonths) || 12;

                  return (
                    <div
                      key={item.id}
                      style={{
                        padding: 18,
                        borderBottom:
                          index < recurring.length - 1
                            ? `1px solid ${COLORS.borderLight}`
                            : "none",
                        display: "flex",
                        gap: 12,
                        alignItems: "center",
                        flexWrap: "wrap",
                        opacity: item.active ? 1 : 0.62
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

                      <div style={{ flex: 1, minWidth: 260 }}>
                        <div style={{ fontWeight: 900 }}>{item.text}</div>
                        <div style={{ color: COLORS.muted, fontSize: 13, marginTop: 4 }}>
                          {building?.name} - {building?.currency} - Starts {MONTHS[item.startMonth]} {item.startYear}
                          {item.frequency === "yearly"
                            ? ` - Coverage ${coverageMonths} months`
                            : item.endMonth !== "" && item.endYear !== ""
                            ? ` - Ends ${MONTHS[item.endMonth]} ${item.endYear}`
                            : " - No end date"}
                        </div>

                        {item.docs?.length > 0 && (
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
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

                      <div style={{ textAlign: "right" }}>
                        <div style={{ color: COLORS.red, fontWeight: 950 }}>
                          {formatMoneyByCurrency(Number(item.amount), building?.currency || "INR")}
                        </div>
                        <div style={{ color: COLORS.muted, fontSize: 12 }}>
                          This month: {formatMoneyByCurrency(monthlyAmount, building?.currency || "INR")}
                        </div>
                      </div>

                      <Badge status={item.active ? item.frequency : "inactive"} />

                      <button onClick={() => toggleRecurring(item.id)} style={buttonStyle()}>
                        {item.active ? "Deactivate" : "Activate"}
                      </button>

                      <button onClick={() => removeRecurring(item.id)} style={buttonStyle("danger")}>
                        Remove
                      </button>
                    </div>
                  );
                })}
              </Card>
            </>
          )}

          {view === "yearly" && (
            <>
              {currencyCodes.map((currencyCode) => {
                const rows = MONTHS.map((month, monthNumber) =>
                  getCurrencySummary(currencyCode, monthNumber, yearlyReportYear)
                );

                const yearlyExpected = rows.reduce((sum, row) => sum + row.expected, 0);
                const yearlyCollected = rows.reduce((sum, row) => sum + row.collected, 0);
                const yearlyRepairs = rows.reduce((sum, row) => sum + row.repairExpense, 0);
                const yearlyMaintenance = rows.reduce((sum, row) => sum + row.maintenanceExpense, 0);
                const yearlyRecurring = rows.reduce((sum, row) => sum + row.recurringExpense, 0);
                const yearlyExpenses = rows.reduce((sum, row) => sum + row.expenses, 0);
                const yearlyNet = rows.reduce((sum, row) => sum + row.net, 0);

                if (rows.every((row) => row.buildings.length === 0)) return null;

                const maxAbsNet = Math.max(
                  1,
                  ...rows.map((row) => Math.abs(row.net))
                );

                return (
                  <Card key={currencyCode}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        flexWrap: "wrap",
                        marginBottom: 18
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 19, fontWeight: 950 }}>
                          {getPortfolioLabel(currencyCode)} - {yearlyReportYear}
                        </div>
                        <div style={{ color: COLORS.muted, fontSize: 13, marginTop: 4 }}>
                          Monthly rent, expenses, and net profit
                        </div>
                      </div>

                      <span
                        style={{
                          background: COLORS.primaryLight,
                          color: COLORS.primary,
                          borderRadius: 999,
                          padding: "6px 12px",
                          fontSize: 12,
                          fontWeight: 900,
                          height: "fit-content"
                        }}
                      >
                        {currencyCode}
                      </span>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                        gap: 12,
                        marginBottom: 18
                      }}
                    >
                      <MetricCard
                        label="Year collected"
                        value={formatMoneyByCurrency(yearlyCollected, currencyCode)}
                        color={COLORS.green}
                      />
                      <MetricCard
                        label="Year expenses"
                        value={formatMoneyByCurrency(yearlyExpenses, currencyCode)}
                        color={COLORS.red}
                      />
                      <MetricCard
                        label="Year net"
                        value={formatMoneyByCurrency(yearlyNet, currencyCode)}
                        color={yearlyNet >= 0 ? COLORS.green : COLORS.red}
                      />
                    </div>

                    <div style={{ overflowX: "auto" }}>
                      <table
                        style={{
                          width: "100%",
                          borderCollapse: "collapse",
                          fontSize: 13
                        }}
                      >
                        <thead>
                          <tr style={{ color: COLORS.muted, textAlign: "left" }}>
                            <th style={thStyle}>Month</th>
                            <th style={thStyle}>Expected</th>
                            <th style={thStyle}>Collected</th>
                            <th style={thStyle}>Repairs</th>
                            <th style={thStyle}>Maintenance</th>
                            <th style={thStyle}>Recurring</th>
                            <th style={thStyle}>Total expenses</th>
                            <th style={thStyle}>Net</th>
                            <th style={thStyle}>Chart</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map((row, index) => {
                            const barWidth = Math.max(
                              4,
                              Math.round((Math.abs(row.net) / maxAbsNet) * 100)
                            );

                            return (
                              <tr
                                key={MONTHS[index]}
                                style={{
                                  borderTop: `1px solid ${COLORS.borderLight}`
                                }}
                              >
                                <td style={tdStyle}>{MONTHS[index]}</td>
                                <td style={tdStyle}>
                                  {formatMoneyByCurrency(row.expected, currencyCode)}
                                </td>
                                <td style={{ ...tdStyle, color: COLORS.green, fontWeight: 800 }}>
                                  {formatMoneyByCurrency(row.collected, currencyCode)}
                                </td>
                                <td style={tdStyle}>
                                  {formatMoneyByCurrency(row.repairExpense, currencyCode)}
                                </td>
                                <td style={tdStyle}>
                                  {formatMoneyByCurrency(row.maintenanceExpense, currencyCode)}
                                </td>
                                <td style={tdStyle}>
                                  {formatMoneyByCurrency(row.recurringExpense, currencyCode)}
                                </td>
                                <td style={{ ...tdStyle, color: COLORS.red, fontWeight: 800 }}>
                                  {formatMoneyByCurrency(row.expenses, currencyCode)}
                                </td>
                                <td
                                  style={{
                                    ...tdStyle,
                                    color: row.net >= 0 ? COLORS.green : COLORS.red,
                                    fontWeight: 950
                                  }}
                                >
                                  {formatMoneyByCurrency(row.net, currencyCode)}
                                </td>
                                <td style={tdStyle}>
                                  <div
                                    style={{
                                      height: 9,
                                      width: 120,
                                      background: COLORS.borderLight,
                                      borderRadius: 999,
                                      overflow: "hidden"
                                    }}
                                  >
                                    <div
                                      style={{
                                        height: "100%",
                                        width: `${barWidth}%`,
                                        background: row.net >= 0 ? COLORS.green : COLORS.red
                                      }}
                                    />
                                  </div>
                                </td>
                              </tr>
                            );
                          })}

                          <tr style={{ borderTop: `2px solid ${COLORS.border}` }}>
                            <td style={{ ...tdStyle, fontWeight: 950 }}>Total</td>
                            <td style={{ ...tdStyle, fontWeight: 950 }}>
                              {formatMoneyByCurrency(yearlyExpected, currencyCode)}
                            </td>
                            <td style={{ ...tdStyle, fontWeight: 950, color: COLORS.green }}>
                              {formatMoneyByCurrency(yearlyCollected, currencyCode)}
                            </td>
                            <td style={tdStyle}>
                              {formatMoneyByCurrency(yearlyRepairs, currencyCode)}
                            </td>
                            <td style={tdStyle}>
                              {formatMoneyByCurrency(yearlyMaintenance, currencyCode)}
                            </td>
                            <td style={tdStyle}>
                              {formatMoneyByCurrency(yearlyRecurring, currencyCode)}
                            </td>
                            <td style={{ ...tdStyle, fontWeight: 950, color: COLORS.red }}>
                              {formatMoneyByCurrency(yearlyExpenses, currencyCode)}
                            </td>
                            <td style={{ ...tdStyle, fontWeight: 950, color: yearlyNet >= 0 ? COLORS.green : COLORS.red }}>
                              {formatMoneyByCurrency(yearlyNet, currencyCode)}
                            </td>
                            <td style={tdStyle}></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </Card>
                );
              })}
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

const thStyle = {
  padding: "10px 8px",
  fontSize: 12,
  fontWeight: 900,
  whiteSpace: "nowrap"
};

const tdStyle = {
  padding: "11px 8px",
  whiteSpace: "nowrap"
};

function ordinalDay(n) {
  const num = Number(n) || 0;
  const s = ["th", "st", "nd", "rd"];
  const v = num % 100;
  return num + (s[(v - 20) % 10] || s[v] || s[0]);
}

function formatLeaseDate(iso) {
  if (!iso) return { day: "____", month: "__________", year: "____", full: "____" };
  const parts = String(iso).split("-");
  if (parts.length !== 3) return { day: "____", month: "__________", year: "____", full: iso };
  const months = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"
  ];
  const year = parts[0];
  const monthName = months[Number(parts[1]) - 1] || "";
  const day = ordinalDay(Number(parts[2]));
  return { day, month: monthName, year, full: `${day} day of ${monthName}, ${year}` };
}

const LEASE_DEFAULTS = {
  place: "Bangalore",
  agreementDate: "",
  lessorName: "Gp Capt KK Reddy (Retd)",
  lessorAddress:
    "No 68, 5th Temple Road\n15th Cross, Malleshwaram\nBengaluru-560003",
  lesseeName: "",
  lesseeAge: "",
  lesseeGuardian: "",
  lesseeAddress: "",
  propertyName: "Sri Krishna Residency",
  premisesAddress: "No.202, Balaji Layout, Byaderahalli",
  accommodation:
    "Two rooms and Two bathroom, with all essential sanitary, electrical fittings, and furniture",
  rent: "",
  maintenance: "1250",
  unitDesignation: "",
  rentDueDay: "5",
  leaseMonths: "11",
  enhancePct: "5",
  deposit: "",
  scheduleAddress: "202, Balaji Layout, Byaderahalli, Bangalore-560091",
  scheduleAccommodation:
    "Two rooms, Drawing, Dining, Kitchen with Two bathrooms with lavatory fittings",
  floor: "Second floor",
  fittings:
    "Fan - Three\nTube light - Three\nGeyser - Two\nWood work - Built in cupboards in the rooms with locker facility and Kitchen. Tv stand in the drawing room. One wooden Shoe rack.",
  lessorSignName: "Gp Capt KK Reddy (Retd)",
  lesseeSignName: "",
  witness1Name: "S THULASI REDDY",
  witness1Address:
    "68, 5TH TEMPLE ROAD,15TH CROSS\nMALLESHWARAM, BENGALURU-560003",
  witness2Name: "SUMA SANJEEV",
  witness2Address: "209, BALAJI LAYOUT, BADERAHALLI\nBENGALURU-56091"
};

function buildLeaseHTML(f) {
  const d = formatLeaseDate(f.agreementDate);
  const rentNum = Number(f.rent) || 0;
  const depositNum = Number(f.deposit) || 0;
  const maintNum = Number(f.maintenance) || 0;
  const rentWords = numberToWords(rentNum);
  const depositWords = numberToWords(depositNum);
  const esc = (s) =>
    String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  const nl2br = (s) => esc(s).replace(/\n/g, "<br/>");

  const fittingsItems = String(f.fittings || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `<li>${esc(line)}</li>`)
    .join("");

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>Rental Agreement - ${esc(f.lesseeName)}</title>
<style>
  @page { size: A4; margin: 20mm 18mm; }
  body { font-family: "Times New Roman", Georgia, serif; font-size: 12pt; line-height: 1.55; color: #000; }
  h1 { text-align: center; font-size: 15pt; font-weight: bold; text-decoration: underline; margin: 0 0 22px; }
  h2 { text-align: center; font-size: 13pt; font-weight: bold; text-decoration: underline; margin: 24px 0 12px; }
  p { margin: 0 0 12px; text-align: justify; }
  .party { text-align: center; margin: 0 0 12px; }
  ol.clauses { padding-left: 26px; margin: 0 0 12px; }
  ol.clauses > li { margin-bottom: 11px; text-align: justify; }
  ol.fittings { padding-left: 26px; margin: 4px 0 12px; }
  ol.fittings > li { margin-bottom: 4px; }
  table.sig { width: 100%; margin-top: 56px; border-collapse: collapse; page-break-inside: avoid; }
  table.sig td { vertical-align: top; padding: 0 0 60px; font-size: 11.5pt; }
  table.sig td.right { text-align: left; width: 38%; }
  .pre { white-space: pre-line; }
</style>
</head>
<body>
  <h1>RENTAL AGREEMENT</h1>

  <p>This agreement is made and executed at ${esc(f.place)} on this ${d.full}, by and between:-</p>

  <p class="party"><b>${esc(f.lessorName)}</b><br/>${nl2br(f.lessorAddress)}</p>

  <p>Herein referred to as &lsquo;LESSOR&rsquo; of the first part and in favour of</p>

  <p class="party"><b>${esc(f.lesseeName)}</b>${f.lesseeAge ? `, Aged about ${esc(f.lesseeAge)} Yrs` : ""}${f.lesseeGuardian ? `<br/>S/o ${esc(f.lesseeGuardian)}` : ""}<br/>${nl2br(f.lesseeAddress)}</p>

  <p>Hereinafter called the &lsquo;LESSEE/TENANT&rsquo; of the other part; witnessed as follows:-</p>

  <p>Whereas the terms lessor and lessee shall mean and include their respective heirs, legal representatives, administrators, and assigns, etc.</p>

  <p>And whereas the lessor is the sole and absolute owner of the premises situated at ${esc(f.propertyName)}${f.premisesAddress ? `, ${esc(f.premisesAddress)}` : ""} and whereas the lessee has approached with the lessor to let out the scheduled premises apartment ${esc(f.unitDesignation)}, on rental basis, and the lessor agrees to let-out the same under the following terms and conditions: -</p>

  <ol class="clauses">
    <li>Whereas the lessor agrees to let-out the schedule premises consisting of ${esc(f.accommodation)} provided in the premises for a monthly rent of <b>Rs ${rentNum.toLocaleString("en-IN")}/-</b> (Rupees ${rentWords} Rupees only) per month including maintenance charges of Rs ${maintNum.toLocaleString("en-IN")}/-, and the lessee shall agree to pay the same every month. The apartment is designated as No. ${esc(f.unitDesignation)}.</li>

    <li>Whereas the lessee agrees to pay the monthly rent by on or before ${ordinalDay(f.rentDueDay)} of every English calendar month.</li>

    <li>Whereas the lessee shall use the scheduled premises for residential purpose only and should not use for any illegal or immoral purposes.</li>

    <li>The lease will be for a period of ${esc(f.leaseMonths)} (Eleven) months from the date of this agreement, but it can be extended by mutual consent. The rent shall be enhanced once every ${esc(f.leaseMonths)} months@ ${esc(f.enhancePct)}% over the existing rent.</li>

    <li>Whereas the lessee should not sublet or underlet the schedule premises to any other person without written consent from the lessor. Whereas the lessee shall keep the schedule premises in good condition without any damages to the fittings and fixtures, get the maintenance done as and when required at his own expense, maintain the house, walls neat and clean, if the conditions are not met by the Lessee, then a suitable amount according to the damage will be deducted from the security deposit.</li>

    <li>Whereas the lessee has paid a sum of <b>Rs.${depositNum.toLocaleString("en-IN")}/-</b> (Rupees ${depositWords} only) towards security deposit. Thus, the lessor has received and acknowledges the receipt of the same. This amount shall not carry any interest and the same will be refundable to the lessee at the time of vacating the scheduled premises.</li>

    <li>And whereas the lessee hereby agrees to pay the electricity charges to the concerned authorities without arrears during this tenancy period. The water charges and common (BWSSB) and common electricity bill (water pumping charges) to be shared along with other tenants included in the maintenance charges subject to change with increasing water/Electricity charges. In case of water shortage or no supply from BWSSB, additional expenditure to procure water from tankers is not catered in the maintenance charges, this has to be paid additionally pro rata with other tenants of the building. Painting to be done while vacating the premises the lessee shall hand over the house in good order and ensure electrical fittings in working condition, in case of unserviceability an appropriate amount will be liable to be deducted from the Security deposit in addition one month rent which shall be deducted for the painting from the security deposit, at the time of vacating. The Lessee shall handover the last bills duly paid till the last day to the Lessor.</li>

    <li>The lessee shall vacate the premises after giving a one month written notice from the lessor. Similarly, the lessee can vacate the premises after giving one month notice to the lessor.</li>

    <li>And whereas the lessor or his subordinates or agents is at full liberty to inspect the rented premises at any reasonable hours.</li>
  </ol>

  <h2>SCHEDULE</h2>

  <p>The premises situated at ${esc(f.propertyName)} at apartment No ${esc(f.unitDesignation)}, at ${esc(f.scheduleAddress)}, accommodation consisting of:- ${esc(f.scheduleAccommodation)}, water and electricity facility, RCC roofed building${f.floor ? ` in the ${esc(f.floor)}` : ""} with fittings, furniture and fixtures as follows:-</p>

  <ol class="fittings">${fittingsItems}</ol>

  <p>IN WITNESS WHEREOF the above-mentioned, Lessor and Lessee has fixed their respective signatures to this agreement on the day, month and year first above written.</p>

  <p><u>WITNESSES:-</u></p>

  <table class="sig">
    <tr>
      <td>1. ( ${esc(f.witness1Name)} )<br/>${nl2br(f.witness1Address)}</td>
      <td class="right">(${esc(f.lessorSignName)})<br/>LESSOR</td>
    </tr>
    <tr>
      <td>2. ( ${esc(f.witness2Name)} )<br/>${nl2br(f.witness2Address)}</td>
      <td class="right">( ${esc(f.lesseeSignName || f.lesseeName)} )<br/>LESSEE</td>
    </tr>
  </table>
</body>
</html>`;
}

function LeaseGenerator({ tenants, buildings }) {
  const [f, setF] = useState(LEASE_DEFAULTS);
  const [selectedTenant, setSelectedTenant] = useState("");

  const set = (key) => (value) => setF((prev) => ({ ...prev, [key]: value }));

  const autofillFromTenant = (tenantId) => {
    setSelectedTenant(tenantId);
    if (!tenantId) return;
    const t = tenants.find((x) => String(x.id) === String(tenantId));
    if (!t) return;
    const b = buildings.find((x) => String(x.id) === String(t.buildingId));
    setF((prev) => ({
      ...prev,
      lesseeName: t.name || "",
      lesseeSignName: t.name || "",
      unitDesignation: t.unit || "",
      rent: t.rent != null ? String(t.rent) : "",
      propertyName: b ? b.name || "" : prev.propertyName,
      premisesAddress: b && b.address ? b.address : prev.premisesAddress,
      scheduleAddress: b && b.address ? b.address : prev.scheduleAddress
    }));
  };

  const openPrint = () => {
    const html = buildLeaseHTML(f);
    const win = window.open("", "_blank");
    if (!win) {
      alert("Please allow pop-ups to generate the agreement.");
      return;
    }
    win.document.open();
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 400);
  };

  const downloadWord = () => {
    const html = buildLeaseHTML(f);
    const blob = new Blob([html], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const safeName = (f.lesseeName || "tenant").replace(/[^a-z0-9]+/gi, "_");
    a.download = `Rental_Agreement_${safeName}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const resetForm = () => {
    setF(LEASE_DEFAULTS);
    setSelectedTenant("");
  };

  return (
    <>
      <Card>
        <div style={{ marginBottom: 6 }}>
          <h2 style={{ margin: "0 0 6px", fontSize: 20 }}>Lease Generator</h2>
          <p style={{ margin: 0, color: COLORS.muted, fontSize: 13 }}>
            Pick an existing tenant to auto-fill, edit any blanks, then generate
            a printable PDF or download a Word document.
          </p>
        </div>

        <SelectField
          label="Auto-fill from existing tenant (optional)"
          value={selectedTenant}
          onChange={autofillFromTenant}
        >
          <option value="">-- Select a tenant --</option>
          {tenants
            .filter((t) => !t.vacant)
            .map((t) => {
              const b = buildings.find(
                (x) => String(x.id) === String(t.buildingId)
              );
              return (
                <option key={t.id} value={t.id}>
                  {(b ? b.name + " - " : "") + (t.unit || "") + " - " + (t.name || "")}
                </option>
              );
            })}
        </SelectField>
      </Card>

      <Card>
        <h3 style={{ marginTop: 0 }}>Agreement Details</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "0 18px"
          }}
        >
          <Field label="Place of execution" value={f.place} onChange={set("place")} />
          <Field label="Agreement date" type="date" value={f.agreementDate} onChange={set("agreementDate")} />
        </div>
      </Card>

      <Card>
        <h3 style={{ marginTop: 0 }}>Lessor (Owner)</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "0 18px"
          }}
        >
          <Field label="Lessor name" value={f.lessorName} onChange={set("lessorName")} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Lessor address</label>
          <textarea
            value={f.lessorAddress}
            onChange={(e) => set("lessorAddress")(e.target.value)}
            style={{ ...inputStyle, minHeight: 70, fontFamily: "inherit", resize: "vertical" }}
          />
        </div>
      </Card>

      <Card>
        <h3 style={{ marginTop: 0 }}>Lessee (Tenant)</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "0 18px"
          }}
        >
          <Field label="Lessee name" value={f.lesseeName} onChange={set("lesseeName")} />
          <Field label="Age (years)" value={f.lesseeAge} onChange={set("lesseeAge")} />
          <Field label="S/o, D/o, W/o" value={f.lesseeGuardian} onChange={set("lesseeGuardian")} />
          <Field label="Lessee signature name" value={f.lesseeSignName} onChange={set("lesseeSignName")} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Lessee permanent address</label>
          <textarea
            value={f.lesseeAddress}
            onChange={(e) => set("lesseeAddress")(e.target.value)}
            style={{ ...inputStyle, minHeight: 70, fontFamily: "inherit", resize: "vertical" }}
          />
        </div>
      </Card>

      <Card>
        <h3 style={{ marginTop: 0 }}>Premises &amp; Rent</h3>
        <Field label="Owner's premises address (property location)" value={f.premisesAddress} onChange={set("premisesAddress")} />
        <Field label="Accommodation (e.g. Two rooms and Two bathroom...)" value={f.accommodation} onChange={set("accommodation")} />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "0 18px"
          }}
        >
          <Field label="Monthly rent (Rs)" type="number" value={f.rent} onChange={set("rent")} />
          <Field label="Maintenance (Rs, included)" type="number" value={f.maintenance} onChange={set("maintenance")} />
          <Field label="Security deposit (Rs)" type="number" value={f.deposit} onChange={set("deposit")} />
          <Field label="Unit / apartment no" value={f.unitDesignation} onChange={set("unitDesignation")} />
          <Field label="Rent due day of month" type="number" value={f.rentDueDay} onChange={set("rentDueDay")} />
          <Field label="Lease period (months)" type="number" value={f.leaseMonths} onChange={set("leaseMonths")} />
          <Field label="Rent enhancement (%)" type="number" value={f.enhancePct} onChange={set("enhancePct")} />
        </div>
        {f.rent ? (
          <p style={{ margin: "4px 0 0", color: COLORS.muted, fontSize: 12 }}>
            Rent in words: Rupees {numberToWords(f.rent)} only
          </p>
        ) : null}
        {f.deposit ? (
          <p style={{ margin: "2px 0 0", color: COLORS.muted, fontSize: 12 }}>
            Deposit in words: Rupees {numberToWords(f.deposit)} only
          </p>
        ) : null}
      </Card>

      <Card>
        <h3 style={{ marginTop: 0 }}>Schedule</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "0 18px"
          }}
        >
          <Field label="Property name" value={f.propertyName} onChange={set("propertyName")} />
          <Field label="Floor" value={f.floor} onChange={set("floor")} placeholder="e.g. third floor" />
        </div>
        <Field label="Schedule address" value={f.scheduleAddress} onChange={set("scheduleAddress")} />
        <Field label="Schedule accommodation (e.g. Two rooms, Drawing, Dining...)" value={f.scheduleAccommodation} onChange={set("scheduleAccommodation")} />
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Fittings &amp; fixtures (one per line)</label>
          <textarea
            value={f.fittings}
            onChange={(e) => set("fittings")(e.target.value)}
            style={{ ...inputStyle, minHeight: 110, fontFamily: "inherit", resize: "vertical" }}
          />
        </div>
      </Card>

      <Card>
        <h3 style={{ marginTop: 0 }}>Witnesses &amp; Signatures</h3>
        <Field label="Lessor signature name" value={f.lessorSignName} onChange={set("lessorSignName")} />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "0 18px"
          }}
        >
          <Field label="Witness 1 name" value={f.witness1Name} onChange={set("witness1Name")} />
          <Field label="Witness 2 name" value={f.witness2Name} onChange={set("witness2Name")} />
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Witness 1 address</label>
            <textarea
              value={f.witness1Address}
              onChange={(e) => set("witness1Address")(e.target.value)}
              style={{ ...inputStyle, minHeight: 60, fontFamily: "inherit", resize: "vertical" }}
            />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Witness 2 address</label>
            <textarea
              value={f.witness2Address}
              onChange={(e) => set("witness2Address")(e.target.value)}
              style={{ ...inputStyle, minHeight: 60, fontFamily: "inherit", resize: "vertical" }}
            />
          </div>
        </div>
      </Card>

      <Card>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button onClick={openPrint} style={buttonStyle("primary")}>
            Generate / Print (PDF)
          </button>
          <button onClick={downloadWord} style={buttonStyle()}>
            Download as Word
          </button>
          <button onClick={resetForm} style={buttonStyle("danger")}>
            Reset
          </button>
        </div>
        <p style={{ margin: "12px 0 0", color: COLORS.muted, fontSize: 12 }}>
          Tip: in the print dialog choose &ldquo;Save as PDF&rdquo; as the
          destination to get a PDF copy.
        </p>
      </Card>
    </>
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
    if (!form.unit || !String(form.unit).trim()) {
      alert("Please enter unit number.");
      return;
    }

    if (!form.vacant && (!form.name || !String(form.name).trim())) {
      alert("Please enter tenant name.");
      return;
    }

    if (!form.vacant && (!form.rent || Number(form.rent) <= 0)) {
      alert("Please enter monthly rent.");
      return;
    }

    setTenants((previous) =>
      previous.map((item) =>
        item.id === form.id
          ? {
              ...item,
              ...form,
              vacant: !!form.vacant,
              unit: String(form.unit).trim(),
              name: String(form.name || "").trim(),
              phone: String(form.phone || "").trim(),
              email: String(form.email || "").trim(),
              rent: Number(form.rent) || 0,
              buildingId: Number(form.buildingId)
            }
          : item
      )
    );
    onClose();
  }

  function removeTenant() {
    if (!window.confirm(`Remove ${form.name} from Unit ${form.unit}?`)) {
      return;
    }

    setTenants((previous) => previous.filter((item) => item.id !== form.id));
    onClose();
  }

  return (
    <Modal title={`Edit tenant - Unit ${tenant.unit}`} onClose={onClose}>
      <Field
        label="Unit number"
        value={form.unit}
        onChange={(value) => updateField("unit", value)}
      />

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

      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginTop: 14,
          padding: "12px 14px",
          borderRadius: 12,
          border: `1px solid ${COLORS.border}`,
          background: form.vacant ? COLORS.amberLight : COLORS.page,
          cursor: "pointer",
          fontWeight: 800,
          fontSize: 14
        }}
      >
        <input
          type="checkbox"
          checked={!!form.vacant}
          onChange={(event) => updateField("vacant", event.target.checked)}
          style={{ width: 18, height: 18 }}
        />
        Mark this unit as vacant (no tenant)
      </label>

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
          marginTop: 22,
          flexWrap: "wrap"
        }}
      >
        <button onClick={removeTenant} style={buttonStyle("danger")}>
          Remove tenant
        </button>

        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            flexWrap: "wrap"
          }}
        >
          <div style={{ color: COLORS.muted, fontSize: 13 }}>
            Current rent:{" "}
            <strong>{formatMoney(form.rent, form.buildingId)}</strong>
          </div>

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

function AddTenantModal({ building, buildings, tenants, setTenants, onClose }) {
  const selectedBuilding = building || buildings[0];

  const [form, setForm] = useState({
    unit: "",
    name: "",
    phone: "",
    email: "",
    rent: "",
    leaseEnd: today.toISOString().slice(0, 10),
    buildingId: selectedBuilding?.id || "",
    vacant: false
  });

  function updateField(field, value) {
    setForm((previous) => ({
      ...previous,
      [field]: value
    }));
  }

  function saveTenant() {
    if (!form.unit.trim()) {
      alert("Please enter unit number.");
      return;
    }

    if (!form.vacant && !form.name.trim()) {
      alert("Please enter tenant name.");
      return;
    }

    if (!form.vacant && (!form.rent || Number(form.rent) <= 0)) {
      alert("Please enter monthly rent.");
      return;
    }

    if (!form.buildingId) {
      alert("Please select a property.");
      return;
    }

    const unitExists = tenants.some(
      (tenant) =>
        tenant.buildingId === Number(form.buildingId) &&
        String(tenant.unit).trim().toLowerCase() ===
          String(form.unit).trim().toLowerCase()
    );

    if (unitExists) {
      alert("This unit already exists in this property.");
      return;
    }

    const newId = Math.max(0, ...tenants.map((tenant) => tenant.id)) + 1;

    const newTenant = {
      id: newId,
      unit: form.unit.trim(),
      name: form.vacant ? "" : form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      rent: Number(form.rent) || 0,
      leaseEnd: form.leaseEnd,
      buildingId: Number(form.buildingId),
      vacant: !!form.vacant
    };

    setTenants((previous) => [...previous, newTenant]);
    onClose();
  }

  const selectedCurrency = getCurrency(
    buildings.find((item) => item.id === Number(form.buildingId))?.currency ||
      "INR"
  );

  return (
    <Modal title="Add tenant" onClose={onClose}>
      <SelectField
        label="Property"
        value={form.buildingId}
        onChange={(value) => updateField("buildingId", Number(value))}
      >
        {buildings.map((building, index) => (
          <option key={building.id} value={building.id}>
            Property {index + 1}: {building.name} - {building.currency}
          </option>
        ))}
      </SelectField>

      <Field
        label="Unit number"
        value={form.unit}
        onChange={(value) => updateField("unit", value)}
        placeholder="Example: 101"
      />

      <Field
        label="Tenant name"
        value={form.name}
        onChange={(value) => updateField("name", value)}
        placeholder="Enter tenant name"
      />

      <Field
        label="Phone"
        value={form.phone}
        onChange={(value) => updateField("phone", value)}
        placeholder="Enter phone number"
      />

      <Field
        label="Email"
        type="email"
        value={form.email}
        onChange={(value) => updateField("email", value)}
        placeholder="Enter email address"
      />

      <Field
        label={`Monthly rent (${selectedCurrency.symbol})`}
        type="number"
        value={form.rent}
        onChange={(value) => updateField("rent", value)}
        placeholder="Enter rent amount"
      />

      <Field
        label="Lease end"
        type="date"
        value={form.leaseEnd}
        onChange={(value) => updateField("leaseEnd", value)}
      />

      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginTop: 14,
          padding: "12px 14px",
          borderRadius: 12,
          border: `1px solid ${COLORS.border}`,
          background: form.vacant ? COLORS.amberLight : COLORS.page,
          cursor: "pointer",
          fontWeight: 800,
          fontSize: 14
        }}
      >
        <input
          type="checkbox"
          checked={!!form.vacant}
          onChange={(event) => updateField("vacant", event.target.checked)}
          style={{ width: 18, height: 18 }}
        />
        Add as a vacant unit (no tenant yet)
      </label>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 10,
          marginTop: 22
        }}
      >
        <button onClick={onClose} style={buttonStyle()}>
          Cancel
        </button>

        <button onClick={saveTenant} style={buttonStyle("primary")}>
          {form.vacant ? "Add vacant unit" : "Add tenant"}
        </button>
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