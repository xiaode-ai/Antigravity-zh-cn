$content = [System.IO.File]::ReadAllText("C:\Users\i-cgh\AppData\Local\Programs\Antigravity IDE\resources\app\out\jetskiAgent\main.js.bak")
$patterns = @('children:"Edit"', 'label:"Edit"', 'title:"Edit"')
foreach ($p in $patterns) {
    Write-Host "------------------ Searching for '$p' ------------------"
    $idx = 0
    $occurrences = @()
    while ($true) {
        $idx = $content.IndexOf($p, $idx)
        if ($idx -eq -1) { break }
        $occurrences += $idx
        $idx += $p.Length
    }
    Write-Host "Found $($occurrences.Count) occurrences."
    $count = 0
    foreach ($pos in $occurrences) {
        $start = [Math]::Max(0, $pos - 80)
        $len = [Math]::Min($content.Length - $start, 160 + $p.Length)
        $sub = $content.Substring($start, $len)
        $clean = $sub.Replace("`n", "\n").Replace("`r", "\r")
        Write-Host "  [Occurrence $($count+1)] index $($pos):"
        Write-Host "    ...$clean..."
        $count++
    }
}
