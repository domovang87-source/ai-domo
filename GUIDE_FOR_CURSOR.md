# 📝 Guide for Managing AI Domo (For Non-Technical Users)

Hi! This guide will help you make changes to AI Domo using Cursor, even if you're not a developer.

---

## What You Need

1. **Cursor** - You already have this installed
2. **Access to**:
   - GitHub repository (ask for invite if you don't have)
   - Vercel dashboard (ask for invite)
   - Supabase dashboard (ask for invite)

---

## Opening the Project in Cursor

1. Open Cursor
2. Click **File** → **Open Folder**
3. Navigate to: `/home/marek/Projects/ai-domo`
4. Click **Select Folder**

You'll see all the project files in the left sidebar.

---

## Common Changes You Might Want to Make

### 1. Changing AI Domo's Rules or Advice

The AI's personality and rules live in these files:

#### **Core Rules** (`app/lib/rules.ts`)
- General directives like "Be blunt, practical, and decisive"
- Keyword detection (ghosting, coffee dates, etc.)

**To edit:**
1. Click `app/lib/rules.ts` in left sidebar
2. Find the rule you want to change
3. Edit the text inside the quotes `"..."`
4. Save (Ctrl+S or Cmd+S)

#### **Attraction Rules** (`app/lib/attraction.ts`)
- Market → Adore → Contrast formula
- Escalation pacing rules

#### **Texting Rules** (`app/lib/texting.ts`)
- "3-5 messages before asking out" rules
- Pen-pal prevention

#### **Messaging Frameworks** (`app/lib/messaging.ts`)
- Offensive Coordinator Method
- Voice Note Sales Pitch
- Double Down principle

#### **Opener Templates** (`app/lib/openers.ts`)
- "Hurry up and match me"
- Profile comment techniques

**Example: Changing a rule**

Before:
```typescript
"Be blunt, practical, and decisive. No therapy tone, no moral lectures, no long essays."
```

After:
```typescript
"Be direct and tactical. Give concise, actionable advice with specific examples."
```

---

### 2. Changing Model Parameters

If responses are too short/long or too random/predictable:

**File**: `app/api/chat-api/route.ts`

Find this section (around line 116):
```typescript
const response = await client.chat.completions.create({
  model: "gpt-4o-mini",
  temperature: 0.7,      // ← Controls randomness (0.0 = predictable, 1.0 = creative)
  max_tokens: 1500,      // ← Controls response length
  messages: [
```

**What to change:**

- **Temperature** (0.0 - 1.0):
  - 0.5 = Very consistent, almost robotic
  - 0.7 = Balanced (current setting)
  - 0.9 = More creative, varied responses

- **Max Tokens**:
  - 800 = Short, concise responses (~600 words)
  - 1500 = Detailed responses (~1,200 words) - current
  - 2000 = Very detailed responses

---

### 3. Adding New Content to the Knowledge Base

If you have new dating advice, frameworks, or book content:

**Step 1**: Add content to a text file
- Create a file: `/tmp/new_content.txt`
- Paste your content

**Step 2**: Ask Claude Code to chunk and embed it
In Cursor's chat (Cmd+L), say:
```
"I added new content to /tmp/new_content.txt.
Please chunk it and add it to the knowledge base."
```

Claude will:
1. Parse your content into chunks
2. Generate embeddings
3. Upload to Supabase
4. Confirm when done

---

## Deploying Changes to Production

After making changes, you need to push them to production:

### Quick Method (Using Cursor's Terminal)

1. Open terminal in Cursor: **Terminal** → **New Terminal**

2. Run these commands one by one:

```bash
git add .

git commit -m "Updated [describe what you changed]"

git push origin main
```

3. Go to Vercel dashboard - deployment starts automatically

4. Wait 2-3 minutes

5. Test at: https://ai-domo-domo-vangs-projects.vercel.app

---

## Testing Changes Locally First

**Always test locally before deploying to production!**

1. Open terminal in Cursor

2. Run:
```bash
npm run dev
```

3. Open browser: http://localhost:3000

4. Test your changes

5. If everything works, deploy to production (see above)

6. Stop local server: Press **Ctrl+C** in terminal

---

## Using Claude Code in Cursor

You have an AI assistant built into Cursor that can help you make changes.

### How to Use:

1. Press **Cmd+L** (Mac) or **Ctrl+L** (Windows)

2. Type what you want in plain English, like:
   - "Change the temperature to 0.8 in the chat API"
   - "Add a new rule about long distance relationships"
   - "Show me where the opener templates are defined"

3. Claude will:
   - Find the right files
   - Make the changes
   - Explain what was changed

### Example Prompts:

**Simple Changes:**
```
"Change the max_tokens from 1500 to 2000"
```

**Adding Rules:**
```
"Add a new rule to app/lib/rules.ts:
When she mentions her ex constantly, it's a red flag"
```

**Finding Things:**
```
"Where is the 6 messages rule defined?"
```

**Troubleshooting:**
```
"The AI is giving generic advice instead of using the playbook.
Can you check if RAG is working?"
```

---

## Common Issues & Fixes

### Issue: Changes Not Showing Up in Production

**Fix:**
1. Make sure you pushed to GitHub:
   ```bash
   git status
   ```
   Should say "nothing to commit, working tree clean"

2. Check Vercel dashboard - make sure deployment succeeded

3. Hard refresh browser: Ctrl+Shift+R (Cmd+Shift+R on Mac)

---

### Issue: AI Responses Are Too Generic

**Fix:**
1. Check if RAG is retrieving content
2. In Cursor, ask Claude:
   ```
   "Can you check the Vercel logs to see if RAG retrieval is working?"
   ```

3. You should see: "✅ Retrieved 5 relevant chunks from playbook"

4. If not, the knowledge base might not be set up in production

---

### Issue: Can't Run npm Commands

**Fix:**
1. Make sure you're in the project directory:
   ```bash
   pwd
   ```
   Should show: `/home/marek/Projects/ai-domo`

2. If not:
   ```bash
   cd /home/marek/Projects/ai-domo
   ```

3. Try again:
   ```bash
   npm run dev
   ```

---

## Important Files Reference

| What You Want to Change | File to Edit |
|-------------------------|--------------|
| AI's personality/voice | `app/lib/rules.ts` |
| Attraction frameworks | `app/lib/attraction.ts` |
| Texting rules | `app/lib/texting.ts` |
| Messaging strategies | `app/lib/messaging.ts` |
| Opener templates | `app/lib/openers.ts` |
| Response length/randomness | `app/api/chat-api/route.ts` (line ~116) |
| Output format | `app/api/chat-api/route.ts` (line ~48) |

---

## Getting Help

If you're stuck:

1. **Ask Claude in Cursor** (Cmd+L):
   - "I'm trying to [what you want to do], can you help?"

2. **Check the error messages**:
   - Terminal errors tell you what's wrong
   - Copy the error and paste it to Claude

3. **Contact the developer**:
   - Share the error message
   - Explain what you were trying to do

---

## Quick Reference Commands

### Testing Locally:
```bash
npm run dev
```
Open: http://localhost:3000

### Deploying to Production:
```bash
git add .
git commit -m "Your message here"
git push origin main
```

### Checking Status:
```bash
git status
```

### Viewing Recent Changes:
```bash
git log --oneline -5
```

---

## Summary

✅ **To make changes**: Edit files → Save → Test locally → Push to GitHub
✅ **To add content**: Create text file → Ask Claude to chunk & embed
✅ **To test**: Run `npm run dev` → Open http://localhost:3000
✅ **To deploy**: `git add . && git commit -m "..." && git push`
✅ **To get help**: Ask Claude in Cursor (Cmd+L)

---

**You got this! The AI assistant in Cursor will help you with everything. Just ask in plain English.** 💪
