CampusFind — Smart College Lost & Found Management System

Lost. Found. Reconnected.

CampusFind is a smart college lost-and-found management system designed to make reporting, matching, claiming, verification, and collection of lost items easier and more secure.

The system connects students, administrators, and the Main Security Desk through a single platform. It uses a weighted smart-matching approach to identify potentially related lost and found reports while keeping final claim approval under administrative control.

📌 Problem Statement

In colleges, lost items are often reported through informal channels such as WhatsApp groups, classroom messages, notice boards, or word of mouth. This makes it difficult to:

Find relevant lost or found reports quickly

Match a lost item with the correct found item

Track the status of a report or claim

Verify ownership safely

Coordinate item collection

Maintain a proper record of recovered items

CampusFind provides a centralized and structured solution for the complete lost-and-found process.

💡 Proposed Solution

Students report lost or found items.

The system searches for potential matches.

A smart matching engine calculates compatibility using item, category, location, description, and date information.

Students can submit claims for matched items.

Administrators review the claim and supporting evidence.

Approved claims generate a secure Collection OTP.

The student receives the OTP and collection instructions.

The Main Security Desk receives a collection notification.

Security staff verifies the OTP.

The item is marked as RETURNED after successful verification.

✨ Key Features

👨‍🎓 Student

Student registration and login

Report lost and found items

Add item details, location, date, time, category, and description

Upload item images where applicable

View personal reports and potential matches

Submit claims and ownership evidence

Receive claim-status notifications

Receive Collection OTP after approval

Track collection status

🛡️ Admin

Secure admin login

Manage lost/found reports

Review AI-assisted matches

Review claim details and ownership evidence

View match score and score breakdown

Approve or reject claims

Initiate collection workflow automatically after approval

Delete duplicate or invalid reports

View analytics

Monitor timelines and system activity

🔐 Security Desk

Dedicated Security Desk access

View pending collections

Receive collection notifications

View claimant and item information

Verify Collection OTP

Complete item handover

View completed collections

Prevent reuse of expired or already-used OTPs

🤖 Smart Matching System

CampusFind uses a weighted matching approach instead of relying only on exact item-name matching.

Matching Factor

Weight

Item / Name Similarity

30%

Category

20%

Location

20%

Description

20%

Date Proximity

10%

Total

100%

Match Categories

Score

Result

80–100%

Strong Match

60–79%

Possible Match

40–59%

Weak Match

0–39%

Low Match

Validation Rules

Chronology: A found item cannot match a lost report when the found date is earlier than the lost date. Such cases are marked INVALID — Impossible Chronology.

Incompatible item types: Clearly incompatible item types are rejected, reducing misleading matches. For example, earphones and mobile phones are not treated as a valid match merely because they are reported at similar locations.

🔄 Complete System Workflow

Student
   │
   ├── Report Lost / Found
   │
   ▼
Smart Matching Engine
   │
   ▼
Potential Match
   │
   ▼
Claim Submitted
   │
   ▼
Admin Review
   │
   ├── Reject
   │
   └── Approve
          │
          ▼
   Collection OTP Generated
          │
       ┌──┴──┐
       ▼     ▼
    Student  Security Desk
       │     │
       └──┬──┘
          ▼
     OTP Verification
          │
          ▼
      Item Returned

🔐 Claim & OTP Verification

CampusFind does not automatically approve a claim only because the matching score is high.

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

The backend validates the claim status, OTP existence, expiration, usage status, correctness, and item return status.

After successful verification:

OTP is marked as used

Item status becomes RETURNED

Item is marked recovered

Collection is recorded in the timeline

Relevant notifications are generated

👥 User Roles

Role

Responsibilities

STUDENT

Report items, view matches, submit claims, receive OTP

ADMIN

Manage reports, review claims, approve/reject, monitor analytics

SECURITY

Verify OTP and complete item collection

🏗️ Technical Architecture

┌──────────────────────────────────────────────┐
│                  Frontend                    │
│            React + Vite + Tailwind           │
│                                              │
│ Student Dashboard | Admin | Security Desk    │
└──────────────────────┬───────────────────────┘
                       │ REST API
                       ▼
