-- Optional dev seed: assign distinct PKR prices to the first three products (by created_at).
-- Run manually when you want visible price spread for sorting/filters: psql ... -f supabase/seed-mock-prices.sql
WITH ordered AS (
  SELECT id, row_number() OVER (ORDER BY created_at ASC) AS rn
  FROM products
)
UPDATE products AS p
SET price = v.new_price
FROM ordered AS o
JOIN (VALUES (1, 5200), (2, 4750), (3, 6100)) AS v(rn, new_price) ON o.rn = v.rn
WHERE p.id = o.id;
