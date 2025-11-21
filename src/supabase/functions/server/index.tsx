import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { sendExamConfirmationEmail, sendExamReminderEmail } from "./email_service.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-ca759b54/health", (c) => {
  return c.json({ status: "ok" });
});

// Get all confessions
app.get("/make-server-ca759b54/confessions", async (c) => {
  try {
    const confessions = await kv.getByPrefix("confession:");
    // Sort by timestamp descending (newest first)
    const sortedConfessions = confessions.sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
    return c.json({ success: true, confessions: sortedConfessions });
  } catch (error) {
    console.error('Error fetching confessions:', error);
    return c.json({ success: false, error: 'Failed to fetch confessions' }, 500);
  }
});

// Create a new confession
app.post("/make-server-ca759b54/confessions", async (c) => {
  try {
    const body = await c.req.json();
    const { text, mood, moodLabel } = body;

    if (!text || !mood || !moodLabel) {
      return c.json({ success: false, error: 'Missing required fields' }, 400);
    }

    const confession = {
      id: Date.now(),
      text,
      mood,
      moodLabel,
      timestamp: new Date().toISOString(),
      hearts: 0,
      isLiked: false,
    };

    await kv.set(`confession:${confession.id}`, confession);
    return c.json({ success: true, confession });
  } catch (error) {
    console.error('Error creating confession:', error);
    return c.json({ success: false, error: 'Failed to create confession' }, 500);
  }
});

// Update confession (for likes)
app.put("/make-server-ca759b54/confessions/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const { hearts, isLiked } = body;

    const confession = await kv.get(`confession:${id}`);
    if (!confession) {
      return c.json({ success: false, error: 'Confession not found' }, 404);
    }

    const updatedConfession = {
      ...confession,
      hearts: hearts !== undefined ? hearts : confession.hearts,
      isLiked: isLiked !== undefined ? isLiked : confession.isLiked,
    };

    await kv.set(`confession:${id}`, updatedConfession);
    return c.json({ success: true, confession: updatedConfession });
  } catch (error) {
    console.error('Error updating confession:', error);
    return c.json({ success: false, error: 'Failed to update confession' }, 500);
  }
});

