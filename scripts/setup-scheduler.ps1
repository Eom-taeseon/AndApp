# Fonsle Windows Task Scheduler Setup
# Run as Administrator: Right-click PowerShell -> "Run as administrator"
#
# Usage:
#   cd C:\Users\PC\OneDrive\Desktop\ToyProjects\fonsle\scripts
#   .\setup-scheduler.ps1

$ProjectRoot = "C:\Users\PC\OneDrive\Desktop\ToyProjects\fonsle"
$ScriptsDir  = Join-Path $ProjectRoot "scripts"

$PowerShell = "C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe"

function Register-FonsleTask {
    param($Name, $ScriptFile, $Time, $Description, $Duration)

    $Action = New-ScheduledTaskAction `
        -Execute $PowerShell `
        -Argument ("-NonInteractive -NoProfile -ExecutionPolicy Bypass -File `"" + $ScriptFile + "`"")

    $Trigger  = New-ScheduledTaskTrigger -Daily -At $Time
    $Settings = New-ScheduledTaskSettingsSet `
        -ExecutionTimeLimit (New-TimeSpan -Hours $Duration) `
        -StartWhenAvailable `
        -RunOnlyIfNetworkAvailable

    if (Get-ScheduledTask -TaskName $Name -ErrorAction SilentlyContinue) {
        Unregister-ScheduledTask -TaskName $Name -Confirm:$false
        Write-Host "Removed existing task: $Name"
    }

    Register-ScheduledTask `
        -TaskName $Name `
        -Action $Action `
        -Trigger $Trigger `
        -Settings $Settings `
        -Description $Description `
        -RunLevel Limited | Out-Null

    Write-Host "Registered: $Name ($Time)"
}

# 기존 개별 세션 태스크 정리
@("Fonsle-AutoDev-Morning", "Fonsle-AutoDev-Afternoon") | ForEach-Object {
    if (Get-ScheduledTask -TaskName $_ -ErrorAction SilentlyContinue) {
        Unregister-ScheduledTask -TaskName $_ -Confirm:$false
        Write-Host "Removed old task: $_"
    }
}

$AutoDevScript   = Join-Path $ScriptsDir "auto-dev.ps1"
$BriefingScript  = Join-Path $ScriptsDir "daily-briefing.ps1"

Register-FonsleTask -Name "Fonsle-AutoDev"        -ScriptFile $AutoDevScript  -Time "09:00" -Description "Fonsle auto dev loop (09:00~18:00)" -Duration 10
Register-FonsleTask -Name "Fonsle-DailyBriefing"   -ScriptFile $BriefingScript -Time "21:00" -Description "Fonsle daily briefing -> Notion"    -Duration 1

Write-Host ""
Write-Host "============================================"
Write-Host " Fonsle Automation Schedule Registered"
Write-Host "============================================"
Write-Host " 09:00~18:00  Auto dev loop (continuous)"
Write-Host " 21:00        Daily briefing -> Notion"
Write-Host ""
Write-Host (" Log path: " + $ScriptsDir + "\logs\")
Write-Host " Check: Task Scheduler -> Task Scheduler Library"
Write-Host "============================================"
