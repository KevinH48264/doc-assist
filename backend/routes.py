import os
import requests
import openai
# import json

MAX_CHAT_SIZE = 4000

openai_api_key = os.getenv('OPENAI_API_KEY')

# for bulk openai message, no stream
def chat_openai(question="Tell me to ask you a prompt", website="", chat_history=[]):
    # define prompt
    prompt = question
    if website:
        prompt = "Given this information: " + website[:MAX_CHAT_SIZE - len(question)] + ", respond conversationally to this prompt: " + question

    # define message conversation for model
    if chat_history:
        messages = chat_history
    else:
        messages = [
            {"role": "system", "content": "You are a helpful assistant, a large language model trained by OpenAI. Answer as concisely as possible. If you're unsure of the answer, say 'Sorry, I don't know'"},
        ]
    messages.append({"role": "user", "content": prompt})

    # create the chat completion
    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages,
    )
    text_answer = completion["choices"][0]["message"]["content"]

    # updated conversation history
    messages.append({"role": "assistant", "content": text_answer})

    return text_answer, messages

def chat_openai_stream(question="Tell me to ask you a prompt", website="", chat_history=[]):
    print("chatting openai stream in routes!")

    if website:
        # prompt = "Given this information: " + website[:MAX_CHAT_SIZE - len(question)] + ", respond conversationally to this prompt: " + question
        prompt = "Given the following information, answer the following question regardless of whether it's related to this text or not: " +  website[:MAX_CHAT_SIZE - len(question)]
    # define message conversation for model
    
    
    if chat_history:
        messages = chat_history
    else:
        messages = [
            # {"role": "system", "content": "You are a helpful assistant, a large language model trained by OpenAI. Answer as concisely as possible. If you're unsure of the answer, say 'Sorry, I don't know'"},
            {"role": "system", "content": "You are a helpful assistant."}
        ]
    messages.append({"role": "user", "content": prompt})
    messages.append({"role": "user", "content": question})

    
    # create the chat completion
    reqURL = 'https://api.openai.com/v1/chat/completions'
    reqHeaders = {
        'Accept': 'text/event-stream',
        'Authorization': 'Bearer ' + openai_api_key
    }
    reqBody = {
        'model': 'gpt-3.5-turbo',
        'messages': messages,
        'stream': True,
        'temperature': 0.8,
        'max_tokens' : 2048,
    }

    # updated conversation history
    response = requests.post(reqURL, stream=True, headers=reqHeaders, json=reqBody)

    return response, messages

# for bulk openai message, no stream
def chat_openai_tailor_resume(question="Tell me to ask you a prompt", website="", chat_history=[]):
    if not question or not website:
        return

    print("TAILORING RESUME")
    # define prompt
    prompt = question
    if website:
        prompt = "Job description: " + website[:MAX_CHAT_SIZE - len(question)] + "\n Resume: " + question

    # define message conversation for model
    if chat_history:
        messages = chat_history
    else:
        messages = [
            {"role": "system", "content": "Given a candidate's resume and a specific job description, please tailor the resume in a way that highlights the most relevant skills, experience, and achievements to maximize the chances of being selected by a recruiter for the job, while maintaining honesty and accuracy. Ensure that the resulting tailored resume is concise and fits on a single page."},
        ]
    messages.append({"role": "user", "content": prompt})
    print("messages", messages)

    # create the chat completion
    reqURL = 'https://api.openai.com/v1/chat/completions'
    reqHeaders = {
        'Accept': 'text/event-stream',
        'Authorization': 'Bearer ' + openai_api_key
    }
    reqBody = {
        'model': 'gpt-3.5-turbo',
        'messages': messages,
        'stream': True,
        'temperature': 0.8,
        'max_tokens' : 2048,
    }

    # updated conversation history
    response = requests.post(reqURL, stream=True, headers=reqHeaders, json=reqBody)

    return response, messages

# FOR TESTING
# if __name__ == "main":
# resume = '''
# Microsoft, AI Platform				   							   Redmond, WA
# PRODUCT MANAGER INTERN								 May 2022 - August 2022
# Scope plan to 2x integrations and impact 500M active devices after customer discovery on 110 cross-functional teams
# Identified and resolve recent 80% product performance degradation with US and APAC engineers
# Presented 2 product performance analyses with PowerBI dashboards and prioritized improvements using market size
# Spearheaded 2 customer validation surveys across 3 social channels for intern-wide social impact hackathon
# '''

# job_description = '''
# # About the Team

