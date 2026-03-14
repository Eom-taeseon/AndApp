# 폰슐랭 자동 개발 세션 실행 스크립트 (루프 모드)
# 09:00에 시작하여 18:00까지 반복 실행
# Windows Task Scheduler에서 호출됨

param(
    [string]$ProjectRoot = "C:\Users\PC\OneDrive\Desktop\ToyProjects\fonsle",
    [int]$StopHour = 18,
    [int]$CooldownSeconds = 60
)

# UTF-8 출력 설정
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

Set-Location $ProjectRoot

# claude CLI 경로 설정
$ClaudeCLI = Join-Path $env:APPDATA "npm\claude.cmd"
if (-not (Test-Path $ClaudeCLI)) {
    $ClaudeCLI = "claude"
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

$LogFile = Join-Path $LogDir "$(Get-Date -Format 'yyyy-MM-dd')-dev.md"

# UTF-8 로그 기록 함수
function Write-Log {
    param([string]$Message)
    $Message | Out-File -FilePath $LogFile -Append -Encoding UTF8
    Write-Host $Message
}

# 프롬프트 파일 확인
$PromptFile = Join-Path $ProjectRoot "scripts\prompts\dev-session.md"
if (-not (Test-Path $PromptFile)) {
    Write-Log "**ERROR**: 프롬프트 파일을 찾을 수 없음: ``$PromptFile``"
    exit 1
}

$Prompt = Get-Content $PromptFile -Raw -Encoding UTF8
$SessionCount = 0

Write-Log "# Dev Session Log — $(Get-Date -Format 'yyyy-MM-dd')"
Write-Log ""
Write-Log "> 루프 모드: 18:00까지 반복 실행 (쿨다운: ${CooldownSeconds}초)"
Write-Log ""

# 메인 루프: 18시까지 반복
while ((Get-Date).Hour -lt $StopHour) {
    $SessionCount++
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

    Write-Log "---"
    Write-Log ""
    Write-Log "## Session #$SessionCount [$Timestamp]"
    Write-Log ""

    try {
        $Output = & $ClaudeCLI --dangerously-skip-permissions -p $Prompt 2>&1
        $ExitCode = $LASTEXITCODE
        $Output | Out-File -FilePath $LogFile -Append -Encoding UTF8
        Write-Host $Output
    } catch {
        Write-Log "**ERROR**: Claude 실행 실패 — $_"
        $ExitCode = 1
    }

    $EndTime = Get-Date -Format "HH:mm:ss"
    Write-Log ""
    Write-Log "> Session #$SessionCount 완료 (exit: $ExitCode) at $EndTime"
    Write-Log ""

    # 18시 넘었으면 종료
    if ((Get-Date).Hour -ge $StopHour) {
        break
    }

    # 쿨다운 대기
    Write-Log "> 다음 세션까지 ${CooldownSeconds}초 대기..."
    Write-Log ""
    Start-Sleep -Seconds $CooldownSeconds
}

Write-Log "---"
Write-Log ""
Write-Log "## 종료"
Write-Log ""
$FinalTime = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Write-Log "**[$FinalTime]** 총 ${SessionCount}회 세션 실행 완료. 18:00 자동 종료."
