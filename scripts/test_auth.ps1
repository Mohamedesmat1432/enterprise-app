$body = @{
    email    = "admin@example.com"
    password = "admin123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/auth/login" -Method Post -Body $body -ContentType "application/json"
    $token = $response.access_token
    Write-Output "Token received."

    $users = Invoke-RestMethod -Uri "http://localhost:3000/users" -Method Get -Headers @{Authorization = "Bearer $token" }
    Write-Output "Users retrieved successfully:"
    $users | ConvertTo-Json -Depth 2
}
catch {
    Write-Error $_
}
