window.BMAI_LESSON={
  "id": "week-7-day-2",
  "title": "Build Your Portfolio Website with AI Builders",
  "number": 16,
  "start": "2026-11-28T20:00:00+05:30",
  "end": "2026-11-28T22:00:00+05:30",
  "stage": "MOVIE",
  "visual": "production",
  "objective": "Tailor the supplied portfolio master prompt to one AI builder, create a three-page portfolio draft with your own available material, review its responsive behavior and interactions, and record your next revisions.",
  "homeworkUrl": "https://docs.google.com/document/d/1JWqUBGACD-YajJHTfU1GoBqmEPm2YIE6jVi-O6hWIjc",
  "submission": "Save your preview or published link and review notes in the official Homework Doc. The class recording says to share the finished link with the cohort, but gives no group URL or deadline; follow the cohort’s current instructions.",
  "steps": [
    {
      "title": "Choose a builder and tailor the prompt",
      "instruction": "Choose Framer, Lovable, or v0 based on how you want to work. The class described Framer as more hands-on, Lovable as more guided, and v0 as more technical; these are class observations, not current product guarantees. Customize the supplied master prompt with your own identity, services, portfolio materials, and visual direction. Remove platform requirements that conflict with the builder you chose.",
      "review": "The prompt describes your real work and has one coherent platform approach."
    },
    {
      "title": "Plan the site before generating it",
      "instruction": "Where your builder supports a plan or discussion step, review the proposed Home, Projects, and About structure and interactions before generation. The Lovable demonstration used this step. The source permits a detailed prompt and does not require a fixed number of messages.",
      "review": "You can explain what pages and interactions the builder plans to create before accepting implementation."
    },
    {
      "title": "Replace placeholders and review the draft",
      "instruction": "Replace generic project, profile, services, testimonial, and recognition placeholders only with information you can use. Add your available project media or direct playback links. The instructor suggested YouTube Unlisted or Wistia for portfolio playback and noted that Drive links may not embed directly. Review desktop, tablet, and mobile views, navigation, filtering, videos, and interactive features.",
      "review": "The site represents your actual portfolio, its links and media work where tested, and important gaps are recorded."
    },
    {
      "title": "Record the link and next revisions",
      "instruction": "Group related corrections into clear requests that name the section and desired result. Avoid repeated piecemeal edits when one reviewed request can describe the issue. Record the preview or published URL, media-link map, review findings, and first priorities in the Homework Doc.",
      "review": "Your Doc has a working URL when available, concrete review evidence, and a prioritized next step."
    }
  ],
  "homework": [
    {
      "title": "Choose and tailor",
      "prompt": "Choose Framer, Lovable, or v0 for your needs. Personalize the source master prompt with your real identity, audience, services, projects, and visual direction. Remove conflicting platform, CMS, backend, or styling requirements. Record the builder and your key edits."
    },
    {
      "title": "Plan and generate",
      "prompt": "Review the proposed Home, Projects, and About pages and interactions before building when your tool offers planning. Generate a first draft and note what the tool understood or missed."
    },
    {
      "title": "Add portfolio material",
      "prompt": "Replace available placeholders with accurate profile, project, media, services, and other authorized details. Keep a simple mapping from each placeholder to its replacement asset or video link."
    },
    {
      "title": "Review and revise",
      "prompt": "Check navigation, category filtering, project video playback, requested interactions, and desktop/mobile layouts. Record the preview or published link, observed issue, first grouped correction, and what you would carry forward."
    }
  ],
  "tools": [
    {
      "name": "Framer",
      "useCase": "Build the portfolio draft with the hands-on design workflow discussed in class; adapt the supplied prompt’s project collection requirements to the builder."
    },
    {
      "name": "Lovable",
      "useCase": "Plan and generate a portfolio draft through its guided workflow; review the proposed structure before implementation."
    },
    {
      "name": "v0",
      "useCase": "Build the portfolio draft through the more technical workflow discussed in class; adapt or remove incompatible framework and backend instructions."
    },
    {
      "name": "YouTube",
      "useCase": "Host portfolio project videos as Unlisted playback links when appropriate; Unlisted links are shareable, not private."
    },
    {
      "name": "Wistia",
      "useCase": "Alternative video-hosting service named in class for portfolio project playback."
    }
  ],
  "prompts": [
    {
      "title": "Portfolio website master prompt",
      "text": "Build a premium, multi-page portfolio website for an AI Video Creator with a modern, high-end, minimalist dark aesthetic. The site requires a dynamic content architecture (CMS/Backend capability) so that all text, categories, and project video links can be updated easily.\n\nImplement a global, persistent Navigation Bar linking the three main pages: Home, Projects, and About.\n\n### Global Interactive Feature:\n- Lead Capture Popup: Trigger a sleek modal form exactly 5 seconds after the user lands on the website. Fields required: Name, Phone, Email ID, and Query. It must include a close button and smooth fade-in animation.\n\n---\n\n### PAGE 1: Homepage (Route: `/` or Home)\n1. Hero Section: Full-screen or large aspect-ratio video/image container with a clean text overlay for a cinematic title and subtitle.\n2. Client Logo Ticker: A seamless, horizontal infinitely auto-scrolling row of client or brand logos.\n3. Brief Bio: A two-column layout featuring a professional photo on one side and a brief, elegant \"About Me\" introduction on the other.\n4. Awards & Recognitions: A minimalist section displaying industry benchmarks, awards, or feature highlights.\n5. Reviews: A high-end carousel or clean grid showcasing brief client review cards.\n\n---\n\n### PAGE 2: Projects Page (Route: `/projects`)\n1. Banner: A premium header banner with bold typography and a text description introducing the portfolio body of work.\n2. Layout System: A two-column setup for maximum utility.\n   - Left Sidebar: A clean dropdown menu to filter projects by Category.\n   - Main Grid: A responsive gallery grid displaying multiple project cards.\n3. Project Cards & Video Handling: Each card must fetch its data dynamically. The card displays a thumbnail wrapper that, when clicked, opens or plays an embedded YouTube video link (optimized for Unlisted YouTube video embeds).\n4. Metadata Toggle: Under each video, include a subtle UI toggle that reveals the technical prompt specifications or JSON metadata for that project.\n\n---\n\n### PAGE 3: About Me Page (Route: `/about`)\n1. Detailed Bio: An expanded narrative layout paired with a striking, high-fidelity profile image.\n2. Workflows Section: A dedicated, auto-sliding asset grid titled \"Workflows\" displaying behind-the-scenes proof, node structures, or generation stages.\n3. Detailed Testimonials: A deep-dive section for long-form client testimonials and quotes.\n4. Benchmarks & Accolades: A final structured grid highlighting key artistic milestones and industry recognition.\n\n---\n\n### Backend & Content Management Requirements:\n- If building in Framer: Structure this layout to perfectly map to Framer Collections (CMS) for the Projects grid and text blocks.\n- If building in Lovable / v0: Create a centralized, editable local state configuration file (or connect to a Supabase database schema) and generate a hidden or password-protected \"/admin\" dashboard view. This dashboard must allow me to:\n  1. Add, edit, or delete project cards (Fields: Title, Category, YouTube Link, and Specs JSON).\n  2. Modify the main text fields and descriptions across the Homepage, Projects page, and About page.\n\nStyling: Use Tailwind CSS, premium typography, and smooth page transitions via Framer Motion to give it an elite, cinematic production studio feel.",
      "source": "https://docs.google.com/document/d/1VZuptSviE23csN0jOk4MyxYDOtqQ_9KmFMc7v6H2dXc"
    }
  ],
  "checklist": [
    "I chose a builder and tailored the master prompt to my actual portfolio.",
    "I reviewed the proposed pages and interactions before generating the site.",
    "I replaced the available project, profile, video, and service placeholders with accurate material.",
    "I checked navigation, project filtering, video playback, and the requested interactions.",
    "I reviewed the desktop and mobile layouts and recorded anything unavailable or broken.",
    "I saved the preview or published link and my first grouped revision priorities in the Homework Doc."
  ],
  "quiz": [
    {
      "question": "The prompt asks for both Framer Collections and a local admin dashboard, but you chose Framer. What should you do first?",
      "options": [
        "Keep both requirements to maximize features.",
        "Adapt the prompt to a workable Framer collection approach and remove the incompatible admin requirement.",
        "Generate the site unchanged and decide later."
      ],
      "correct": 1,
      "explanation": "The source prompt contains alternatives for different platforms. Keep the architecture consistent with the builder you selected."
    },
    {
      "question": "Your builder offers a planning step. What should you check before asking it to generate the site?",
      "options": [
        "Whether the proposed pages and interactions match your portfolio goal.",
        "Whether the first generated animation is polished.",
        "Whether every optional backend feature is enabled."
      ],
      "correct": 0,
      "explanation": "The class workflow reviews the proposed site structure before implementation."
    },
    {
      "question": "A project video is a Drive link that does not play inside the portfolio. What is the useful next move?",
      "options": [
        "Map the failed placeholder and try a direct playback link from a video host discussed in class.",
        "Add more text to the About page.",
        "Assume the embedded player will work after publishing."
      ],
      "correct": 0,
      "explanation": "The class noted that Drive links may not play inline and suggested YouTube Unlisted or Wistia for playback."
    },
    {
      "question": "Several related sections need corrections. How should you prepare the next builder request?",
      "options": [
        "Name each affected section and group the desired corrections clearly.",
        "Send one vague request to make the whole site better.",
        "Repeat the same request until the tool changes something."
      ],
      "correct": 0,
      "explanation": "The transcript recommends clear, grouped edit requests to avoid unnecessary piecemeal messages and credit use."
    }
  ],
  "hero": "assets/illustrations/production.svg"
};
