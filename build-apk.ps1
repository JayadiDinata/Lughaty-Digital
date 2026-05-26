$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ErrorActionPreference = "Stop"
Set-Location $ScriptDir

# --- check JDK 17 ---
$jdk17 = "C:\Program Files\Java\jdk-17"
if (!(Test-Path $jdk17)) {
    Write-Host "JDK 17 not found at $jdk17" -ForegroundColor Red
    exit 1
}
$env:JAVA_HOME = $jdk17
$env:PATH = "$jdk17\bin;$env:PATH"
Write-Host "JAVA_HOME=$env:JAVA_HOME" -ForegroundColor Green

# --- build Angular web app ---
Write-Host "`n=== Build Angular ===" -ForegroundColor Cyan
npx ng build --configuration=production
if ($LASTEXITCODE -ne 0) { throw "ng build failed" }

# --- sync to Android ---
Write-Host "`n=== Capacitor sync ===" -ForegroundColor Cyan
npx cap sync android
if ($LASTEXITCODE -ne 0) { throw "cap sync failed" }

# --- build APK ---
Write-Host "`n=== Build APK (assembleDebug) ===" -ForegroundColor Cyan
Set-Location android
.\gradlew assembleDebug
if ($LASTEXITCODE -ne 0) { throw "Gradle build failed" }

$apk = "app\build\outputs\apk\debug\app-debug.apk"
if (Test-Path $apk) {
    Copy-Item $apk -Destination "$ScriptDir\build\Lughaty_Digital-v1.0.0-debug.apk" -Force
    Write-Host "`n[OK] APK: $ScriptDir\build\Lughaty_Digital-v1.0.0-debug.apk" -ForegroundColor Green
} else {
    Write-Host "`n[ERR] APK not found at $apk" -ForegroundColor Red
}

Set-Location $ScriptDir
