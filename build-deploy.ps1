$ErrorActionPreference = 'Stop'
$dir = "c:/Users/hxr/CodeBuddy/20260806190546/binglang-jianghu-game"
$html = [IO.File]::ReadAllText("$dir/index.html", [Text.Encoding]::UTF8)
$css  = [IO.File]::ReadAllText("$dir/style.css",  [Text.Encoding]::UTF8)
$js   = [IO.File]::ReadAllText("$dir/game.js",    [Text.Encoding]::UTF8)

# 1) Remove external-image loading block from game.js (deploy has no separate image files, use pixel art)
$startKey = 'const imgMap = {'
$endKey   = 'const art = PIXEL_ARTS[eventId]'
$si = $js.IndexOf($startKey)
$ei = $js.IndexOf($endKey)
if ($si -ge 0 -and $ei -gt $si) {
    $lineStart = $js.LastIndexOf("`n", $si) + 1
    $js = $js.Substring(0, $lineStart) + $js.Substring($ei)
    Write-Output "Removed external image block."
} else {
    Write-Output "WARN: markers not found (si=$si ei=$ei)"
}

# 2) Inline CSS
$html = $html.Replace('<link rel="stylesheet" href="style.css">', "<style>`n$css`n</style>")

# 3) Inline JS
$html = $html.Replace('<script src="game.js"></script>', "<script>`n$js`n</script>")

# 4) Write UTF-8 without BOM
[IO.File]::WriteAllText("$dir/deploy.html", $html, (New-Object Text.UTF8Encoding($false)))
Write-Output ("deploy.html size: " + (Get-Item "$dir/deploy.html").Length + " bytes")
