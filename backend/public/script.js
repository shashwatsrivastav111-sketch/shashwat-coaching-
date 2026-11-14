// Configuration
const API_BASE_URL = window.location.protocol.startsWith("http")
    ? (window.location.port === "5001" ? "/api" : "http://localhost:5001/api")
    : "http://localhost:5001/api";

// Elements
const enquiryForm = document.getElementById("enquiryForm");
const formMessage = document.getElementById("formMessage");
const submitBtn = document.getElementById("submitBtn");
const btnText = document.getElementById("btnText");
const btnLoader = document.getElementById("btnLoader");
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const navLinks = document.getElementById("navLinks");
const noticeContainer = document.getElementById("noticeContainer");
const materialModal = document.getElementById("materialModal");
const closeMaterialModal = document.getElementById("closeMaterialModal");
const modalMaterialTitle = document.getElementById("modalMaterialTitle");
const modalMaterialDesc = document.getElementById("modalMaterialDesc");
const btnViewPrintPdf = document.getElementById("btnViewPrintPdf");
const btnWhatsappPdf = document.getElementById("btnWhatsappPdf");
const btnRequestHardCopy = document.getElementById("btnRequestHardCopy");

let activeMaterial = null;

// Study Material Data
const studyMaterialsData = {
    math: {
        title: "Class 10 Math Formula Handbook (CBSE & ICSE)",
        desc: "Complete formula reference covering Real Numbers (Euclid's & Fundamental Theorem), Polynomials & Quadratic Roots, Arithmetic Progressions, Coordinate Geometry, Trigonometry Identities, Circles Theorems, and Surface Areas & Volumes.",
        waMsg: "Hello Shashwat Coaching! Please send me the complete 'Class 10 Math Formula Handbook' PDF booklet.",
        contentHtml: `
            <div style="font-family: Arial, sans-serif; padding: 25px; max-width: 800px; margin: auto; color: #1e293b;">
                <div style="text-align: center; border-bottom: 2px solid #1d4ed8; padding-bottom: 15px; margin-bottom: 20px;">
                    <h1 style="color: #1d4ed8; margin: 0;">Shashwat Coaching Centre</h1>
                    <p style="margin: 5px 0; color: #64748b;">Kaili Road, Chandauli (U.P.) • Contact: +91 9450129799</p>
                    <h2 style="color: #0f172a; margin-top: 10px;">Class 10th Mathematics High-Yield Formula Sheet</h2>
                </div>

                <div style="margin-bottom: 20px;">
                    <h3 style="background: #e0f2fe; padding: 8px 12px; border-left: 4px solid #0284c7; margin-bottom: 10px;">1. Real Numbers & Polynomials</h3>
                    <p>• <strong>HCF × LCM</strong> = Product of two numbers: <code>HCF(a, b) × LCM(a, b) = a × b</code></p>
                    <p>• Quadratic Equation: <code>ax² + bx + c = 0</code></p>
                    <p>• Roots Formula: <code>x = (-b ± √(b² - 4ac)) / (2a)</code></p>
                    <p>• Discriminant: <code>D = b² - 4ac</code> (D > 0: Real & Distinct; D = 0: Real & Equal; D < 0: No Real Roots)</p>
                    <p>• Sum of Roots: <code>α + β = -b/a</code> | Product of Roots: <code>αβ = c/a</code></p>
                </div>

                <div style="margin-bottom: 20px;">
                    <h3 style="background: #e0f2fe; padding: 8px 12px; border-left: 4px solid #0284c7; margin-bottom: 10px;">2. Arithmetic Progression (A.P.)</h3>
                    <p>• <strong>n-th Term</strong>: <code>aₙ = a + (n - 1)d</code></p>
                    <p>• <strong>Sum of first n terms</strong>: <code>Sₙ = (n/2) [2a + (n - 1)d] = (n/2) [a + l]</code></p>
                </div>

                <div style="margin-bottom: 20px;">
                    <h3 style="background: #e0f2fe; padding: 8px 12px; border-left: 4px solid #0284c7; margin-bottom: 10px;">3. Coordinate Geometry</h3>
                    <p>• <strong>Distance Formula</strong>: <code>d = √((x₂ - x₁)² + (y₂ - y₁)²)</code></p>
                    <p>• <strong>Section Formula</strong>: <code>( (m₁x₂ + m₂x₁)/(m₁+m₂), (m₁y₂ + m₂y₁)/(m₁+m₂) )</code></p>
                    <p>• <strong>Midpoint Formula</strong>: <code>( (x₁+x₂)/2, (y₁+y₂)/2 )</code></p>
                </div>

                <div style="margin-bottom: 20px;">
                    <h3 style="background: #e0f2fe; padding: 8px 12px; border-left: 4px solid #0284c7; margin-bottom: 10px;">4. Trigonometry Identities</h3>
                    <p>• <code>sin²θ + cos²θ = 1</code></p>
                    <p>• <code>1 + tan²θ = sec²θ</code> &nbsp;|&nbsp; <code>1 + cot²θ = cosec²θ</code></p>
                    <p>• <code>tan θ = sin θ / cos θ</code> &nbsp;|&nbsp; <code>cot θ = cos θ / sin θ</code></p>
                    <p>• Values: <code>sin 30° = 1/2</code>, <code>sin 45° = 1/√2</code>, <code>sin 60° = √3/2</code>, <code>tan 45° = 1</code></p>
                </div>

                <div style="margin-bottom: 20px;">
                    <h3 style="background: #e0f2fe; padding: 8px 12px; border-left: 4px solid #0284c7; margin-bottom: 10px;">5. Surface Areas and Volumes</h3>
                    <p>• <strong>Cylinder</strong>: Curved Surface Area = <code>2πrh</code> | Total Surface Area = <code>2πr(r+h)</code> | Volume = <code>πr²h</code></p>
                    <p>• <strong>Cone</strong>: Slant Height <code>l = √(r² + h²)</code> | CSA = <code>πrl</code> | Volume = <code>(1/3)πr²h</code></p>
                    <p>• <strong>Sphere</strong>: Surface Area = <code>4πr²</code> | Volume = <code>(4/3)πr³</code></p>
                </div>

                <div style="text-align: center; margin-top: 30px; padding-top: 15px; border-top: 1px solid #cbd5e1; font-size: 13px; color: #64748b;">
                    © Shashwat Coaching Centre, Kaili Road, Chandauli. Admissions Open for CBSE & ICSE. Call 9450129799
                </div>
            </div>
        `
    },
    science: {
        title: "Class 10 Science Key Diagrams & Reactions (CBSE & ICSE)",
        desc: "Essential Physics ray diagrams, circuit formulas, and high-weightage Chemistry balanced chemical reactions for quick board revision.",
        waMsg: "Hello Shashwat Coaching! Please send me the 'Class 10 Science Key Diagrams & Reactions' study material.",
        contentHtml: `
            <div style="font-family: Arial, sans-serif; padding: 25px; max-width: 800px; margin: auto; color: #1e293b;">
                <div style="text-align: center; border-bottom: 2px solid #1d4ed8; padding-bottom: 15px; margin-bottom: 20px;">
                    <h1 style="color: #1d4ed8; margin: 0;">Shashwat Coaching Centre</h1>
                    <p style="margin: 5px 0; color: #64748b;">Kaili Road, Chandauli (U.P.) • Contact: +91 9450129799</p>
                    <h2 style="color: #0f172a; margin-top: 10px;">Class 10th Science Key Revision Sheet</h2>
                </div>

                <div style="margin-bottom: 20px;">
                    <h3 style="background: #dcfce7; padding: 8px 12px; border-left: 4px solid #16a34a; margin-bottom: 10px;">1. Chemistry: High-Yield Board Reactions</h3>
                    <p>• <strong>Combustion of Magnesium</strong>: <code>2Mg + O₂ → 2MgO</code> (Dazzling white flame)</p>
                    <p>• <strong>Quicklime to Slaked Lime</strong>: <code>CaO + H₂O → Ca(OH)₂ + Heat</code> (Exothermic)</p>
                    <p>• <strong>Decomposition of Lead Nitrate</strong>: <code>2Pb(NO₃)₂ → 2PbO + 4NO₂↑ + O₂↑</code> (Brown fumes of NO₂)</p>
                    <p>• <strong>Displacement Reaction</strong>: <code>Fe + CuSO₄ (blue) → FeSO₄ (pale green) + Cu (reddish brown)</code></p>
                    <p>• <strong>Neutralization</strong>: <code>NaOH + HCl → NaCl + H₂O</code></p>
                    <p>• <strong>Plaster of Paris</strong>: <code>CaSO₄·½H₂O + 1½H₂O → CaSO₄·2H₂O</code> (Gypsum)</p>
                </div>

                <div style="margin-bottom: 20px;">
                    <h3 style="background: #dcfce7; padding: 8px 12px; border-left: 4px solid #16a34a; margin-bottom: 10px;">2. Physics: Optics & Electricity Formulas</h3>
                    <p>• <strong>Mirror Formula</strong>: <code>1/f = 1/v + 1/u</code> | Magnification: <code>m = -v/u = h'/h</code></p>
                    <p>• <strong>Lens Formula</strong>: <code>1/f = 1/v - 1/u</code> | Magnification: <code>m = v/u = h'/h</code></p>
                    <p>• <strong>Power of Lens</strong>: <code>P = 1/f (in meters)</code> (Unit: Dioptre, D)</p>
                    <p>• <strong>Ohm's Law</strong>: <code>V = I × R</code></p>
                    <p>• <strong>Resistance in Series</strong>: <code>R_s = R₁ + R₂ + R₃</code></p>
                    <p>• <strong>Resistance in Parallel</strong>: <code>1/R_p = 1/R₁ + 1/R₂ + 1/R₃</code></p>
                    <p>• <strong>Joule's Law of Heating</strong>: <code>H = I²Rt = VIt = (V²/R)t</code></p>
                    <p>• <strong>Electric Power</strong>: <code>P = VI = I²R = V²/R</code></p>
                </div>

                <div style="text-align: center; margin-top: 30px; padding-top: 15px; border-top: 1px solid #cbd5e1; font-size: 13px; color: #64748b;">
                    © Shashwat Coaching Centre, Kaili Road, Chandauli. Admissions Open for CBSE & ICSE. Call 9450129799
                </div>
            </div>
        `
    },
    pyq: {
        title: "CBSE & ICSE 5-Year Solved Board PYQs",
        desc: "Chapter-wise analysis of most frequently repeated questions in Science and Mathematics from board examinations (2020-2025).",
        waMsg: "Hello Shashwat Coaching! Please send me the '5-Year Solved Board PYQs' for CBSE/ICSE.",
        contentHtml: `
            <div style="font-family: Arial, sans-serif; padding: 25px; max-width: 800px; margin: auto; color: #1e293b;">
                <div style="text-align: center; border-bottom: 2px solid #1d4ed8; padding-bottom: 15px; margin-bottom: 20px;">
                    <h1 style="color: #1d4ed8; margin: 0;">Shashwat Coaching Centre</h1>
                    <p style="margin: 5px 0; color: #64748b;">Kaili Road, Chandauli (U.P.) • Contact: +91 9450129799</p>
                    <h2 style="color: #0f172a; margin-top: 10px;">CBSE & ICSE Top Board Exam PYQs Blueprint</h2>
                </div>

                <div style="margin-bottom: 20px;">
                    <h3 style="background: #fef3c7; padding: 8px 12px; border-left: 4px solid #d97706; margin-bottom: 10px;">Mathematics Most Repeated 5-Mark Questions</h3>
                    <p>1. <strong>Prove that √5 is irrational</strong> (Appeared in 2020, 2022, 2024 CBSE/ICSE).</p>
                    <p>2. <strong>Basic Proportionality Theorem (Thales Theorem)</strong>: State and prove that if a line is drawn parallel to one side of a triangle to intersect the other two sides in distinct points, the other two sides are divided in the same ratio.</p>
                    <p>3. <strong>Heights & Distances</strong>: Two poles of equal heights are standing opposite each other on either side of the road... Find height of poles and distance of the point.</p>
                    <p>4. <strong>Solve for x and y using cross-multiplication or elimination method</strong>.</p>
                </div>

                <div style="margin-bottom: 20px;">
                    <h3 style="background: #fef3c7; padding: 8px 12px; border-left: 4px solid #d97706; margin-bottom: 10px;">Science Most Repeated Board Questions</h3>
                    <p>1. <strong>Ray Diagrams for Concave Mirror</strong>: Object between C and F, and object between P and F.</p>
                    <p>2. <strong>Human Eye Defects</strong>: Draw diagram illustrating Myopia and Hypermetropia, and their corrections with suitable lenses.</p>
                    <p>3. <strong>Electrolysis of Acidified Water</strong>: Why is the volume of gas collected at one electrode double of the other? Name the gases.</p>
                    <p>4. <strong>Saponification & Esterification Reactions</strong>: Complete balanced chemical equations with conditions.</p>
                </div>

                <div style="text-align: center; margin-top: 30px; padding-top: 15px; border-top: 1px solid #cbd5e1; font-size: 13px; color: #64748b;">
                    Get full chapter-wise solved answers with step-marking at our centre. Kaili Road, Chandauli • Call 9450129799
                </div>
            </div>
        `
    }
};

