const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');
const {Type} = require("@google/genai")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

const interviewReportSchema = {
    type: Type.OBJECT,
    properties: {
        matchScore: {
            type: Type.NUMBER,
            description: "A score between 0 and 100 indicating how well the candidate's profile matches the job description",
        },
        technicalQuestions: {
            type: Type.ARRAY,
            description: "Technical questions that can be asked in the interview along with their intention and how to answer them",
            items: {
                type: Type.OBJECT,
                properties: {
                    question:  { type: Type.STRING, description: "The technical question that can be asked in the interview" },
                    intention: { type: Type.STRING, description: "The intention of the interviewer behind asking this question" },
                    answer:    { type: Type.STRING, description: "How to answer this question, what points to cover, what approach to take etc." },
                },
                required: ["question", "intention", "answer"],
            },
        },
        behavioralQuestions: {
            type: Type.ARRAY,
            description: "Behavioral questions that can be asked in the interview along with their intention and how to answer them",
            items: {
                type: Type.OBJECT,
                properties: {
                    question:  { type: Type.STRING, description: "The behavioral question that can be asked in the interview" },
                    intention: { type: Type.STRING, description: "The intention of the interviewer behind asking this question" },
                    answer:    { type: Type.STRING, description: "How to answer this question, what points to cover, what approach to take etc." },
                },
                required: ["question", "intention", "answer"],
            },
        },
        skillGaps: {
            type: Type.ARRAY,
            description: "List of skill gaps in the candidate's profile along with their severity",
            items: {
                type: Type.OBJECT,
                properties: {
                    skill:    { type: Type.STRING, description: "The skill which the candidate is lacking" },
                    severity: {
                        type: Type.STRING,
                        enum: ["low", "medium", "high"],
                        description: "The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances",
                    },
                },
                required: ["skill", "severity"],
            },
        },
        preparationPlan: {
            type: Type.ARRAY,
            description: "A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively",
            items: {
                type: Type.OBJECT,
                properties: {
                    day:   { type: Type.NUMBER, description: "The day number in the preparation plan, starting from 1" },
                    focus: { type: Type.STRING, description: "The main focus of this day, e.g. data structures, system design, mock interviews etc." },
                    tasks: {
                        type: Type.ARRAY,
                        description: "List of tasks to be done on this day",
                        items: { type: Type.STRING, description: "A specific task, e.g. read a book, solve problems, watch a video etc." },
                    },
                },
                required: ["day", "focus", "tasks"],
            },
        },
        title: {
            type: Type.STRING,
            description: "The title of the job for which the interview report is generated",
        },
    },
    required: ["matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan", "title"],
};


// const interviewReportSchema = z.object({
//     matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
//     technicalQuestions: z.array(z.object({
//         question: z.string().describe("The technical question can be asked in the interview"),
//         intention: z.string().describe("The intention of interviewer behind asking this question"),
//         answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
//     })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
//     behavioralQuestions: z.array(z.object({
//         question: z.string().describe("The technical question can be asked in the interview"),
//         intention: z.string().describe("The intention of interviewer behind asking this question"),
//         answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
//     })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
//     skillGaps: z.array(z.object({
//         skill: z.string().describe("The skill which the candidate is lacking"),
//         severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
//     })).describe("List of skill gaps in the candidate's profile along with their severity"),
//     preparationPlan: z.array(z.object({
//         day: z.number().describe("The day number in the preparation plan, starting from 1"),
//         focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
//         tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
//     })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
//     title: z.string().describe("The title of the job for which the interview report is generated"),
// })

// async function generateInterviewReport({ resume, selfDescription, jobDescription }) {


//     const prompt = `Generate an interview report for a candidate with the following details:
//                         Resume: ${resume}
//                         Self Description: ${selfDescription}
//                         Job Description: ${jobDescription}
// `

//     const response = await ai.models.generateContent({
//         model: "gemini-3-flash-preview",
//         contents: prompt,
//         config: {
//             responseMimeType: "application/json",
//             responseSchema: zodToJsonSchema(interviewReportSchema),
//         }
//     })
//     console.log(response.text)
//     return JSON.parse(response.text)


// }
async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const prompt = `Generate an interview report for a candidate with the following details:
Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}
`

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: interviewReportSchema,
        }
    })

    return JSON.parse(response.text)
}



// async function generatePdfFromHtml(htmlContent) {
//     const browser = await puppeteer.launch()
//     const page = await browser.newPage();
//     await page.setContent(htmlContent, { waitUntil: "networkidle0" })

