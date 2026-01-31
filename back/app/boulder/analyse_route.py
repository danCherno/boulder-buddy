from groq import Groq
from django.conf import settings


def generate_route_tips(coords):
    client = Groq(api_key=settings.GROQ_API_KEY)
    holds_text = "\n".join(
        f"- Hold at x={hold[0]}, y={hold[1]}"
        for hold in coords
    )

    prompt = f"""
            You are a climbing coach analyzing a bouldering route.

            Here are the detected hold positions:

            {holds_text}

            Describe:
            - The style or type of route (guess from layout)
            - Tips for body positioning
            - How to start the route
            - Where the crux is likely located
            - Movement strategy (dynamic, static, etc.)
            - usefull climbing techniques

            when talking about holds, do not use coordinates, but number them by order of climbing
            Keep it short and helpful.
        """

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": "You are an expert climbing coach."},
            {"role": "user", "content": prompt},
        ],
        temperature=0.6,
    )

    print(response)
    return response.choices[0].message.content.strip()
