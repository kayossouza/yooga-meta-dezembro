const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Read .env.local manually
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  if (line && !line.startsWith('#')) {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length) {
      env[key.trim()] = valueParts.join('=').trim();
    }
  }
});

async function explore() {
  console.log('Connecting to:', env.DATABASE_HOST);
  console.log('User:', env.DATABASE_USER);

  const pool = mysql.createPool({
    host: env.DATABASE_HOST,
    user: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
    database: env.DATABASE_NAME,
    port: parseInt(env.DATABASE_PORT || '3306')
  });

  try {
    // Find store with IDI 148744
    const [stores] = await pool.execute('SELECT id, name, idi FROM store WHERE idi = ?', ['148744']);
    console.log('=== STORE 148744 ===');
    console.log(JSON.stringify(stores, null, 2));

    if (stores.length > 0) {
      const storeId = stores[0].id;

      // Check orders table structure
      const [columns] = await pool.execute('DESCRIBE `order`');
      console.log('\n=== ORDER TABLE STRUCTURE ===');
      columns.forEach(c => console.log(c.Field + ' - ' + c.Type));

      // Get sample orders for this store
      const [orders] = await pool.execute('SELECT * FROM `order` WHERE store_id = ? ORDER BY created_at DESC LIMIT 5', [storeId]);
      console.log('\n=== SAMPLE ORDERS ===');
      console.log(JSON.stringify(orders, null, 2));

      // Count orders in December 2025
      const [count] = await pool.execute(`
        SELECT
          COUNT(*) as total,
          SUM(total) as sum_total
        FROM \`order\`
        WHERE store_id = ?
          AND created_at >= '2025-12-01'
          AND created_at < '2026-01-01'
      `, [storeId]);
      console.log('\n=== ORDER STATS (December 2025) ===');
      console.log(JSON.stringify(count, null, 2));
    }

    await pool.end();
  } catch (err) {
    console.error('Error:', err.message);
    console.error(err);
  }
}

explore();