# # Earlier in 2022, we introduced DALL-E 2, AI that creates images from text. In 2021 we launched  Copilot, powered by Codex, in partnership with GitHub – and developers love it. In 2020 we introduced GPT-3 which the MIT Technology Review listed as one of its 10 Breakthrough Technologies of the year (alongside mRNA vaccines).

# # Our product team is bringing OpenAI technologies to consumers and businesses around the world. We recently launched ChatGPT. Since then, millions of people have given us feedback and we’ve seen users find value across a range of use-cases, including drafting & editing content, brainstorming ideas, programming help, and learning new topics. This year, we’re hoping to evolve this offering into a product, starting with the launch of ChatGPT Plus. 

# # About the Role

# # As our Founding Data Scientist on the Applied Product team, you will establish the data-driven product development culture for consumer products at OpenAI. This is critical, as millions of users have discovered our first party offerings and we’re now looking to orient both research and product development around driving measurable impact for these users.

# # You should expect to define our north-star metrics, design our first A/B tests, and establish source-of-truth dashboards that the entire company can use to answer their own product questions. Most importantly, you should expect to be a core member of the product development team building our first party offerings. 

# # This role is based in our San Francisco HQ. We offer relocation assistance to new employees.

# # In this role, you will:

# # Embed with the product development team as a trusted partner, uncovering new ways to improve the product and drive growth
# # Define and interpret A/B tests that help answer critical questions about the impact of model and UX changes to our product 
# # Establish a data-driven product development culture by driving the definition, tracking, and operationalizing of feature-, product-, and company-level metrics
# # Develop and socialize dashboards, reports, and other ways of enabling the team and company to answer product data questions in a self-serve way
# # You might thrive in this role if you have: 

# # 5+ years experience in a quantitative role navigating highly ambiguous environments, ideally as a founding data scientist or product analyst at a hyper-growth product company or research org
# # Proposed, designed, and run rigorous experiments with clear insights and product recommendations utilizing SQL and Python
# # Defined, implemented, and operationalized new feature and product-level metrics from scratch
# # Excellent communication skills with demonstrated ability to communicate with product managers, engineers, and executives alike
# # Strategic insights beyond the paradigm of statistical significance testing
# # You could be an especially great fit if you have:

# # Demonstrated prior experience in NLP, large language models, or generative AI 
# # Strong programming background, with ability to run simulations and prototype variants
# # Experience validating quantitative insights with qualitative methods (e.g. surveys, UXR)
# # About OpenAI

# # OpenAI is an AI research and deployment company dedicated to ensuring that general-purpose artificial intelligence benefits all of humanity. We push the boundaries of the capabilities of AI systems and seek to safely deploy them to the world through our products. AI is an extremely powerful tool that must be created with safety and human needs at its core, and to achieve our mission, we must encompass and value the many different perspectives, voices, and experiences that form the full spectrum of humanity. 

# # At OpenAI, we believe artificial intelligence has the potential to help people solve immense global challenges, and we want the upside of AI to be widely shared. Join us in shaping the future of technology.

# # Compensation, Benefits and Perks

# # The annual salary range for this role is $245,000 – $370,000. Total compensation also includes generous equity and benefits.

# # Medical, dental, and vision insurance for you and your family
# # Mental health and wellness support
# # 401(k) plan with 4% matching
# # Unlimited time off and 18+ company holidays per year
# # Paid parental leave (20 weeks) and family-planning support
# # Annual learning & development stipend ($1,500 per year)
# # We are an equal opportunity employer and do not discriminate on the basis of race, religion, national origin, gender, sexual orientation, age, veteran status, disability or any other legally protected status. Pursuant to the San Francisco Fair Chance Ordinance, we will consider qualified applicants with arrest and conviction records. 

# # We are committed to providing reasonable accommodations to applicants with disabilities, and requests can be made via this link.

# # OpenAI US Applicant Privacy Policy
# # '''

# # client, messages = chat_openai_tailor_resume(resume, job_description)
# client, messages = chat_openai_stream(question = "Are you still here?", website="The most famous Egyptian pyramids are those found at Giza, on the outskirts of Cairo. Several of the Giza pyramids are counted among the largest structures ever built.[9] The Pyramid of Khufu is the largest Egyptian pyramid. It is the only one of the Seven Wonders of the Ancient World still in existence, despite its being the oldest wonder by about 2,000 years.[10]")

# for event in client:
#     if event.data != '[DONE]' and 'content' in json.loads(event.data)['choices'][0]["delta"]:
#         # print(event.data)
#         print(json.loads(event.data)['choices'][0]["delta"]["content"], end="", flush=True)
