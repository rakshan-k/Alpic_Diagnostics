/*
  # Add responsibility field to maintenance_records table

  1. Changes
    - Add responsibility column to maintenance_records table
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'maintenance_records' 
    AND column_name = 'responsibility'
  ) THEN
    ALTER TABLE maintenance_records ADD COLUMN responsibility text;
  END IF;
END $$;