# Quick Reference: AI Video Slides System

## 🚀 Quick Start

### 1. View Existing Video Slides

```
http://localhost:3000/template-video/[id]?data=riddles
```

_(Will show generate button if no video slides exist)_

### 2. Generate with AI (via Button)

1. Visit: `http://localhost:3000/template-video/[id]?data=riddles`
2. Click **"Generate Video Slides dengan AI"** button
3. Wait for AI conversion (redirects with `useAI=true`)
4. Video slides automatically saved to database

### 3. Generate with AI (Direct URL)

```
http://localhost:3000/template-video/[id]?useAI=true&data=riddles
```

## 📋 URL Parameters

| Parameter    | Values                            | Description          |
| ------------ | --------------------------------- | -------------------- |
| `data`       | riddles, sites, topics, tutorials | Content category     |
| `useAI`      | true, false                       | Enable AI conversion |
| `format`     | save                              | Show save button     |
| `screenshot` | true                              | Screenshot mode      |
| `slideIndex` | 0, 1, 2...                        | Target slide index   |

## 🔄 Data Source Priority

1. **Database** - If videoSlides exists → Show video slides
2. **No Video Slides** - Show generate button (with carousel check)
3. **AI Generation** - If useAI=true → Generate and save
4. **No Carousel Data** - Show error message with link to create carousel

## 🎯 User Experience Flow

### Scenario 1: First Time Visit (No Video Slides)

```
User visits: /template-video/123?data=riddles
↓
System checks: Does videoSlides exist?
↓
NO → Show "Generate Video Slides" button
↓
User clicks button
↓
Redirects to: /template-video/123?data=riddles&useAI=true
↓
AI generates video slides
↓
Saves to database
↓
Shows video slides
```

### Scenario 2: Video Slides Already Exist

```
User visits: /template-video/123?data=riddles
↓
System checks: Does videoSlides exist?
↓
YES → Show video slides from database
```

### Scenario 3: No Carousel Data

```
User visits: /template-video/123?data=riddles
↓
System checks: Does carousel data exist?
↓
NO → Show error message
     "Data Carousel Tidak Tersedia"
     Button: "Buka Template Carousel"
↓
User clicks button
↓
Redirects to: /template/123?data=riddles
↓
User creates carousel content
↓
User returns to video template
↓
Can now generate video slides
```

## 🎯 Common Use Cases

### Generate for Existing Riddle

```bash
# Step 1: Check existing riddle
curl http://localhost:3000/api/riddles/[id]

# Step 2: Visit template page (shows generate button if needed)
open http://localhost:3000/template-video/[id]?data=riddles

# Step 3: Click generate button or use direct URL
open http://localhost:3000/template-video/[id]?data=riddles&useAI=true
```

# Visit in browser:

http://localhost:3000/template-video/[id]?useAI=true

# Step 3: Check result

curl http://localhost:3000/api/riddles/[id]/video-slides

````

### Regenerate Video Slides

```bash
# Just visit with useAI=true again
http://localhost:3000/template-video/[id]?useAI=true

# It will regenerate and update database
````

### Test Different Categories

```bash
# Riddles
http://localhost:3000/template-video/[id]?data=riddles&useAI=true

# Sites
http://localhost:3000/template-video/[id]?data=sites&useAI=true

# Topics
http://localhost:3000/template-video/[id]?data=topics&useAI=true

