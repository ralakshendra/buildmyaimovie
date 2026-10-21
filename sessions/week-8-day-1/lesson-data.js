window.BMAI_LESSON={
  "id": "week-8-day-1",
  "title": "Automobile Advertisement Production",
  "number": 15,
  "stage": "MOTION",
  "visual": "advertisement",
  "objective": "Create and review an automobile advertisement using a chosen four-wheel vehicle, consistent visual references, a shot plan, and motion clips that preserve the vehicle's identity and move plausibly.",
  "homeworkUrl": "https://docs.google.com/document/d/1pUmCjzW_iYchbUHelAkbBDYmJR2GRhBjYHf6n32_A0g/edit",
  "submission": "Record the vehicle, reference links, shot plan, generated clip links, final advertisement link, review and next fix in this Homework Doc. The class transcript names no separate upload destination.",
  "steps": [
    {
      "title": "Choose the vehicle and lock its references",
      "instruction": "Choose a four-wheel vehicle (car, SUV or sedan) for this lesson; bikes use a different workflow. Gather useful views from multiple angles and keep the vehicle colour consistent. A three-quarter view is a practical starting point. If a vehicle model or 3D viewer is available, capture a needed camera angle from it. If generations keep confusing the vehicle with a similar design, strengthen the references or choose a vehicle the image model can represent more reliably.",
      "review": "The reference pack shows one vehicle model and colour from more than one useful angle, with its distinguishing body details visible."
    },
    {
      "title": "Plan the scenes and camera angles",
      "instruction": "Break the advertisement into shots. For each shot, describe the vehicle action or stillness, setting and camera move. Use an image reference to guide a camera angle that is hard to generate directly. Choose the video method after the shot need is clear. Use start and end frames only when they depict a coherent continuation of the same vehicle and scene; preserve the background and parallax unless a change is intended.",
      "review": "The shot order is understandable, each camera move has a clear purpose, and any start/end pair shares the same vehicle and compatible scene."
    },
    {
      "title": "Generate and refine the motion clips",
      "instruction": "Generate clips from the shot plan with concise, specific prompts. Keep the vehicle identity tied to the reference. Check the camera path, wheel rotation, background motion, rain or water interaction and stopping behavior against the intended physical action. If motion is incoherent, simplify the prompt or use a different method/reference for that shot instead of forcing incompatible endpoints.",
      "review": "The clip follows the intended camera/action, the vehicle remains recognizable, and visible wheels, road, water and background behave consistently with the shot."
    },
    {
      "title": "Assemble and review the advertisement",
      "instruction": "Select the usable clips and assemble an automobile advertisement draft. Review the vehicle's defining features across shots, the transitions in camera and background motion, and the overall sequence. If generated audio is missing or unsuitable, add appropriate sound effects separately or intentionally leave the shot without them. Keep sound and visual assets authorized for use.",
      "review": "A linked draft presents the selected shots as one advertisement, and the student records the strongest result, one issue and the first next fix."
    }
  ],
  "homework": [
    {
      "title": "Vehicle reference pack",
      "prompt": "Choose a four-wheel vehicle. Gather same-colour references from useful angles, note its distinctive body details, and record links to the source images. If available, capture a 3D viewer angle to guide a camera view. If the image model repeatedly changes the vehicle, strengthen the references or choose a better-supported vehicle."
    },
    {
      "title": "Shot and motion plan",
      "prompt": "List the advertisement shots in order. For each, note the vehicle action, scene, camera move, reference image and video method you chose. If using start and end frames, check that both frames show a coherent continuation of the same vehicle and scene."
    },
    {
      "title": "Clip review and first fix",
      "prompt": "Record links to the generated clips and draft. Check vehicle identity, camera movement, wheel rotation, background motion, road or water behavior, transitions and sound. Identify one visible problem and the first change you made or will make."
    }
  ],
  "tools": [
    {
      "name": "Google Search",
      "useCase": "Find same-colour vehicle references from multiple angles before image generation."
    },
    {
      "name": "Nano Banana 2 / Nano Banana Pro",
      "useCase": "Image models compared during class for vehicle image generation; class examples are not a required model choice."
    },
    {
      "name": "GPT Image 2",
      "useCase": "Image model used to compare the same vehicle prompt against another image-generation result."
    }
  ],
  "prompts": [
    {
      "title": "Tata Sumo rainy reference image",
      "text": "An ultra realistic low angle front side image of a red TATA Sumo with yellow headlights in a rainy ambience",
      "source": "Automobile video production Google Doc, section TATA SUMO AD"
    },
    {
      "title": "Start/end camera descent",
      "text": "Create an ultra realistic mocobot movement from the start frame to the end frame.\nAs the car is standing still, the camera is moving down from start frame to end frame to mimic a mocobot alike motion. Strictly do not make any sudden shift in background that breaks natural physics, also keep the parallax as it is.\nAs the car is standing still, the camera is moving down from start frame to end frame to mimic a mocobot alike motion. Strictly do not make any sudden shift in background that breaks natural physics, also keep the parallax as it is.",
      "source": "Automobile video production Google Doc, section TATA SUMO AD; the second instruction paragraph is duplicated in the source"
    },
    {
      "title": "Rain tracking shot",
      "text": "A parallel fixed focal length tracking shot of the car in the reference moving at high speed while its raining moderately, there should be motion blur for the background, and slight rainwater splash on the road. make sure the wheel movement and rotation follow real physics.",
      "source": "Automobile video production Google Doc, section TATA SUMO AD"
    },
    {
      "title": "Short tracking variant",
      "text": "A tracking shot of car moving at high speed in rain, with same focal distance from camera throughout.",
      "source": "Automobile video production Google Doc, section TATA SUMO AD"
    },
    {
      "title": "Low-angle orbit shot",
      "text": "A low angle 180 degree rotation around the car in the same camera angle.",
      "source": "Automobile video production Google Doc, section TATA SUMO AD"
    },
    {
      "title": "Dolly-out drift and stop",
      "text": "A dolly out shot as the car performs a drift and stop. make sure all movements, including water splash and wheel rotation follows physics.",
      "source": "Automobile video production Google Doc, section TATA SUMO AD"
    }
  ],
  "checklist": [
    "I chose a four-wheel vehicle and gathered same-colour references from useful angles.",
    "I checked that the vehicle's distinguishing body details remain consistent in my generated images.",
    "I planned an ordered set of advertisement shots with a clear camera move for each.",
    "I used start and end frames only when they show a coherent continuation of the same vehicle and scene.",
    "I reviewed vehicle identity, camera path, wheel rotation, background motion, and road or water behavior in each clip.",
    "I assembled a linked advertisement draft and recorded one issue and the first next fix in the Homework Doc."
  ],
  "quiz": [
    {
      "question": "What should you check before generating a vehicle image from references?",
      "options": [
        "The references show the same vehicle colour and useful angles",
        "The references show several different models so the model can average them",
        "Only a single front view is available"
      ],
      "correct": 0,
      "explanation": "The lesson warns that inconsistent colours, too few useful angles or similar competing vehicle shapes increase the chance of identity drift."
    },
    {
      "question": "When are start and end frames a good fit for a shot?",
      "options": [
        "When they show unrelated scenes and different vehicles",
        "When they show a coherent continuation of the same vehicle and scene",
        "Whenever a prompt needs more words"
      ],
      "correct": 1,
      "explanation": "The instructor stresses that compatible endpoints reduce hallucination; the intended change should be clear while the shared scene remains stable."
    },
    {
      "question": "The car changes shape in a shot. What is the most useful first move?",
      "options": [
        "Add more unrelated vehicle images to the same reference set",
        "Check the source references and vehicle choice before spending more generations",
        "Describe a different car in the prompt"
      ],
      "correct": 1,
      "explanation": "The lesson recommends strengthening the references or changing to a vehicle the model can represent more reliably when identity keeps failing."
    },
    {
      "question": "How should you decide which video-generation method to use for an advertisement?",
      "options": [
        "Lock one method before planning any shots",
        "Choose a method that fits each shot after its motion and references are clear",
        "Use start/end frames for every shot"
      ],
      "correct": 1,
      "explanation": "The instructor demonstrates that complex advertisements can combine methods and cautions against limiting the creative plan too early."
    }
  ],
  "hero": "assets/illustrations/advertisement.svg"
};
