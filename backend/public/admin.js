const API_BASE_URL = window.location.protocol.startsWith("http")
    ? (window.location.port === "5001" ? "/api" : "http://localhost:5001/api")
    : "http://localhost:5001/api";

const TOKEN_KEY = "shashwat_admin_token";
const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes auto-lock

let allLeads = [];
let currentFilter = "All";
let searchQuery = "";
let inactivityTimer = null;

// DOM Elements
const leadsTableBody = document.getElementById("leadsTableBody");
const searchInput = document.getElementById("searchInput");
const metricTotal = document.getElementById("metricTotal");
const metricNew = document.getElementById("metricNew");
const metricEnrolled = document.getElementById("metricEnrolled");
const countAll = document.getElementById("countAll");
const countNew = document.getElementById("countNew");
const dbIndicator = document.getElementById("dbIndicator");
const securityBadge = document.getElementById("securityBadge");

// Auth Overlay Elements
const adminAuthOverlay = document.getElementById("adminAuthOverlay");
const adminLoginForm = document.getElementById("adminLoginForm");
const adminPasswordInput = document.getElementById("adminPasswordInput");
const togglePasswordBtn = document.getElementById("togglePasswordBtn");
const authErrorMessage = document.getElementById("authErrorMessage");
const loginSubmitBtn = document.getElementById("loginSubmitBtn");
const loginBtnText = document.getElementById("loginBtnText");
const loginBtnLoader = document.getElementById("loginBtnLoader");
const btnLogoutAdmin = document.getElementById("btnLogoutAdmin");

// 1. Authentication & Security Gate
function getAdminToken() {
    return sessionStorage.getItem(TOKEN_KEY);
}

function setAdminToken(token) {
    sessionStorage.setItem(TOKEN_KEY, token);
}

function removeAdminToken() {
    sessionStorage.removeItem(TOKEN_KEY);
}

function showAuthScreen(errorText) {
    if (adminAuthOverlay) {
        adminAuthOverlay.style.display = "flex";
        if (adminPasswordInput) {
            adminPasswordInput.value = "";
            adminPasswordInput.focus();
        }
    }
    if (errorText && authErrorMessage) {
        authErrorMessage.textContent = errorText;
        authErrorMessage.style.display = "block";
    }
    if (securityBadge) {
        securityBadge.style.background = "#fee2e2";
        securityBadge.style.color = "#b91c1c";
        securityBadge.innerHTML = '<i class="fas fa-lock"></i> Locked';
    }
}

function hideAuthScreen() {
    if (adminAuthOverlay) {
        adminAuthOverlay.style.display = "none";
    }
    if (authErrorMessage) {
        authErrorMessage.style.display = "none";
    }
    if (securityBadge) {
        securityBadge.style.background = "#dcfce7";
        securityBadge.style.color = "#15803d";
        securityBadge.innerHTML = '<i class="fas fa-shield-alt"></i> Secure Session Active';
    }
    resetInactivityTimer();
}

function logoutAdmin(reason) {
    removeAdminToken();
    allLeads = [];
    renderLeads();
    showAuthScreen(reason || "Session locked. Enter passcode to resume.");
}

// Inactivity Auto-Lock
function resetInactivityTimer() {
    if (inactivityTimer) clearTimeout(inactivityTimer);
    if (getAdminToken()) {
        inactivityTimer = setTimeout(() => {
            logoutAdmin("Session locked due to 15 minutes of inactivity for student data protection.");
        }, INACTIVITY_TIMEOUT);
    }
}

["mousedown", "keydown", "scroll", "touchstart"].forEach(event => {
    window.addEventListener(event, resetInactivityTimer, { passive: true });
});

// Toggle password visibility
if (togglePasswordBtn && adminPasswordInput) {
    togglePasswordBtn.addEventListener("click", () => {
        const isPassword = adminPasswordInput.type === "password";
        adminPasswordInput.type = isPassword ? "text" : "password";
        const icon = togglePasswordBtn.querySelector("i");
        if (icon) {
            icon.className = isPassword ? "far fa-eye-slash" : "far fa-eye";
        }
    });
}

