<?php
session_start();
// Prevent browser caching
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}
?>
<?php
include 'db.php';

if (isset($_GET['id'])) {
    $station_id = $_GET['id'];
    $result = $conn->query("SELECT * FROM stations WHERE id = $station_id");
    
    if ($result->num_rows == 1) {
        $row = $result->fetch_assoc();
    } else {
        header("location: index.php");
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
    <title>Edit Branch Info</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">

<div class="container mt-5">
    <div class="row justify-content-center">
        <div class="col-md-6">
            <div class="card shadow-sm border-primary">
                <div class="card-header bg-primary text-white">
                    <h5 class="mb-0">🏢 Edit Branch Information & Location</h5>
                </div>
                <div class="card-body">
                    <form action="process.php" method="POST">
                        <input type="hidden" name="station_id" value="<?= $row['id']; ?>">
                        
                        <div class="mb-3">
                            <label class="form-label">Brand / Station Name</label>
                            <input type="text" name="name" class="form-control" value="<?= $row['name']; ?>" required>
                        </div>
                        
                        <div class="mb-4">
                            <label class="form-label">Location (City/Area)</label>
                            <input type="text" name="location" class="form-control" value="<?= $row['location']; ?>" required>
                        </div>

                        <h6 class="text-muted border-bottom pb-2 mb-3">📍 Map Coordinates</h6>
                        <div class="row g-3 mb-4">
                            <div class="col-md-6">
                                <label class="form-label small">Latitude</label>
                                <input type="number" step="any" name="latitude" class="form-control" value="<?= $row['latitude']; ?>" placeholder="e.g. 11.0504">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label small">Longitude</label>
                                <input type="number" step="any" name="longitude" class="form-control" value="<?= $row['longitude']; ?>" placeholder="e.g. 124.0112">
                            </div>
                            <div class="col-12 mt-1">
                                <small class="text-muted"><em>Tip: Right-click on Google Maps to copy the Latitude and Longitude numbers.</em></small>
                            </div>
                        </div>
                        
                        <div class="d-flex justify-content-between">
                            <a href="index.php" class="btn btn-outline-secondary">Cancel</a>
                            <button type="submit" name="update_station" class="btn btn-primary fw-bold">Update Branch</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

</body>
</html>