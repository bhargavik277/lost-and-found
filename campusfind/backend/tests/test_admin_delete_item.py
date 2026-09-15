import sys
import uuid
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from fastapi.testclient import TestClient
from app.main import app

def test_admin_delete_item_endpoints():
    client = TestClient(app)
    uid = uuid.uuid4().hex[:6]

    # 1. Register a student
    student_res = client.post('/auth/register', json={
        'name': f'Student User {uid}',
        'student_id': f'STU_{uid}',
        'email': f'student_{uid}@campus.edu',
        'password': 'password123'
    })
    assert student_res.status_code == 201
    student_token = student_res.json()['access_token']
    student_headers = {'Authorization': f'Bearer {student_token}'}

    # 2. Register another student
    student2_res = client.post('/auth/register', json={
        'name': f'Student Two {uid}',
        'student_id': f'STU2_{uid}',
        'email': f'student2_{uid}@campus.edu',
        'password': 'password123'
    })
    assert student2_res.status_code == 201
    student2_token = student2_res.json()['access_token']
    student2_headers = {'Authorization': f'Bearer {student2_token}'}

    # 3. Student reports a lost item
    lost_res = client.post('/items/lost', data={
        'item_name': 'Duplicate Keys Set',
        'category': 'Personal Items',
        'location': 'Library',
        'date_reported': '2026-09-12',
        'description': 'Set of 3 silver keys on a blue lanyard'
    }, headers=student_headers)
    assert lost_res.status_code == 201
    lost_id = lost_res.json()['id']

    # 4. Student 2 reports a found item
    found_res = client.post('/items/found', data={
        'item_name': 'Keys on Lanyard',
        'category': 'Personal Items',
        'location': 'Library',
        'date_reported': '2026-09-12',
        'description': 'Found keys with blue lanyard'
    }, headers=student2_headers)
    assert found_res.status_code == 201
    found_id = found_res.json()['id']

    # 5. Check match exists
    matches_res = client.get('/matches', headers=student_headers)
    assert matches_res.status_code == 200
    assert len(matches_res.json()) > 0

    # 6. Student submits a claim on found item
    claim_res = client.post('/claims', json={
        'item_id': found_id,
        'proof_description': 'Blue lanyard has a tiny whistle on it'
    }, headers=student_headers)
    assert claim_res.status_code == 201
    claim_id = claim_res.json()['id']

    # 7. Login as Admin
    admin_login = client.post('/auth/login', json={'email': 'admin@campusfind.edu', 'password': 'admin123'})
    assert admin_login.status_code == 200
    admin_token = admin_login.json()['access_token']
    admin_headers = {'Authorization': f'Bearer {admin_token}'}

    # 8. TEST: Student cannot delete item -> 403 Forbidden
    student_delete_res = client.delete(f'/admin/items/{lost_id}', headers=student_headers)
    assert student_delete_res.status_code == 403, f"Expected 403 for student, got {student_delete_res.status_code}"

    # 9. TEST: Deleting nonexistent item -> 404 Not Found
    random_uuid = str(uuid.uuid4())
    notFound_res = client.delete(f'/admin/items/{random_uuid}', headers=admin_headers)
    assert notFound_res.status_code == 404, f"Expected 404 for missing item, got {notFound_res.status_code}"

    # 10. TEST: Admin deletes the lost item (which has matches)
    admin_delete_lost = client.delete(f'/admin/items/{lost_id}', headers=admin_headers)
    assert admin_delete_lost.status_code == 200
    assert admin_delete_lost.json()['deleted_id'] == lost_id
    assert admin_delete_lost.json()['message'] == 'Item deleted successfully.'

    # Verify lost item is gone
    get_lost_res = client.get(f'/items/{lost_id}')
    assert get_lost_res.status_code == 404

    # 11. TEST: Admin deletes the found item (which has active claim and matches)
    admin_delete_found = client.delete(f'/admin/items/{found_id}', headers=admin_headers)
    assert admin_delete_found.status_code == 200
    assert admin_delete_found.json()['deleted_id'] == found_id

    # Verify found item is gone
    get_found_res = client.get(f'/items/{found_id}')
    assert get_found_res.status_code == 404

    # Verify claimant received a notification about removal
    notifs_res = client.get('/notifications', headers=student_headers)
    assert notifs_res.status_code == 200
    notifs = notifs_res.json()
    assert any("removed by campus administrators" in n['message'] for n in notifs), "Claimant should receive notification of item removal"

    print("[SUCCESS] All Admin Item Deletion backend tests passed!")

if __name__ == "__main__":
    test_admin_delete_item_endpoints()