// Delete a confession
app.delete("/make-server-ca759b54/confessions/:id", async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(`confession:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting confession:', error);
    return c.json({ success: false, error: 'Failed to delete confession' }, 500);
  }
});

// Delete all confessions
app.delete("/make-server-ca759b54/confessions", async (c) => {
  try {
    const confessions = await kv.getByPrefix("confession:");
    const keys = confessions.map(c => `confession:${c.id}`);
    if (keys.length > 0) {
      await kv.mdel(keys);
    }
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting all confessions:', error);
    return c.json({ success: false, error: 'Failed to delete all confessions' }, 500);
  }
});

// Get comments for a confession
app.get("/make-server-ca759b54/confessions/:id/comments", async (c) => {
  try {
    const confessionId = c.req.param('id');
    const comments = await kv.getByPrefix(`comment:${confessionId}:`);
    // Sort by timestamp ascending (oldest first)
    const sortedComments = comments.sort((a, b) => {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });
    return c.json({ success: true, comments: sortedComments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return c.json({ success: false, error: 'Failed to fetch comments' }, 500);
  }
});

// Add a comment to a confession
app.post("/make-server-ca759b54/confessions/:id/comments", async (c) => {
  try {
    const confessionId = c.req.param('id');
    const body = await c.req.json();
    const { text } = body;

    if (!text) {
      return c.json({ success: false, error: 'Missing comment text' }, 400);
    }

    const comment = {
      id: Date.now(),
      confessionId: parseInt(confessionId),
      text,
      timestamp: new Date().toISOString(),
    };

    await kv.set(`comment:${confessionId}:${comment.id}`, comment);
    return c.json({ success: true, comment });
  } catch (error) {
    console.error('Error creating comment:', error);
    return c.json({ success: false, error: 'Failed to create comment' }, 500);
  }
});

// Delete a comment
app.delete("/make-server-ca759b54/confessions/:confessionId/comments/:commentId", async (c) => {
  try {
    const confessionId = c.req.param('confessionId');
    const commentId = c.req.param('commentId');
    await kv.del(`comment:${confessionId}:${commentId}`);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return c.json({ success: false, error: 'Failed to delete comment' }, 500);
  }
});

// ========== FORUM ENDPOINTS ==========

// Get all forum posts
app.get("/make-server-ca759b54/forum/posts", async (c) => {
  try {
    const posts = await kv.getByPrefix("forumPost:");
    // Sort by timestamp descending (newest first)
    const sortedPosts = posts.sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
    return c.json({ success: true, posts: sortedPosts });
  } catch (error) {
    console.error('Error fetching forum posts:', error);
    return c.json({ success: false, error: 'Failed to fetch forum posts' }, 500);
  }
});

// Create a new forum post
app.post("/make-server-ca759b54/forum/posts", async (c) => {
  try {
    const body = await c.req.json();
    const { title, content, category, authorName } = body;

    if (!title || !content || !category || !authorName) {
      return c.json({ success: false, error: 'Missing required fields' }, 400);
    }

    // Generate initials from author name
    const initials = authorName
      .split(' ')
      .map((word: string) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const post = {
      id: Date.now(),
      title,
      content,
      category,
      authorName,
      initials,
      timestamp: new Date().toISOString(),
      likes: 0,
      isLiked: false,
    };

    await kv.set(`forumPost:${post.id}`, post);
    return c.json({ success: true, post });
  } catch (error) {
    console.error('Error creating forum post:', error);
    return c.json({ success: false, error: 'Failed to create forum post' }, 500);
  }
});

// Update forum post (for likes)
app.put("/make-server-ca759b54/forum/posts/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const { likes, isLiked } = body;

    const post = await kv.get(`forumPost:${id}`);
    if (!post) {
      return c.json({ success: false, error: 'Post not found' }, 404);
    }

    const updatedPost = {
      ...post,
      likes: likes !== undefined ? likes : post.likes,
      isLiked: isLiked !== undefined ? isLiked : post.isLiked,
    };

    await kv.set(`forumPost:${id}`, updatedPost);
    return c.json({ success: true, post: updatedPost });
  } catch (error) {
    console.error('Error updating forum post:', error);
    return c.json({ success: false, error: 'Failed to update forum post' }, 500);
  }
});

// Delete a forum post
app.delete("/make-server-ca759b54/forum/posts/:id", async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(`forumPost:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting forum post:', error);
    return c.json({ success: false, error: 'Failed to delete forum post' }, 500);
  }
});

// Delete all forum posts
app.delete("/make-server-ca759b54/forum/posts", async (c) => {
  try {
    const posts = await kv.getByPrefix("forumPost:");
    const keys = posts.map(p => `forumPost:${p.id}`);
    if (keys.length > 0) {
      await kv.mdel(keys);
    }
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting all forum posts:', error);
    return c.json({ success: false, error: 'Failed to delete all forum posts' }, 500);
  }
});

// Get comments for a forum post
app.get("/make-server-ca759b54/forum/posts/:id/comments", async (c) => {
  try {
    const postId = c.req.param('id');
    const comments = await kv.getByPrefix(`forumComment:${postId}:`);
    // Sort by timestamp ascending (oldest first)
    const sortedComments = comments.sort((a, b) => {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });
    return c.json({ success: true, comments: sortedComments });
  } catch (error) {
    console.error('Error fetching forum comments:', error);
    return c.json({ success: false, error: 'Failed to fetch forum comments' }, 500);
  }
});

