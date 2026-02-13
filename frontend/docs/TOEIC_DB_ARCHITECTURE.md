# Architecture Decision Record: TOEIC Speaking & Writing Database Schema

## Goal

Design a scalable and flexible database schema to store TOEIC Speaking and Writing exam content, starting with Speaking Part 1 and Part 3.

## Context

Standard TOEIC Speaking consists of 5 parts (11 questions total), and Writing consists of 3 parts (8 questions total).

- **Speaking Part 1**: 2 segments of text to read aloud.
- **Speaking Part 3**: 1 situation with 3 related questions.
- Other parts involve images (Part 2), structured data (Part 4), or open prompts (Part 5).

## Decisions

### 1. Centralized Exam Management

We use a `toeic_exams` table to group all parts together. This allows us to track different test sets (e.g. from 'study4') easily.

### 2. Part-Specific Tables (Normalized)

For the initial implementation of Part 1 and Part 3, we use specific tables:

- `speaking_part_1`: Specifically structured for "Read Aloud" items.
- `speaking_part_3`: Specifically structured for "Respond to Questions" items, grouping the situational context with its 3 questions.

**Rationale**: While a single `jsonb` column in a `questions` table would be highly flexible, explicit columns provide clearer database constraints and easier querying for the current known structure of these parts.

### 3. Source Attribution

A `source` field is included in the `toeic_exams` table to allow for different providers (starting with 'study4').

## Proposed Schema

```sql
-- Main exams table
CREATE TABLE toeic_exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    source TEXT NOT NULL DEFAULT 'study4',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Speaking Part 1: Read Aloud
CREATE TABLE speaking_part_1 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID REFERENCES toeic_exams(id) ON DELETE CASCADE,
    segment_number INTEGER NOT NULL CHECK (segment_number IN (1, 2)),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Speaking Part 3: Respond to Questions
CREATE TABLE speaking_part_3 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID REFERENCES toeic_exams(id) ON DELETE CASCADE,
    situation TEXT NOT NULL,
    question_5 TEXT NOT NULL,
    question_6 TEXT NOT NULL,
    question_7 TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);
```

## Future Considerations

- **Part 2**: Will require `image_url` field.
- **Part 4**: Will require `information_context` (text/image) and 3 questions.
- **Part 5**: Simple prompt field.
- **Writing Parts**: Similar structured tables as needed.
