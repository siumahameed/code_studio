import type { Language } from '../types'

export const TEMPLATES: Record<Language, string> = {
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Page</title>
  <style>
    body { font-family: sans-serif; padding: 2rem; background: #f8f9fa; }
    h1 { color: #333; }
  </style>
</head>
<body>
  <h1>Hello World</h1>
  <p>Welcome to CodeStudio!</p>
</body>
</html>`,

  python: `# Welcome to Python!
# Try these examples or write your own code

# --- Example 1: Hello World ---
print("Hello World!")

# --- Example 2: Variables ---
name = "Alice"
age = 15
print(f"My name is {name} and I am {age} years old")

# --- Example 3: Loops ---
for i in range(1, 6):
    print(f"Count: {i}")

# --- Example 4: Lists & Functions ---
numbers = [10, 20, 30, 40, 50]
total = sum(numbers)
average = total / len(numbers)
print(f"Sum: {total}, Average: {average}")

# --- Example 5: Dictionary ---
student = {"name": "Bob", "grade": "A", "age": 16}
print(f"{student['name']} got a {student['grade']}")
`,

  sql: `-- Create a table
CREATE TABLE students (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    grade INTEGER,
    city TEXT
);

-- Insert some data
INSERT INTO students VALUES
    (1, 'Alice', 85, 'New York'),
    (2, 'Bob', 92, 'Los Angeles'),
    (3, 'Charlie', 78, 'Chicago'),
    (4, 'Diana', 95, 'Houston');

-- Query the data
SELECT * FROM students;

-- Try more queries:
-- SELECT * FROM students WHERE grade > 85;
-- SELECT city, COUNT(*) FROM students GROUP BY city;
`,

  c: `#include <stdio.h>

int main() {
    printf("Hello World\\n");
    printf("Welcome to CodeStudio!\\n");
    
    int num = 42;
    printf("The answer is: %d\\n", num);
    
    return 0;
}
`,
}

export function getTemplate(language: Language): string {
  return TEMPLATES[language]
}
