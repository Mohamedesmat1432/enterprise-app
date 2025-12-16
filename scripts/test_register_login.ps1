$randomInt = Get-Random -Minimum 1000 -Maximum 9999
$email = "testuser$randomInt@example.com"
$password = "password123"

$registerBody = @{
    name     = "Test User $randomInt"
    email    = $email
    age      = 25
    password = $password
} | ConvertTo-Json

Write-Output "Attempting to register user: $email"
try {
    $registerResponse = Invoke-RestMethod -Uri "http://localhost:3000/auth/register" -Method Post -Body $registerBody -ContentType "application/json"
    Write-Output "Registration Successful."
    $registerResponse | ConvertTo-Json -Depth 2
}
catch {
    Write-Error "Registration Failed: $_"
    exit 1
}

$loginBody = @{
    email    = $email
    password = $password
} | ConvertTo-Json

Write-Output "Attempting to login user: $email"
try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    Write-Output "Login Successful."
    $token = $loginResponse.access_token
    Write-Output "Token Received: $token"
}
catch {
    Write-Error "Login Failed: $_"
    exit 1
}
