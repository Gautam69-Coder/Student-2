import CodingPractice from '../models/CodingPractice.js';

export const initialPracticeTracks = [
    {
        title: "JavaScript Essentials",
        language: "javascript",
        level: "Beginner",
        description: "Master core JavaScript concepts from basic strings and arrays to recursion, closures, and async logic.",
        status: "active",
        problemList: [
            {
                question: "1. Hello World & Concatenation",
                problemDiscription: "Write a function `greetUser(name)` that returns the string `Hello, <name>! Welcome to coding practice.` If the string is empty, return `Hello, Developer! Welcome to coding practice.`",
                examples: [
                    { input: "greetUser('Alice')", output: "'Hello, Alice! Welcome to coding practice.'" },
                    { input: "greetUser('')", output: "'Hello, Developer! Welcome to coding practice.'" }
                ],
                difficulty: "easy"
            },
            {
                question: "2. Palindrome String Checker",
                problemDiscription: "Write a function `isPalindrome(str)` that checks whether a given string is a palindrome (reads the same backward as forward). Ignore case sensitivity and space.",
                examples: [
                    { input: "isPalindrome('racecar')", output: "true" },
                    { input: "isPalindrome('hello')", output: "false" }
                ],
                difficulty: "easy"
            },
            {
                question: "3. Array Element Sum",
                problemDiscription: "Write a function `sumArray(numbers)` that takes an array of numbers and returns the total sum of all elements.",
                examples: [
                    { input: "sumArray([1, 2, 3, 4, 5])", output: "15" },
                    { input: "sumArray([-1, 1, 0])", output: "0" }
                ],
                difficulty: "easy"
            },
            {
                question: "4. Reverse Words in a Sentence",
                problemDiscription: "Write a function `reverseWords(sentence)` that reverses the order of words in a space-separated sentence string.",
                examples: [
                    { input: "reverseWords('JavaScript is awesome')", output: "'awesome is JavaScript'" },
                    { input: "reverseWords('Code Daily')", output: "'Daily Code'" }
                ],
                difficulty: "easy"
            },
            {
                question: "5. Find Maximum & Minimum in Array",
                problemDiscription: "Write a function `findMinMax(arr)` that returns an object `{ max, min }` containing the largest and smallest numbers in the array.",
                examples: [
                    { input: "findMinMax([10, 4, 25, 2, 8])", output: "{ max: 25, min: 2 }" }
                ],
                difficulty: "easy"
            },
            {
                question: "6. Factorial using Recursion",
                problemDiscription: "Write a recursive function `factorial(n)` that returns the factorial of a positive integer `n`. Return 1 if `n` is 0 or 1.",
                examples: [
                    { input: "factorial(5)", output: "120" },
                    { input: "factorial(0)", output: "1" }
                ],
                difficulty: "medium"
            },
            {
                question: "7. Count Vowels & Consonants",
                problemDiscription: "Write a function `countVowelsAndConsonants(str)` that returns an object `{ vowels, consonants }` counting the number of vowels and consonants in a sentence.",
                examples: [
                    { input: "countVowelsAndConsonants('Hello')", output: "{ vowels: 2, consonants: 3 }" }
                ],
                difficulty: "medium"
            },
            {
                question: "8. Two Sum Problem",
                problemDiscription: "Given an array of numbers `nums` and a `target`, return the indices of the two numbers that add up to `target` in an array `[index1, index2]`.",
                examples: [
                    { input: "twoSum([2, 7, 11, 15], 9)", output: "[0, 1]" }
                ],
                difficulty: "medium"
            },
            {
                question: "9. Flatten Nested Array",
                problemDiscription: "Write a function `flattenArray(arr)` that takes an arbitrarily deeply nested array and returns a flat 1D array.",
                examples: [
                    { input: "flattenArray([1, [2, [3, 4], 5]])", output: "[1, 2, 3, 4, 5]" }
                ],
                difficulty: "hard"
            },
            {
                question: "10. Debounce Function Logic",
                problemDiscription: "Implement a basic `debounce(fn, delay)` function in JavaScript that delays invoking `fn` until after `delay` milliseconds have elapsed since the last time it was invoked.",
                examples: [
                    { input: "const debounced = debounce(logMsg, 300); debounced('test');", output: "'Executing logMsg after 300ms'" }
                ],
                difficulty: "hard"
            }
        ]
    },
    {
        title: "Python Programming",
        language: "python",
        level: "Beginner",
        description: "Practice Python syntax, data types, list comprehensions, strings, and core problem solving.",
        status: "active",
        problemList: [
            {
                question: "1. Odd or Even Check",
                problemDiscription: "Write a Python function `check_even_odd(n)` that returns `'Even'` if the integer `n` is even and `'Odd'` if `n` is odd.",
                examples: [
                    { input: "check_even_odd(7)", output: "'Odd'" },
                    { input: "check_even_odd(12)", output: "'Even'" }
                ],
                difficulty: "easy"
            },
            {
                question: "2. List Reversal",
                problemDiscription: "Write a function `reverse_list(lst)` that returns a new list with elements in reverse order without using the built-in `reverse()` method.",
                examples: [
                    { input: "reverse_list([1, 2, 3, 4])", output: "[4, 3, 2, 1]" }
                ],
                difficulty: "easy"
            },
            {
                question: "3. Fibonacci Sequence Generator",
                problemDiscription: "Write a function `generate_fibonacci(n)` that returns a list containing the first `n` numbers of the Fibonacci sequence starting with `0, 1`.",
                examples: [
                    { input: "generate_fibonacci(6)", output: "[0, 1, 1, 2, 3, 5]" }
                ],
                difficulty: "easy"
            },
            {
                question: "4. Anagram Check",
                problemDiscription: "Write a function `is_anagram(s1, s2)` that returns `True` if two strings `s1` and `s2` are anagrams of each other, and `False` otherwise.",
                examples: [
                    { input: "is_anagram('listen', 'silent')", output: "True" },
                    { input: "is_anagram('python', 'typhons')", output: "False" }
                ],
                difficulty: "easy"
            },
            {
                question: "5. Prime Number Identifier",
                problemDiscription: "Write a function `is_prime(n)` that checks if a positive integer `n` is a prime number.",
                examples: [
                    { input: "is_prime(17)", output: "True" },
                    { input: "is_prime(15)", output: "False" }
                ],
                difficulty: "easy"
            },
            {
                question: "6. Dictionary Character Frequency Counter",
                problemDiscription: "Write a function `char_frequency(text)` that returns a dictionary mapping each character in `text` to its frequency.",
                examples: [
                    { input: "char_frequency('banana')", output: "{'b': 1, 'a': 3, 'n': 2}" }
                ],
                difficulty: "medium"
            },
            {
                question: "7. Matrix Transpose",
                problemDiscription: "Write a function `transpose_matrix(matrix)` that takes a 2D matrix (list of lists) and returns its transposed matrix.",
                examples: [
                    { input: "transpose_matrix([[1, 2], [3, 4]])", output: "[[1, 3], [2, 4]]" }
                ],
                difficulty: "medium"
            },
            {
                question: "8. Substring Finder Without Built-in",
                problemDiscription: "Write a function `find_substring(text, pattern)` that returns the starting index of `pattern` in `text`, or `-1` if not found.",
                examples: [
                    { input: "find_substring('studenthub', 'hub')", output: "7" }
                ],
                difficulty: "medium"
            },
            {
                question: "9. Longest Common Prefix",
                problemDiscription: "Write a function `longest_common_prefix(strs)` that finds the longest common prefix string among an array of strings.",
                examples: [
                    { input: "longest_common_prefix(['flower','flow','flight'])", output: "'fl'" }
                ],
                difficulty: "hard"
            },
            {
                question: "10. Valid Parentheses Stack",
                problemDiscription: "Write a function `is_valid_parentheses(s)` using a stack that determines if the input string containing `'()[]{}'` is valid.",
                examples: [
                    { input: "is_valid_parentheses('({[]})')", output: "True" },
                    { input: "is_valid_parentheses('([)]')", output: "False" }
                ],
                difficulty: "hard"
            }
        ]
    },
    {
        title: "C++ Mastery",
        language: "cpp",
        level: "Intermediate",
        description: "Learn low-level logic, pointers, arrays, dynamic memory, sorting, and algorithmic thinking in C++.",
        status: "active",
        problemList: [
            {
                question: "1. Print Input & Variables",
                problemDiscription: "Write a C++ program snippet function `printSum(int a, int b)` that prints the sum of `a` and `b` to standard output.",
                examples: [
                    { input: "printSum(12, 8)", output: "20" }
                ],
                difficulty: "easy"
            },
            {
                question: "2. Swap Two Numbers using Pointers",
                problemDiscription: "Write a function `swapNumbers(int* a, int* b)` in C++ that swaps the values of two integers using pointers.",
                examples: [
                    { input: "int x=5, y=10; swapNumbers(&x, &y);", output: "x = 10, y = 5" }
                ],
                difficulty: "easy"
            },
            {
                question: "3. Check Leap Year",
                problemDiscription: "Write a C++ function `isLeapYear(int year)` that returns `true` if `year` is a leap year according to standard Gregorian calendar rules.",
                examples: [
                    { input: "isLeapYear(2024)", output: "true" },
                    { input: "isLeapYear(1900)", output: "false" }
                ],
                difficulty: "easy"
            },
            {
                question: "4. Array Selection Sort",
                problemDiscription: "Implement a function `selectionSort(int arr[], int n)` in C++ that sorts an array of integers in ascending order in-place.",
                examples: [
                    { input: "selectionSort([64, 25, 12, 22, 11], 5)", output: "[11, 12, 22, 25, 64]" }
                ],
                difficulty: "easy"
            },
            {
                question: "5. Find Duplicate Elements",
                problemDiscription: "Write a function `findDuplicates(vector<int>& arr)` that returns a list of all duplicate elements present in the vector.",
                examples: [
                    { input: "findDuplicates([4, 3, 2, 7, 8, 2, 3, 1])", output: "[2, 3]" }
                ],
                difficulty: "easy"
            },
            {
                question: "6. Dynamic Memory Array Sum",
                problemDiscription: "Write a function `dynamicSum(int n)` that dynamically allocates an array of size `n` using `new`, reads elements, computes total sum, and deletes the allocated memory.",
                examples: [
                    { input: "dynamicSum(4) with elements 5, 10, 15, 20", output: "50" }
                ],
                difficulty: "medium"
            },
            {
                question: "7. Binary Search in Sorted Array",
                problemDiscription: "Implement binary search `binarySearch(vector<int>& arr, int target)` in C++ returning the index of `target` or `-1` if not found.",
                examples: [
                    { input: "binarySearch([2, 5, 8, 12, 16, 23, 38], 16)", output: "4" }
                ],
                difficulty: "medium"
            },
            {
                question: "8. Complex Number Addition",
                problemDiscription: "Create a C++ `Complex` struct with `real` and `imag` fields, and write a function `addComplex(Complex c1, Complex c2)` returning the sum.",
                examples: [
                    { input: "c1 = 3 + 2i, c2 = 1 + 7i", output: "4 + 9i" }
                ],
                difficulty: "medium"
            },
            {
                question: "9. Matrix Multiplication",
                problemDiscription: "Write a function `multiplyMatrices(vector<vector<int>>& A, vector<vector<int>>& B)` that calculates the product of two compatible 2D matrices.",
                examples: [
                    { input: "A = [[1, 2], [3, 4]], B = [[2, 0], [1, 2]]", output: "[[4, 4], [10, 8]]" }
                ],
                difficulty: "hard"
            },
            {
                question: "10. Reverse a Singly Linked List",
                problemDiscription: "Write a function `reverseLinkedList(Node* head)` in C++ that reverses a singly linked list iteratively and returns the new head pointer.",
                examples: [
                    { input: "1 -> 2 -> 3 -> 4 -> 5 -> NULL", output: "5 -> 4 -> 3 -> 2 -> 1 -> NULL" }
                ],
                difficulty: "hard"
            }
        ]
    },
    {
        title: "Java Foundation",
        language: "java",
        level: "Beginner",
        description: "Build object-oriented mastery, string manipulation, collection methods, and robust logic in Java.",
        status: "active",
        problemList: [
            {
                question: "1. Basic Arithmetic & Type Casting",
                problemDiscription: "Write a Java method `divideDouble(int a, int b)` that safely casts `a` to double and returns the precise quotient `a / b`.",
                examples: [
                    { input: "divideDouble(7, 2)", output: "3.5" }
                ],
                difficulty: "easy"
            },
            {
                question: "2. String Reverse without Built-in",
                problemDiscription: "Write a method `reverseString(String str)` that reverses a string in Java without using `StringBuilder.reverse()`.",
                examples: [
                    { input: "reverseString('Student')", output: "'tnedutS'" }
                ],
                difficulty: "easy"
            },
            {
                question: "3. Check Armstrong Number",
                problemDiscription: "Write a method `isArmstrong(int n)` in Java that checks if an n-digit number is equal to the sum of its digits raised to the power of n.",
                examples: [
                    { input: "isArmstrong(153)", output: "true" },
                    { input: "isArmstrong(123)", output: "false" }
                ],
                difficulty: "easy"
            },
            {
                question: "4. Second Largest Number in Array",
                problemDiscription: "Write a Java method `findSecondLargest(int[] arr)` that finds the second largest distinct number in an array.",
                examples: [
                    { input: "findSecondLargest([12, 35, 1, 10, 34, 1])", output: "34" }
                ],
                difficulty: "easy"
            },
            {
                question: "5. Count Character Occurrences",
                problemDiscription: "Write a method `countOccurrences(String text, char target)` that returns how many times `target` character appears in `text`.",
                examples: [
                    { input: "countOccurrences('programming', 'g')", output: "2" }
                ],
                difficulty: "easy"
            },
            {
                question: "6. OOP Inheritance & Method Overriding",
                problemDiscription: "Define a parent class `Shape` with method `double area()`, and child classes `Circle` and `Rectangle` overriding `area()`. Calculate total area of array of shapes.",
                examples: [
                    { input: "Circle r=5, Rectangle w=4, h=6", output: "Total Area: 102.54" }
                ],
                difficulty: "medium"
            },
            {
                question: "7. Custom Exception Handling",
                problemDiscription: "Write a Java method `validateAge(int age)` that throws a custom `InvalidAgeException('Underage')` if age is less than 18.",
                examples: [
                    { input: "validateAge(15)", output: "Throws InvalidAgeException: Underage" }
                ],
                difficulty: "medium"
            },
            {
                question: "8. Check Balanced Brackets",
                problemDiscription: "Write a Java method `isBalanced(String expr)` using `Stack<Character>` to verify if expression brackets `() {} []` are matched.",
                examples: [
                    { input: "isBalanced('{ [ ( ) ] }')", output: "true" }
                ],
                difficulty: "medium"
            },
            {
                question: "9. Merge Two Sorted Arrays",
                problemDiscription: "Write a Java method `mergeArrays(int[] arr1, int[] arr2)` that merges two pre-sorted integer arrays into one sorted array in O(n+m) time.",
                examples: [
                    { input: "mergeArrays([1, 3, 5], [2, 4, 6])", output: "[1, 2, 3, 4, 5, 6]" }
                ],
                difficulty: "hard"
            },
            {
                question: "10. LRU Cache Simulator",
                problemDiscription: "Implement a simple `LRUCache(int capacity)` in Java using `LinkedHashMap` supporting `get(key)` and `put(key, value)` with eviction of least recently used item.",
                examples: [
                    { input: "cache.put(1,1); cache.put(2,2); cache.get(1); cache.put(3,3); // evicts 2", output: "get(2) returns -1" }
                ],
                difficulty: "hard"
            }
        ]
    },
    {
        title: "Data Structures & Algorithms",
        language: "dsa",
        level: "Advanced",
        description: "Essential coding interview patterns: Kadane's algorithm, sliding window, binary search, trees, graphs, and DP.",
        status: "active",
        problemList: [
            {
                question: "1. Maximum Subarray Sum (Kadane's)",
                problemDiscription: "Implement Kadane's Algorithm `maxSubArray(int[] nums)` to find the contiguous subarray (containing at least one number) which has the largest sum.",
                examples: [
                    { input: "maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])", output: "6 (Subarray [4, -1, 2, 1])" }
                ],
                difficulty: "medium"
            },
            {
                question: "2. Remove Duplicates from Sorted Array",
                problemDiscription: "Given a sorted array `nums`, remove the duplicates in-place such that each element appears only once and return the new length.",
                examples: [
                    { input: "removeDuplicates([0, 0, 1, 1, 1, 2, 2, 3, 3, 4])", output: "5" }
                ],
                difficulty: "easy"
            },
            {
                question: "3. Maximum Sum Subarray of Size K",
                problemDiscription: "Using the Sliding Window pattern, write a function `maxSumSubarray(int[] arr, int k)` to find the maximum sum of any contiguous subarray of size `k`.",
                examples: [
                    { input: "maxSumSubarray([2, 1, 5, 1, 3, 2], 3)", output: "9 (Subarray [5, 1, 3])" }
                ],
                difficulty: "medium"
            },
            {
                question: "4. Implement Queue using Stacks",
                problemDiscription: "Implement a first-in first-out (FIFO) queue using only two stacks supporting `push`, `pop`, `peek`, and `empty` methods.",
                examples: [
                    { input: "push(1); push(2); peek(); pop(); empty();", output: "peek: 1, pop: 1, empty: false" }
                ],
                difficulty: "medium"
            },
            {
                question: "5. Detect Cycle in Linked List",
                problemDiscription: "Using Floyd's Cycle-Finding Algorithm (Two Pointers - fast & slow pointer), return `true` if a linked list contains a loop.",
                examples: [
                    { input: "head = 3 -> 2 -> 0 -> -4 (pos 1)", output: "true" }
                ],
                difficulty: "medium"
            },
            {
                question: "6. Binary Tree Inorder Traversal",
                problemDiscription: "Given the root of a binary tree, return the inorder traversal of its nodes' values as a list.",
                examples: [
                    { input: "root = [1, null, 2, 3]", output: "[1, 3, 2]" }
                ],
                difficulty: "easy"
            },
            {
                question: "7. Validate Binary Search Tree",
                problemDiscription: "Write a function `isValidBST(TreeNode root)` that checks if a binary tree is a valid Binary Search Tree (BST).",
                examples: [
                    { input: "root = [2, 1, 3]", output: "true" },
                    { input: "root = [5, 1, 4, null, null, 3, 6]", output: "false" }
                ],
                difficulty: "medium"
            },
            {
                question: "8. Graph Breadth First Search (BFS)",
                problemDiscription: "Given an adjacency list representing a graph and a starting node, return the BFS traversal list of vertices.",
                examples: [
                    { input: "graph = {0: [1,2], 1: [2], 2: [0,3], 3: [3]}, start = 2", output: "[2, 0, 3, 1]" }
                ],
                difficulty: "medium"
            },
            {
                question: "9. Coin Change Problem",
                problemDiscription: "Given an array of integer coins representing different denominations and a total amount, calculate the fewest number of coins needed to make up that amount.",
                examples: [
                    { input: "coins = [1, 2, 5], amount = 11", output: "3 (5 + 5 + 1)" }
                ],
                difficulty: "hard"
            },
            {
                question: "10. N-Queens Solution Count",
                problemDiscription: "Write a backtracking function `totalNQueens(int n)` that returns the total number of distinct solutions to place `n` queens on an `n x n` chessboard without attacking each other.",
                examples: [
                    { input: "totalNQueens(4)", output: "2" },
                    { input: "totalNQueens(1)", output: "1" }
                ],
                difficulty: "hard"
            }
        ]
    }
];

