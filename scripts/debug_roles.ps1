$adminBody = @{
    email = "admin@example.com"
    password = "admin123"
} | ConvertTo-Json

try {
    # 1. Login Admin
    $adminRes = Invoke-RestMethod -Uri "http://localhost:3000/auth/login" -Method Post -Body $adminBody -ContentType "application/json"
    $adminToken = $adminRes.access_token

    # 2. Get All Roles to see their permissions
    $roles = Invoke-RestMethod -Uri "http://localhost:3000/roles" -Method Get -Headers @{Authorization = "Bearer $adminToken"}
    
    foreach ($role in $roles) {
        Write-Output "Role: $($role.name) (ID: $($role.id))"
        if ($role.permissions) {
             $role.permissions | ForEach-Object { Write-Output "  - $($_.slug)" }
        } else {
             Write-Output "  [No permissions visible in response]"
        }
    }

} catch {
    Write-Error "Failed to inspect roles: $_"
}
