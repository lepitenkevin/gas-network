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
?>
<?php include 'db.php'; ?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Gas Types</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">

<div class="container mt-5">
    
    <div class="mb-4">
        <a href="index.php" class="btn btn-outline-secondary">← Back to Main Dashboard</a>
    </div>

    <div class="row g-4">
        <div class="col-md-4">
            <div class="card shadow-sm border-info">
                <div class="card-header bg-info text-dark">
                    <h5 class="mb-0">➕ Add Gas Type</h5>
                </div>
                <div class="card-body">
                    <form action="process.php" method="POST">
                        <div class="mb-3">
                            <label class="form-label fw-bold">Fuel Name</label>
                            <input type="text" name="name" class="form-control" placeholder="e.g. V-Power Racing" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label fw-bold">Category</label>
                            <select name="category" class="form-select" required>
                                <option value="unleaded">Unleaded</option>
                                <option value="premium">Premium</option>
                                <option value="diesel">Diesel</option>
                            </select>
                        </div>
                        <div class="mb-4">
                            <label class="form-label fw-bold">Badge Color</label>
                            <select name="color_code" class="form-select" required>
                                <option value="green">Green (Default / Unleaded)</option>
                                <option value="red">Red (Premium)</option>
                                <option value="gray">Gray (Diesel)</option>
                                <option value="blue">Blue</option>
                                <option value="yellow">Yellow</option>
                            </select>
                        </div>
                        <button type="submit" name="save_gas_type" class="btn btn-info w-100 fw-bold">Save Fuel Type</button>
                    </form>
                </div>
            </div>
        </div>

        <div class="col-md-8">
            <div class="card shadow-sm">
                <div class="card-header bg-dark text-white">
                    <h5 class="mb-0">📋 Master Gas List</h5>
                </div>
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-hover mb-0 align-middle">
                            <thead class="table-light">
                                <tr>
                                    <th>ID</th>
                                    <th>Fuel Name</th>
                                    <th>Category</th>
                                    <th>UI Badge Color</th>
                                    <th class="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php
                                $gases = $conn->query("SELECT * FROM gas_types ORDER BY name");
                                while ($row = $gases->fetch_assoc()): ?>
                                <tr>
                                    <td><?= $row['id']; ?></td>
                                    <td class="fw-bold text-primary"><?= htmlspecialchars($row['name']); ?></td>
                                    <td class="text-capitalize"><?= htmlspecialchars($row['category'] ?? 'Unleaded'); ?></td>
                                    <td>
                                        <?php 
                                            $color = $row['color_code'] ?? 'green';
                                            $badgeClass = ($color == 'red') ? 'bg-danger' : (($color == 'gray') ? 'bg-secondary' : 'bg-success');
                                        ?>
                                        <span class="badge <?= $badgeClass ?> text-uppercase"><?= $color ?></span>
                                    </td>
                                    <td class="text-end">
                                        <a href="edit_gas.php?id=<?= $row['id']; ?>" class="btn btn-sm btn-warning">Edit</a>
                                        <a href="process.php?delete_gas_type=<?= $row['id']; ?>" class="btn btn-sm btn-danger" onclick="return confirm('WARNING: Deleting this will ALSO delete all prices associated with this gas type across ALL branches. Continue?');">Delete</a>
                                    </td>
                                </tr>
                                <?php endwhile; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

</body>
</html>