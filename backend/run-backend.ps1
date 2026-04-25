param(
    [int]$Port = 8080
)

$ErrorActionPreference = "Stop"

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptRoot

function Get-PortListener {
    param([int]$LocalPort)
    return Get-NetTCPConnection -LocalPort $LocalPort -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
}

$listener = Get-PortListener -LocalPort $Port
if ($listener) {
    $ownerPid = $listener.OwningProcess
    $proc = Get-Process -Id $ownerPid -ErrorAction SilentlyContinue
    $procName = if ($proc) { $proc.ProcessName } else { "unknown" }

    Write-Host "Port $Port is in use by PID $ownerPid ($procName). Stopping process..."
    Stop-Process -Id $ownerPid -Force -ErrorAction SilentlyContinue

    $released = $false
    for ($i = 0; $i -lt 20; $i++) {
        Start-Sleep -Milliseconds 250
        $stillListening = Get-PortListener -LocalPort $Port
        if (-not $stillListening) {
            $released = $true
            break
        }

        # If ownership changes, stop the new listener too.
        if ($stillListening.OwningProcess -ne $ownerPid) {
            $newPid = $stillListening.OwningProcess
            $newProc = Get-Process -Id $newPid -ErrorAction SilentlyContinue
            $newName = if ($newProc) { $newProc.ProcessName } else { "unknown" }
            Write-Host "Port $Port switched to PID $newPid ($newName). Stopping process..."
            Stop-Process -Id $newPid -Force -ErrorAction SilentlyContinue
        }
    }

    if (-not $released) {
        throw "Port $Port is still in use after retries."
    }

    Write-Host "Port $Port is now free."
}
else {
    Write-Host "Port $Port is already free."
}

Write-Host "Starting Spring Boot app..."
& .\mvnw spring-boot:run
