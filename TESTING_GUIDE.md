# Form Testing Guide

This document provides comprehensive testing procedures for the Book Consultation form.

## Test Scenarios Overview

| Test # | Scenario | Expected Result | Status |
|--------|----------|----------------|--------|
| 1 | Submit with all required fields | Success message displayed | ✅ Ready |
| 2 | Submit with missing required fields | Validation errors shown | ✅ Ready |
| 3 | Submit with invalid email | Email format error | ✅ Ready |
| 4 | Mobile device submission | Form works on mobile | ✅ Ready |
| 5 | Slow internet connection | Timeout handling works | ✅ Ready |
| 6 | Email notification delivery | Emails received | ⚠️ Requires RESEND_API_KEY |
| 7 | JavaScript disabled | Fallback message shown | ✅ Ready |

---

## Detailed Test Procedures

### Test 1: Submit Form with All Required Fields

**Purpose:** Verify successful form submission and user feedback

**Steps:**
1. Navigate to `/book-consultation`
2. Fill in the form:
   - Full Name: "John Doe"
   - Email: "john.doe@example.com"
   - Phone: "555-1234" (optional)
   - Company Name: "Acme Corp" (optional)
   - Job Title: "HR Manager" (optional)
   - Service Interest: Select "General Consultation"
   - Preferred Contact Method: "Email"
   - Timeline: "Within a Week"
   - Message: "Looking for executive recruitment services"
3. Click "Submit Consultation Request"

**Expected Results:**
- ✅ Loading spinner appears on button
- ✅ Button shows "Submitting..." text
- ✅ Form data is saved to `contact_inquiries` table in Supabase
- ✅ Success toast notification appears: "Consultation request submitted successfully!"
- ✅ Success page displays with checkmark animation
- ✅ Form is reset/cleared
- ✅ LocalStorage draft is removed
- ⚠️ Email notifications sent (if RESEND_API_KEY configured)

**Verification:**
```sql
-- Check database record
SELECT * FROM contact_inquiries
ORDER BY created_at DESC
LIMIT 1;
```

---

### Test 2: Submit with Missing Required Fields

**Purpose:** Verify client-side validation prevents incomplete submissions

**Steps:**
1. Navigate to `/book-consultation`
2. Leave required fields empty:
   - Leave "Full Name" empty
   - Leave "Email" empty
   - Leave "Service Interest" at default or unselected
3. Click "Submit Consultation Request"

**Expected Results:**
- ✅ Form does NOT submit
- ✅ Red border appears on invalid fields
- ✅ Error icon appears next to field labels
- ✅ Error messages display below each invalid field:
  - Full Name: "Full name must be at least 2 characters"
  - Email: "Please enter a valid email address"
  - Service Interest: "Please select a service interest"
- ✅ No network request is made
- ✅ No toast notifications appear
- ✅ Form remains on the page for correction

**Test Variations:**
- Try submitting with only 1 character in Full Name → Should show length error
- Try submitting with 101+ characters in Full Name → Should show max length error

---

### Test 3: Submit with Invalid Email Format

**Purpose:** Verify email validation catches malformed addresses

**Steps:**
1. Navigate to `/book-consultation`
2. Fill in the form with:
   - Full Name: "Jane Smith"
   - Email: "invalid-email" (no @ symbol)
   - Service Interest: "General Consultation"
3. Click "Submit Consultation Request"

**Expected Results:**
- ✅ Form does NOT submit
- ✅ Red border appears on email field
- ✅ Error message displays: "Please enter a valid email address"
- ✅ Alert icon appears next to error message

**Test Invalid Email Variations:**
- `plaintext` → Should fail
- `@example.com` → Should fail
- `user@` → Should fail
- `user @example.com` → Should fail
- `user@example` → Should fail (no TLD)

**Valid Email Examples (should pass):**
- `user@example.com` → Should succeed
- `user.name@example.co.uk` → Should succeed
- `user+tag@example.com` → Should succeed

---

### Test 4: Mobile Device Submission

**Purpose:** Verify responsive design and mobile usability

**Testing Methods:**

**Option A: Browser DevTools**
1. Open Chrome DevTools (F12)
2. Click "Toggle Device Toolbar" (Ctrl+Shift+M)
3. Select device: iPhone 12 Pro, Samsung Galaxy S20, iPad
4. Test at breakpoints: 320px, 375px, 768px, 1024px

**Option B: Real Device Testing**
1. Open on actual mobile device
2. Navigate to the booking form
3. Complete and submit the form

