from fastapi.testclient import TestClient
from datetime import date
from uuid import UUID
from app.main import app
from app.database import SessionLocal
from app.models.user import User, UserRole
from app.models.item import Item, ReportType, ItemStatus
from app.services.auth_service import hash_password, create_access_token

client = TestClient(app)

def test_submit_found_item_user_case():
    db = SessionLocal()
    try:
        # Ensure student user exists
        student = db.query(User).filter(User.email == "stu001@campus.edu").first()
        if not student:
            student = User(
                name="Student STU001",
                student_id="STU001",
                email="stu001@campus.edu",
                password_hash=hash_password("STU001"),
                role=UserRole.STUDENT,
                is_active=True,
            )
            db.add(student)
            db.commit()
            db.refresh(student)

        # Generate access token
        token = create_access_token(str(student.id), student.role.value)
        headers = {"Authorization": f"Bearer {token}"}

        # Form data as requested by user
        payload = {
            "item_name": "keys",
            "category": "Study Materials",
            "location": "Canteen",
            "date_reported": "2026-08-19",
            "time_reported": "7",
            "description": "key found",
        }

        response = client.post("/items/found", data=payload, headers=headers)
        print("\nResponse Status Code:", response.status_code)
        print("Response Body:", response.json())

        assert response.status_code == 201, f"Expected 201, got {response.status_code}: {response.text}"
        res_data = response.json()
        assert res_data["item_name"] == "keys"
        assert res_data["category"] == "Study Materials"
        assert res_data["location"] == "Canteen"
        assert res_data["date_reported"] == "2026-08-19"
        assert res_data["time_reported"] == "7"
        assert res_data["description"] == "key found"
        assert res_data["report_type"] == "FOUND"

        # Verify in DB
        db_item = db.query(Item).filter(Item.id == UUID(res_data["id"])).first()
        assert db_item is not None
        assert db_item.item_name == "keys"
        assert db_item.category == "Study Materials"
        assert db_item.location == "Canteen"
        assert str(db_item.date_reported) == "2026-08-19"
        assert db_item.time_reported == "7"
        assert db_item.description == "key found"
        print("[SUCCESS] Found item saved and verified in database!")

    finally:
        db.close()
