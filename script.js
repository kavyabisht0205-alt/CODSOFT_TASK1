const questionBank = {
    Python: {
        1: [
            { q: "What will be the output of the following list operation?", snippet: "nums = [10, 20, 30, 40]\nprint(nums[-1])", options: ["10", "30", "40", "IndexError"], correct: 2, topic: "List Indexing & Negative Slicing", explanation: "In Python, negative indexing starts from the end of the list. Index -1 references the last element (40)." }
        ],
        2: [
            { q: "What is the data type of the immutable collection created below?", snippet: "data = (10, [20, 30], 40)", options: ["Tuple (fully immutable)", "Tuple with a mutable list element", "List", "Dictionary"], correct: 1, topic: "Tuples vs Lists Mutability", explanation: "While the tuple itself cannot have its structure modified, it holds reference to a list object which is mutable." }
        ],
        3: [
            { q: "What does the following generator expression output when evaluated?", snippet: "gen = (x**2 for x in range(3))\nprint(next(gen), next(gen))", options: ["0 1", "1 4", "0 4", "Error"], correct: 0, topic: "Generators & Iterators", explanation: "range(3) yields 0, 1, 2. Squaring them yields 0, 1, 4. Calling next(gen) twice returns 0 and then 1." }
        ],
        4: [
            { q: "How do decorators modify function execution in Python?", snippet: "@my_decorator\ndef target():\n    pass", options: ["By replacing function at compile-time", "By wrapping function to extend behavior", "By compiling to C", "By threading"], correct: 1, topic: "Decorators", explanation: "Decorators take a function object, wrap custom logic around it, and return the enhanced wrapper function." }
        ],
        5: [
            { q: "How does Python handle memory for circular references?", snippet: "# Objects referencing each other", options: ["Reference counting alone", "Generational garbage collection (gc module)", "Manual pointer free", "Kernel panic"], correct: 1, topic: "Garbage Collection", explanation: "Reference counting alone cannot clear circular references, so Python utilizes a generational cyclic garbage collector." }
        ]
    },
    CPP: {
        1: [
            { q: "What is the output of this pointer dereference code?", snippet: "int x = 15;\nint *p = &x;\n*p = 25;\nstd::cout << x;", options: ["15", "25", "Memory Address", "Compiler Error"], correct: 1, topic: "Pointers & Dereferencing", explanation: "Dereferencing pointer p (*p = 25) modifies the actual memory location of x, changing its value to 25." }
        ],
        2: [
            { q: "Which STL container guarantees O(1) random access?", snippet: "// Constant time index lookup", options: ["std::list", "std::vector", "std::map", "std::set"], correct: 1, topic: "STL Containers", explanation: "std::vector stores elements in contiguous memory blocks, enabling direct O(1) element access via indexing." }
        ],
        3: [
            { q: "What purpose does the 'virtual' keyword serve?", snippet: "class Base {\n    virtual void show();\n};", options: ["Speed up compilation", "Enables runtime dynamic polymorphism", "Makes variables constant", "Allocates heap space"], correct: 1, topic: "Polymorphism", explanation: "The virtual keyword creates a vtable entry, ensuring overridden functions call the derived object's method at runtime." }
        ],
        4: [
            { q: "What problem does std::move solve?", snippet: "vector<int> v2 = std::move(v1);", options: ["Deep copying", "Enabling move semantics to avoid copying", "Sorting pointers", "Threading"], correct: 1, topic: "Move Semantics", explanation: "std::move casts an lvalue to an rvalue reference, transferring resource ownership without expensive deep copying." }
        ],
        5: [
            { q: "What is SFINAE in template metaprogramming?", snippet: "// Substitution Failure Is Not An Error", options: ["Runtime exception", "Template resolution rule", "Memory alignment", "Destructor rule"], correct: 1, topic: "Templates & SFINAE", explanation: "SFINAE ensures that invalid template parameter substitutions result in a clean overload exclusion rather than a compiler error." }
        ]
    },
    Java: {
        1: [
            { q: "What will this string comparison evaluate to?", snippet: "String s1 = \"Hello\";\nString s2 = new String(\"Hello\");\nSystem.out.println(s1 == s2);", options: ["true", "false", "Compilation Error", "NullPointerException"], correct: 1, topic: "String Reference Equality", explanation: "The '==' operator compares object memory references. s1 points to the string pool while s2 points to a heap object." }
        ],
        2: [
            { q: "Which OOP concept is exhibited by method overloading?", snippet: "void print(int x);\nvoid print(String s);", options: ["Run-time polymorphism", "Compile-time polymorphism", "Encapsulation", "Inheritance"], correct: 1, topic: "Polymorphism", explanation: "Method overloading is resolved at compile time based on method signatures (argument types and counts)." }
        ],
        3: [
            { q: "Which collection maintains natural sorting order?", snippet: "HashSet vs TreeSet vs ArrayList", options: ["HashSet", "ArrayList", "TreeSet", "HashMap"], correct: 2, topic: "Java Collections", explanation: "TreeSet implements SortedSet, organizing elements according to their natural sorting order or a custom Comparator." }
        ],
        4: [
            { q: "What distinguishes Callable from Runnable?", snippet: "Runnable run(); vs Callable call();", options: ["Callable returns a result and throws checked exception", "Runnable is faster", "Callable is single-core only", "No difference"], correct: 0, topic: "Concurrency", explanation: "Unlike Runnable, Callable can return generic result futures and throw checked exceptions back to the caller thread." }
        ],
        5: [
            { q: "How does 'volatile' affect CPU cache consistency?", snippet: "private volatile int flag = 0;", options: ["Forces reads/writes directly to main memory", "Locks thread execution", "Compresses size", "Disables GC"], correct: 0, topic: "Memory Consistency", explanation: "The volatile modifier prevents thread-local caching of variables, forcing all reads and writes straight to main RAM." }
        ]
    }
};

