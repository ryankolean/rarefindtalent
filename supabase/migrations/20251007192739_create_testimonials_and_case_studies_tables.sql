/*
  # Create Testimonials and Case Studies Tables

  1. New Tables
    - `testimonials`
      - `id` (uuid, primary key)
      - `client_name` (text) - Name of the person providing testimonial
      - `client_title` (text) - Job title of the person
      - `client_company` (text) - Company name
      - `testimonial_text` (text) - The testimonial content
      - `rating` (integer) - Rating out of 5
      - `is_featured` (boolean) - Whether to feature on homepage
      - `display_order` (integer) - Order for displaying
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `case_studies`
      - `id` (uuid, primary key)
      - `title` (text) - Case study title
      - `client_name` (text) - Client/company name
      - `industry` (text) - Industry sector
      - `challenge` (text) - The challenge faced
      - `solution` (text) - How we solved it
      - `results` (text) - Outcomes achieved
      - `timeline` (text) - How long it took
      - `position_filled` (text) - Type of position
      - `is_published` (boolean) - Whether to show publicly
      - `display_order` (integer) - Order for displaying
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
    - Add policies for authenticated admin operations
*/

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  client_title text,
  client_company text,
  testimonial_text text NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  is_featured boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create case studies table
CREATE TABLE IF NOT EXISTS case_studies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  client_name text,
  industry text,
  challenge text NOT NULL,
  solution text NOT NULL,
  results text NOT NULL,
  timeline text,
  position_filled text,
  is_published boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;

-- Testimonials policies
CREATE POLICY "Public can view featured testimonials"
  ON testimonials FOR SELECT
  TO anon
  USING (is_featured = true);

CREATE POLICY "Authenticated users can view all testimonials"
  ON testimonials FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert testimonials"
  ON testimonials FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update testimonials"
  ON testimonials FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete testimonials"
  ON testimonials FOR DELETE
  TO authenticated
  USING (true);

-- Case studies policies
CREATE POLICY "Public can view published case studies"
  ON case_studies FOR SELECT
  TO anon
  USING (is_published = true);

CREATE POLICY "Authenticated users can view all case studies"
  ON case_studies FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert case studies"
  ON case_studies FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update case studies"
  ON case_studies FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete case studies"
  ON case_studies FOR DELETE
  TO authenticated
  USING (true);

-- Insert sample testimonials
INSERT INTO testimonials (client_name, client_title, client_company, testimonial_text, rating, is_featured, display_order)
VALUES 
  ('Sarah Johnson', 'VP of Engineering', 'TechCorp Inc', 'Working with Rare Find Talent was a game-changer for our hiring process. They found us an exceptional VP of Product in just 3 weeks, and the candidate has been instrumental in driving our product strategy forward.', 5, true, 1),
  ('Michael Chen', 'CEO', 'StartupHub', 'Krysta''s personalized approach and deep understanding of our company culture resulted in perfect matches for multiple senior positions. Her network is impressive and she truly cares about long-term fit.', 5, true, 2),
  ('Emily Rodriguez', 'HR Director', 'FinanceFirst', 'The contract services provided by Rare Find Talent helped us navigate a critical transition period. The professionals they placed integrated seamlessly into our team and delivered exceptional results.', 5, true, 3),
  ('David Thompson', 'CTO', 'DataDynamics', 'After struggling with other recruiting firms, Rare Find Talent found us three senior engineers who have become core team members. The quality of candidates and speed of placement exceeded our expectations.', 5, true, 4);

-- Insert sample case studies
INSERT INTO case_studies (title, client_name, industry, challenge, solution, results, timeline, position_filled, is_published, display_order)
VALUES 
  (
    'Scaling Engineering Leadership for a Growing SaaS Company',
    'TechVision SaaS',
    'Technology',
    'A rapidly growing SaaS company needed to build out their engineering leadership team to support 3x revenue growth, but struggled to find experienced candidates who fit their collaborative culture.',
    'We conducted a comprehensive needs assessment and leveraged our network of senior engineering leaders. Through targeted outreach and thorough cultural fit screening, we identified and placed a VP of Engineering and two Engineering Directors.',
    'All three positions filled within 8 weeks. The new leadership team implemented agile processes that increased development velocity by 40% and improved team retention by 25% in the first year.',
    '8 weeks',
    'VP of Engineering, 2x Engineering Directors',
    true,
    1
  ),
  (
    'Contract-to-Hire Success in Financial Services',
    'Premier Capital Group',
    'Financial Services',
    'A financial services firm needed specialized risk analysts for a 6-month regulatory compliance project, with the possibility of permanent placement for top performers.',
    'We provided three senior risk analysts on a contract basis, all with relevant regulatory experience. We managed the contract relationship and provided ongoing support throughout the engagement.',
    'Two of the three contractors were converted to full-time employees after 4 months. The compliance project was completed ahead of schedule, and the company saved 30% on recruiting costs compared to traditional placement.',
    '4-6 months',
    '3x Senior Risk Analysts (Contract-to-Hire)',
    true,
    2
  );