// Handle Admin Login
if (adminLoginForm) {
    adminLoginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const password = adminPasswordInput.value.trim();

        if (!password) {
            authErrorMessage.textContent = "Please enter your passcode.";
            authErrorMessage.style.display = "block";
            return;
        }

        // Loading state
        loginSubmitBtn.disabled = true;
        loginBtnText.style.display = "none";
        loginBtnLoader.style.display = "inline-block";
        authErrorMessage.style.display = "none";

        try {
            const res = await fetch(`${API_BASE_URL}/admin/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password })
            });

            const data = await res.json();

            if (res.ok && data.success && data.token) {
                setAdminToken(data.token);
                hideAuthScreen();
                fetchLeads();
            } else {
                authErrorMessage.textContent = data.error || "Incorrect passcode. Access denied.";
                authErrorMessage.style.display = "block";
            }
        } catch (err) {
            // Local preview fallback if server is offline
            if (password === "shashwat@2026") {
                setAdminToken("shashwat@2026");
                hideAuthScreen();
                fetchLeads();
            } else {
                authErrorMessage.textContent = "Incorrect passcode or local server offline.";
                authErrorMessage.style.display = "block";
            }
        } finally {
            loginSubmitBtn.disabled = false;
            loginBtnText.style.display = "inline";
            loginBtnLoader.style.display = "none";
        }
    });
}

// Lock / Logout Button
if (btnLogoutAdmin) {
    btnLogoutAdmin.addEventListener("click", () => {
        if (confirm("Lock the admin portal to protect student records?")) {
            logoutAdmin("Portal locked. Enter passcode to access student data.");
        }
    });
}

// 2. Fetch Leads with Authorization Header
async function fetchLeads() {
    const token = getAdminToken();
    if (!token) {
        showAuthScreen();
        return;
    }

    try {
        const res = await fetch(`${API_BASE_URL}/enquiries`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (res.status === 401 || res.status === 403) {
            logoutAdmin("Session unauthorized or expired. Please re-enter passcode.");
            return;
        }

        if (!res.ok) throw new Error("Backend response error");

        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
            allLeads = data.data;
            if (dbIndicator) {
                dbIndicator.innerHTML = '<i class="fas fa-circle" style="font-size: 10px; color: #10b981;"></i> Backend Connected';
            }
        } else {
            allLeads = [];
        }
    } catch (err) {
        console.warn("Backend offline or unreachable:", err.message);
        if (dbIndicator) {
            dbIndicator.innerHTML = '<i class="fas fa-circle" style="font-size: 10px; color: #f59e0b;"></i> Offline / Buffer Mode';
        }
    }

    updateMetrics();
    renderLeads();
}

// 3. Update Top Metric Counters
function updateMetrics() {
    const total = allLeads.length;
    const newCount = allLeads.filter(l => l.status === "New").length;
    const enrolled = allLeads.filter(l => l.status === "Enrolled").length;

    if (metricTotal) metricTotal.textContent = total;
    if (metricNew) metricNew.textContent = newCount;
    if (metricEnrolled) metricEnrolled.textContent = enrolled;
    if (countAll) countAll.textContent = total;
    if (countNew) countNew.textContent = newCount;
}

// 4. Render Filtered and Searched Leads
function renderLeads() {
    if (!leadsTableBody) return;

    let filtered = allLeads;

    // Filter by Tab
    if (currentFilter !== "All") {
        filtered = filtered.filter(l => l.status === currentFilter);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        filtered = filtered.filter(l => 
            (l.name && l.name.toLowerCase().includes(q)) ||
            (l.phone && l.phone.includes(q)) ||
            (l.classLevel && l.classLevel.toLowerCase().includes(q))
        );
    }

    if (filtered.length === 0) {
        leadsTableBody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <p>No enquiries found.</p>
                </td>
            </tr>
        `;
        return;
    }

    leadsTableBody.innerHTML = filtered.map(lead => {
        const formattedDate = lead.createdAt 
            ? new Date(lead.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
            : "Recent";

        const statusClass = lead.status === "Demo Scheduled" ? "status-Demo" : `status-${lead.status || "New"}`;
        const whatsappMsg = encodeURIComponent(`Hello ${lead.name}, thank you for contacting Shashwat Coaching Centre, Chandauli. Regarding your enquiry for ${lead.classLevel} (${lead.board}):`);

        return `
            <tr>
                <td style="color: #64748b; font-size: 12.5px;">${formattedDate}</td>
                <td>
                    <div class="lead-name">${lead.name}</div>
                    <div class="lead-contact"><i class="fas fa-phone-alt"></i> ${lead.phone} ${lead.email ? `• ${lead.email}` : ''}</div>
                </td>
                <td>
                    <strong>${lead.classLevel || 'General'}</strong>
                    <div style="font-size: 12px; color: #64748b;">${lead.board || 'CBSE'}</div>
                </td>
                <td style="max-width: 250px; font-size: 13px; color: #334155;">
                    ${lead.message || '<em style="color:#94a3b8;">No message specified</em>'}
                </td>
                <td>
                    <span class="badge-status ${statusClass}">${lead.status || 'New'}</span>
                </td>
                <td>
                    <select class="status-select" onchange="updateLeadStatus('${lead._id}', this.value)">
                        <option value="New" ${lead.status === 'New' ? 'selected' : ''}>New</option>
                        <option value="Contacted" ${lead.status === 'Contacted' ? 'selected' : ''}>Contacted</option>
                        <option value="Demo Scheduled" ${lead.status === 'Demo Scheduled' ? 'selected' : ''}>Demo Scheduled</option>
                        <option value="Enrolled" ${lead.status === 'Enrolled' ? 'selected' : ''}>Enrolled</option>
                        <option value="Closed" ${lead.status === 'Closed' ? 'selected' : ''}>Closed</option>
                    </select>
                </td>
                <td>
                    <div class="action-btns">
                        <a href="tel:${lead.phone}" class="action-icon-btn btn-call" title="Call Student">
                            <i class="fas fa-phone"></i>
                        </a>
                        <a href="https://wa.me/91${lead.phone}?text=${whatsappMsg}" target="_blank" class="action-icon-btn btn-wa" title="WhatsApp Message">
                            <i class="fab fa-whatsapp"></i>
                        </a>
                        <button onclick="deleteLead('${lead._id}')" class="action-icon-btn btn-del" title="Delete Lead">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join("");
}

// 5. Update Status (Protected PATCH)
async function updateLeadStatus(id, newStatus) {
    const token = getAdminToken();
    if (!token) {
        showAuthScreen();
        return;
    }

    try {
        const lead = allLeads.find(l => l._id === id);
        if (lead) lead.status = newStatus;

        const res = await fetch(`${API_BASE_URL}/enquiries/${id}`, {
            method: "PATCH",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ status: newStatus })
        });

        if (res.status === 401 || res.status === 403) {
            logoutAdmin("Session expired. Please log in again.");
            return;
        }

        updateMetrics();
        renderLeads();
    } catch (err) {
        console.error("Failed to update status:", err);
    }
}

// 6. Delete Lead (Protected DELETE)
async function deleteLead(id) {
    const token = getAdminToken();
    if (!token) {
        showAuthScreen();
        return;
    }

    if (!confirm("Are you sure you want to permanently remove this student record?")) return;

    try {
        allLeads = allLeads.filter(l => l._id !== id);
        const res = await fetch(`${API_BASE_URL}/enquiries/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (res.status === 401 || res.status === 403) {
            logoutAdmin("Session expired. Please log in again.");
            return;
        }

        updateMetrics();
        renderLeads();
    } catch (err) {
        console.error("Failed to delete lead:", err);
    }
}

// 7. Search Filter Listener
if (searchInput) {
    searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value;
        renderLeads();
    });
}

// 8. Filter Tab Buttons
document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", function() {
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        this.classList.add("active");
        currentFilter = this.getAttribute("data-status");
        renderLeads();
    });
});