let currentLang = 'Python';
let currentRound = 1;
let currentScore = 0;
let wrongAnswersLog = [];
let activeQuestion = null;

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.nav-links a').forEach(el => el.classList.remove('active'));

    document.getElementById(`tab-${tabId}`).classList.remove('hidden');
    if(document.getElementById(`nav-${tabId}`)) {
        document.getElementById(`nav-${tabId}`).classList.add('active');
    }
}

function startQuiz(lang) {
    currentLang = lang;
    currentRound = 1;
    currentScore = 0;
    wrongAnswersLog = [];
    document.getElementById('langBadge').innerText = lang;
    switchTab('quiz');
    loadRoundQuestion();
}

function loadRoundQuestion() {
    const pool = questionBank[currentLang][currentRound] || questionBank[currentLang][1];
    activeQuestion = pool[Math.floor(Math.random() * pool.length)];

    document.getElementById('roundBadge').innerText = `Round ${currentRound} / 5 (Level: ${getDifficultyName(currentRound)})`;
    document.getElementById('currentScore').innerText = currentScore;
    document.getElementById('progressBar').style.width = `${(currentRound / 5) * 100}%`;
    document.getElementById('questionText').innerText = activeQuestion.q;

    const snippetBox = document.getElementById('snippetContainer');
    if (activeQuestion.snippet) {
        document.getElementById('snippetCode').innerText = activeQuestion.snippet;
        snippetBox.classList.remove('hidden');
    } else {
        snippetBox.classList.add('hidden');
    }

    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';

    activeQuestion.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;
        btn.onclick = () => selectOption(index, btn);
        optionsContainer.appendChild(btn);
    });

    document.getElementById('nextBtn').classList.add('hidden');
}

function getDifficultyName(round) {
    if (round === 1) return 'Easy';
    if (round === 2) return 'Beginner';
    if (round === 3) return 'Intermediate';
    if (round === 4) return 'Advanced';
    return 'Expert';
}

