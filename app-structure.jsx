import { useState } from "react";

const NODE_TYPES = {
  entry: { bg: "#1c1c1e", border: "#3a3a3c", text: "#f2f2f7" },
  provider: { bg: "#0d2137", border: "#0a84ff", text: "#409cff" },
  layout: { bg: "#1a1a2e", border: "#5856d6", text: "#a78bfa" },
  page: { bg: "#1a2e1a", border: "#34c759", text: "#6ee77a" },
  component: { bg: "#2e1a0e", border: "#ff9500", text: "#ffb340" },
  hook: { bg: "#2e0e1a", border: "#ff2d55", text: "#ff6b81" },
  storage: { bg: "#1a1a1a", border: "#636366", text: "#aeaeb2" },
  route: { bg: "#0e1a2e", border: "#00c7be", text: "#5ac8fa" },
};

function Node({ type, label, sublabel, children, highlight }) {
  const style = NODE_TYPES[type] || NODE_TYPES.entry;
  return (
    <div
      style={{
        background: style.bg,
        border: `1.5px solid ${highlight ? "#ffffff" : style.border}`,
        borderRadius: 12,
        padding: "10px 16px",
        minWidth: 140,
        boxShadow: highlight
          ? `0 0 0 3px ${style.border}44, 0 4px 20px rgba(0,0,0,0.5)`
          : `0 2px 12px rgba(0,0,0,0.4)`,
        position: "relative",
      }}
    >
      <div style={{ color: style.text, fontWeight: 600, fontSize: 13, letterSpacing: 0.2 }}>
        {label}
      </div>
      {sublabel && (
        <div style={{ color: style.text + "99", fontSize: 11, marginTop: 2 }}>{sublabel}</div>
      )}
      {children}
    </div>
  );
}

function Arrow({ label, color = "#636366", dashed }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
      <div
        style={{
          width: 1.5,
          height: 24,
          background: dashed
            ? `repeating-linear-gradient(to bottom, ${color} 0px, ${color} 4px, transparent 4px, transparent 8px)`
            : color,
        }}
      />
      {label && (
        <div style={{ color, fontSize: 10, fontWeight: 500, whiteSpace: "nowrap" }}>{label}</div>
      )}
      <div style={{ width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: `6px solid ${color}` }} />
    </div>
  );
}

function HArrow({ color = "#636366" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "0 4px" }}>
      <div style={{ width: 24, height: 1.5, background: color }} />
      <div style={{ width: 0, height: 0, borderTop: "5px solid transparent", borderBottom: "5px solid transparent", borderLeft: `6px solid ${color}` }} />
    </div>
  );
}

function Section({ title, color, children }) {
  return (
    <div
      style={{
        border: `1px dashed ${color}55`,
        borderRadius: 16,
        padding: "12px 16px",
        background: color + "08",
      }}
    >
      <div style={{ color: color + "cc", fontSize: 10, fontWeight: 700, letterSpacing: 1, marginBottom: 10, textTransform: "uppercase" }}>
        {title}
      </div>
      {children}
    </div>
  );
}

const TABS = ["Overview", "Data Flow", "Auth Flow", "Storage"];

