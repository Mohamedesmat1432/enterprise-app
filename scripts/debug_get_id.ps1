$adminBody = @{
    email = "admin@example.com"
    password = "admin123"
} | ConvertTo-Json

try {
    # 1. Login
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/auth/login" -Method Post -Body $adminBody -ContentType "application/json"
    $token = $loginResponse.access_token
    Write-Output "Token received: $token"

    # Decode token payload (naive base64 decode for debug)
    $payloadPart = $token.Split(".")[1]
    # Add padding if needed
    $padLength = 4 - ($payloadPart.Length % 4)
    if ($padLength -lt 4) {
        $payloadPart += "=" * $padLength
    }
    $decodedBytes = [System.Convert]::FromBase64String($payloadPart)
    $decodedText = [System.Text.Encoding]::UTF8.GetString($decodedBytes)
    Write-Output "Token Payload: $decodedText"

    # 2. Get User by ID
    Write-Output "Testing GET /users/1..."
    try {
        $user = Invoke-RestMethod -Uri "http://localhost:3000/users/1" -Method Get -Headers @{Authorization = "Bearer $token"}
        Write-Output "GET /users/1 Success"
        $user | ConvertTo-Json -Depth 2
    } catch {
        Write-Error "GET /users/1 Failed: $_"
        Write-Output "Status: $($_.Exception.Response.StatusCode)"
    }

    # 3. Get Role by ID
    Write-Output "Testing GET /roles/1..."
    try {
        $role = Invoke-RestMethod -Uri "http://localhost:3000/roles/1" -Method Get -Headers @{Authorization = "Bearer $token"}
        Write-Output "GET /roles/1 Success"
        $role | ConvertTo-Json -Depth 2
    } catch {
         Write-Error "GET /roles/1 Failed: $_"
         Write-Output "Status: $($_.Exception.Response.StatusCode)"
    }

} catch {
    Write-Error "Login Failed: $_"
}