export const autoSeedCodingPractices = async () => {
    try {
        console.log("Checking and upserting Coding Practice tracks into MongoDB...");
        let seededCount = 0;

        for (const track of initialPracticeTracks) {
            const existingTrack = await CodingPractice.findOne({
                language: new RegExp(`^${track.language}$`, 'i')
            });

            if (!existingTrack) {
                await CodingPractice.create({
                    ...track,
                    totalProblems: track.problemList.length
                });
                console.log(`+ Seeded new track: ${track.title} (${track.language}) with ${track.problemList.length} questions`);
                seededCount++;
            } else if (!existingTrack.problemList || existingTrack.problemList.length < track.problemList.length) {
                existingTrack.title = track.title;
                existingTrack.description = track.description;
                existingTrack.level = track.level;
                existingTrack.problemList = track.problemList;
                existingTrack.totalProblems = track.problemList.length;
                await existingTrack.save();
                console.log(`^ Updated track: ${track.title} (${track.language}) to ${track.problemList.length} questions`);
                seededCount++;
            }
        }

        console.log(`Auto-seeding complete. Verified 5 tracks (JavaScript, Python, C++, Java, DSA) with 10 problems each.`);
    } catch (error) {
        console.error("Error auto-seeding coding practices:", error.message);
    }
};

