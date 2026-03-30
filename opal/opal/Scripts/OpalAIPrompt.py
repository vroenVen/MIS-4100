import os
import json
import re
import time
from datetime import date
from dotenv import load_dotenv
from openai import OpenAI


from ..models import Task
from ..serializers import TaskSerializer

def prompt(TaskSerializer):
    print(TaskSerializer.data)

    dotenv_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..','..','..', '.env'))

    load_dotenv()

    client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=os.getenv("OPENROUTER_API_KEY"),
    )

    # tasks = input("Enter tasks separated by commas: ").strip()
    # task_list = [t.strip() for t in tasks.split(",") if t.strip()]

    task_list = TaskSerializer.data
    today = date.today().isoformat()
    current_timestamp_ms = int(time.time() * 1000)

    

    prompt = f"""
    You are given this exact Python list of task titles:

    {json.dumps(task_list, indent=2)}

    Return ONLY a valid JSON array.
    Do not use markdown.
    Do not use triple backticks.
    Do not add explanations.
    Do not invent tasks.
    Use exactly the task titles provided.

    For each task, return an object with:
    - task_id: Exact same number from input
    - title: exact task title from the input
    - type: one of ["school", "work", "personal", "other"]
    - date: "{today}"
    - completed: false
    - created_at: {current_timestamp_ms}
    - cognitive_load: integer 1-5
    - priority: integer 1-5
    """

    completion = client.chat.completions.create(
        model="arcee-ai/trinity-large-preview:free",
        messages=[{"role": "user", "content": prompt}],
        extra_headers={
            "HTTP-Referer": "http://localhost",
            "X-Title": "OpalLLMTesting",
        },
    )

    response_text = completion.choices[0].message.content.strip()

    def extract_json(text: str):
        # Remove markdown code fences if present
        text = re.sub(r"^```json\s*", "", text, flags=re.IGNORECASE)
        text = re.sub(r"^```\s*", "", text)
        text = re.sub(r"\s*```$", "", text)

        # Try direct parse first
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            pass

        # Fallback: extract the first JSON array found
        match = re.search(r"\[\s*{.*}\s*\]", text, re.DOTALL)
        if match:
            return json.loads(match.group(0))

        return json.loads(text)

    try:
        parsed_tasks = extract_json(response_text)
        print("\nParsed Task JSON:\n")
        print(json.dumps(parsed_tasks, indent=2))
    except Exception as e:
        print("\nModel did not return usable JSON:\n")
        print(response_text)
        print(f"\nError: {e}")