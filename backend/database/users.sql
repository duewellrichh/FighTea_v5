-- ============================================================
-- FighTea — Default Admin Account
-- File: /backend/database/users.sql
-- Run AFTER schema.sql
--
-- IMPORTANT: Replace the hash below with a real bcrypt hash
-- before going live. See README.md for instructions.
--
-- INSERT IGNORE prevents duplicate entry errors if re-run.
-- ============================================================
USE `fightea_db`;

INSERT IGNORE INTO `users`
  (`full_name`, `email`, `phone`, `password_hash`, `role`)
VALUES (
  'FighTea Admin',
  'admin@fightea.com',
  NULL,
<<<<<<< HEAD
  '$2b$12$Hyi12wYdga4JjAFaqi5fMerVX0c/HUHF/Fw2FHbA4369yoZ5HJmzO',
=======
  '$2b$12$eOkCgzi7mDfGTPJUk9o8Ye/mC3N/quQJPiU50lcrDtup5bSzHmqbe',
>>>>>>> fef27f4cc1a0ba80081bbc1801bfdbf01ba6e728
  'admin'
);

-- ─── HOW TO GENERATE A REAL HASH ─────────────────────────────
-- Run this once in Node.js before importing this file:
--
--   node -e "require('bcrypt').hash('YourPassword',12).then(h=>console.log(h))"
--
-- Copy the printed hash and replace the placeholder above.
-- Then run:  mysql -u root -p fightea_db < backend/database/users.sql
-- ─────────────────────────────────────────────────────────────
