/**
 * FAANGPrep Studio // Interactive Algorithm Visualizer Engine
 * Supports Two Pointers, Sliding Window, Binary Search, DP Table, Trees & Graphs
 */

class AlgorithmVisualizer {
  constructor(containerId, calloutId) {
    this.container = document.getElementById(containerId);
    this.callout = document.getElementById(calloutId);
    this.phaseEl = document.getElementById("callout-phase");
    this.textEl = document.getElementById("callout-text");
    
    // Playback state
    this.steps = [];
    this.currentStepIdx = 0;
    this.isPlaying = false;
    this.playbackTimer = null;
    this.speedMultiplier = 1.0;
    this.baseDelayMs = 1200;

    // Stat elements
    this.statComparisons = document.getElementById("stat-comparisons");
    this.statSwaps = document.getElementById("stat-swaps");
    this.statStepNum = document.getElementById("stat-step-num");

    // Play/Pause buttons
    this.btnPlay = document.getElementById("btn-viz-play");
    this.iconPlay = document.getElementById("icon-play");
    this.iconPause = document.getElementById("icon-pause");

    this.bindEvents();
  }

  bindEvents() {
    const btnNext = document.getElementById("btn-viz-next");
    const btnPrev = document.getElementById("btn-viz-prev");
    const btnRestart = document.getElementById("btn-viz-restart");
    const speedRange = document.getElementById("viz-speed-range");
    const speedLabel = document.getElementById("speed-label-val");
    const btnApplyInput = document.getElementById("btn-apply-custom-input");

    if (this.btnPlay) {
      this.btnPlay.addEventListener("click", () => this.togglePlay());
    }
    if (btnNext) {
      btnNext.addEventListener("click", () => {
        this.pause();
        this.stepForward();
      });
    }
    if (btnPrev) {
      btnPrev.addEventListener("click", () => {
        this.pause();
        this.stepBackward();
      });
    }
    if (btnRestart) {
      btnRestart.addEventListener("click", () => {
        this.pause();
        this.goToStep(0);
      });
    }
    if (speedRange && speedLabel) {
      speedRange.addEventListener("input", (e) => {
        this.speedMultiplier = parseFloat(e.target.value);
        speedLabel.textContent = `${this.speedMultiplier.toFixed(1)}x`;
        if (this.isPlaying) {
          this.pause();
          this.play();
        }
      });
    }
    if (btnApplyInput) {
      btnApplyInput.addEventListener("click", () => {
        const inputVal = document.getElementById("custom-input-array").value;
        try {
          const parsed = JSON.parse(inputVal);
          if (Array.isArray(parsed) && parsed.length > 0) {
            if (window.currentProblem) {
              window.currentProblem.customInput = parsed;
              this.loadProblemVisualization(window.currentProblem);
            }
          }
        } catch (err) {
          alert("Please enter a valid JSON array, e.g. [1, 8, 6, 2, 5, 4, 8, 3, 7]");
        }
      });
    }

    // Keyboard navigation
    window.addEventListener("keydown", (e) => {
      if (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA") return;
      if (e.code === "Space") {
        e.preventDefault();
        this.togglePlay();
      } else if (e.code === "ArrowRight") {
        this.pause();
        this.stepForward();
      } else if (e.code === "ArrowLeft") {
        this.pause();
        this.stepBackward();
      }
    });
  }

  loadProblemVisualization(problem) {
    this.pause();
    this.currentProblem = problem;
    const arrayData = problem.customInput || problem.defaultArray || [1, 8, 6, 2, 5, 4, 8, 3, 7];
    
    // Generate step sequence depending on algorithm type
    if (problem.category.includes("Two Pointers") || problem.type === "container-water") {
      this.steps = this.generateContainerWaterSteps(arrayData);
    } else if (problem.type === "sliding-window") {
      this.steps = this.generateSlidingWindowSteps(arrayData);
    } else if (problem.type === "binary-search") {
      this.steps = this.generateBinarySearchSteps(arrayData, problem.target || 8);
    } else if (problem.type === "sort-colors") {
      this.steps = this.generateDutchFlagSteps(arrayData);
    } else {
      // Default to general Two Pointers
      this.steps = this.generateContainerWaterSteps(arrayData);
    }

    this.goToStep(0);
  }

  /* -------------------------------------------------------------
     Algorithm Step Generators
     ------------------------------------------------------------- */

  generateContainerWaterSteps(arr) {
    const steps = [];
    let left = 0;
    let right = arr.length - 1;
    let maxArea = 0;
    let comparisons = 0;
    let operations = 0;

    // Step 0: Initial State
    steps.push({
      arr: [...arr],
      left,
      right,
      currentArea: 0,
      maxArea: 0,
      comparisons: 0,
      operations: 0,
      phase: "INITIALIZATION",
      explanation: `Initialize two pointers: Left at index 0 (height ${arr[0]}), Right at index ${right} (height ${arr[right]}). Maximum possible container width is ${right}.`
    });

    while (left < right) {
      comparisons++;
      const hLeft = arr[left];
      const hRight = arr[right];
      const width = right - left;
      const minHeight = Math.min(hLeft, hRight);
      const area = width * minHeight;
      const updatedMax = Math.max(maxArea, area);
      const isNewMax = area > maxArea;
      maxArea = updatedMax;
      operations++;

      steps.push({
        arr: [...arr],
        left,
        right,
        currentArea: area,
        maxArea,
        comparisons,
        operations,
        isNewMax,
        minHeight,
        phase: isNewMax ? "NEW RECORD WATER VOLUME" : "EVALUATING WATER BOUNDARY",
        explanation: `Comparing heights [${hLeft}] and [${hRight}]. Bottleneck is min(${hLeft}, ${hRight}) = ${minHeight}. Area = ${width} × ${minHeight} = ${area} units. ${isNewMax ? "🏆 New Global Maximum Area!" : "Does not exceed current max."}`
      });

      // Pointer decision step
      if (hLeft < hRight) {
        steps.push({
          arr: [...arr],
          left,
          right,
          currentArea: area,
          maxArea,
          comparisons,
          operations,
          phase: "POINTER DECISION",
          explanation: `Left boundary (${hLeft}) is strictly shorter than Right boundary (${hRight}). To find any potentially larger area, we must advance Left pointer to explore taller walls.`
        });
        left++;
      } else {
        steps.push({
          arr: [...arr],
          left,
          right,
          currentArea: area,
          maxArea,
          comparisons,
          operations,
          phase: "POINTER DECISION",
          explanation: `Right boundary (${hRight}) is shorter than or equal to Left (${hLeft}). Advancing Right pointer inward to explore potential taller boundaries.`
        });
        right--;
      }
    }

    // Final Completion Step
    steps.push({
      arr: [...arr],
      left,
      right,
      currentArea: maxArea,
      maxArea,
      comparisons,
      operations,
      phase: "ALGORITHM TERMINATION",
      explanation: `✅ Invariant satisfied! Pointers met at index ${left}. Maximum water area trapped is ${maxArea} in O(N) single-pass without examining redundant inner states.`
    });

    return steps;
  }

  generateSlidingWindowSteps(strOrArr) {
    const arr = Array.isArray(strOrArr) ? strOrArr : strOrArr.split("");
    const steps = [];
    let left = 0;
    let right = 0;
    let seen = new Map();
    let maxLen = 0;
    let comparisons = 0;

    steps.push({
      arr,
      left: 0,
      right: 0,
      window: [],
      comparisons: 0,
      operations: 0,
      phase: "INITIAL WINDOW",
      explanation: `Initialize Sliding Window: Left=0, Right=0. Hash set/map is empty.`
    });

    for (right = 0; right < arr.length; right++) {
      const char = arr[right];
      comparisons++;
      if (seen.has(char) && seen.get(char) >= left) {
        const oldIdx = seen.get(char);
        left = oldIdx + 1;
        steps.push({
          arr,
          left,
          right,
          window: arr.slice(left, right + 1),
          comparisons,
          operations: right,
          phase: "DUPLICATE ENCOUNTERED",
          explanation: `Encountered duplicate '${char}' previously seen at index ${oldIdx}. Shrink/Slide left boundary forward to ${left}.`
        });
      }

      seen.set(char, right);
      const currentLen = right - left + 1;
      maxLen = Math.max(maxLen, currentLen);

      steps.push({
        arr,
        left,
        right,
        window: arr.slice(left, right + 1),
        comparisons,
        operations: right + 1,
        phase: "EXPAND WINDOW",
        explanation: `Added element '${char}' at index ${right}. Current window size is ${currentLen}. Maximum distinct window so far: ${maxLen}.`
      });
    }

    steps.push({
      arr,
      left,
      right: arr.length - 1,
      window: arr.slice(left, arr.length),
      comparisons,
      operations: arr.length,
      phase: "COMPLETED",
      explanation: `✅ Sliding window complete. Longest valid substring length is ${maxLen}. Achieved in optimal O(N) time with O(min(M, N)) auxiliary space.`
    });

    return steps;
  }

  generateBinarySearchSteps(arr, target) {
    const sorted = [...arr].sort((a, b) => a - b);
    const steps = [];
    let low = 0;
    let high = sorted.length - 1;
    let comparisons = 0;

    steps.push({
      arr: sorted,
      left: low,
      right: high,
      mid: Math.floor((low + high) / 2),
      target,
      comparisons: 0,
      operations: 0,
      phase: "SEARCH SPACE INITIALIZATION",
      explanation: `Search space initialized: low=0, high=${high}. Target value to find: ${target}.`
    });

    while (low <= high) {
      comparisons++;
      const mid = Math.floor((low + high) / 2);
      const midVal = sorted[mid];

      steps.push({
        arr: sorted,
        left: low,
        right: high,
        mid,
        target,
        comparisons,
        operations: comparisons,
        phase: "MIDPOINT INSPECTION",
        explanation: `Inspect mid = (${low} + ${high}) / 2 = ${mid}. Element at mid is [${midVal}]. Target is ${target}.`
      });

      if (midVal === target) {
        steps.push({
          arr: sorted,
          left: mid,
          right: mid,
          mid,
          target,
          found: true,
          comparisons,
          operations: comparisons,
          phase: "TARGET DISCOVERED",
          explanation: `🎯 Target ${target} successfully located at index ${mid} in ${comparisons} iterations! Time complexity: O(log N).`
        });
        return steps;
      } else if (midVal < target) {
        steps.push({
          arr: sorted,
          left: low,
          right: high,
          mid,
          target,
          comparisons,
          operations: comparisons,
          phase: "DISCARD LEFT HALF",
          explanation: `${midVal} < ${target}. Since array is sorted, discard left half [${low} .. ${mid}]. Adjust low = ${mid + 1}.`
        });
        low = mid + 1;
      } else {
        steps.push({
          arr: sorted,
          left: low,
          right: high,
          mid,
          target,
          comparisons,
          operations: comparisons,
          phase: "DISCARD RIGHT HALF",
          explanation: `${midVal} > ${target}. Discard right half [${mid} .. ${high}]. Adjust high = ${mid - 1}.`
        });
        high = mid - 1;
      }
    }

    steps.push({
      arr: sorted,
      left: low,
      right: high,
      target,
      found: false,
      comparisons,
      operations: comparisons,
      phase: "ELEMENT NOT FOUND",
      explanation: `Search space exhausted (low > high). Target ${target} is not in the array.`
    });

    return steps;
  }

  /* -------------------------------------------------------------
     Rendering Engine
     ------------------------------------------------------------- */

  renderStep(step) {
    if (!step || !this.container) return;

    this.container.innerHTML = "";
    const arr = step.arr;
    const maxVal = Math.max(...arr.map(v => typeof v === 'number' ? v : 1), 1);

    // Calculate water overlay dimensions for Container Water
    let overlayLeftPct = 0;
    let overlayWidthPct = 0;
    let overlayHeightPx = 0;

    if (step.left !== undefined && step.right !== undefined && step.left < step.right) {
      const leftCol = step.left;
      const rightCol = step.right;
      const totalCols = arr.length;
      overlayLeftPct = (leftCol / totalCols) * 100;
      overlayWidthPct = ((rightCol - leftCol) / totalCols) * 100;
      const minH = Math.min(arr[leftCol], arr[rightCol]);
      overlayHeightPx = (minH / maxVal) * 180;
    }

    arr.forEach((val, idx) => {
      const barWrapper = document.createElement("div");
      barWrapper.className = "viz-array-bar-wrapper";

      const bar = document.createElement("div");
      bar.className = "viz-bar";
      const heightPx = Math.max((Number(val) / maxVal) * 200, 16);
      bar.style.height = `${heightPx}px`;

      // Highlight active pointers
      if (idx === step.left) {
        bar.classList.add("highlight-left");
      }
      if (idx === step.right) {
        bar.classList.add("highlight-right");
      }
      if (idx === step.mid) {
        bar.classList.add("highlight-target");
      }

      // Value label
      const valLabel = document.createElement("span");
      valLabel.className = "viz-bar-val";
      valLabel.textContent = val;

      // Index label
      const idxLabel = document.createElement("span");
      idxLabel.className = "viz-bar-idx";
      idxLabel.textContent = idx;

      bar.appendChild(valLabel);
      barWrapper.appendChild(bar);
      barWrapper.appendChild(idxLabel);

      // Pointer markers
      if (idx === step.left) {
        const ptr = document.createElement("span");
        ptr.className = "viz-pointer-label ptr-left";
        ptr.textContent = step.mid !== undefined ? "LOW" : "L";
        barWrapper.appendChild(ptr);
      }
      if (idx === step.right) {
        const ptr = document.createElement("span");
        ptr.className = "viz-pointer-label ptr-right";
        ptr.textContent = step.mid !== undefined ? "HIGH" : "R";
        barWrapper.appendChild(ptr);
      }
      if (idx === step.mid) {
        const ptr = document.createElement("span");
        ptr.className = "viz-pointer-label ptr-mid";
        ptr.style.background = "#00e676";
        ptr.style.color = "#000";
        ptr.textContent = "MID";
        barWrapper.appendChild(ptr);
      }

      this.container.appendChild(barWrapper);
    });

    // Update explanation callout
    if (this.phaseEl) this.phaseEl.textContent = step.phase || "EXECUTION STEP";
    if (this.textEl) this.textEl.textContent = step.explanation || "";

    // Update stats
    if (this.statComparisons) this.statComparisons.textContent = step.comparisons || 0;
    if (this.statSwaps) this.statSwaps.textContent = step.operations || 0;
    if (this.statStepNum) this.statStepNum.textContent = `${this.currentStepIdx + 1} / ${this.steps.length}`;
  }

  /* -------------------------------------------------------------
     Playback Controls
     ------------------------------------------------------------- */

  goToStep(index) {
    if (index < 0) index = 0;
    if (index >= this.steps.length) index = this.steps.length - 1;
    this.currentStepIdx = index;
    this.renderStep(this.steps[this.currentStepIdx]);
  }

  stepForward() {
    if (this.currentStepIdx < this.steps.length - 1) {
      this.goToStep(this.currentStepIdx + 1);
    } else {
      this.pause();
    }
  }

  stepBackward() {
    if (this.currentStepIdx > 0) {
      this.goToStep(this.currentStepIdx - 1);
    }
  }

  play() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    if (this.iconPlay) this.iconPlay.style.display = "none";
    if (this.iconPause) this.iconPause.style.display = "block";

    if (this.currentStepIdx >= this.steps.length - 1) {
      this.goToStep(0);
    }

    const interval = Math.max(this.baseDelayMs / this.speedMultiplier, 150);
    this.playbackTimer = setInterval(() => {
      if (this.currentStepIdx < this.steps.length - 1) {
        this.stepForward();
      } else {
        this.pause();
      }
    }, interval);
  }

  pause() {
    this.isPlaying = false;
    if (this.iconPlay) this.iconPlay.style.display = "block";
    if (this.iconPause) this.iconPause.style.display = "none";
    if (this.playbackTimer) {
      clearInterval(this.playbackTimer);
      this.playbackTimer = null;
    }
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }
}

window.AlgorithmVisualizer = AlgorithmVisualizer;