function selectOption(selectedIndex, buttonElement) {
    const allBtns = document.querySelectorAll('.option-btn');
    allBtns.forEach(btn => btn.disabled = true);

    if (selectedIndex === activeQuestion.correct) {
        buttonElement.classList.add('correct');
        currentScore += 20;
    } else {
        buttonElement.classList.add('incorrect');
        allBtns[activeQuestion.correct].classList.add('correct');
        wrongAnswersLog.push({
            question: activeQuestion.q,
            snippet: activeQuestion.snippet,
            userChoice: activeQuestion.options[selectedIndex],
            correctChoice: activeQuestion.options[activeQuestion.correct],
            explanation: activeQuestion.explanation,
            topic: activeQuestion.topic
        });
    }

    document.getElementById('currentScore').innerText = currentScore;
    document.getElementById('nextBtn').classList.remove('hidden');
}

function nextQuestion() {
    currentRound++;
    if (currentRound <= 5) {
        loadRoundQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    document.getElementById('tab-quiz').classList.add('hidden');
    document.getElementById('tab-result').classList.remove('hidden');
    document.getElementById('finalScoreNum').innerText = `${currentScore}/100`;

    const titleEl = document.getElementById('performanceTitle');
    const subEl = document.getElementById('performanceSub');
    const missedContainer = document.getElementById('missedQuestionsContainer');
    missedContainer.innerHTML = '';

    if (currentScore >= 80) {
        titleEl.innerText = "🌟 Excellent Mastery!";
        subEl.innerText = "Successfully cleared all adaptive difficulty tiers.";
    } else {
        titleEl.innerText = "📚 Foundation Building Needed";
        subEl.innerText = "Review your incorrect snippets below to master the core logic.";
    }

    if (wrongAnswersLog.length > 0) {
        wrongAnswersLog.forEach((item, index) => {
            const div = document.createElement('div');
            div.style.background = '#ffffff';
            div.style.border = '1px solid var(--border-color)';
            div.style.padding = '1.25rem';
            div.style.borderRadius = '8px';
            div.style.marginBottom = '1rem';
            div.style.textAlign = 'left';

            div.innerHTML = `
                <span class="tag" style="margin-bottom:0.5rem; display:inline-block;">Topic: ${item.topic}</span>
                <p style="font-weight:600; margin-bottom:0.5rem;">${index + 1}. ${item.question}</p>
                ${item.snippet ? `<div class="snippet-box" style="margin:0.5rem 0;"><pre><code>${item.snippet}</code></pre></div>` : ''}
                <p style="font-size:0.9rem; color:var(--error); margin-bottom:0.25rem;">❌ Your Answer: <strong>${item.userChoice}</strong></p>
                <p style="font-size:0.9rem; color:var(--success); margin-bottom:0.5rem;">✔ Correct Answer: <strong>${item.correctChoice}</strong></p>
                <p style="font-size:0.9rem; color:var(--text-muted); line-height:1.5;"><strong>Explanation:</strong> ${item.explanation}</p>
            `;
            missedContainer.appendChild(div);
        });
    } else {
        missedContainer.innerHTML = `<p style="color: var(--success); font-weight:600;">🎉 Flawless performance! You answered every adaptive round correctly with zero mistakes.</p>`;
    }
}

// Exercise Modal Data Mapping
const exerciseData = {
    "py-ex-1": {
        title: "1. Dictionary Value Grouping",
        tag: "Python",
        desc: "Merge two dictionaries. If they share a key, store a list combining values from both dictionaries instead of overwriting.",
        code: "def merge_dicts(d1, d2):\n    result = {k: [v] if not isinstance(v, list) else v for k, v in d1.items()}\n    for k, v in d2.items():\n        if k in result:\n            result[k].append(v)\n        else:\n            result[k] = [v]\n    return result"
    },
    "py-ex-2": {
        title: "2. Flatten Nested Lists",
        tag: "Python",
        desc: "Write a recursive function to unpack arbitrarily nested lists into a single flat sequence.",
        code: "def flatten(nested):\n    flat_list = []\n    for item in nested:\n        if isinstance(item, list):\n            flat_list.extend(flatten(item))\n        else:\n            flat_list.append(item)\n    return flat_list"
    },
    "py-ex-3": {
        title: "3. Custom Stack Class",
        tag: "Python",
        desc: "Implement a LIFO Stack using Python lists with push, pop, and peek methods.",
        code: "class Stack:\n    def __init__(self):\n        self.items = []\n    def push(self, item): self.items.append(item)\n    def pop(self): return self.items.pop() if self.items else None\n    def peek(self): return self.items[-1] if self.items else None"
    },
    "cpp-ex-1": {
        title: "1. Two Sum Using Hash Map",
        tag: "C++ / DSA",
        desc: "Find indices of two numbers in an array that add up to a specific target in O(N) time using an unordered_map.",
        code: "vector<int> twoSum(vector<int>& nums, int target) {\n    unordered_map<int, int> mp;\n    for(int i = 0; i < nums.size(); i++) {\n        int comp = target - nums[i];\n        if(mp.count(comp)) return {mp[comp], i};\n        mp[nums[i]] = i;\n    }\n    return {};\n}"
    },
    "cpp-ex-2": {
        title: "2. Matrix Clockwise Rotation",
        tag: "C++ / DSA",
        desc: "Rotate the elements of a 2D square matrix by 90 degrees clockwise in-place.",
        code: "void rotateMatrix(vector<vector<int>>& matrix) {\n    int n = matrix.size();\n    for(int i=0; i<n; i++) {\n        for(int j=i; j<n; j++) swap(matrix[i][j], matrix[j][i]);\n    }\n    for(int i=0; i<n; i++) reverse(matrix[i].begin(), matrix[i].end());\n}"
    },
    "cpp-ex-3": {
        title: "3. Custom Dynamic Vector Class",
        tag: "C++ / DSA",
        desc: "Create a custom templated vector container supporting dynamic resizing and push_back.",
        code: "template <typename T>\nclass SimpleVector {\n    T* arr; int cap, sz;\npublic:\n    SimpleVector() : cap(1), sz(0) { arr = new T[cap]; }\n    void push_back(T val) {\n        if(sz == cap) { cap *= 2; T* temp = new T[cap]; for(int i=0; i<sz; i++) temp[i]=arr[i]; delete[] arr; arr=temp; }\n        arr[sz++] = val;\n    }\n};"
    },
    "java-ex-1": {
        title: "1. Person & Constructor Setup",
        tag: "Java",
        desc: "Create a Person class with name and age attributes, parameterized constructors, and display methods.",
        code: "class Person {\n    String name; int age;\n    public Person(String name, int age) { this.name = name; this.age = age; }\n    public void display() { System.out.println(name + \" is \" + age + \" years old.\"); }\n}"
    },
    "java-ex-2": {
        title: "2. Bank Account & Transaction System",
        tag: "Java",
        desc: "Build Account and Bank classes to manage deposits, withdrawals, and balance tracking securely.",
        code: "class Account {\n    private double balance;\n    public void deposit(double amt) { if(amt > 0) balance += amt; }\n    public void withdraw(double amt) { if(amt <= balance) balance -= amt; }\n    public double getBalance() { return balance; }\n}"
    },
    "java-ex-3": {
        title: "3. Shape Hierarchy with Abstract Classes",
        tag: "Java",
        desc: "Implement an abstract Shape class with subclasses for Rectangle and Circle calculating area.",
        code: "abstract class Shape {\n    abstract double calculateArea();\n}\nclass Circle extends Shape {\n    double r;\n    Circle(double r) { this.r = r; }\n    double calculateArea() { return Math.PI * r * r; }\n}"
    }
};

// Event Listeners for Opening Exercise Modals safely
document.addEventListener('DOMContentLoaded', () => {
    Object.keys(exerciseData).forEach(id => {
        const card = document.getElementById(id);
        if(card) {
            card.onclick = () => {
                const data = exerciseData[id];
                document.getElementById('modalTitle').innerText = data.title;
                document.getElementById('modalTag').innerText = data.tag;
                document.getElementById('modalDesc').innerText = data.desc;
                document.getElementById('modalCode').innerText = data.code;
                document.getElementById('exerciseModal').classList.remove('hidden');
            };
        }
    });
});

function closeModal() {
    document.getElementById('exerciseModal').classList.add('hidden');
}