# ============================================================
# Deploy Script - Lughaty Digital
# Auto commit + push ke GitHub (trigger Vercel deploy)
# Usage: .\deploy.ps1 "pesan commit"
# ============================================================
param(
    [string]$Message = "update: auto deploy"
)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host " Lughaty Digital - Deploy" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# --- Cek git status ---
Write-Host "[1/4] Checking git status..." -ForegroundColor Yellow
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "  -> Tidak ada perubahan, skip deploy." -ForegroundColor Green
    exit 0
}

# --- Tampilkan perubahan ---
Write-Host ""
Write-Host "Perubahan yang akan di-commit:" -ForegroundColor Yellow
git status --short
Write-Host ""

# --- Add & commit ---
Write-Host "[2/4] Staging & committing..." -ForegroundColor Yellow
git add .
git commit -m $Message
if ($LASTEXITCODE -ne 0) {
    Write-Host "  -> Commit gagal!" -ForegroundColor Red
    exit 1
}
Write-Host "  -> Committed: $Message" -ForegroundColor Green

# --- Push ke GitHub ---
Write-Host ""
Write-Host "[3/4] Pushing to origin main..." -ForegroundColor Yellow
git push origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "  -> Push gagal!" -ForegroundColor Red
    exit 1
}
Write-Host "  -> Pushed!" -ForegroundColor Green

# --- Status ---
Write-Host ""
Write-Host "[4/4] Deploy triggered!" -ForegroundColor Yellow
Write-Host "  -> Vercel auto-deploys dari branch main" -ForegroundColor Green
Write-Host ""

# --- Cek latest commit ---
Write-Host "Latest commit:" -ForegroundColor Cyan
git log --oneline -1
Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host " Deploy selesai!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
