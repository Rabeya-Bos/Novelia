from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get('/health')
    assert response.status_code == 200
    assert response.json() == {'status': 'OK'}


def test_register_and_login_flow():
    payload = {
        'fullName': 'Ada Lovelace',
        'email': 'ada@example.com',
        'password': 'secret123',
        'role': 'reader',
    }

    register_response = client.post('/api/auth/register', json=payload)
    assert register_response.status_code == 200
    registered_user = register_response.json()
    assert registered_user['user']['email'] == payload['email']

    login_response = client.post(
        '/api/auth/login',
        json={'email': payload['email'], 'password': payload['password']},
    )
    assert login_response.status_code == 200
    logged_in_user = login_response.json()
    assert logged_in_user['user']['email'] == payload['email']



def test_get_all_novels():
    response = client.get('/api/novels')
    assert response.status_code == 200
    data = response.json()
    assert 'novels' in data
    assert len(data['novels']) >= 4


def test_crud_novel():
    # 1. Create a novel
    payload = {
        "title": "Test Novel",
        "author": "Test Author",
        "genre": "Sci-Fi",
        "summary": "This is a test novel.",
        "cover": "http://example.com/cover.jpg"
    }
    response = client.post('/api/novels', json=payload)
    assert response.status_code == 200
    novel = response.json()
    assert novel['title'] == payload['title']
    assert 'id' in novel
    novel_id = novel['id']

    # 2. Read single novel
    response = client.get(f'/api/novels/{novel_id}')
    assert response.status_code == 200
    assert response.json()['title'] == payload['title']

    # 3. Update novel
    update_payload = {"title": "Updated Test Novel"}
    response = client.put(f'/api/novels/{novel_id}', json=update_payload)
    assert response.status_code == 200
    assert response.json()['title'] == "Updated Test Novel"

    # 4. Delete novel
    response = client.delete(f'/api/novels/{novel_id}')
    assert response.status_code == 200
    assert response.json()['message'] == "Novel deleted successfully"

    # 5. Verify deleted
    response = client.get(f'/api/novels/{novel_id}')
    assert response.status_code == 404

