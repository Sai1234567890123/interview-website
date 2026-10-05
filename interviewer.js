/**
 * FAANGPrep Studio // FAANG Mock Interview Simulator
 * Dynamic AI Persona (Google L6, Meta E6, Amazon Bar Raiser) with Progressive Questioning
 */

class FAANGInterviewer {
  constructor() {
    this.transcriptArea = document.getElementById("interview-transcript-area");
    this.messageInput = document.getElementById("candidate-message-input");
    this.btnSend = document.getElementById("btn-send-message");
    this.nameEl = document.getElementById("interviewer-name");
    this.titleEl = document.getElementById("interviewer-title");
    this.avatarInitials = document.querySelector(".avatar-initials");
    this.drawer = document.getElementById("interviewer-drawer");
    this.btnToggle = document.getElementById("btn-toggle-interviewer");
    this.btnClose = document.getElementById("btn-close-interviewer");

    this.currentCompany = "google";
    this.interviewStage = 0; // 0: Greeting, 1: Approach, 2: Coding, 3: Optimization, 4: Scale

    this.personas = {
      google: {
        name: "Alex Rivera",
        title: "Staff Software Engineer (L6) // Google Cloud",
        initials: "AR",
        greeting: "Hi there! I'm Alex from Google Cloud. Today we'll be tackling an algorithmic challenge together. Before writing any code, I'd love to hear how you think through the problem and how you'd clarify any edge cases."
      },
      meta: {
        name: "Elena Zhao",
        title: "Production Infrastructure Architect (E6) // Meta",
        initials: "EZ",
        greeting: "Hello! Elena here from Meta. We care heavily about memory efficiency, zero-allocation algorithms, and clean production code. Walk me through your intuition first."
      },
      amazon: {
        name: "Marcus Vance",
        title: "Principal Engineer & Bar Raiser // AWS DynamoDB",
        initials: "MV",
        greeting: "Welcome! I'm Marcus, a Bar Raiser at Amazon. I'll be evaluating both your algorithmic correctness and your engineering trade-offs under high-throughput customer loads."
      },
      apple: {
        name: "David Chen",
        title: "Senior Staff Engineer // Apple CoreOS",
        initials: "DC",
        greeting: "Hi! David here from Apple CoreOS. We look for pristine cache locality, minimal branch penalties, and robust defensive programming. What's your proposed approach?"
      },
      netflix: {
        name: "Sarah Miller",
        title: "Principal Distributed Systems Architect // Netflix",
        initials: "SM",
        greeting: "Hey! Sarah from Netflix. Let's explore how you structure this solution and how we can ensure it runs reliably across distributed streaming telemetry."
      }
    };

    this.bindEvents();
  }

