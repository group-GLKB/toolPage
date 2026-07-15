import { useState } from "react";
import { Select, Modal, Tooltip } from "antd";
import { LockOutlined } from "@ant-design/icons";
import GalleryView from "./GalleryView.jsx";
import CategoryPage from "./CategoryPage.jsx";
import TableView from "./TableView.jsx";
import PasswordDecryptor from "./PasswordDecryptor.jsx";

/**
 * MainPage
 * Recreates the Notion-style "Team Directory" gallery layout, but as a
 * directory of tools. Renders a grid of ToolCard components plus a
 * trailing "+ New page" placeholder card.
 */
export default function MainPage() {
  const [activeView, setActiveView] = useState("category");
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [decryptedMap, setDecryptedMap] = useState({});

  function handleDecrypt(map) {
    setDecryptedMap(map);
    setPasswordModalOpen(false);
  }

  // Sample data — replace with your real tools list.
  const tools = [
    {
      emoji: "🧪",
      name: "GLKB Dev",
      description:
        "Development version of the GLKB site for testing new features before production release.",
      link: "https://dev.glkb.org",
      category: "Website",
      encryptedCredentials: "BCgQ0HKfRPF57tWXssHSOK+ZhBq93YJOQ0lcaAuQoeIFvuz4IQ1xPYQrGNdMJCjRM9VLfxsymCKHXYqd3ne4bsGglZpuL8DKDedP/Z5a4jG6122zgdEOHFn6c//QaYoZY1E7hLW/",
    },
    {
      emoji: "🚀",
      name: "GLKB Production",
      description:
        "Production version of the GLKB site that is currently in use or ready for delivery.",
      link: "https://glkb.org",
      category: "Website",
      encryptedCredentials: "",
    },
    {
      emoji: "📅",
      name: "Schedule & Task Management",
      description:
        "Internal lab scheduling tool for managing lab schedules and related resources.",
      link: "https://scheduler.404nfound.com",
      backupLink: "http://ec2-13-221-95-92.compute-1.amazonaws.com",
      category: "Schedule Manager",
      encryptedCredentials: "",
    },
    {
      emoji: "🗄️",
      name: "User Behavior Dashboard (Dev)",
      description:
        "Dev environment only — user activity, search behavior, and engagement metrics from the development PostgreSQL (pank-rank). Not production data.",
      link: "http://ec2-54-82-104-165.compute-1.amazonaws.com:8101/",
      category: "Monitor",
      encryptedCredentials: "pBe6rJiCaUcDAQmbFvIgoZpcdATdFIUeX/GZkOW38pMIEZBWz9gqO94YEz1PkMdT8W9qkGKtTfEzZfCMi3egeiZXwgzlsz6y6efQykoRpunTuh1UPE/e25Su",
    },
    {
      emoji: "🏭",
      name: "Production DB Monitor",
      description:
        "Production users_db analytics — KPIs, DAU, tier distribution, user detail, and engagement from the live production PostgreSQL.",
      link: "https://glkb-monitor.404nfound.com",
      category: "Monitor",
      encryptedCredentials: "75x84GlPNeMLmChp/1BUZHDf1YqxwBpmYpzVaqWXSMH5Ry3YthL/MNr1T8z5MhckjAOJIZ8JIxOHeacWCiS1uYYV7N+wo36aOGDdNB6dRbnL/wVLybUKE7eG5g==",
    },
    {
      emoji: "📊",
      name: "Website Error & Service Monitoring",
      description:
        "Real-time monitoring of GLKB website errors, service status, and incident history.",
      link: "https://glkb-dashboard.vercel.app/",
      category: "Monitor",
      encryptedCredentials: "",
    },
    {
      emoji: "📋",
      name: "GLKB Outreach & Event Tracking",
      description:
        "Track conferences, seminars, outreach activities, and UTM campaigns related to GLKB promotion.",
      link: "https://docs.google.com/spreadsheets/d/1MwIJi2e3sMj5PhpTxkbzrwxSa9Z7Zurw6SCbiBou4pE/edit?resourcekey=&gid=738252683#gid=738252683",
      category: "Tracking",
      encryptedCredentials: "",
    },{
  emoji: "🔐",
  name: "GLKB Password Vault",
  description:
    "Read-only password manager for GLKB members to view shared accounts and passwords. To add a new account/password pair, members should email Jincheng or Zhiyuan.",
  link: "https://vault-glkb.404nfound.com/mini/",
  category: "Password Manager",
  encryptedCredentials: "GJo2gk6bRzCmVn+EFjoqBORoBd4l7lUvOG/DKSjj1vxrpsS/DnqO0rickoz1BvBaMOyHAz4ffHlYf13S/wEZKdTd2Iz5Io9DR/rFOqq2pmaFKuOItQTVjyqeGjNCvbD2nr9mGKXaKqdk7rCx",
},{
  emoji: "📅",
  name: "Event Registration Form",
  description:
    "A Google Form for folks to sign up to promote GLKB when attending external events, such as seminars, conferences, or other outreach opportunities.",
  link: "https://docs.google.com/forms/d/e/1FAIpQLSc7IanW4gCLaCtCQ3vwcUM2v1fP0zGWHIQ7R92-XlnVxyDC5w/viewform?usp=publish-editor",
  category: "Tracking",
  encryptedCredentials: "",
},
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <div className="max-w-6xl mx-auto px-12 py-12">
        {/* Header */}
        <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
          <span>Tool Directory</span>
        </h1>

<p className="mt-4 text-left text-gray-700 leading-7 max-w-3xl">
Enter the access password to unlock the usernames and passwords for the tools.
</p>

<p className="mt-2 text-left text-gray-700 leading-7 max-w-3xl">
  If you do not know the access password, please contact {" "}
  <a
    href="mailto:lzy@umich.edu"
    className="font-medium text-blue-600 underline hover:text-blue-800"
  >
    lzy@umich.edu
  </a>{" "}
  for password.
</p>


        {/* View tabs + toolbar */}
        <div className="mt-8 flex items-center justify-between border-b border-gray-200 pb-2">
          <div className="flex items-center gap-1 text-sm">
            <button
              onClick={() => setActiveView("category")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium ${activeView === "category" ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-100"}`}
            >
              <BoardIcon />
              <span>By Category</span>
            </button>
            <button
              onClick={() => setActiveView("gallery")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium ${activeView === "gallery" ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-100"}`}
            >
              <GridIcon />
              <span>Gallery View</span>
            </button>
            <button
              onClick={() => setActiveView("table")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium ${activeView === "table" ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-100"}`}
            >
              <TableIcon />
              <span>Table View</span>
            </button>
          </div>

          <div className="flex items-center gap-1 text-gray-500">
            {/* <ToolbarIcon><FilterIcon /></ToolbarIcon> */}
            {/* <ToolbarIcon><SortIcon active /></ToolbarIcon> */}
            <Tooltip title="Input the password to unlock the username and key of the tools">
              <button onClick={() => setPasswordModalOpen(true)} className="p-1.5 rounded-md text-gray-500">
                <LockOutlined />
              </button>
            </Tooltip>
            <Select
              showSearch
              placeholder="Search tools…"
              style={{ width: 200 }}
              options={tools.map((tool) => ({
                value: tool.link,
                label: `${tool.emoji} ${tool.name}`,
              }))}
              filterOption={(input, option) =>
                option.label.toLowerCase().includes(input.toLowerCase())
              }
              onSelect={(link) => window.open(link, "_blank")}
            />
            {/* <ToolbarIcon><SlidersIcon /></ToolbarIcon> */}
            {/* <button className="ml-2 flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-3 py-1.5 rounded-md">
              <span>New</span>
              <ChevronDownIcon />
            </button> */}
          </div>
        </div>

        {activeView === "gallery" && <GalleryView tools={tools} decryptedMap={decryptedMap} onLockClick={() => setPasswordModalOpen(true)} />}
        {activeView === "table" && <TableView tools={tools} decryptedMap={decryptedMap} />}
        {activeView === "category" && <CategoryPage tools={tools} decryptedMap={decryptedMap} onLockClick={() => setPasswordModalOpen(true)} />}
      </div>

       <Modal
        open={passwordModalOpen}
        onCancel={() => setPasswordModalOpen(false)}
        footer={null}
        title={
          <span className="flex items-center gap-2">
            <LockOutlined />
            Dev Access Passwords
          </span>
        }
        width={700}
        destroyOnHidden
      >
        <PasswordDecryptor embedded tools={tools} onDecrypt={handleDecrypt} />
      </Modal> 
    </div>
  );
}

/* ---------- Small icon helpers (inline SVG, no external deps) ---------- */


function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}
function TableIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 10h18M9 4v16" />
    </svg>
  );
}
function BoardIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="5" height="16" rx="1" />
      <rect x="10" y="4" width="5" height="16" rx="1" />
      <rect x="17" y="4" width="4" height="16" rx="1" />
    </svg>
  );
}
function FilterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 5h18l-7 9v5l-4 2v-7L3 5z" />
    </svg>
  );
}
function SortIcon({ active }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "#2563eb" : "currentColor"} strokeWidth="2">
      <path d="M7 4v16M3 8l4-4 4 4M17 20V4M13 16l4 4 4-4" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />
    </svg>
  );
}
function SlidersIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" />
      <circle cx="16" cy="6" r="2" />
      <circle cx="10" cy="12" r="2" />
      <circle cx="18" cy="18" r="2" />
    </svg>
  );
}
function ChevronDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
