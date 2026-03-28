export type QuizFact = {
  fact: string;
  question: string;
  choices: string[];
  correctIndex: number;
};

type ScheduledQuiz = {
  dueDay: number;
  factIndex: number;
};

type PersistedQuizState = {
  scheduled: ScheduledQuiz[];
  nextFactIndex: number;
  lastFactDayScheduled: number; // last in-game day we scheduled a fact for
};

const QUIZ_STORAGE_KEY = "game:quiz";

/**
 * QuizController
 * - Shows a fact each morning and schedules a quiz 3 days later.
 * - When a quiz is due, the morning screen can present the question.
 * - On correct answer, the caller can grant rewards (e.g., mines).
 */
export class QuizController {
  private facts: QuizFact[] = [
    {
      fact: "Emus are fast runners, reaching speeds up to 50 km/h.",
      question: "About how fast can emus run?",
      choices: ["10 km/h", "30 km/h", "50 km/h", "80 km/h"],
      correctIndex: 2,
    },
    {
      fact: "Emus are native to Australia and are flightless birds.",
      question: "Where are emus native to?",
      choices: ["Africa", "Australia", "South America", "Europe"],
      correctIndex: 1,
    },
    {
      fact: "Adult emus can grow to around 1.9 meters tall, making them one of the tallest birds in the world.",
      question: "Which description fits an adult emu best?",
      choices: [
        "A tiny forest bird",
        "A tall flightless bird",
        "A bird that spends most of its time swimming",
        "A bird that migrates by flying long distances",
      ],
      correctIndex: 1,
    },
    {
      fact: "Emus rely on their powerful legs for running, traveling long distances, and defending themselves.",
      question: "What part of an emu helps it move and defend itself most?",
      choices: ["Its wings", "Its tail", "Its long legs", "Its feathers"],
      correctIndex: 2,
    },
    {
      fact: "Emu eggs are famous for their large size and dark green color.",
      question: "What color are emu eggs usually described as?",
      choices: ["Dark green", "Bright red", "Pure white", "Light purple"],
      correctIndex: 0,
    },
    {
      fact: "Male emus help incubate the eggs and protect the chicks after hatching.",
      question: "Which parent is best known for incubating emu eggs?",
      choices: ["The male", "The female", "Both equally all season", "Neither parent"],
      correctIndex: 0,
    },
    {
      fact: "The Great Emu War happened in Western Australia in 1932.",
      question: "When did the Great Emu War take place?",
      choices: ["1914", "1921", "1932", "1948"],
      correctIndex: 2,
    },
    {
      fact: "Australian soldiers used Lewis machine guns during the Great Emu War.",
      question: "What weapon is most associated with the Great Emu War?",
      choices: ["Cannons", "Lewis machine guns", "Crossbows", "Mortars"],
      correctIndex: 1,
    },
    {
      fact: "The Great Emu War became famous because the military effort did not decisively solve the emu problem.",
      question: "How is the Great Emu War usually remembered?",
      choices: [
        "As a total military victory",
        "As a failed wildlife control effort",
        "As a naval battle",
        "As a farming holiday",
      ],
      correctIndex: 1,
    },
    {
      fact: "Crops grow over multiple in-game days before harvest.",
      question: "What helps maximize harvest value?",
      choices: ["Harvest immediately", "Wait multiple days", "Never harvest", "Sell seeds"],
      correctIndex: 1,
    },
    {
      fact: "If emus eat every crop on your farm during combat, the run ends in defeat.",
      question: "What causes an immediate loss during the farm defense phase?",
      choices: [
        "Running out of eggs",
        "Losing every crop to emus",
        "Skipping a quiz",
        "Buying too many defenses",
      ],
      correctIndex: 1,
    },
    {
      fact: "Land mines can clear multiple nearby emus at once.",
      question: "What does deploying a mine do?",
      choices: [
        "Spawns more emus",
        "Clears nearby emus",
        "Increases money",
        "Grows crops faster",
      ],
      correctIndex: 1,
    },
    {
      fact: "Answering the daily quiz correctly rewards you with a mine to help in future battles.",
      question: "What reward do you get for answering the quiz correctly?",
      choices: ["A mine", "A free crop harvest", "An extra day", "A bonus emu egg"],
      correctIndex: 0,
    },
    {
      fact: "Machine gun nests automatically fire at nearby emus once combat begins.",
      question: "What is the main job of a machine gun nest?",
      choices: [
        "Healing damaged crops",
        "Selling crops for money",
        "Firing at nearby emus",
        "Growing crops instantly",
      ],
      correctIndex: 2,
    },
    {
      fact: "Defense upgrades increase durability up to level 10, while the base purchase price stays the same.",
      question: "What does upgrading a defense item improve?",
      choices: ["Its durability", "Its purchase price", "Crop growth speed", "Quiz rewards"],
      correctIndex: 0,
    },
    {
      fact: "Selling crops in the morning market earns money.",
      question: "Where can you sell crops?",
      choices: ["Farm field", "Morning market", "Game over screen", "Main menu"],
      correctIndex: 1,
    },
    {
      fact: "Eggs stolen during raid sequences can be sold later at the market for extra money.",
      question: "What can you do with eggs collected in raids?",
      choices: ["Trade them for money", "Plant them as crops", "Turn them into sandbags", "Use them to skip the day"],
      correctIndex: 0,
    },
  ];

