$content = [System.IO.File]::ReadAllText("C:\Users\i-cgh\AppData\Local\Programs\Antigravity IDE\resources\app\out\jetskiAgent\main.js.bak")
$targets = @("Learn more", "Deny", "Open", "Add", "Edit", "Delete Project", "Close Settings", "Cancel task")
foreach ($t in $targets) {
    Write-Host "------------------ Searching for '$t' ------------------"
    $idx = 0
    $occurrences = @()
    while ($true) {
        $idx = $content.IndexOf($t, $idx)
        if ($idx -eq -1) { break }
        $occurrences += $idx
        $idx += $t.Length
    }
    Write-Host "Found $($occurrences.Count) occurrences."
    $count = 0
    foreach ($pos in $occurrences) {
        if ($count -ge 20) { break }
        $start = [Math]::Max(0, $pos - 80)
        $len = [Math]::Min($content.Length - $start, 160 + $t.Length)
        $sub = $content.Substring($start, $len)
        $clean = $sub.Replace("`n", "\n").Replace("`r", "\r")
        Write-Host "  [Occurrence $($count+1)] index $($pos):"
        Write-Host "    ...$clean..."
        $count++
    }
}