// 1. Mobile Menu Toggle
if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        const icon = mobileMenuBtn.querySelector("i");
        if (icon) {
            icon.classList.toggle("fa-bars");
            icon.classList.toggle("fa-times");
        }
    });

    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
            const icon = mobileMenuBtn.querySelector("i");
            if (icon) {
                icon.classList.add("fa-bars");
                icon.classList.remove("fa-times");
            }
        });
    });
}

// 2. Helper: Scroll to form and focus with visual animation
function scrollToFormAndFocus(targetClass, customMsg) {
    const contactSection = document.getElementById("contact");
    const classSelect = document.getElementById("classLevel");
    const messageInput = document.getElementById("message");
    const nameInput = document.getElementById("studentName");
    const formBox = document.querySelector(".contact-form-box");

    if (targetClass && classSelect) {
        classSelect.value = targetClass;
    }

    if (customMsg && messageInput) {
        messageInput.value = customMsg;
    }

    if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // Apply visual pulse effect to form
    if (formBox) {
        formBox.classList.remove("form-highlight-pulse");
        void formBox.offsetWidth; // Trigger reflow
        formBox.classList.add("form-highlight-pulse");
    }

    setTimeout(() => {
        if (nameInput) nameInput.focus();
    }, 450);
}

// 3. Attach Functionality to All Action Buttons Across the Site
function setupInteractiveButtons() {
    // A. Demo Class Buttons (Announcement bar, Hero primary button)
    document.querySelectorAll('[data-action="demo"]').forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            scrollToFormAndFocus("Class 10", "Hello! I would like to book a 2-Day Free Demo Class for Science & Mathematics.");
        });
    });

    // B. "Explore Batches" Button in Hero
    document.querySelectorAll('[data-action="explore-batches"]').forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const coursesSection = document.getElementById("courses");
            if (coursesSection) {
                coursesSection.scrollIntoView({ behavior: "smooth" });
                const cards = coursesSection.querySelectorAll(".course-card");
                cards.forEach(card => {
                    card.style.transform = "translateY(-8px)";
                    setTimeout(() => card.style.transform = "", 600);
                });
            }
        });
    });

    // C. Course Card "Enquire Batch" Buttons
    document.querySelectorAll('[data-action="enquire-course"]').forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const targetClass = btn.getAttribute("data-class") || "Class 10";
            const customMsg = btn.getAttribute("data-msg") || `I want to enquire about the ${btn.getAttribute("data-course")} batch.`;
            scrollToFormAndFocus(targetClass, customMsg);
        });
    });

    // D. Notice Card Action Buttons ("Reserve Seat", "Register STSE", "Join Revision")
    document.querySelectorAll('[data-action="notice-apply"]').forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const targetClass = btn.getAttribute("data-class") || "Class 10";
            const customMsg = btn.getAttribute("data-msg") || "I would like to enquire about this notice announcement.";
            scrollToFormAndFocus(targetClass, customMsg);
        });
    });

    // E. Study Material "Get Free PDF" Buttons
    document.querySelectorAll('[data-action="open-material"]').forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const matKey = btn.getAttribute("data-material");
            openMaterialModal(matKey);
        });
    });
}

