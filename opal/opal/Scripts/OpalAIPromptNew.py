import os
import json
import re
import time
from datetime import date
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
)

ALLOWED_TYPES = {"school", "work", "personal", "other"}


def get_user_tasks() -> list[str]:
    tasks = input("Enter tasks separated by commas: ").strip()
    return [t.strip() for t in tasks.split(",") if t.strip()]


def build_prompt(task_list: list[str], today: str) -> str:
    return f"""
You are given this exact Python list of task titles:

{json.dumps(task_list, indent=2)}

Return ONLY a valid JSON array.
Do not use markdown.
Do not use triple backticks.
Do not add explanations.
Do not invent tasks.
Do not omit tasks.
Use exactly the task titles provided.

For each task, return an object with ONLY these keys:
- title: exact task title from the input
- cognitive_load: integer 1-5
- priority: integer 1-5
- type: one of ["school", "work", "personal", "other"]

Rules:
1. Every input task must appear exactly once.
2. Titles must match the input exactly.
3. cognitive_load must be an integer from 1 to 5.
4. priority must be an integer from 1 to 5.
5. type must be one of the allowed values.
6. Return only the JSON array.
""".strip()


def extract_json(text: str):
    text = text.strip()

    # Remove fenced markdown if present
    text = re.sub(r"^```json\s*", "", text, flags=re.IGNORECASE)
    text = re.sub(r"^```\s*", "", text)
    text = re.sub(r"\s*```$", "", text)

    # Direct parse
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Fallback: first JSON array
    match = re.search(r"\[\s*.*\s*\]", text, re.DOTALL)
    if match:
        return json.loads(match.group(0))

    raise ValueError("No valid JSON array found in model response.")


def validate_model_output(raw_output, task_list: list[str]) -> list[dict]:
    if not isinstance(raw_output, list):
        raise ValueError("Model output is not a JSON array.")

    if len(raw_output) != len(task_list):
        raise ValueError(
            f"Expected {len(task_list)} tasks, got {len(raw_output)}."
        )

    expected_titles = task_list[:]
    seen_titles = []

    validated = []

    for i, item in enumerate(raw_output):
        if not isinstance(item, dict):
            raise ValueError(f"Item at index {i} is not an object.")

        allowed_keys = {"title", "cognitive_load", "priority", "type"}
        extra_keys = set(item.keys()) - allowed_keys
        missing_keys = allowed_keys - set(item.keys())

        if missing_keys:
            raise ValueError(f"Item '{item}' is missing keys: {missing_keys}")
        if extra_keys:
            raise ValueError(f"Item '{item}' has extra keys: {extra_keys}")

        title = item["title"]
        cognitive_load = item["cognitive_load"]
        priority = item["priority"]
        task_type = item["type"]

        if not isinstance(title, str):
            raise ValueError(f"title must be a string: {item}")
        if title not in expected_titles:
            raise ValueError(f"Unexpected title returned: {title}")
        if title in seen_titles:
            raise ValueError(f"Duplicate title returned: {title}")

        if not isinstance(cognitive_load, int) or not (1 <= cognitive_load <= 5):
            raise ValueError(
                f"Invalid cognitive_load for '{title}': {cognitive_load}"
            )

        if not isinstance(priority, int) or not (1 <= priority <= 5):
            raise ValueError(f"Invalid priority for '{title}': {priority}")

        if task_type not in ALLOWED_TYPES:
            raise ValueError(f"Invalid type for '{title}': {task_type}")

        seen_titles.append(title)
        validated.append({
            "title": title,
            "cognitive_load": cognitive_load,
            "priority": priority,
            "type": task_type,
        })

    # Preserve original input order
    validated_sorted = []
    by_title = {item["title"]: item for item in validated}
    for title in task_list:
        validated_sorted.append(by_title[title])

    return validated_sorted


def build_final_tasks(validated_tasks: list[dict], today: str, created_at_ms: int) -> list[dict]:
    final_tasks = []

    for i, item in enumerate(validated_tasks, start=1):
        final_tasks.append({
            "task_id": f"task-{i}",
            "title": item["title"],
            "type": item["type"],
            "date": today,
            "completed": False,
            "created_at": created_at_ms,
            "cognitive_load": item["cognitive_load"],
            "priority": item["priority"],
        })

    return final_tasks


def main():
    task_list = get_user_tasks()

    if not task_list:
        print("No tasks entered.")
        return

    today = date.today().isoformat()
    created_at_ms = int(time.time() * 1000)

    prompt = build_prompt(task_list, today)

    completion = client.chat.completions.create(
        model="arcee-ai/trinity-large-preview:free",
        messages=[{"role": "user", "content": prompt}],
        extra_headers={
            "HTTP-Referer": "http://localhost",
            "X-Title": "OpalLLMTesting",
        },
        temperature=0,
    )

    response_text = completion.choices[0].message.content.strip()

    try:
        raw_output = extract_json(response_text)
        validated_tasks = validate_model_output(raw_output, task_list)
        final_tasks = build_final_tasks(validated_tasks, today, created_at_ms)

        print("\nFinal Task JSON:\n")
        print(json.dumps(final_tasks, indent=2))

    except Exception as e:
        print("\nModel did not return usable valid task data.\n")
        print("Raw model response:\n")
        print(response_text)
        print(f"\nValidation error: {e}")


if __name__ == "__main__":
    main()
