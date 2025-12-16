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
    write-output "Logging in Admin..."
    $adminRes = Invoke-RestMethod -Uri "http://localhost:3000/auth/login" -Method Post -Body $adminBody -ContentType "application/json"
    $adminToken = $adminRes.access_token

    # 2. Login User
    write-output "Logging in User..."
    $userRes = Invoke-RestMethod -Uri "http://localhost:3000/auth/login" -Method Post -Body $userBody -ContentType "application/json"
    $userToken = $userRes.access_token

    # 3. Test: User CAN read users (should have 'read.users')
    write-output "Test 1: User reading all users..."
    try {
        Invoke-RestMethod -Uri "http://localhost:3000/users" -Method Get -Headers @{Authorization = "Bearer $userToken"}
        Write-Output "SUCCESS: User can read users."
    } catch {
        Write-Error "FAILURE: User blocked from reading users: $_"
    }

    # 4. Test: User CANNOT create roles (should NOT have 'create.roles')
    write-output "Test 2: User creating a role (Restricted)..."
    $roleBody = @{
        name = "HackerRole"
        description = "Should fail"
    } | ConvertTo-Json
    try {
        Invoke-RestMethod -Uri "http://localhost:3000/roles" -Method Post -Body $roleBody -ContentType "application/json" -Headers @{Authorization = "Bearer $userToken"}
        Write-Output "FAILURE: User was able to create a role!"
    } catch {
        $status = $_.Exception.Response.StatusCode
        if ($status -eq "Forbidden") {
             Write-Output "SUCCESS: User blocked from creating roles (403)."
        } else {
             Write-Output "WARNING: User blocked but status was $status"
        }
    }

    # 5. Test: Admin CAN create roles (has 'create.roles' or bypass)
    write-output "Test 3: Admin creating a role..."
    $adminRoleBody = @{
        name = "NewAdminRole"
        description = "Should succeed"
    } | ConvertTo-Json
    try {
        $res = Invoke-RestMethod -Uri "http://localhost:3000/roles" -Method Post -Body $adminRoleBody -ContentType "application/json" -Headers @{Authorization = "Bearer $adminToken"}
        Write-Output "SUCCESS: Admin created role. ID: $($res.id)"
    } catch {
        Write-Error "FAILURE: Admin blocked from creating roles: $_"
    }

} catch {
    Write-Error "General Failure: $_"
}