// 4. Study Material Modal Logic
function openMaterialModal(matKey) {
    activeMaterial = studyMaterialsData[matKey] || studyMaterialsData.math;

    if (modalMaterialTitle) modalMaterialTitle.textContent = activeMaterial.title;
    if (modalMaterialDesc) modalMaterialDesc.textContent = activeMaterial.desc;

    // Setup WhatsApp direct link
    if (btnWhatsappPdf) {
        btnWhatsappPdf.href = `https://wa.me/9450129799?text=${encodeURIComponent(activeMaterial.waMsg)}`;
    }

    if (materialModal) {
        materialModal.style.display = "flex";
        document.body.style.overflow = "hidden"; // Prevent scrolling while modal open
    }
}

function closeModal() {
    if (materialModal) {
        materialModal.style.display = "none";
        document.body.style.overflow = "";
    }
}

if (closeMaterialModal) {
    closeMaterialModal.addEventListener("click", closeModal);
}

// Close when clicking modal backdrop
if (materialModal) {
    materialModal.addEventListener("click", (e) => {
        if (e.target === materialModal) closeModal();
    });
}

// Close on Escape key
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && materialModal && materialModal.style.display === "flex") {
        closeModal();
    }
});

// Modal Action: View & Print Revision Sheet Now
if (btnViewPrintPdf) {
    btnViewPrintPdf.addEventListener("click", () => {
        if (!activeMaterial) return;

        const printWindow = window.open("", "_blank", "width=850,height=900");
        if (printWindow) {
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>${activeMaterial.title} - Shashwat Coaching</title>
                    <style>
                        body { margin: 0; background: #fff; }
                        @media print {
                            .no-print { display: none !important; }
                        }
                        .print-bar {
                            background: #0f172a;
                            color: white;
                            padding: 12px 20px;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            font-family: sans-serif;
                        }
                        .print-btn {
                            background: #38bdf8;
                            color: #0f172a;
                            border: none;
                            padding: 8px 18px;
                            border-radius: 6px;
                            font-weight: bold;
                            cursor: pointer;
                        }
                    </style>
                </head>
                <body>
                    <div class="print-bar no-print">
                        <span><strong>Shashwat Coaching Centre</strong> — ${activeMaterial.title}</span>
                        <button class="print-btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
                    </div>
                    ${activeMaterial.contentHtml}
                </body>
                </html>
            `);
            printWindow.document.close();
        } else {
            alert("Please allow pop-ups for this site to view and print the formula sheet.");
        }
    });
}

// Modal Action: Collect Free Hardcopy at Centre
if (btnRequestHardCopy) {
    btnRequestHardCopy.addEventListener("click", () => {
        const title = activeMaterial ? activeMaterial.title : "Study Material";
        closeModal();
        scrollToFormAndFocus("Class 10", `Hello! I would like to visit the centre on Kaili Road to collect a printed copy of "${title}".`);
    });
}

// 5. Fetch and Render Live Notices from Backend
async function loadNotices() {
    if (!noticeContainer) return;

    try {
        const response = await fetch(`${API_BASE_URL}/notices`);
        if (!response.ok) return;

        const result = await response.json();
        if (result.success && Array.isArray(result.data) && result.data.length > 0) {
            noticeContainer.innerHTML = result.data.map(notice => {
                const badgeClass = notice.badge === "New" ? "badge-new" :
                                   notice.badge === "Upcoming" ? "badge-event" : "badge-test";
                return `
                    <div class="notice-item">
                        <div class="notice-meta">
                            <span class="notice-badge ${badgeClass}">${notice.badge || "Notice"}</span>
                            <span class="notice-date"><i class="far fa-calendar-alt"></i> ${notice.date || ""}</span>
                        </div>
                        <h4>${notice.title}</h4>
                        <p>${notice.description}</p>
                        <button class="btn-notice-action" data-action="notice-apply" data-class="Class 10" data-msg="I am inquiring regarding: ${notice.title}">
                            Enquire on this Notice <i class="fas fa-arrow-right"></i>
                        </button>
                    </div>
                `;
            }).join("");

            // Re-bind interactive buttons for dynamic notices
            setupInteractiveButtons();
        }
    } catch (err) {
        console.log("Using static notices fallback:", err.message);
    }
}

// 6. Enquiry Form Submission (Web3Forms & Backend Integration)
if (enquiryForm) {
    enquiryForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const name = document.getElementById("studentName").value.trim();
        const phone = document.getElementById("studentPhone").value.trim();
        const email = document.getElementById("studentEmail").value.trim();
        const classLevel = document.getElementById("classLevel").value;
        const board = document.getElementById("board").value;
        const message = document.getElementById("message").value.trim();

        if (!name || !phone) {
            showFormMessage("Please enter your name and phone number.", "error");
            return;
        }

        const cleanPhone = phone.replace(/\D/g, "");
        if (cleanPhone.length < 10) {
            showFormMessage("Please enter a valid 10-digit mobile number.", "error");
            return;
        }

        setSubmittingState(true);

        // Web3Forms payload
        const web3Data = {
            access_key: "5c0ccdc5-c90e-4a34-852c-4c978ca34a7d",
            name: name,
            phone: cleanPhone,
            email: email || "Not provided",
            class_level: classLevel,
            board: board,
            message: message || "No special message provided",
            subject: `New Admission Enquiry: ${name} (${classLevel} - ${board})`,
            from_name: "Shashwat Coaching Website"
        };

        // Also prepare backend payload for local/MongoDB sync
        const backendPayload = {
            name,
            phone: cleanPhone,
            email,
            classLevel,
            board,
            message
        };

        try {
            // Submit directly to Web3Forms
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(web3Data)
            });

            const data = await response.json();

            // Sync with local backend in parallel (non-blocking)
            fetch(`${API_BASE_URL}/enquiries`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(backendPayload)
            }).catch(e => console.log("Local backend sync:", e.message));

            if (data.success) {
                showFormMessage(
                    `🎉 Thank you, <strong>${name}</strong>! Your admission enquiry has been successfully delivered to our team. We will contact you at <strong>${cleanPhone}</strong> shortly.`,
                    "success"
                );
                enquiryForm.reset();
            } else {
                showFormMessage(data.message || "Unable to send enquiry. Please try WhatsApp.", "error");
            }
        } catch (error) {
            console.error("Web3Forms submission error:", error);
            const fallbackWhatsAppText = encodeURIComponent(
                `Hello Shashwat Coaching! I want to enquire for admission.\nName: ${name}\nPhone: ${cleanPhone}\nClass: ${classLevel}\nBoard: ${board}\nMessage: ${message}`
            );
            showFormMessage(
                `Network connection issue. <a href="https://wa.me/9450129799?text=${fallbackWhatsAppText}" target="_blank" style="color: #15803d; text-decoration: underline; font-weight: bold;">Click here to send your enquiry directly via WhatsApp</a>.`,
                "success"
            );
        } finally {
            setSubmittingState(false);
        }
    });
}

function setSubmittingState(isSubmitting) {
    if (!submitBtn) return;
    submitBtn.disabled = isSubmitting;
    if (btnText && btnLoader) {
        btnText.style.display = isSubmitting ? "none" : "inline";
        btnLoader.style.display = isSubmitting ? "inline-block" : "none";
    }
}

function showFormMessage(text, type) {
    if (!formMessage) return;
    formMessage.innerHTML = text;
    formMessage.className = `form-status-msg ${type}`;
}

// 7. Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
    setupInteractiveButtons();
    loadNotices();
});
