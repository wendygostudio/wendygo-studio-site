$content = Get-Content -Path "C:\Users\Damian\wendygo-site\devto-content.md" -Raw
$title = "Stop Picking the Wrong Tool: Canva vs FrameForge for Creators"
$tags = "chrome,extensions,productivity,tutorial"

node "C:\Users\Damian\wendygo-agent\scripts\devto-post.js" $title $content $tags
