$base = "c:/Users/Babin Maden/OneDrive/Desktop/Gen A"
Set-Location $base
New-Item -ItemType Directory -Force -Path assets/images, assets/icons, assets/videos

Move-Item -Path assets/*.jpg, assets/*.jpeg, assets/*.png -Destination assets/images -ErrorAction SilentlyContinue
Move-Item -Path assets/*.mp4 -Destination assets/videos -ErrorAction SilentlyContinue

$files = Get-ChildItem -Path . -Filter *.html -Recurse
foreach ($file in $files) {
    $content = Get-Content $file.FullName
    $content = $content -replace 'assets/([^/]+\.(jpg|jpeg|png))', 'assets/images/$1'
    $content = $content -replace 'assets/([^/]+\.mp4)', 'assets/videos/$1'
    Set-Content -Path $file.FullName -Value $content
}
