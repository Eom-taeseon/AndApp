# 폰슐랭 데일리 브리핑 실행 스크립트
# Windows Task Scheduler에서 호출됨

param(
    [string]$ProjectRoot = "C:\Users\PC\OneDrive\Desktop\ToyProjects\fonsle"
)

# UTF-8 출력 설정
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

Set-Location $ProjectRoot

# claude CLI 경로 설정 (Task Scheduler에서 npm PATH가 누락되므로 전체 경로 사용)
$ClaudeCLI = Join-Path $env:APPDATA "npm\claude.cmd"
if (-not (Test-Path $ClaudeCLI)) {
    $ClaudeCLI = "claude"  # fallback: PATH에 있으면 사용
}

# npm 경로를 PATH에 추가 (Task Scheduler 환경용)
$NpmPath = Join-Path $env:APPDATA "npm"
if ($env:PATH -notlike "*$NpmPath*") {
    $env:PATH = "$NpmPath;$env:PATH"
}

# 로그 디렉토리 생성
$LogDir = Join-Path $ProjectRoot "scripts\logs"
if (-not (Test-Path $LogDir)) {
    New-Item -ItemType Directory -Path $LogDir | Out-Null
}

$LogFile = Join-Path $LogDir "$(Get-Date -Format 'yyyy-MM-dd')-briefing.md"
$Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

# UTF-8 로그 기록 함수
function Write-Log {
    param([string]$Message)
    $Message | Out-File -FilePath $LogFile -Append -Encoding UTF8
    Write-Host $Message
}

Write-Log "# Briefing Log"
Write-Log ""
Write-Log "## [$Timestamp] 데일리 브리핑 시작"
Write-Log ""

# 프롬프트 파일 읽기
$PromptFile = Join-Path $ProjectRoot "scripts\prompts\briefing.md"
if (-not (Test-Path $PromptFile)) {
    Write-Log "**ERROR**: 프롬프트 파일을 찾을 수 없음: ``$PromptFile``"
    exit 1
}

$Prompt = Get-Content $PromptFile -Raw -Encoding UTF8

# Claude Code 실행
try {
    $Output = & $ClaudeCLI --dangerously-skip-permissions -p $Prompt 2>&1
    $ExitCode = $LASTEXITCODE
    $Output | Out-File -FilePath $LogFile -Append -Encoding UTF8
    Write-Host $Output
} catch {
    Write-Log "**ERROR**: Claude 실행 실패 — $_"
    exit 1
}

$EndTime = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Write-Log ""
Write-Log "---"
Write-Log "## [$EndTime] 데일리 브리핑 완료 (exit: $ExitCode)"