function refreshLeads() {
    fetchLeads();
}

// 9. Manual Lead Modal & Submission
const btnOpenAddModal = document.getElementById("btnOpenAddModal");
const addLeadModal = document.getElementById("addLeadModal");
const closeAddLeadModal = document.getElementById("closeAddLeadModal");
const manualLeadForm = document.getElementById("manualLeadForm");

if (btnOpenAddModal && addLeadModal) {
    btnOpenAddModal.addEventListener("click", () => {
        addLeadModal.style.display = "flex";
        document.getElementById("manualName")?.focus();
    });
}

function closeManualModal() {
    if (addLeadModal) addLeadModal.style.display = "none";
}

if (closeAddLeadModal) {
    closeAddLeadModal.addEventListener("click", closeManualModal);
}

if (addLeadModal) {
    addLeadModal.addEventListener("click", (e) => {
        if (e.target === addLeadModal) closeManualModal();
    });
}

if (manualLeadForm) {
    manualLeadForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const token = getAdminToken();
        const name = document.getElementById("manualName").value.trim();
        const phone = document.getElementById("manualPhone").value.trim();
        const classLevel = document.getElementById("manualClass").value;
        const board = document.getElementById("manualBoard").value;
        const status = document.getElementById("manualStatus").value;
        const message = document.getElementById("manualMessage").value.trim();

        const newLeadPayload = {
            name,
            phone,
            classLevel,
            board,
            status,
            message
        };

        try {
            const res = await fetch(`${API_BASE_URL}/enquiries`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    ...(token && { "Authorization": `Bearer ${token}` })
                },
                body: JSON.stringify(newLeadPayload)
            });

            const data = await res.json();
            if (data.success && data.data) {
                const leadToSave = { ...data.data, status };
                allLeads.unshift(leadToSave);
            }
        } catch (err) {
            allLeads.unshift({
                _id: "local_" + Date.now(),
                ...newLeadPayload,
                createdAt: new Date().toISOString()
            });
        }

        updateMetrics();
        renderLeads();
        manualLeadForm.reset();
        closeManualModal();
    });
}

