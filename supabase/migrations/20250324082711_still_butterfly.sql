/*
  # Add Service Visits Table

  1. New Tables
    - `service_visits` - Track service visit details for maintenance records
      - `id` (uuid, primary key) - Unique identifier for each visit
      - `maintenance_record_id` (uuid, foreign key) - Reference to maintenance record
      - `visit_date` (date) - Date of the service visit
      - `technician_name` (text) - Name of the technician who performed the service
      - `description` (text) - Details about the service performed
      - `created_at` (timestamptz) - Timestamp of record creation

  2. Security
    - Enable Row Level Security (RLS) on service_visits table
    - Add policy for authenticated users to have full access

  3. Dependencies
    - Requires maintenance_records table to exist
    - Requires auth schema for RLS policies
*/

-- First check if the table doesn't already exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'service_visits'
  ) THEN
    -- Create the service_visits table
    CREATE TABLE service_visits (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      maintenance_record_id uuid NOT NULL,
      visit_date date NOT NULL,
      technician_name text NOT NULL,
      description text NOT NULL,
      created_at timestamptz DEFAULT now(),
      CONSTRAINT fk_maintenance_record
        FOREIGN KEY (maintenance_record_id)
        REFERENCES maintenance_records(id)
        ON DELETE CASCADE
    );

    -- Enable Row Level Security
    ALTER TABLE service_visits ENABLE ROW LEVEL SECURITY;

    -- Create policy for authenticated users
    CREATE POLICY "Allow authenticated full access" ON service_visits
      FOR ALL TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;