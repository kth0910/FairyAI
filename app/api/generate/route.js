
import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const maxDuration = 60; // Allow longer timeout for image generation

export async function POST(req) {
    const startTime = Date.now();
    console.log('--- [Generate Story] Request Started ---');

    try {
        const { scenes } = await req.json();

        // 1. Text Generation
        const textStartTime = Date.now();
        const prompt = `
        You are a creative fairy tale writer for children. 
        Create a coherent, 5-part story based on the following scenes.
        
        **CRITICAL RULES:**
        1. **Language:** The 'text' field MUST be in **Korean** (Hangul).
        2. **Length:** The 'text' field MUST be EXACTLY ONE simple sentence.
        3. **Tone:** Use a gentle, polite fairy tale style ending in "~어요" (e.g., "강태공이 번개 채찍을 휘둘렀어요.").
        4. **Image Prompt:** The 'imagePrompt' field MUST be in **English** and very detailed for gpt.
        5. **Role Adherence:** You MUST strictly respect the assigned Subject and Object for each scene, even if it contradicts the traditional story or seems unusual (e.g., if the Subject is the Victim in the original story, they are now the Actor).

        Input Scenes:
        ${scenes.map((scene, index) => {
            const subject = scene.isSwapped ? scene.defaultObject : scene.defaultSubject;
            const object = scene.isSwapped ? scene.defaultSubject : scene.defaultObject;
            const verb = scene.selectedVerb;
            return `Scene ${index + 1} (${scene.type}): ${subject} (Subject) ${verb} (Verb) ${object} (Object). Context: ${scene.title}.`;
        }).join('\n')}
        
        Output Format (JSON):
        {
            "pages": [
                { "title": "Scene Title", "text": "강태공이 번개 채찍을 휘둘렀어요.", "imagePrompt": "Detailed image description for gpt..." },
                ... (5 pages total)
            ]
        }
        Do not include markdown formatting like \`\`\`json. Just return the JSON object.
        `;

        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: "You are a helpful assistant that outputs JSON." }, { role: "user", content: prompt }],
            model: "gpt-4o",
            response_format: { type: "json_object" },
        });

        console.log(`[Generate Story] Text Generation: ${(Date.now() - textStartTime) / 1000}s`);

        const storyData = JSON.parse(completion.choices[0].message.content);

        // 2. Image Generation (Parallel)
        const imageStartTime = Date.now();
        const imagePromises = storyData.pages.map(async (page, index) => {
            // Scene 1: Use fixed background and text
            if (index === 0) {
                return '/thumb1.png';
            }

            try {
                // Use the image prompt from the text generation, or fallback to scene description
                const imagePrompt = `Children's book illustration, ${page.imagePrompt}. Style: Soft, warm, whimsical, watercolor or digital art, consistent character design.`;
                
                const response = await openai.images.generate({
                    model: "gpt-image-1-mini",
                    // model: "dall-e-3",
                    prompt: imagePrompt,
                    n: 1,
                    size: "1024x1024",
                    quality: "low",
                    output_format: "jpeg",
                });

                const image = response.data[0];
                if (image.b64_json) {
                    return `data:image/jpeg;base64,${image.b64_json}`;
                } else if (image.url) {
                    return image.url;
                }
                return null;
            } catch (error) {
                console.error(`Image generation failed for scene ${index + 1}:`, error);
                return null; // Handle failure gracefully
            }
        });

        const imageUrls = await Promise.all(imagePromises);
        console.log(`[Generate Story] Image Generation: ${(Date.now() - imageStartTime) / 1000}s`);

        // Combine text and images
        const finalPages = storyData.pages.map((page, index) => ({
            ...page,
            text: index === 0 && scenes[0].originalText ? scenes[0].originalText : page.text,
            image: imageUrls[index]
        }));

        console.log(`[Generate Story] Total Duration: ${(Date.now() - startTime) / 1000}s`);
        return NextResponse.json({ pages: finalPages });

    } catch (error) {
        console.error("Error generating story:", error);
        return NextResponse.json({ error: "Failed to generate story" }, { status: 500 });
    }
}
