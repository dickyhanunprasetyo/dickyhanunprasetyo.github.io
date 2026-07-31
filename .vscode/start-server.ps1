# Stop any existing python http server
Stop-Process -Name python -Force -ErrorAction SilentlyContinue
Start-Sleep -Milliseconds 500

# Start the static server in a hidden window
Start-Process -WindowStyle Hidden -FilePath python -ArgumentList '-m', 'http.server', '8080', '--bind', '127.0.0.1'

Start-Sleep -Seconds 2
Write-Output 'Server started on http://localhost:8080'
