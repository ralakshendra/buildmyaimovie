window.BMAI_LESSON={
  "id": "week-6-day-1",
  "title": "Mahabharata Production: Character, Prop & Shot Continuity",
  "number": 10,
  "start": "2026-11-07T20:00:00+05:30",
  "end": "2026-11-07T22:00:00+05:30",
  "stage": "SHOTS",
  "objective": "By the end of the session, each team will have a reviewed character sheet for the characters in its assigned film and a prop sheet for the story-critical objects, with reference images ready to support consistent image and video generation.",
  "submission": "The transcript says the Mahabharata project deadline is two weeks after this session. It does not identify a calendar date or submission destination. Keep the team sheets and chosen generations with the project until the cohort confirms where to submit them.",
  "estimatedTime": "Class practice plus team production between sessions",
  "difficulty": "Intermediate",
  "goal": "Deliver a source-grounded character sheet and prop sheet for the team’s assigned Mahabharata film, with selected reference images and a documented review pass.",
  "learningObjectives": [
    {
      "title": "Lock the character references",
      "body": "Use the supplied face and outfit references to build a consistent character sheet with turnaround views and useful expressions."
    },
    {
      "title": "Inventory story-critical props",
      "body": "Use the project shot list and team assignment to identify each prop that must be represented consistently."
    },
    {
      "title": "Iterate with evidence",
      "body": "Compare generations to the reference, name the specific failure, and change one meaningful variable at a time."
    },
    {
      "title": "Choose shots as a team",
      "body": "Compare visual quality, source fit and motion potential before approving a version for the film."
    }
  ],
  "steps": [
    {
      "title": "Confirm your team and assigned film",
      "instruction": "Check the Mahabharatha project team sheet. Confirm your team’s film/topic and the image-generation and video-generation leads. Ask the team for a recap if you joined after the earlier planning session.",
      "review": "Your team name, assigned film, and responsible image/video leads agree with the team sheet."
    },
    {
      "title": "Build the character sheet",
      "instruction": "List the characters that actually appear in your assigned film. For each one, gather the approved face and costume references, then adapt the Canva character-sheet prompt. Keep identity references separate from costume references and retain clear placeholders for the supplied images.",
      "review": "The sheet shows the needed characters with consistent faces, costume details, turnaround views, and expressions that match the supplied references."
    },
    {
      "title": "Build the prop sheet",
      "instruction": "Identify story-critical objects from the shot list and the team’s assigned scenes. Use the Mahabharatha Project (BMAM) sheet’s character and prop columns as an inventory aid. Create reference images from the official materials or instructor-shared prompt; no complete official prop-sheet prompt was supplied in this source packet.",
      "review": "Each selected prop has a clear name, reference, visual details, and the scene or character it belongs to. Unverified designs are marked for review."
    },
    {
      "title": "Generate, compare, and revise",
      "instruction": "Use the character and prop references while generating the assigned frames. For each failed pass, describe the visible mismatch (identity, scale, formation, anatomy, movement, or texture), choose the smallest useful change, and compare the new result with the reference. After repeated failure, change the approach instead of issuing the same prompt again.",
      "review": "The team can point to the reference, identify what changed between versions, and explain why the selected frame is the strongest usable match."
    },
    {
      "title": "Review motion and make a creative decision",
      "instruction": "Generate motion only from a selected frame. Review body mechanics, scale, camera movement and the intended action. If generated movement misses the goal, consider an edit-based repair such as trimming and reversing a segment, as demonstrated in the session. Record when the shot is a deliberate approximation.",
      "review": "The chosen clip communicates the intended action, avoids obvious physics or continuity failures, and is approved by the team."
    },
    {
      "title": "Coordinate the production handoff",
      "instruction": "Share the latest character sheet, prop sheet, selected references, and unresolved issues with the rest of the team. Invite more than one team member to review major creative decisions. Keep the mythological subject respectful; the instructor explicitly cautioned against spoof treatment.",
      "review": "The team knows which versions are approved, who owns the next task, and which issues still need a decision."
    }
  ],
  "tools": [
    {
      "name": "Claude",
      "useCase": "Use the session’s Canva-referenced workflow to structure character sheets, props, and shot images from the supplied source context."
    },
    {
      "name": "Gemini",
      "useCase": "Use the session’s Canva-referenced workflow to structure character sheets, props, and shot images from the supplied source context."
    },
    {
      "name": "Lemonpeel",
      "useCase": "Generate images and video variations for the assigned film, as listed in the Canva workflow reference."
    },
    {
      "name": "Google Flow",
      "useCase": "Generate prop images and the first frame for Scene 1, as listed in the Canva workflow reference."
    },
    {
      "name": "ElevenLabs",
      "useCase": "Create voiceover and dialogue for the production, as listed in the Canva workflow reference."
    },
    {
      "name": "Pixabay",
      "useCase": "Source music and sound effects for the production, as listed in the Canva workflow reference."
    },
    {
      "name": "YouTube",
      "useCase": "Study inspiration and adapt ideas into the team’s own production; do not copy a reference film shot-for-shot."
    }
  ],
  "prompts": [
    {
      "title": "Hero prompt for script and screenplay / shot list",
      "source": "https://canva.link/3b9f4amvav9gwy8",
      "text": "I have attached the script. Also ref images of the cinematic style which I want in terms of lighting and cinematogrphy. Remember this is a complete end to end AI production. Now you act as a world class Film director, and come up with a complete shot list table which also has prompts required for each shots image generations. Also remember I have character sheet for main characters. so in the prompts include placeholders whenever a main character is coming. The lighting coloring should be consistent throughout. Also individual prompts for main elemnts such as Gandiva, the game board, chariot wheel etc. The shot list should look world class like the horiziontal shot list they use in hollywood for production."
    },
    {
      "title": "Arjuna character sheet prompt",
      "source": "https://canva.link/3b9f4amvav9gwy8",
      "text": "Ultra-photorealistic character sheet of Arjuna from the Mahabharata. CRITICAL: The character's face, facial features, and skin tone MUST strictly match ONLY @image1 @image2 @image3 @image4. Do not alter the face. The character's hairstyle should match @image6. The outfit should exactly match @image5 (use this reference for clothing and armor ONLY, ignore the face in this reference). Features realistic ancient Indian warrior attire, authentic metal armor, woven fabrics, and ornate jewelry suitable for a live-action historical epic. Neutral, heroic expression. Cinematic studio lighting, realistic shadows, hyper-detailed skin texture with visible pores, subsurface scattering, and natural imperfections. Include full character turnaround: Front view (neutral pose), Left side profile, Right side profile, 3/4 angle view. Add expression sheet: Neutral, Slight smile, Confident smile, Serious/Battle-ready, Confused. Add detail callouts: Close-up of eyes (accurate color, iris detail, and shape), realistic hair texture, and intricate armor/fabric material details. Style: 100% photorealistic, live-action cinema, 8k resolution, highly detailed photography, neutral grey background, consistent proportions across all views."
    },
    {
      "title": "Draupadi (Panchali) character sheet prompt",
      "source": "https://canva.link/3b9f4amvav9gwy8",
      "text": "Ultra-photorealistic character sheet of Draupadi (Panchali) from the Mahabharata. CRITICAL: The character's face, facial features, and skin tone MUST strictly match ONLY [@image1 @image2 @image3]. Maintain the exact bone structure, iris detail, and facial proportions. Character Sheet Layout: Full turnaround including Front view (regal standing pose), Left side profile, Right side profile, and 3/4 angle view. Add an expression sheet: Serene/Regal, Gentle smile, Commandingly serious, Emotional/Vulnerable, and Intense/Determined. Costume & Hair (Cinematic Reconstruction): An elaborate, high-end ancient Indian royal ensemble. She wears a fine silk sari in deep crimson and gold (symbolising her birth from fire), draped elegantly in a classical Vedic style. The fabric should have visible thread-work, intricate golden embroidery, and a realistic weight. Her hair is iconic: long, thick, raven-black, and wavy, flowing down to her waist but styled with a gold Maang Tikka and pearls. Jewellery: Authentic ancient Indian temple jewellery in 22k gold, including a heavy Choker and long Haar necklaces, intricate Bajuband (armlets), Kangan (bangles), and a traditional nose ring (Nath). All jewellery must have realistic metallic reflections and gemstone inlays (rubies and pearls). Technical Style: 100% photorealistic, live-action cinema quality, hyper-detailed skin texture with visible pores and natural imperfections, subsurface scattering for realistic skin glow. 8k resolution, cinematic studio lighting with soft shadows, neutral grey background, consistent proportions across all views. Detail Callouts: Close-up of the eyes (matching the likeness reference), macro view of the golden embroidery on the silk, and a detailed view of the intricate gold jewellery."
    },
    {
      "title": "Kunti Devi (The Rajmata) character sheet prompt",
      "source": "https://canva.link/3b9f4amvav9gwy8",
      "text": "Kunti Devi (The Rajmata) Theme: Dignity, wisdom, maternal strength, and understated royalty. Ultra-photorealistic character sheet of Kunti Devi from the Mahabharata. CRITICAL: The character's face and skin tone MUST strictly match ONLY [@image1 @image2 @image3]. Her expression should carry the weight of her history-wise and slightly sorrowful but very dignified. Costume: A sophisticated, high-end silk sari in ivory and muted gold (Rajmata style). The fabric should have a soft, realistic sheen and intricate hand-woven textures. She wears the pallu elegantly over her head. Jewelry: Sophisticated and traditional ancient Indian jewelry-a single heavy gold necklace, simple but large gold earrings (Karnaphool), and traditional bangles. No crown, but a subtle gold headpiece (Maang Tikka) visible under the sari veil. Layout: Full turnaround (Front, Side, Back, 3/4). Expression sheet: Serene/Wise, Sorrowful/Reflective, Maternal smile, Commanding presence. Style: 100% photorealistic, soft studio lighting, 8k resolution, hyper-detailed silk textures and aged, realistic skin, neutral grey background."
    },
    {
      "title": "Character sheet close-up prompt",
      "source": "https://canva.link/3b9f4amvav9gwy8",
      "text": "Ultra-realistic professional studio portrait of the same person in the same costume, clean minimal background, soft neutral tones (white/grey), high-end fashion photography, sharp facial details, natural skin texture, soft diffused studio lighting, subtle shadows, centered composition, 85mm lens, shallow depth of field, no distractions, no props, polished and elegant look. Strictly should look like the person from the attached reference."
    }
  ],
  "homework": [
    {
      "title": "Prepare the character reference pack",
      "body": "Complete or revise the character sheet for the people who appear in your team’s assigned film.",
      "prompt": "Start from the team’s approved face and costume images. Adapt the Canva character-sheet prompt to the correct character and image references. Check the face, outfit, turnaround, and expression views against the source images."
    },
    {
      "title": "Prepare the prop reference pack",
      "body": "Make a prop inventory and reference sheet for objects needed in your assigned scenes.",
      "prompt": "Use the production shot list and the Mahabharatha Project (BMAM) sheet’s prop entries to select only the objects used by your team. For each object, record its name, source reference, scene use, and the unresolved visual details. Do not invent an official prompt when one has not been supplied."
    },
    {
      "title": "Revise and select image generations",
      "body": "Generate the assigned frames and compare each version with the approved character, prop, and scene references.",
      "prompt": "For each revision, state one visible mismatch, change the prompt or reference that addresses it, and save the before/after versions. Keep the selected version only when the reference, scale, composition, and intended story beat are clear."
    },
    {
      "title": "Test motion and repair the edit",
      "body": "Animate a selected frame and review the motion before the team approves it.",
      "prompt": "Check identity, anatomy, scale, direction, and physical movement. If the model misses the motion, try a focused prompt/reference change; if the result is still useful but imperfect, test a precise edit repair and label the shot as an approximation."
    },
    {
      "title": "Hand off the team’s approved materials",
      "body": "Make the current approved character and prop references easy for the whole team to find.",
      "prompt": "Share the approved sheets, selected images and clips, version notes, open questions, and next owner with your team. Ask at least one teammate to review the choices before the production handoff."
    }
  ],
  "checklist": [
    "I confirmed my team and the film/topic assigned to us.",
    "I listed only the characters that appear in our assigned film.",
    "I used the supplied face and costume references when revising character sheets.",
    "The character sheets include consistent views and useful expressions.",
    "I checked the Mahabharatha Project (BMAM) sheet and shot list for story-critical props.",
    "Each prop reference is tied to a character or scene, and unknown details are marked for review.",
    "I recorded a visible mismatch before revising an image or clip.",
    "I compared the selected generation with the supplied references.",
    "I checked scale, anatomy, movement, and continuity before approving motion.",
    "I shared the approved sheets, versions, open issues, and next owner with the team.",
    "I kept the Mahabharata treatment respectful and avoided spoof framing."
  ],
  "quiz": [
    {
      "question": "A generated Chakravyuha looks cinematic but its spiral shape is wrong. What is the best next decision?",
      "options": [
        "Keep prompting with no reference until the shape changes",
        "Use the supplied formation reference, revise toward it, and document any remaining difference before choosing the shot",
        "Crop the image so the formation is hidden",
        "Treat a visually pleasing result as historically exact"
      ],
      "correct": 1,
      "explanation": "The session describes the formation as difficult for models to reproduce. A reference image is the useful guide; any remaining mismatch should be treated as a creative approximation, not as a source-accurate result."
    },
    {
      "question": "A character sheet changes the face when you add a costume reference. What should you check first?",
      "options": [
        "Whether the face references and outfit reference are clearly assigned different roles",
        "Whether you can add more decorative details",
        "Whether to change the character’s name",
        "Whether the image is in a wider aspect ratio"
      ],
      "correct": 0,
      "explanation": "The Canva prompt explicitly separates face references from the outfit reference. Keeping those roles clear helps avoid importing the wrong face from a costume image."
    },
    {
      "question": "A video model turns ground vibration into an explosion. The shot is still useful in the edit. What did the instructor demonstrate?",
      "options": [
        "Call the result physically correct",
        "Use a short segment and reverse it in the edit to suggest vibration",
        "Add more characters to the frame",
        "Upscale before reviewing it"
      ],
      "correct": 1,
      "explanation": "The transcript describes trimming and reversing part of a generated shot so it reads as vibration in the final edit, even though the model produced a blast-like motion."
    },
    {
      "question": "Which source-backed deliverables were expected by the end of the class?",
      "options": [
        "A finished feature-length film",
        "A character sheet for each character in the team’s film and a prop sheet",
        "A published trailer and signed distribution agreement",
        "A new voiceover for every character"
      ],
      "correct": 1,
      "explanation": "The instructor’s stated end-of-day check was a character sheet for every character in the team’s film and a prop sheet."
    },
    {
      "question": "The team disagrees about an experimental treatment of the Mahabharata story. What guidance did the instructor give?",
      "options": [
        "Choose the most comedic version",
        "Follow one person’s opinion without discussion",
        "Collaborate and experiment while avoiding spoof treatment of the sensitive subject",
        "Copy the reference video exactly"
      ],
      "correct": 2,
      "explanation": "The transcript encourages multiple opinions and experimentation, while explicitly cautioning the group against spoof treatment of the Mahabharata project."
    }
  ],
  "homeworkUrl": "https://docs.google.com/document/d/1NG5eCKm4gutvS5j_3CASgbH1T8XIOI-_4F2vV7DQkyU/edit",
  "visual": "production",
  "hero": "assets/illustrations/production.svg"
};
window.sessionData=window.BMAI_LESSON;
