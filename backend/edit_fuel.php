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
$role = $_SESSION['role'];
?>
<?php
include 'db.php';

if (isset($_GET['id']) && isset($_GET['station_id'])) {
    $fuel_id = intval($_GET['id']);
    $station_id = intval($_GET['station_id']);

    // Fetch current fuel details AND the category/color so we can pre-select the dropdowns
    $query = "
        SELECT 
            sf.*, 
            gt.name as gas_name, 
            gt.category, 
            gt.color_code, 
            s.name as station_name 
        FROM station_fuels sf
        JOIN gas_types gt ON sf.gas_type_id = gt.id
        JOIN stations s ON sf.station_id = s.id
        WHERE sf.id = $fuel_id
    ";
    $result = $conn->query($query);

    if ($result->num_rows == 1) {
        $row = $result->fetch_assoc();
    } else {
        header("location: station_profile.php?id=$station_id");
        exit();
    }
} else {
    header("location: index.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Fuel - <?= htmlspecialchars($row['station_name']) ?></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">

<div class="container mt-5">
    <div class="row justify-content-center">
        <div class="col-md-5">
            <div class="card shadow-sm border-warning">
                <div class="card-header bg-warning text-dark">
                    <h5 class="mb-0">✏️ Edit Fuel: <?= htmlspecialchars($row['gas_name']) ?></h5>
                    <small><?= htmlspecialchars($row['station_name']) ?></small>
                </div>
                <div class="card-body">
                    <form action="process.php" method="POST">
                        <input type="hidden" name="fuel_id" value="<?= $fuel_id ?>">
                        <input type="hidden" name="station_id" value="<?= $station_id ?>">

                        <div class="mb-3">
                            <label class="form-label font-weight-bold">Gas Type / Name</label>
                            <input type="text" name="custom_gas_name" list="gasOptions" 
                                   class="form-control" value="<?= htmlspecialchars($row['gas_name']) ?>" required>
                            <datalist id="gasOptions">
                                <?php
                                $master_gases = $conn->query("SELECT name FROM gas_types ORDER BY name");
                                while ($mg = $master_gases->fetch_assoc()) {
                                    echo "<option value='" . htmlspecialchars($mg['name']) . "'>";
                                }
                                ?>
                            </datalist>
                            <div class="form-text">You can pick an existing type or type a new one.</div>
                        </div>

                        <div class="row mb-3 p-3 bg-light rounded border">
                            <div class="col-12 mb-2">
                                <small class="text-muted"><em style="font-size: 0.8rem;">If changing to a brand <strong>new</strong> gas name, select its badge details below:</em></small>
                            </div>
                            <div class="col-md-6 mb-2">
                                <label class="form-label small text-muted mb-1">Category</label>
                                <select name="category" class="form-select form-select-sm">
                                    <option value="unleaded" <?= ($row['category'] == 'unleaded') ? 'selected' : ''; ?>>Unleaded</option>
                                    <option value="premium" <?= ($row['category'] == 'premium') ? 'selected' : ''; ?>>Premium</option>
                                    <option value="diesel" <?= ($row['category'] == 'diesel') ? 'selected' : ''; ?>>Diesel</option>
                                </select>
                            </div>
                            <div class="col-md-6 mb-2">
                                <label class="form-label small text-muted mb-1">Badge Color</label>
                                <select name="color_code" class="form-select form-select-sm">
                                    <option value="green" <?= ($row['color_code'] == 'green') ? 'selected' : ''; ?>>Green (Unleaded)</option>
                                    <option value="red" <?= ($row['color_code'] == 'red') ? 'selected' : ''; ?>>Red (Premium)</option>
                                    <option value="gray" <?= ($row['color_code'] == 'gray') ? 'selected' : ''; ?>>Gray (Diesel)</option>
                                    <option value="blue" <?= ($row['color_code'] == 'blue') ? 'selected' : ''; ?>>Blue</option>
                                    <option value="yellow" <?= ($row['color_code'] == 'yellow') ? 'selected' : ''; ?>>Yellow</option>
                                </select>
                            </div>
                        </div>

                        <div class="mb-4">
                            <label class="form-label font-weight-bold">Price (₱)</label>
                            <input type="number" step="0.01" name="price" 
                                   class="form-control form-control-lg text-success fw-bold" 
                                   value="<?= $row['price'] ?>" required>
                        </div>

                        <div class="d-flex justify-content-between">
                            <a href="station_profile.php?id=<?= $station_id ?>" class="btn btn-outline-secondary">Cancel</a>
                            <button type="submit" name="update_fuel_complete" class="btn btn-warning fw-bold px-4">Update Fuel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

</body>
</html>