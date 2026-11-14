const API_BASE_URL = window.location.protocol.startsWith("http")
    ? (window.location.port === "5001" ? "/api" : "http://localhost:5001/api")
    : "http://localhost:5001/api";

let allLeads = [];
let currentFilter = "All";
let searchQuery = "";

const leadsTableBody = document.getElementById("leadsTableBody");
const searchInput = document.getElementById("searchInput");
const metricTotal = document.getElementById("metricTotal");
const metricNew = document.getElementById("metricNew");
const metricEnrolled = document.getElementById("metricEnrolled");
const countAll = document.getElementById("countAll");
const countNew = document.getElementById("countNew");
const dbIndicator = document.getElementById("dbIndicator");

// Mock sample leads if backend is completely offline
const sampleLeads = [
    {
        _id: "demo1",
        name: "Aman Verma",
        phone: "9876543210",
        email: "aman.verma@gmail.com",
        classLevel: "Class 10",
        board: "CBSE",
        message: "Need help with Physics numericals and Math trigonometry before pre-boards.",
        status: "New",
        createdAt: new Date().toISOString()
    },
    {
        _id: "demo2",
        name: "Shreya Gupta",
        phone: "9451234567",
        email: "shreya.g@yahoo.com",
        classLevel: "Class 11 (Science)",
        board: "ICSE",
        message: "Enquiring for PCM evening batch and fee structure.",
        status: "Contacted",
        createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
        _id: "demo3",
        name: "Vikram Yadav",
        phone: "9123456789",
        email: "",
        classLevel: "Class 9",
        board: "CBSE",
        message: "Want to book a 2-day free demo class this Saturday.",
        status: "Demo Scheduled",
        createdAt: new Date(Date.now() - 172800000).toISOString()
    }
];

// Fetch Leads from Backend
async function fetchLeads() {
    try {
        const res = await fetch(`${API_BASE_URL}/enquiries`);
        if (!res.ok) throw new Error("Backend response error");

        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
            allLeads = data.data;
            if (dbIndicator) {
                dbIndicator.innerHTML = '<i class="fas fa-circle" style="font-size: 10px; color: #10b981;"></i> Backend Connected';
            }
        } else {
            allLeads = sampleLeads;
        }
    } catch (err) {
        console.warn("Backend offline, displaying demo buffer leads:", err.message);
        if (allLeads.length === 0) {
            allLeads = sampleLeads;
        }
        if (dbIndicator) {
            dbIndicator.innerHTML = '<i class="fas fa-circle" style="font-size: 10px; color: #f59e0b;"></i> Local Preview Mode';
        }
    }

    updateMetrics();
    renderLeads();
}

// Update Top Metric Counters
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

// Render Filtered and Searched Leads
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
                    <p>No enquiries found for this filter.</p>
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

// Update Status (PATCH)
async function updateLeadStatus(id, newStatus) {
    try {
        const lead = allLeads.find(l => l._id === id);
        if (lead) lead.status = newStatus;

        await fetch(`${API_BASE_URL}/enquiries/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus })
        });

        updateMetrics();
        renderLeads();
    } catch (err) {
        console.error("Failed to update status:", err);
    }
}

// Delete Lead (DELETE)
async function deleteLead(id) {
    if (!confirm("Are you sure you want to remove this lead?")) return;

    try {
        allLeads = allLeads.filter(l => l._id !== id);
        await fetch(`${API_BASE_URL}/enquiries/${id}`, {
            method: "DELETE"
        });
        updateMetrics();
        renderLeads();
    } catch (err) {
        console.error("Failed to delete lead:", err);
    }
}

// Search Filter Listener
if (searchInput) {
    searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value;
        renderLeads();
    });
}

// Filter Tab Buttons
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

// 7. Manual Lead Modal & Submission
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
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newLeadPayload)
            });

            const data = await res.json();
            if (data.success && data.data) {
                // If created with custom status, ensure local copy reflects it
                const leadToSave = { ...data.data, status };
                allLeads.unshift(leadToSave);
            } else {
                allLeads.unshift({
                    _id: "local_" + Date.now(),
                    ...newLeadPayload,
                    createdAt: new Date().toISOString()
                });
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

// 8. Export Leads to CSV
const btnExportCsv = document.getElementById("btnExportCsv");
if (btnExportCsv) {
    btnExportCsv.addEventListener("click", () => {
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

// Load on page ready
document.addEventListener("DOMContentLoaded", () => {
    fetchLeads();
});
