#!/usr/bin/env python3
"""
vercel_deploy.py — deploy production ke Vercel.

Dua mode (script memilih otomatis):

  MODE A. Vercel CLI (paling mudah, perlu `npm i -g vercel` sekali)
      Set env:
          export VERCEL_TOKEN=xxxxx                  # dari https://vercel.com/account/tokens
          export VERCEL_ORG_ID=team_xxx              # opsional
          export VERCEL_PROJECT_ID=prj_xxx           # opsional
      Lalu:
          python vercel_deploy.py

  MODE B. Vercel REST API (kalau CLI tidak ada)
      Set env:
          export VERCEL_TOKEN=xxxxx
          export VERCEL_PROJECT_ID=prj_xxx           # WAJIB
      Akan men-trigger deployment dari git terbaru (commit HEAD repo ini),
      mengasumsikan project Vercel sudah ter-link ke repo GitHub yang sama.

Lihat docs:
    https://vercel.com/docs/cli
    https://vercel.com/docs/rest-api
"""
import os, sys, shutil, subprocess, json, urllib.request, urllib.error

TOKEN = os.environ.get("VERCEL_TOKEN")
PROJECT_ID = os.environ.get("VERCEL_PROJECT_ID")
ORG_ID = os.environ.get("VERCEL_ORG_ID")

if not TOKEN:
    sys.exit("[FATAL] Set VERCEL_TOKEN dulu. Buat di https://vercel.com/account/tokens")

def via_cli():
    print("[MODE A] Vercel CLI terdeteksi.")
    env = os.environ.copy()
    cmd = ["vercel", "--prod", "--yes", "--token", TOKEN]
    if ORG_ID:     cmd += ["--scope", ORG_ID]
    print("$", " ".join(c if c != TOKEN else "***" for c in cmd))
    r = subprocess.run(cmd, env=env)
    sys.exit(r.returncode)

def get_repo_meta():
    """Tarik info repo dari .git supaya bisa trigger deploy via API."""
    try:
        url = subprocess.check_output(
            ["git", "config", "--get", "remote.origin.url"], text=True
        ).strip()
        sha = subprocess.check_output(
            ["git", "rev-parse", "HEAD"], text=True
        ).strip()
        branch = subprocess.check_output(
            ["git", "rev-parse", "--abbrev-ref", "HEAD"], text=True
        ).strip()
    except Exception as e:
        sys.exit(f"[FATAL] Tidak bisa baca info git: {e}")
    # Parse owner/repo dari url (https or ssh)
    repo = url.rstrip("/").removesuffix(".git")
    if repo.startswith("git@"):
        repo = repo.split(":", 1)[1]
    elif "://" in repo:
        repo = repo.split("/", 3)[-1]
    owner, name = repo.split("/", 1)
    return owner, name, sha, branch

def http_post(url, payload):
    req = urllib.request.Request(
        url, method="POST",
        data=json.dumps(payload).encode(),
        headers={"Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        sys.exit(f"[HTTP {e.code}] {e.read().decode()}")

def via_api():
    if not PROJECT_ID:
        sys.exit("[FATAL] MODE B perlu VERCEL_PROJECT_ID (lihat Project Settings di Vercel).")
    owner, name, sha, branch = get_repo_meta()
    print(f"[MODE B] Trigger deploy {owner}/{name}@{sha[:7]} (branch {branch})")
    payload = {
        "name": name,
        "project": PROJECT_ID,
        "target": "production",
        "gitSource": {
            "type": "github",
            "repo": f"{owner}/{name}",
            "ref": branch,
            "sha": sha,
        },
    }
    url = "https://api.vercel.com/v13/deployments"
    if ORG_ID:
        url += f"?teamId={ORG_ID}"
    data = http_post(url, payload)
    print(f"[OK] Deployment dibuat: https://{data.get('url', '?')}")
    print(f"     Status awal: {data.get('readyState') or data.get('status')}")

def main():
    if shutil.which("vercel"):
        via_cli()
    else:
        print("[INFO] CLI `vercel` tidak ditemukan, pakai REST API.")
        via_api()

if __name__ == "__main__":
    main()
