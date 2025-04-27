# Task Completion Guide for Mshiko Tap

This document explains how different types of tasks are completed and verified in the Mshiko Tap platform.

## Types of Tasks

### 1. YouTube Video Tasks

**User Action:**
- Watch a YouTube video for a specified duration
- Possibly like, comment, or subscribe
- Take a screenshot of the completed watch session

**Verification Method:**
- Screenshot proof
- Time duration tracking (automatic)
- Comment verification (manual by admin)

### 2. TikTok Tasks

**User Action:**
- Watch TikTok content
- Possibly like, comment, or follow
- Take a screenshot of the engagement

**Verification Method:**
- Screenshot proof
- Manual review by admin

### 3. Instagram Tasks

**User Action:**
- View Instagram posts or stories
- Possibly like, comment, or follow
- Take a screenshot of the engagement

**Verification Method:**
- Screenshot proof
- Manual review by admin

### 4. Survey Tasks

**User Action:**
- Complete a survey form
- Submit responses
- Copy completion code or take screenshot

**Verification Method:**
- Completion code verification
- Automatic verification via webhook (for integrated survey platforms)

### 5. Website Visit Tasks

**User Action:**
- Visit a specified website
- Complete required actions (sign up, browse products, etc.)
- Take a screenshot of the completed action

**Verification Method:**
- Screenshot proof
- Time duration tracking (automatic)
- Verification code (if provided by the website)

### 6. App Testing Tasks

**User Action:**
- Download and install the app
- Test specific features as instructed
- Provide feedback
- Take screenshots of the app in use

**Verification Method:**
- Screenshot proof
- Written feedback review
- Manual review by admin

## Proof Submission Process

1. User completes the required task
2. User submits proof:
   - Screenshots
   - Verification codes
   - Written feedback (if required)
3. Submission is marked as "pending"
4. Admin or automated system verifies the proof
5. Task is marked as "completed" or "rejected"
6. If completed, reward is credited to user's balance

## Automated Verification (When Available)

Some tasks can be verified automatically:

1. **Time Tracking**: JavaScript monitors time spent on a page
2. **API Integration**: Direct verification via the platform's API
3. **Verification Codes**: Unique codes that confirm task completion
4. **Webhooks**: Third-party services send completion notifications

## Manual Verification Process

For tasks requiring manual verification:

1. Admin reviews submitted proof
2. Admin checks that all requirements were met
3. Admin approves or rejects the submission
4. If rejected, admin provides a reason
5. User is notified of the decision

## Tips for Users

1. **Read Instructions Carefully**: Each task has specific requirements
2. **Submit Clear Proof**: Ensure screenshots are clear and show all required elements
3. **Complete All Steps**: Partial completion will result in rejection
4. **Be Honest**: Fraudulent submissions will lead to account suspension
5. **Check Status**: Monitor your task status in the dashboard

## Tips for Admins

1. **Verify Promptly**: Process submissions within 24-48 hours
2. **Be Consistent**: Apply the same standards to all submissions
3. **Provide Feedback**: Give clear reasons for rejections
4. **Monitor Patterns**: Watch for suspicious activity or fraud
5. **Update Requirements**: Clarify task instructions based on common issues

## Implementation Notes for Developers

1. **Task Requirements**: Store detailed requirements in the `requirements` JSONB field
2. **Proof Storage**: Store proof screenshots in Supabase Storage
3. **Verification Logic**: Implement verification in API routes or Supabase Edge Functions
4. **Notification System**: Notify users of task status changes
5. **Rate Limiting**: Implement rate limiting to prevent abuse 