  private scheduled: ScheduledQuiz[] = [];
  private nextFactIndex = 0;
  private lastFactDayScheduled = 0;

  constructor() {
    const saved = this.load();
    if (saved) {
      this.scheduled = saved.scheduled;
      this.nextFactIndex = saved.nextFactIndex;
      this.lastFactDayScheduled = saved.lastFactDayScheduled;
    } else {
      this.save();
    }
  }

  // Persistence
  private save(): void {
    const s: PersistedQuizState = {
      scheduled: this.scheduled,
      nextFactIndex: this.nextFactIndex,
      lastFactDayScheduled: this.lastFactDayScheduled,
    };
    try {
      localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(s));
    } catch {}
  }

  private load(): PersistedQuizState | null {
    try {
      const str = localStorage.getItem(QUIZ_STORAGE_KEY);
      if (!str) return null;
      return JSON.parse(str) as PersistedQuizState;
    } catch {
      return null;
    }
  }

  /**
   * Ensure a fact is scheduled for a given day; returns the fact text to show.
   * Schedules a quiz for day + 3.
   */
  ensureFactForDay(day: number): QuizFact {
    if (day < this.lastFactDayScheduled) {
      this.resetTimeline();
    }
    if (day > this.lastFactDayScheduled) {
      const factIndex = this.nextFactIndex % this.facts.length;
      this.scheduled.push({ dueDay: day + 3, factIndex });
      this.nextFactIndex = factIndex + 1;
      this.lastFactDayScheduled = day;
      this.save();
    }
    // Show the fact assigned for the current day (the most recently scheduled)
    const recentIndex = (this.nextFactIndex + this.facts.length - 1) % this.facts.length;
    return this.facts[recentIndex];
  }

  /**
   * Get the first quiz that's due today (if any).
   * Quizzes only appear starting from day 4 (first fact shown on day 1, quiz 3 days later).
   */
  getDueQuiz(day: number): { due: ScheduledQuiz; fact: QuizFact } | null {
    if (day < 4) return null; // No quizzes before day 4 (first quiz is 3 days after day 1 fact)
    const dueIdx = this.scheduled.findIndex((q) => q.dueDay === day);
    if (dueIdx === -1) return null;
    const due = this.scheduled[dueIdx];
    const fact = this.facts[due.factIndex % this.facts.length];
    return { due, fact };
  }

  /**
   * Remove the given scheduled quiz (after answering).
   */
  completeQuiz(dueDay: number): void {
    this.scheduled = this.scheduled.filter((q) => q.dueDay !== dueDay);
    this.save();
  }

  private resetTimeline(): void {
    this.scheduled = [];
    this.nextFactIndex = 0;
    this.lastFactDayScheduled = 0;
    this.save();
  }
}
