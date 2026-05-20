$paths = @(
    "C:\Users\i-cgh\AppData\Roaming\Antigravity IDE\User\History"
)
foreach ($p in $paths) {
    if (Test-Path $p) {
        Write-Host "Found directory at $p"
        # 搜寻最近修改的大于 50KB 的 JSON 缓存文件
        Get-ChildItem -Path $p -Recurse -Filter "*.json" -ErrorAction SilentlyContinue | Where-Object { $_.Length -gt 50000 -and $_.Length -lt 200000 } | Sort-Object LastWriteTime -Descending | Select-Object -First 20 | ForEach-Object {
            try {
                $content = [System.IO.File]::ReadAllText($_.FullName)
                if ($content.Contains("Always Proceed") -and $content.Contains("Location")) {
                    Write-Host "MATCHED: $($_.FullName) - Size: $($_.Length) - LastWriteTime: $($_.LastWriteTime)"
                }
            } catch {}
        }
    }
}
