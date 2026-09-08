import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from fastapi.testclient import TestClient
from app.main import app

def test_full_lifecycle():
    client = TestClient(app)

    # 1. Register student
    reg = client.post('/auth/register', json={
        'name': 'Alice Smith',
        'student_id': 'STU999',
        'email': 'alice@campus.edu',
        'password': 'password123'
    })
    assert reg.status_code == 201, f"Register failed: {reg.text}"
    stu_token = reg.json()['access_token']
    stu_headers = {'Authorization': f'Bearer {stu_token}'}
    print("[+] Student registered:", reg.json()['user']['name'])

    # 2. Report Lost Item
    lost_res = client.post('/items/lost', data={
        'item_name': 'Black Dell XPS 15 Laptop',
        'category': 'Electronics',
        'location': 'Library',
        'date_reported': '2026-09-08',
        'description': 'Black Dell laptop with sticker on back'
    }, headers=stu_headers)
    assert lost_res.status_code == 201, f"Report lost failed: {lost_res.text}"
    lost_id = lost_res.json()['id']
    print("[+] Lost item created:", lost_id)

    # 3. Report Found Item from Bob
    reg2 = client.post('/auth/register', json={
        'name': 'Bob Jones',
        'student_id': 'STU998',
        'email': 'bob@campus.edu',
        'password': 'password123'
    })
    assert reg2.status_code == 201
    bob_token = reg2.json()['access_token']
    bob_headers = {'Authorization': f'Bearer {bob_token}'}

    found_res = client.post('/items/found', data={
        'item_name': 'Dell XPS Laptop',
        'category': 'Electronics',
        'location': 'Library',
        'date_reported': '2026-09-08',
        'description': 'Found black Dell laptop near 2nd floor desk'
    }, headers=bob_headers)
    assert found_res.status_code == 201
    found_id = found_res.json()['id']
    print("[+] Found item created:", found_id)

    # 4. Check matches for Alice
    matches_res = client.get('/matches', headers=stu_headers)
    assert matches_res.status_code == 200
    matches = matches_res.json()
    print(f"[+] Matches found for Alice: {len(matches)}")
    assert len(matches) > 0, "Expected a match to be generated!"
    m = matches[0]
    print(f"    Match score: {m['match_score']:.1f}% (Category: {m['category_score']}, Location: {m['location_score']}, Desc: {m['description_score']:.1f}, Date: {m['date_score']:.1f})")

    # 5. Submit claim
    claim_res = client.post('/claims', json={
        'item_id': found_id,
        'proof_description': 'Dell laptop serial #XYZ123 and yellow sticker',
        'distinctive_features': 'Yellow sticker on top cover',
        'approximate_time': '2:30 PM'
    }, headers=stu_headers)
    assert claim_res.status_code == 201, f"Claim failed: {claim_res.text}"
    claim_id = claim_res.json()['id']
    print("[+] Claim submitted:", claim_id)

    # 6. Admin login & review claim
    admin_login = client.post('/auth/login', json={'email': 'admin@campusfind.edu', 'password': 'admin123'})
    assert admin_login.status_code == 200
    admin_token = admin_login.json()['access_token']
    admin_headers = {'Authorization': f'Bearer {admin_token}'}

    review_res = client.patch(f'/admin/claims/{claim_id}/review', json={
        'status': 'APPROVED',
        'admin_note': 'Verified serial number and photo.'
    }, headers=admin_headers)
    assert review_res.status_code == 200
    print("[+] Admin approved claim:", review_res.json()['status'])

    # 7. Check item status updated to RETURNED
    item_check = client.get(f'/items/{found_id}')
    assert item_check.json()['status'] == 'RETURNED'
    print("[+] Item status verified: RETURNED")

    # 8. Check Alice notifications
    notifs = client.get('/notifications', headers=stu_headers)
    print(f"[+] Alice received {len(notifs.json())} notification(s):")
    for n in notifs.json():
        print(f"    - [{n['type']}] {n['message']}")

    # 9. Verify Admin Analytics
    analytics_res = client.get('/admin/analytics', headers=admin_headers)
    assert analytics_res.status_code == 200
    kpis = analytics_res.json()['kpis']
    print("[+] Analytics KPIs verified:")
    print(f"    Total items: {kpis['total_items']}, Lost: {kpis['total_lost']}, Found: {kpis['total_found']}, Returned: {kpis['total_returned']}, Recovery rate: {kpis['recovery_rate']}%")

if __name__ == "__main__":
    test_full_lifecycle()
    print("\nALL BACKEND LIFECYCLE TESTS PASSED SUCCESSFULLY!")
