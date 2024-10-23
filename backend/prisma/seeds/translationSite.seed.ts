import { PrismaClient } from "@prisma/client";

export const InitTranslationSite = async (prismaClient: PrismaClient) => {
    await prismaClient.translationSite.createMany({
        data : [
            {
                name : "google",
                url : "https://translation.googleapis.com/language/translate/v2?key={#key}",
            },
            {
                name : "papago",
                url : "https://openapi.naver.com/v1/papago/n2mt",
            }, 
            {
                name : "gpt",
                url : "https://api.openai.com/v1/chat/completions",
            }
        ]
    })
}