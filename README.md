# Audify.me

![Audify.me Logo](https://firebasestorage.googleapis.com/v0/b/learnt-me-test.appspot.com/o/manual%2Flogo.svg?alt=media&token=1b976e10-5cf3-42e0-827a-136ced55ba58)

[Audify.me](http://audify.me/) captures spoken lectures, audio, or videos and creates focused summaries. It takes notes so you don't have to!

## Table of Contents

- [Team Members](#team-members)
- [Project Pitch](#project-pitch)
- [Key Features](#key-features)
- [Stakeholder Analysis](#stakeholder-analysis)
- [MVP](#minimum-viable-product)
- [Technical Details](#technical-details)
- [Future Features](#future-features)

## Team Members

- **Elliot**: Project Manager, Frontend, Backend.
- **Danise**: Backend.
- **Yaasif**: Backend.
- **Hasaan**: Frontend (React), Frontend Testing.
- **Amal**: Testing.

## Project Pitch

In today's digital age, so much information is captured and stored. However, speech remains un-captured and underutilized. While there are transcription services available, they often provide verbose transcriptions, missing out on the essence of the spoken content. Our solution, Audify.me, addresses this gap by condensing spoken content into focused summaries.

**Target Users**:
- Students who want efficient study tools.
- ESL students.
- Professionals juggling lengthy meetings.
- Individuals with ADHD, dyslexia, or hearing impairments.

**Problems Addressed**:
- Can rely on audio instead of taking notes.
- Improved focus during meetings or lectures.
- Efficient note-taking.
- Easy content review.
- Support for users with learning challenges.

## Key Features

### Feature 1: Enhanced Summaries

- Transcribe and summarize lectures, audio or videos in near-real-time.
- Explanation for unfamiliar words or concepts.
- Get a 1-2 sentance summary of an unfamilar concept, phrase or person.
- Content-based learning suggestions.
- Automatic quiz and flashcard generation.

### Feature 2: Collaborative Learning

- Text can be edited and highlighted.
- Real-time lecture summaries for class collaboration.
- Interactive summary blocks for deeper insights.
- Facilitate student-teacher and peer-to-peer interactions via commenting.

### Feature 3: Interactive Note-taking

- Combine user notes with AI-powered content.
- Iterative learning through continuous note refinement.

## Stakeholder Analysis

![Stakeholder Analysis](https://paper-attachments.dropboxusercontent.com/s_5F1066FC2A16F33BC4B430A37319AD0027D6AB0079C29CF76D4A4AC8F67BF073_1691396905894_Screenshot+2023-08-07+at+09.27.39.png)

## Minimum Viable Product

- [x] Live audio recording on the platform.
- [x] Real-time summarization of the last 1 to 2 minutes.
- [x] Interactive summary blocks.
- [x] Private class-based content sharing.
- [x] Public URL sharing for summaries.
- [x] YouTube video summarization.

## Technical Details

- **Frontend**: CSS (Tailwind), HTML, JavaScript, React, Firebase SDK.
- **Backend**: PostgreSQL, JavaScript, GCP Firebase, Node.js.

### User Audio Recording

- Define public/private status.
- Utilize Web APIs for audio capture.
- Transcribe audio using [AssemblyAI](https://www.assemblyai.com/).
- Summarisation using [OpenAI API](https://openai.com/blog/openai-api).
- Display the summary to all users in realtime.

### YouTube Video Summarization

- Download subtitles/captions.
- Send to ChatGPT for summarization.
- Store & display the summary.

## Future Features

- Zoom integration.
- Customizable verbosity settings.
- Content translation.
- Fact-check score.
- Quiz/flashcard generation based on summaries.
- Paid subscription plans.