┌──────────────────────────────────────────────┐
│                  Backend                     │
│                   FastAPI                    │
│                                              │
│ Authentication | Reports | Claims            │
│ Matching       | Notifications | Analytics   │
│ Timeline       | OTP Verification             │
└──────────────────────┬───────────────────────┘
                       │ SQLAlchemy
                       ▼
┌──────────────────────────────────────────────┐
│                  Database                    │
│       PostgreSQL (Production)                │
│       SQLite (Local Development)             │
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

Deployment

Git / GitHub

Vercel — frontend

Render — backend

PostgreSQL — production database

📁 Project Structure

lost-and-found/
│
├── campusfind/
│   ├── backend/
│   │   ├── app/
│   │   │   ├── matching/
│   │   │   ├── models/
│   │   │   ├── routes/
│   │   │   ├── schemas/
│   │   │   ├── services/
│   │   │   └── main.py
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

Python 3.x

Node.js

npm

Git

1. Clone the repository

git clone https://github.com/bhargavik277/lost-and-found.git
cd lost-and-found

2. Backend

cd campusfind/backend
pip install -r requirements.txt
uvicorn app.main:app --reload

Backend:

http://127.0.0.1:8000

3. Frontend

Open another terminal:

cd campusfind/frontend
npm install
npm run dev

Frontend:

http://localhost:5173

⚙️ Environment Variables

Frontend:

VITE_API_URL=http://127.0.0.1:8000

Backend configuration includes:

DATABASE_URL=
JWT_SECRET=
JWT_ALGORITHM=HS256
JWT_EXPIRE_DAYS=30
CORS_ORIGINS=
UPLOAD_DIR=uploads
MAX_FILE_SIZE_MB=5

Do not commit .env files or secrets to GitHub.

👤 Demo Accounts

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

Demo credentials are for project demonstration/testing and should be changed before real-world use.

🧪 Testing

Run backend tests:

cd campusfind/backend
pytest

The test suite covers important workflows including:

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

The project includes a hypothetical lost-and-found dataset for testing, demonstration, and analytics.

Fields include:

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

The dataset is hypothetical and does not represent real student records.

📈 Analytics

The admin dashboard provides system-level information such as:

Total reported items

Returned/recovered items

Pending claims

User information

Claim activity

Other supported system statistics

🔔 Notification System

Important events generate notifications.

Student example

CLAIM APPROVED

Your claim for 'keys' has been approved!

Collection OTP: 220506

Please visit the Main Security Desk to collect your item.

Security Desk example

NEW COLLECTION REQUEST

A collection request for 'keys' has been approved.

Claimant: Student
Student ID: STU001

Verify the student's Collection OTP at the Main Security Desk.

The Security Desk notification should not expose the student's OTP.

🕒 Timeline

Important actions are recorded through the item/claim timeline:

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

CampusFind includes:

JWT-based authentication

Role-based access control

Admin-only sensitive operations

Protected Security Desk endpoints

Backend OTP verification

OTP expiration

Prevention of OTP reuse

Ownership evidence review

No automatic claim approval based only on match score

Impossible-date validation

Incompatible-item validation

Environment-based secrets

🌱 Future Scope

Mobile application

Email/SMS notifications

QR-based item collection

College ID integration

Advanced semantic matching

Image-based item similarity

Computer vision for item images

Multi-campus support

Real-time notifications

Security Desk QR/OTP scanning

Advanced analytics and reporting

Detailed audit logs

🎯 Project Impact

Faster: Centralized reporting and matching reduce the effort needed to search for lost items.

More Organized: Lost and found records are maintained in one platform.

More Reliable: Smart matching and validation reduce irrelevant matches.

More Secure: Claims are reviewed before collection and OTP verification protects the handover.

More Transparent: Notifications and timelines make the status of each report visible.

📸 Screenshots

Recommended screenshot folder:

docs/
├── student-dashboard.png
├── report-lost.png
├── report-found.png
├── matches.png
├── admin-dashboard.png
├── admin-claims.png
├── security-dashboard.png
└── otp-verification.png

Add screenshots using:

![Student Dashboard](docs/student-dashboard.png)

👩‍💻 Contributor

Bhargavi Keche

CampusFind — Smart College Lost & Found Management System

📄 License

This project was developed as a college academic/project implementation.

⭐ CampusFind

Lost. Found. Reconnected.
