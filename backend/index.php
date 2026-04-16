<?php
// Rename the session to avoid conflicts with other apps on your server
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

$user_id = $_SESSION['user_id'];
$role = $_SESSION['role'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gas Station Network</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
    </style>
</head>
<body class="bg-light">

<nav class="navbar navbar-dark bg-dark mb-4">
    <div class="container">
        <span class="navbar-brand mb-0 h1">⛽ GasNet Backend</span>
        <div class="d-flex border-start ps-3">
            <span class="text-light me-3 mt-1 small">User: <strong><?= $_SESSION['username'] ?></strong></span>
            <a href="logout.php" class="btn btn-sm btn-outline-danger">Logout</a>
        </div>
    </div>
</nav>

<div class="container">
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h2 class="mb-0"><?= $role === 'admin' ? 'Admin Dashboard' : 'My Station' ?></h2>
        
        <div class="d-flex gap-2">
            <?php if ($role === 'admin'): ?>
                <a href="users.php" class="btn btn-primary">👥 Manage Users</a>
                <a href="manage_gases.php" class="btn btn-outline-dark">⚙️ Master Gas List</a>
                
                <form action="process.php" method="POST" class="d-flex gap-2">
                    <input type="text" name="name" class="form-control" placeholder="Brand" required>
                    <input type="text" name="location" class="form-control" placeholder="City" required>
                    
                    <select name="assigned_user" class="form-select" required>
                        <option value="">Assign Manager...</option>
                        <?php
                        $user_list = $conn->query("SELECT id, username FROM users WHERE role = 'station'");
                        while($ul = $user_list->fetch_assoc()) {
                            echo "<option value='{$ul['id']}'>{$ul['username']}</option>";
                        }
                        ?>
                    </select>
                    
                    <button type="submit" name="save_station" class="btn btn-primary">Create</button>
                </form>
            <?php endif; ?>
        </div>
    </div>

    <?php
    // Filter view: Admin sees all, Manager sees only their assigned station
    $where_clause = ($role === 'admin') ? "" : " WHERE stations.user_id = $user_id";

        $query = "
            SELECT 
                stations.id AS station_id, 
                stations.name AS station_name, 
                stations.location, 
                gas_types.name AS gas_name, 
                station_fuels.price,
                users.username AS manager_name,
                (SELECT COUNT(*) FROM reviews WHERE station_id = stations.id AND is_approved = 0) as pending_reviews
            FROM stations
            LEFT JOIN station_fuels ON stations.id = station_fuels.station_id
            LEFT JOIN gas_types ON station_fuels.gas_type_id = gas_types.id
            LEFT JOIN users ON stations.user_id = users.id
            $where_clause
            ORDER BY stations.name, stations.location, gas_types.name
        ";

        $result = $conn->query($query);
        $network = [];
        while ($row = $result->fetch_assoc()) {
            $s_id = $row['station_id'];
            if (!isset($network[$s_id])) {
                $network[$s_id] = [
                    'name' => $row['station_name'],
                    'location' => $row['location'],
                    'pending' => $row['pending_reviews'],
                    'manager' => $row['manager_name'], // New: Store the manager name
                    'fuels' => []
                ];
            }
            if ($row['gas_name'] !== null) {
                $network[$s_id]['fuels'][] = [
                    'name' => $row['gas_name'],
                    'price' => $row['price']
                ];
            }
        }
        ?>

    <div class="row g-4">
    <?php foreach ($network as $id => $branch): ?>
        <div class="col-md-6 col-lg-4">
            <div class="card shadow-sm border-0 h-100 d-flex flex-column position-relative">
                
                <?php if ($branch['pending'] > 0): ?>
                    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger animate-pulse" style="z-index: 10;">
                        <?= $branch['pending']; ?> New
                    </span>
                <?php endif; ?>

                <div class="card-body">
                    <h4 class="card-title text-primary mb-1">📍 <?= $branch['name']; ?></h4>
                    <p class="text-muted small mb-2"><?= $branch['location']; ?></p>
                    
                    <div class="mb-3">
                        <small class="text-secondary d-block mb-2">
                            👤 Manager: 
                            <?php if ($branch['manager']): ?>
                                <span class="fw-bold text-dark"><?= htmlspecialchars($branch['manager']); ?></span>
                            <?php else: ?>
                                <span class="text-danger italic">No assigned user yet</span>
                            <?php endif; ?>
                        </small>
                    </div>

                    <div class="mb-3">
                        <?php foreach ($branch['fuels'] as $fuel): ?>
                            <span class="badge bg-success mb-1"><?= $fuel['name']; ?> - ₱<?= number_format($fuel['price'], 2); ?></span>
                        <?php endforeach; ?>
                    </div>
                </div>
                
                <div class="card-footer bg-white border-top-0 mt-auto">
                    <a href="station_profile.php?id=<?= $id; ?>" class="btn <?= $branch['pending'] > 0 ? 'btn-danger' : 'btn-outline-dark' ?> w-100">Manage Profile</a>
                </div>
            </div>
        </div>
    <?php endforeach; ?>
</div>
</div>
</body>
</html>