**Expected Results:**
- ✅ Form is fully visible without horizontal scroll
- ✅ Input fields are appropriately sized (height: 44px min for touch)
- ✅ Labels are readable (increased font size on mobile)
- ✅ Form fields stack vertically on small screens
- ✅ Two-column grid collapses to single column below 768px
- ✅ Submit button is full-width and easily tappable
- ✅ Virtual keyboard doesn't obscure input fields
- ✅ Validation errors are visible on mobile
- ✅ Success page displays correctly on mobile
- ✅ Touch interactions work smoothly (no lag)

**Mobile-Specific Checks:**
- Character counter remains visible above keyboard
- Toast notifications don't get hidden by keyboard
- Select dropdowns open properly on mobile browsers
- Form scrolls smoothly after validation errors

---

### Test 5: Slow Internet Connection Simulation

**Purpose:** Verify timeout handling and retry mechanisms

**Setup Using Chrome DevTools:**
1. Open Chrome DevTools (F12)
2. Go to "Network" tab
3. Click throttling dropdown (usually shows "No throttling")
4. Select "Slow 3G" or "Fast 3G"
5. Alternatively, add custom profile:
   - Download: 50 Kbps
   - Upload: 20 Kbps
   - Latency: 2000 ms

**Test Procedure:**
1. Apply network throttling
2. Fill out the form completely
3. Click "Submit Consultation Request"
4. Observe behavior

**Expected Results:**
- ✅ Loading spinner appears immediately
- ✅ Button shows "Submitting..." and is disabled
- ✅ Request attempts to complete within timeout (30s)
- ✅ If timeout occurs:
  - Error toast appears with message: "Request timeout - please check your internet connection"
  - Retry button appears in toast notification
  - Form data is preserved in the form fields
  - LocalStorage retains the draft data
- ✅ Click "Retry" button triggers new submission attempt
- ✅ Retry counter shows progress: "Retrying submission (1/3)..."
- ✅ After 3 failed retries, shows: "Maximum retry attempts reached"

**Test Variations:**
- Disconnect internet completely → Should show "No internet connection" error
- Reconnect during retry → Should successfully submit
- Close and reopen browser → Draft should be restored

---

### Test 6: Email Notification Verification

**Purpose:** Verify email delivery to both business owner and customer

**Prerequisites:**
⚠️ **IMPORTANT:** This test requires the `RESEND_API_KEY` to be configured in Supabase Edge Function secrets.

**Current Status:**
- Edge function is deployed: ✅ `send-contact-notification`
- API key configuration: ⚠️ Requires manual setup in Supabase Dashboard

**Configuration Steps:**
1. Log into Supabase Dashboard
2. Navigate to Edge Functions → Settings
3. Add secret: `RESEND_API_KEY` = `re_xxxxxxxxxxxxx`
4. Restart edge function if needed

**Test Procedure:**
1. Submit form with valid test email address you can access
2. Wait 1-2 minutes for email delivery
3. Check both inboxes

**Expected Results:**

**Business Owner Email (contact@rarefindtalent.com):**
- ✅ Subject: "New Contact Form Submission from [Full Name]"
- ✅ From: "Rare Find Talent <noreply@rarefindtalent.com>"
- ✅ Contains all form fields:
  - Full Name
  - Email (clickable mailto link)
  - Phone (clickable tel link, if provided)
  - Company (if provided)
  - Job Title (if provided)
  - Service Interest
  - Preferred Contact Method
  - Timeline
  - Message (if provided)
- ✅ Professional HTML formatting with brand colors
- ✅ Responsive email design

**Customer Confirmation Email:**
- ✅ Subject: "Thank You for Contacting Rare Find Talent"
- ✅ From: "Rare Find Talent <noreply@rarefindtalent.com>"
- ✅ Personalized with customer's name
- ✅ Confirms inquiry type received
- ✅ Sets expectation: "We'll review your information and get back to you within 24 hours"
- ✅ Professional signature from Krysta
- ✅ Contact information in footer

**Troubleshooting:**
If emails don't arrive:
- Check spam/junk folders
- Verify RESEND_API_KEY is valid
- Check Supabase Edge Function logs for errors
- Verify form still saves to database (email failure should not block submission)

---

### Test 7: JavaScript Disabled Behavior

**Purpose:** Verify graceful degradation without JavaScript

**Setup - Disable JavaScript in Chrome:**
1. Open Chrome DevTools (F12)
2. Press Ctrl+Shift+P (Cmd+Shift+P on Mac)
3. Type "javascript"
4. Select "Disable JavaScript"
5. Refresh the page

**Alternative - Chrome Settings:**
1. Go to `chrome://settings/content/javascript`
2. Select "Don't allow sites to use JavaScript"
3. Refresh the page

