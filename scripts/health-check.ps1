# MIDI Studio — Health Check Script
# Uso: .\scripts\health-check.ps1
# Ejecutar antes de npm run tauri dev

Write-Host "=== MIDI Studio Health Check ===" -ForegroundColor Cyan

$failed = $false

# 1. Cargo check
Write-Host "`n[1/6] Rust cargo check..." -ForegroundColor Yellow
$cargo = & cargo check --manifest-path src-tauri/Cargo.toml 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Rust: OK" -ForegroundColor Green
} else {
    Write-Host "❌ Rust: FAIL" -ForegroundColor Red
    Write-Host $cargo
    $failed = $true
}

# 2. Cargo test
Write-Host "`n[2/6] Rust cargo test..." -ForegroundColor Yellow
$cargoTest = & cargo test --manifest-path src-tauri/Cargo.toml 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Rust Tests: OK" -ForegroundColor Green
} else {
    Write-Host "❌ Rust Tests: FAIL" -ForegroundColor Red
    Write-Host $cargoTest
    $failed = $true
}

# 3. TypeScript check
Write-Host "`n[3/6] TypeScript check..." -ForegroundColor Yellow
$tsc = & npx tsc --noEmit 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ TypeScript: OK" -ForegroundColor Green
} else {
    Write-Host "❌ TypeScript: FAIL" -ForegroundColor Red
    Write-Host $tsc
    $failed = $true
}

# 4. Frontend smoke test (build)
Write-Host "`n[4/6] Frontend smoke test (build)..." -ForegroundColor Yellow
$build = & npm run build 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Frontend Build: OK" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend Build: FAIL" -ForegroundColor Red
    Write-Host $build
    $failed = $true
}

# 5. Verifica archivos críticos
Write-Host "`n[5/6] Archivos críticos..." -ForegroundColor Yellow
$files = @(
    "src-tauri/capabilities/default.json",
    "src-tauri/tauri.conf.json",
    "src/app.ts",
    "src/main.ts",
    "index.html",
    "vite.config.ts"
)
foreach ($f in $files) {
    if (Test-Path $f) {
        Write-Host "  ✅ $f" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $f MISSING" -ForegroundColor Red
        $failed = $true
    }
}

# 6. Verifica node_modules
Write-Host "`n[6/6] Dependencias npm..." -ForegroundColor Yellow
if (Test-Path "node_modules/@xterm/xterm") {
    Write-Host "✅ @xterm/xterm: OK" -ForegroundColor Green
} else {
    Write-Host "❌ @xterm/xterm: MISSING — ejecuta npm install" -ForegroundColor Red
    $failed = $true
}
if (Test-Path "node_modules/@tauri-apps/api") {
    Write-Host "✅ @tauri-apps/api: OK" -ForegroundColor Green
} else {
    Write-Host "❌ @tauri-apps/api: MISSING — ejecuta npm install" -ForegroundColor Red
    $failed = $true
}

Write-Host "`n=== Fin Health Check ===" -ForegroundColor Cyan

if ($failed) {
    Write-Host "Health Check FAILED" -ForegroundColor Red
    exit 1
}
Write-Host "Health Check PASSED" -ForegroundColor Green
