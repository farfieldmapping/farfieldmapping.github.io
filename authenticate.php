<?php
session_start();

// Hardcoded for demonstration; ideally, you should verify against a secure database
$correct_username = "admin";
$correct_password = "password123"; 

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $input_user = $_POST['username'];
    $input_pass = $_POST['password'];

    if ($input_user === $correct_username && $input_pass === $correct_password) {
        // Store login status in the session
        $_SESSION['logged_in'] = true;
        $_SESSION['username'] = $input_user;
        
        // Redirect to your private page
        header("Location: private-page.php");
        exit;
    } else {
        echo "Invalid username or password. <a href='login.html'>Try again</a>";
    }
}
?>
