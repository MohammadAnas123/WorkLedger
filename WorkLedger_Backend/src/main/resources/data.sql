CREATE SEQUENCE IF NOT EXISTS receipt_counter START WITH 1043;

INSERT INTO clients (id, name, phone, address, work_type, status, created_at, notes, cancel_reason, cancel_note, cancelled_at)
VALUES
('c1', 'Rakesh Verma', '9876543210', 'Gomti Nagar, Lucknow', 'interior', 'in_progress', '2026-05-12', 'False ceiling + wall paneling in living room', NULL, NULL, NULL),
('c2', 'Sunita Agarwal', '9123456780', 'Hazratganj, Lucknow', 'electric', 'completed', '2026-05-02', 'Full house rewiring, 2BHK', NULL, NULL, NULL),
('c3', 'Imran Khan', '9988776655', 'Aliganj, Lucknow', 'plumbing', 'in_progress', '2026-06-01', 'Bathroom pipeline replacement', NULL, NULL, NULL),
('c4', 'Deepak Mishra', '9090909090', 'Indira Nagar, Lucknow', 'molding', 'cancelled', '2026-05-20', 'Cornice molding, hall + bedroom', 'hired_other', 'Found a cheaper contractor through a relative', '2026-05-24')
ON CONFLICT (id) DO NOTHING;

INSERT INTO materials (id, client_id, item_name, shop_name, quantity, unit, real_price, commission, date)
VALUES
('m1', 'c1', 'PVC Ceiling Panels', 'Sharma Hardware', 12, 'pcs', 2400.0, 360.0, '2026-05-13'),
('m2', 'c1', 'Wooden Beading', 'Sharma Hardware', 30, 'ft', 1500.0, 200.0, '2026-05-13'),
('m3', 'c1', 'Adhesive + Screws', 'Local Store', 1, 'set', 650.0, 50.0, '2026-05-15'),
('m4', 'c2', 'Copper Wire 1.5mm', 'Anand Electricals', 4, 'coil', 6800.0, 700.0, '2026-05-03'),
('m5', 'c2', 'MCB Distribution Box', 'Anand Electricals', 1, 'pc', 1850.0, 250.0, '2026-05-04'),
('m6', 'c2', 'Switches & Sockets', 'Anand Electricals', 22, 'pcs', 3300.0, 400.0, '2026-05-05'),
('m7', 'c3', 'CPVC Pipes 1 inch', 'Khan Sanitary', 8, 'pcs', 2000.0, 300.0, '2026-06-02'),
('m8', 'c3', 'Bathroom Fittings', 'Khan Sanitary', 1, 'set', 4200.0, 500.0, '2026-06-03')
ON CONFLICT (id) DO NOTHING;

INSERT INTO labour (id, client_id, description, amount, date)
VALUES
('l1', 'c2', 'Wiring + fitting labour (2BHK, 6 days)', 9000.0, '2026-05-08'),
('l2', 'c1', 'Ceiling installation labour (in progress)', 3000.0, '2026-05-16')
ON CONFLICT (id) DO NOTHING;
