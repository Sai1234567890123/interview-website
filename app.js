/**
 * FAANGPrep Studio // Core Application Orchestrator
 * Curated Problem Catalog, Gemini Chat 3500-Problem Importer, & State Manager
 */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Core Subsystems
  const visualizer = new AlgorithmVisualizer("viz-container", "viz-step-callout");
  const documentary = new AlgorithmDocumentary("doc-body-content", "rubric-body-content");
  const codeStudio = new CodeStudio();
  const interviewer = new FAANGInterviewer();

  window.faangVisualizer = visualizer;
  window.faangDocumentary = documentary;
  window.faangCodeStudio = codeStudio;
  window.faangInterviewer = interviewer;

  // Curated FAANG Benchmark Catalog
  const problemsCatalog = [
    {
      id: "0011",
      title: "Container With Most Water",
      difficulty: "Medium",
      category: "Arrays & Two Pointers",
      companies: ["Google (48 asks)", "Meta (36 asks)", "Amazon (62 asks)"],
      description: `
        <p>You are given an integer array <code>height</code> of length <code>n</code>. There are <code>n</code> vertical lines drawn such that the two endpoints of the <code>i<sup>th</sup></code> line are <code>(i, 0)</code> and <code>(i, height[i])</code>.</p>
        <p>Find two lines that together with the x-axis form a container, such that the container contains the most water.</p>
        <p>Return <em>the maximum amount of water a container can store</em>. Notice that you may not slant the container.</p>
      `,
      defaultArray: [1, 8, 6, 2, 5, 4, 8, 3, 7],
      type: "container-water",
      testcases: [
        { input: "[1, 8, 6, 2, 5, 4, 8, 3, 7]", expected: "49" },
        { input: "[1, 1]", expected: "1" },
        { input: "[4, 3, 2, 1, 4]", expected: "16" }
      ],
      codeTemplates: {
        python: `class Solution:\n    def maxArea(self, height: list[int]) -> int:\n        left, right = 0, len(height) - 1\n        max_water = 0\n        \n        while left < right:\n            width = right - left\n            min_h = min(height[left], height[right])\n            max_water = max(max_water, width * min_h)\n            \n            if height[left] < height[right]:\n                left += 1\n            else:\n                right -= 1\n                \n        return max_water\n`,
        cpp: `#include <vector>\n#include <algorithm>\n\nclass Solution {\npublic:\n    int maxArea(std::vector<int>& height) {\n        int left = 0;\n        int right = height.size() - 1;\n        int max_water = 0;\n        \n        while (left < right) {\n            int width = right - left;\n            int min_h = std::min(height[left], height[right]);\n            max_water = std::max(max_water, width * min_h);\n            \n            if (height[left] < height[right]) {\n                left++;\n            } else {\n                right--;\n            }\n        }\n        return max_water;\n    }\n};\n`,
        java: `class Solution {\n    public int maxArea(int[] height) {\n        int left = 0;\n        int right = height.length - 1;\n        int maxWater = 0;\n        \n        while (left < right) {\n            int width = right - left;\n            int minH = Math.min(height[left], height[right]);\n            maxWater = Math.max(maxWater, width * minH);\n            \n            if (height[left] < height[right]) {\n                left++;\n            } else {\n                right--;\n            }\n        }\n        return maxWater;\n    }\n}\n`,
        javascript: `function maxArea(height) {\n    let left = 0;\n    let right = height.length - 1;\n    let maxWater = 0;\n    \n    while (left < right) {\n        const width = right - left;\n        const minH = Math.min(height[left], height[right]);\n        maxWater = Math.max(maxWater, width * minH);\n        \n        if (height[left] < height[right]) {\n            left++;\n        } else {\n            right--;\n        }\n    }\n    return maxWater;\n}\n`
      }
    },
    {
      id: "0003",
      title: "Longest Substring Without Repeating Characters",
      difficulty: "Medium",
      category: "Sliding Window & Hash Set",
      companies: ["Google (64 asks)", "Meta (52 asks)", "Amazon (80 asks)", "Apple (32 asks)"],
      description: `
        <p>Given a string <code>s</code>, find the length of the <strong>longest substring</strong> without repeating characters.</p>
        <p>Example: <code>s = "abcabcbb"</code> -> Output: <code>3</code> ("abc").</p>
      `,
      defaultArray: ["a", "b", "c", "a", "b", "c", "b", "b"],
      type: "sliding-window",
      testcases: [
        { input: '"abcabcbb"', expected: "3" },
        { input: '"bbbbb"', expected: "1" },
        { input: '"pwwkew"', expected: "3" }
      ],
      codeTemplates: {
        python: `class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        char_map = {}\n        left = 0\n        max_len = 0\n        \n        for right, char in enumerate(s):\n            if char in char_map and char_map[char] >= left:\n                left = char_map[char] + 1\n            char_map[char] = right\n            max_len = max(max_len, right - left + 1)\n            \n        return max_len\n`,
        cpp: `#include <string>\n#include <unordered_map>\n#include <algorithm>\n\nclass Solution {\npublic:\n    int lengthOfLongestSubstring(std::string s) {\n        std::unordered_map<char, int> seen;\n        int left = 0, max_len = 0;\n        for (int right = 0; right < s.length(); ++right) {\n            if (seen.count(s[right]) && seen[s[right]] >= left) {\n                left = seen[s[right]] + 1;\n            }\n            seen[s[right]] = right;\n            max_len = std::max(max_len, right - left + 1);\n        }\n        return max_len;\n    }\n};\n`,
        java: `import java.util.HashMap;\n\nclass Solution {\n    public int lengthOfLongestSubstring(String s) {\n        HashMap<Character, Integer> seen = new HashMap<>();\n        int left = 0, maxLen = 0;\n        for (int right = 0; right < s.length(); right++) {\n            char c = s.charAt(right);\n            if (seen.containsKey(c) && seen.get(c) >= left) {\n                left = seen.get(c) + 1;\n            }\n            seen.put(c, right);\n            maxLen = Math.max(maxLen, right - left + 1);\n        }\n        return maxLen;\n    }\n}\n`,
        javascript: `function lengthOfLongestSubstring(s) {\n    const seen = new Map();\n    let left = 0, maxLen = 0;\n    for (let right = 0; right < s.length; right++) {\n        const c = s[right];\n        if (seen.has(c) && seen.get(c) >= left) {\n            left = seen.get(c) + 1;\n        }\n        seen.set(c, right);\n        maxLen = Math.max(maxLen, right - left + 1);\n    }\n    return maxLen;\n}\n`
      }
    },
    {
      id: "0033",
      title: "Search in Rotated Sorted Array",
      difficulty: "Medium",
      category: "Binary Search",
      companies: ["Meta (72 asks)", "Google (51 asks)", "Netflix (28 asks)"],
      description: `
        <p>There is an integer array <code>nums</code> sorted in ascending order (with distinct values) that is possibly rotated at an unknown pivot index.</p>
        <p>Given array <code>nums</code> and integer <code>target</code>, return <em>the index of target if it is in nums, or -1 if not</em>.</p>
        <p>You must write an algorithm with <strong>O(log n)</strong> runtime complexity.</p>
      `,
      defaultArray: [4, 5, 6, 7, 0, 1, 2],
      target: 0,
      type: "binary-search",
      testcases: [
        { input: "nums = [4,5,6,7,0,1,2], target = 0", expected: "4" },
        { input: "nums = [4,5,6,7,0,1,2], target = 3", expected: "-1" }
      ],
      codeTemplates: {
        python: `class Solution:\n    def search(self, nums: list[int], target: int) -> int:\n        low, high = 0, len(nums) - 1\n        \n        while low <= high:\n            mid = (low + high) // 2\n            if nums[mid] == target:\n                return mid\n            \n            # Check if left half is sorted\n            if nums[low] <= nums[mid]:\n                if nums[low] <= target < nums[mid]:\n                    high = mid - 1\n                else:\n                    low = mid + 1\n            else:\n                # Right half is sorted\n                if nums[mid] < target <= nums[high]:\n                    low = mid + 1\n                else:\n                    high = mid - 1\n                    \n        return -1\n`,
        cpp: `#include <vector>\n\nclass Solution {\npublic:\n    int search(std::vector<int>& nums, int target) {\n        int low = 0, high = nums.size() - 1;\n        while (low <= high) {\n            int mid = low + (high - low) / 2;\n            if (nums[mid] == target) return mid;\n            if (nums[low] <= nums[mid]) {\n                if (nums[low] <= target && target < nums[mid]) high = mid - 1;\n                else low = mid + 1;\n            } else {\n                if (nums[mid] < target && target <= nums[high]) low = mid + 1;\n                else high = mid - 1;\n            }\n        }\n        return -1;\n    }\n};\n`,
        java: `class Solution {\n    public int search(int[] nums, int target) {\n        int low = 0, high = nums.length - 1;\n        while (low <= high) {\n            int mid = low + (high - low) / 2;\n            if (nums[mid] == target) return mid;\n            if (nums[low] <= nums[mid]) {\n                if (nums[low] <= target && target < nums[mid]) high = mid - 1;\n                else low = mid + 1;\n            } else {\n                if (nums[mid] < target && target <= nums[high]) low = mid + 1;\n                else high = mid - 1;\n            }\n        }\n        return -1;\n    }\n}\n`,
        javascript: `function search(nums, target) {\n    let low = 0, high = nums.length - 1;\n    while (low <= high) {\n        const mid = Math.floor((low + high) / 2);\n        if (nums[mid] === target) return mid;\n        if (nums[low] <= nums[mid]) {\n            if (nums[low] <= target && target < nums[mid]) high = mid - 1;\n            else low = mid + 1;\n        } else {\n            if (nums[mid] < target && target <= nums[high]) low = mid + 1;\n            else high = mid - 1;\n        }\n    }\n    return -1;\n}\n`
      }
    }
  ];

  window.problemsCatalog = problemsCatalog;

  // Populate Dropdown
  const problemSelector = document.getElementById("problem-selector");
  function populateProblemSelector() {
    problemSelector.innerHTML = "";
    problemsCatalog.forEach((prob, idx) => {
      const opt = document.createElement("option");
      opt.value = idx;
      opt.textContent = `#${prob.id} - ${prob.title} [${prob.difficulty}]`;
      problemSelector.appendChild(opt);
    });
  }
  populateProblemSelector();

  // Load Active Problem
  function loadProblem(index) {
    const prob = problemsCatalog[index];
    if (!prob) return;
    window.currentProblem = prob;

    // Left pane metadata
    document.getElementById("prob-id-badge").textContent = `#${prob.id}`;
    document.getElementById("prob-title").textContent = prob.title;
    
    const diffBadge = document.getElementById("prob-difficulty-badge");
    diffBadge.textContent = prob.difficulty;
    diffBadge.className = `badge-difficulty ${prob.difficulty.toLowerCase()}`;

    document.getElementById("prob-category-badge").textContent = prob.category;
    document.getElementById("prob-description-text").innerHTML = prob.description;

    const companiesContainer = document.getElementById("prob-companies-container");
    if (companiesContainer) {
      companiesContainer.innerHTML = (prob.companies || ["Google", "Meta", "Amazon"])
        .map(c => `<span class="company-tag">${c}</span>`).join("");
    }

    // Load into visualizer, documentary, and code studio
    visualizer.loadProblemVisualization(prob);
    documentary.renderDocumentary(prob);
    codeStudio.loadProblem(prob);

    // Update custom input box
    const customInputBox = document.getElementById("custom-input-array");
    if (customInputBox) {
      customInputBox.value = JSON.stringify(prob.defaultArray);
    }
  }

  // Bind Problem Switcher
  problemSelector.addEventListener("change", (e) => {
    loadProblem(parseInt(e.target.value, 10));
  });

  // Tab switching in left pane
  const paneTabs = document.querySelectorAll(".pane-tab");
  paneTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      paneTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const targetId = tab.getAttribute("data-target");
      document.querySelectorAll(".pane-body-tab").forEach(p => p.classList.remove("active"));
      const targetEl = document.getElementById(targetId);
      if (targetEl) targetEl.classList.add("active");
    });
  });

  // Company Switcher Bar
  const companyBtns = document.querySelectorAll(".company-btn");
  companyBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      companyBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const companyKey = btn.getAttribute("data-company");
      interviewer.setCompany(companyKey);
    });
  });

  /* -------------------------------------------------------------
     Gemini 3500-Problem Importer Modal
     ------------------------------------------------------------- */
  const modalImporter = document.getElementById("modal-importer");
  const btnOpenImporter = document.getElementById("btn-open-importer");
  const btnCloseImporter = document.getElementById("btn-close-importer");
  const btnCancelImport = document.getElementById("btn-cancel-import");
  const btnConfirmImport = document.getElementById("btn-confirm-import");

  if (btnOpenImporter) {
    btnOpenImporter.addEventListener("click", () => {
      modalImporter.style.display = "flex";
    });
  }

  function closeModal() {
    if (modalImporter) modalImporter.style.display = "none";
  }

  if (btnCloseImporter) btnCloseImporter.addEventListener("click", closeModal);
  if (btnCancelImport) btnCancelImport.addEventListener("click", closeModal);

  if (btnConfirmImport) {
    btnConfirmImport.addEventListener("click", () => {
      const title = document.getElementById("import-title").value.trim() || "Custom Gemini Problem";
      const difficulty = document.getElementById("import-difficulty").value;
      const category = document.getElementById("import-category").value;
      const description = document.getElementById("import-description").value.trim() || "<p>Imported from Gemini chat conversation.</p>";
      const solutionCode = document.getElementById("import-solution").value.trim();
      const visualizerRaw = document.getElementById("import-visualizer-data").value.trim();

      let parsedArray = [1, 3, 5, 7, 9, 11, 13];
      try {
        if (visualizerRaw) {
          const arr = JSON.parse(visualizerRaw);
          if (Array.isArray(arr)) parsedArray = arr;
        }
      } catch (e) {
        // Fallback to default array
      }

      const newId = String(problemsCatalog.length + 1).padStart(4, "0");
      const newProblem = {
        id: newId,
        title,
        difficulty,
        category,
        companies: ["Gemini 3500 Vault", "Google", "Meta"],
        description: `<p>${description.replace(/\n/g, "<br>")}</p>`,
        defaultArray: parsedArray,
        type: category.toLowerCase().includes("window") ? "sliding-window" : "container-water",
        testcases: [
          { input: JSON.stringify(parsedArray), expected: "Optimal Result" }
        ],
        codeTemplates: {
          python: solutionCode || `class Solution:\n    def solve(self, data):\n        # Imported custom solution\n        pass\n`
        }
      };

      problemsCatalog.push(newProblem);
      populateProblemSelector();
      problemSelector.value = problemsCatalog.length - 1;
      loadProblem(problemsCatalog.length - 1);

      closeModal();
      alert(`🎉 Successfully imported "${title}" into the FAANGPrep Studio!`);
    });
  }

  // Load first problem initially
  loadProblem(0);
});
