# Shashwat Coaching Centre 🎓
### Premier Science & Mathematics Coaching for CBSE & ICSE (Classes 8th - 12th)
**Location:** Kaili Road, Chandauli, Uttar Pradesh

---

## 🌟 New Features Added

### 1. 📋 End-to-End Enquiry & Admission System (Web3Forms + MongoDB)
- **Web3Forms Integration**: Connected with your Web3Forms access key (`5c0ccdc5-c90e-4a34-852c-4c978ca34a7d`). Every enquiry submitted on the website sends an instant email notification straight to your inbox with student details!
- **Dual-Sync Backend**: Submissions are also saved to your local MongoDB database / Admin Portal in parallel.
- **Fail-safe Lead Guarantee**: If the network connection is ever interrupted, the form provides a 1-click **WhatsApp instant transfer** so prospective student inquiries are never lost!

### 2. 🛡️ Staff & Admin Lead Manager (`admin.html`)
- **Real-time Leads Table**: View all prospective students and inquiries.
- **One-Click Actions**:
  - 📞 **Direct Call Button**: Dial student/parent immediately.
  - 💬 **WhatsApp Quick Chat**: Open pre-filled WhatsApp conversation addressing the student by name.
  - 🔄 **Status Selector**: Dynamically update student status from *New* to *Demo Scheduled* or *Enrolled*.
  - 🗑️ **Delete Option**: Clean up duplicate or closed leads.
- **Search & Filter Tabs**: Filter leads by status or search by student name/phone number.

### 3. 📢 Coaching Notice Board & Live Announcements
- Dynamic announcement ticker at the top of the website.
- Notice board section with categorized alerts (*Admissions Open*, *STSE Scholarship Test*, *Fast-track Revision Batches*).
- Express route (`GET /api/notices`) serving announcements.

### 4. 🏆 Hall of Fame & Toppers Showcase
- Highlights 95%+ scorers in CBSE and ICSE board exams with student quotes and subject scores.
- Stats counter bar (95%+ Board Scores, 100% Pass Percentage, 500+ Students Mentored, 10+ Years of Teaching).

### 5. 📚 Free Study Material & Formula Sheets
- Direct resource cards for Class 10 Math Formula Handbook, Science Key Diagrams, and 5-Year Solved Board PYQs.
- 1-click integration with the enquiry form.

### 6. 📍 Interactive Google Map & Direct Contact
- Embedded Google Map for Kaili Road, Chandauli.
- Floating WhatsApp and Call buttons for high mobile conversion.

---

## 🚀 How to Run the Project

### Step 1: Configure MongoDB Atlas (Optional but Recommended)
Open [backend/.env](file:///c:/Users/shash/OneDrive/my%20projects/shashwat%20coaching/backend/.env) and replace `<db_password>` with your MongoDB Atlas database password:
```env
MONGO_URI="mongodb+srv://shashwatsrivastav111_db_user:YOUR_PASSWORD@cluster0.dc1aj8d.mongodb.net/shashwat_coaching?retryWrites=true&w=majority"
```
*(Note: If the password is not yet set, the server automatically runs in safe memory buffer mode so inquiries are still received!)*

### Step 2: Start the Backend Server
Open your terminal and run:
```bash
cd backend
npm start
```
*Or for auto-reloading during development:*
```bash
npm run dev
```

### Step 3: Open in Browser
- **Main Website**: [http://localhost:5001](http://localhost:5001)
- **Admin & Lead Portal**: [http://localhost:5001/admin.html](http://localhost:5001/admin.html)
- **API Status**: [http://localhost:5001/api/health](http://localhost:5001/api/health)