**Setup - Disable JavaScript in Firefox:**
1. Type `about:config` in address bar
2. Accept the warning
3. Search for `javascript.enabled`
4. Toggle to `false`

**Expected Results:**
- ✅ React app does not render
- ✅ Professional fallback message displays:
  - Title: "JavaScript Required"
  - Explanation of requirement
  - Alternative contact information box
- ✅ Email link is clickable: contact@rarefindtalent.com
- ✅ Message uses consistent branding (colors, typography)
- ✅ Fallback page is responsive and mobile-friendly
- ✅ No console errors or broken layout

**Re-enable JavaScript:**
- Reverse the steps above and refresh the page
- Application should load normally

---

## Additional Test Scenarios

### Test 8: Form Data Persistence (Draft Recovery)

**Purpose:** Verify LocalStorage draft saving and recovery

**Steps:**
1. Navigate to `/book-consultation`
2. Fill out half the form (name, email, message)
3. Close the browser tab/window WITHOUT submitting
4. Reopen the browser
5. Navigate back to `/book-consultation`

**Expected Results:**
- ✅ Form fields are auto-populated with previous data
- ✅ Toast notification appears: "Draft restored - We restored your previous form data"
- ✅ All previously entered data is intact
- ✅ User can continue editing or submit

**Test Variations:**
- Refresh page → Draft should persist
- Navigate away and back → Draft should persist
- Complete submission → Draft should be cleared

---

### Test 9: Character Counter Functionality

**Purpose:** Verify message field character limit

**Steps:**
1. Navigate to `/book-consultation`
2. Click in the "Tell us about your needs" textarea
3. Type or paste text

**Expected Results:**
- ✅ Character counter displays: "0/1000"
- ✅ Counter updates in real-time as user types
- ✅ Counter turns red when approaching/exceeding limit
- ✅ Input is limited to 1000 characters (cannot type more)
- ✅ If user pastes text over 1000 chars, it's truncated
- ✅ Validation error appears if limit exceeded: "Message must be 1000 characters or less"

---

### Test 10: Retry Mechanism with Simulated Server Error

**Purpose:** Verify automatic retry with exponential backoff

**Setup (Requires Browser Dev Tools):**
1. Open DevTools Network tab
2. Right-click the form submission request
3. Select "Block request URL"
4. Or use network throttling to force timeout

**Expected Results:**
- ✅ First attempt fails
- ✅ Automatic retry after 1 second (attempt 2)
- ✅ Automatic retry after 2 seconds (attempt 3)
- ✅ Automatic retry after 4 seconds (attempt 4, if needed)
- ✅ After all retries exhausted, shows error with manual retry button
- ✅ Manual retry resets the counter
- ✅ Form data is preserved throughout retry attempts

---

## Success Criteria Checklist

Form must pass ALL scenarios before production deployment:

- [ ] Test 1: Successful submission works
- [ ] Test 2: Required field validation works
- [ ] Test 3: Email validation works
- [ ] Test 4: Mobile responsive layout works
- [ ] Test 5: Slow connection/timeout handling works
- [ ] Test 6: Email notifications deliver (if RESEND_API_KEY configured)
- [ ] Test 7: JavaScript disabled fallback works
- [ ] Test 8: Draft persistence works
- [ ] Test 9: Character counter works
- [ ] Test 10: Retry mechanism works

---

## Database Verification Queries

**Check recent submissions:**
```sql
SELECT
  id,
  full_name,
  email,
  inquiry_type,
  created_at
FROM contact_inquiries
ORDER BY created_at DESC
LIMIT 10;
```

**Count submissions by type:**
```sql
SELECT
  inquiry_type,
  COUNT(*) as count
FROM contact_inquiries
GROUP BY inquiry_type
ORDER BY count DESC;
```

**Check submissions in last 24 hours:**
```sql
SELECT COUNT(*) as recent_submissions
FROM contact_inquiries
WHERE created_at > NOW() - INTERVAL '24 hours';
```

---

## Known Limitations

1. **Email Delivery:** Requires RESEND_API_KEY configuration. Form submission will succeed even if emails fail.
2. **JavaScript Required:** Application is a React SPA and requires JavaScript. Fallback message is provided.
3. **Browser Support:** Modern browsers only (ES6+). No IE11 support.
4. **Rate Limiting:** No client-side rate limiting implemented. Consider adding if spam becomes an issue.

---

## Contact for Issues

If you encounter issues during testing:
- Check browser console for errors (F12)
- Check network tab for failed requests
- Verify Supabase connection in `.env` file
- Contact: contact@rarefindtalent.com
