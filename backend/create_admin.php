<?php
include 'db.php';
$username = 'your_admin_username'; // Change this!
$password = password_hash('your_admin_password', PASSWORD_DEFAULT); // Change this!
$role = 'admin';

$conn->query("INSERT INTO users (username, password, role) VALUES ('$username', '$password', '$role')");
echo "Admin user created. DELETE THIS FILE NOW!";
?>