// 10. Export Leads to CSV (Protected)
const btnExportCsv = document.getElementById("btnExportCsv");
if (btnExportCsv) {
    btnExportCsv.addEventListener("click", () => {
        if (!getAdminToken()) {
            showAuthScreen("Please authenticate to export student data.");
            return;
        }

        if (allLeads.length === 0) {
            alert("No leads available to export.");
            return;
        }

        const headers = ["Date", "Student Name", "Mobile Number", "Email", "Class", "Board", "Query / Notes", "Status"];
        const rows = allLeads.map(l => [
            l.createdAt ? `"${new Date(l.createdAt).toLocaleDateString('en-IN')}"` : '""',
            `"${(l.name || "").replace(/"/g, '""')}"`,
            `"${l.phone || ""}"`,
            `"${(l.email || "").replace(/"/g, '""')}"`,
            `"${(l.classLevel || "").replace(/"/g, '""')}"`,
            `"${(l.board || "").replace(/"/g, '""')}"`,
            `"${(l.message || "").replace(/"/g, '""')}"`,
            `"${l.status || "New"}"`
        ]);

        const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\r\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `shashwat_coaching_leads_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
}

// 11. Page Initialization
document.addEventListener("DOMContentLoaded", () => {
    const existingToken = getAdminToken();
    if (!existingToken) {
        showAuthScreen();
    } else {
        hideAuthScreen();
        fetchLeads();
    }
});
