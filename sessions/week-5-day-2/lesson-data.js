window.BMAI_LESSON={
  "id": "week-5-day-2",
  "title": "Plan the Film Before the First Frame",
  "number": 9,
  "stage": "BLUEPRINT",
  "visual": "production",
  "objective": "Create a detailed screenplay and a Hollywood-style production sheet that turns the assigned story into visually consistent, executable shots.",
  "homeworkUrl": "https://docs.google.com/document/d/1CGb4bhUlKvlzL4IrIrKtVGe1lMsYzwodJvVRnOTZWD4/edit",
  "submission": "Complete the screenplay and production sheet in the official Homework Doc. Follow cohort submission instructions when provided.",
  "steps": [
    {
      "title": "Confirm the story brief",
      "instruction": "Review the assigned story topic and reference video together. Identify the characters and essential beats. Keep the topic aligned to the reference while choosing your own scenes, dialogue, pacing and production design. Aim for a 1.5–3 minute film; shorten a longer source to the clearest sequence.",
      "review": "The team can name the story focus, key characters and sequence it will adapt."
    },
    {
      "title": "Write and lock the screenplay",
      "instruction": "Draft the screenplay in WriterDuet, Google Docs or another writing tool. The team may write it directly or use an LLM when short on time; the team must review and approve it. Keep dialogue purposeful and build the story through visual choices rather than long monologues.",
      "review": "A complete screenplay is approved before shot planning begins."
    },
    {
      "title": "Align production roles",
      "instruction": "Choose an image-generation lead and a video-generation lead. Have them develop the shot plan together so character references, camera choices, lighting and motion support one visual direction. Assign screenplay, direction and audio responsibilities as useful.",
      "review": "Both generation leads agree on how the screenplay will translate into shots."
    },
    {
      "title": "Build the shot-by-shot production sheet",
      "instruction": "For every shot, record scene and story action, camera framing or movement, lighting and color, image-generation prompt, sound or dialogue needs, and duration. Add placeholders for main-character references and separate prompts for important props or backgrounds. Mix wide, close-up, rear and three-quarter coverage; identify the speaker clearly for dialogue shots.",
      "review": "A teammate can execute every shot from the sheet, and visual continuity is explicit."
    },
    {
      "title": "Review the handoff",
      "instruction": "Read the screenplay and production sheet together. Check story clarity, visual continuity, character and prop references, dialogue coverage, and role alignment. Generation is the next production stage; this session completes preproduction.",
      "review": "The approved screenplay and shot plan are ready to carry into generation."
    }
  ],
  "homework": [
    {
      "title": "Story and screenplay",
      "prompt": "Record the assigned story and reference, the team’s creative approach, the approved screenplay link or text, and changes made during review."
    },
    {
      "title": "References and shared look",
      "prompt": "Add optional character, prop and background references where they help. Record the shared visual reference and lighting or color notes."
    },
    {
      "title": "Production sheet",
      "prompt": "Create one row per shot with scene, narrative action, camera and movement, lighting and color, image prompt, sound or dialogue, and duration. Coordinate the image-generation and video-generation leads on the same plan."
    },
    {
      "title": "Review and handoff",
      "prompt": "Use the final review checklist, note what will carry into the next production stage, and capture the team’s reflection."
    }
  ],
  "tools": [
    {
      "name": "Google Sheets",
      "useCase": "Use the supplied shot-list workbook as a structural reference for the team production sheet."
    },
    {
      "name": "WriterDuet",
      "useCase": "Draft and revise the screenplay before the shot list is finalized; the walkthrough used WriterDuet."
    },
    {
      "name": "Google Docs",
      "useCase": "Draft the screenplay or maintain the official homework record."
    },
    {
      "name": "Claude",
      "useCase": "The Canva workflow lists Claude for character sheets, props, and shot images."
    },
    {
      "name": "Gemini",
      "useCase": "The Canva workflow lists Gemini for character sheets, props, and shot images."
    },
    {
      "name": "Lemonpeel",
      "useCase": "The Canva workflow lists Lemonpeel for image generation and video generation."
    },
    {
      "name": "Google Flow",
      "useCase": "The Canva workflow lists Google Flow for prop images and Scene 1 first-frame generation."
    },
    {
      "name": "ElevenLabs",
      "useCase": "The Canva workflow lists ElevenLabs for voiceover and dialogue."
    },
    {
      "name": "Pixabay",
      "useCase": "The Canva workflow lists Pixabay for music and sound effects."
    },
    {
      "name": "YouTube",
      "useCase": "The Canva workflow lists YouTube for inspiration and idea adaptation."
    },
    {
      "name": "OpenArt",
      "useCase": "Use OpenArt for image generation when it fits the team workflow, and keep approved character and style references consistent across shots."
    }
  ],
  "prompts": [
    {
      "title": "Hero prompt for script and screenplay",
      "text": "I have attached the script. Also ref images of the cinematic style which I want in terms of lighting and cinematogrphy. Remember this is a complete end to end AI production. Now you act as a world class Film director, and come up with a complete shot list table which also has prompts required for each shots image generations. Also remember I have character sheet for main characters. so in the prompts include placeholders whenever a main character is coming. The lighting coloring should be consistent throughout. Also individual prompts for main elemnts such as Gandiva, the game board, chariot wheel etc. The shot list should look world class like the horiziontal shot list they use in hollywood for production.",
      "source": "Mahabharata workflow presentation by Mithun Palliyalil, Canva"
    },
    {
      "title": "Arjuna character sheet prompt",
      "text": "Ultra-photorealistic character sheet of Arjuna from the Mahabharata. CRITICAL: The character's face, facial features, and skin tone MUST strictly match ONLY @image1 @image2 @image3 @image4 . Do not alter the face. The character's hairstyle should match @image6 . The outfit should exactly match @image5 (use this reference for clothing and armor ONLY, ignore the face in this reference). Features realistic ancient Indian warrior attire, authentic metal armor, woven fabrics, and ornate jewelry suitable for a live-action historical epic. Neutral, heroic expression. Cinematic studio lighting, realistic shadows, hyper-detailed skin texture with visible pores, subsurface scattering, and natural imperfections. Include full character turnaround: Front view (neutral pose), Left side profile, Right side profile, 3/4 angle view. Add expression sheet: Neutral, Slight smile, Confident smile, Serious/Battle-ready, Confused. Add detail callouts: Close-up of eyes (accurate color, iris detail, and shape), realistic hair texture, and intricate armor/fabric material details. Style: 100% photorealistic, live-action cinema, 8k resolution, highly detailed photography, neutral grey background, consistent proportions across all views.",
      "source": "Mahabharata workflow presentation by Mithun Palliyalil, Canva"
    },
    {
      "title": "Draupadi character sheet prompt",
      "text": "Ultra-photorealistic character sheet of Draupadi (Panchali) from the Mahabharata. CRITICAL: The character's face, facial features, and skin tone MUST strictly match ONLY [ @image1 @image2 @image3 ]. Maintain the exact bone structure, iris detail, and facial proportions. Character Sheet Layout: Full turnaround including Front view (regal standing pose), Left side profile, Right side profile, and 3/4 angle view. Add an expression sheet: Serene/Regal, Gentle smile, Commandingly serious, Emotional/Vulnerable, and Intense/Determined. Costume & Hair (Cinematic Reconstruction): An elaborate, high-end ancient Indian royal ensemble. She wears a fine silk sari in deep crimson and gold (symbolising her birth from fire), draped elegantly in a classical Vedic style. The fabric should have visible thread-work, intricate golden embroidery, and a realistic weight. Her hair is iconic: long, thick, raven-black, and wavy, flowing down to her waist but styled with a gold Maang Tikka and pearls. Jewellery: Authentic ancient Indian temple jewellery in 22k gold, including a heavy Choker and long Haar necklaces, intricate Bajuband (armlets), Kangan (bangles), and a traditional nose ring (Nath). All jewellery must have realistic metallic reflections and gemstone inlays (rubies and pearls). Technical Style: 100% photorealistic, live-action cinema quality, hyper-detailed skin texture with visible pores and natural imperfections, subsurface scattering for realistic skin glow. 8k resolution, cinematic studio lighting with soft shadows, neutral grey background, consistent proportions across all views. Detail Callouts: Close-up of the eyes (matching the likeness reference), macro view of the golden embroidery on the silk, and a detailed view of the intricate gold jewellery.",
      "source": "Mahabharata workflow presentation by Mithun Palliyalil, Canva"
    },
    {
      "title": "Kunti Devi character sheet prompt",
      "text": "Kunti Devi (The Rajmata) Theme: Dignity, wisdom, maternal strength, and understated royalty. Ultra-photorealistic character sheet of Kunti Devi from the Mahabharata. CRITICAL: The character's face and skin tone MUST strictly match ONLY [ @image1 @image2 @image3 ]. Her expression should carry the weight of her history-wise and slightly sorrowful but very dignified. Costume: A sophisticated, high-end silk sari in ivory and muted gold (Rajmata style). The fabric should have a soft, realistic sheen and intricate hand-woven textures. She wears the pallu elegantly over her head. Jewelry: Sophisticated and traditional ancient Indian jewelry-a single heavy gold necklace, simple but large gold earrings (Karnaphool), and traditional bangles. No crown, but a subtle gold headpiece (Maang Tikka) visible under the sari veil. Layout: Full turnaround (Front, Side, Back, 3/4). Expression sheet: Serene/Wise, Sorrowful/Reflective, Maternal smile, Commanding presence. Style: 100% photorealistic, soft studio lighting, 8k resolution, hyper-detailed silk textures and aged, realistic skin, neutral grey background.",
      "source": "Mahabharata workflow presentation by Mithun Palliyalil, Canva"
    },
    {
      "title": "Character sheet close-up prompt",
      "text": "Ultra-realistic professional studio portrait of the same person in the same costume, clean minimal background, soft neutral tones (white/grey), high-end fashion photography, sharp facial details, natural skin texture, soft diffused studio lighting, subtle shadows, centered composition, 85mm lens, shallow depth of field, no distractions, no props, polished and elegant look. Strictly should look like the person from the attached reference.",
      "source": "Mahabharata workflow presentation by Mithun Palliyalil, Canva"
    }
  ],
  "checklist": [
    "The screenplay follows the assigned story and is approved before shot listing.",
    "Every shot has a clear visual action and camera choice.",
    "Lighting and color stay consistent across the production sheet.",
    "Main characters and important props have references where needed.",
    "Image-generation and video-generation leads reviewed the plan together.",
    "Dialogue and voiceover are planned without relying on long monologues."
  ],
  "quiz": [
    {
      "question": "The image and video leads disagree about how a scene should look. What is the best next step?",
      "options": [
        "Agree on one shot plan together, grounding camera and visual choices in the approved screenplay",
        "Let each lead generate a different version without aligning",
        "Start generation before the screenplay is settled"
      ],
      "correct": 0,
      "explanation": "The leads must coordinate the shot plan so images, camera choices and motion carry one consistent visual direction."
    }
  ],
  "hero": "assets/illustrations/production.svg"
};
