/*
  # Medical Equipment Management System Schema

  1. New Tables
    - `users` - System users (admin managed)
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `password_hash` (text)
      - `created_at` (timestamp)
    
    - `customers` - Hospital/Customer information
      - `id` (uuid, primary key)
      - `hospital_name` (text)
      - `email` (text)
      - `contact_info` (text)
      - `hod_name` (text)
      - `created_at` (timestamp)
    
    - `equipment` - Equipment catalog
      - `id` (uuid, primary key)
      - `name` (text)
      - `model_number` (text)
      - `buy_price` (numeric)
      - `notes` (text)
      - `created_at` (timestamp)
    
    - `maintenance_records` - Equipment maintenance tracking
      - `id` (uuid, primary key)
      - `customer_id` (uuid, foreign key)
      - `equipment_id` (uuid, foreign key)
      - `serial_no` (text)
      - `installation_date` (date)
      - `warranty_years` (int)
      - `warranty_end_date` (date)
      - `service_status` (text)
      - `amc_start_date` (date)
      - `amc_end_date` (date)
      - `invoice_amount` (numeric)
      - `created_at` (timestamp)
    
    - `service_notes` - Service visit records
      - `id` (uuid, primary key)
      - `maintenance_record_id` (uuid, foreign key)
      - `visit_date` (date)
      - `technician_name` (text)
      - `notes` (text)
      - `created_at` (timestamp)
    
    - `calendar_events` - Dashboard calendar events
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `start_date` (timestamp)
      - `end_date` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_name text NOT NULL,
  email text NOT NULL,
  contact_info text NOT NULL,
  hod_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Equipment table
CREATE TABLE IF NOT EXISTS equipment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  model_number text NOT NULL,
  buy_price numeric NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Maintenance records table
CREATE TABLE IF NOT EXISTS maintenance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  equipment_id uuid REFERENCES equipment(id) ON DELETE CASCADE,
  serial_no text NOT NULL,
  installation_date date NOT NULL,
  warranty_years int NOT NULL,
  warranty_end_date date NOT NULL,
  service_status text NOT NULL,
  amc_start_date date,
  amc_end_date date,
  invoice_amount numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Service notes table
CREATE TABLE IF NOT EXISTS service_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  maintenance_record_id uuid REFERENCES maintenance_records(id) ON DELETE CASCADE,
  visit_date date NOT NULL,
  technician_name text NOT NULL,
  notes text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Calendar events table
CREATE TABLE IF NOT EXISTS calendar_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow authenticated read access" ON users
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated full access" ON customers
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated full access" ON equipment
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated full access" ON maintenance_records
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated full access" ON service_notes
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated full access" ON calendar_events
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);