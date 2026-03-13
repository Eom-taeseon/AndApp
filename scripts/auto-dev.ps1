# 폰슐랭 자동 개발 세션 실행 스크립트
# Windows Task Scheduler에서 호출됨

param(
    [string]$ProjectRoot = "C:\Users\PC\OneDrive\Desktop\ToyProjects\폰슐랭"
)

Set-Location $ProjectRoot

# 로그 디렉토리 생성
$LogDir = Join-Path $ProjectRoot "scripts\logs"
if (-not (Test-Path $LogDir)) {
    New-Item -ItemType Directory -Path $LogDir | Out-Null
}

$LogFile = Join-Path $LogDir "$(Get-Date -Format 'yyyy-MM-dd')-dev.log"
$Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

"[$Timestamp] 자동 개발 세션 시작" | Tee-Object -FilePath $LogFile -Append

# 프롬프트 파일 읽기
$PromptFile = Join-Path $ProjectRoot "scripts\prompts\dev-session.md"
if (-not (Test-Path $PromptFile)) {
    "[$Timestamp] ERROR: 프롬프트 파일을 찾을 수 없음: $PromptFile" | Tee-Object -FilePath $LogFile -Append
    exit 1
}

$Prompt = Get-Content $PromptFile -Raw -Encoding UTF8

# Claude Code 실행
try {
    claude --dangerously-skip-permissions -p $Prompt 2>&1 | Tee-Object -FilePath $LogFile -Append
    $ExitCode = $LASTEXITCODE
} catch {
    "[$Timestamp] ERROR: Claude 실행 실패 — $_" | Tee-Object -FilePath $LogFile -Append
    exit 1
}

$EndTime = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
"[$EndTime] 자동 개발 세션 완료 (exit: $ExitCode)" | Tee-Object -FilePath $LogFile -Append
