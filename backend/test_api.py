from google import genai

client = genai.Client(api_key="AIzaSyBGpg-2BPPiKXcVW1zhStNlJ1eIzTEAmAw")

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="Say hello in one word"
)
print("API WORKS:", response.text)