//     const pdfBuffer = await page.pdf({
//         format: "A4", margin: {
//             top: "20mm",
//             bottom: "20mm",
//             left: "15mm",
//             right: "15mm"
//         }
//     })

//     await browser.close()

//     return pdfBuffer
// }

// async function generateResumePdf({ resume, selfDescription, jobDescription }) {

//     const resumePdfSchema = z.object({
//         html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
//     })

//     const prompt = `Generate resume for a candidate with the following details:
//                         Resume: ${resume}
//                         Self Description: ${selfDescription}
//                         Job Description: ${jobDescription}

//                         the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
//                         The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
//                         The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
//                         you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
//                         The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
//                         The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
//                     `

//     const response = await ai.models.generateContent({
//         model: "gemini-3-flash-preview",
//         contents: prompt,
//         config: {
//             responseMimeType: "application/json",
//             responseSchema: zodToJsonSchema(resumePdfSchema),
//         }
//     })


//     const jsonContent = JSON.parse(response.text)

//     const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

//     return pdfBuffer

// }

async function generatePdfFromHtml(htmlContent) {
    let launchOptions;

    if (process.env.PUPPETEER_EXECUTABLE_PATH) {
        launchOptions = {
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--single-process'],
            headless: true,
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH
        };
    } else if (process.env.NODE_ENV === 'production') {
        const chromium = require('@sparticuz/chromium');
        launchOptions = {
            args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
            defaultViewport: chromium.defaultViewport,
        };
    } else {
        // Local dev: point to your actual installed Chrome or environment path
        launchOptions = {
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            headless: true,
            executablePath: process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' 
        };
    }

    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();

    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        preferCSSPageSize: true,
        margin: { top: "0", bottom: "0", left: "0", right: "0" }
    });

    await browser.close();
    return pdfBuffer;
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const resumePdfSchema = z.object({
        html: z.string().describe("The complete HTML content of the resume, ready to be converted to PDF")
    });

    const prompt = `Generate a professional ATS-friendly resume in HTML format for the candidate below.

Resume Data: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}

STRICT HTML/CSS REQUIREMENTS — follow every rule exactly:

1. PAGE & MARGIN CONTROL
   - Include this in <style>:
     @page { margin: 14mm 14mm 12mm 14mm; size: A4; }
     * { margin: 0; padding: 0; box-sizing: border-box; }
     html, body { width: 100%; font-family: 'Arial', sans-serif; font-size: 10.5pt; color: #1a1a1a; background: white; }
   - DO NOT add any wrapper div with border, outline, box-shadow, or background color.
   - The body itself is the page — no card/container borders.

2. SPACING — keep it tight
   - Section headings: margin-top: 8px; margin-bottom: 3px
   - Between entries: margin-bottom: 5px
   - Bullet points: margin: 1px 0; padding-left: 14px
   - Line height: 1.35 for body text

3. TYPOGRAPHY
   - Candidate name: 18pt, bold, centered
   - Contact line: 9.5pt, centered, color #444
   - Section titles: 10.5pt, bold, uppercase, with a bottom border (1px solid #333), margin-bottom: 3px
   - Body text: 10.5pt
   - Dates/locations: right-aligned in the same row as title using flexbox justify-between

4. STRUCTURE — use standard ATS section names exactly:
   - Header: <h1> for name, <p> for contact
   - Section titles: use <h2> tags with these EXACT labels:
     "Summary", "Skills", "Projects", "Experience", "Education", "Certifications"
   - Job/project titles: <h3> tag
   - Dates: plain <span> on its own line BELOW the title, NOT flex side-by-side
   - Body: <p> or <ul><li> — never nested divs for content

5. ATS RULES
   - No flexbox or grid for content layout (only for the contact line is ok)
   - Skills MUST be comma-separated plain text inside a <p>, not pipe-separated
   - Each skill must be a separate word/phrase with comma delimiter: "React.js, Node.js, TypeScript"
   - No display:flex on job/project entries — dates go on their own line
   - All section headings must use <h2> tags (ATS parsers key off heading tags)
   - Use <strong> for company/project names, not custom CSS classes

6. LENGTH
   - Target: exactly 1 page when printed to A4 PDF
   - Be ruthless with brevity — cut filler, keep impact
   - If content risks overflowing, shorten bullet points, not sections

Return ONLY a JSON object: { "html": "...complete HTML string..." }
No markdown, no explanation, no backticks.`;

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview", // use your preferred model
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumePdfSchema),
        }
    });

    const jsonContent = JSON.parse(response.text);
    const pdfBuffer = await generatePdfFromHtml(jsonContent.html);
    return pdfBuffer;
}

module.exports = { generateInterviewReport, generateResumePdf }