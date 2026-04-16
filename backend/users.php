<?php
session_name("GAS_PROJECT_SESSION");
session_start();

// Add these to be 100% sure the browser doesn't keep a "ghost" copy
header("Cache-Control: no-cache, no-store, must-revalidate"); 
header("Pragma: no-cache"); 
header("Expires: 0");

if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

include 'db.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Manage Users</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
<div class="container mt-5">
    <div class="d-flex justify-content-between mb-4">
        <h2>👥 User Management</h2>
        <a href="index.php" class="btn btn-secondary">Back to Dashboard</a>
    </div>

    <div class="row">
        <div class="col-md-4">
            <div class="card shadow-sm">
                <div class="card-header bg-primary text-white">Add New Station Manager</div>
                <div class="card-body">
                    <form action="process.php" method="POST">
                        <div class="mb-3">
                            <label>Username</label>
                            <input type="text" name="username" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label>Password</label>
                            <input type="password" name="password" class="form-control" required>
                        </div>
                        <button type="submit" name="create_user" class="btn btn-primary w-100">Create Account</button>
                    </form>
                </div>
            </div>
        </div>
        <div class="col-md-8">
            <table class="table bg-white shadow-sm rounded">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    $res = $conn->query("SELECT * FROM users WHERE role = 'station'");
                    while($u = $res->fetch_assoc()): ?>
                        <tr>
                            <td><?= $u['username'] ?></td>
                            <td><span class="badge bg-info text-dark">Station Manager</span></td>
                            <td>
                                <a href="process.php?delete_user=<?= $u['id'] ?>" class="text-danger" onclick="return confirm('Delete this account?')">Delete</a>
                            </td>
                        </tr>
                    <?php endwhile; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>
</body>
</html>