/*
  # Create Bookings Table for Calendar System

  1. New Tables
    - `consultation_bookings`
      - `id` (uuid, primary key)
      - `full_name` (text) - Client name
      - `email` (text) - Client email
      - `phone` (text) - Client phone
      - `company` (text) - Company name
      - `service_type` (text) - Type of service interested in
      - `consultation_date` (date) - Preferred consultation date
      - `consultation_time` (text) - Preferred time slot
      - `message` (text) - Additional information
      - `status` (text) - booking status (pending, confirmed, cancelled, completed)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on bookings table
    - Public can create bookings
    - Authenticated users can view and manage bookings
*/

-- Create consultation bookings table
CREATE TABLE IF NOT EXISTS consultation_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  service_type text NOT NULL,
  consultation_date date NOT NULL,
  consultation_time text NOT NULL,
  message text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

-- Enable RLS
ALTER TABLE consultation_bookings ENABLE ROW LEVEL SECURITY;

-- Bookings policies
CREATE POLICY "Anyone can create bookings"
  ON consultation_bookings FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all bookings"
  ON consultation_bookings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update bookings"
  ON consultation_bookings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete bookings"
  ON consultation_bookings FOR DELETE
  TO authenticated
  USING (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_consultation_bookings_date ON consultation_bookings(consultation_date, status);
CREATE INDEX IF NOT EXISTS idx_consultation_bookings_email ON consultation_bookings(email);
