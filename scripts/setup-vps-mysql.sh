#!/bin/bash
# ============================================================
# VPS MySQL Setup - Lughaty Digital
# Jalankan via SSH: ssh root@202.10.41.139
# Lalu: bash scripts/setup-vps-mysql.sh
# ============================================================
set -e

DB_NAME="lughaty"
DB_USER="lughaty"
DB_PASS='1D$NtIYBLmezZhoQ5l@9i74#'
ROOT_PASS="J8izbvrk8TVcoXxEZHBu"

echo "========================================="
echo " Lughaty Digital - MySQL VPS Setup"
echo "========================================="

# --- 1. Buat database ---
echo ""
echo "[1/5] Creating database '$DB_NAME'..."
mysql -u root -p"$ROOT_PASS" -e "
  CREATE DATABASE IF NOT EXISTS $DB_NAME
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;"
echo "  -> Database '$DB_NAME' created."

# --- 2. Buat user ---
echo ""
echo "[2/5] Creating MySQL user '$DB_USER'@'%'..."
mysql -u root -p"$ROOT_PASS" -e "
  CREATE USER IF NOT EXISTS '$DB_USER'@'%' IDENTIFIED BY '$DB_PASS';
  GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'%';
  FLUSH PRIVILEGES;"
echo "  -> User '$DB_USER'@'%' created & granted."

# --- 3. Buat tabel users ---
echo ""
echo "[3/5] Creating table 'users'..."
mysql -u root -p"$ROOT_PASS" -e "
  USE $DB_NAME;
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;"
echo "  -> Table 'users' ready."

# --- 4. Buka bind-address ---
echo ""
echo "[4/5] Updating bind-address to 0.0.0.0..."
BIND_FILE="/etc/mysql/mysql.conf.d/mysqld.cnf"
if grep -q "^bind-address\s*=\s*127.0.0.1" "$BIND_FILE"; then
  sudo sed -i 's/^bind-address\s*=\s*127.0.0.1/bind-address = 0.0.0.0/' "$BIND_FILE"
  echo "  -> bind-address updated."
else
  echo "  -> bind-address already 0.0.0.0, skipping."
fi

# --- 5. Buka firewall ---
echo ""
echo "[5/5] Opening firewall port 3306..."
if command -v ufw &> /dev/null; then
  sudo ufw allow 3306/tcp
  sudo ufw reload
  echo "  -> UFW port 3306 opened."
else
  echo "  -> ufw not found, skipping (check iptables manually)."
fi

# --- Restart MySQL ---
echo ""
echo "Restarting MySQL..."
sudo systemctl restart mysql
echo "  -> MySQL restarted."

# --- Verifikasi ---
echo ""
echo "========================================="
echo " Verification"
echo "========================================="
echo ""
echo "[DB & User]"
mysql -u root -p"$ROOT_PASS" -e "SELECT user, host FROM mysql.user WHERE user='$DB_USER';"
echo ""
echo "[Database list]"
mysql -u root -p"$ROOT_PASS" -e "SHOW DATABASES;"
echo ""
echo "[Table users]"
mysql -u "$DB_USER" -p"$DB_PASS" -D "$DB_NAME" -e "DESCRIBE users;"
echo ""
echo "========================================="
echo " Done! Test external connection:"
echo "   mysql -h 202.10.41.139 -u $DB_USER -p'$DB_PASS' $DB_NAME"
echo "========================================="