  bindEvents() {
    if (this.btnSend) {
      this.btnSend.addEventListener("click", () => this.handleCandidateSubmit());
    }
    if (this.messageInput) {
      this.messageInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") this.handleCandidateSubmit();
      });
    }

    if (this.btnToggle && this.drawer) {
      this.btnToggle.addEventListener("click", () => {
        this.drawer.classList.toggle("minimized");
        this.btnToggle.classList.toggle("active");
      });
    }

    if (this.btnClose && this.drawer) {
      this.btnClose.addEventListener("click", () => {
        this.drawer.classList.add("minimized");
        this.btnToggle?.classList.remove("active");
      });
    }

    // Quick Prompt Chips
    document.querySelectorAll(".quick-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        const action = chip.getAttribute("data-action");
        this.handleQuickAction(action);
      });
    });

    // Request Hint button in editor
    const btnHint = document.getElementById("btn-request-hint");
    if (btnHint) {
      btnHint.addEventListener("click", () => this.provideHint());
    }
  }

  setCompany(companyKey) {
    if (!this.personas[companyKey]) return;
    this.currentCompany = companyKey;
    const persona = this.personas[companyKey];
    
    if (this.nameEl) this.nameEl.textContent = persona.name;
    if (this.titleEl) this.titleEl.textContent = persona.title;
    if (this.avatarInitials) this.avatarInitials.textContent = persona.initials;

    this.resetInterview(persona.greeting);
  }

  resetInterview(customGreeting) {
    if (!this.transcriptArea) return;
    this.transcriptArea.innerHTML = "";
    const greeting = customGreeting || this.personas[this.currentCompany].greeting;
    this.appendMessage("interviewer", greeting);
  }

  appendMessage(sender, text) {
    if (!this.transcriptArea) return;
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${sender}`;
    bubble.innerHTML = sender === "interviewer" 
      ? `<strong>${this.personas[this.currentCompany].name}:</strong> ${text}`
      : text;
    this.transcriptArea.appendChild(bubble);
    this.transcriptArea.scrollTop = this.transcriptArea.scrollHeight;
  }

  handleCandidateSubmit() {
    if (!this.messageInput) return;
    const msg = this.messageInput.value.trim();
    if (!msg) return;

    this.appendMessage("candidate", msg);
    this.messageInput.value = "";

    // Generate intelligent interviewer response
    setTimeout(() => {
      this.generateInterviewerResponse(msg);
    }, 700);
  }

  handleQuickAction(action) {
    if (action === "explain") {
      this.appendMessage("candidate", "I'd like to use a Two-Pointer strategy: start with pointers at both boundaries (0 and N-1), compute the volume, and iteratively shift the pointer corresponding to the shorter wall inwards.");
      setTimeout(() => {
        this.appendMessage("interviewer", "Excellent intuition! Why does shifting the shorter wall guarantee that we don't accidentally skip a larger potential container?");
      }, 700);
    } else if (action === "clarify") {
      this.appendMessage("candidate", "Can the array contain negative heights? What are the maximum bounds on N? Can we modify the input array in-place?");
      setTimeout(() => {
        this.appendMessage("interviewer", "Great clarifying questions. Heights are non-negative integers (0 to 10^4), array size N is up to 10^5, and you should treat the array as read-only (zero extra space preferred).");
      }, 700);
    } else if (action === "scale") {
      this.appendMessage("candidate", "If the data set is 100 billion points and does not fit in RAM, how should we partition and parallelize the computation?");
      setTimeout(() => {
        this.appendMessage("interviewer", "Outstanding senior-level question! We can split the stream into chunks across a MapReduce or Spark cluster, compute the upper convex hull / skyline boundaries locally on each worker, and merge the boundary envelopes in O(K) on the coordinator node.");
      }, 700);
    } else if (action === "edge") {
      this.appendMessage("candidate", "Let's check the edge cases: arrays with length 2, flat arrays with all identical heights, strictly increasing staircase, and all zeroes.");
      setTimeout(() => {
        this.appendMessage("interviewer", "Spot on! An array with all zeroes yields an area of 0, and length 2 computes in exactly 1 comparison. Your code should cleanly handle these without special branch hacks.");
      }, 700);
    }
  }

  generateInterviewerResponse(userText) {
    const text = userText.toLowerCase();

    if (text.includes("two pointer") || text.includes("pointer") || text.includes("left") && text.includes("right")) {
      this.appendMessage("interviewer", "Spot-on! Two-Pointers is the gold standard approach here. It gives us O(N) linear time and O(1) auxiliary space. Go ahead and start drafting the code in the Code Studio.");
    } else if (text.includes("time complexity") || text.includes("big o") || text.includes("o(n)")) {
      this.appendMessage("interviewer", "Correct. The time complexity is strictly O(N) because each iteration decrements the distance between the two pointers by 1, meaning we evaluate at most N-1 states. Space complexity is O(1) since we only allocate two scalar index registers.");
    } else if (text.includes("hint") || text.includes("help") || text.includes("stuck")) {
      this.provideHint();
    } else {
      this.appendMessage("interviewer", `I see your point regarding "${userText.slice(0, 40)}...". How does that impact our invariant as the width shrinks on every iteration?`);
    }
  }

  provideHint() {
    this.appendMessage("interviewer", "💡 <strong>Interviewer Hint:</strong> Notice that the area is strictly constrained by the *shorter* wall: <code>area = width * min(h1, h2)</code>. If you move the taller wall inward, the width *decreases* while the height ceiling *cannot increase*. Hence, only moving the shorter wall offers any mathematical opportunity for a larger area.");
  }

  onCodeRunPassed() {
    setTimeout(() => {
      this.appendMessage("interviewer", "👏 Nice work! All standard test cases passed. Before you submit, double check the boundary conditions: what if <code>height = [0, 0]</code> or <code>height = [1, 1000, 1000, 1]</code>?");
    }, 500);
  }

  onCodeSubmitted() {
    setTimeout(() => {
      this.appendMessage("interviewer", "🎉 <strong>Official Evaluation: STRONG HIRE (Level 6)</strong><br>• Optimal O(N) Time Complexity<br>• Zero-Allocation O(1) Space Complexity<br>• Clear modular coding style<br>• Candidate demonstrated rigorous mathematical proof and communicated trade-offs effectively.");
    }, 600);
  }
}

window.FAANGInterviewer = FAANGInterviewer;
