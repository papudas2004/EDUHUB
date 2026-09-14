# Data Structures & Algorithms Cheat Sheet (Java & Python)
**EduHub MCA Placement Excellence Series — 2026 Edition**
**Author:** Aman Verma (Competitive Programmer, Ex-FAANG) & EduHub Faculty

---

## 1. Asymptotic Complexity Reference Matrix

| Data Structure | Access | Search | Insertion | Deletion | Space Complexity |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Array** | $O(1)$ | $O(N)$ | $O(N)$ | $O(N)$ | $O(N)$ |
| **Singly Linked List** | $O(N)$ | $O(N)$ | $O(1)$ | $O(1)$ (with ref) | $O(N)$ |
| **Stack / Queue** | $O(N)$ | $O(N)$ | $O(1)$ | $O(1)$ | $O(N)$ |
| **Hash Table** | N/A | $O(1)$ avg | $O(1)$ avg | $O(1)$ avg | $O(N)$ |
| **Binary Search Tree** | $O(\log N)$ avg | $O(\log N)$ avg | $O(\log N)$ avg | $O(\log N)$ avg | $O(N)$ |
| **Red-Black / AVL Tree** | $O(\log N)$ worst | $O(\log N)$ worst | $O(\log N)$ worst | $O(\log N)$ worst | $O(N)$ |
| **Binary Min/Max Heap** | $O(1)$ (peek) | $O(N)$ | $O(\log N)$ | $O(\log N)$ (pop) | $O(N)$ |

---

## 2. Core Algorithmic Patterns & Templates

### 2.1 Sliding Window Pattern (Variable Size)
Used for substring problems with constraint checks (e.g., Longest Substring Without Repeating Characters).

**Java Template:**
```java
public int lengthOfLongestSubstring(String s) {
    Map<Character, Integer> lastSeen = new HashMap<>();
    int maxLen = 0, left = 0;
    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        if (lastSeen.containsKey(c)) {
            left = Math.max(left, lastSeen.get(c) + 1);
        }
        lastSeen.put(c, right);
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}
```

**Python Template:**
```python
def length_of_longest_substring(s: str) -> int:
    char_map = {}
    left = max_len = 0
    for right, ch in enumerate(s):
        if ch in char_map and char_map[ch] >= left:
            left = char_map[ch] + 1
        char_map[ch] = right
        max_len = max(max_len, right - left + 1)
    return max_len
```

### 2.2 Fast & Slow Pointers (Floyd's Cycle Detection)
Detect cycles in linked lists or number sequences in $O(N)$ time and $O(1)$ space.

```python
def has_cycle(head: ListNode) -> bool:
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False
```

### 2.3 Binary Search (Rotated Sorted Array)
```java
public int searchRotated(int[] nums, int target) {
    int low = 0, high = nums.length - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (nums[mid] == target) return mid;
        
        // Left half is sorted
        if (nums[low] <= nums[mid]) {
            if (nums[low] <= target && target < nums[mid]) {
                high = mid - 1;
            } else {
                low = mid + 1;
            }
        } 
        // Right half is sorted
        else {
            if (nums[mid] < target && target <= nums[high]) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
    }
    return -1;
}
```

### 2.4 Dynamic Programming: 0/1 Knapsack Framework
```python
def knap_sack(W: int, wt: list, val: list, n: int) -> int:
    dp = [0] * (W + 1)
    for i in range(n):
        for w in range(W, wt[i] - 1, -1):
            dp[w] = max(dp[w], val[i] + dp[w - wt[i]])
    return dp[W]
```

### 2.5 Graph Traversal: BFS for Shortest Path in Unweighted Graph
```python
from collections import deque

def shortest_path_bfs(graph, start_node, target_node):
    queue = deque([(start_node, 0)])
    visited = {start_node}
    while queue:
        current, dist = queue.popleft()
        if current == target_node:
            return dist
        for neighbor in graph.get(current, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, dist + 1))
    return -1
```

---

## 3. High-Priority Top 25 LeetCode Interview Problems

1. **Two Sum** (Hash Map - $O(N)$)
2. **Longest Consecutive Sequence** (Hash Set - $O(N)$)
3. **Trapping Rain Water** (Two Pointers - $O(N)$ time, $O(1)$ space)
4. **LRU Cache** (HashMap + Doubly Linked List)
5. **Merge Intervals** (Sorting - $O(N \log N)$)
6. **Top K Frequent Elements** (Min-Heap or QuickSelect - $O(N \log K)$)
7. **Course Schedule (Cycle in Directed Graph)** (Kahn's Topological Sort)
8. **Word Break** (DP with Trie / Hash Set)
9. **Coin Change** (Unbounded Knapsack DP)
10. **Lowest Common Ancestor in Binary Tree** (Recursive Post-Order)
