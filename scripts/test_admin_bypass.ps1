$adminBody = @{
    email = "admin@example.com"
    password = "admin123"
} | ConvertTo-Json

$userBody = @{
    email = "user@example.com"
    password = "user123"
} | ConvertTo-Json

try {
    # 1. Login Admin
    $adminRes = Invoke-RestMethod -Uri "http://localhost:3000/auth/login" -Method Post -Body $adminBody -ContentType "application/json"
    $adminToken = $adminRes.access_token
    Write-Output "Admin Token received."

    # 2. Login User
    $userRes = Invoke-RestMethod -Uri "http://localhost:3000/auth/login" -Method Post -Body $userBody -ContentType "application/json"
    $userToken = $userRes.access_token
    Write-Output "User Token received."

    # 3. Test Admin Access to Restricted Route (Creating a Role - requires Admin role usually, or 'create.roles' permission)
    # We use /roles which is guarded by @Roles('Admin')
    $roleBody = @{
        name = "TestRole"
        description = "Test Role"
    } | ConvertTo-Json
    
    try {
        Invoke-RestMethod -Uri "http://localhost:3000/roles" -Method Post -Body $roleBody -ContentType "application/json" -Headers @{Authorization = "Bearer $adminToken"}
        Write-Output "SUCCESS: Admin accessed /roles (POST)"
    } catch {
        Write-Error "FAILURE: Admin blocked from /roles (POST): $_"
    }

    # 4. Test User Access to Restricted Route (Should Fail)
    try {
        Invoke-RestMethod -Uri "http://localhost:3000/roles" -Method Post -Body $roleBody -ContentType "application/json" -Headers @{Authorization = "Bearer $userToken"}
        Write-Output "FAILURE: User accessed /roles (POST) - logic is broken if this prints"
    } catch {
        $status = $_.Exception.Response.StatusCode
        if ($status -eq "Forbidden") {
             Write-Output "SUCCESS: User correctly blocked from /roles (POST) (Status: 403)"
        } else {
             Write-Output "WARNING: User blocked but with unexpected status: $status"
        }
    }

} catch {
    Write-Error "General Test Failure: $_"
}
