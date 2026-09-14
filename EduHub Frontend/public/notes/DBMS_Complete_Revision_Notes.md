# Database Management Systems (DBMS) Complete Revision Notes
**EduHub MCA Placement Excellence Series — 2026 Edition**
**Author:** Prof. Arvind Sharma (DBMS Lead) & EduHub Faculty

---

## 1. Relational Database Concepts vs NoSQL

### 1.1 ACID Properties (RDBMS)
* **Atomicity**: Either all operations of a transaction execute completely or none do (All-or-Nothing). Managed via write-ahead logging (WAL) and rollback segments.
* **Consistency**: The database must transition from one valid state to another, preserving all schema integrity constraints (foreign keys, uniqueness, check constraints).
* **Isolation**: Concurrent execution of transactions leaves the database in the same state that would have been obtained if transactions were executed serially. Controlled by transaction isolation levels.
* **Durability**: Once a transaction is committed, its updates persist permanently even in the event of system crash, hardware failure, or power outage.

### 1.2 Isolation Levels & Concurrency Anomalies
| Isolation Level | Dirty Read | Non-Repeatable Read | Phantom Read |
| :--- | :---: | :---: | :---: |
| **Read Uncommitted** | Permitted | Permitted | Permitted |
| **Read Committed** | Prevented | Permitted | Permitted |
| **Repeatable Read** | Prevented | Prevented | Permitted |
| **Serializable** | Prevented | Prevented | Prevented |

### 1.3 CAP Theorem & BASE Properties (NoSQL)
In distributed data stores:
- **Consistency**: Every read receives the most recent write or an error.
- **Availability**: Every non-failing node returns a non-error response without guarantee of recent write.
- **Partition Tolerance**: The system continues to operate despite arbitrary network message losses or delays.
*(According to Brewer's theorem, a distributed system can guarantee at most 2 out of 3 simultaneously).*

**BASE Properties:**
- **B**asically **A**vailable: System guarantees availability with potential degraded performance.
- **S**oft State: State may change over time even without external user input due to eventual consistency.
- **E**ventual Consistency: Given no new updates, all replicas eventually converge to the identical value.

---

## 2. Normalization Theory & Decompositions

Normalization minimizes data redundancy and prevents insertion, update, and deletion anomalies.

### 2.1 First Normal Form (1NF)
- Each column must contain atomic (indivisible) values.
- No repeating groups or multi-valued attributes in a single record.

### 2.2 Second Normal Form (2NF)
- Table must be in **1NF**.
- No partial functional dependency: Every non-prime attribute must depend on the **whole candidate key**, not a proper subset of it.
- Relevant only when candidate key is composite.

### 2.3 Third Normal Form (3NF)
- Table must be in **2NF**.
- No transitive dependencies: For every non-trivial functional dependency $X \to Y$, either:
  1. $X$ is a super key, OR
  2. $Y$ is a prime attribute (part of any candidate key).

### 2.4 Boyce-Codd Normal Form (BCNF)
- A stricter version of 3NF.
- For every non-trivial functional dependency $X \to Y$, $X$ **must strictly be a super key**.
- Decomposing to BCNF guarantees lossless-join but may not always preserve functional dependencies.

---

## 3. Storage Structures & Indexing

### 3.1 B-Tree vs B+ Tree
- **B-Tree**: Both internal and leaf nodes store search keys and associated data record pointers.
- **B+ Tree (Used by PostgreSQL, MySQL InnoDB, MongoDB WiredTiger)**:
  - Internal nodes store *only keys* for guiding searches, maximizing branch factor and reducing tree height.
  - All data pointers and actual keys reside in the leaf nodes.
  - Leaf nodes are linked via a doubly linked list, enabling efficient range queries.

### 3.2 Clustered vs Non-Clustered Indexes
- **Clustered Index**: Determines the physical ordering of data rows on disk. A table can possess only **one** clustered index (usually the Primary Key).
- **Non-Clustered Index**: A separate auxiliary structure holding index key values with row pointers (or primary keys) back to the actual data row.

---

## 4. Query Optimization & MongoDB Aggregation

### 4.1 SQL Index Optimization Best Practices
```sql
-- 1. Use composite indexes with Leftmost Prefix matching:
CREATE INDEX idx_student_enrollment ON Enrollments(student_id, course_id, status);

-- 2. Avoid SELECT * in production:
SELECT student_id, completion_percentage FROM Enrollments WHERE student_id = 402;

-- 3. Utilize EXPLAIN ANALYZE to observe disk scans vs index scans:
EXPLAIN ANALYZE SELECT * FROM Users WHERE email = 'student@eduhub.com';
```

### 4.2 MongoDB Aggregation Pipeline
```javascript
db.enrollments.aggregate([
  { $match: { status: "completed" } },
  { $group: {
      _id: "$courseId",
      averageScore: { $avg: "$quizScore" },
      totalGraduates: { $sum: 1 }
    }
  },
  { $sort: { totalGraduates: -1 } },
  { $lookup: {
      from: "courses",
      localField: "_id",
      foreignField: "_id",
      as: "courseDetails"
    }
  },
  { $unwind: "$courseDetails" }
]);
```

---

## 5. High-Yield Interview Q&A for MCA Candidates

**Q1: What is the difference between DELETE, TRUNCATE, and DROP?**
- `DELETE`: DML operation, row-by-row removal, can have `WHERE` clause, logs each row, triggers execute, can be rolled back.
- `TRUNCATE`: DDL operation, deallocates entire data pages, resets identity counter, much faster, cannot have `WHERE` clause.
- `DROP`: DDL operation, removes the entire table structure, indexes, and constraints completely from data dictionary.

**Q2: What is a phantom read?**
- When a transaction queries a range of rows twice and discovers new rows inserted or committed by another concurrent transaction between the two queries. Prevented by Serializable isolation (range locking).

**Q3: How does MongoDB WiredTiger storage engine achieve concurrency?**
- WiredTiger uses document-level (row-level) concurrency control with optimistic concurrency and multi-version concurrency control (MVCC), avoiding table or database level locks for write operations.
