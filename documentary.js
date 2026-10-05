/**
 * FAANGPrep Studio // Algorithmic Architecture Documentary
 * Principal Engineer Invariant Proofs, Hardware Locality, & FAANG Rubrics
 */

class AlgorithmDocumentary {
  constructor(containerId, rubricContainerId) {
    this.container = document.getElementById(containerId);
    this.rubricContainer = document.getElementById(rubricContainerId);
  }

  renderDocumentary(problem) {
    if (!this.container) return;

    const docData = problem.documentary || this.generateDefaultDocumentary(problem);

    this.container.innerHTML = `
      <div class="doc-section-card">
        <h4>📐 1. Mathematical Invariant & Correctness Proof</h4>
        <p>${docData.invariantText}</p>
        <div class="ascii-diagram-box">${docData.invariantDiagram}</div>
      </div>

      <div class="doc-section-card">
        <h4>⚡ 2. Hardware Locality & Cache Hierarchy (L1/L2)</h4>
        <p>${docData.hardwareText}</p>
        <div class="ascii-diagram-box">${docData.hardwareDiagram}</div>
      </div>

      <div class="doc-section-card">
        <h4>⚠️ 3. Real FAANG Candidate Pitfalls (Why Candidates Fail)</h4>
        <p>${docData.pitfallsText}</p>
        <div class="ascii-diagram-box">${docData.pitfallsDiagram}</div>
      </div>

      <div class="doc-section-card">
        <h4>🌐 4. High-Scale Distributed Follow-Up Questions</h4>
        <p>${docData.scaleFollowUpText}</p>
      </div>
    `;

    // Render Rubric
    if (this.rubricContainer) {
      const rubric = problem.rubric || this.generateDefaultRubric(problem);
      this.rubricContainer.innerHTML = `
        <div class="doc-header-card">
          <div class="doc-badge-pill">INTERVIEW SCORING RUBRIC</div>
          <h2>FAANG Principal Engineer Evaluation Guide</h2>
          <p>Candidates are evaluated along 4 standard competencies: Problem Solving, Data Structures, Code Quality, and Communication.</p>
        </div>

        <div class="doc-section-card">
          <h4>🟢 Strong Hire Indicators (Level 5 / Level 6)</h4>
          <ul style="padding-left: 20px; font-size: 12px; color: #cbd5e1; line-height: 1.8;">
            <li>Immediately identifies the O(N) single-pass two-pointer property without prompting.</li>
            <li>Articulates mathematical proof of why shrinking the taller wall cannot yield a larger area.</li>
            <li>Writes zero-allocation, idiomatic code adhering to bounds with no off-by-one errors.</li>
            <li>Anticipates multi-core SIMD vectorization and streaming distributed extensions.</li>
          </ul>
        </div>

        <div class="doc-section-card">
          <h4>🔴 Red Flags / Automatic No-Hire</h4>
          <ul style="padding-left: 20px; font-size: 12px; color: #f87171; line-height: 1.8;">
            <li>Jumps straight into coding an O(N²) nested loop brute-force without clarifying constraints.</li>
            <li>Cannot justify why skipping inner pairs does not miss the global optimal solution.</li>
            <li>Fails on edge cases: <code>height.length < 2</code> or all identical elements.</li>
            <li>Relies on trial-and-error debugging rather than dry-running logic systematically.</li>
          </ul>
        </div>
      `;
    }
  }

  generateDefaultDocumentary(problem) {
    return {
      invariantText: `In the Two-Pointer container paradigm, we establish the invariant: At any step with pointers (L, R), the container volume is bounded by <code>width × min(height[L], height[R])</code>. Because the width strictly decreases by 1 on every step, the only way to obtain a larger area than current is if the minimum height increases. Moving the pointer at the taller bar can only decrease or preserve the width while keeping or lowering the bottleneck, guaranteeing no larger rectangle can be formed with that bar. Therefore, eliminating the shorter bar is provably optimal.`,
      invariantDiagram: `
[Index 0]                                             [Index N-1]
   L ----------------- Current Width (R - L) ----------------- R
   |                                                           |
   +====== (Height L = 1)                       (Height R = 7) =====+
   Area = (R - L) * min(1, 7) = (R - L) * 1
   Rule: Moving R inward decreases width; bottleneck remains <= 1.
         MUST advance L inward to find potential height > 1.
`,
      hardwareText: `Modern CPUs utilize 64-byte cache lines and aggressive branch predictors. Sequential array traversals from both ends exhibit 100% spatial locality for prefetching pipelines. Unlike pointer-heavy trees or hash tables that incur random DRAM pointer-chasing latency (~60-100ns per miss), the two-pointer scan reads contiguous cache lines with 0 cache misses in L1/L2 caches.`,
      hardwareDiagram: `
CPU Core [Registers] ─── L1 Data Cache (32KB, ~1ns) ─── Prefetcher
                             │
                      Contiguous L/R Blocks Loaded
                      [ 1, 8, 6, 2, 5, 4, 8, 3, 7 ]
                      ▲                         ▲
                      L ─── Spatial Hit ─── R
`,
      pitfallsText: `Over 45% of candidates at Google/Meta interviews attempt dynamic programming or monotonic stacks unnecessarily because they confuse "Container With Most Water" with "Trapping Rain Water". The interviewer expects the candidate to recognize that trapped water between all bars is a DP/Stack problem, whereas finding the maximum pair boundary is a pure two-pointer search.`,
      pitfallsDiagram: `
[CONTAINER WATER (Two Pointers)]       vs.    [TRAPPING RAIN WATER (Prefix Max / DP)]
      |                                              |      __
      |________|                                     |__/\_/__|
Find single best (L, R) pair                 Calculate accumulated volume at every index
Time: O(N), Space: O(1)                      Time: O(N), Space: O(1) or O(N)
`,
      scaleFollowUpText: `<b>Scale Extension (100 Billion Points):</b> If the array does not fit into RAM, distribute the data across a cluster. Because the extreme boundaries matter most, sample the top-K boundary heights per worker node, ship boundary envelopes to the coordinator, and run a parallel two-pointer reduction.`
    };
  }

  generateDefaultRubric(problem) {
    return {};
  }
}

window.AlgorithmDocumentary = AlgorithmDocumentary;
