from pathlib import Path

readme = r"""# CampusFind — Smart College Lost & Found Management System

> **Lost. Found. Reconnected.**

CampusFind is a smart college lost-and-found management system designed to make reporting, matching, claiming, verification, and collection of lost items easier and more secure.

The system connects students, administrators, and the Main Security Desk through a single platform. It uses a weighted smart-matching approach to identify potentially related lost and found reports while keeping final claim approval under administrative control.

---

## 📌 Problem Statement

In colleges, lost items are often reported through informal channels such as WhatsApp groups, classroom messages, notice boards, or word of mouth. This makes it difficult to:

- Find relevant lost or found reports quickly
- Match a lost item with the correct found item
- Track the status of a report or claim
- Verify ownership safely
- Coordinate item collection
- Maintain a proper record of recovered items

CampusFind provides a centralized and structured solution for the complete lost-and-found process.

---

## 💡 Proposed Solution

CampusFind provides a digital platform where:

1. Students report lost or found items.
2. The system searches for potential matches.
3. A smart matching engine calculates compatibility using item, category, location, description, and date information.
4. Students can submit claims for matched items.
5. Administrators review the claim and supporting evidence.
6. Approved claims generate a secure Collection OTP.
7. The student receives the OTP and collection instructions.
8. The Main Security Desk receives a collection notification.
9. Security staff verifies the OTP.
10. The item is marked as **RETURNED** after successful verification.

---

## ✨ Key Features

### 👨‍🎓 Student Features

- Student registration and login
- Report a lost item
- Report a found item
- Add item details, location, date, time, category, and description
- Upload item images where applicable
- View personal reports
- View potential matches
- Submit claims
- Provide ownership evidence
- Receive claim-status notifications
- Receive Collection OTP after approval
- Track the collection process

### 🛡️ Admin Features

- Secure admin login
- View and manage lost/found reports
- Review AI-assisted matches
- Review claim details and ownership evidence
- View match score and score breakdown
- Approve or reject claims
- Automatically initiate the collection workflow after approval
- Delete duplicate or invalid reports
- View analytics
- Monitor system activity and timelines

### 🔐 Security Desk Features

- Dedicated Security Desk access
- View pending item collections
- Receive collection notifications
- View claimant and item information
- Verify Collection OTP
- Complete the handover process
- View completed collections
- Prevent reuse of an already-used or expired OTP

---

## 🤖 Smart Matching System

CampusFind uses a weighted matching approach rather than relying only on exact item-name matching.

### Matching Weights

| Matching Factor | Weight |
|---|---:|
| Item / Name Similarity | 30% |
| Category | 20% |
| Location | 20% |
| Description | 20% |
| Date Proximity | 10% |
| **Total** | **100%** |

### Match Categories

| Score | Result |
|---:|---|
| 80–100% | Strong Match |
| 60–79% | Possible Match |
| 40–59% | Weak Match |
| 0–39% | Low Match |

### Hard Validation Rules

The system also prevents obviously invalid matches.

#### 1. Chronology Validation

A found item cannot be matched to a lost report when:

`Found Date < Lost Date`

Such a case is rejected as:

**INVALID — Impossible Chronology**

#### 2. Incompatible Item Types

Clearly incompatible item types are rejected instead of being presented as misleading matches.

For example:

- Earphones ↔ Mobile Phone → Invalid
- Earphones ↔ USB Drive → Invalid

This improves the reliability of the matching process.

---

## 🔄 Complete System Workflow

```text
                 ┌─────────────────────┐
                 │       Student       │
                 └──────────┬──────────┘
                            │
                    Report Lost / Found
                            │
                            ▼
                 ┌─────────────────────┐
                 │    Smart Matching   │
                 │       Engine        │
                 └──────────┬──────────┘
                            │
                     Potential Match
                            │
                            ▼
                 ┌─────────────────────┐
                 │   Claim Submitted   │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │   Admin Review      │
                 │ Evidence + Match    │
                 └──────────┬──────────┘
                            │
                    Approve / Reject
                            │
                            ▼
                 ┌─────────────────────┐
                 │ Collection OTP      │
                 │     Generated       │
                 └───────┬─────┬───────┘
                         │     │
                  Student     Security Desk
                         │     │
                         ▼     ▼
                    OTP Verification
                         │
                         ▼
                 ┌─────────────────────┐
                 │  Item Returned      │
                 │  Status = RETURNED  │
                 └─────────────────────┘
🔐 Claim & OTP Verification

CampusFind does not automatically approve a claim only because the matching score is high.

The claim follows a controlled verification process:

Lost Report
     ↓
Smart Match
     ↓
Claim
     ↓
Ownership Evidence
     ↓
Admin Review
     ↓
Claim Approved
     ↓
Collection OTP
     ↓
Main Security Desk
     ↓
OTP Verification
     ↓
Item Returned

The Collection OTP is intended to verify the handover at the Main Security Desk.

The backend validates:

Claim status
OTP existence
OTP expiration
OTP usage status
OTP correctness
Item return status

After successful verification, the item is marked as returned and the collection event is recorded in the timeline.

👥 User Roles
Role	Main Responsibilities
STUDENT	Report items, view matches, submit claims, receive OTP
ADMIN	Manage reports, review claims, approve/reject, monitor analytics
SECURITY	Verify OTP and complete item collection
🏗️ Technical Architecture
┌──────────────────────────────────────────────┐
│                 Frontend                     │
│          React + Vite + Tailwind             │
│                                              │
│ Student Dashboard | Admin | Security Desk    │
└──────────────────────┬───────────────────────┘
                       │ REST API
                       ▼
┌──────────────────────────────────────────────┐
│                  Backend                     │
│                FastAPI                      │
│                                              │
│ Authentication | Reports | Claims           │
│ Matching       | Notifications | Analytics  │
│ Timeline       | OTP Verification            │
└──────────────────────┬───────────────────────┘
                       │ SQLAlchemy
                       ▼
┌──────────────────────────────────────────────┐
│                 Database                     │
│        PostgreSQL (Production)               │
│        SQLite (Local Development)            │
└──────────────────────────────────────────────┘
🛠️ Technology Stack
Frontend
React
Vite
Tailwind CSS
React Router
Axios
Recharts
Backend
Python
FastAPI
SQLAlchemy
JWT Authentication
REST APIs
Database
PostgreSQL — production
SQLite — local development/testing
Matching
Python-based weighted matching engine
Item/name similarity
Category matching
Location matching
Description similarity
Date proximity
Hard validation rules
Development & Deployment
Git
GitHub
Vercel — frontend deployment
Render — backend deployment
📁 Project Structure
lost-and-found/
│
├── campusfind/
│   │
│   ├── backend/
│   │   ├── app/
│   │   │   ├── matching/
│   │   │   ├── models/
│   │   │   ├── routes/
│   │   │   ├── schemas/
│   │   │   ├── services/
│   │   │   └── main.py
│   │   │
│   │   ├── tests/
│   │   ├── requirements.txt
│   │   └── ...
│   │
│   └── frontend/
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── services/
│       │   └── ...
│       ├── package.json
│       └── ...
│
└── data/
    └── hypothetical_lost_and_found_dataset.csv
🚀 Local Setup
Prerequisites

Make sure the following are installed:

Python 3.x
Node.js
npm
Git
1. Clone the Repository
git clone https://github.com/bhargavik277/lost-and-found.git
cd lost-and-found
2. Backend Setup
cd campusfind/backend

Create and activate the virtual environment:

Windows
..\venv\Scripts\Activate.ps1

Install dependencies:

pip install -r requirements.txt

Run the backend:

uvicorn app.main:app --reload

The backend will normally be available at:

http://127.0.0.1:8000
3. Frontend Setup

Open another terminal:

cd campusfind/frontend

Install dependencies:

npm install

Run the development server:

npm run dev

The frontend will normally be available at:

http://localhost:5173
⚙️ Environment Variables

The frontend uses:

VITE_API_URL=http://127.0.0.1:8000

For production, set the API URL to the deployed backend.

The backend uses environment variables for configuration such as:

DATABASE_URL=
JWT_SECRET=
JWT_ALGORITHM=HS256
JWT_EXPIRE_DAYS=30
CORS_ORIGINS=
UPLOAD_DIR=uploads
MAX_FILE_SIZE_MB=5

Do not commit .env files or secrets to GitHub.

👤 Demo Accounts

For demonstration/testing, the project includes demo roles.

Student
Email: stu001@campus.edu
Password: STU001
Role: STUDENT
Admin
Email: admin@campusfind.edu
Password: admin123
Role: ADMIN
Security Desk
Email: security@campusfind.edu
Password: security123
Role: SECURITY

Demo credentials should be changed or disabled before using the system in a real deployment.

🌐 Deployment
Frontend

The React frontend can be deployed using Vercel.

Backend

The FastAPI backend can be deployed using Render with a PostgreSQL database.

Production architecture:

User Browser
     │
     ▼
Vercel
React Frontend
     │
     │ HTTPS REST API
     ▼
Render
FastAPI Backend
     │
     ▼
PostgreSQL
🧪 Testing

The backend includes automated tests for important system workflows.

Run:

cd campusfind/backend
pytest

The test suite covers areas such as:

Matching validation
Impossible chronology
Incompatible item types
Claim workflow
Admin approval
Admin-only deletion
Timeline behavior
Item return status
Collection workflow

Build the frontend:

cd campusfind/frontend
npm run build
📊 Dataset

The project includes a hypothetical lost-and-found dataset used for testing and demonstrating analytics and system behavior.

The dataset contains fields such as:

Student ID
Item Name
Category
Location
Date Reported
Time Reported
Report Type
Recovered
Search Method
Difficulty
System Usefulness
Preferred Feature
Days to Recovery
Status

The dataset is intended for project demonstration/testing and does not represent real student records.

📈 Analytics

The admin dashboard provides system-level information such as:

Total reported items
Returned/recovered items
Pending claims
User information
Claim activity
Other system statistics supported by the dashboard

This helps administrators understand how effectively the lost-and-found system is being used.

🔔 Notification System

Notifications are generated for important events.

Examples include:

Student
CLAIM APPROVED

Your claim for 'keys' has been approved!

Collection OTP: 220506

Please visit the Main Security Desk to collect your item.
Security Desk
NEW COLLECTION REQUEST

A collection request for 'keys' has been approved.

Claimant: Student
Student ID: STU001

Verify the student's Collection OTP at the Main Security Desk.

The Security Desk notification does not need to expose the student's OTP.

🕒 Timeline

Important actions are recorded through the system timeline.

Examples:

Item Reported
      ↓
Potential Match Found
      ↓
Claim Submitted
      ↓
Claim Approved
      ↓
Collection OTP Generated
      ↓
Item Collected
      ↓
Item Returned

This provides traceability for the item lifecycle.

🔒 Security Considerations

CampusFind includes several security-oriented controls:

JWT-based authentication
Role-based access control
Admin-only sensitive operations
Protected security endpoints
Backend OTP verification
OTP expiration
Prevention of OTP reuse
Ownership evidence review
No automatic claim approval based only on match score
Validation of impossible dates
Validation of incompatible item types
Environment-based secrets
Production database support
🌱 Future Scope

Possible future improvements include:

Mobile application
Email/SMS notifications
QR-based item collection
College ID integration
More advanced semantic matching
Image-based item similarity
Computer vision for found-item images
Multi-campus support
Real-time notification delivery
Security Desk QR/OTP scanning
Improved analytics and reporting
Audit logs and advanced administrative controls
🎯 Project Impact

CampusFind aims to make college lost-and-found management:

Faster
Students can search and report items through one platform.

More Organized
Lost and found records are centralized.

More Reliable
Smart matching and validation reduce irrelevant matches.

More Secure
Claims are reviewed before collection and OTP verification protects the handover process.

More Transparent
Notifications and timelines provide visibility into the status of each report.

📸 Screenshots

Add project screenshots here:

docs/
├── student-dashboard.png
├── report-lost.png
├── report-found.png
├── matches.png
├── admin-dashboard.png
├── admin-claims.png
├── security-dashboard.png
└── otp-verification.png

Example:

![Student Dashboard](docs/student-dashboard.png)
👩‍💻 Contributors

Bhargavi Keche

CampusFind — Smart College Lost & Found Management System

📄 License

This project was developed as a college academic/project implementation.

If you plan to publish or reuse the project outside the academic context, add an appropriate open-source license such as MIT after confirming the intended usage and ownership.

⭐ Project Tagline

CampusFind — Lost. Found. Reconnected.
"""

path = Path("/mnt/data/README.md")
path.write_text(readme, encoding="utf-8")
print(f"Created {path} ({len(readme.splitlines())} lines)")

Analyzed