// Add a comment to a forum post
app.post("/make-server-ca759b54/forum/posts/:id/comments", async (c) => {
  try {
    const postId = c.req.param('id');
    const body = await c.req.json();
    const { text, authorName } = body;

    if (!text || !authorName) {
      return c.json({ success: false, error: 'Missing required fields' }, 400);
    }

    // Generate initials from author name
    const initials = authorName
      .split(' ')
      .map((word: string) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const comment = {
      id: Date.now(),
      postId: parseInt(postId),
      text,
      authorName,
      initials,
      timestamp: new Date().toISOString(),
    };

    await kv.set(`forumComment:${postId}:${comment.id}`, comment);
    return c.json({ success: true, comment });
  } catch (error) {
    console.error('Error creating forum comment:', error);
    return c.json({ success: false, error: 'Failed to create forum comment' }, 500);
  }
});

// Delete a forum comment
app.delete("/make-server-ca759b54/forum/posts/:postId/comments/:commentId", async (c) => {
  try {
    const postId = c.req.param('postId');
    const commentId = c.req.param('commentId');
    await kv.del(`forumComment:${postId}:${commentId}`);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting forum comment:', error);
    return c.json({ success: false, error: 'Failed to delete forum comment' }, 500);
  }
});

// ========== EXAM CALENDAR ENDPOINTS ==========

// Get all exams
app.get("/make-server-ca759b54/exams", async (c) => {
  try {
    const exams = await kv.getByPrefix("exam:");
    // Sort by date and time ascending (earliest first)
    const sortedExams = exams.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`).getTime();
      const dateB = new Date(`${b.date}T${b.time}`).getTime();
      return dateA - dateB;
    });
    return c.json(sortedExams);
  } catch (error) {
    console.error('Error fetching exams:', error);
    return c.text('Failed to fetch exams', 500);
  }
});

// Create a new exam
app.post("/make-server-ca759b54/exams", async (c) => {
  try {
    const body = await c.req.json();
    const { subject, date, time, email, color } = body;

    if (!subject || !date || !time || !email) {
      return c.text('Missing required fields', 400);
    }

    const exam = {
      id: Date.now(),
      subject,
      date,
      time,
      email,
      color,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`exam:${exam.id}`, exam);

    // Send confirmation email immediately
    await sendExamConfirmationEmail(exam);

    // Schedule email notifications
    await scheduleExamReminders(exam);

    return c.json(exam);
  } catch (error) {
    console.error('Error creating exam:', error);
    return c.text('Failed to create exam', 500);
  }
});

// Delete an exam
app.delete("/make-server-ca759b54/exams/:id", async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(`exam:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting exam:', error);
    return c.text('Failed to delete exam', 500);
  }
});

// Function to schedule exam reminders
async function scheduleExamReminders(exam: any) {
  const examDateTime = new Date(`${exam.date}T${exam.time}`);
  const now = new Date();

  // Calculate reminder dates
  const sevenDaysBefore = new Date(examDateTime);
  sevenDaysBefore.setDate(sevenDaysBefore.getDate() - 7);

  const threeDaysBefore = new Date(examDateTime);
  threeDaysBefore.setDate(threeDaysBefore.getDate() - 3);

  const oneDayBefore = new Date(examDateTime);
  oneDayBefore.setDate(oneDayBefore.getDate() - 1);

  const examDay = new Date(examDateTime);

  // Send immediate email if exam is within notification window
  if (now >= sevenDaysBefore && now < examDateTime) {
    await sendExamReminderEmail(exam, calculateDaysUntil(exam.date, exam.time));
  }

  // Store scheduled notifications
  const notifications = [];
  
  if (sevenDaysBefore > now) {
    notifications.push({
      id: `${exam.id}-7days`,
      examId: exam.id,
      sendAt: sevenDaysBefore.toISOString(),
      type: '7days',
      sent: false,
    });
  }

  if (threeDaysBefore > now) {
    notifications.push({
      id: `${exam.id}-3days`,
      examId: exam.id,
      sendAt: threeDaysBefore.toISOString(),
      type: '3days',
      sent: false,
    });
  }

  if (oneDayBefore > now) {
    notifications.push({
      id: `${exam.id}-1day`,
      examId: exam.id,
      sendAt: oneDayBefore.toISOString(),
      type: '1day',
      sent: false,
    });
  }

  if (examDay > now) {
    notifications.push({
      id: `${exam.id}-today`,
      examId: exam.id,
      sendAt: examDay.toISOString(),
      type: 'today',
      sent: false,
    });
  }

  // Save notifications to database
  for (const notification of notifications) {
    await kv.set(`notification:${notification.id}`, notification);
  }
}

// Helper function to calculate days until exam
function calculateDaysUntil(dateStr: string, timeStr: string) {
  const examDateTime = new Date(`${dateStr}T${timeStr}`);
  const now = new Date();
  const diffTime = examDateTime.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// Endpoint to check and send pending notifications (can be called by a cron job)
app.post("/make-server-ca759b54/check-notifications", async (c) => {
  try {
    const notifications = await kv.getByPrefix("notification:");
    const now = new Date();
    let sentCount = 0;

    for (const notification of notifications) {
      if (!notification.sent && new Date(notification.sendAt) <= now) {
        // Get exam details
        const exam = await kv.get(`exam:${notification.examId}`);
        if (exam) {
          const daysUntil = calculateDaysUntil(exam.date, exam.time);
          await sendExamReminderEmail(exam, daysUntil);
          
          // Mark notification as sent
          notification.sent = true;
          await kv.set(`notification:${notification.id}`, notification);
          sentCount++;
        }
      }
    }

    return c.json({ success: true, sentCount });
  } catch (error) {
    console.error('Error checking notifications:', error);
    return c.text('Failed to check notifications', 500);
  }
});

// ========== GOAL TRACKER ENDPOINTS ==========

// Get all goals
app.get("/make-server-ca759b54/goals", async (c) => {
  try {
    const goals = await kv.getByPrefix("goal:");
    // Sort by createdAt descending (newest first)
    const sortedGoals = goals.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return c.json(sortedGoals);
  } catch (error) {
    console.error('Error fetching goals:', error);
    return c.text('Failed to fetch goals', 500);
  }
});

// Create a new goal
app.post("/make-server-ca759b54/goals", async (c) => {
  try {
    const body = await c.req.json();
    const { title, target, duration, subject, emoji } = body;

    if (!title || !target) {
      return c.text('Missing required fields', 400);
    }

    const goal = {
      id: Date.now(),
      title,
      target,
      completed: 0,
      duration,
      subject: subject || 'Custom',
      emoji: emoji || '📚',
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    await kv.set(`goal:${goal.id}`, goal);
    return c.json(goal);
  } catch (error) {
    console.error('Error creating goal:', error);
    return c.text('Failed to create goal', 500);
  }
});

// Update a goal (for progress)
app.put("/make-server-ca759b54/goals/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const { completed } = body;

    const goal = await kv.get(`goal:${id}`);
    if (!goal) {
      return c.text('Goal not found', 404);
    }

    const updatedGoal = {
      ...goal,
      completed: completed !== undefined ? completed : goal.completed,
      lastUpdated: new Date().toISOString(),
    };

    await kv.set(`goal:${id}`, updatedGoal);

    // Update daily progress
    const today = new Date().toISOString().split('T')[0];
    const progressKey = `progress:${today}`;
    let dailyProgress = await kv.get(progressKey);

    if (!dailyProgress) {
      dailyProgress = {
        date: today,
        tasksCompleted: 0,
        goalsAchieved: 0,
      };
    }

    // If this update completes a task
    if (completed > goal.completed) {
      dailyProgress.tasksCompleted += (completed - goal.completed);
    }

    // If this update completes a goal
    if (completed === goal.target && goal.completed < goal.target) {
      dailyProgress.goalsAchieved += 1;
    }

    await kv.set(progressKey, dailyProgress);

    return c.json(updatedGoal);
  } catch (error) {
    console.error('Error updating goal:', error);
    return c.text('Failed to update goal', 500);
  }
});

// Delete a goal
app.delete("/make-server-ca759b54/goals/:id", async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(`goal:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting goal:', error);
    return c.text('Failed to delete goal', 500);
  }
});

// Get weekly progress
app.get("/make-server-ca759b54/goals/weekly-progress", async (c) => {
  try {
    const progress = await kv.getByPrefix("progress:");
    
    // Get last 7 days
    const weeklyProgress = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayProgress = progress.find(p => p.date === dateStr);
      weeklyProgress.push(dayProgress || {
        date: dateStr,
        tasksCompleted: 0,
        goalsAchieved: 0,
      });
    }

    // Sort by date ascending
    weeklyProgress.sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    return c.json(weeklyProgress);
  } catch (error) {
    console.error('Error fetching weekly progress:', error);
    return c.text('Failed to fetch weekly progress', 500);
  }
});

Deno.serve(app.fetch);