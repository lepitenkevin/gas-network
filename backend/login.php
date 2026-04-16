<?php
include 'db.php';
session_name("GAS_PROJECT_SESSION");
session_start();

if (isset($_POST['login'])) {
    $user = $_POST['username'];
    $pass = $_POST['password'];

    $stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->bind_param("s", $user);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        if (password_verify($pass, $row['password'])) {
            $_SESSION['user_id'] = $row['id'];
            $_SESSION['role'] = $row['role'];
            $_SESSION['username'] = $row['username'];
            if ($_SESSION['role'] === 'admin') {
    header("Location: index.php");
} else {
    // Find the station ID owned by this user
    $uid = $_SESSION['user_id'];
    $st_check = $conn->query("SELECT id FROM stations WHERE user_id = $uid LIMIT 1");
    if ($st_row = $st_check->fetch_assoc()) {
        //header("Location: station_profile.php?id=" . $st_row['id']);
         header("Location: index.php");
    } else {
        header("Location: index.php"); // Fallback if no station is assigned yet
    }
}
            exit();
        }
    }
    $error = "Invalid username or password!";
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Login - Gas Project</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-secondary d-flex align-items-center vh-100">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-4 card p-4 shadow">
                <h3 class="text-center mb-4">⛽ Backend Login</h3>
                <?php if(isset($error)) echo "<div class='alert alert-danger'>$error</div>"; ?>
                <form method="POST">
                    <div class="mb-3">
                        <label>Username</label>
                        <input type="text" name="username" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label>Password</label>
                        <input type="password" name="password" class="form-control" required>
                    </div>
                    <button type="submit" name="login" class="btn btn-primary w-100">Login</button>
                </form>
            </div>
        </div>
    </div>
</body>
</html>