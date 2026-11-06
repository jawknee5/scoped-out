"""Iteration 2: crew edit (PUT) persistence, preset seeding (Webcrafter, 13 presets, idempotent), Webcrafter streaming chat."""
import json
import os
import re
from pathlib import Path

import pytest
import requests
from dotenv import dotenv_values

base_url = os.environ.get("REACT_APP_BACKEND_URL") or dotenv_values("/app/frontend/.env").get("REACT_APP_BACKEND_URL")
BASE_URL = base_url.rstrip("/")
TOKEN = re.search(r'session_token[^\n]*:\s*`([^`]+)`', Path("/app/memory/test_credentials.md").read_text()).group(1)


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json", "Authorization": f"Bearer {TOKEN}"})
    return s


@pytest.fixture(scope="module")
def created_ids(client):
    ids = []
    yield ids
    for i in ids:
        client.delete(f"{BASE_URL}/api/agents/{i}", timeout=30)


# Preset seeding
class TestPresets:
    def test_seed_idempotent_and_webcrafter(self, client):
        r1 = client.post(f"{BASE_URL}/api/agents/seed-presets", timeout=30)
        assert r1.status_code == 200
        r2 = client.post(f"{BASE_URL}/api/agents/seed-presets", timeout=30)
        d = r2.json()
        assert d["created"] == []
        assert len(d["skipped"]) == 13
        assert "Webcrafter" in d["skipped"]
        agents = client.get(f"{BASE_URL}/api/agents", timeout=30).json()
        names = [a["name"] for a in agents]
        assert names.count("Webcrafter") == 1
        for n in d["skipped"]:
            assert names.count(n) == 1, f"duplicate preset {n}"
        w = next(a for a in agents if a["name"] == "Webcrafter")
        assert w["model_provider"] == "anthropic" and w["persona"] == "tech"
        assert "deploy" in w["expected_output"].lower()


# Crew edit (PUT full doc) persistence
class TestCrewEdit:
    def test_put_full_doc_preserves_fields(self, client, created_ids):
        payload = {"name": "TEST_Crew", "description": "d", "persona": "law", "skills": ["law", "tech"],
                   "role": "r", "goal": "g", "background": "bg", "expected_output": "eo",
                   "tone": "Calm", "model_provider": "openai", "model_name": "gpt-5.4"}
        a = client.post(f"{BASE_URL}/api/agents", json=payload, timeout=30).json()
        created_ids.append(a["id"])
        upd = {**a, "tone": "Bold", "goal": "new goal", "model_provider": "gemini", "model_name": "gemini-3-flash-preview"}
        r = client.put(f"{BASE_URL}/api/agents/{a['id']}", json=upd, timeout=30)
        assert r.status_code == 200
        g = client.get(f"{BASE_URL}/api/agents/{a['id']}", timeout=30).json()
        assert g["tone"] == "Bold" and g["goal"] == "new goal" and g["model_provider"] == "gemini"
        assert g["skills"] == ["law", "tech"] and g["persona"] == "law" and g["background"] == "bg"
        assert g["created_at"] == a["created_at"] and g["user_id"] == "test-user-forge"

    def test_put_404(self, client):
        r = client.put(f"{BASE_URL}/api/agents/nope_123", json={"name": "x"}, timeout=30)
        assert r.status_code == 404


# Webcrafter streaming chat
class TestWebcrafterChat:
    def test_stream(self, client):
        agents = client.get(f"{BASE_URL}/api/agents", timeout=30).json()
        w = next(a for a in agents if a["name"] == "Webcrafter")
        r = client.post(f"{BASE_URL}/api/agents/{w['id']}/chat/stream",
                        json={"message": "Build me a simple modern landing page for a coffee shop"},
                        stream=True, timeout=240)
        assert r.status_code == 200
        text, deltas, done, err = "", 0, False, None
        for line in r.iter_lines(decode_unicode=True):
            if not line or not line.startswith("data: "):
                continue
            ev = json.loads(line[6:])
            if "delta" in ev:
                deltas += 1
                text += ev["delta"]
            if "error" in ev:
                err = ev["error"]
            if ev.get("done"):
                done = True
                break
        assert err is None, err
        assert done and deltas > 5
        low = text.lower()
        print("LEN", len(text), "DELTAS", deltas)
        assert "<html" in low or "```" in low
        assert "deploy" in low