export default function App() {
  const [tab, setTab] = useState("Overview");

  return (
    <div style={{ background: "#111113", minHeight: "100vh", fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif", color: "#f2f2f7", padding: 24 }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5 }}>Web Journal — App Structure</div>
        <div style={{ fontSize: 13, color: "#636366", marginTop: 4 }}>React 18 · TypeScript · Vite · Tailwind CSS v4 · Framer Motion</div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 32 }}>
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "7px 18px",
              borderRadius: 20,
              border: tab === t ? "1.5px solid #0a84ff" : "1.5px solid #3a3a3c",
              background: tab === t ? "rgba(10,132,255,0.15)" : "rgba(255,255,255,0.04)",
              color: tab === t ? "#409cff" : "#aeaeb2",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {tab === "Overview" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
          <Node type="entry" label="main.tsx" sublabel="React DOM entry point" />
          <Arrow color="#636366" />
          <Node type="entry" label="App.tsx" sublabel="Root component" />
          <Arrow color="#0a84ff" label="wraps" />

          {/* Provider stack */}
          <Section title="Global Providers" color="#0a84ff">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
              <Node type="provider" label="ThemeProvider" sublabel="light / dark mode · localStorage" />
              <Arrow color="#0a84ff" />
              <Node type="provider" label="AuthProvider" sublabel="user session · localStorage" />
              <Arrow color="#0a84ff" />
              <Node type="route" label="RouterProvider" sublabel="React Router v7" />
            </div>
          </Section>

          <Arrow color="#00c7be" label="routes" />

          {/* Routes */}
          <Section title="Routes" color="#00c7be">
            <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
              {/* Login branch */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
                <Node type="route" label="/login" sublabel="Full-screen" />
                <Arrow color="#34c759" />
                <Node type="page" label="Login.tsx" sublabel="Sign in · Sign up · Guest" />
              </div>

              {/* Main app branch */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
                <Node type="route" label="/" sublabel="App shell" />
                <Arrow color="#5856d6" />
                <Node type="layout" label="Layout.tsx" sublabel="Sidebar + TopBar + Panels" />
                <Arrow color="#5856d6" />
                <Node type="provider" label="BookProvider" sublabel="journals · selection · scoped" />
                <Arrow color="#5856d6" />

                <Section title="Child Routes" color="#5856d6">
                  <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
                      <Node type="route" label="/ (index)" />
                      <Arrow color="#34c759" />
                      <Node type="page" label="Home.tsx" sublabel="Entry list · filters" />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
                      <Node type="route" label="/new" />
                      <Arrow color="#34c759" />
                      <Node type="page" label="NewEntry.tsx" sublabel="Create entry" />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
                      <Node type="route" label="/entry/:id" />
                      <Arrow color="#34c759" />
                      <Node type="page" label="EntryDetail.tsx" sublabel="View · edit · delete" />
                    </div>
                  </div>
                </Section>
              </div>
            </div>
          </Section>
        </div>
      )}

      {/* ── DATA FLOW ── */}
      {tab === "Data Flow" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
          <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>

            {/* Left: Context tree */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
              <Section title="Context / State" color="#0a84ff">
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
                  <Node type="provider" label="ThemeContext" sublabel="theme · toggleTheme" />
                  <Arrow color="#0a84ff" />
                  <Node type="provider" label="AuthContext" sublabel="user · login · signup · logout" />
                  <Arrow color="#0a84ff" />
                  <Node type="provider" label="BookContext" sublabel="books · selectedBook · refresh" highlight />
                  <div style={{ color: "#409cff88", fontSize: 10, marginTop: 6, textAlign: "center" }}>
                    re-loads on user change
                  </div>
                </div>
              </Section>
            </div>

            {/* Middle: Hook */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 100 }}>
              <Node type="hook" label="useStorage()" sublabel="auto-binds user scope" highlight />
              <Arrow color="#ff2d55" label="scope = email | 'guest'" />
              <Node type="storage" label="storage.ts" sublabel="namespaced localStorage" />
              <Arrow color="#636366" label="key: journal_*:scope" />
              <div
                style={{
                  background: "#1a1a1a",
                  border: "1.5px solid #3a3a3c",
                  borderRadius: 10,
                  padding: "10px 16px",
                  fontSize: 12,
                  color: "#aeaeb2",
                  lineHeight: 1.8,
                }}
              >
                <div style={{ color: "#636366", marginBottom: 4, fontSize: 10, fontWeight: 700 }}>localStorage keys</div>
                journal_books:<span style={{ color: "#ff9500" }}>scope</span><br />
                journal_entries:<span style={{ color: "#ff9500" }}>scope</span><br />
                journal_demo_seeded:<span style={{ color: "#ff9500" }}>scope</span>
              </div>
            </div>

            {/* Right: Consumers */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 60, gap: 10 }}>
              <Section title="Consumers" color="#ff9500">
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    ["Sidebar.tsx", "saveBook · deleteBook · getEntriesByBook"],
                    ["Home.tsx", "getEntriesByBook"],
                    ["NewEntry.tsx", "saveEntry"],
                    ["EntryDetail.tsx", "getEntryById · saveEntry · deleteEntry"],
                  ].map(([name, ops]) => (
                    <Node key={name} type="component" label={name} sublabel={ops} />
                  ))}
                </div>
              </Section>
            </div>
          </div>
        </div>
      )}

      {/* ── AUTH FLOW ── */}
      {tab === "Auth Flow" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
          <Node type="entry" label="App launch" />
          <Arrow color="#636366" />

          <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
            {/* Guest path */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
              <Node type="page" label="No session" sublabel="user = null" />
              <Arrow color="#34c759" label="Continue as Guest" />
              <Node type="layout" label="Layout / Home" />
              <Arrow color="#ff9500" />
              <Node type="storage" label="scope = 'guest'" sublabel="shared guest data" />
            </div>

            {/* Sign up path */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
              <Node type="route" label="/login" />
              <Arrow color="#0a84ff" label="Sign Up" />
              <div style={{ background: "#0d2137", border: "1.5px solid #0a84ff", borderRadius: 12, padding: "10px 16px", fontSize: 12, color: "#409cff", lineHeight: 1.8 }}>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>AuthContext.signup()</div>
                wj_accounts → save hashed<br />
                wj_session → set user<br />
                avatarColor assigned
              </div>
              <Arrow color="#0a84ff" />
              <Node type="layout" label="Redirect → /" />
              <Arrow color="#ff9500" />
              <Node type="storage" label="scope = email" sublabel="private user data" />
              <Arrow color="#34c759" label="first visit — seed demo" />
              <Node type="storage" label="Demo journals seeded" sublabel="5 journals · 18 entries" />
            </div>

            {/* Sign in path */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
              <Node type="route" label="/login" />
              <Arrow color="#af52de" label="Sign In" />
              <div style={{ background: "#1a0d2e", border: "1.5px solid #af52de", borderRadius: 12, padding: "10px 16px", fontSize: 12, color: "#c77dff", lineHeight: 1.8 }}>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>AuthContext.login()</div>
                wj_accounts → verify<br />
                wj_session → restore user
              </div>
              <Arrow color="#af52de" />
              <Node type="layout" label="Redirect → /" />
              <Arrow color="#ff9500" />
              <Node type="storage" label="scope = email" sublabel="existing user data" />
            </div>
          </div>

          <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 0 }}>
            <Node type="component" label="ProfileMenu" sublabel="avatar · name · sign out" />
            <HArrow color="#ff3b30" />
            <Node type="provider" label="logout()" sublabel="clears wj_session" />
            <HArrow color="#ff3b30" />
            <Node type="route" label="→ /login" />
          </div>
        </div>
      )}

      {/* ── STORAGE ── */}
      {tab === "Storage" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <Node type="hook" label="useStorage()" sublabel="derives scope from useAuth()" highlight />
          <Arrow color="#ff2d55" />

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
            {[
              { fn: "getBooks(scope)", ret: "Book[]", desc: "Seeds demo if first visit" },
              { fn: "saveBook(book, scope)", ret: "void", desc: "Create or update journal" },
              { fn: "deleteBook(id, scope)", ret: "void", desc: "Removes book + its entries" },
              { fn: "getBookById(id, scope)", ret: "Book | null", desc: "Lookup single journal" },
              { fn: "getEntries(scope)", ret: "Entry[]", desc: "All entries for scope" },
              { fn: "getEntriesByBook(bookId, scope)", ret: "Entry[]", desc: "Filtered by journal" },
              { fn: "saveEntry(entry, scope)", ret: "void", desc: "Create or update entry" },
              { fn: "deleteEntry(id, scope)", ret: "void", desc: "Remove single entry" },
              { fn: "getEntryById(id, scope)", ret: "Entry | null", desc: "Lookup single entry" },
            ].map(({ fn, ret, desc }) => (
              <div
                key={fn}
                style={{
                  background: "#1a1a1a",
                  border: "1.5px solid #3a3a3c",
                  borderRadius: 10,
                  padding: "10px 14px",
                  width: 230,
                }}
              >
                <div style={{ color: "#ff9500", fontSize: 11, fontFamily: "monospace", fontWeight: 600 }}>{fn}</div>
                <div style={{ color: "#0a84ff", fontSize: 11, fontFamily: "monospace", marginTop: 2 }}>→ {ret}</div>
                <div style={{ color: "#636366", fontSize: 11, marginTop: 4 }}>{desc}</div>
              </div>
            ))}
          </div>

          <Arrow color="#636366" label="all keyed as" />

          <div style={{ display: "flex", gap: 16 }}>
            {[
              { key: "journal_books:{scope}", example: "journal_books:alice@example.com" },
              { key: "journal_entries:{scope}", example: "journal_entries:alice@example.com" },
              { key: "journal_demo_seeded:{scope}", example: "journal_demo_seeded:guest" },
            ].map(({ key, example }) => (
              <div
                key={key}
                style={{
                  background: "#0d1117",
                  border: "1.5px solid #30363d",
                  borderRadius: 10,
                  padding: "10px 14px",
                }}
              >
                <div style={{ color: "#58a6ff", fontFamily: "monospace", fontSize: 12 }}>{key}</div>
                <div style={{ color: "#636366", fontFamily: "monospace", fontSize: 10, marginTop: 4 }}>{example}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 36, flexWrap: "wrap" }}>
        {Object.entries({
          "Entry / Root": "entry",
          "Context Provider": "provider",
          "Layout": "layout",
          "Page": "page",
          "Component": "component",
          "Hook": "hook",
          "Storage / Utils": "storage",
          "Route": "route",
        }).map(([label, type]) => {
          const s = NODE_TYPES[type];
          return (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: s.bg, border: `1.5px solid ${s.border}` }} />
              <span style={{ color: "#636366", fontSize: 11 }}>{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
