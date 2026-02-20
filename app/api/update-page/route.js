
import OpenAI, { toFile } from 'openai';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const maxDuration = 60;

export async function POST(req) {
    const startTime = Date.now();
    console.log('--- [Update Page] Request Started ---');

    try {
        const { scene, referenceImagePath } = await req.json();

        // 1. Text Generation for Single Scene
        const textStartTime = Date.now();
        const subject = scene.isSwapped ? scene.defaultObject : scene.defaultSubject;
        const object = scene.isSwapped ? scene.defaultSubject : scene.defaultObject;
        const verb = scene.selectedVerb;
        
        const prompt = `
        You are a creative fairy tale writer for children. 
        Write ONE scene based on the following inputs.
        
        **CRITICAL RULES:**
        1. **Language:** The 'text' field MUST be in **Korean** (Hangul).
        2. **Length:** The 'text' field MUST be EXACTLY ONE simple sentence.
        3. **Tone:** Use a gentle, polite fairy tale style ending in "~어요" (e.g., "강태공이 번개 채찍을 휘둘렀어요.").
        4. **Image Prompt:** The 'imagePrompt' field MUST be in **English** and very detailed for gpt.
        5. **Role Adherence:** You MUST strictly respect the assigned Subject and Object, even if it contradicts the traditional story or seems unusual.

        Input Scene:
        Subject: ${subject}
        Verb: ${verb}
        Object: ${object}
        Context: ${scene.title}
        
        Output Format (JSON):
        {
            "text": "Generated Korean sentence.",
            "imagePrompt": "Detailed English image description..."
        }
        Do not include markdown formatting like \`\`\`json. Just return the JSON object.
        `;

        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "You are a helpful assistant that outputs JSON." },
                { role: "user", content: prompt }
            ],
            model: "gpt-4o",
            response_format: { type: "json_object" },
        });

        console.log(`[Update Page] Text Generation: ${(Date.now() - textStartTime) / 1000}s`);

        const pageData = JSON.parse(completion.choices[0].message.content);

        // 2. Image Generation
        const imageStartTime = Date.now();
        let imageUrl = null;

        // 레퍼런스 이미지 경로가 있고 파일이 존재하면 images.edit 사용
        const absolutePath = referenceImagePath
            ? path.join(process.cwd(), 'public', referenceImagePath)
            : null;
        const hasReference = absolutePath && fs.existsSync(absolutePath);

        if (hasReference) {
            // 레퍼런스 있을 때: 스타일과 등장인물 2인 유지
            const imagePrompt = `
Use the reference image ONLY to extract: (1) the art style, color palette, brushwork, and texture, (2) the appearance of the 2 main characters — face, hair, clothing, proportions, and colors.
Do NOT copy the scene, background, or pose from the reference. Draw a completely NEW scene:
${pageData.imagePrompt}
Maintain identical character identity. Do NOT redesign the characters.
`;

            try {
                console.log(`[Update Page] Using reference: ${absolutePath}`);

                // toFile()로 스트림을 OpenAI File 객체로 변환
                const referenceFile = await toFile(
                    fs.createReadStream(absolutePath),
                    path.basename(absolutePath),
                    { type: 'image/png' }
                );

                // ✅ images.edit에 image 파라미터로 직접 전달 (file_id 아님)
                const response = await openai.images.edit({
                    model: "gpt-image-1.5",
                    prompt: imagePrompt,
                    image: referenceFile,
                    size: "1024x1024",
                    quality: "low",
                    output_format: "jpeg",
                });

                const image = response.data[0];
                if (image.b64_json) {
                    imageUrl = `data:image/jpeg;base64,${image.b64_json}`;
                } else if (image.url) {
                    imageUrl = image.url;
                }
                console.log(`[Update Page] images.edit succeeded with reference`);

            } catch (editError) {
                console.error(`[Update Page] images.edit failed, falling back:`, editError.message);
                // 실패 시 generate로 폴백
                imageUrl = await generateFallback(openai, pageData.imagePrompt);
            }

        } else {
            // 레퍼런스 없을 때: images.generate
            if (referenceImagePath && !hasReference) {
                console.warn(`[Update Page] Reference not found at: ${absolutePath}`);
            }
            imageUrl = await generateFallback(openai, pageData.imagePrompt);
        }

        console.log(`[Update Page] Image Generation: ${(Date.now() - imageStartTime) / 1000}s`);
        console.log(`[Update Page] Total Duration: ${(Date.now() - startTime) / 1000}s`);

        return NextResponse.json({ 
            page: {
                title: scene.title,
                text: pageData.text,
                image: imageUrl
            }
        });

    } catch (error) {
        console.error("Error updating scene:", error);
        return NextResponse.json({ error: "Failed to update scene" }, { status: 500 });
    }
}

// 레퍼런스 없을 때 기본 이미지 생성
async function generateFallback(openai, imagePromptText) {
    try {
        const fallbackPrompt = `Children's book illustration, ${imagePromptText}. Style: Soft, warm, whimsical, watercolor or digital art, consistent character design.`;
        const response = await openai.images.generate({
            model: "gpt-image-1",
            prompt: fallbackPrompt,
            size: "1024x1024",
            quality: "medium",
            output_format: "jpeg",
        });
        const image = response.data[0];
        if (image.b64_json) return `data:image/jpeg;base64,${image.b64_json}`;
        if (image.url) return image.url;
    } catch (err) {
        console.error(`[Update Page] generateFallback failed:`, err.message);
    }
    return null;
}
