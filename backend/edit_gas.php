<?php
session_name("GAS_PROJECT_SESSION");
session_start();
header("Cache-Control: no-cache, no-store, must-revalidate"); 
header("Pragma: no-cache"); 
header("Expires: 0");

if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}
include 'db.php';

if (isset($_GET['id'])) {
    $id = intval($_GET['id']);
    $result = $conn->query("SELECT * FROM gas_types WHERE id = $id");
    
    if ($result->num_rows == 1) {
        $row = $result->fetch_assoc();
    } else {
        header("location: manage_gases.php");
        exit();
    }
} else {
    header("location: manage_gases.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Gas Type</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">

<div class="container mt-5">
    <div class="row justify-content-center">
        <div class="col-md-5">
            <div class="card shadow-sm border-warning">
                <div class="card-header bg-warning text-dark">
                    <h5 class="mb-0">✏️ Edit Gas Type</h5>
                </div>
                <div class="card-body">
                    <form action="process.php" method="POST">
                        <input type="hidden" name="gas_id" value="<?= $row['id']; ?>">
                        
                        <div class="mb-3">
                            <label class="form-label fw-bold">Fuel Name</label>
                            <input type="text" name="name" class="form-control form-control-lg" value="<?= htmlspecialchars($row['name']); ?>" required>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label fw-bold">Category</label>
                            <select name="category" class="form-select">
                                <option value="unleaded" <?= ($row['category'] == 'unleaded') ? 'selected' : ''; ?>>Unleaded</option>
                                <option value="premium" <?= ($row['category'] == 'premium') ? 'selected' : ''; ?>>Premium</option>
                                <option value="diesel" <?= ($row['category'] == 'diesel') ? 'selected' : ''; ?>>Diesel</option>
                            </select>
                        </div>

                        <div class="mb-4">
                            <label class="form-label fw-bold">UI Badge Color</label>
                            <select name="color_code" class="form-select">
                                <option value="green" <?= ($row['color_code'] == 'green') ? 'selected' : ''; ?>>Green</option>
                                <option value="red" <?= ($row['color_code'] == 'red') ? 'selected' : ''; ?>>Red</option>
                                <option value="gray" <?= ($row['color_code'] == 'gray') ? 'selected' : ''; ?>>Gray</option>
                                <option value="blue" <?= ($row['color_code'] == 'blue') ? 'selected' : ''; ?>>Blue</option>
                                <option value="yellow" <?= ($row['color_code'] == 'yellow') ? 'selected' : ''; ?>>Yellow</option>
                            </select>
                        </div>
                        
                        <div class="d-flex justify-content-between">
                            <a href="manage_gases.php" class="btn btn-outline-secondary">Cancel</a>
                            <button type="submit" name="update_gas_type" class="btn btn-warning fw-bold">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

</body>
</html>