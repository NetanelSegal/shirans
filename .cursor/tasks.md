# Tasks

This file contains all tasks organized by category: tasks, technologies, tips, and best practices.

## Task Categories

### 🎯 Tasks
Active development tasks and features to implement.

### 🔧 Technologies
Technology adoption, setup, and integration tasks.

### 💡 Tips
Helpful tips and optimizations to apply.

### 📚 Best Practices
Best practices to implement and follow.

---

## Pending Approval

Tasks that have been received and broken down into subtasks, awaiting approval before execution.

### Task 1: Replace Testimonials with New Content
- **Category**: Tasks
- **Priority**: Medium
- **Status**: Pending Approval
- **Assigned**: Auto
- **Created**: 2025-01-27
- **Description**: Replace the existing 2 testimonials with 6 new testimonials provided by the user
- **Original Task**: Replace the testimonials with new content (6 testimonials provided)

**Subtasks:**
1. Parse and structure the 6 new testimonials from the provided Hebrew text
   - Extract family names: משפחת קליין, משפחת חרבי, משפחת בקר, משפחת שמעון, משפחת אביטל, משפחת ניסים
   - Extract testimonial messages for each family
   - Ensure proper formatting and line breaks are preserved
2. Update the testimonials array in `client/src/pages/Home/components/Testimonials.tsx`
   - Replace the existing 2 testimonials with the 6 new ones
   - Maintain the same data structure: `{ name: string, message: string }`
3. Verify the carousel animation still works correctly with 6 items
   - Test that the infinite scroll animation functions properly
   - Ensure all testimonials are visible and readable
   - Check responsive behavior on different screen sizes

---

### Task 2: Fix Project Image Modal - Add Zoom and Gesture Navigation
- **Category**: Tasks
- **Priority**: High
- **Status**: Pending Approval
- **Assigned**: Auto
- **Created**: 2025-01-27
- **Description**: Improve the project image modal to support zoom functionality and gesture-based navigation, with overlay arrow buttons that don't take up space
- **Original Task**: Fix the project image modal - it doesn't look good because arrow buttons take up space, and it needs zoom functionality (pinch on mobile, mouse wheel on desktop) and swipe navigation (left/right)
- **Clarification**: Desktop needs arrow buttons (overlay, not taking space). Mobile can have buttons but should be overlaid above the picture, half-transparent, not taking space.

**Subtasks:**
1. Research and select an appropriate image zoom/pan library
   - Evaluate libraries like `react-zoom-pan-pinch`, `react-image-gallery`, or similar
   - Choose one that supports: pinch zoom (mobile), mouse wheel zoom (desktop), pan/drag, and swipe gestures
   - Install the selected library
2. Redesign arrow buttons as overlay elements (not taking space)
   - **Desktop**: Keep left/right arrow buttons but position them as overlays (absolute positioning) on the sides of the image, not taking up layout space
   - **Mobile**: Position arrow buttons as overlays above the image, make them half-transparent
   - Ensure buttons don't interfere with image display area
   - Keep keyboard navigation (arrow keys) functionality
   - Update button styling for better visibility and hover states
3. Implement zoom functionality in the modal
   - Add pinch-to-zoom support for mobile/trackpad
   - Add mouse wheel zoom for desktop
   - Ensure zoom works smoothly and doesn't break the layout
   - Add zoom controls or visual feedback if needed
4. Implement swipe/gesture navigation
   - Add left swipe to go to next image
   - Add right swipe to go to previous image
   - Ensure swipe works on both mobile and desktop (touch and mouse drag)
   - Prevent swipe conflicts with zoom/pan gestures
5. Update modal layout and styling
   - Ensure the image has maximum available space (buttons are overlays, not in layout)
   - Adjust container width and positioning for better image display
   - Position arrow buttons as overlays (absolute/fixed positioning)
   - Make mobile buttons half-transparent with good visibility
   - Maintain the dot indicators at the bottom
   - Ensure responsive behavior on mobile and desktop
6. Test the implementation
   - Test zoom in/out on mobile (pinch)
   - Test zoom in/out on desktop (mouse wheel)
   - Test swipe navigation on mobile
   - Test drag navigation on desktop
   - Test keyboard navigation (arrow keys, escape) still works
   - Verify the modal looks good and images are properly displayed

---

## Active Tasks

### Tasks
<!-- Add task items here -->
- [ ] _No tasks yet_

### Technologies
<!-- Add technology tasks here -->
- [ ] _No tasks yet_

### Tips
<!-- Add tip items here -->
- [ ] _No tasks yet_

### Best Practices
<!-- Add best practice items here -->
- [ ] _No tasks yet_

---

## Completed Tasks

### Tasks
<!-- Completed task items will be moved here -->
- [ ] _None completed yet_

### Technologies
<!-- Completed technology tasks will be moved here -->
- [ ] _None completed yet_

### Tips
<!-- Completed tip items will be moved here -->
- [ ] _None completed yet_

### Best Practices
<!-- Completed best practice items will be moved here -->
- [ ] _None completed yet_

---

## Task Template

When adding new tasks, use this format:

```markdown
### [Task Title]
- **Category**: Tasks | Technologies | Tips | Best Practices
- **Priority**: High | Medium | Low
- **Status**: Pending | In Progress | Completed
- **Assigned**: Auto (or specific agent/developer)
- **Description**: Brief description of what needs to be done
- **Notes**: Any additional context or requirements
- **Created**: YYYY-MM-DD
- **Completed**: YYYY-MM-DD (if applicable)
```
