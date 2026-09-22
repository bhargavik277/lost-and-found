import sys
import uuid
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from fastapi.testclient import TestClient
from app.main import app

def test_admin_claim_workflow_relationships():
    client = TestClient(app)
    uid = uuid.uuid4().hex[:6]

    # 1. Register student Charlie (who loses an item)
    stu_charlie = client.post('/auth/register', json={
        'name': f'Charlie Brown {uid}',
        'student_id': f'STU_{uid}',
        'email': f'charlie_{uid}@campus.edu',
        'password': 'password123'
    })
    assert stu_charlie.status_code == 201, f"Register failed: {stu_charlie.text}"
    charlie_token = stu_charlie.json()['access_token']
    charlie_headers = {'Authorization': f'Bearer {charlie_token}'}

    # 2. Charlie reports a LOST item
    lost_res = client.post('/items/lost', data={
        'item_name': 'Sony WH-1000XM4 Headphones',
        'category': 'Electronics',
        'location': 'Library',
        'date_reported': '2026-09-10',
        'time_reported': '14:30',
        'description': 'Silver Sony noise cancelling over-ear headphones in grey hard case'
    }, headers=charlie_headers)
    assert lost_res.status_code == 201, f"Report lost failed: {lost_res.text}"
    lost_item = lost_res.json()
    lost_id = lost_item['id']

    # 3. Register student Dana (who finds the item)
    stu_dana = client.post('/auth/register', json={
        'name': f'Dana White {uid}',
        'student_id': f'STUD_{uid}',
        'email': f'dana_{uid}@campus.edu',
        'password': 'password123'
    })
    assert stu_dana.status_code == 201
    dana_token = stu_dana.json()['access_token']
    dana_headers = {'Authorization': f'Bearer {dana_token}'}

    # 4. Dana reports the FOUND item
    found_res = client.post('/items/found', data={
        'item_name': 'Sony Wireless Headphones',
        'category': 'Electronics',
        'location': 'Library',
        'date_reported': '2026-09-10',
        'time_reported': '16:00',
        'description': 'Silver Sony headphones found on 3rd floor study table'
    }, headers=dana_headers)
    assert found_res.status_code == 201, f"Report found failed: {found_res.text}"
    found_item = found_res.json()
    found_id = found_item['id']

    # 5. Check Charlie matches
    matches_res = client.get('/matches', headers=charlie_headers)
    assert matches_res.status_code == 200
    matches = matches_res.json()
    assert len(matches) > 0, "Expected match to be generated"
    match = matches[0]
    assert match['match_score'] >= 60.0

    # 6. Charlie submits a claim for the found item
    claim_res = client.post('/claims', json={
        'item_id': found_id,
        'proof_description': 'Sony headphones with scratch on left earcup hinge and custom EQ settings',
        'distinctive_features': 'Scratch on left hinge, grey case has flight adapter inside',
        'approximate_time': 'Left on table at 2:30 PM',
        'additional_info': 'Can verify bluetooth device name Charlie-XM4'
    }, headers=charlie_headers)
    assert claim_res.status_code == 201, f"Submit claim failed: {claim_res.text}"
    claim_id = claim_res.json()['id']

    # 7. Admin Login
    admin_login = client.post('/auth/login', json={'email': 'admin@campusfind.edu', 'password': 'admin123'})
    assert admin_login.status_code == 200
    admin_token = admin_login.json()['access_token']
    admin_headers = {'Authorization': f'Bearer {admin_token}'}

    # 8. Admin fetches claims list
    admin_claims_res = client.get('/admin/claims', headers=admin_headers)
    assert admin_claims_res.status_code == 200
    admin_claims = admin_claims_res.json()
    target_claim = next((c for c in admin_claims if c['id'] == claim_id), None)
    assert target_claim is not None, "Claim not found in admin queue"

    # Verify Section 1: Found Item Data
    assert target_claim['item'] is not None
    assert target_claim['item']['id'] == found_id
    assert target_claim['item']['item_name'] == 'Sony Wireless Headphones'
    assert target_claim['item']['category'] == 'Electronics'
    assert target_claim['item']['location'] == 'Library'

    # Verify Section 2: AI Match Data & Score breakdown
    assert target_claim['match'] is not None
    assert target_claim['match']['match_score'] >= 60.0
    assert 'name_score' in target_claim['match']
    assert 'category_score' in target_claim['match']
    assert 'location_score' in target_claim['match']
    assert 'description_score' in target_claim['match']
    assert 'date_score' in target_claim['match']

    # Verify Section 3: Claimant's Lost Report
    assert target_claim['lost_item'] is not None
    assert target_claim['lost_item']['id'] == lost_id
    assert target_claim['lost_item']['item_name'] == 'Sony WH-1000XM4 Headphones'
    assert target_claim['claimant'] is not None
    assert target_claim['claimant']['name'] == f'Charlie Brown {uid}'
    assert target_claim['claimant']['student_id'] == f'STU_{uid}'

    # Verify Section 4: Claimant's Ownership Evidence
    assert target_claim['proof_description'] == 'Sony headphones with scratch on left earcup hinge and custom EQ settings'
    assert target_claim['distinctive_features'] == 'Scratch on left hinge, grey case has flight adapter inside'
    assert target_claim['approximate_time'] == 'Left on table at 2:30 PM'
    assert target_claim['additional_info'] == 'Can verify bluetooth device name Charlie-XM4'

    # 9. Admin gets single claim detail
    single_res = client.get(f'/admin/claims/{claim_id}', headers=admin_headers)
    assert single_res.status_code == 200
    single_data = single_res.json()
    assert single_data['item']['item_name'] == 'Sony Wireless Headphones'
    assert single_data['lost_item']['item_name'] == 'Sony WH-1000XM4 Headphones'
    assert single_data['match']['match_score'] >= 60.0

    # 10. Admin approves the claim
    review_res = client.patch(f'/admin/claims/{claim_id}/review', json={
        'status': 'APPROVED',
        'admin_note': 'Serial and bluetooth name verified in person. Released to student.'
    }, headers=admin_headers)
    assert review_res.status_code == 200
    reviewed_claim = review_res.json()
    assert reviewed_claim['status'] == 'APPROVED'
    assert reviewed_claim['admin_note'] == 'Serial and bluetooth name verified in person. Released to student.'
    assert reviewed_claim['item']['id'] == found_id

    # 10b. Student retrieves OTP and Security/Admin verifies OTP at handover desk
    otp_res = client.get(f'/claims/{claim_id}/otp', headers=charlie_headers)
    assert otp_res.status_code == 200
    otp = otp_res.json()['otp']
    verify_res = client.post(f'/security/collections/{claim_id}/verify-otp', json={'otp': otp}, headers=admin_headers)
    assert verify_res.status_code == 200

    # 11. Verify item status updated to RETURNED
    found_check = client.get(f'/items/{found_id}')
    assert found_check.status_code == 200
    assert found_check.json()['status'] == 'RETURNED'

    print("[SUCCESS] All Admin Claim Review Workflow relationship tests passed flawlessly!")

if __name__ == "__main__":
    test_admin_claim_workflow_relationships()
