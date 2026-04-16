<?php
session_name("GAS_PROJECT_SESSION");
session_start();
session_unset();
session_destroy();

// Add a timestamp (?v=12345) to the URL to bypass any cache
header("Location: login.php?v=" . time());
exit();
?>