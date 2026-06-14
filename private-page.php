<?php
session_start();

// Check if the user is logged in. If not, kick them out to the login page.
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    header("Location: login.html");
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Secret Dashboard</title>
</head>
<body>
    <h1>Welcome to the Protected Area, <?php echo htmlspecialchars($_SESSION['username']); ?>!</h1>
    <p>This content is highly secure and only visible to logged-in users.</p>
    <p><a href="logout.php">Log Out</a></p>
</body>
</html>
