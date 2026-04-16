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
<?php include 'db.php'; ?>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

<div class="container mt-5">
    <h2>🛠️ Review Moderation</h2>
    <div class="row g-4">
        <?php
        $pending = $conn->query("SELECT r.*, s.name as s_name FROM reviews r JOIN stations s ON r.station_id = s.id WHERE is_approved = 0");
        while($rev = $pending->fetch_assoc()): ?>
            <div class="col-md-6">
                <div class="card h-100">
                    <div class="card-body">
                        <h5><?= $rev['s_name'] ?> - <span class="text-warning"><?= $rev['rating'] ?> Stars</span></h5>
                        <p class="mb-1"><strong>By:</strong> <?= $rev['user_name'] ?> (<?= $rev['ip_address'] ?>)</p>
                        <p class="text-muted"><?= $rev['comment'] ?></p>
                        <?php if($rev['photo_path']): ?>
                            <img src="<?= $rev['photo_path'] ?>" class="img-fluid rounded mb-3" style="max-height: 150px;">
                        <?php endif; ?>
                        <div class="d-flex gap-2">
                            <a href="process.php?approve_rev=<?= $rev['id'] ?>" class="btn btn-success btn-sm">Approve</a>
                            <a href="process.php?delete_rev=<?= $rev['id'] ?>" class="btn btn-danger btn-sm">Delete</a>
                        </div>
                    </div>
                </div>
            </div>
        <?php endwhile; ?>
    </div>
</div>