# Tutorials
http://localhost:3000/template-video/[id]?data=tutorials&useAI=true
```

## 📊 Console Logs to Watch

### Success Indicators

```
Converting carousel slides to video slides using AI...
✅ AI Conversion successful: 5 slides generated
✅ Video slides saved to database
📊 Data source: ai-generated, Slides count: 5
```

### Using Database

```
Using existing video slides from database
📊 Data source: database, Slides count: 5
```

### Fallback

```
Using mock data as fallback
📊 Data source: mock, Slides count: 6
```

## 🔧 Setup Checklist

-   [ ] GEMINI_API_KEY in .env
-   [ ] Database models updated with videoSlides field
-   [ ] API endpoints created for all categories
-   [ ] Test with mock data first
-   [ ] Test with AI conversion
-   [ ] Verify database save

## 💰 Cost Estimation (Gemini)

### Gemini 2.0 Flash (Recommended)

-   **FREE TIER AVAILABLE** 🎉
-   Free: 1,500 requests per day
-   Paid: ~$0.001 per conversion
-   **Best value for this feature**

### Gemini 2.5 Flash

-   Free: 1,500 requests per day
-   Paid: ~$0.0015 per conversion
-   Faster response times

### Gemini Pro

-   Free: 50 requests per day
-   Paid: ~$0.005 per conversion
-   Highest quality output

### Optimization Tips:

-   Cache results in database (done ✅)
-   Use free tier for development and light production use
-   Batch process during off-peak hours if hitting rate limits
-   Review and save only good results

## 🐛 Quick Troubleshooting

### Problem: No AI conversion happening

```bash
# Check 1: API key set?
echo $GEMINI_API_KEY

# Check 2: Using correct URL?
# Must have ?useAI=true

# Check 3: Check console logs
# Should see "Converting carousel slides..."
```

### Problem: Slides not saving

```bash
# Check database connection
# Check model schema has videoSlides field
# Check API endpoint exists:
curl -X POST http://localhost:3000/api/riddles/[id]/video-slides \
  -H "Content-Type: application/json" \
  -d '{"videoSlides":[]}'
```

### Problem: Poor AI results

```bash
# Option 1: Improve carousel content first
# Option 2: Adjust AI prompt in gemini-video-slides-converter.ts
# Option 3: Use Gemini 2.5 Flash or Gemini Pro for better quality
# Option 4: Manually edit in database
```

## 📂 Key Files

```
lib/
└── gemini-video-slides-converter.ts  # AI conversion logic

app/(template-post)/template-video/[id]/
├── page.tsx                          # Main page
├── video-slide-components/
│   ├── types.ts                     # TypeScript types
│   ├── VideoSlideRenderer.tsx       # Renderer
│   ├── mockData.ts                  # Mock examples
│   └── [8 slide components].tsx     # Visual components
└── VIDEO_SLIDES_GUIDE.md            # Component docs

app/api/[category]/[id]/
└── video-slides/
    └── route.ts                     # Save/Get endpoints
```

## 🎬 Production Checklist

Before going live:

1. **Test Conversion Quality**

    - [ ] Test with 5+ different content items
    - [ ] Review AI output quality
    - [ ] Verify all slide types work

2. **Database Preparation**

    - [ ] Add indexes for videoSlides queries
    - [ ] Backup before mass conversion
    - [ ] Test save/retrieve performance

3. **Error Handling**

    - [ ] Test API failures
    - [ ] Test invalid content
    - [ ] Verify fallback to mock data

4. **Monitoring**
    - [ ] Setup error logging
    - [ ] Monitor AI API costs
    - [ ] Track conversion success rate

## 🔗 Related Documentation

-   `VIDEO_SLIDES_GUIDE.md` - Component documentation
-   `TEMPLATE_VIDEO_QUICKSTART.md` - Page usage guide
-   `AI_VIDEO_SLIDES_CONVERSION.md` - Full conversion docs

## 💡 Pro Tips

1. **Generate in batches** during low traffic
2. **Review first few** conversions manually
3. **Keep carousel content clean** for better AI results
4. **Cache aggressively** - conversions are expensive
5. **A/B test** different slide structures
6. **Monitor token usage** to control costs

## 🎯 Next Steps

After setup:

1. Test with existing content
2. Generate video slides for top 10 items
3. Review and refine AI prompt if needed
4. Scale to all content
5. Integrate with video production pipeline
