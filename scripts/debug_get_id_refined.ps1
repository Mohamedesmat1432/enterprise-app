$adminBody = @{
    email = "admin@example.com"
    password = "admin123"
} | ConvertTo-Json

try {
    # 1. Login
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/auth/login" -Method Post -Body $adminBody -ContentType "application/json"
    $token = $loginResponse.access_token
    Write-Output "Token received: $token"

    # 2. List Users to get a valid ID
    Write-Output "Listing Users to find valid ID..."
    $users = Invoke-RestMethod -Uri "http://localhost:3000/users" -Method Get -Headers @{Authorization = "Bearer $token"}
    if ($users.Count -gt 0) {
        $validId = $users[0].id
        Write-Output "Found User ID: $validId"

        # 3. Get User by Valid ID
        Write-Output "Testing GET /users/$validId..."
        try {
            $user = Invoke-RestMethod -Uri "http://localhost:3000/users/$validId" -Method Get -Headers @{Authorization = "Bearer $token"}
            Write-Output "GET /users/$validId Success"
            $user | ConvertTo-Json -Depth 2
        } catch {
            Write-Error "GET /users/$validId Failed: $_"
            Write-Output "Status: $($_.Exception.Response.StatusCode)"
        }
    } else {
        Write-Output "No users found to test."
    }

} catch {
    Write-Error "Test Failed: $_"
}
