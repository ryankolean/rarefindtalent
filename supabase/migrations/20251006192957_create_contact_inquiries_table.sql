/*
  # Create contact_inquiries table

  1. New Tables
    - `contact_inquiries`
      - `id` (uuid, primary key) - Unique identifier for each inquiry
      - `full_name` (text, not null) - Full name of the person submitting
      - `email` (text, not null) - Email address for contact
      - `phone` (text) - Optional phone number
      - `company_name` (text) - Optional company name
      - `job_title` (text) - Optional job title
      - `inquiry_type` (text, not null) - Type of inquiry (consultation, contingency_placement, etc.)
      - `message` (text) - Optional detailed message about needs
      - `preferred_contact` (text) - Preferred contact method (email, phone, either)
      - `urgency` (text) - Timeline for response (immediate, within-week, within-month, flexible)
      - `created_at` (timestamptz, default now()) - Timestamp when inquiry was submitted
      
  2. Security
    - Enable RLS on `contact_inquiries` table
    - Add policy for anonymous users to insert their own inquiries
    - Add policy for authenticated users to view all inquiries (admin access)

  3. Notes
    - This table stores consultation booking requests from the website
    - Anonymous access is allowed for INSERT only to enable form submissions
    - Admin users can view all inquiries through authenticated access
*/

CREATE TABLE IF NOT EXISTS contact_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  company_name text,
  job_title text,
  inquiry_type text NOT NULL DEFAULT 'consultation',
  message text,
  preferred_contact text DEFAULT 'email',
  urgency text DEFAULT 'flexible',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit inquiries"
  ON contact_inquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all inquiries"
  ON contact_inquiries
  FOR SELECT
  TO authenticated
  USING (true);